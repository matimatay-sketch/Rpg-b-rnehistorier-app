// En opdatering af appen må aldrig blande en gammel index.html med nye historiefiler.
// GitHub Pages sender filerne med "Cache-Control: max-age=600", så browseren må genbruge en gemt kopi i 10
// minutter. Service workeren henter scripts friske, så siden skal også hentes frisk, ellers kører et gammelt
// spil med nye historier (fx bevægelsesvalg, som det gamle spil ikke kender, og der sker ingenting ved tryk).
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { execSync } = require('node:child_process');
const { chromium } = require('playwright');

const rod = path.resolve(__dirname, '../..');
const TYPER = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };

let mappe, server, base, browser;

before(async () => {
  // En kopi af appen, som testen kan ændre, serveret som GitHub Pages gør (max-age=600).
  mappe = fs.mkdtempSync(path.join(os.tmpdir(), 'lk-opdatering-'));
  execSync('git ls-files -z | xargs -0 -I{} cp --parents {} ' + JSON.stringify(mappe), { cwd: rod, shell: '/bin/bash' });
  server = http.createServer((req, res) => {
    const sti = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const fil = path.join(mappe, sti.endsWith('/') ? sti + 'index.html' : sti);
    if (!fil.startsWith(mappe) || !fs.existsSync(fil) || fs.statSync(fil).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPER[path.extname(fil)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
    res.end(fs.readFileSync(fil));
  });
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  base = 'http://127.0.0.1:' + server.address().port + '/';
  browser = await chromium.launch();
});

after(async () => {
  if (browser) await browser.close();
  if (server) server.close();
  if (mappe) fs.rmSync(mappe, { recursive: true, force: true });
});

test('efter en opdatering henter service workeren den nye side, ikke en gemt kopi fra browserens cache', async () => {
  const context = await browser.newContext();
  await context.addInitScript(() => { try { localStorage.setItem('lk-welcomed', '1'); } catch (e) {} });
  const page = await context.newPage();
  await page.goto(base + 'index.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // nu styrer service workeren siden, og index.html ligger i browserens cache
  assert.ok(await page.evaluate(() => !!navigator.serviceWorker.controller), 'service workeren styrer siden');

  // En ny udgave lægges ud: siden får et nyt mærke.
  const indexFil = path.join(mappe, 'index.html');
  fs.writeFileSync(indexFil, fs.readFileSync(indexFil, 'utf8').replace('</body>', '<meta name="lk-test" content="ny-udgave"></body>'));

  // Familien åbner appen igen (en almindelig navigation, ikke "genindlæs", som altid spørger serveren).
  await page.goto('about:blank');
  await page.goto(base + 'index.html');
  const maerke = await page.evaluate(() => { const m = document.querySelector('meta[name="lk-test"]'); return m && m.content; });
  assert.strictEqual(maerke, 'ny-udgave', 'siden er hentet frisk efter opdateringen');
  await context.close();
});
