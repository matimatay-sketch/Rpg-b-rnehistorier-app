LK.addStory(function (k) {
  return {
    id: 'manglende-maal', title: 'Manglende mål', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Start.'], ask: 'Hvad?', choices: [{ label: 'Frem', to: 'b' }, { label: 'Væk', to: 'findesikke' }] },
      b: { title: 'Slut', text: ['Slut.'], ask: 'Hvad?', end: true }
    }
  };
});
