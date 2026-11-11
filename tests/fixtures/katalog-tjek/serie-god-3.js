LK.addStory(function (k) {
  return {
    id: 'sg3', type: 'maaned', udgives: '2026-11-27', serie: { id: 'sg', titel: 'Serien' }, kapitel: 3, kapitler: 3,
    title: 'T', tag: 'Test', blurb: 'x', start: 'sg3_a',
    scenes: {
      sg3_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Stå på ét ben', to: 'sg3_b', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'sg3_b', lose: 'sg3_b' } }] },
      sg3_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
