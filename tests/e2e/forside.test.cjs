// Forside (Lanternestien), arket, valget af følgesvend, indstillinger og tilbage-knap
// (docs/superpowers/specs/2026-11-11-forside-og-navigation-design.md, også afsnittet "Ændring: Lanternestien").
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');
const { historieIds, kommendeIds, aabnHistorie, tilFoelgesvend, vaelgOgAfsted, startHistorie, tilHelte } = require('../helpers/forside.cjs');

const UGE = 'katalog=tests/fixtures/stories-uge/katalog.js';
const MAANED = 'katalog=tests/fixtures/stories-maaned/katalog.js';
const HOP = '#choices .crow > .btn:has-text("Hop i bladene")';
const HOP_JUL = '#choices .crow > .btn:has-text("Hæng en lanterne op")';
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
async function nySide(gem, dato, rnd, valg) {
  const context = await browser.newContext(Object.assign({ serviceWorkers: 'block' }, valg || {}));
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

// Fra forsiden: tryk på historiens lanterne, "Start eventyret", vælg Rikke Ræv og "Afsted med Rikke Ræv".
async function startFraForsiden(page, id) {
  await startHistorie(page, id, 'raev');
  await page.waitForSelector('#stage .scene-art');
}

const to = (over) => [helt(), helt(Object.assign({ id: 'h2', name: 'Mo', skin: '#C98E62' }, over))];
const mange = (play) => JSON.stringify({ heroes: to().concat(['h3', 'h4', 'h5'].map((id, i) => helt({ id, name: ['Ida', 'Liv', 'Sofus'][i] }))), play, world: {} });
const lys = (page, id) => '#stien .st[data-' + (id.kommer ? 'kommer' : 'story') + '="' + (id.kommer || id) + '"]';
const synlig = (page, sel) => page.isVisible(sel);
const fokusI = (page, sel) => page.evaluate(s => !!document.activeElement && !!document.activeElement.closest(s), sel);

/* ---------- Forsiden: heltene og Lanternestien ---------- */

test('forsiden har navnet, tandhjulet, heltene og "+"-knappen "Helte"', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('.bar .brand'), true);
  assert.strictEqual(await tekst(page, '.bar .brand'), 'Lanterneskoven');
  assert.strictEqual(await page.getAttribute('#indst', 'aria-label'), 'Indstillinger');
  assert.strictEqual(await page.isVisible('#indst'), true);
  assert.strictEqual(await page.isVisible('#forside'), false);
  assert.strictEqual(await page.$('input[name=story]'), null);
  assert.strictEqual(await page.$('#ugens'), null, 'Ugens eventyr-kortet er væk; stien er forsiden');
  assert.strictEqual(await tekst(page, '#stage .helte-tekst'), 'Med i aften. Tryk for at slå til og fra.');
  // Helten står, som den ser ud (appens egen figur), med navn under og en ring, når den er med.
  assert.ok(await page.$('#stage .helt[data-helt="h1"] svg[role="img"]'));
  assert.strictEqual(await tekst(page, '#stage .helt[data-helt="h1"]'), 'Kaj');
  assert.strictEqual(await page.getAttribute('#stage .helt[data-helt="h1"]', 'aria-pressed'), 'true');
  assert.strictEqual(await tekst(page, '#helte'), '+ Helte');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('Lanternestien 11. november: Pjuske-serien med tændte og slukkede lanterner, så Den store fortælling', async () => {
  const { context, page, fejl } = await nySide(standard({ done_lantern: true }), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  assert.deepStrictEqual(await historieIds(page), ['2026-11-pjuske-1', 'lantern', 'maane', 'vind', 'fest']);
  assert.deepStrictEqual(await kommendeIds(page), ['2026-11-pjuske-2', '2026-11-pjuske-3', '2026-11-pjuske-4']);
  const grupper = await page.$$eval('#stien .gruppe > h2', l => l.map(h => h.textContent.replace(/\s+/g, ' ').trim()));
  assert.deepStrictEqual(grupper, [
    'Pjuskes efterårsliste En lanterne tændes hver fredag i november',
    'Den store fortælling Fire dele, der hænger sammen'
  ]);
  // Stien går i kapitlernes rækkefølge, også de kommende kapitler.
  assert.deepStrictEqual(await page.$$eval('#stien .gruppe:first-child .st', l => l.map(s => s.getAttribute('data-story') || s.getAttribute('data-kommer'))),
    ['2026-11-pjuske-1', '2026-11-pjuske-2', '2026-11-pjuske-3', '2026-11-pjuske-4']);
  assert.strictEqual(await tekst(page, lys(page, '2026-11-pjuske-1')), '1. Den første frost Ude nu');
  assert.strictEqual(await page.$eval(lys(page, '2026-11-pjuske-1'), s => s.classList.contains('nu')), true);
  assert.strictEqual(await tekst(page, lys(page, { kommer: '2026-11-pjuske-2' })), '2. Trækfuglenes farvel Tændes fredag 13. nov.');
  assert.strictEqual(await tekst(page, lys(page, { kommer: '2026-11-pjuske-3' })), '3. Den lange aften Tændes fredag 20. nov.');
  assert.strictEqual(await tekst(page, lys(page, { kommer: '2026-11-pjuske-4' })), '4. Godnat, Pjuske Tændes fredag 27. nov.');
  assert.strictEqual(await tekst(page, lys(page, 'lantern')), '1. Lanterneskoven Gennemført');
  assert.strictEqual(await tekst(page, lys(page, 'maane')), '2. Månen der gemte sig Del 2 af 4');
  assert.strictEqual(await tekst(page, lys(page, 'fest')), '4. Lanternefesten Del 4 af 4');
  // En tændt lanterne er en knap; en slukket er ikke.
  assert.strictEqual(await page.$eval(lys(page, 'maane'), s => s.tagName), 'BUTTON');
  assert.strictEqual(await page.$eval(lys(page, { kommer: '2026-11-pjuske-2' }), s => s.tagName === 'BUTTON'), false);
  assert.strictEqual(await page.$eval(lys(page, { kommer: '2026-11-pjuske-2' }), s => s.classList.contains('slukket')), true);
  assert.strictEqual(await page.$eval(lys(page, 'maane'), s => s.classList.contains('slukket')), false);
  // Zigzag: lanternerne skifter mellem højre og venstre, og en prikket linje forbinder dem.
  const xs = await page.$$eval('#stien .gruppe:first-child .st .lys2', l => l.map(e => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; }));
  const midt = await page.$eval('#stien .gruppe:first-child .sti2', e => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });
  assert.deepStrictEqual(xs.map(x => x > midt), [true, false, true, false]);
  assert.match(await page.getAttribute('#stien .gruppe:first-child svg.vej path', 'd'), /^M[\d.]+ [\d.]+ C/);
  assert.ok(await page.getAttribute('#stien .gruppe:first-child svg.vej path', 'stroke-dasharray'));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en slukket lanterne kan ikke åbnes, men titel og dato kan ses', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector(lys(page, { kommer: '2026-11-pjuske-2' }));
  await page.click(lys(page, { kommer: '2026-11-pjuske-2' }));
  await page.waitForTimeout(200);
  assert.strictEqual(await synlig(page, '#ark'), false);
  assert.strictEqual(await page.$('#afsted'), null);
  assert.ok(await page.$('#stien'));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('et tryk på en lanterne åbner arket med billede, titel, "Start eventyret" og "Luk"; Escape, Luk og baggrunden lukker det', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await aabnHistorie(page, '2026-11-pjuske-1');
  assert.strictEqual(await synlig(page, '#ark'), true);
  assert.ok(await page.$('#ark figure.scene-art svg[role="img"]'), 'billedet fra historiens første scene');
  assert.strictEqual(await tekst(page, '#ark .ark-sted'), 'Kapitel 1 af 4 i Pjuskes efterårsliste');
  assert.strictEqual(await tekst(page, '#ark h2'), 'Den første frost');
  assert.match(await tekst(page, '#ark'), /pindsvinet Pjuske skal snart sove hele vinteren/);
  assert.strictEqual(await tekst(page, '#ark-start'), 'Start eventyret');
  assert.strictEqual(await tekst(page, '#ark-luk'), 'Luk');
  assert.strictEqual(await page.getAttribute('#ark', 'role'), 'dialog');
  assert.strictEqual(await fokusI(page, '#ark'), true, 'fokus flyttes ind i arket');
  // Tab bliver i arket.
  for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); assert.strictEqual(await fokusI(page, '#ark'), true, 'Tab ' + i); }
  await page.keyboard.press('Escape');
  assert.strictEqual(await synlig(page, '#ark'), false);
  assert.strictEqual(await page.evaluate(() => document.activeElement.getAttribute('data-story')), '2026-11-pjuske-1', 'fokus tilbage på lanternen');
  await aabnHistorie(page, '2026-11-pjuske-1');
  await page.click('#ark-luk');
  assert.strictEqual(await synlig(page, '#ark'), false);
  await aabnHistorie(page, 'vind');
  assert.strictEqual(await tekst(page, '#ark .ark-sted'), 'Del 3 af 4');
  assert.strictEqual(await tekst(page, '#ark h2'), 'Vinden der var alene');
  await page.mouse.click(195, 20); // baggrunden over arket
  assert.strictEqual(await synlig(page, '#ark'), false);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('et tryk på en helt slår den til og fra og gemmer det i lib.play; højst fire ad gangen', async () => {
  const { context, page, fejl } = await nySide({ 'lk-heroes': mange({ h1: true, h3: true, h4: true }), 'lk-welcomed': '1' }, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#stien');
  const play = async () => JSON.parse(await gemt(page, 'lk-heroes')).play;
  assert.strictEqual(await page.getAttribute('.helt[data-helt="h2"]', 'aria-pressed'), 'false');
  assert.strictEqual(await page.$eval('.helt[data-helt="h2"]', b => b.classList.contains('fra')), true);
  await page.click('.helt[data-helt="h2"]');
  assert.strictEqual(await page.getAttribute('.helt[data-helt="h2"]', 'aria-pressed'), 'true');
  assert.strictEqual(await page.$eval('.helt[data-helt="h2"]', b => b.classList.contains('fra')), false);
  assert.strictEqual((await play()).h2, true);
  await page.click('.helt[data-helt="h1"]');
  assert.strictEqual(await page.getAttribute('.helt[data-helt="h1"]', 'aria-pressed'), 'false');
  assert.strictEqual((await play()).h1, false);
  await page.click('.helt[data-helt="h1"]');
  // Fire er med; den femte kan ikke slås til.
  await page.click('.helt[data-helt="h5"]');
  assert.strictEqual(await page.getAttribute('.helt[data-helt="h5"]', 'aria-pressed'), 'false');
  assert.strictEqual(await tekst(page, '#helt-besked'), 'Der kan højst være fire helte med ad gangen.');
  assert.ok(!(await play()).h5);
  // Det huskes næste gang.
  await page.reload();
  await page.waitForSelector('#stien');
  assert.deepStrictEqual(await page.$$eval('.helt[data-helt]', l => l.map(b => b.getAttribute('aria-pressed'))), ['true', 'true', 'true', 'true', 'false']);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"+" åbner heltelisten, og uden helte står der "Lav jeres første helt", som åbner heltebyggeren', async () => {
  let s = await nySide(standard());
  await s.page.goto(server.base + 'index.html');
  await tilHelte(s.page);
  await s.page.waitForSelector('.hcard');
  assert.strictEqual(await tekst(s.page, '.hcard .hn'), 'Kaj');
  assert.ok(await s.page.$('#newh'));
  assert.strictEqual(await s.page.$('input[name=story]'), null, 'historie vælges på stien, ikke her');
  assert.strictEqual(await s.page.$('input[name=comp]'), null, 'følgesvend vælges efter "Start eventyret"');
  assert.strictEqual(await s.page.isVisible('#forside'), true);
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
  s = await nySide({ 'lk-welcomed': '1' });
  await s.page.goto(server.base + 'index.html');
  await s.page.waitForSelector('#stien');
  assert.strictEqual(await s.page.$('.helt[data-helt]'), null);
  assert.strictEqual(await tekst(s.page, '#helte'), '+ Lav jeres første helt');
  await s.page.click('#helte');
  await s.page.waitForSelector('#hn');
  assert.strictEqual(await tekst(s.page, '#stage h2'), 'Ny helt');
  assert.deepStrictEqual(s.fejl, []);
  await s.context.close();
});

/* ---------- Vælg følgesvend ---------- */

test('"Start eventyret" viser historien og de seks følgesvende med billeder og "+1 i <træk>"', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await tilFoelgesvend(page, '2026-11-pjuske-1');
  assert.strictEqual(await synlig(page, '#ark'), false);
  assert.strictEqual(await page.isVisible('#forside'), true);
  assert.strictEqual(await page.isVisible('#indst'), true);
  assert.strictEqual(await tekst(page, '#stage .valgt-hist small'), 'Kapitel 1 af 4 i Pjuskes efterårsliste');
  assert.strictEqual(await tekst(page, '#stage .valgt-hist b'), 'Den første frost');
  assert.ok(await page.$('#stage .valgt-hist svg[role="img"]'));
  assert.strictEqual(await tekst(page, '#stage h2'), 'Hvem tager I med?');
  const kort = await page.$$eval('.sv [data-comp]', l => l.map(b => [b.getAttribute('data-comp'), b.querySelector('b').textContent, b.querySelector('.plus').textContent, !!b.querySelector('svg[role="img"]')]));
  assert.deepStrictEqual(kort, [
    ['raev', 'Rikke Ræv', '+1 i List', true], ['bjorn', 'Bastian Bjørn', '+1 i Mod', true], ['pind', 'Pip Pindsvin', '+1 i Venlighed', true],
    ['lysorm', 'Lulle Lysorm', '+1 i Fantasi', true], ['krage', 'Krage Krølle', '+1 i Humor', true], ['mus', 'Mille Mus', '+1 i Nysgerrighed', true]
  ]);
  assert.match(await tekst(page, '.sv [data-comp="pind"]'), /Lille, blød og god til at lytte/);
  // Første gang er ingen valgt.
  assert.deepStrictEqual(await page.$$eval('.sv [data-comp]', l => l.map(b => b.getAttribute('aria-pressed'))), Array(6).fill('false'));
  assert.strictEqual(await page.isDisabled('#afsted'), true);
  await page.click('.sv [data-comp="bjorn"]');
  assert.strictEqual(await page.getAttribute('.sv [data-comp="bjorn"]', 'aria-pressed'), 'true');
  assert.strictEqual(await tekst(page, '#afsted'), 'Afsted med Bastian Bjørn');
  assert.strictEqual(await page.isDisabled('#afsted'), false);
  await page.click('.sv [data-comp="mus"]');
  assert.strictEqual(await page.getAttribute('.sv [data-comp="bjorn"]', 'aria-pressed'), 'false');
  assert.strictEqual(await tekst(page, '#afsted'), 'Afsted med Mille Mus');
  // "‹ Forside" fører direkte tilbage.
  await page.click('#forside');
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Afsted med <navn>" starter historien med aftenens helte og følgesvenden, som huskes i lk-prefs', async () => {
  const gem = { 'lk-heroes': JSON.stringify({ heroes: to(), play: { h1: true }, world: {} }), 'lk-welcomed': '1', 'lk-prefs': '{"auto":false,"big":false,"ekstra":7}' };
  const { context, page, fejl } = await nySide(gem, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await page.waitForSelector('#stien');
  await page.click('.helt[data-helt="h2"]');
  await tilFoelgesvend(page, 'efteraar');
  await page.click('.sv [data-comp="bjorn"]');
  await page.click('#afsted');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Bladene falder');
  assert.match(await tekst(page, '#stage .story'), /Bastian Bjørn brummer glad/);
  assert.match(await tekst(page, '#stage .turn'), /Kaj/);
  assert.deepStrictEqual(await prefs(page), { auto: false, big: false, bevaeg: true, ekstra: 7, comp: 'bjorn' });
  await spilTilSlut(page);
  assert.deepStrictEqual(await page.$$eval('#stage .heroes figcaption', l => l.map(f => f.textContent)), ['Kaj', 'Mo']);
  assert.match(await tekst(page, '#stage .stats'), /Følgesvend: Bastian Bjørn/);
  // Næste gang er Bastian Bjørn valgt på forhånd, også efter en genindlæsning.
  await page.click('#back');
  await page.waitForSelector('#stien');
  await tilFoelgesvend(page, 'efteraar');
  assert.strictEqual(await page.getAttribute('.sv [data-comp="bjorn"]', 'aria-pressed'), 'true');
  assert.strictEqual(await tekst(page, '#afsted'), 'Afsted med Bastian Bjørn');
  await page.reload();
  await tilFoelgesvend(page, 'efteraar');
  assert.strictEqual(await page.getAttribute('.sv [data-comp="bjorn"]', 'aria-pressed'), 'true');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('uden valgte helte står der "Vælg mindst én helt på forsiden", og knappen er slået fra', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#stien');
  await page.click('.helt[data-helt="h1"]');
  await tilFoelgesvend(page, 'lantern');
  assert.strictEqual(await tekst(page, '#ingen-helte'), 'Vælg mindst én helt på forsiden');
  await page.click('.sv [data-comp="raev"]');
  assert.strictEqual(await page.isDisabled('#afsted'), true);
  assert.strictEqual(await page.$('#stage .story'), null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('arket og valget af følgesvend virker for et kapitel fra stien (Stjernestien 2)', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-18T10:00:00');
  await page.goto(server.base + 'index.html?' + UGE);
  assert.deepStrictEqual(await historieIds(page), ['sti1', 'sti2'].concat(['lantern', 'maane', 'vind', 'fest']));
  assert.deepStrictEqual(await kommendeIds(page), ['sti3']);
  assert.strictEqual(await tekst(page, lys(page, { kommer: 'sti3' })), '3. Stjernestien 3 Tændes fredag 25. dec.');
  await aabnHistorie(page, 'sti2');
  const ark = await tekst(page, '#ark');
  assert.match(ark, /Kapitel 2 af 3 i Stjernestien/);
  assert.match(ark, /Stjernestien 2/);
  assert.match(ark, /Kapitel 2 af testserien\./);
  assert.ok(await page.$('#ark figure.scene-art svg[role="img"]'));
  await page.click('#ark-start');
  await vaelgOgAfsted(page, 'raev');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Stien 2 begynder');
  assert.strictEqual(await tekst(page, '#epi'), 'Ugens eventyr · Stjernestien · kapitel 2 af 3');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('uden et udgivet kapitel står sagaen alene på stien, og den første del, der ikke er gennemført, kan startes', async () => {
  const { context, page, fejl } = await nySide(standard({ done_lantern: true }), '2026-11-01T12:00:00');
  await page.goto(server.base + 'index.html');
  assert.deepStrictEqual(await historieIds(page), ['lantern', 'maane', 'vind', 'fest']);
  assert.deepStrictEqual(await kommendeIds(page), []);
  assert.match(await tekst(page, lys(page, 'lantern')), /Gennemført/);
  assert.match(await tekst(page, lys(page, 'maane')), /Del 2 af 4/);
  await tilFoelgesvend(page, 'maane');
  assert.strictEqual(await tekst(page, '#stage .valgt-hist small'), 'Del 2 af 4');
  assert.strictEqual(await tekst(page, '#stage .valgt-hist b'), 'Månen der gemte sig');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('stien viser serierne nyeste først med kapitlerne i rækkefølge og derefter sagaen', async () => {
  const { context, page, fejl } = await nySide(standard({ done_lantern: true, 'done_2026-11-pjuske-2': true }), '2026-12-05T12:00:00');
  await page.goto(server.base + 'index.html');
  assert.deepStrictEqual(await historieIds(page), [
    '2026-12-julestjernen-1', '2026-11-pjuske-1', '2026-11-pjuske-2', '2026-11-pjuske-3', '2026-11-pjuske-4', 'lantern', 'maane', 'vind', 'fest'
  ]);
  assert.deepStrictEqual(await kommendeIds(page), ['2026-12-julestjernen-2', '2026-12-julestjernen-3', '2026-12-julestjernen-4']);
  assert.match(await tekst(page, lys(page, '2026-11-pjuske-3')), /3\. Den lange aften/);
  assert.match(await tekst(page, lys(page, 'vind')), /Del 3 af 4/);
  assert.match(await tekst(page, lys(page, 'lantern')), /Gennemført/);
  assert.match(await tekst(page, lys(page, '2026-11-pjuske-2')), /Gennemført/);
  assert.doesNotMatch(await tekst(page, lys(page, 'maane')), /Gennemført/);
  assert.match(await tekst(page, lys(page, '2026-11-pjuske-3')), /Ude nu/);
  assert.match(await tekst(page, lys(page, { kommer: '2026-12-julestjernen-2' })), /Tændes fredag 11\. dec\./);
  const grupper = await page.$$eval('#stien .gruppe > h2', l => l.map(h => h.firstChild.textContent.trim()));
  assert.deepStrictEqual(grupper, ['Julestjernen', 'Pjuskes efterårsliste', 'Den store fortælling']);
  assert.match(await tekst(page, '#stien .gruppe:first-child > h2'), /En lanterne tændes hver fredag i december/);
  await tilFoelgesvend(page, 'vind');
  assert.strictEqual(await tekst(page, '#stage .valgt-hist b'), 'Vinden der var alene');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en månedshistorie uden serie står også på stien', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  const ids = await historieIds(page);
  assert.deepStrictEqual(ids.slice().sort(), ['efteraar', 'fest', 'lantern', 'maane', 'vind']);
  assert.match(await tekst(page, lys(page, 'efteraar')), /Bladenes fest Ude nu/);
  await aabnHistorie(page, 'efteraar');
  assert.match(await tekst(page, '#ark .ark-sted'), /oktober 2026/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('første gang vises velkomsten, og bagefter forsiden', async () => {
  const { context, page, fejl } = await nySide({});
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#wgo');
  assert.strictEqual(await page.isVisible('#forside'), false);
  await page.click('#wgo');
  await page.waitForSelector('#stien');
  assert.strictEqual(await gemt(page, 'lk-welcomed'), '1');
  await page.reload();
  await page.waitForSelector('#stien');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('forsiden opdateres, når appen vågner på en ny dato: den slukkede lanterne tændes', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-17T23:59:00');
  await page.goto(server.base + 'index.html?' + UGE);
  assert.deepStrictEqual(await historieIds(page), ['sti1', 'lantern', 'maane', 'vind', 'fest']);
  assert.match(await tekst(page, lys(page, { kommer: 'sti2' })), /Stjernestien 2 Tændes fredag 18\. dec\./);
  await context.clock.setFixedTime(new Date('2099-12-18T07:30:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForSelector(lys(page, 'sti2'));
  assert.match(await tekst(page, lys(page, 'sti2')), /Stjernestien 2 Ude nu/);
  assert.deepStrictEqual(await kommendeIds(page), ['sti3']);
  await startHistorie(page, 'sti2');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Stien 2 begynder');
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
  await page.waitForSelector('#stien');
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
  await page.waitForSelector('#stien .st[data-story="lantern"]');
  assert.doesNotMatch(await tekst(page, '#stien .st[data-story="lantern"]'), /Gennemført/);
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
  await page.click(HOP); // et valg er truffet, så appen spørger
  await page.click('#forside');
  assert.strictEqual(await page.isVisible('#stopbox'), true);
  await page.click('#stop-ja');
  await page.waitForSelector('#stien');
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
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.match(await tekst(page, '#stien .st[data-story="efteraar"]'), /Gennemført/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"‹ Forside" i heltelisten og heltebyggeren fører direkte tilbage og gemmer ikke en halv rettelse', async () => {
  const { context, page, fejl } = await nySide(standard());
  await page.goto(server.base + 'index.html');
  await tilHelte(page);
  await page.waitForSelector('.hcard');
  await page.click('#forside');
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  await page.click('#helte');
  await page.click('[data-edit="h1"]');
  await page.fill('#hn', 'Bodil');
  await page.click('#forside');
  await page.waitForSelector('#stien');
  await page.click('#helte');
  await page.waitForSelector('.hcard');
  assert.strictEqual(await tekst(page, '.hcard .hn'), 'Kaj');
  assert.strictEqual(JSON.parse(await gemt(page, 'lk-heroes')).heroes[0].name, 'Kaj');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

/* ---------- Fire rettelser ---------- */

const TELEFON = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

test('på historiens første scene, før der er valgt noget, går "‹ Forside" direkte til forsiden', async () => {
  const { context, page, fejl, dialoger } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  const skrevetFoer = (await page.evaluate(() => window.__skrevet)).length;
  await page.click('#forside');
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.strictEqual((await page.evaluate(() => window.__skrevet)).length, skrevetFoer);
  // Efter et valg på første scene spørger den igen.
  await startFraForsiden(page, 'efteraar');
  await page.click(HOP);
  await page.click('#forside');
  assert.strictEqual(await page.isVisible('#stopbox'), true);
  assert.deepStrictEqual(dialoger, []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"‹ Forside" sidder fast øverst, så den kan ses langt nede i en scene', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00', null, TELEFON);
  await page.goto(server.base + 'index.html');
  await startFraForsiden(page, '2026-11-pjuske-1');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(100);
  assert.ok(await page.evaluate(() => window.scrollY) > 400, 'scenen er lang nok til at rulle');
  const top = await page.$eval('#forside', b => b.getBoundingClientRect().top);
  assert.ok(top >= 0 && top < 40, 'top ' + top);
  assert.strictEqual(await page.isVisible('#forside'), true);
  // Den står øverst over teksten (ikke dækket af den).
  const ovenpaa = await page.$eval('#forside', b => { const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!e && !!e.closest('#forside'); });
  assert.strictEqual(ovenpaa, true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('scenens overskriftslinje står på én linje på en telefon', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00', null, TELEFON);
  await page.goto(server.base + 'index.html');
  await startFraForsiden(page, '2026-11-pjuske-1');
  assert.strictEqual(await tekst(page, '#epi'), 'Ugens eventyr · Pjuskes efterårsliste · kapitel 1 af 4');
  const linje = await page.evaluate(() => {
    const kasse = e => e.getBoundingClientRect();
    const bar = document.getElementById('bar'), f = kasse(document.getElementById('forside')), r = document.getElementById('barr');
    const synlige = [...r.querySelectorAll('*')].filter(e => e.getClientRects().length && getComputedStyle(e).display !== 'none' && e.textContent.trim());
    return { hoejde: kasse(bar).height, forside: f.height, tekst: r.innerText.replace(/\s+/g, ' ').trim(), afkortet: r.scrollWidth > r.clientWidth + 1,
      enLinje: synlige.every(e => Math.abs(kasse(e).top + kasse(e).height / 2 - (f.top + f.height / 2)) < 12) };
  });
  assert.ok(linje.hoejde <= linje.forside + 4, JSON.stringify(linje));
  assert.strictEqual(linje.enLinje, true, JSON.stringify(linje));
  assert.strictEqual(linje.afkortet, false, JSON.stringify(linje));
  assert.match(linje.tekst, /Kapitel 1 af 4/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('slutskærmens "Tilbage til historierne" fører til forsiden', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  await spilTilSlut(page);
  assert.strictEqual(await tekst(page, '#back'), 'Tilbage til historierne');
  await page.click('#back');
  await page.waitForSelector('#stien');
  assert.strictEqual(await page.isVisible('#forside'), false);
  assert.strictEqual(await page.isVisible('#indst'), true);
  assert.match(await tekst(page, '#stien .st[data-story="efteraar"]'), /Gennemført/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

/* ---------- Rettelser efter gennemsynet ---------- */

test('stoppes historien, mens terningen ruller, sker der ingen fejl, og kastet tæller ikke med', async () => {
  const { context, page, fejl } = await nySide(standard({}, { 'lk-prefs': '{"bevaeg":false}' }), '2026-11-11T10:00:00');
  // Med Playwrights ur kommer en fejl i en timer som en konsolfejl, ikke som en sidefejl.
  page.on('console', m => { if (m.type() === 'error') fejl.push(m.text()); });
  await page.goto(server.base + 'index.html?' + MAANED);
  await startFraForsiden(page, 'efteraar');
  await page.click(HOP);
  await page.click('#roll');
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.waitForSelector('#stien');
  await page.waitForTimeout(1300);
  assert.deepStrictEqual(fejl, []);
  // En ny historie starter med et rent kast-tal.
  await startFraForsiden(page, 'efteraar');
  await page.click(HOP);
  await page.click('#roll');
  await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
  await page.click('#roll');
  await spilTilSlut(page);
  assert.match(await tekst(page, '#stage .stats'), /Terningkast: 1(?!\d)/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('telefonens overskriftslinje med stor skrift på 320 px: "‹ Forside" på én linje, og gnisterne kan ses', async () => {
  const { context, page, fejl } = await nySide(standard({}, { 'lk-prefs': '{"big":true}' }), '2026-11-11T10:00:00', null, { viewport: { width: 320, height: 640 } });
  await page.goto(server.base + 'index.html');
  await startFraForsiden(page, '2026-11-pjuske-1');
  const m = await page.evaluate(() => {
    const f = document.getElementById('forside').getBoundingClientRect(), barr = document.getElementById('barr').getBoundingClientRect();
    const gnister = [...document.querySelectorAll('#spark i')].map(i => i.getBoundingClientRect());
    return { forsideH: f.height, gnisterInde: gnister.length === 4 && gnister.every(g => g.width > 0 && g.right <= barr.right + 1 && g.right <= window.innerWidth) };
  });
  assert.ok(m.forsideH <= 48, JSON.stringify(m));
  assert.strictEqual(m.gnisterInde, true, JSON.stringify(m));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('den første helt: efter "Gem helt" står familien på forsiden med helten valgt', async () => {
  const { context, page, fejl } = await nySide({ 'lk-welcomed': '1' }, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.click('#helte');
  await page.fill('#hn', 'Ida');
  await page.click('#save');
  await page.waitForSelector('#stien');
  assert.deepStrictEqual(await page.$$eval('.helt[data-helt]', l => l.map(b => [b.textContent.trim(), b.getAttribute('aria-pressed')])), [['Ida', 'true']]);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en ny helt slås ikke til, når fire allerede er med', async () => {
  const { context, page, fejl } = await nySide({ 'lk-heroes': mange({ h1: true, h2: true, h3: true, h4: true }), 'lk-welcomed': '1' }, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await tilHelte(page);
  await page.click('#newh');
  await page.fill('#hn', 'Nora');
  await page.click('#save');
  await page.waitForSelector('#stien');
  const lib = JSON.parse(await gemt(page, 'lk-heroes'));
  const ny = lib.heroes.find(h => h.name === 'Nora');
  assert.ok(!lib.play[ny.id], JSON.stringify(lib.play));
  assert.strictEqual(Object.values(lib.play).filter(Boolean).length, 4);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('uden nogen helte siger følgesvend-skærmen "Lav jeres første helt på forsiden"', async () => {
  const { context, page, fejl } = await nySide({ 'lk-welcomed': '1' }, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await tilFoelgesvend(page, 'lantern');
  assert.strictEqual(await tekst(page, '#ingen-helte'), 'Lav jeres første helt på forsiden');
  assert.strictEqual(await page.isDisabled('#afsted'), true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('heltene og følgesvendene hedder kun deres navn; billederne er skjult for skærmlæsere', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('#stien');
  const navn = async (sel) => (await page.locator(sel).ariaSnapshot()).replace(/\s+/g, ' ');
  assert.match(await navn('.helt[data-helt="h1"]'), /^- button "Kaj" \[pressed\]$/);
  await tilFoelgesvend(page, 'lantern');
  assert.match(await navn('.sv [data-comp="raev"]'), /^- button "Rikke Ræv Snedig, hurtig og svær at narre \+1 i List"/);
  assert.doesNotMatch(await navn('.sv [data-comp="raev"]'), /img/);
  // Overskriften får fokus uden en synlig fokusring.
  assert.strictEqual(await page.evaluate(() => document.activeElement.id), 'ledsager-titel');
  assert.strictEqual(await page.$eval('#ledsager-titel', h => getComputedStyle(h).outlineStyle), 'none');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('beskeden om fire helte står i en statuslinje, der bliver i siden; Escape i stop-spørgsmålet er "Bliv i historien"', async () => {
  const { context, page, fejl } = await nySide({ 'lk-heroes': mange({ h1: true, h2: true, h3: true, h4: true }), 'lk-welcomed': '1' }, '2026-11-11T10:00:00');
  await page.goto(server.base + 'index.html?' + MAANED);
  await page.waitForSelector('#stien');
  const foer = await page.$('#helt-besked');
  assert.ok(foer, 'statuslinjen findes fra starten');
  assert.strictEqual(await page.$eval('#helt-besked', e => e.hidden || getComputedStyle(e).display === 'none'), false);
  await page.click('.helt[data-helt="h5"]');
  assert.strictEqual(await tekst(page, '#helt-besked'), 'Der kan højst være fire helte med ad gangen.');
  assert.strictEqual(await page.evaluate(e => e.isConnected, foer), true);
  await page.click('.helt[data-helt="h1"]');
  assert.strictEqual(await tekst(page, '#helt-besked'), '');
  await startFraForsiden(page, 'efteraar');
  await page.click(HOP);
  await page.click('#forside');
  assert.strictEqual(await page.isVisible('#stopbox'), true);
  await page.keyboard.press('Escape');
  assert.strictEqual(await page.isVisible('#stopbox'), false);
  assert.strictEqual(await tekst(page, '#stage h2'), 'Bladene falder');
  assert.strictEqual(await page.evaluate(() => document.activeElement.id), 'forside');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('vågner appen på en ny dato, mens arket er åbent, bliver arket stående med fokus', async () => {
  const { context, page, fejl } = await nySide(standard(), '2099-12-17T23:59:00');
  await page.goto(server.base + 'index.html?' + UGE);
  await aabnHistorie(page, 'sti1');
  await context.clock.setFixedTime(new Date('2099-12-18T07:30:00'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(() => document.querySelectorAll('script[src$="sti2/historie.js"]').length > 1);
  await page.waitForTimeout(300);
  assert.strictEqual(await page.isVisible('#ark'), true);
  assert.strictEqual(await fokusI(page, '#ark'), true);
  await page.click('#ark-luk');
  // Stien er tegnet igen med det nye kapitel, når arket lukkes.
  await page.waitForSelector('#stien .st[data-story="sti2"]');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('titler og beskrivelser med < og & vises som tekst', async () => {
  const { context, page, fejl } = await nySide(standard(), '2026-11-11T10:00:00');
  await page.route('**/stories-maaned/efteraar/historie.js', r => r.fulfill({
    status: 200, contentType: 'text/javascript',
    body: "LK.addStory(function (k) { return { id: 'efteraar', title: 'Ræv & <b>Mus</b>', tag: 'x', blurb: 'A < B & <i>C</i>', start: 'ef_a', scenes: { ef_a: { title: 'A', text: ['a'], ask: 'a?', end: true } } }; });"
  }));
  await page.goto(server.base + 'index.html?' + MAANED);
  await page.waitForSelector('#stien .st[data-story="efteraar"]');
  assert.strictEqual(!!(await page.$('#stien b b')), false, 'titlen må ikke blive til HTML');
  assert.match(await tekst(page, '#stien .st[data-story="efteraar"]'), /Ræv & <b>Mus<\/b>/);
  await aabnHistorie(page, 'efteraar');
  assert.strictEqual(await tekst(page, '#ark h2'), 'Ræv & <b>Mus</b>');
  assert.match(await tekst(page, '#ark .blurb'), /A < B & <i>C<\/i>/);
  await page.click('#ark-start');
  assert.strictEqual(await tekst(page, '#stage .valgt-hist b'), 'Ræv & <b>Mus</b>');
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
  assert.strictEqual(await page.$('#stien'), null);
  await page.click(HOP_JUL); // et valg, så "‹ Forside" spørger først
  await page.click('#forside');
  await page.click('#stop-ja');
  assert.ok((await historieIds(page)).includes('juletraeet'));
  // Eksempelholdet (Asta og Bo) står som aftenens helte.
  assert.deepStrictEqual(await page.$$eval('.helt[data-helt]', l => l.map(b => [b.textContent.trim(), b.getAttribute('aria-pressed')])), [['Asta', 'true'], ['Bo', 'true']]);
  await page.click('#indst');
  await page.click('#big');
  await page.click('#bevaeg');
  await page.click('#nulstil');
  await page.click('#nulstil-ja');
  await page.click('#forside');
  await tilFoelgesvend(page, 'juletraeet');
  assert.strictEqual(await page.getAttribute('.sv [data-comp="bjorn"]', 'aria-pressed'), 'true');
  await page.click('#afsted');
  assert.strictEqual(await tekst(page, '#stage h2'), 'Et lille træ');
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
