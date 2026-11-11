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

// Ny browser-kontekst med gemte data og et fast Math.random. Service workeren er slået fra,
// så den ikke gemmer filer mellem testene og ikke går uden om page.route.
async function nySide(lib, rnd) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(([libJson, r]) => {
    try {
      localStorage.setItem('lk-heroes', libJson);
      localStorage.setItem('lk-welcomed', '1');
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

// Tryk altid på det første (eller sidste) valg, der kan trykkes på, til slutskærmen.
// Med sidste valg bruges Lysskjoldet også, når et kast mislykkes.
async function spilTilSlut(page, log, sidste) {
  for (let i = 0; i < 300; i++) {
    log.push(await page.evaluate(() => {
      const t = s => { const e = document.querySelector('#stage ' + s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; };
      return t('h2') + ' | ' + t('.story') + ' | ' + t('.ask') + ' | ' + [...document.querySelectorAll('#choices .crow > .btn')].map(b => b.textContent + (b.disabled ? ' (låst)' : '')).join(' / ');
    }));
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
      const log = [];
      await spilTilSlut(page, log, sidste);
      optaget[navn + ' / ' + del] = log;
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
