// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — Service Worker
// Strategia: Cache First dla assetów, Network First dla HTML
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'kinetic-engine-v2';
const SCOPE_URL = new URL(self.registration.scope);
const APP_ORIGIN = SCOPE_URL.origin;

function appUrl(path = '') {
  return new URL(path, SCOPE_URL).toString();
}

const APP_PRECACHE_URLS = [
  '',
  'index.html',
  'manifest.json',
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
  'js/app.js',
].map(appUrl);

async function putIfCacheable(cache, request, response) {
  if (!response) return response;

  if (response.ok || response.type === 'opaque') {
    await cache.put(request, response.clone());
  }

  return response;
}

// Pliki do cache'owania przy instalacji
const PRECACHE_URLS = [
  '/kinetic-engine/',
  '/kinetic-engine/index.html',
  '/kinetic-engine/manifest.json',
  '/kinetic-engine/style.css',
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
self.addEventListener('legacy-install-disabled', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate — usuń stare cache ────────────────────────────────
self.addEventListener('legacy-activate-disabled', event => {
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
self.addEventListener('legacy-fetch-disabled', event => {
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
self.addEventListener('legacy-push-disabled', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Kinetic Engine', {
    body: data.body || '',
    icon: '/kinetic-engine/icon-192.png',
    badge: '/kinetic-engine/icon-192.png',
    tag: data.tag || 'kinetic',
    data: { url: data.url || '/kinetic-engine/' }
  });
});

self.addEventListener('legacy-notificationclick-disabled', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (!/^https?:$/.test(url.protocol)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(request);
        return await putIfCacheable(cache, request, response);
      } catch {
        return (await cache.match(request)) || (await cache.match(appUrl('index.html')));
      }
    })());
    return;
  }

  if (url.origin !== APP_ORIGIN) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      try {
        const response = await fetch(request);
        return await putIfCacheable(cache, request, response);
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) return cached;

    try {
      const response = await fetch(request);
      return await putIfCacheable(cache, request, response);
    } catch {
      if (request.destination === 'document') {
        return (await cache.match(appUrl('index.html'))) || Response.error();
      }

      return Response.error();
    }
  })());
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
