// PubOS Push Service Worker (deployed to site origin)
const PUSH_API = 'https://push.pubos.ai';

self.addEventListener('push', function(event) {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: data.url, campaign_id: data.campaign_id },
    requireInteraction: false,
    tag: 'pubos-push-' + (data.campaign_id || Date.now()),
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const data = event.notification.data;
  if (data.campaign_id) {
    fetch(PUSH_API + '/callback/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign_id: data.campaign_id }),
    }).catch(() => {});
  }
  if (data.url) {
    event.waitUntil(clients.openWindow(data.url));
  }
});

self.addEventListener('notificationclose', function(event) {
  const data = event.notification.data;
  if (data.campaign_id) {
    fetch(PUSH_API + '/callback/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign_id: data.campaign_id }),
    }).catch(() => {});
  }
});
