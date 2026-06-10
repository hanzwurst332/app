const CACHE_NAME = 'kamera-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Blitzschnelles Laden: Dateien lokal auf dem iPhone cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Cache beim Start direkt abfragen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 2. Push-Nachrichten empfangen
self.addEventListener('push', function(event) {
    let data = { title: 'Haustür', body: 'Es hat geklingelt!', image: 'https://picsum.photos/600/400' };
    
    if (event.data) {
        try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
    }

    const options = {
        body: data.body,
        icon: 'https://via.placeholder.com/192',
        badge: 'https://via.placeholder.com/192',
        vibrate: [200, 100, 200],
        data: { kameraBildUrl: data.image }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 3. Klick auf Notification verarbeiten
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const imageUrl = event.notification.data.kameraBildUrl;
    
    // GitHub Pages nutzt Unterordner, daher hängen wir den Parameter flexibel an
    const urlToOpen = './?imageUrl=' + encodeURIComponent(imageUrl);

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});