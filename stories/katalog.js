// Kataloget over historier. Motoren (index.html) og tools/tjek-historier.mjs læser det.
// Sagaen står i rækkefølge; månedshistorier får type 'maaned' og en udgivelsesdato 'udgives'.
LK.katalog([
  { id: 'lantern', fil: 'stories/lantern/historie.js', type: 'saga' },
  { id: 'maane', fil: 'stories/maane/historie.js', type: 'saga' },
  { id: 'vind', fil: 'stories/vind/historie.js', type: 'saga' },
  { id: 'fest', fil: 'stories/fest/historie.js', type: 'saga' },
  { id: '2026-11-pjuske-1', fil: 'stories/2026-11-pjuske-1/historie.js', type: 'maaned', udgives: '2026-11-06',
    serie: { id: '2026-11-pjuske', titel: 'Pjuskes efterårsliste' }, kapitel: 1, kapitler: 4 },
  { id: '2026-12-julestjernen', fil: 'stories/2026-12-julestjernen/historie.js', type: 'maaned', udgives: '2026-12-01' }
]);
