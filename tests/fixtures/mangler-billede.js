LK.addStory(function (k) {
  return {
    id: 'mangler-billede', title: 'Mangler billede', tag: 'Test', blurb: 'Kun den ene scene har et billede.', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Start.'], ask: 'Hvad tror I?', next: 'b' },
      b: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    },
    billeder: {
      a: { sted: 'skovsti', himmel: 'nat', alt: 'En mørk skovsti', figurer: [{ navn: 'uffe', x: 200, y: 140 }] }
    }
  };
});
