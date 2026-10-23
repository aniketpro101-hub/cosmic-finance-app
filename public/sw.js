/**
 * Cosmic Finance — Service Worker
 * PWA Offline Cache, Background Sync & Native Push Notification Engine
 */

const CACHE_NAME = 'cosmic-finance-v1.2';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/css/tokens.css',
  '/css/base.css',
  '/css/components.css',
  '/css/orbit.css',
  '/js/pwa-install.js',
  '/images/dr_ashish_patni_executive.png'
];

// Install Event: Precache Core Assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll skipped optional assets:', err);
      });
    })
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for dynamic routes, cache-first for static fonts/images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass for non-GET or API endpoints
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api') || url.pathname.startsWith('/portal-cosmic-admin')) {
    return;
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Push Notification Event: Receive & Display Native Alerts
self.addEventListener('push', (event) => {
  let data = {
    title: '🌟 Cosmic Finance Market Alert',
    body: 'Planetary alignments and celestial market movements updated.',
    url: '/weekly-outlook',
    category: 'general'
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: '/images/dr_ashish_patni_executive.png',
    badge: '/images/dr_ashish_patni_executive.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open_url', title: 'Open Analysis 🪐' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// Notification Click Event: Navigate to destination
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
