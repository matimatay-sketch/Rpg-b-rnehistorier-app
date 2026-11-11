// Lille månedshistorie til testene, som først udkommer i 2099. Kan kun åbnes med ?preview=juletraeet.
LK.addStory(function (k) {
  return {
    id: 'juletraeet', title: 'Det lille juletræ', tag: 'December', blurb: 'En lille vinterhistorie til testene.', start: 'ju_start',
    scenes: {
      ju_start: { title: 'Et lille træ', text: ['I skoven står et lille træ uden lys.'], ask: 'Hvordan kan vi hjælpe træet?', choices: [{ label: 'Hæng en lanterne op', to: 'ju_lys', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'ju_lys', lose: 'ju_lys' } }] },
      ju_lys: { title: 'Lys i træet', text: ['Træet lyser op.'], ask: 'Hvem kommer for at se?', next: 'ju_slut' },
      ju_slut: { title: 'Glædelig jul', text: ['Alle synger rundt om træet.'], ask: 'Hvad ønsker I jer?', end: true }
    },
    billeder: {
      ju_start: { sted: 'lysning', himmel: 'nat', alt: 'Et lille træ i lysningen om natten.' },
      ju_lys: { sted: 'lysning', himmel: 'nat', alt: 'En lanterne lyser i lysningen.', ting: [{ navn: 'lanterne', x: 200, y: 200, taendt: true }] },
      ju_slut: { sted: 'lanternetrae', himmel: 'nat', alt: 'Lanternetræet lyser.' }
    }
  };
});
