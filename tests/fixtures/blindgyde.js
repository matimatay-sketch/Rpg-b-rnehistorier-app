LK.addStory(function (k) {
  return {
    id: 'blindgyde', title: 'Blindgyde', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Start.'], ask: 'Hvad?', choices: [{ label: 'Frem', to: 'b' }, { label: 'Slut', to: 'c' }] },
      b: { title: 'Ingen vej', text: ['Her er intet valg.'], ask: 'Hvad nu?' },
      c: { title: 'Slut', text: ['Slut.'], ask: 'Hvad?', end: true }
    }
  };
});
