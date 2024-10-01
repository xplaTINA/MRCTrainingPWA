/*
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('messaging-pwa-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/
self.addEventListener("push", function (event) {
    const message = event.data.json();
    self.registration.showNotification(message.title, { body: message.text });
  });