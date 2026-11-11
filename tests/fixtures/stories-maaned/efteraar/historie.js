// Lille månedshistorie til testene. Første scene sætter et venne-flag, som en månedshistorie ikke må gemme.
LK.addStory(function (k) {
  return {
    id: 'efteraar', title: 'Bladenes fest', tag: 'Oktober', blurb: 'En lille efterårshistorie til testene.', start: 'ef_start',
    scenes: {
      ef_start: { title: 'Bladene falder', flag: 'nusseVen', text: ['Bladene danser ned fra træerne.'], ask: 'Hvilken farve har bladene?', choices: [{ label: 'Saml blade', to: 'ef_bunke' }, { label: 'Hop i bladene', to: 'ef_bunke' }] },
      ef_bunke: { title: 'En stor bunke', text: ['Bunken bliver stor og blød.'], ask: 'Hvad gemmer sig i bunken?', next: 'ef_slut' },
      ef_slut: { title: 'Godnat, blade', text: ['Alle går glade hjem.'], ask: 'Hvad var det bedste?', end: true }
    },
    billeder: {
      ef_start: { sted: 'skovsti', himmel: 'dag', alt: 'Blade falder over skovstien.', ting: [{ navn: 'blade', x: 200, y: 200 }] },
      ef_bunke: { sted: 'lysning', himmel: 'dag', alt: 'En stor bunke blade i lysningen.', ting: [{ navn: 'blade', x: 200, y: 210 }] },
      ef_slut: { sted: 'lysning', himmel: 'aften', alt: 'Lysningen i aftenlys.' }
    }
  };
});
