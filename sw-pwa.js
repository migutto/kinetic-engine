const SW_VERSION = 'v1.0.1';
const APP_SHELL_CACHE = `ke-app-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `ke-runtime-${SW_VERSION}`;
const OFFLINE_FALLBACK_PATH = 'offline.html';

const SCOPE_URL = new URL(self.registration.scope);
const APP_ORIGIN = SCOPE_URL.origin;
const APP_SCOPE_PATH = SCOPE_URL.pathname;

function appUrl(path = '') {
  return new URL(path, SCOPE_URL).toString();
}

const APP_SHELL_PATHS = [
  '',
  'index.html',
  OFFLINE_FALLBACK_PATH,
  'manifest.webmanifest',
  'style.css',
  'icon-192.png',
  'icon-512.png',
  'js/data.js',
  'js/utils.js',
  'js/guide.js',
  'js/training.js',
  'js/cardio.js',
  'js/body.js',
  'js/dashboard.js',
  'js/ui.js',
  'js/pwa.js',
  'js/app.js',
];

const APP_SHELL_URLS = APP_SHELL_PATHS.map(appUrl);
const STATIC_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'manifest']);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL_CACHE);

    await Promise.all(
      APP_SHELL_URLS.map(async url => {
        try {
          await cache.add(url);
        } catch (error) {
          console.warn('[KE SW] Failed to precache:', url, error);
        }
      })
    );
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames
        .filter(name => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(name))
        .map(name => caches.delete(name))
    );

    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }

    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!/^https?:$/.test(url.protocol)) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event));
    return;
  }

  if (isAppAssetRequest(request, url)) {
    event.respondWith(handleAppAssetRequest(request));
    return;
  }

  event.respondWith(handleRuntimeRequest(request));
});

self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title || 'Kinetic Engine', {
      body: data.body || '',
      icon: appUrl('icon-192.png'),
      badge: appUrl('icon-192.png'),
      tag: data.tag || 'kinetic',
      data: {
        url: data.url ? new URL(data.url, SCOPE_URL).toString() : appUrl(''),
      },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil((async () => {
    const targetUrl = event.notification.data?.url || appUrl('');
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    const existingClient = clientList.find(client =>
      client.url === targetUrl || client.url.startsWith(targetUrl)
    );

    if (existingClient && 'focus' in existingClient) {
      return existingClient.focus();
    }

    if (clients.openWindow) {
      return clients.openWindow(targetUrl);
    }
  })());
});

function isAppAssetRequest(request, url) {
  return url.origin === APP_ORIGIN
    && url.pathname.startsWith(APP_SCOPE_PATH)
    && STATIC_DESTINATIONS.has(request.destination);
}

async function handleNavigationRequest(event) {
  const preloadResponse = await event.preloadResponse;
  if (preloadResponse) {
    void cacheResponse(RUNTIME_CACHE, event.request, preloadResponse.clone());
    return preloadResponse;
  }

  try {
    const response = await fetch(event.request);
    await cacheResponse(RUNTIME_CACHE, event.request, response.clone());
    return response;
  } catch (error) {
    return (await caches.match(event.request))
      || (await caches.match(appUrl('index.html')))
      || (await caches.match(appUrl(OFFLINE_FALLBACK_PATH)))
      || Response.error();
  }
}

async function handleAppAssetRequest(request) {
  const cached = await caches.match(request);
  if (cached) {
    void refreshAsset(request);
    return cached;
  }

  try {
    const response = await fetch(request);
    await cacheResponse(APP_SHELL_CACHE, request, response.clone());
    return response;
  } catch (error) {
    return cached || Response.error();
  }
}

async function handleRuntimeRequest(request) {
  const cached = await caches.match(request);
  const networkResponse = fetch(request)
    .then(response => cacheResponse(RUNTIME_CACHE, request, response.clone()))
    .catch(() => null);

  if (cached) {
    void networkResponse;
    return cached;
  }

  return (await networkResponse) || Response.error();
}

async function refreshAsset(request) {
  try {
    const response = await fetch(request);
    await cacheResponse(APP_SHELL_CACHE, request, response.clone());
  } catch (error) {
    console.warn('[KE SW] Asset refresh skipped:', request.url, error);
  }
}

async function cacheResponse(cacheName, request, response) {
  if (!response || (!response.ok && response.type !== 'opaque')) {
    return response;
  }

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}
