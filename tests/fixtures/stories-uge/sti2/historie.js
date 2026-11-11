// Lille kapitel 2 af 3 i testserien Stjernestien (se ../katalog.js).
LK.addStory(function (k) {
  return {
    id: 'sti2', type: 'maaned', udgives: '2099-12-18', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 2, kapitler: 3,
    title: 'Stjernestien 2', tag: 'Kapitel 2', blurb: 'Kapitel 2 af testserien.', start: 'sti2_start',
    scenes: {
      sti2_start: { title: 'Stien 2 begynder', text: ['En stjerne lyser over stien.'], ask: 'Hvor fører stien hen?', choices: [{ label: 'Gå ad stien', to: 'sti2_slut' }, { label: 'Hop over stenen', key: 'hop', bevaeg: { goer: 'Hop på ét ben tre gange.', stat: 'Mod', target: 6, win: 'sti2_slut', lose: 'sti2_slut' } }] },
      sti2_slut: { title: 'Stien 2 slutter', text: ['Alle går glade hjem.'], ask: 'Hvad var det bedste?', end: true }
    },
    billeder: {
      sti2_start: { sted: 'skovsti', himmel: 'aften', alt: 'Skovstien i aftenlys.' },
      sti2_slut: { sted: 'lysning', himmel: 'aften', alt: 'Lysningen i aftenlys.' }
    }
  };
});
