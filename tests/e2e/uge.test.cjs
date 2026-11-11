// Ugens eventyr: en serie i kapitler, et pr. fredag. Testkataloget tests/fixtures/stories-uge/katalog.js har
// sagaen og serien 'Stjernestien' med kapitlerne sti1, sti2 og sti3 fredag den 11., 18. og 25. december 2099.
// Uret stilles i hver test, så kapitlerne udkommer, når testen vil.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');

const KATALOG = 'katalog=tests/fixtures/stories-uge/katalog.js';
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

// Ny side med gemte data og fast ur (lokal tid). Skrivninger til localStorage efter opsætningen tælles i window.__skrevet.
async function nySide(gem, tid) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.clock.setFixedTime(new Date(tid));
  await context.addInitScript((g) => {
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
    Math.random = () => 0.99;
  }, gem);
  const page = await context.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push(e.message));
  return { context, page, fejl };
}

const standard = () => ({ 'lk-heroes': JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }), 'lk-welcomed': '1' });

// Tryk på det første valg, der kan trykkes på, slå terningen eller klar bevægelsen, til slutskærmen.
async function spilTilSlut(page) {
  for (let i = 0; i < 300; i++) {
    if (await page.$('.end')) return;
    if (await page.$('#roll')) {
      await page.click('#roll');
      await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
      await page.click('#roll');
      continue;
    }
    if (await page.$('#klarede')) { await page.click('#klarede'); continue; }
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
const epi = async (page) => (await page.textContent('#epi')).trim();
const stageTekst = async (page) => (await page.textContent('#stage')).replace(/\s+/g, ' ');

test('et kapitel er skjult torsdag kl. 23:59 og står øverst på listen fredag kl. 00:00', async () => {
  let s = await nySide(standard(), '2099-12-17T23:59:00');
  await s.page.goto(server.base + 'index.html?' + KATALOG);
  assert.deepStrictEqual(await historieIds(s.page), SAGA.concat('sti1'));
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
  s = await nySide(standard(), '2099-12-18T00:00:00');
  await s.page.goto(server.base + 'index.html?' + KATALOG);
  assert.deepStrictEqual(await historieIds(s.page), SAGA.concat('sti2', 'sti1'));
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
});

test('kapitel 1 viser serie og kapitel, og slutskærmen siger, hvornår næste kapitel kommer', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-12T10:00:00');
  await page.goto(server.base + 'index.html?' + KATALOG);
  await historieIds(page);
  await vaelgOgStart(page, 'sti1');
  assert.strictEqual(await epi(page), 'Ugens eventyr · Stjernestien · kapitel 1 af 3');
  await spilTilSlut(page);
  assert.match(await stageTekst(page), /Næste kapitel kommer fredag den 18\. december\./);
  const b = await knapper(page);
  assert.ok(!b.some(t => /Spil næste kapitel/.test(t)), b.join(' / '));
  assert.ok(b.includes('Tilbage til historierne'), b.join(' / '));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('er næste kapitel udgivet, starter "Spil næste kapitel" det med samme hold', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-18T10:00:00');
  await page.goto(server.base + 'index.html?' + KATALOG);
  await historieIds(page);
  await vaelgOgStart(page, 'sti1');
  await spilTilSlut(page);
  assert.doesNotMatch(await stageTekst(page), /Næste kapitel kommer/);
  const b = await knapper(page);
  assert.ok(b.includes('Spil næste kapitel'), b.join(' / '));
  assert.ok(b.includes('Tilbage til historierne'), b.join(' / '));
  await page.click('#nextchapter');
  assert.strictEqual(await epi(page), 'Ugens eventyr · Stjernestien · kapitel 2 af 3');
  assert.strictEqual((await page.textContent('#stage h2')).trim(), 'Stien 2 begynder');
  assert.match(await page.textContent('#stage .turn'), /Kaj/);
  const lib = JSON.parse(await page.evaluate(() => localStorage.getItem('lk-heroes')));
  assert.strictEqual(lib.world.done_sti1, true);
  await spilTilSlut(page);
  assert.match(await stageTekst(page), /Næste kapitel kommer fredag den 25\. december\./);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('sidste kapitel siger, at der kommer en ny serie næste måned', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-26T10:00:00');
  await page.goto(server.base + 'index.html?' + KATALOG);
  assert.deepStrictEqual(await historieIds(page), SAGA.concat('sti3', 'sti2', 'sti1'));
  await vaelgOgStart(page, 'sti3');
  assert.strictEqual(await epi(page), 'Ugens eventyr · Stjernestien · kapitel 3 af 3');
  await spilTilSlut(page);
  assert.match(await stageTekst(page), /Næste måned kommer en ny serie\./);
  assert.doesNotMatch(await stageTekst(page), /Næste kapitel kommer/);
  const b = await knapper(page);
  assert.ok(!b.some(t => /Spil næste kapitel/.test(t)), b.join(' / '));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('?preview=<kapitel 3> før dets fredag åbner kapitlet og skriver intet', async () => {
  const gem = standard();
  const { context, page, fejl } = await nySide(gem, '2099-12-12T10:00:00');
  await page.goto(server.base + 'index.html?preview=sti3&' + KATALOG);
  await page.waitForSelector('#stage h2');
  assert.strictEqual((await page.textContent('#stage h2')).trim(), 'Stien 3 begynder');
  assert.strictEqual(await epi(page), 'Ugens eventyr · Stjernestien · kapitel 3 af 3');
  assert.strictEqual(await page.isVisible('#pvtag'), true);
  await spilTilSlut(page);
  assert.match(await stageTekst(page), /Næste måned kommer en ny serie\./);
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en månedshistorie uden serie viser stadig "Månedens eventyr · <måned år>"', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?katalog=tests/fixtures/stories-maaned/katalog.js');
  await historieIds(page);
  await vaelgOgStart(page, 'efteraar');
  assert.strictEqual(await epi(page), 'Månedens eventyr · oktober 2026');
  await spilTilSlut(page);
  const t = await stageTekst(page);
  assert.doesNotMatch(t, /Næste kapitel|ny serie/);
  assert.ok((await knapper(page)).includes('Tilbage til historierne'));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
