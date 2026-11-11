// Katalog til e2e-testene (index.html?katalog=tests/fixtures/stories-maaned/katalog.js):
// den rigtige saga og to små månedshistorier, én udgivet og én, der først udkommer langt ude i fremtiden.
LK.katalog([
  { id: 'lantern', fil: 'stories/lantern/historie.js', type: 'saga' },
  { id: 'maane', fil: 'stories/maane/historie.js', type: 'saga' },
  { id: 'vind', fil: 'stories/vind/historie.js', type: 'saga' },
  { id: 'fest', fil: 'stories/fest/historie.js', type: 'saga' },
  { id: 'efteraar', fil: 'tests/fixtures/stories-maaned/efteraar/historie.js', type: 'maaned', udgives: '2026-10-01' },
  { id: 'juletraeet', fil: 'tests/fixtures/stories-maaned/juletraeet/historie.js', type: 'maaned', udgives: '2099-12-01' }
]);
