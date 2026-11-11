// Lille kapitel 3 af 3 i testserien Stjernestien (se ../katalog.js).
LK.addStory(function (k) {
  return {
    id: 'sti3', type: 'maaned', udgives: '2099-12-25', serie: { id: 'stjernestien', titel: 'Stjernestien' }, kapitel: 3, kapitler: 3,
    title: 'Stjernestien 3', tag: 'Kapitel 3', blurb: 'Kapitel 3 af testserien.', start: 'sti3_start',
    scenes: {
      sti3_start: { title: 'Stien 3 begynder', text: ['En stjerne lyser over stien.'], ask: 'Hvor fører stien hen?', choices: [{ label: 'Gå ad stien', to: 'sti3_slut' }, { label: 'Hop over stenen', key: 'hop', bevaeg: { goer: 'Hop på ét ben tre gange.', stat: 'Mod', target: 6, win: 'sti3_slut', lose: 'sti3_slut' } }] },
      sti3_slut: { title: 'Stien 3 slutter', text: ['Alle går glade hjem.'], ask: 'Hvad var det bedste?', end: true }
    },
    billeder: {
      sti3_start: { sted: 'skovsti', himmel: 'aften', alt: 'Skovstien i aftenlys.' },
      sti3_slut: { sted: 'lysning', himmel: 'aften', alt: 'Lysningen i aftenlys.' }
    }
  };
});
