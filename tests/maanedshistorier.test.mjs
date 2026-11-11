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

test('Julestjernen: i venne-slutningen kommer Nusse ikke frem, som var han ny', () => {
  for (const flags of [{ nusseVen: true }, { nusseHonning: true }, { nusseVen: true, mollLoefte: true, tutVen: true, maaneVen: true, vindVen: true }]) {
    const { story } = hent('stories/2026-12-julestjernen/historie.js', flags);
    const t = tekst(story.scenes.snEndVenner);
    assert.doesNotMatch(t, /Må jeg være med|Nusse kommer først|Bag et træ tøver Nusse/);
    assert.match(t, /hvisker Nusse/);
  }
  const { story } = hent('stories/2026-12-julestjernen/historie.js', { mollLoefte: true, tutVen: true });
  const t = tekst(story.scenes.snEndVenner);
  assert.match(t, /Moll/); assert.match(t, /Tut/);
});
