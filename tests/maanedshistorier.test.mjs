import { test } from 'node:test';
import assert from 'node:assert';
import { indlaes } from './helpers/indlaes.mjs';

// Månedshistorierne i stories/katalog.js med en tilstand, hvor familien har alle sagaens venner.
const { LK: kat } = indlaes(['js/katalog.js', 'stories/katalog.js']);
const maaneder = kat.katalogPoster.filter(e => e.type === 'maaned');

function hent(fil, flags) {
  const ctx = indlaes(['js/data.js', 'js/kit.js']);
  const state = {
    players: [{ id: 'h1', name: 'Asta', stats: {} }], comp: 'bjorn', compName: 'Bastian Bjørn', compStat: 'Mod', visited: [], gnists: 0,
    feather: false, featherUsed: false, turn: 0, rolls: 0, wrong: {}, scene: null, awarded: false, flags, remembered: [], story: 'x',
    gnistList: [], usedG: {}, lastUse: '', gnisterIn: [], magicUsed: {}, magicNote: '', maxUsed: {}, mester: null
  };
  const kit = ctx.LK.lavKit(() => state);
  let story;
  ctx.LK.addStory = fn => { story = fn(kit); };
  indlaes([fil], ctx);
  return { story, kit };
}
const tekst = (sc) => [].concat(typeof sc.text === 'function' ? sc.text() : sc.text).join(' ');

test('månedshistorierne genbruger ikke sagaens venne-linjer (k.friendLines)', () => {
  for (const flag of ['nusseVen', 'nusseHonning', 'mollLoefte', 'tutVen', 'maaneVen']) {
    for (const e of maaneder) {
      const { story, kit } = hent(e.fil, { [flag]: true });
      const saga = kit.friendLines();
      assert.ok(saga.length > 0);
      for (const [id, sc] of Object.entries(story.scenes)) {
        const t = tekst(sc);
        for (const linje of saga) assert.ok(!t.includes(linje), e.id + ' / ' + id + ' bruger sagaens linje for ' + flag);
      }
    }
  }
});

test('Julestjernen: i kapitlernes venne-slutning kommer Nusse ikke frem, som var han ny', () => {
  const kapitler = maaneder.filter(e => e.serie && e.serie.id === '2026-12-julestjernen');
  assert.ok(kapitler.length > 0);
  for (const e of kapitler) {
    for (const flags of [{ nusseVen: true }, { nusseHonning: true }, { nusseVen: true, mollLoefte: true, tutVen: true, maaneVen: true, vindVen: true }]) {
      const { story } = hent(e.fil, flags);
      const id = Object.keys(story.scenes).find(s => s.endsWith('EndVenner'));
      assert.ok(id, e.id + ' har en venne-slutning');
      const t = tekst(story.scenes[id]);
      assert.doesNotMatch(t, /Må jeg være med|Nusse kommer først|Bag et træ tøver Nusse/, e.id);
      assert.match(t, /Nusse/, e.id);
    }
    // Vennerne fra sagaen nævnes, når familien har dem.
    const { story } = hent(e.fil, { mollLoefte: true, tutVen: true });
    const id = Object.keys(story.scenes).find(s => s.endsWith('EndVenner'));
    assert.match(tekst(story.scenes[id]), /Moll|Tut/, e.id);
  }
});
