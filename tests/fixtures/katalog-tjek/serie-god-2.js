LK.addStory(function (k) {
  return {
    id: 'sg2', type: 'maaned', udgives: '2026-11-20', serie: { id: 'sg', titel: 'Serien' }, kapitel: 2, kapitler: 3,
    title: 'T', tag: 'Test', blurb: 'x', start: 'sg2_a',
    scenes: {
      sg2_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Stå på ét ben', to: 'sg2_b', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'sg2_b', lose: 'sg2_b' } }] },
      sg2_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
