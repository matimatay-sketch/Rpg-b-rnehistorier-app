// Hver månedshistorie i det rigtige katalog (stories/katalog.js) spilles igennem i forhåndsvisningen
// (index.html?preview=<id>) to gange: med terningen høj og med terningen lav, og altid med det første valg.
// Der må ikke komme fejl i konsollen, og slutskærmen skal vises. Nye månedshistorier kommer automatisk med.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const { startServer } = require('../helpers/server.cjs');

const rod = path.resolve(__dirname, '../..');
function maanedsHistorier() {
  const ctx = {};
  ctx.self = ctx; ctx.window = ctx;
  vm.createContext(ctx);
  for (const fil of ['js/katalog.js', 'stories/katalog.js']) vm.runInContext(fs.readFileSync(path.join(rod, fil), 'utf8'), ctx, { filename: fil });
  return ctx.LK.katalogPoster.filter(e => e.type === 'maaned').map(e => e.id);
}

let server, browser;
before(async () => { server = await startServer(); browser = await chromium.launch(); });
after(async () => {
  if (browser) await browser.close();
  if (server) server.stop();
});

// Tryk på det første valg, der kan trykkes på, og slå terningen, til slutskærmen. Giver de besøgte scenetitler.
async function spilTilSlut(page) {
  const titler = [];
  for (let i = 0; i < 300; i++) {
    if (await page.$('.end')) return titler;
    if (await page.$('#roll')) {
      await page.click('#roll');
      await page.waitForFunction(() => { const b = document.getElementById('roll'); return b && b.textContent === 'Læs videre' && !b.disabled; });
      await page.click('#roll');
      continue;
    }
    titler.push((await page.textContent('#stage h2')).trim());
    assert.ok(await page.$('#stage figure.scene-art svg'), 'intet billede i ' + titler[titler.length - 1]);
    await page.locator('#choices .crow > .btn:not([disabled])').first().click();
  }
  throw new Error('Nåede ikke slutskærmen: ' + titler.join(' > '));
}

const ids = maanedsHistorier();
test('kataloget har mindst én månedshistorie', () => assert.ok(ids.length > 0));

for (const id of ids) {
  for (const [navn, rnd] of [['høj', 0.99], ['lav', 0.01]]) {
    test(id + ' kan spilles til ende i forhåndsvisningen med terningen ' + navn, async () => {
      const context = await browser.newContext({ serviceWorkers: 'block' });
      await context.addInitScript(r => { Math.random = () => r; }, rnd);
      const page = await context.newPage();
      const fejl = [];
      page.on('pageerror', e => fejl.push(e.message));
      page.on('console', m => { if (m.type() === 'error') fejl.push(m.text()); });
      await page.goto(server.base + 'index.html?preview=' + id);
      await page.waitForSelector('#stage h2');
      assert.match(await page.textContent('#epi'), /^Månedens eventyr · /);
      const titler = await spilTilSlut(page);
      assert.ok(titler.length >= 4, titler.join(' > '));
      assert.ok(await page.isVisible('#stage .end'));
      assert.ok(await page.$('#stage figure.scene-art svg'), 'intet billede på slutskærmen');
      assert.ok((await page.$$eval('#stage .choices button', l => l.map(b => b.textContent))).includes('Tilbage til historierne'));
      assert.deepStrictEqual(fejl, []);
      await context.close();
    });
  }
}
