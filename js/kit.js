// Kit: hjælpefunktioner, som historiekoden må bruge. Klassisk script, sætter self.LK.lavKit.
// hentState giver den aktuelle spiltilstand. data = { stats, comps, magics, friendFlags } fra js/data.js,
// som skal være indlæst før.
self.LK = self.LK || {};

self.LK.lavKit = function (hentState, data) {
  data = data || self.LK.data;
  var k = {};
  Object.defineProperty(k, 'state', { get: function () { return hentState(); }, enumerable: true });

  k.stats = data.stats;
  k.comps = data.comps;
  k.magics = data.magics;
  k.FRIEND_FLAGS = data.friendFlags;

  k.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  k.gen = function (n) { return /[sxz]$/i.test(n) ? n : n + 's'; };
  k.friendNames = function (f) { var o = []; if (f && (f.nusseVen || f.nusseHonning)) o.push('Nusse'); if (f && f.mollLoefte) o.push('Moll'); if (f && f.tutVen) o.push('Tut'); if (f && f.maaneVen) o.push('Månen'); if (f && f.vindVen) o.push('Vinden'); return o; };
  k.crew = function () { return k.friendNames(hentState().flags).filter(function (n) { return n !== 'Månen' && n !== 'Vinden'; }); };
  k.gnistNames = function () { return hentState().gnistList.map(function (g) { return (g.name || '').trim() || g.def; }); };
  k.availG = function () { var s = hentState(); return s.gnisterIn.filter(function (n) { return !s.usedG[n]; }); };
  k.friendCount = function () { return k.crew().length; };
  k.joinNames = function (a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' og ' + a[a.length - 1] : a.join(''); };
  k.partyStat = function (stat) { var s = hentState(), m = 0; s.players.forEach(function (p) { var v = (p.stats && p.stats[stat]) || 0; if (v > m) m = v; }); return m + (s.compStat === stat ? 1 : 0); };
  k.lockTxt = function (stat, n) { return k.partyStat(stat) >= n ? null : 'Kræver ' + stat + ' ' + n; };
  k.friendLines = function () {
    var f = hentState().flags, o = [];
    if (f.nusseVen) o.push('Nusse kommer først, nu med sin hue på. Han bærer sin røde gnist som en lille lygte og vinker genert.');
    else if (f.nusseHonning) o.push('Bag et træ tøver Nusse. Så putter han honningkagen i lommen og træder frem. &laquo;Må jeg være med?&raquo; hvisker han.');
    if (f.mollLoefte) o.push('Moll titter op af jorden med en støvet bog under armen. &laquo;I lovede mig en historie!&raquo; siger hun.');
    if (f.tutVen) o.push('Tut hopper ind med en armfuld lysende svampe og griner så højt, at hatten ryster.');
    if (f.maaneVen) o.push('Månen kigger ned med et stort smil og lægger sølvlys over hele flokken.');
    return o;
  };
  return k;
};
