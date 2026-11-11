// En månedshistorie, der sætter et venne-flag (forbudt) og et eget flag (tilladt).
LK.addStory(function (k) {
  return {
    id: 'venneflag', type: 'maaned', udgives: '2026-12-01', title: 'Venneflag', tag: 'Test', blurb: 'x', start: 'vf_a',
    scenes: {
      vf_a: { title: 'Start', flag: 'tutVen', text: ['Hej.'], ask: 'Hvad tror I?', next: 'vf_b' },
      vf_b: { title: 'Midt', flag: 'eget', text: ['Midt.'], ask: 'Hvad nu?', next: 'vf_c' },
      vf_c: { title: 'Slut', text: ['Slut.'], ask: 'Var det godt?', end: true }
    }
  };
});
