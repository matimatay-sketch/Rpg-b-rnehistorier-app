// Gennemspilning af de fire dele i en rigtig browser. Spillet skal opføre sig præcis som før.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { startServer } = require('../helpers/server.cjs');

// Forløbet (overskrift og tekst for hver skærm) blev optaget fra den gamle index.html, før
// historierne blev flyttet ud. LK_OPTAG=1 optager det igen.
const FORLOEB = path.join(__dirname, 'gennemspil.forloeb.json');
const optag = process.env.LK_OPTAG === '1';
const forventet = optag || !fs.existsSync(FORLOEB) ? {} : JSON.parse(fs.readFileSync(FORLOEB, 'utf8'));
const optaget = {};

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
  if (optag) fs.writeFileSync(FORLOEB, JSON.stringify(optaget, null, 1) + '\n');
});

const DELE = ['lantern', 'maane', 'vind', 'fest'];

function helt(over) {
  const stats = { Mod: 1, List: 1, Venlighed: 1, Fantasi: 1, Humor: 1, Nysgerrighed: 1 };
  return Object.assign({
    id: 'h1', name: 'Asta', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats, pts: 0, lastMonth: 999999, bonusMonth: -1, stories: 0, magic: 'gnist', magic2: ''
  }, over);
}
// En mester (5 i tre træk) på level 3 med to magier, så magi-, mester- og skjoldvalgene kommer i brug.
const MESTER = { stats: { Mod: 5, List: 0, Venlighed: 5, Fantasi: 5, Humor: 0, Nysgerrighed: 0 }, stories: 4, magic: 'gnist', magic2: 'skjold' };
// En helt uden mestertræk, men med to magier, så magierne (og bagefter skjoldet) bruges.
const MAGIKER = { stats: { Mod: 3, List: 2, Venlighed: 2, Fantasi: 3, Humor: 2, Nysgerrighed: 2 }, stories: 4, magic: 'gnist', magic2: 'skjold' };

// Ny browser-kontekst med gemte data, bevægelse slået fra og et fast Math.random. Service workeren er slået fra,
// så den ikke gemmer filer mellem testene og ikke går uden om page.route.
async function nySide(lib, rnd) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(([libJson, r]) => {
    try {
      localStorage.setItem('lk-heroes', libJson);
      localStorage.setItem('lk-welcomed', '1');
      // Bevægelse slået fra: så er bevægelsesvalgene terningkast, og forløbet er det samme som før.
      localStorage.setItem('lk-prefs', '{"bevaeg":false}');
    } catch (e) {}
    if (r !== null) Math.random = () => r;
  }, [JSON.stringify(lib), rnd]);
  const page = await context.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push(e.message));
  return { context, page, fejl };
}

async function vaelgOgStart(page, id) {
  await page.check('input[name=story][value="' + id + '"]');
  if (!(await page.isChecked('input[name=comp][value="raev"]'))) await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
}

// Hver scene har præcis ét billede øverst (før overskriften) og en stribe med seks lanterner.
// Giver en tom streng, når alt er i orden, ellers scenens titel og hvad der er galt.
function tjekBillede() {
  const h2 = document.querySelector('#stage h2');
  const titel = h2 ? h2.textContent.trim() : '(ingen overskrift)';
  const fig = document.querySelectorAll('#stage figure.scene-art');
  const svg = document.querySelectorAll('#stage figure.scene-art svg[role="img"]');
  if (fig.length !== 1 || svg.length !== 1) return titel + ': ' + fig.length + ' billeder, ' + svg.length + ' svg';
  if (!h2 || !(fig[0].compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING)) return titel + ': billedet står ikke før overskriften';
  if (!svg[0].getAttribute('aria-label')) return titel + ': billedet mangler alt-tekst';
  if (document.querySelectorAll('#stage .lamps i').length !== 6) return titel + ': lanternestriben mangler';
  return '';
}

// Tryk altid på det første (eller sidste) valg, der kan trykkes på, til slutskærmen.
// Med sidste valg bruges Lysskjoldet også, når et kast mislykkes.
async function spilTilSlut(page, log, sidste, billedFejl) {
  for (let i = 0; i < 300; i++) {
    log.push(await page.evaluate(() => {
      const t = s => { const e = document.querySelector('#stage ' + s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; };
      return t('h2') + ' | ' + t('.story') + ' | ' + t('.ask') + ' | ' + [...document.querySelectorAll('#choices .crow > .btn')].map(b => b.textContent + (b.disabled ? ' (låst)' : '')).join(' / ');
    }));
    const b = await page.evaluate(tjekBillede);
    if (b) billedFejl.push(b);
    if (await page.$('.end')) return;
    if (await page.$('#roll')) {
      await page.click('#roll');
      for (;;) {
        await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
        log.push('kast: ' + (await page.textContent('#res')) + ((await page.$('#shield')) ? ' (skjold)' : ''));
        if (sidste && (await page.$('#shield'))) { await page.click('#shield'); continue; }
        break;
      }
      await page.click('#roll');
      continue;
    }
    const valg = page.locator('#choices .crow > .btn:not([disabled])');
    await (sidste ? valg.last() : valg.first()).click();
  }
  throw new Error('Nåede ikke slutskærmen');
}

async function gemt(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('lk-heroes')));
}

const KOERSLER = [
  ['alle kast lykkes', 0.99, {}, false],
  ['alle kast fejler', 0, {}, false],
  ['mester med magi vælger sidste valg', 0, MESTER, true],
  ['magiker vælger sidste valg', 0, MAGIKER, true]
];
for (const [navn, rnd, over, sidste] of KOERSLER) {
  test('gennemspilning af alle fire dele: ' + navn, async () => {
    const { context, page, fejl } = await nySide({ heroes: [helt(over)], play: { h1: true }, world: {} }, rnd);
    await page.goto(server.base + 'index.html');
    for (const del of DELE) {
      await page.waitForSelector('input[name=story][value="' + del + '"]');
      await vaelgOgStart(page, del);
      const log = [], billedFejl = [];
      await spilTilSlut(page, log, sidste, billedFejl);
      optaget[navn + ' / ' + del] = log;
      assert.deepStrictEqual(billedFejl, [], 'billeder i ' + del);
      if (!optag) assert.deepStrictEqual(log, forventet[navn + ' / ' + del], 'forløbet i ' + del + ' er ændret');
      assert.strictEqual((await page.textContent('.end')).trim(), 'Slut', del);
      if (del === 'lantern') assert.strictEqual((await gemt(page)).world.done_lantern, true);
      await page.click('#team');
    }
    const lib = await gemt(page);
    DELE.forEach(d => assert.strictEqual(lib.world['done_' + d], true, d));
    assert.strictEqual(lib.heroes[0].stories, (over.stories || 0) + 4);
    assert.deepStrictEqual(fejl, []);
    await context.close();
  });
}

// Del 1 med bevægelse slået til (som fra starten): der vælges et bevægelsesvalg (🤸), når der er et, ellers det
// første valg, og der trykkes "Vi klarede det!" ved hver bevægelse, til slutskærmen.
test('del 1 kan spilles til slut med bevægelse slået til og "Vi klarede det!"', async () => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(libJson => {
    try { localStorage.setItem('lk-heroes', libJson); localStorage.setItem('lk-welcomed', '1'); } catch (e) {}
    Math.random = () => 0.99;
  }, JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }));
  const page = await context.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push(e.message));
  page.on('console', m => { if (m.type() === 'error') fejl.push(m.text()); });
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('input[name=story][value="lantern"]');
  await vaelgOgStart(page, 'lantern');
  assert.strictEqual(await page.getAttribute('#bevaeg', 'aria-pressed'), 'true');
  let bevaegelser = 0;
  for (let i = 0; i < 300 && !(await page.$('.end')); i++) {
    if (await page.$('#roll')) {
      await page.click('#roll');
      await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
      await page.click('#roll');
    } else if (await page.$('#klarede')) {
      bevaegelser++;
      await page.click('#klarede');
    } else {
      const valg = page.locator('#choices .crow > .btn:not([disabled])');
      const bevaeg = valg.filter({ has: page.locator('.tag', { hasText: '🤸' }) });
      await ((await bevaeg.count()) ? bevaeg.first() : valg.first()).click();
    }
  }
  assert.strictEqual((await page.textContent('.end')).trim(), 'Slut');
  assert.ok(bevaegelser >= 1, 'ingen bevægelser i del 1');
  assert.match(await page.textContent('#stage .stats'), new RegExp('Bevægelser: ' + bevaegelser));
  assert.strictEqual((await gemt(page)).world.done_lantern, true);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

// Billedet bevæger sig (lanterner, stjerner, øjne), men står helt stille, når enheden beder om mindre bevægelse.
for (const [navn, motion, bevaeger] of [['bevæger sig', 'no-preference', true], ['står stille med reduceret bevægelse', 'reduce', false]]) {
  test('billedet ' + navn, async () => {
    const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: motion });
    await context.addInitScript(libJson => {
      try { localStorage.setItem('lk-heroes', libJson); localStorage.setItem('lk-welcomed', '1'); } catch (e) {}
    }, JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }));
    const page = await context.newPage();
    await page.goto(server.base + 'index.html');
    await page.waitForSelector('input[name=story]');
    await vaelgOgStart(page, 'lantern');
    await page.waitForSelector('#stage figure.scene-art svg');
    const antal = await page.evaluate(() => document.querySelector('#stage figure.scene-art').getAnimations({ subtree: true }).length);
    if (bevaeger) assert.ok(antal > 0, 'ingen animationer i billedet'); else assert.strictEqual(antal, 0);
    await context.close();
  });
}

test('gamle gemte data virker stadig', async () => {
  const world = { done_lantern: true, nusseVen: true, gnistNavne: ['Blinke'] };
  const { context, page, fejl } = await nySide({ heroes: [helt()], play: { h1: true }, world }, null);
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('input[name=story][value="lantern"]');
  const del1 = await page.textContent('label.comp:has(input[value="lantern"])');
  assert.match(del1, /Gennemført/);
  assert.strictEqual(await page.isChecked('input[name=story][value="maane"]'), true);
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  const tekst = await page.textContent('#stage .story');
  assert.match(tekst, /Nusse/);
  assert.match(tekst, /Blinke/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en historie, der ikke kan hentes, springes over', async () => {
  const { context, page, fejl } = await nySide({ heroes: [helt()], play: { h1: true }, world: {} }, 0.99);
  // Uret står før den første månedshistorie (november-seriens kapitel 1, 6. november 2026), så listen kun har sagaens dele.
  await context.clock.setFixedTime(new Date('2026-11-01T12:00:00'));
  await page.route('**/stories/vind/historie.js', r => r.fulfill({ status: 404, body: 'findes ikke' }));
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('input[name=story]');
  const ids = await page.$$eval('input[name=story]', l => l.map(i => i.value));
  assert.deepStrictEqual(ids, ['lantern', 'maane', 'fest']);
  for (const id of ids) {
    await page.check('input[name=story][value="' + id + '"]');
    assert.strictEqual(await page.isChecked('input[name=story][value="' + id + '"]'), true);
  }
  await page.check('input[name=comp][value="raev"]');
  await page.click('#go');
  assert.match(await page.textContent('#stage h2'), /\S/);
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('en historie, hvis kode fejler, springes over og logges', async () => {
  const { context, page, fejl } = await nySide({ heroes: [helt()], play: { h1: true }, world: {} }, 0.99);
  // Uret står før den første månedshistorie (november-seriens kapitel 1, 6. november 2026), så listen kun har sagaens dele.
  await context.clock.setFixedTime(new Date('2026-11-01T12:00:00'));
  const logget = [];
  page.on('console', m => { if (m.type() === 'error') logget.push(m.text()); });
  await page.route('**/stories/vind/historie.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: "LK.addStory(function (k) { throw new Error('ødelagt'); });" }));
  await page.goto(server.base + 'index.html');
  await page.waitForSelector('input[name=story]');
  assert.deepStrictEqual(await page.$$eval('input[name=story]', l => l.map(i => i.value)), ['lantern', 'maane', 'fest']);
  assert.ok(logget.some(t => /ødelagt/.test(t)), logget.join('\n'));
  assert.deepStrictEqual(fejl, []);
  await context.close();
});

test('historierne kan spilles uden internet, når appen har været åbnet én gang', async () => {
  const context = await browser.newContext();
  await context.addInitScript(libJson => {
    try { localStorage.setItem('lk-heroes', libJson); localStorage.setItem('lk-welcomed', '1'); } catch (e) {}
  }, JSON.stringify({ heroes: [helt()], play: { h1: true }, world: {} }));
  // Uret står før den første månedshistorie (november-seriens kapitel 1, 6. november 2026), så listen kun har sagaens dele.
  await context.clock.setFixedTime(new Date('2026-11-01T12:00:00'));
  const page = await context.newPage();
  await page.goto(server.base + 'index.html');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  // Tøm browserens almindelige cache, så kun service workerens gemte filer kan bruges.
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector('input[name=story]');
  assert.deepStrictEqual(await page.$$eval('input[name=story]', l => l.map(i => i.value)), DELE);
  await context.close();
});
