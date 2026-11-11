LK.addStory(function (k) {
  return {
    id: 'maaned-uden-bevaeg', type: 'maaned', udgives: '2026-12-01', title: 'T', tag: 'Test', blurb: 'x', start: 'mb_a',
    scenes: {
      mb_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'mb_b' },
      mb_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
