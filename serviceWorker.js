const CACHE = 'main-cachev1.0.0';
const URLS_TO_CACHE = [
  '/',
  '/src/assets/css/base.css',
  '/src/assets/js/main-sw.js',
  '/src/assets/js/main-ww.js',
  '/src/assets/js/worker.js'
];

self.addEventListener('install', (event) => {

  event.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('All up in the cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  )
}, (err) => {
  console.log(`The Service Worker installation dun goofed: ${err}`)
})

self.addEventListener('fetch', (event) => {
  caches.match(event.request)
    .then(response => {
      // Found a match in the cache
      if (response) return response;

      // Use clone to make copy since event.request is a stream and using it once gets rid of it
      let eventRequest = event.request.clone();
      return fetch(eventRequest)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') return response;
          let responseToCache = response.clone();

          caches.open(CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache)
            });

          return response;
        })
    })
}).catch(err => {
  console.log(`Failed to fetch: ${err}`)
})

self.addEventListener('activate', (event) => {
  caches.keys()
    .then(cacheKeys => {
      let oldCaches = cacheKeys.filter(key => key !== CACHE);
      let deletePromises = oldCaches.map(oldKey => caches.delete(oldKey))
      return Promise.all(deletePromises)
    }).then(() => self.skipWaiting()) // Installs new Service Worker without waiting for all tabs to close
})
