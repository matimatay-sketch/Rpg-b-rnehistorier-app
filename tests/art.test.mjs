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
  assert.deepEqual(Object.keys(LK.art.steder).sort(), ['baek', 'bjerg', 'festplads', 'hule', 'lanternetrae', 'lysning', 'maanesoe', 'skovsti', 'slukkettrae', 'sump', 'taage', 'tornekrat', 'vindue'].sort());
  assert.deepEqual(Object.keys(LK.art.figurer).sort(), ['bjorn', 'krage', 'lysorm', 'maanen', 'moll', 'mus', 'nusse', 'pind', 'raev', 'snemand', 'tut', 'uffe', 'vinden'].sort());
  assert.deepEqual(Object.keys(LK.art.ting).sort(), ['blade', 'bog', 'brev', 'gnist', 'gren', 'lanterne', 'snedrive', 'snefald', 'stjerne', 'svamp'].sort());
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

test('placering laves om til tal, og en ugyldig placering giver en tydelig fejl', () => {
  const s = LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: 'x', figurer: [{ navn: 'uffe', x: '200', y: '150', skala: '0.8' }] });
  assert.match(s, /translate\(200 150\) scale\(0\.8\)/);
  for (const forkert of [{ x: 'venstre', y: 150 }, { x: 200 }, { x: 200, y: 150, skala: 'stor' }, { x: Infinity, y: 0 }]) {
    assert.throws(() => LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: 'x', figurer: [Object.assign({ navn: 'uffe' }, forkert)] }), /Ugyldig placering for uffe/);
  }
  assert.throws(() => LK.art.scene({ sted: 'lysning', himmel: 'dag', alt: 'x', ting: [{ navn: 'brev', x: 10, y: null }] }), /Ugyldig placering for brev/);
});

test('reduceret bevægelse slår alle tre animationer fra', () => {
  const m = LK.art.css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([^{}]*)\{([^{}]*)\}/);
  assert.ok(m, 'ingen regel for prefers-reduced-motion: reduce');
  const vaelgere = m[1].split(',').map(v => v.trim());
  for (const k of ['.lk-blafr', '.lk-blink', '.lk-glimt']) assert.ok(vaelgere.includes(k), k);
  assert.match(m[2], /animation:\s*none/);
});

test('Lanternetræet lyser, det slukkede træ gør ikke', () => {
  const tegn = sted => LK.art.scene({ sted, himmel: 'dag', alt: 'x' });
  assert.match(tegn('lanternetrae'), /lk-glimt/);
  assert.doesNotMatch(tegn('slukkettrae'), /lk-glimt/);
  assert.match(tegn('slukkettrae'), /#5B6B6A/); // slukkede lanterner
});

test('maane: false fjerner månen fra himlen', () => {
  const maane = s => /#F6E7B8/.test(s);
  for (const himmel of ['nat', 'skumring']) {
    assert.ok(maane(LK.art.scene({ sted: 'lysning', himmel, alt: 'x' })), himmel);
    assert.ok(!maane(LK.art.scene({ sted: 'lysning', himmel, alt: 'x', maane: false })), himmel);
  }
});

test('en gnist kan have en farve; guld er standard', () => {
  const tegn = (farve, taendt = true) => LK.art.scene({ sted: 'hule', himmel: 'nat', alt: 'x', ting: [{ navn: 'gnist', x: 100, y: 100, taendt, farve }] });
  assert.match(tegn(undefined), /#FFE08A/);
  const farver = { blaa: '#4A90D9', roed: '#E0525A', groen: '#4CAF6A', lilla: '#9B6BD6' };
  for (const [navn, hex] of Object.entries(farver)) {
    assert.match(tegn(navn), new RegExp(hex), navn);
    assert.doesNotMatch(tegn(navn), /#FFE08A/, navn);
    assert.match(tegn(hex), new RegExp(hex), hex);
    assert.match(tegn(navn, false), new RegExp(hex), navn + ' slukket');
  }
  assert.deepEqual(Object.keys(LK.art.gnistfarver).sort(), ['blaa', 'groen', 'guld', 'lilla', 'roed']);
  assert.throws(() => tegn('pink'), /Ukendt farve på gnist: pink/);
  assert.throws(() => tegn('#12'), /Ukendt farve på gnist: #12/);
});

test('to farvede gnister i samme billede har hver sit id, og alle url(#...) findes', () => {
  const s = LK.art.scene({ sted: 'hule', himmel: 'nat', alt: 'x', ting: [{ navn: 'gnist', x: 100, y: 100, taendt: true, farve: 'blaa' }, { navn: 'gnist', x: 200, y: 100, taendt: true, farve: 'blaa' }] });
  const ids = [...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const m of s.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(m[1]), m[1]);
});

test('vinduet viser himlen gennem ruden med en karm forrest', () => {
  for (const himmel of ['nat', 'skumring', 'aften', 'dag']) {
    const s = LK.art.scene({ sted: 'vindue', himmel, alt: 'x' });
    assert.match(s, /fill-rule="evenodd"/, himmel);
    assert.doesNotMatch(s, /undefined|NaN/, himmel);
  }
});

test('vinterdelene: snefald, snedrive og en stjerne, der gløder, når den er tændt', () => {
  const tegn = (ting) => LK.art.scene({ sted: 'skovsti', himmel: 'nat', alt: 'x', ting });
  const sne = tegn([{ navn: 'snefald', x: 200, y: 125 }]);
  assert.match(sne, /translate\(200 125\)/);
  assert.ok((sne.match(/lk-glimt/g) || []).length > 20, 'snefnuggene glimter');
  assert.match(tegn([{ navn: 'snedrive', x: 100, y: 230 }]), /#E6EEF7/);
  const glod = s => /url\(#lk\d+-glod\)/.test(s);
  assert.ok(glod(tegn([{ navn: 'stjerne', x: 200, y: 20, taendt: true }])));
  assert.ok(!glod(tegn([{ navn: 'stjerne', x: 200, y: 20 }])));
});

test('snemandens næse kan være en gulerod, en stjerne eller en kogle', () => {
  const tegn = naese => LK.art.scene({ sted: 'lysning', himmel: 'nat', alt: 'x', figurer: [{ navn: 'snemand', x: 200, y: 160, naese }] });
  assert.match(tegn(undefined), /#E8822E/);
  assert.match(tegn('gulerod'), /#E8822E/);
  assert.match(tegn('stjerne'), /#FFE08A/); assert.doesNotMatch(tegn('stjerne'), /#E8822E/);
  assert.match(tegn('kogle'), /#7A4E2C/); assert.doesNotMatch(tegn('kogle'), /#E8822E/);
  assert.throws(() => tegn('agurk'), /Ukendt næse på snemand: agurk/);
});
