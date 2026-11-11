// Lille kapitel 1 af 3 i testserien Stjernestien (se ../katalog.js).
LK.addStory(function (k) {
  return {
    id: 'sti1', type: 'maaned', udgives: '2099-12-11', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 1, kapitler: 3,
    title: 'Stjernestien 1', tag: 'Kapitel 1', blurb: 'Kapitel 1 af testserien.', start: 'sti1_start',
    scenes: {
      sti1_start: { title: 'Stien 1 begynder', text: ['En stjerne lyser over stien.'], ask: 'Hvor fører stien hen?', choices: [{ label: 'Gå ad stien', to: 'sti1_slut' }, { label: 'Hop over stenen', key: 'hop', bevaeg: { goer: 'Hop på ét ben tre gange.', stat: 'Mod', target: 6, win: 'sti1_slut', lose: 'sti1_slut' } }] },
      sti1_slut: { title: 'Stien 1 slutter', text: ['Alle går glade hjem.'], ask: 'Hvad var det bedste?', end: true }
    },
    billeder: {
      sti1_start: { sted: 'skovsti', himmel: 'aften', alt: 'Skovstien i aftenlys.' },
      sti1_slut: { sted: 'lysning', himmel: 'aften', alt: 'Lysningen i aftenlys.' }
    }
  };
});
