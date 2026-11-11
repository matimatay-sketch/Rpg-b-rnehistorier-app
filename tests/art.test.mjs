import { test } from 'node:test';
import assert from 'node:assert';
import { indlaes } from './helpers/indlaes.mjs';

const { LK } = indlaes(['art/dele.js']);

const spec = {
  sted: 'lanternetrae', himmel: 'nat', alt: 'Uffe og Nusse ved træet',
  figurer: [{ navn: 'uffe', x: 200, y: 130 }, { navn: 'nusse', x: 120, y: 190, humoer: 'bekymret' }],
  ting: [{ navn: 'lanterne', x: 300, y: 120, taendt: true }],
};

test('scene giver en svg med viewBox og alt-tekst', () => {
  const s = LK.art.scene({ sted: 'skovsti', himmel: 'nat', alt: 'Uffe på en gren', figurer: [{ navn: 'uffe', x: 200, y: 130 }] });
  assert.match(s, /^<svg[^>]*viewBox="0 0 400 250"/);
  assert.match(s, /role="img"/); assert.match(s, /aria-label="Uffe på en gren"/);
  assert.match(s, /<\/svg>$/);
});

test('ukendt del giver en tydelig fejl', () => {
  assert.throws(() => LK.art.scene({ sted: 'mars', himmel: 'nat', alt: 'x' }), /Ukendt sted: mars/);
  assert.throws(() => LK.art.scene({ sted: 'baek', himmel: 'lilla', alt: 'x' }), /Ukendt himmel: lilla/);
  assert.throws(() => LK.art.scene({ sted: 'baek', himmel: 'nat', alt: 'x', figurer: [{ navn: 'drage', x: 0, y: 0 }] }), /Ukendt figur: drage/);
  assert.throws(() => LK.art.scene({ sted: 'baek', himmel: 'nat', alt: 'x', ting: [{ navn: 'sko', x: 0, y: 0 }] }), /Ukendt ting: sko/);
  assert.throws(() => LK.art.scene({ sted: 'baek', himmel: 'nat', alt: 'x', figurer: [{ navn: 'uffe', x: 0, y: 0, humoer: 'sur' }] }), /Ukendt humør: sur/);
});

test('alt-tekst escapes', () => {
  const s = LK.art.scene({ sted: 'baek', himmel: 'dag', alt: 'Moll & "Tut" <3' });
  assert.match(s, /aria-label="Moll &amp; &quot;Tut&quot; &lt;3"/);
});

test('to billeder deler ikke id', () => {
  const ids = s => [...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  const a = ids(LK.art.scene(spec)), b = ids(LK.art.scene(spec));
  assert.ok(a.length > 0);
  assert.equal(a.filter(x => b.includes(x)).length, 0);
});

test('alle url(#...) peger på et id i samme billede', () => {
  const s = LK.art.scene(spec);
  const ids = new Set([...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const m of s.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.has(m[1]), m[1]);
});

test('startsættet findes', () => {
  assert.deepEqual(Object.keys(LK.art.steder).sort(), ['baek', 'bjerg', 'festplads', 'hule', 'lanternetrae', 'lysning', 'maanesoe', 'skovsti', 'sump', 'taage', 'tornekrat'].sort());
  assert.deepEqual(Object.keys(LK.art.figurer).sort(), ['bjorn', 'krage', 'lysorm', 'maanen', 'moll', 'mus', 'nusse', 'pind', 'raev', 'tut', 'uffe', 'vinden'].sort());
  assert.deepEqual(Object.keys(LK.art.ting).sort(), ['bog', 'brev', 'gnist', 'gren', 'lanterne', 'svamp'].sort());
});

test('alle steder, figurer og ting kan tegnes', () => {
  for (const himmel of ['nat', 'skumring', 'aften', 'dag']) {
    for (const sted of Object.keys(LK.art.steder)) {
      const s = LK.art.scene({ sted, himmel, alt: sted });
      assert.match(s, /^<svg[\s\S]*<\/svg>$/, sted);
      assert.doesNotMatch(s, /undefined|NaN/, sted + ' ' + himmel);
    }
  }
  for (const navn of Object.keys(LK.art.figurer)) {
    for (const humoer of ['glad', 'bekymret', 'overrasket', 'rolig']) {
      const s = LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: navn, figurer: [{ navn, x: 200, y: 150, skala: 1.2, humoer }] });
      assert.doesNotMatch(s, /undefined|NaN/, navn + ' ' + humoer);
      assert.match(s, /translate\(200 150\) scale\(1\.2\)/, navn);
    }
  }
  for (const navn of Object.keys(LK.art.ting)) {
    for (const taendt of [true, false]) {
      const s = LK.art.scene({ sted: 'hule', himmel: 'nat', alt: navn, ting: [{ navn, x: 100, y: 100, taendt }] });
      assert.doesNotMatch(s, /undefined|NaN/, navn);
    }
  }
});

test('humør ændrer ansigtet for alle figurer', () => {
  for (const navn of Object.keys(LK.art.figurer)) {
    const tegn = humoer => LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: 'x', figurer: [{ navn, x: 200, y: 150, humoer }] }).replace(/lk\d+-/g, '');
    const set = new Set(['glad', 'bekymret', 'overrasket', 'rolig'].map(tegn));
    assert.equal(set.size, 4, navn);
  }
});

test('tændt lanterne gløder og blafrer, slukket gør ikke', () => {
  const tegn = taendt => LK.art.scene({ sted: 'skovsti', himmel: 'nat', alt: 'x', ting: [{ navn: 'lanterne', x: 100, y: 100, taendt }] });
  assert.match(tegn(true), /lk-blafr/);
  assert.doesNotMatch(tegn(false), /lk-blafr/);
});

test('natten har blinkende stjerner, figurer blinker', () => {
  const s = LK.art.scene({ sted: 'lysning', himmel: 'nat', alt: 'x', figurer: [{ navn: 'uffe', x: 200, y: 150 }] });
  assert.match(s, /lk-glimt/); assert.match(s, /lk-blink/);
  assert.doesNotMatch(LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: 'x' }), /lk-glimt/);
});
