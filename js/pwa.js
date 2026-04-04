const PWA_INSTALL_DISMISS_KEY = 'ke_pwa_install_banner_dismissed_at';
const PWA_INSTALL_REMIND_AFTER_MS = 1000 * 60 * 60 * 24 * 3;
const LEGACY_SW_FILENAMES = new Set(['sw.js']);
const LEGACY_CACHE_PREFIXES = ['kinetic-engine-v'];

const pwaState = {
  bannerMode: null,
  deferredInstallPrompt: null,
  registration: null,
  waitingWorker: null,
  reloadingAfterUpdate: false,
};

function initPWA() {
  bindPWAControls();
  bindPWAEvents();
  requestPersistentStorage();
  maybeShowPWASurface();

  if ('serviceWorker' in navigator) {
    void bootPWA();
  }
}

async function bootPWA() {
  await cleanupLegacyPWAArtifacts();
  await registerPWAServiceWorker();
}

function bindPWAControls() {
  document.getElementById('pwa-action-btn')?.addEventListener('click', handlePWAActionButton);
  document.getElementById('pwa-banner-primary')?.addEventListener('click', handlePWABannerPrimary);
  document.getElementById('pwa-banner-secondary')?.addEventListener('click', handlePWABannerSecondary);
}

function bindPWAEvents() {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pwaState.deferredInstallPrompt = event;
    updatePWAActionButton();
    maybeShowPWASurface();
  });

  window.addEventListener('appinstalled', () => {
    pwaState.deferredInstallPrompt = null;
    clearInstallDismissal();
    hidePWABanner();
    updatePWAActionButton();
    showToast('Aplikacja została dodana do urządzenia.', 'download_done', 'var(--t)');
  });

  window.addEventListener('online', () => {
    showToast('Polaczenie wrocilo. Sprawdzam nowa wersje aplikacji.', 'wifi', 'var(--t)');
    pwaState.registration?.update().catch(() => {});
  });

  window.addEventListener('offline', () => {
    showToast('Jestes offline. Aplikacja nadal dziala z zapisanych danych.', 'cloud_off', 'var(--s)');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (pwaState.reloadingAfterUpdate) return;
      pwaState.reloadingAfterUpdate = true;
      window.location.reload();
    });
  }
}

async function registerPWAServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('sw-pwa.js');
    pwaState.registration = registration;

    console.log('[KE] PWA SW:', registration.scope);

    watchForWaitingWorker(registration);
    setupUpdateChecks(registration);

    if (registration.waiting) {
      handleWaitingWorker(registration.waiting);
    }
  } catch (error) {
    console.warn('[KE] PWA SW error:', error);
  }
}

async function cleanupLegacyPWAArtifacts() {
  await Promise.all([
    cleanupLegacyServiceWorkers(),
    cleanupLegacyCaches(),
  ]);
}

async function cleanupLegacyServiceWorkers() {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const legacyRegistrations = registrations.filter(isLegacyServiceWorkerRegistration);

    await Promise.all(
      legacyRegistrations.map(registration => registration.unregister())
    );
  } catch (error) {
    console.warn('[KE] Legacy SW cleanup skipped:', error);
  }
}

function isLegacyServiceWorkerRegistration(registration) {
  const scriptUrl = registration.active?.scriptURL
    || registration.waiting?.scriptURL
    || registration.installing?.scriptURL
    || '';

  if (!scriptUrl) return false;

  try {
    const url = new URL(scriptUrl, window.location.href);
    return LEGACY_SW_FILENAMES.has(url.pathname.split('/').pop());
  } catch (error) {
    return false;
  }
}

async function cleanupLegacyCaches() {
  if (!('caches' in window)) return;

  try {
    const cacheNames = await caches.keys();
    const legacyCacheNames = cacheNames.filter(name =>
      LEGACY_CACHE_PREFIXES.some(prefix => name.startsWith(prefix))
    );

    await Promise.all(
      legacyCacheNames.map(cacheName => caches.delete(cacheName))
    );
  } catch (error) {
    console.warn('[KE] Legacy cache cleanup skipped:', error);
  }
}

function watchForWaitingWorker(registration) {
  registration.addEventListener('updatefound', () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
        handleWaitingWorker(registration.waiting || installingWorker);
      }
    });
  });
}

function setupUpdateChecks(registration) {
  const triggerUpdateCheck = () => registration.update().catch(() => {});

  window.addEventListener('focus', triggerUpdateCheck);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      triggerUpdateCheck();
    }
  });

  window.setInterval(triggerUpdateCheck, 30 * 60 * 1000);
}

function handleWaitingWorker(worker) {
  pwaState.waitingWorker = worker;
  updatePWAActionButton();
  showPWABanner({
    mode: 'update',
    icon: 'system_update_alt',
    title: 'Nowa wersja jest gotowa',
    text: 'Zaktualizuj aplikację, aby przełączyć się na najnowszy cache offline i poprawki PWA.',
    primaryLabel: 'Aktualizuj',
    secondaryLabel: 'Pozniej',
  });
}

async function handlePWABannerPrimary() {
  if (pwaState.bannerMode === 'update') {
    applyPWAUpdate();
    return;
  }

  if (pwaState.bannerMode === 'install') {
    await promptPWAInstall();
    return;
  }

  rememberInstallDismissal();
  hidePWABanner();
}

function handlePWABannerSecondary() {
  if (pwaState.bannerMode !== 'update') {
    rememberInstallDismissal();
  }

  hidePWABanner();
}

async function handlePWAActionButton() {
  if (pwaState.waitingWorker) {
    showPWABanner({
      mode: 'update',
      icon: 'system_update_alt',
      title: 'Nowa wersja jest gotowa',
      text: 'Po aktualizacji aplikacja odświeży się i przełączy na najnowszy zestaw plików offline.',
      primaryLabel: 'Aktualizuj',
      secondaryLabel: 'Pozniej',
    });
    return;
  }

  if (pwaState.deferredInstallPrompt) {
    await promptPWAInstall();
    return;
  }

  if (shouldShowIOSInstallHint()) {
    showPWABanner({
      mode: 'install-ios',
      icon: 'ios_share',
      title: 'Dodaj aplikację do ekranu głównego',
      text: 'Na iPhonie lub iPadzie wybierz Udostepnij, a potem Do ekranu poczatkowego.',
      primaryLabel: 'Rozumiem',
      secondaryLabel: 'Pozniej',
    });
  }
}

async function promptPWAInstall() {
  const installPrompt = pwaState.deferredInstallPrompt;
  if (!installPrompt) return;

  hidePWABanner();

  try {
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    pwaState.deferredInstallPrompt = null;
    updatePWAActionButton();

    if (choice?.outcome === 'accepted') {
      clearInstallDismissal();
      showToast('Uruchomiono instalację aplikacji.', 'download', 'var(--p)');
    } else {
      rememberInstallDismissal();
    }
  } catch (error) {
    console.warn('[KE] Install prompt failed:', error);
  }
}

function applyPWAUpdate() {
  const waitingWorker = pwaState.waitingWorker || pwaState.registration?.waiting;
  if (!waitingWorker) return;

  hidePWABanner();
  showToast('Instaluje nowa wersje aplikacji...', 'system_update_alt', 'var(--t)');
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
}

function maybeShowPWASurface(force = false) {
  updatePWAActionButton();

  if (pwaState.waitingWorker) return;
  if (isStandaloneMode()) return;
  if (!force && !canShowInstallReminder()) return;

  if (pwaState.deferredInstallPrompt) {
    showPWABanner({
      mode: 'install',
      icon: 'download',
      title: 'Zainstaluj aplikację',
      text: 'Dodaj Kinetic Engine do ekranu głównego i korzystaj szybciej także offline.',
      primaryLabel: 'Zainstaluj',
      secondaryLabel: 'Nie teraz',
    });
    return;
  }

  if (shouldShowIOSInstallHint()) {
    showPWABanner({
      mode: 'install-ios',
      icon: 'ios_share',
      title: 'Dodaj aplikację do ekranu głównego',
      text: 'Na iPhonie lub iPadzie wybierz Udostepnij, a potem Do ekranu poczatkowego.',
      primaryLabel: 'Rozumiem',
      secondaryLabel: 'Pozniej',
    });
  }
}

function showPWABanner({ mode, icon, title, text, primaryLabel, secondaryLabel }) {
  const banner = document.getElementById('pwa-banner');
  if (!banner) return;

  banner.dataset.mode = mode;
  banner.hidden = false;

  const iconNode = document.getElementById('pwa-banner-icon');
  const titleNode = document.getElementById('pwa-banner-title');
  const textNode = document.getElementById('pwa-banner-text');
  const primaryButton = document.getElementById('pwa-banner-primary');
  const secondaryButton = document.getElementById('pwa-banner-secondary');

  if (iconNode) iconNode.textContent = icon;
  if (titleNode) titleNode.textContent = title;
  if (textNode) textNode.textContent = text;
  if (primaryButton) primaryButton.textContent = primaryLabel;
  if (secondaryButton) secondaryButton.textContent = secondaryLabel || 'Nie teraz';

  pwaState.bannerMode = mode;

  window.requestAnimationFrame(() => {
    banner.classList.add('open');
  });
}

function hidePWABanner() {
  const banner = document.getElementById('pwa-banner');
  if (!banner) return;

  banner.classList.remove('open');
  pwaState.bannerMode = null;

  window.setTimeout(() => {
    if (!banner.classList.contains('open')) {
      banner.hidden = true;
    }
  }, 220);
}

function updatePWAActionButton() {
  const button = document.getElementById('pwa-action-btn');
  const icon = document.getElementById('pwa-action-icon');
  if (!button || !icon) return;

  let mode = '';
  let title = '';
  let iconName = '';

  if (pwaState.waitingWorker) {
    mode = 'update';
    title = 'Zaktualizuj aplikację';
    iconName = 'system_update_alt';
  } else if (pwaState.deferredInstallPrompt && !isStandaloneMode()) {
    mode = 'install';
    title = 'Zainstaluj aplikację';
    iconName = 'download';
  } else if (shouldShowIOSInstallHint()) {
    mode = 'install-ios';
    title = 'Jak dodać aplikację do ekranu głównego';
    iconName = 'ios_share';
  }

  if (!mode) {
    button.hidden = true;
    button.dataset.mode = '';
    return;
  }

  button.hidden = false;
  button.dataset.mode = mode;
  button.title = title;
  icon.textContent = iconName;
}

async function requestPersistentStorage() {
  if (!navigator.storage?.persist || !navigator.storage?.persisted) return;

  try {
    const alreadyPersisted = await navigator.storage.persisted();
    if (!alreadyPersisted) {
      await navigator.storage.persist();
    }
  } catch (error) {
    console.warn('[KE] Storage persistence unavailable:', error);
  }
}

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function shouldShowIOSInstallHint() {
  const userAgent = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';
  const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isIOSDevice && !isStandaloneMode();
}

function canShowInstallReminder() {
  const dismissedAt = Number(localStorage.getItem(PWA_INSTALL_DISMISS_KEY) || 0);
  return !dismissedAt || (Date.now() - dismissedAt) > PWA_INSTALL_REMIND_AFTER_MS;
}

function rememberInstallDismissal() {
  localStorage.setItem(PWA_INSTALL_DISMISS_KEY, String(Date.now()));
  updatePWAActionButton();
}

function clearInstallDismissal() {
  localStorage.removeItem(PWA_INSTALL_DISMISS_KEY);
}
