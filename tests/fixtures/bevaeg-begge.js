LK.addStory(function (k) {
  return {
    id: 'bevaeg-begge', title: 'Begge', tag: 'Test', blurb: 'Terning og bevægelse i ét valg.', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Gå over broen', to: 'c', roll: { stat: 'Mod', target: 6, win: 'c', lose: 'b' }, bevaeg: { goer: 'Gå på tæerne.', stat: 'Mod', target: 6, win: 'c', lose: 'b' } }] },
      b: { title: 'Midt', text: ['Midten.'], ask: 'Hvad nu?', next: 'c' },
      c: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
