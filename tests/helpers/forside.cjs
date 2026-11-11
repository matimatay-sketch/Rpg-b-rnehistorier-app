// Fælles veje gennem forsiden (Lanternestien) for e2e-testene: appen åbner på forsiden med heltene og stien,
// et tryk på en tændt lanterne åbner arket, "Start eventyret" fører til valget af følgesvend, og
// "Afsted med <navn>" starter historien. "+"-knappen ved heltene fører til heltelisten og -byggeren.

// Vent på forsiden og giv de tændte lanterner (historier, der kan spilles) i stiens rækkefølge.
async function historieIds(page) {
  await page.waitForSelector('#stien');
  return page.$$eval('#stien .st[data-story]', l => l.map(b => b.getAttribute('data-story')));
}

// De slukkede lanterner (kommende kapitler) i stiens rækkefølge.
async function kommendeIds(page) {
  await page.waitForSelector('#stien');
  return page.$$eval('#stien .st[data-kommer]', l => l.map(b => b.getAttribute('data-kommer')));
}

// Står forsiden ikke fremme (fx efter "Forbedre helte"), går "‹ Forside" direkte til den.
async function tilForsiden(page) {
  if (!(await page.$('#stien')) && (await page.isVisible('#forside'))) await page.click('#forside');
  await page.waitForSelector('#stien');
}

// Tryk på historiens lanterne, så arket glider op.
async function aabnHistorie(page, id) {
  await tilForsiden(page);
  await page.click('#stien .st[data-story="' + id + '"]');
  await page.waitForSelector('#ark-start', { state: 'visible' });
}

// Fra forsiden til valget af følgesvend for historien `id`.
async function tilFoelgesvend(page, id) {
  await aabnHistorie(page, id);
  await page.click('#ark-start');
  await page.waitForSelector('#afsted');
}

// Vælg følgesvenden (hvis den ikke allerede er valgt) og tryk "Afsted med <navn>".
async function vaelgOgAfsted(page, comp) {
  if (comp && (await page.getAttribute('.sv [data-comp="' + comp + '"]', 'aria-pressed')) !== 'true') await page.click('.sv [data-comp="' + comp + '"]');
  await page.click('#afsted');
  await page.waitForSelector('#stage .story');
}

// Start historien `id` fra forsiden med følgesvenden `comp` (Rikke Ræv, som testene altid har brugt).
async function startHistorie(page, id, comp = 'raev') {
  await tilFoelgesvend(page, id);
  await vaelgOgAfsted(page, comp);
}

// "+"-knappen ved heltene: heltelisten, eller heltebyggeren, hvis familien ingen helte har endnu.
async function tilHelte(page) {
  await tilForsiden(page);
  await page.click('#helte');
}

// Stop historien med "‹ Forside" og, hvis appen spørger (efter det første valg), "Stop historien".
async function stopHistorien(page) {
  await page.click('#forside');
  if (await page.isVisible('#stopbox')) await page.click('#stop-ja');
  await page.waitForSelector('#stien');
}

module.exports = { historieIds, kommendeIds, tilForsiden, aabnHistorie, tilFoelgesvend, vaelgOgAfsted, startHistorie, tilHelte, stopHistorien };
