LK.addStory(function (k) {
  return {
    id: 'fudg', type: 'maaned', udgives: '2027-03-15', title: 'T', tag: 'Test', blurb: 'x', start: 'fu_a',
    scenes: {
      fu_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'fu_b' },
      fu_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
