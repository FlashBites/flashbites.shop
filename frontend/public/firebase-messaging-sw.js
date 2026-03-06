// Firebase Cloud Messaging Service Worker
// This handles background push notifications when the app is not in focus
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDarvJay2_Bk1TOeDe0IWbNveOGlfZWYB0",
  authDomain: "flashbites-shop.firebaseapp.com",
  projectId: "flashbites-shop",
  storageBucket: "flashbites-shop.firebasestorage.app",
  messagingSenderId: "815364103694",
  appId: "1:815364103694:web:f6431fa301d5676ab1e65f"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const { title, body, icon, badge, tag } = payload.notification || {};
  const data = payload.data || {};

  const notificationTitle = title || 'FlashBites';
  const notificationOptions = {
    body: body || 'You have a new notification',
    icon: icon || '/logo.png',
    badge: badge || '/favicon-32.png',
    tag: tag || data.tag || 'flashbites-notification',
    data: data,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: data.actionUrl ? [
      { action: 'open', title: 'View', icon: '/logo.png' }
    ] : [],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  event.notification.close();

  const urlToOpen = event.notification.data?.actionUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
