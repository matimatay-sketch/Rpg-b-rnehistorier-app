LK.addStory(function (k) {
  return {
    id: 'god', title: 'God', tag: 'Test', blurb: 'En god historie.', start: 'a',
    scenes: {
      a: { title: 'Start', text: function () { return ['Hej ' + k.joinNames(['A', 'B']) + '.']; }, ask: 'Hvad tror I?', choices: [{ label: 'Frem', to: 'b' }, { label: 'Slå', to: 'b', roll: { stat: 'Mod', win: 'c', lose: 'b' } }] },
      b: { title: 'Midt', text: ['Midten.'], ask: 'Hvad nu?', next: 'c' },
      c: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
