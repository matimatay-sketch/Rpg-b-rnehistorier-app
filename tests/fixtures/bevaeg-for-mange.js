LK.addStory(function (k) {
  const b = (n) => ({ goer: 'Hop på ét ben ' + n + ' gange.', stat: 'Mod', target: 6, win: 'e', lose: 'e' });
  return {
    id: 'bevaeg-for-mange', title: 'For mange', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'A', text: ['A.'], ask: 'Hvad tror I?', choices: [{ label: 'Hop et', to: 'b', bevaeg: b(1) }] },
      b: { title: 'B', text: ['B.'], ask: 'Hvad nu?', choices: [{ label: 'Hop to', to: 'c', bevaeg: b(2) }] },
      c: { title: 'C', text: ['C.'], ask: 'Hvad nu?', choices: [{ label: 'Hop tre', to: 'e', bevaeg: b(3) }] },
      e: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
