// Motorens faste data: træk, følgesvende, magier og venne-flag. Klassisk script, sætter self.LK.data.
// Bruges af index.html, js/kit.js og tools/tjek-historier.mjs, så de altid er ens.
self.LK = self.LK || {};

self.LK.data = {
  stats: [['Mod', 'Modig, når det er farligt'], ['List', 'Snedig og kvik'], ['Venlighed', 'God til at lytte og tale pænt'], ['Fantasi', 'Finder på ting, ingen andre tænker på'], ['Humor', 'Kan få alle til at grine'], ['Nysgerrighed', 'Kigger nærmere og stiller spørgsmål']],
  comps: [
    { id: 'raev', name: 'Rikke Ræv', stat: 'List', desc: 'Snedig, hurtig og svær at narre' },
    { id: 'bjorn', name: 'Bastian Bjørn', stat: 'Mod', desc: 'Stor, stærk og aldrig bange' },
    { id: 'pind', name: 'Pip Pindsvin', stat: 'Venlighed', desc: 'Lille, blød og god til at lytte' },
    { id: 'lysorm', name: 'Lulle Lysorm', stat: 'Fantasi', desc: 'Lyser op og drømmer sig til alt muligt' },
    { id: 'krage', name: 'Krage Krølle', stat: 'Humor', desc: 'Fortæller vittigheder og laver pudsige lyde' },
    { id: 'mus', name: 'Mille Mus', stat: 'Nysgerrighed', desc: 'Kigger i alle kroge og spørger om alting' }
  ],
  magics: [
    { id: 'gnist', name: 'Gnistmagi', stat: 'Fantasi', desc: 'Skab en lille ny gnist. Den kan lyse vejen, og i første eventyr kan den blive en ekstra gnist til træet.' },
    { id: 'dyr', name: 'Dyresprog', stat: 'Venlighed', desc: 'Tal med dyr. Det giver nye muligheder, hvor dyrene kan hjælpe.' },
    { id: 'syn', name: 'Skjulte syn', stat: 'Nysgerrighed', desc: 'Se det skjulte. Det åbner skjulte veje og afslører ting, som andre overser.' },
    { id: 'latter', name: 'Latterstøv', stat: 'Humor', desc: 'Strø glitrende støv, så alle får lyst til at grine. Det hjælper ved dem, der er bange, sure eller kede af det.' },
    { id: 'skjold', name: 'Lysskjold', stat: 'Mod', desc: 'Et lysende skjold over holdet. Det giver et ekstra forsøg, når et terningkast mislykkes.' }
  ],
  friendFlags: ['nusseVen', 'nusseHonning', 'mollLoefte', 'tutVen', 'maaneVen', 'vindVen']
};
