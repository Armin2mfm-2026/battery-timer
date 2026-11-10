/* VoltGuard Pro service worker.
 * The app registers this worker relative to its configured deployment base.
 * Push delivery still requires a VAPID subscription flow and a server sender.
 */
const CACHE_NAME = 'voltguard-pro-runtime-v1';

const arePushNotificationsEnabled = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('VoltGuardProDB', 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains('appState')) {
      request.result.createObjectStore('appState', { keyPath: 'id' });
    }
  };
  request.onerror = () => reject(request.error || new Error('Could not read notification preferences.'));
  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains('appState')) {
      db.close();
      resolve(false);
      return;
    }
    const transaction = db.transaction('appState', 'readonly');
    const snapshotRequest = transaction.objectStore('appState').get('main');
    snapshotRequest.onsuccess = () => {
      const enabled = snapshotRequest.result?.data?.settings?.pushNotifications === true;
      db.close();
      resolve(enabled);
    };
    snapshotRequest.onerror = () => {
      db.close();
      reject(snapshotRequest.error || new Error('Could not read notification preferences.'));
    };
  };
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('voltguard-pro-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Runtime cache for same-origin app assets; network-first keeps deployed updates fresh.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const appShellUrl = new URL('./', self.registration.scope);
        const appShell = await cache.match(appShellUrl) ||
          await cache.match(new URL('index.html', appShellUrl));
        if (appShell) return appShell;
      }
      return new Response('VoltGuard Pro is offline and this resource is not cached yet.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    try {
      if (!await arePushNotificationsEnabled()) return;
    } catch (error) {
      console.error('Push notification preference could not be read:', error);
      return;
    }

    let payload = {};
    try { payload = event.data ? event.data.json() : {}; }
    catch (error) { payload = { body: event.data ? event.data.text() : 'A VoltGuard alert is available.' }; }

    const title = payload.title || 'VoltGuard Pro';
    const options = {
      body: payload.body || 'Your charging timer has completed.',
      icon: payload.icon || new URL('icons/icon-192.png', self.registration.scope).href,
      badge: payload.badge || new URL('icons/icon-192.png', self.registration.scope).href,
      tag: payload.tag || 'voltguard-push-alert',
      renotify: Boolean(payload.renotify),
      data: { url: payload.url ? new URL(payload.url, self.registration.scope).href : self.registration.scope },
      vibrate: [200, 100, 200]
    };
    await self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '', self.registration.scope).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if (client.url === targetUrl && 'focus' in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
  })());
});