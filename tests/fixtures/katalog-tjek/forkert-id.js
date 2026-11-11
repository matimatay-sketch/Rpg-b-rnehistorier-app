LK.addStory(function (k) {
  return {
    id: 'forkert', type: 'maaned', udgives: '2027-01-01', title: 'T', tag: 'Test', blurb: 'x', start: 'fi_a',
    scenes: {
      fi_a: { title: 'Start', text: ['Hej.'], ask: 'Hvad tror I?', next: 'fi_b' },
      fi_b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
