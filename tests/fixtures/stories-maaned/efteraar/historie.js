// Lille månedshistorie til testene. Første scene sætter et venne-flag, som en månedshistorie ikke må gemme.
LK.addStory(function (k) {
  return {
    id: 'efteraar', title: 'Bladenes fest', tag: 'Oktober', blurb: 'En lille efterårshistorie til testene.', start: 'ef_start',
    scenes: {
      ef_start: { title: 'Bladene falder', flag: 'nusseVen', text: ['Bladene danser ned fra træerne.'], ask: 'Hvilken farve har bladene?', choices: [{ label: 'Saml blade', to: 'ef_bunke' }, { label: 'Hop i bladene', key: 'hop', bevaeg: { goer: 'Stå på ét ben og tæl til ti.', stat: 'Mod', target: 6, win: 'ef_hop', lose: 'ef_hopFejl' } }] },
      ef_hop: { title: 'Bladene flyver', text: ['Bladene flyver højt op i luften.'], ask: 'Hvor højt kan blade flyve?', next: 'ef_slut' },
      ef_hopFejl: { title: 'Bums i bunken', text: ['Hov! I lander på numsen i bladene og griner.'], ask: 'Hvad var det sjoveste?', choices: [{ label: 'Gå tilbage til træerne', to: 'ef_start' }] },
      ef_bunke: { title: 'En stor bunke', text: ['Bunken bliver stor og blød.'], ask: 'Hvad gemmer sig i bunken?', next: 'ef_slut' },
      ef_slut: { title: 'Godnat, blade', text: ['Alle går glade hjem.'], ask: 'Hvad var det bedste?', end: true }
    },
    billeder: {
      ef_start: { sted: 'skovsti', himmel: 'dag', alt: 'Blade falder over skovstien.', ting: [{ navn: 'blade', x: 200, y: 200 }] },
      ef_bunke: { sted: 'lysning', himmel: 'dag', alt: 'En stor bunke blade i lysningen.', ting: [{ navn: 'blade', x: 200, y: 210 }] },
      ef_hop: { sted: 'lysning', himmel: 'dag', alt: 'Blade flyver op over lysningen.', ting: [{ navn: 'blade', x: 200, y: 160 }] },
      ef_hopFejl: { sted: 'lysning', himmel: 'dag', alt: 'En bunke blade, nogen er landet i.', ting: [{ navn: 'blade', x: 200, y: 210 }] },
      ef_slut: { sted: 'lysning', himmel: 'aften', alt: 'Lysningen i aftenlys.' }
    }
  };
});
