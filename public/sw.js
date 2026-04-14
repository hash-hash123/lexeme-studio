/* Lexeme Studio service worker — network-first for HTML, cache-first for static assets. */
const CACHE_VERSION = 'lexeme-studio-v1'
const OFFLINE_URL = '/lexeme-studio/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll([
        '/lexeme-studio/',
        '/lexeme-studio/index.html',
        '/lexeme-studio/manifest.webmanifest',
        '/lexeme-studio/favicon.svg',
      ]),
    ),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle same-origin GET requests. Supabase and other 3rd-party
  // traffic passes through untouched.
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigation requests: network-first, falling back to cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => {
          const cached = await caches.match(request)
          return cached ?? caches.match(OFFLINE_URL)
        }),
    )
    return
  }

  // Static assets (JS/CSS/images): cache-first, populate on miss.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
        }
        return response
      })
    }),
  )
})
