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
