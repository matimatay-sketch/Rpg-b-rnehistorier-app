// Magi og mester-valg med show(), eff() og n(), der virker, når de får en helt som motorens.
LK.addStory(function (k) {
  return {
    id: 'magi-eff', title: 'Magi', tag: 'Test', blurb: 'x', start: 'me_a',
    scenes: {
      me_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Frem', to: 'me_b' }] },
      me_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    },
    magi: { me_a: { gnist: { l: 'Tænd en gnist', to: 'me_b', show: function () { return !k.state.flags.x; }, eff: function (h) { k.state.flags['brugt_' + h.magic] = h.stats.Mod >= 0; } } } },
    mester: { me_a: [{ stat: 'Mod', l: 'Gå forrest', to: 'me_b', eff: function (h, stat) { h.stats[stat] += 0; k.state.flags.mester = h.name; }, n: function (navn) { return navn + ' gik forrest.'; } }] }
  };
});
