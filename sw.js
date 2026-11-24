const CACHE_NAME = 'p3r-dashboard-v2-icons';
const APP_FILES = [
  './', './index.html', './detail.html', './manifest.webmanifest',
  './css/style.css', './icons/ui.svg', './js/app.js', './js/detail.js', './js/pwa.js',
  './icons/p3r-app.svg', './icons/p3r-app-192.png', './icons/p3r-app-512.png', './icons/apple-touch-icon.png',
  './personas/thoth.html', './personas/jackfrost.html', './personas/setanta.html',
  './personas/sati.html', './personas/sarasvati.html', './personas/yamatanoorochi.html',
  './personas/mothman.html', './personas/power.html', './personas/palerider.html',
  './personas/mithras.html', './personas/kushimitama.html',
  './targets/barong.html', './targets/byakko.html', './targets/rangda.html',
  './targets/blackfrost.html', './targets/odin.html', './targets/siegfried.html',
  './targets/surt.html', './targets/parvati.html', './targets/cybele.html'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('p3r-dashboard-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const path = new URL(request.url).pathname;
        if (path.endsWith('/detail.html')) return cache.match(new URL('./detail.html', self.registration.scope).href);
        return cache.match('./index.html');
      }
      return Response.error();
    }
  })());
});