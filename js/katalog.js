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

// Ugedage regnes på kalenderdatoen alene (Date.UTC), så tidszonen aldrig kan flytte en dag.
function delePaaDato(dato) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dato || '');
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function ugedag(aar, maaned, dag) { return new Date(Date.UTC(aar, maaned - 1, dag)).getUTCDay(); } // 5 = fredag
function tal2(n) { return String(n).padStart(2, '0'); }

self.LK.erFredag = function (dato) {
  const d = delePaaDato(dato);
  return !!d && ugedag(d[0], d[1], d[2]) === 5;
};

// Alle fredage i måneden (maaned 1-12) som 'ÅÅÅÅ-MM-DD'.
self.LK.fredageIMaaned = function (aar, maaned) {
  const antal = new Date(Date.UTC(aar, maaned, 0)).getUTCDate();
  const liste = [];
  for (let dag = 1; dag <= antal; dag++) {
    if (ugedag(aar, maaned, dag) === 5) liste.push(`${aar}-${tal2(maaned)}-${tal2(dag)}`);
  }
  return liste;
};

self.LK.sidsteFredag = function (aar, maaned) {
  const f = self.LK.fredageIMaaned(aar, maaned);
  return f[f.length - 1];
};

// Næste kapitel i samme serie (kapitel + 1), ellers null.
self.LK.naesteKapitel = function (katalog, entry) {
  if (!entry || !entry.serie) return null;
  return katalog.find(e => e.serie && e.serie.id === entry.serie.id && e.kapitel === entry.kapitel + 1) || null;
};
