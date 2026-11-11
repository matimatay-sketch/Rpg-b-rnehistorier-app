LK.addStory(function (k) {
  return {
    id: 'ftype', udgives: '2027-02-01', title: 'T', tag: 'Test', blurb: 'x', start: 'ft_a',
    scenes: {
      ft_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'ft_b' },
      ft_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
