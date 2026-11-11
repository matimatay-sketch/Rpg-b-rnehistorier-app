LK.addStory(function (k) {
  return {
    id: 'toa', title: 'T', tag: 'Test', blurb: 'x', start: 'ta_a',
    scenes: {
      ta_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'ta_b' },
      ta_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
LK.addStory(function (k) {
  return {
    id: 'tob', title: 'T', tag: 'Test', blurb: 'x', start: 'tb_a',
    scenes: { tb_a: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true } }
  };
});
