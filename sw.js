// Loop Trainer Service Worker — enables full offline use
var CACHE_NAME = 'loop-trainer-v10';
var URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Install: cache app files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', function(e) {
  // Only handle same-origin navigation/resource requests, not blob: URLs
  if (e.request.url.startsWith('blob:')) return;
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request);
    })
  );
});
