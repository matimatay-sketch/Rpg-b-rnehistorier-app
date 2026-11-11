// Mester-valget til scenen a har en n(), der kaster. Den køres kun, når en helt har 5 i Mod.
LK.addStory(function (k) {
  return {
    id: 'mester-n', title: 'Mester', tag: 'Test', blurb: 'x', start: 'mn_a',
    scenes: {
      mn_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Frem', to: 'mn_b' }] },
      mn_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    },
    mester: { mn_a: [{ stat: 'Mod', l: 'Gå forrest', to: 'mn_b', n: function (navn) { return navn + k.state.findesIkke.felt; } }] }
  };
});
