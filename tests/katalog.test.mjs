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
  // Månedshistorier: id = mappenavnet <ÅÅÅÅ-MM>-<navn> (et kapitel: <ÅÅÅÅ-MM>-<navn>-<n>), og de uden serie udkommer den 1. i samme måned.
  poster.slice(4).forEach(e => {
    assert.equal(e.type, 'maaned', e.id);
    assert.match(e.id, e.serie ? new RegExp('^\\d{4}-\\d{2}-[a-z0-9]+-' + e.kapitel + '$') : /^\d{4}-\d{2}-[a-z0-9]+$/, e.id);
    assert.equal(e.fil, 'stories/' + e.id + '/historie.js');
    if (!e.serie) assert.equal(e.udgives, e.id.slice(0, 7) + '-01', e.id);
  });
  assert.equal(new Set(poster.map(e => e.id)).size, poster.length, 'to historier med samme id');
});

test('fredag', () => { assert.equal(LK.erFredag('2026-11-13'), true); assert.equal(LK.erFredag('2026-12-01'), false); });
test('sidste fredag', () => { assert.equal(LK.sidsteFredag(2026, 11), '2026-11-27'); assert.equal(LK.sidsteFredag(2027, 1), '2027-01-29'); });
test('fredage i december', () => assert.deepEqual(LK.fredageIMaaned(2026, 12), ['2026-12-04', '2026-12-11', '2026-12-18', '2026-12-25']));
test('næste kapitel', () => {
  const s = { id: 's', titel: 'S' };
  const k = [{ id: 'a', serie: s, kapitel: 1 }, { id: 'b', serie: s, kapitel: 2 }, { id: 'c', serie: { id: 'andet' }, kapitel: 2 }, { id: 'd' }];
  assert.equal(LK.naesteKapitel(k, k[0]).id, 'b');
  assert.equal(LK.naesteKapitel(k, k[1]), null);
  assert.equal(LK.naesteKapitel(k, k[3]), null);
});
