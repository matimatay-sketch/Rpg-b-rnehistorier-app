LK.addStory(function (k) {
  return {
    id: 'forkert-billede', title: 'Forkert billede', tag: 'Test', blurb: 'Et billede med et sted, der ikke findes.', start: 'a',
    scenes: {
      a: { title: 'Start', text: ['Start.'], ask: 'Hvad tror I?', end: true }
    },
    billeder: {
      a: { sted: 'mars', himmel: 'nat', alt: 'Et sted, der ikke findes' }
    }
  };
});
