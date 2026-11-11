// Appen uden net og med service workeren (sw.js): kommende månedshistorier, nye udgaver af filerne,
// forhåndsvisningen, testkataloget og en app, der vågner på en ny dato.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');

const rod = path.resolve(__dirname, '../..');
const SAGA = ['lantern', 'maane', 'vind', 'fest'];
const JUL = '2026-12-julestjernen-1';
const JUL_FIL = 'stories/2026-12-julestjernen-1/historie.js';
// Historierne på listen på en given dato efter det rigtige katalog (sagaen og de udgivne månedshistorier, nyeste først),
// så testene ikke skal rettes, hver gang der kommer nye kapitler.
const vm = require('node:vm');
function listen(dato) {
  const ctx = {}; ctx.self = ctx; ctx.window = ctx;
  vm.createContext(ctx);
  for (const fil of ['js/katalog.js', 'stories/katalog.js']) vm.runInContext(fs.readFileSync(path.join(rod, fil), 'utf8'), ctx, { filename: fil });
  return Array.from(ctx.LK.synlige(ctx.LK.katalogPoster, new Date(dato)), e => e.id); // en almindelig liste, ikke en fra vm-konteksten
}

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
});

function helt() {
  const stats = { Mod: 1, List: 1, Venlighed: 1, Fantasi: 1, Humor: 1, Nysgerrighed: 1 };
  return {
    id: 'h1', name: 'Kaj', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats, pts: 0, lastMonth: 999999, bonusMonth: -1, stories: 0, magic: 'gnist', magic2: ''
  };
}

// Ny kontekst med en gemt helt, fast terning og uret på `dato`. `sw` slår service workeren til.
async function nySide(dato, sw) {
  const context = await browser.newContext(sw ? {} : { serviceWorkers: 'block' });
  await context.addInitScript(lib => {
    try { localStorage.setItem('lk-heroes', lib); localStorage.setItem('lk-welcomed', '1'); } catch (e) {}
    Math.random = () => 0.99;
  }, JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }));
  await context.clock.setFixedTime(new Date(dato));
  const page = await context.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push(e.message));
  return { context, page, fejl };
}

async function historieIds(page) {
  await page.waitForSelector('input[name=story]');
  return page.$$eval('input[name=story]', l => l.map(i => i.value));
}

// Vent (højst et par sekunder), til service workerens gemte filer har `sti`.
async function iCachen(page, sti) {
  for (let i = 0; i < 50; i++) {
    if (await page.evaluate(s => caches.match(new URL(s, location.href).href).then(r => !!r), sti)) return true;
    await new Promise(r => setTimeout(r, 100));
  }
  return false;
}

// Slå nettet fra, tøm browserens almindelige cache (så kun service workerens filer kan bruges), og genindlæs.
async function udenNet(context, page) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await context.setOffline(true);
  await page.reload();
}

async function spilTilSlut(page) {
  for (let i = 0; i < 300; i++) {
    if (await page.$('.end')) return;
    if (await page.$('#roll')) {
      await page.click('#roll');
      await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
      await page.click('#roll');
      continue;
    }
    // Bevægelse er slået til (som fra starten); en bevægelse klares.
    if (await page.$('#klarede')) { await page.click('#klarede'); continue; }
    await page.locator('#choices .crow > .btn:not([disabled])').first().click();
  }
  throw new Error('Nåede ikke slutskærmen');
}

async function spilJulestjernen(page) {
  await page.check('input[name=story][value="' + JUL + '"]');
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.strictEqual((await page.textContent('#epi')).trim(), 'Ugens eventyr · Julestjernen · kapitel 1 af 4');
  await spilTilSlut(page);
  assert.ok(await page.isVisible('#stage .end'));
}

test('en kommende månedshistorie, som appen har hentet, åbner på udgivelsesdagen uden net', async () => {
  const { context, page, fejl } = await nySide('2026-11-01T12:00:00', true);
  await page.goto(server.base + 'index.html');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload(); // nu styrer service workeren siden
  assert.deepStrictEqual(await historieIds(page), SAGA);
  await iCachen(page, JUL_FIL);
  await context.clock.setFixedTime(new Date('2026-12-04T12:00:00'));
  await udenNet(context, page);
  assert.ok(listen('2026-12-04T12:00:00').includes(JUL));
  assert.deepStrictEqual(await historieIds(page), listen('2026-12-04T12:00:00'));
  await spilJulestjernen(page);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en familie, der først åbner appen efter udgivelsen, kan spille månedshistorien uden net', async () => {
  const { context, page, fejl } = await nySide('2026-12-05T12:00:00', true);
  await page.goto(server.base + 'index.html'); // første besøg: service workeren styrer ikke siden endnu
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  assert.ok(listen('2026-12-05T12:00:00').includes(JUL));
  assert.deepStrictEqual(await historieIds(page), listen('2026-12-05T12:00:00'));
  await iCachen(page, JUL_FIL);
  await udenNet(context, page);
  assert.deepStrictEqual(await historieIds(page), listen('2026-12-05T12:00:00'));
  await spilJulestjernen(page);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en ny udgave af en historie vises ved næste besøg, selvom service workeren har en gemt udgave', async () => {
  const mappe = fs.mkdtempSync(path.join(os.tmpdir(), 'lk-frisk-'));
  for (const f of ['index.html', 'sw.js', 'manifest.webmanifest', 'icons', 'js', 'art', 'stories']) fs.cpSync(path.join(rod, f), path.join(mappe, f), { recursive: true });
  const egen = await startServer(mappe);
  try {
    const { context, page, fejl } = await nySide('2026-11-25T12:00:00', true);
    const titel = () => page.textContent('label.comp:has(input[value="lantern"]) .nm');
    await page.goto(egen.base + 'index.html');
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await page.reload();
    await historieIds(page);
    assert.strictEqual(await titel(), 'Lanterneskoven');
    const fil = path.join(mappe, 'stories/lantern/historie.js');
    fs.writeFileSync(fil, fs.readFileSync(fil, 'utf8').replace("title: 'Lanterneskoven'", "title: 'Den nye Lanterneskov'"));
    // http.server sammenligner kun hele sekunder, så filen dateres lidt frem for at være tydeligt nyere.
    const senere = new Date(Date.now() + 5000);
    fs.utimesSync(fil, senere, senere);
    await page.reload();
    await historieIds(page);
    assert.strictEqual(await titel(), 'Den nye Lanterneskov');
    assert.deepStrictEqual(fejl, []);
    await context.close();
  } finally {
    egen.stop();
    fs.rmSync(mappe, { recursive: true, force: true });
  }
});

test('forhåndsvisningen registrerer ingen service worker', async () => {
  const { context, page, fejl } = await nySide('2026-11-25T12:00:00', true);
  await page.goto(server.base + 'index.html?preview=' + JUL);
  await page.waitForSelector('#stage h2');
  await page.waitForLoadState('load');
  await new Promise(r => setTimeout(r, 500));
  assert.strictEqual(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then(l => l.length)), 0);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('?katalog= virker kun på testmaskinen, ikke fra en rigtig adresse', async () => {
  const { context, page, fejl } = await nySide('2026-11-01T12:00:00', false);
  await context.route('http://lanterne.test/**', r => {
    const sti = path.join(rod, decodeURIComponent(new URL(r.request().url()).pathname));
    if (!sti.startsWith(rod + path.sep) || !fs.existsSync(sti)) return r.fulfill({ status: 404, body: 'findes ikke' });
    const type = sti.endsWith('.js') ? 'text/javascript' : sti.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    return r.fulfill({ status: 200, contentType: type, body: fs.readFileSync(sti) });
  });
  await page.goto('http://lanterne.test/index.html?katalog=tests/fixtures/stories-maaned/katalog.js');
  assert.deepStrictEqual(await historieIds(page), SAGA);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en app, der vågner på en ny dato, viser den nye månedshistorie', async () => {
  const { context, page, fejl } = await nySide('2026-12-03T23:58:00', false);
  await page.goto(server.base + 'index.html');
  assert.ok(!listen('2026-12-03T23:58:00').includes(JUL));
  assert.deepStrictEqual(await historieIds(page), listen('2026-12-03T23:58:00'));
  await context.clock.setFixedTime(new Date('2026-12-04T07:30:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForSelector('input[name=story][value="' + JUL + '"]');
  assert.deepStrictEqual(await historieIds(page), listen('2026-12-04T07:30:00'));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en ny dato midt i en historie afbryder ikke historien', async () => {
  const { context, page, fejl } = await nySide('2026-12-03T23:58:00', false);
  await page.goto(server.base + 'index.html');
  await historieIds(page);
  await page.check('input[name=story][value="lantern"]');
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  const foer = await page.textContent('#stage h2');
  await context.clock.setFixedTime(new Date('2026-12-04T07:30:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(() => window.LK && LK.katalogPoster && document.querySelectorAll('script[src$="julestjernen-1/historie.js"]').length > 0);
  await new Promise(r => setTimeout(r, 300));
  assert.strictEqual(await page.textContent('#stage h2'), foer);
  assert.strictEqual(await page.$('input[name=story]'), null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
