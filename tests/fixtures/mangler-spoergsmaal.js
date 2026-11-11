LK.addStory(function (k) {
  return {
    id: 'mangler-spoergsmaal', title: 'Mangler spørgsmål', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Start.'], choices: [{ label: 'Frem', to: 'b' }] },
      b: { title: 'Slut', text: ['Slut.'], ask: 'Hvad?', end: true }
    }
  };
});
