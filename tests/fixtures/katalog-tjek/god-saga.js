LK.addStory(function (k) {
  return {
    id: 'gsaga', title: 'T', tag: 'Test', blurb: 'x', start: 'gs_a',
    scenes: {
      gs_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'gs_b' },
      gs_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
