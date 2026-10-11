const CACHE_NAME = 'kilastugas-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API Requests: Network-first
  if (url.pathname.startsWith('/api') || url.hostname.includes('api-kilastugas')) {
    if (event.request.method === 'GET') {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const resClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone))
            }
            return response
          })
          .catch(() => {
            return caches.match(event.request)
          })
      )
    }
    return
  }

  // App Shell & Static assets: Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})

// ── Web Push Notification & Alarm Handler (RFC 8291/8292) ──
self.addEventListener('push', (event) => {
  let data = {
    title: 'Sesi Fokus Selesai! 🎉',
    body: 'Waktu fokus 25 menit tuntas. Istirahat sejenak 5 menit.',
  }
  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/logo-192.png',
    badge: '/favicon-64.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'kilastugas-timer',
    renotify: true,
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'Buka KilasTugas' },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

