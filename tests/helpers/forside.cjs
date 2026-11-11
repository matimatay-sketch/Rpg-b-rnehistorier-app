// Fælles vej ind til opsætningen for e2e-testene: appen åbner på forsiden, og "Jeres helte" fører til
// heltelisten og valget af historie (eller til heltebyggeren, hvis familien ingen helte har endnu).
async function tilOpsaetning(page) {
  await page.click('#helte');
}

module.exports = { tilOpsaetning };
