// Forside, indstillinger og tilbage-knap (docs/superpowers/specs/2026-11-11-forside-og-navigation-design.md).
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');

const UGE = 'katalog=tests/fixtures/stories-uge/katalog.js';
const MAANED = 'katalog=tests/fixtures/stories-maaned/katalog.js';
const HOP = '#choices .crow > .btn:has-text("Hop i bladene")';
const SPOERG = 'Vil I stoppe historien her? I kan altid starte forfra.';
const NULSTIL_SPOERG = 'Er I sikre? Skovens venner glemmer jer.';

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
});

function helt(over) {
  return Object.assign({
    id: 'h1', name: 'Kaj', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats: { Mod: 1, List: 1, Venlighed: 1, Fantasi: 1, Humor: 1, Nysgerrighed: 1 }, pts: 0, lastMonth: 999999, bonusMonth: -1, stories: 0, magic: 'gnist', magic2: ''
  }, over);
}
const bibliotek = (world) => JSON.stringify({ heroes: [helt()], play: { h1: true }, world: world || {} });
const standard = (world, ekstra) => Object.assign({ 'lk-heroes': bibliotek(world), 'lk-welcomed': '1' }, ekstra || {});

// Ny side med gemte data (lagt ind ved første indlæsning) og (valgfrit) uret på `dato`. Alle skrivninger til localStorage tælles i window.__skrevet,
// og en confirm()/alert() fra appen tælles i `dialoger`.
async function nySide(gem, dato, rnd) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(([g, r]) => {
    // Kun ved første indlæsning, så en genindlæsning viser det, appen selv har gemt.
    try {
      if (!sessionStorage.getItem('__seedet')) {
        sessionStorage.setItem('__seedet', '1');
        localStorage.clear();
        Object.keys(g).forEach(k => localStorage.setItem(k, g[k]));
      }
    } catch (e) {}
    window.__skrevet = [];
    const P = Storage.prototype;
    ['setItem', 'removeItem', 'clear'].forEach(n => {
      const f = P[n];
      P[n] = function () { window.__skrevet.push(n + ' ' + [...arguments].join(' ')); return f.apply(this, arguments); };
    });
    Math.random = () => r;
  }, [gem, rnd == null ? 0.99 : rnd]);
  if (dato) await context.clock.setFixedTime(new Date(dato));
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const fejl = [], dialoger = [];
  page.on('pageerror', e => fejl.push(e.message));
  page.on('dialog', d => { dialoger.push(d.message()); d.dismiss(); });
  return { context, page, fejl, dialoger };
}

const tekst = async (page, sel) => (await page.textContent(sel)).replace(/\s+/g, ' ').trim();
const gemt = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
const prefs = async (page) => JSON.parse(await gemt(page, 'lk-prefs'));

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

// Fra forsiden: vælg historien på listen, vælg Rikke Ræv og start.
async function startFraForsiden(page, id) {
  await page.click('#stage .hist[data-story="' + id + '"]');
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  await page.waitForSelector('#stage .scene-art');
}

/* ---------- Forsiden ---------- */

test('appen åbner på forsiden med navnet, tandhjulet og ugens nyeste kapitel', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-18T10:00:00');
  await page.goto(server.base + 'index.html?' + UGE);
  await page.waitForSelector('#ugens');
  assert.strictEqual(await page.isVisible('.bar .brand'), true);
  assert.strictEqual(await tekst(page, '.bar .brand'), 'Lanterneskoven');
  assert.strictEqual(await page.getAttribute('#indst', 'aria-label'), 'Indstillinger');
  assert.strictEqual(await page.isVisible('#indst'), true);
  assert.strictEqual(await page.isVisible('#forside'), false);
  assert.strictEqual(await page.$('input[name=story]'), null);
  const kort = await tekst(page, '#stage .ugens');
  assert.match(kort, /Stjernestien/);
  assert.match(kort, /Kapitel 2 af 3/);
  assert.match(kort, /Stjernestien 2/);
  assert.match(kort, /Kapitel 2 af testserien\./);
  assert.ok(await page.$('#stage .ugens figure.scene-art svg[role="img"]'), 'billedet fra kapitlets første scene');
  assert.strictEqual(await tekst(page, '#ugens'), 'Start kapitlet');
  assert.match(await tekst(page, '#stage'), /Ugens eventyr/);
  assert.match(await tekst(page, '#stage'), /Alle historier/);
  assert.match(await tekst(page, '#stage'), /Jeres helte/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Start kapitlet" fører til opsætningen med kapitlet valgt, og "Start eventyret" starter det', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-18T10:00:00');
  await page.goto(server.base + 'index.html?' + UGE);
  await page.click('#ugens');
  await page.waitForSelector('#go');
  assert.strictEqual(await page.isChecked('input[name=story][value="sti2"]'), true);
  assert.strictEqual(await page.isVisible('#forside'), true);
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Stien 2 begynder');
  assert.strictEqual(await tekst(page, '#epi'), 'Ugens eventyr · Stjernestien · kapitel 2 af 3');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('uden et udgivet kapitel viser kortet sagaens første del, familien ikke har gennemført, med "Start historien"', async () => {
  const { context, page, fejl } = await nySide(standard({ done_lantern: true }), '2026-11-01T12:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#ugens');
  const kort = await tekst(page, '#stage .ugens');
  assert.match(kort, /Månen der gemte sig/);
  assert.match(kort, /Del 2 af 4/);
  assert.strictEqual(await tekst(page, '#ugens'), 'Start historien');
  await page.click('#ugens');
  await page.waitForSelector('#go');
  assert.strictEqual(await page.isChecked('input[name=story][value="maane"]'), true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Alle historier" viser serierne nyeste først med kapitlerne i rækkefølge og derefter sagaen', async () => {
  const { context, page, fejl } = await nySide(standard({ done_lantern: true, 'done_2026-11-pjuske-2': true }), '2026-12-05T12:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#stage .hist');
  assert.deepStrictEqual(await page.$$eval('#stage .hist', l => l.map(b => b.getAttribute('data-story'))), [
    '2026-12-julestjernen-1', '2026-11-pjuske-1', '2026-11-pjuske-2', '2026-11-pjuske-3', '2026-11-pjuske-4', 'lantern', 'maane', 'vind', 'fest'
  ]);
  assert.match(await tekst(page, '#stage .hist[data-story="2026-11-pjuske-3"]'), /Kapitel 3 af 4/);
  assert.match(await tekst(page, '#stage .hist[data-story="vind"]'), /Del 3 af 4/);
  assert.match(await tekst(page, '#stage .hist[data-story="lantern"]'), /Gennemført/);
  assert.match(await tekst(page, '#stage .hist[data-story="2026-11-pjuske-2"]'), /Gennemført/);
  assert.doesNotMatch(await tekst(page, '#stage .hist[data-story="maane"]'), /Gennemført/);
  assert.match(await tekst(page, '#stage .liste'), /Pjuskes efterårsliste/);
  assert.match(await tekst(page, '#stage .liste'), /Julestjernen/);
  // Ugens eventyr er det nyeste kapitel: Julestjernen, kapitel 1.
  assert.match(await tekst(page, '#stage .ugens'), /Kælkebakken/);
  await page.click('#stage .hist[data-story="vind"]');
  await page.waitForSelector('#go');
  assert.strictEqual(await page.isChecked('input[name=story][value="vind"]'), true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en månedshistorie uden serie står også på listen', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await page.waitForSelector('#stage .hist');
  const ids = await page.$$eval('#stage .hist', l => l.map(b => b.getAttribute('data-story')));
  assert.deepStrictEqual(ids.slice().sort(), ['efteraar', 'fest', 'lantern', 'maane', 'vind']);
  assert.match(await tekst(page, '#stage .hist[data-story="efteraar"]'), /oktober 2026/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Jeres helte" åbner heltelisten, og uden helte åbner heltebyggeren', async () => {
  let s = await nySide(standard());
  await s.page.goto(server.base + 'index.html');
  await s.page.click('#helte');
  await s.page.waitForSelector('.hcard');
  assert.ok(await s.page.$('#go'));
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
  s = await nySide({ 'lk-welcomed': '1' });
  await s.page.goto(server.base + 'index.html');
  await s.page.click('#helte');
  await s.page.waitForSelector('#hn');
  assert.strictEqual(await tekst(s.page, '#stage h2'), 'Ny helt');
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
});

test('første gang vises velkomsten, og bagefter forsiden', async () => {
  const { context, page, fejl } = await nySide({});
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#wgo');
  assert.strictEqual(await page.isVisible('#forside'), false);
  await page.click('#wgo');
  await page.waitForSelector('#ugens');
  assert.strictEqual(await gemt(page, 'lk-welcomed'), '1');
  await page.reload();
  await page.waitForSelector('#ugens');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('forsiden opdateres, når appen vågner på en ny dato', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-17T23:59:00');
  await page.goto(server.base + 'index.html?' + UGE);
  await page.waitForSelector('#ugens');
  assert.match(await tekst(page, '#stage .ugens'), /Stjernestien 1/);
  await context.clock.setFixedTime(new Date('2099-12-18T07:30:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForSelector('#stage .hist[data-story="sti2"]');
  assert.match(await tekst(page, '#stage .ugens'), /Stjernestien 2/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

/* ---------- Indstillinger ---------- */

test('tandhjulet åbner indstillingerne, og "‹ Forside" fører tilbage', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.waitForSelector('#big');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Indstillinger');
  assert.strictEqual(await tekst(page, '#forside'), '‹ Forside');
  const side = await tekst(page, '#stage');
  for (const t of ['Læs altid højt', 'Stor skrift', 'Bevægelse', 'Nulstil skovens venner', 'Om Lanterneskoven']) assert.ok(side.includes(t), t);
  // Bevægelse har en linje, der forklarer, hvad en bevægelse er.
  assert.match(await tekst(page, '#stage .indst-row:has(#bevaeg)'), /ét ben/);
  await page.click('#forside');
  await page.waitForSelector('#ugens');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('indstillingerne slår til og fra, gemmes i lk-prefs og huskes næste gang', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.waitForSelector('#big');
  assert.strictEqual(await page.getAttribute('#auto', 'aria-pressed'), 'false');
  assert.strictEqual(await page.getAttribute('#big', 'aria-pressed'), 'false');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'true');
  await page.click('#auto');
  await page.click('#big');
  await page.click('#bevaeg');
  assert.strictEqual(await page.getAttribute('#auto', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#big', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'false');
  assert.strictEqual(await page.evaluate(() => document.body.classList.contains('big')), true);
  assert.deepStrictEqual(await prefs(page), { auto: true, big: true, bevaeg: false });
  await page.reload();
  await page.click('#indst');
  await page.waitForSelector('#big');
  assert.strictEqual(await page.getAttribute('#auto', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#big', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'false');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('gamle lk-prefs bevares: manglende bevaeg er slået til, og andre felter bliver stående', async () => {
  const { context, page, fejl } = await nySide(standard({}, { 'lk-prefs': '{"auto":false,"big":true,"ekstra":7}' }));
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.waitForSelector('#big');
  assert.strictEqual(await page.getAttribute('#big', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'true');
  assert.strictEqual(await page.evaluate(() => document.body.classList.contains('big')), true);
  await page.click('#auto');
  assert.deepStrictEqual(await prefs(page), { auto: true, big: true, bevaeg: true, ekstra: 7 });
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('scenerne har kun "Læs højt"; de andre knapper er flyttet til indstillingerne', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await startFraForsiden(page, 'lantern');
  assert.ok(await page.$('#stage #rd'));
  for (const id of ['#auto', '#big', '#bevaeg']) assert.strictEqual(await page.$(id), null, id);
  assert.strictEqual(await page.$('.foot #about'), null);
  assert.strictEqual(await page.$('.foot #install'), null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('Bevægelse slået fra i indstillingerne gør bevægelsesvalget til et terningkast', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await page.click('#indst');
  await page.click('#bevaeg');
  await page.click('#forside');
  await startFraForsiden(page, 'efteraar');
  assert.strictEqual(await tekst(page, HOP + ' .tag'), '🎲 Mod');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Nulstil skovens venner" spørger på siden selv; Fortryd beholder, Nulstil glemmer', async () => {
  const world = { done_lantern: true, nusseVen: true, gnistNavne: ['Blinke'] };
  const { context, page, fejl, dialoger } = await nySide(standard(world));
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.click('#nulstil');
  assert.strictEqual(await page.isVisible('#nulstil-boks'), true);
  assert.match(await tekst(page, '#nulstil-boks'), new RegExp(NULSTIL_SPOERG.replace('?', '\\?')));
  assert.strictEqual(await tekst(page, '#nulstil-ja'), 'Nulstil');
  assert.strictEqual(await tekst(page, '#nulstil-nej'), 'Fortryd');
  await page.click('#nulstil-nej');
  assert.strictEqual(await page.isVisible('#nulstil-boks'), false);
  assert.deepStrictEqual(JSON.parse(await gemt(page, 'lk-heroes')).world, world);
  await page.click('#nulstil');
  await page.click('#nulstil-ja');
  const lib = JSON.parse(await gemt(page, 'lk-heroes'));
  assert.deepStrictEqual(lib.world, {});
  assert.strictEqual(lib.heroes.length, 1);
  assert.strictEqual(await page.isVisible('#nulstil-boks'), false);
  await page.click('#forside');
  await page.waitForSelector('#stage .hist');
  assert.doesNotMatch(await tekst(page, '#stage .hist[data-story="lantern"]'), /Gennemført/);
  assert.deepStrictEqual(dialoger, []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Installér app" vises kun, når browseren tilbyder det, og starter installationen', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.waitForSelector('#big');
  assert.strictEqual(await page.isVisible('#install'), false);
  await page.evaluate(() => {
    const e = new Event('beforeinstallprompt', { cancelable: true });
    e.prompt = () => { window.__installer = true; };
    e.userChoice = Promise.resolve({ outcome: 'accepted' });
    window.dispatchEvent(e);
  });
  assert.strictEqual(await page.isVisible('#install'), true);
  assert.match(await tekst(page, '#install'), /Installér app/);
  await page.click('#install');
  assert.strictEqual(await page.evaluate(() => window.__installer), true);
  await page.waitForFunction(() => document.getElementById('install').closest('[hidden]') !== null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Om Lanterneskoven" viser velkomstteksten, og "Tilbage" fører til indstillingerne', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await page.click('#indst');
  await page.click('#about');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Velkommen til Lanterneskoven!');
  assert.strictEqual(await tekst(page, '#wgo'), 'Tilbage');
  await page.click('#wgo');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Indstillinger');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

/* ---------- Tilbage-knappen ---------- */

test('"‹ Forside" midt i en historie spørger først; "Bliv i historien" bevarer siden, som den var', async () => {
  const { context, page, fejl, dialoger } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  assert.strictEqual(await page.isVisible('#forside'), true);
  assert.strictEqual(await tekst(page, '#forside'), '‹ Forside');
  await page.click(HOP); // en bevægelse er i gang
  await page.click('#forside');
  assert.strictEqual(await page.isVisible('#stopbox'), true);
  assert.match(await tekst(page, '#stopbox'), new RegExp(SPOERG.replace('?', '\\?')));
  assert.strictEqual(await tekst(page, '#stop-ja'), 'Stop historien');
  assert.strictEqual(await tekst(page, '#stop-nej'), 'Bliv i historien');
  await page.click('#stop-nej');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.strictEqual(await tekst(page, '#stage h2'), 'Bladene falder');
  assert.strictEqual(await page.isVisible('#klarede'), true);
  await page.click('#klarede');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Bladene flyver');
  assert.deepStrictEqual(dialoger, []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Stop historien" fører til forsiden uden at gemme noget', async () => {
  const { context, page, fejl, dialoger } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  const foer = await page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const skrevetFoer = (await page.evaluate(() => window.__skrevet)).length;
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.waitForSelector('#ugens');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.strictEqual(await page.isVisible('#forside'), false);
  assert.strictEqual(await page.$('#choices'), null);
  const efter = await page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  assert.deepStrictEqual(efter, foer);
  assert.strictEqual((await page.evaluate(() => window.__skrevet)).length, skrevetFoer);
  // Historien kan startes forfra.
  await startFraForsiden(page, 'efteraar');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Bladene falder');
  assert.strictEqual(await page.isDisabled(HOP), false);
  assert.deepStrictEqual(dialoger, []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"‹ Forside" på slutskærmen går direkte til forsiden, og historien er gennemført', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  await spilTilSlut(page);
  await page.click('#forside');
  await page.waitForSelector('#ugens');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.match(await tekst(page, '#stage .hist[data-story="efteraar"]'), /Gennemført/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"‹ Forside" i opsætningen og heltebyggeren fører direkte tilbage og gemmer ikke en halv rettelse', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await page.click('#helte');
  await page.waitForSelector('#go');
  await page.click('#forside');
  await page.waitForSelector('#ugens');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  await page.click('#helte');
  await page.click('[data-edit="h1"]');
  await page.fill('#hn', 'Bodil');
  await page.click('#forside');
  await page.waitForSelector('#ugens');
  await page.click('#helte');
  await page.waitForSelector('.hcard');
  assert.strictEqual(await tekst(page, '.hcard .hn'), 'Kaj');
  assert.strictEqual(JSON.parse(await gemt(page, 'lk-heroes')).heroes[0].name, 'Kaj');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

/* ---------- Forhåndsvisning ---------- */

test('forhåndsvisningen starter stadig i historien, og "‹ Forside" fører til forsiden uden at gemme noget', async () => {
  const gem = standard({ done_lantern: true });
  const { context, page, fejl } = await nySide(gem, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?preview=juletraeet&' + MAANED);
  await page.waitForSelector('#stage h2');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Et lille træ');
  assert.strictEqual(await page.$('#ugens'), null);
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.waitForSelector('#ugens');
  assert.ok((await page.$$eval('#stage .hist', l => l.map(b => b.getAttribute('data-story')))).includes('juletraeet'));
  await page.click('#indst');
  await page.click('#big');
  await page.click('#bevaeg');
  await page.click('#nulstil');
  await page.click('#nulstil-ja');
  await page.click('#forside');
  await page.click('#stage .hist[data-story="juletraeet"]');
  await page.click('#go');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Et lille træ');
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
