import { test } from 'node:test';
import assert from 'node:assert';
import { indlaes } from './helpers/indlaes.mjs';

const { LK } = indlaes(['js/katalog.js']);

test('uden dato er altid udgivet', () => assert.equal(LK.erUdgivet({}, new Date(2020, 0, 1)), true));
test('skjult kl. 23:59 dagen før', () => assert.equal(LK.erUdgivet({ udgives: '2026-12-01' }, new Date(2026, 10, 30, 23, 59)), false));
test('synlig kl. 00:00 på dagen', () => assert.equal(LK.erUdgivet({ udgives: '2026-12-01' }, new Date(2026, 11, 1, 0, 0)), true));
test('datoStreng bruger lokal tid', () => assert.equal(LK.datoStreng(new Date(2026, 0, 5, 0, 30)), '2026-01-05'));
test('synlige: saga først, månedshistorier nyeste først, fremtidige skjult', () => {
  const k = [{ id: 'lantern', type: 'saga' }, { id: 'dec', type: 'maaned', udgives: '2026-12-01' },
             { id: 'jan', type: 'maaned', udgives: '2027-01-01' }, { id: 'nov', type: 'maaned', udgives: '2026-11-01' }];
  assert.deepEqual(LK.synlige(k, new Date(2026, 11, 2), null).map(e => e.id), ['lantern', 'dec', 'nov']);
  assert.deepEqual(LK.synlige(k, new Date(2026, 11, 2), 'jan').map(e => e.id), ['lantern', 'jan', 'dec', 'nov']);
});
test('stories/katalog.js registrerer de fire dele i rækkefølge, og filerne findes', async () => {
  const { existsSync } = await import('node:fs');
  const { LK: lk } = indlaes(['js/katalog.js', 'stories/katalog.js']);
  assert.deepEqual([...lk.katalogPoster.map(e => e.id)], ['lantern', 'maane', 'vind', 'fest']);
  lk.katalogPoster.forEach(e => {
    assert.equal(e.type, 'saga');
    assert.ok(existsSync(new URL('../' + e.fil, import.meta.url)), e.fil);
  });
});
