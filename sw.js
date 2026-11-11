// Lanterneskoven: gør spillet til en app, der også virker uden internet.
// Hæv versionen, når index.html, js/, art/ eller en historie ændres, så gamle filer ryddes op.
const VERSION = 'lk-v14';
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
  // cache: 'reload' henter filerne fra nettet, så addAll ikke tager gamle kopier fra browserens almindelige cache.
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
  // cache: 'no-cache' spørger altid serveren, så en kopi i browserens almindelige cache (GitHub Pages må gemme i
  // 10 minutter) aldrig giver en gammel side sammen med de nye scripts nedenfor.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Egne scripts (motoren i js/, billeddelene, kataloget og historierne): prøv nettet først, så en ny index.html
  // aldrig blandes med gamle scripts, og en rettet historie vises med det samme. Uden net: den gemte udgave.
  if (url.origin === location.origin && url.pathname.endsWith('.js')) {
    e.respondWith(
      fetch(new Request(req, { cache: 'no-cache' }))
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Skrifttyper, ikoner og andre egne filer: gemte først, ellers hent og gem.
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

// Siden sender katalogets filer (LK.offlineFiler i index.html), også de kommende månedshistorier, så de kan åbnes
// uden net, også på deres udgivelsesdag. Kun egne .js-filer, og kun dem, der ikke allerede er gemt.
self.addEventListener('message', e => {
  const filer = e.data && Array.isArray(e.data.gem) ? e.data.gem : [];
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(filer.map(u => {
    let url;
    try { url = new URL(u, location.href); } catch (x) { return null; }
    if (url.origin !== location.origin || !url.pathname.endsWith('.js')) return null;
    return c.match(url.href).then(hit => hit || fetch(new Request(url.href, { cache: 'no-cache' }))
      .then(res => { if (res.ok) return c.put(url.href, res); })
      .catch(() => {}));
  }))));
});
