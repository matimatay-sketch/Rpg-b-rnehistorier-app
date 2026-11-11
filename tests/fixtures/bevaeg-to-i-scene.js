LK.addStory(function (k) {
  const b = (n) => ({ goer: 'Hop på ét ben ' + n + ' gange.', stat: 'Mod', target: 6, win: 'e', lose: 'e' });
  return {
    id: 'bevaeg-to-i-scene', title: 'To', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'A', text: ['A.'], ask: 'Hvad tror I?', choices: [{ label: 'Hop et', to: 'e', bevaeg: b(1) }, { label: 'Hop to', to: 'e', bevaeg: b(2) }] },
      e: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
