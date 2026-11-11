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
test('stories/katalog.js registrerer de fire dele i rækkefølge og derefter månedshistorierne, og filerne findes', async () => {
  const { existsSync } = await import('node:fs');
  const { LK: lk } = indlaes(['js/katalog.js', 'stories/katalog.js']);
  const poster = [...lk.katalogPoster];
  assert.deepEqual(poster.slice(0, 4).map(e => e.id + ':' + e.type), ['lantern:saga', 'maane:saga', 'vind:saga', 'fest:saga']);
  poster.forEach(e => assert.ok(existsSync(new URL('../' + e.fil, import.meta.url)), e.fil));
  // Månedshistorier: id = mappenavnet <ÅÅÅÅ-MM>-<navn>, og de udkommer den 1. i samme måned.
  poster.slice(4).forEach(e => {
    assert.equal(e.type, 'maaned', e.id);
    assert.match(e.id, /^\d{4}-\d{2}-[a-z0-9]+$/, e.id);
    assert.equal(e.fil, 'stories/' + e.id + '/historie.js');
    assert.equal(e.udgives, e.id.slice(0, 7) + '-01', e.id);
  });
  assert.equal(new Set(poster.map(e => e.id)).size, poster.length, 'to historier med samme id');
});
