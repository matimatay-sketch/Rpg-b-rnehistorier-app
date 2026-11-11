// Månedshistorier og forhåndsvisning (?preview=<id>) i en rigtig browser, med testkataloget
// tests/fixtures/stories-maaned/katalog.js: sagaen, 'efteraar' (udgivet) og 'juletraeet' (udkommer i 2099).
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');

const KATALOG = 'katalog=tests/fixtures/stories-maaned/katalog.js';
const SAGA = ['lantern', 'maane', 'vind', 'fest'];

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
});

function helt(over) {
  const stats = { Mod: 1, List: 1, Venlighed: 1, Fantasi: 1, Humor: 1, Nysgerrighed: 1 };
  return Object.assign({
    id: 'h1', name: 'Kaj', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats, pts: 0, lastMonth: 999999, bonusMonth: -1, stories: 0, magic: 'gnist', magic2: ''
  }, over);
}

// Ny side med gemte data. `gem` er nøgle -> værdi i localStorage. Efter opsætningen tælles alle
// skrivninger til localStorage i window.__skrevet, så en test kan se, om appen selv har skrevet noget.
async function nySide(gem, rnd) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(([g, r]) => {
    try {
      localStorage.clear();
      Object.keys(g).forEach(k => localStorage.setItem(k, g[k]));
    } catch (e) {}
    window.__skrevet = [];
    const P = Storage.prototype;
    ['setItem', 'removeItem', 'clear'].forEach(n => {
      const f = P[n];
      P[n] = function () { window.__skrevet.push(n + ' ' + [...arguments].join(' ')); return f.apply(this, arguments); };
    });
    if (r !== null) Math.random = () => r;
  }, [gem, rnd]);
  const page = await context.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push(e.message));
  return { context, page, fejl };
}

const bibliotek = (world, over) => JSON.stringify({ heroes: [helt(over)], play: { h1: true }, world });
const standard = (world) => ({ 'lk-heroes': bibliotek(world || {}), 'lk-welcomed': '1' });

async function alleGemte(page) {
  return page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
}

// Tryk på det første valg, der kan trykkes på, og slå terningen, til slutskærmen.
async function spilTilSlut(page) {
  for (let i = 0; i < 300; i++) {
    if (await page.$('.end')) return;
    if (await page.$('#roll')) {
      await page.click('#roll');
      await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
      await page.click('#roll');
      continue;
    }
    await page.locator('#choices .crow > .btn:not([disabled])').first().click();
  }
  throw new Error('Nåede ikke slutskærmen');
}

async function historieIds(page) {
  await page.waitForSelector('input[name=story]');
  return page.$$eval('input[name=story]', l => l.map(i => i.value));
}

async function vaelgOgStart(page, id) {
  await page.check('input[name=story][value="' + id + '"]');
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
}

const knapper = (page) => page.$$eval('#stage .choices button', l => l.map(b => b.textContent.trim()));

test('en månedshistorie fra fremtiden vises ikke; den udgivne står efter sagaen', async () => {
  const { context, page, fejl } = await nySide(standard(), null);
  await page.goto(server.base + 'index.html?' + KATALOG);
  assert.deepStrictEqual(await historieIds(page), SAGA.concat('efteraar'));
  assert.strictEqual(await page.isVisible('#pvtag'), false);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('med ?preview=<id> åbner en kommende månedshistorie direkte og gemmer intet', async () => {
  const gem = { 'lk-heroes': bibliotek({ done_lantern: true }), 'lk-prefs': JSON.stringify({ auto: false, big: false }) };
  const { context, page, fejl } = await nySide(gem, 0.99);
  await page.goto(server.base + 'index.html?preview=juletraeet&' + KATALOG);
  await page.waitForSelector('#stage h2');
  assert.strictEqual((await page.textContent('#stage h2')).trim(), 'Et lille træ');
  assert.strictEqual((await page.textContent('#epi')).trim(), 'Månedens eventyr · december 2099');
  assert.strictEqual(await page.isVisible('#pvtag'), true);
  assert.strictEqual((await page.textContent('#pvtag')).trim(), 'Forhåndsvisning');
  assert.match(await page.textContent('#stage .turn'), /Asta/);
  // Større tekst gemmes normalt i lk-prefs; i forhåndsvisningen må det ikke ske.
  await page.click('#big');
  await spilTilSlut(page);
  assert.strictEqual((await page.textContent('#stage h2')).trim(), 'Glædelig jul');
  const navne = await page.$$eval('#stage .heroes figcaption', l => l.map(f => f.textContent));
  assert.deepStrictEqual(navne, ['Asta', 'Bo']);
  const b = await knapper(page);
  assert.ok(b.includes('Tilbage til historierne'), b.join(' / '));
  assert.ok(!b.some(t => /Spil næste del/.test(t)), b.join(' / '));
  // Tilbage til listen: eksempelholdet er valgt, og den kommende historie står på listen.
  await page.click('#back');
  assert.deepStrictEqual(await historieIds(page), SAGA.concat('juletraeet', 'efteraar'));
  assert.deepStrictEqual(await alleGemte(page), gem);
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('eksempelholdet i forhåndsvisningen er Asta og Bo med 2 i hvert træk og Bastian Bjørn', async () => {
  const { context, page, fejl } = await nySide({}, null);
  await page.goto(server.base + 'index.html?preview=efteraar&' + KATALOG);
  await page.waitForSelector('#stage h2');
  assert.strictEqual((await page.textContent('#stage h2')).trim(), 'Bladene falder');
  await spilTilSlut(page);
  assert.match(await page.textContent('#stage .stats'), /Følgesvend: Bastian Bjørn/);
  await page.click('#team');
  await page.waitForSelector('.hcard');
  const pips = await page.$$eval('.hcard', l => l.map(c => [c.querySelector('.hn').textContent, c.querySelector('input').checked, [...c.querySelectorAll('.srow')].map(r => r.querySelectorAll('.pip.on').length)]));
  assert.deepStrictEqual(pips, [['Asta', true, [2, 2, 2, 2, 2, 2]], ['Bo', true, [2, 2, 2, 2, 2, 2]]]);
  assert.strictEqual(await page.isChecked('input[name=comp][value="bjorn"]'), true);
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(await alleGemte(page), {});
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en gennemspillet månedshistorie gemmer kun done_<id> i skoven og tæller heltenes historier op', async () => {
  const world = { done_lantern: true, done_maane: true };
  const { context, page, fejl } = await nySide(standard(world), 0.99);
  await page.goto(server.base + 'index.html?' + KATALOG);
  await historieIds(page);
  await vaelgOgStart(page, 'efteraar');
  assert.strictEqual((await page.textContent('#epi')).trim(), 'Månedens eventyr · oktober 2026');
  assert.strictEqual(await page.isVisible('#pvtag'), false);
  await spilTilSlut(page);
  const b = await knapper(page);
  assert.ok(b.includes('Tilbage til historierne'), b.join(' / '));
  assert.ok(!b.some(t => /Spil næste del/.test(t)), b.join(' / '));
  const lib = JSON.parse(await page.evaluate(() => localStorage.getItem('lk-heroes')));
  assert.deepStrictEqual(lib.world, Object.assign({}, world, { done_efteraar: true }));
  assert.strictEqual(lib.heroes[0].stories, 1);
  await page.click('#back');
  assert.match(await page.textContent('label.comp:has(input[value="efteraar"])'), /Gennemført/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('sagaens sidste del peger ikke videre til en månedshistorie, og tæller kun sagaens dele', async () => {
  const { context, page, fejl } = await nySide(standard(), 0.99);
  await page.goto(server.base + 'index.html?' + KATALOG);
  await historieIds(page);
  await vaelgOgStart(page, 'fest');
  assert.strictEqual((await page.textContent('#epi')).trim(), 'Del 4 af 4');
  await spilTilSlut(page);
  const b = await knapper(page);
  assert.ok(!b.some(t => /Spil næste del/.test(t)), b.join(' / '));
  assert.ok(!b.includes('Tilbage til historierne'), b.join(' / '));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

for (const felt of ['magi', 'mester']) {
  test('en historie, hvis ' + felt + ' rammer en scene i en anden historie, springes over', async () => {
    const { context, page, fejl } = await nySide(standard(), null);
    const logget = [];
    page.on('console', m => { if (m.type() === 'error') logget.push(m.text()); });
    const vaerdi = felt === 'magi' ? "{ bro: { gnist: { l: 'Snyd', to: 'ef_a' } } }" : "{ bro: [{ stat: 'Mod', l: 'Snyd', to: 'ef_a' }] }";
    await page.route('**/stories-maaned/efteraar/historie.js', r => r.fulfill({
      status: 200, contentType: 'text/javascript',
      body: "LK.addStory(function (k) { return { id: 'efteraar', title: 'Snyd', tag: 'x', blurb: 'x', start: 'ef_a', scenes: { ef_a: { title: 'A', text: ['a'], ask: 'a?', end: true } }, " + felt + ': ' + vaerdi + ' }; });'
    }));
    await page.goto(server.base + 'index.html?' + KATALOG);
    assert.deepStrictEqual(await historieIds(page), SAGA);
    assert.ok(logget.some(t => /bro/.test(t)), logget.join('\n'));
    assert.deepStrictEqual(fejl, []);
    await context.close();
  });
}

test('uden nogen historier giver Start en venlig besked i stedet for en fejl', async () => {
  const { context, page, fejl } = await nySide(standard(), null);
  await page.route('**/historie.js', r => r.fulfill({ status: 404, body: 'findes ikke' }));
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#go');
  assert.strictEqual(await page.$$eval('input[name=story]', l => l.length), 0);
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.strictEqual(await page.isVisible('#err'), true);
  assert.match(await page.textContent('#err'), /historier/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('er alle dele spillet, og mangler første del, er den første historie på listen valgt', async () => {
  const world = { done_lantern: true, done_maane: true, done_vind: true, done_fest: true };
  const { context, page, fejl } = await nySide(standard(world), null);
  // Uret står før den første månedshistorie (december 2026), så listen kun har sagaens dele.
  await context.clock.setFixedTime(new Date('2026-11-15T12:00:00'));
  await page.route('**/stories/lantern/historie.js', r => r.fulfill({ status: 404, body: 'findes ikke' }));
  await page.goto(server.base + 'index.html');
  assert.deepStrictEqual(await historieIds(page), ['maane', 'vind', 'fest']);
  assert.strictEqual(await page.isChecked('input[name=story][value="maane"]'), true);
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.strictEqual((await page.textContent('#epi')).trim(), 'Del 1 af 3');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
