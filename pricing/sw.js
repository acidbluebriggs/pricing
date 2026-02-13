const CACHE_NAME = 'acidblue-pricing-v1';
const urlsToCache = [
  '/pricing/',
  '/pricing/index.html',
  '/pricing/css/style.css',
  '/pricing/js/app.js',
  '/pricing/img/mini_logo.png',
  '/pricing/img/beer_keg.png',
  '/pricing/img/can.png',
  '/pricing/img/wine.png',
  '/pricing/img/cask.png',
  '/pricing/icon.png',
  '/pricing/favicon.ico',
  '/pricing/icon.svg',
  '/pricing/apple-icon.png',
  '/pricing/manifest.json'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (!response) {
          console.warn('Cache miss for:', event.request.url);
        }
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'validateCache') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        const cachedUrls = keys.map(req => req.url);
        const missing = urlsToCache.filter(url =>
          !cachedUrls.some(cached => cached.includes(url.replace('/pricing', '')))
        );
        event.ports[0].postMessage({ missing, cached: cachedUrls.length });
      });
    });
  }
});
