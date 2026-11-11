// Magien til scenen a har en show(), der kaster. Den køres kun, når en helt har gnistmagi.
LK.addStory(function (k) {
  return {
    id: 'magi-show', title: 'Magi', tag: 'Test', blurb: 'x', start: 'ms_a',
    scenes: {
      ms_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Frem', to: 'ms_b' }] },
      ms_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    },
    magi: { ms_a: { gnist: { l: 'Tænd en gnist', to: 'ms_b', show: function () { return k.state.findesIkke.felt; } } } }
  };
});
