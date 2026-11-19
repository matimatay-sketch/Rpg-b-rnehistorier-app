// En scene med flere magi-valg, men uden et valg til Skiftemagi.
LK.addStory(function (k) {
  return {
    id: 'magi-uden-skift', title: 'Magi', tag: 'Test', blurb: 'x', start: 'mu_a',
    scenes: {
      mu_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Frem', to: 'mu_b' }] },
      mu_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    },
    magi: { mu_a: { gnist: { l: 'Tænd en gnist', to: 'mu_b' }, dyr: { l: 'Spørg en mus', to: 'mu_b' } } }
  };
});
