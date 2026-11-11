// Katalog til e2e-testene (index.html?katalog=tests/fixtures/stories-uge/katalog.js):
// den rigtige saga og en serie på 3 kapitler på de sidste tre fredage i december 2099 (11., 18. og 25.).
// Testene stiller uret, så kapitlerne udkommer, når de skal.
LK.katalog([
  { id: 'lantern', fil: 'stories/lantern/historie.js', type: 'saga' },
  { id: 'maane', fil: 'stories/maane/historie.js', type: 'saga' },
  { id: 'vind', fil: 'stories/vind/historie.js', type: 'saga' },
  { id: 'fest', fil: 'stories/fest/historie.js', type: 'saga' },
  { id: 'sti1', fil: 'tests/fixtures/stories-uge/sti1/historie.js', type: 'maaned', udgives: '2099-12-11', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 1, kapitler: 3 },
  { id: 'sti2', fil: 'tests/fixtures/stories-uge/sti2/historie.js', type: 'maaned', udgives: '2099-12-18', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 2, kapitler: 3 },
  { id: 'sti3', fil: 'tests/fixtures/stories-uge/sti3/historie.js', type: 'maaned', udgives: '2099-12-25', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 3, kapitler: 3 }
]);
