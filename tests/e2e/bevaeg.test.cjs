// Bevægelsesudfordringer i en rigtig browser, med testkataloget tests/fixtures/stories-maaned/katalog.js.
// Månedshistorien 'efteraar' har i første scene bevægelsesvalget "Hop i bladene" (key 'hop'),
// der fører til 'Bladene flyver' (lykkedes) eller 'Bums i bunken' (mislykkedes, og derfra tilbage).
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');
const { tilOpsaetning } = require('../helpers/forside.cjs');

const KATALOG = 'katalog=tests/fixtures/stories-maaned/katalog.js';
const HOP = '#choices .crow > .btn:has-text("Hop i bladene")';
const KLAREDE = 'button:has-text("Vi klarede det!")';
const VAKLEDE = 'button:has-text("Vi vaklede")';

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
});

function helt() {
  return {
    id: 'h1', name: 'Kaj', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats: { Mod: 1, List: 1, Venlighed: 1, Fantasi: 1, Humor: 1, Nysgerrighed: 1 }, pts: 0, lastMonth: 999999, bonusMonth: -1, stories: 0, magic: 'gnist', magic2: ''
  };
}
const standard = (prefs) => Object.assign({ 'lk-heroes': JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }), 'lk-welcomed': '1' },
  prefs === undefined ? {} : { 'lk-prefs': prefs });

// Ny side med gemte data; alle skrivninger til localStorage efter opsætningen tælles i window.__skrevet.
async function nySide(gem) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
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

// Start 'efteraar' med Kaj og Rikke Ræv.
async function startEfteraar(gem) {
  const s = await nySide(gem);
  await s.page.goto(server.base + 'index.html?' + KATALOG);
  await tilOpsaetning(s.page);
  await s.page.waitForSelector('input[name=story][value="efteraar"]');
  await s.page.check('input[name=story][value="efteraar"]');
  await s.page.check('input[name=comp][value="raev"]');
  await s.page.click('#go');
  await s.page.waitForSelector(HOP);
  return s;
}
const titel = async (page) => (await page.textContent('#stage h2')).trim();
const prefs = async (page) => JSON.parse(await page.evaluate(() => localStorage.getItem('lk-prefs')));

test('et bevægelsesvalg har mærket 🤸, og et tryk viser instruktionen og de to knapper', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🤸');
  await page.click(HOP);
  const boks = (await page.textContent('#choices .dicebox')).replace(/\s+/g, ' ');
  assert.match(boks, /Stå på ét ben og tæl til ti\./);
  assert.match(boks, /Kaj prøver, og alle må gerne være med/);
  assert.doesNotMatch(boks, /chance/);
  assert.strictEqual(await page.isVisible(KLAREDE), true);
  assert.strictEqual(await page.isVisible(VAKLEDE), true);
  assert.strictEqual(await page.$('#roll'), null);
  assert.strictEqual(await page.$('#fe'), null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Vi klarede det!" fører til lykkedes-scenen', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  await page.click(HOP);
  await page.click(KLAREDE);
  assert.strictEqual(await titel(page), 'Bladene flyver');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('"Vi vaklede" fører til mislykkedes-scenen, og bagefter kan valget ikke vælges igen', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  await page.click(HOP);
  await page.click(VAKLEDE);
  assert.strictEqual(await titel(page), 'Bums i bunken');
  await page.click('#choices .crow > .btn:has-text("Gå tilbage til træerne")');
  assert.strictEqual(await titel(page), 'Bladene falder');
  assert.strictEqual(await page.isDisabled(HOP), true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('med bevægelse slået fra er valget et terningkast med trækket og chancen', async () => {
  const { context, page, fejl } = await startEfteraar(standard('{"bevaeg":false}'));
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🎲 Mod');
  await page.click(HOP);
  const boks = (await page.textContent('#choices .dicebox')).replace(/\s+/g, ' ');
  assert.match(boks, /Slå mindst 6 i alt\./);
  assert.match(boks, /% chance/);
  assert.doesNotMatch(boks, /Stå på ét ben/);
  assert.strictEqual(await page.isVisible('#roll'), true);
  assert.strictEqual(await page.$(KLAREDE), null);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('et tryk på Bevægelse i indstillingerne gemmer bevaeg:false i lk-prefs, bevarer stor skrift og gælder i næste historie', async () => {
  const { context, page, fejl } = await nySide(standard('{"auto":false,"big":true}'));
  await page.goto(server.base + 'index.html?' + KATALOG);
  await page.click('#indst');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'true');
  await page.click('#bevaeg');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'false');
  const p = await prefs(page);
  assert.strictEqual(p.bevaeg, false);
  assert.strictEqual(p.big, true);
  assert.strictEqual(await page.evaluate(() => document.body.classList.contains('big')), true);
  // Historien, der startes bagefter, har et terningkast i stedet for bevægelsen.
  await page.click('#forside');
  await tilOpsaetning(page);
  await page.check('input[name=story][value="efteraar"]');
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🎲 Mod');
  await page.click('#choices .crow > .btn:has-text("Saml blade")');
  assert.strictEqual(await titel(page), 'En stor bunke');
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.click('#indst');
  await page.click('#bevaeg');
  assert.strictEqual((await prefs(page)).bevaeg, true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('gamle indstillinger uden bevaeg: bevægelse er slået til, og stor skrift er stadig slået til', async () => {
  const { context, page, fejl } = await startEfteraar(standard('{"auto":false,"big":true}'));
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🤸');
  assert.strictEqual(await page.evaluate(() => document.body.classList.contains('big')), true);
  // Indstillingerne viser det samme.
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.click('#indst');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'true');
  assert.strictEqual(await page.getAttribute('#big', 'aria-pressed'), 'true');
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('i forhåndsvisningen skifter Bevægelse uden at gemme noget', async () => {
  const { context, page, fejl } = await nySide({});
  await page.goto(server.base + 'index.html?preview=efteraar&' + KATALOG);
  await page.waitForSelector(HOP);
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🤸');
  // Via forsiden til indstillingerne og tilbage til historien med eksempelholdet.
  await page.click('#forside');
  await page.click('#stop-ja');
  await page.click('#indst');
  await page.click('#bevaeg');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'false');
  await page.click('#forside');
  await page.click('#stage .hist[data-story="efteraar"]');
  await page.click('#go');
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🎲 Mod');
  await page.click(HOP);
  assert.strictEqual(await page.isVisible('#roll'), true);
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('slutskærmen viser Bevægelser: 1 efter én bevægelse', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  await page.click(HOP);
  await page.click(KLAREDE);
  await page.click('#choices .crow > .btn:has-text("Læs videre")');
  await page.waitForSelector('.end');
  const st = await page.$$eval('#stage .stats span', l => l.map(s => s.textContent));
  const i = st.indexOf('Terningkast: 0');
  assert.ok(i >= 0, st.join(' / '));
  assert.strictEqual(st[i + 1], 'Bevægelser: 1', st.join(' / '));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('slutskærmen har ingen Bevægelser-linje uden bevægelser', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  await page.click('#choices .crow > .btn:has-text("Saml blade")');
  await page.click('#choices .crow > .btn:has-text("Læs videre")');
  await page.waitForSelector('.end');
  const st = await page.textContent('#stage .stats');
  assert.match(st, /Terningkast: 0/);
  assert.doesNotMatch(st, /Bevægelser/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('med bevægelse slået fra bevarer et bevægelsesvalg sine øvrige felter, fx lock', async () => {
  for (const p of ['{"bevaeg":false}', undefined]) {
    const { context, page, fejl } = await startEfteraar(standard(p));
    await page.click('#choices .crow > .btn:has-text("Saml blade")');
    const KRYB = '#choices .crow > .btn:has-text("Kryb ind i bunken")';
    assert.strictEqual(await page.isDisabled(KRYB), true, 'lock skal bevares, prefs ' + p);
    assert.match(await page.textContent('#choices'), /Kræver en bunke mere/);
    assert.deepStrictEqual(fejl, []);
    await context.close();
  }
});

test('"Læs højt" i bevægelsesboksen læser instruktionen', async () => {
  const { context, page, fejl } = await startEfteraar(standard());
  await page.evaluate(() => {
    window.__sagt = [];
    speechSynthesis.speak = (u) => { window.__sagt.push(u.text); };
    speechSynthesis.cancel = () => {};
  });
  await page.click(HOP);
  await page.click('#rd');
  assert.deepStrictEqual(await page.evaluate(() => window.__sagt), ['Stå på ét ben og tæl til ti.']);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('forhåndsvisningen viser bevægelsen, selv når Bevægelse er slået fra i de gemte indstillinger, og gemmer intet', async () => {
  const { context, page, fejl } = await nySide({ 'lk-prefs': '{"bevaeg":false}' });
  await page.goto(server.base + 'index.html?preview=efteraar&' + KATALOG);
  await page.waitForSelector(HOP);
  assert.strictEqual((await page.textContent(HOP + ' .tag')).trim(), '🤸');
  assert.deepStrictEqual(await page.evaluate(() => window.__skrevet), []);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});
