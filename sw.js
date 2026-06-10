self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    try {
        // Das vom PC gesendete JSON-Paket entpacken
        const appPayload = event.data.json();
        
        // Suche das aktive, geöffnete App-Fenster auf dem iPhone
        event.waitUntil(
            self.clients.matchAll({ type: 'window' }).then(allClients => {
                for (const client of allClients) {
                    // Schiebe den Code direkt ins Frontend rüber
                    client.postMessage(appPayload);
                }
            })
        );
    } catch (err) {
        console.log("Fehler bei stummer Datenweiterleitung im Hintergrund.");
    }
});

// Verhindert, dass alte Instanzen den neuen Code blockieren
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
