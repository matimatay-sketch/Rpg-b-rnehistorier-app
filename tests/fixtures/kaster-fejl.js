LK.addStory(function (k) {
  return {
    id: 'kaster-fejl', title: 'Kaster fejl', tag: 'Test', blurb: 'x', start: 'a',
    scenes: {
      a: { title: 'Start', text: function () { return [k.state.findesIkke.felt]; }, ask: 'Hvad?', choices: [{ label: 'Frem', to: 'b' }] },
      b: { title: 'Slut', text: ['Slut.'], ask: 'Hvad?', end: true }
    }
  };
});
