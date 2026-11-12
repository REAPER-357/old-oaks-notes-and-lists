self.addEventListener('fetch', (e) => {
  // For HTML / navigation requests, try network first so updates show up immediately
  if (e.request.mode === 'navigate' || e.request.headers.get('accept').includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          return caches.open('old-oaks-v1').then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // For images/manifest, use cache first
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })
    );
  }
});
