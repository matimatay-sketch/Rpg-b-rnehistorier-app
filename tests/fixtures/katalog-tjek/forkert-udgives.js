LK.addStory(function (k) {
  return {
    id: 'fudg', type: 'maaned', udgives: '2027-03-15', title: 'T', tag: 'Test', blurb: 'x', start: 'fu_a',
    scenes: {
      fu_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', choices: [{ label: 'Stå på ét ben', to: 'fu_b', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'fu_b', lose: 'fu_b' } }] },
      fu_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
