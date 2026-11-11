LK.addStory(function (k) {
  return {
    id: 'sg1', type: 'maaned', udgives: '2026-11-13', serie: { id: 'sg', titel: 'Serien' }, kapitel: 1, kapitler: 3,
    title: 'T', tag: 'Test', blurb: 'x', start: 'sg1_a',
    scenes: {
      sg1_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Stå på ét ben', to: 'sg1_b', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'sg1_b', lose: 'sg1_b' } }] },
      sg1_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
