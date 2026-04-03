// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — Service Worker
// Strategia: Cache First dla assetów, Network First dla HTML
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'kinetic-engine-v1';

// Pliki do cache'owania przy instalacji
const PRECACHE_URLS = [
  '/kinetic-engine/',
  '/kinetic-engine/index.html',
  '/kinetic-engine/manifest.json',
  '/kinetic-engine/style.css',,
  '/kinetic-engine/js/data.js',
  '/kinetic-engine/js/utils.js',
  '/kinetic-engine/js/guide.js',
  '/kinetic-engine/js/training.js',
  '/kinetic-engine/js/cardio.js',
  '/kinetic-engine/js/body.js',
  '/kinetic-engine/js/dashboard.js',
  '/kinetic-engine/js/ui.js',
  '/kinetic-engine/js/app.js',
  // Zewnętrzne fonty i biblioteki — cache przy pierwszym użyciu
];

// ── Install ────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate — usuń stare cache ────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch — strategia Cache First dla assetów ─────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Pomijamy zapytania nie-GET i cross-origin (np. Google Fonts, CDN)
  if (request.method !== 'GET') return;

  // Dla zewnętrznych zasobów (CDN, Fonts) — Stale While Revalidate
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request)
          .then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached); // jeśli sieć niedostępna, użyj cache
        return cached || networkFetch;
      })
    );
    return;
  }

  // Dla lokalnych assetów — Cache First
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback do index.html dla nawigacji
        if (request.mode === 'navigate') {
          return caches.match('/kinetic-engine/index.html');
        }
      });
    })
  );
});

// ── Push Notifications (placeholder na przyszłość) ─────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Kinetic Engine', {
    body: data.body || '',
    icon: '/kinetic-engine/icon-192.png',,
    badge: '/kinetic-engine/icon-192.png',,
    tag: data.tag || 'kinetic',
    data: { url: data.url || '/kinetic-engine/' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
