LK.addStory(function (k) {
  return {
    id: 'bevaeg-uden-terning', title: 'God', tag: 'Test', blurb: 'En god bevægelse.', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Gå over broen', to: 'b', bevaeg: { goer: 'Gå på tæerne over et smalt bræt uden at vælte.', win: 'c', lose: 'b' } }] },
      b: { title: 'Midt', text: ['Midten.'], ask: 'Hvad nu?', next: 'c' },
      c: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
