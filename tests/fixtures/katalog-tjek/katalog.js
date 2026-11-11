// Katalog til tjek-testene: hver post skal passe med historien i sin fil (id, type og udgives).
LK.katalog([
  { id: 'gsaga', fil: 'tests/fixtures/katalog-tjek/god-saga.js', type: 'saga' },
  { id: 'gmaaned', fil: 'tests/fixtures/katalog-tjek/god-maaned.js', type: 'maaned', udgives: '2026-12-01' },
  { id: 'rigtig', fil: 'tests/fixtures/katalog-tjek/forkert-id.js', type: 'maaned', udgives: '2027-01-01' },
  { id: 'ftype', fil: 'tests/fixtures/katalog-tjek/forkert-type.js', type: 'maaned', udgives: '2027-02-01' },
  { id: 'fudg', fil: 'tests/fixtures/katalog-tjek/forkert-udgives.js', type: 'maaned', udgives: '2027-03-01' },
  { id: 'toa', fil: 'tests/fixtures/katalog-tjek/to-historier.js', type: 'saga' },
  { id: 'ingen', fil: 'tests/fixtures/katalog-tjek/ingen.js', type: 'saga' }
]);
