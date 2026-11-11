LK.addStory(function (k) {
  return {
    id: 'gmaaned', type: 'maaned', udgives: '2026-12-01', title: 'T', tag: 'Test', blurb: 'x', start: 'gm_a',
    scenes: {
      gm_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'gm_b' },
      gm_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
