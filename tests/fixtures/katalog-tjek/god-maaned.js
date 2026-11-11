LK.addStory(function (k) {
  return {
    id: 'gmaaned', type: 'maaned', udgives: '2026-12-01', title: 'T', tag: 'Test', blurb: 'x', start: 'gm_a',
    scenes: {
      gm_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Stå på ét ben', to: 'gm_b', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'gm_b', lose: 'gm_b' } }] },
      gm_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
