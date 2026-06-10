self.addEventListener('push', function(event) {
    let data = { title: 'Kamera', body: 'Signal vom Server', image: '' };
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

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const imageUrl = event.notification.data.kameraBildUrl;
    // Öffnet die App und übergibt das Bild
    const urlToOpen = './?imageUrl=' + encodeURIComponent(imageUrl);
    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});