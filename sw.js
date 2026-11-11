// Lanterneskoven: gør spillet til en app, der også virker uden internet.
// Hæv versionen, når index.html, js/, art/ eller en historie ændres, så gamle filer ryddes op.
const VERSION = 'lk-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  // Motorens små scripts (js/) og billeddelene (art/).
  './js/katalog.js',
  './js/data.js',
  './js/kit.js',
  './art/dele.js',
  // Historierne, så de også kan spilles uden internet.
  './stories/katalog.js',
  './stories/lantern/historie.js',
  './stories/maane/historie.js',
  './stories/vind/historie.js',
  './stories/fest/historie.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Selve siden: prøv nettet først (så nye historier kommer med), ellers den gemte udgave.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Kataloget over historier: prøv nettet først (så nye historier kommer med), ellers den gemte udgave.
  if (url.origin === location.origin && url.pathname.endsWith('/stories/katalog.js')) {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Skrifttyper og egne filer: gemte først, ellers hent og gem.
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin === location.origin || isFont) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
