// Katalog: udgivelsesdato for historier. Klassisk script, sætter self.LK.
self.LK = self.LK || {};

// stories/katalog.js kalder LK.katalog([...]) med alle historier (Entry-listen). Listen gemmes i LK.katalogPoster.
self.LK.katalog = function (poster) { self.LK.katalogPoster = poster; };

// Lokal dato som 'ÅÅÅÅ-MM-DD'.
self.LK.datoStreng = function (d) {
  const aar = d.getFullYear();
  const maaned = String(d.getMonth() + 1).padStart(2, '0');
  const dag = String(d.getDate()).padStart(2, '0');
  return `${aar}-${maaned}-${dag}`;
};

// Uden udgivelsesdato er historien altid udgivet. Ellers når datoen er nået (lokal tid).
self.LK.erUdgivet = function (entry, nu) {
  if (!entry.udgives) return true;
  return self.LK.datoStreng(nu) >= entry.udgives;
};

// Sagaen først i katalogets rækkefølge, derefter udgivne månedshistorier (nyeste først).
// En historie med id === previewId vises uanset dato.
self.LK.synlige = function (katalog, nu, previewId) {
  const sagaer = katalog.filter(e => e.type === 'saga' && self.LK.erUdgivet(e, nu));
  const maaneder = katalog
    .filter(e => e.type === 'maaned' && (e.id === previewId || self.LK.erUdgivet(e, nu)))
    .slice()
    .sort((a, b) => (a.udgives < b.udgives ? 1 : a.udgives > b.udgives ? -1 : 0));
  return [...sagaer, ...maaneder];
};
