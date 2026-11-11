// Tjek af historier: kører scenernes kode under falske tilstande og finder blindgyder, manglende mål osv.
// Brug: node tools/tjek-historier.mjs   (læser stories/katalog.js)
import { readFileSync, existsSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rod = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function koer(ctx, fil) {
  runInContext(readFileSync(resolve(rod, fil), 'utf8'), ctx, { filename: fil });
}

function nyKontekst() {
  const ctx = {};
  ctx.self = ctx;
  ctx.window = ctx;
  createContext(ctx);
  koer(ctx, 'js/data.js');
  koer(ctx, 'js/kit.js');
  return ctx;
}

// Falske tilstande med alle felter, som motorens fresh() laver.
function falskeTilstande(kit, story) {
  const ids = Object.keys(story.scenes || {});
  const stier = [];
  ids.forEach(id => { stier.push(id); const p = story.scenes[id] && story.scenes[id].path; if (p) stier.push(p); });
  const hel = (v) => {
    const stats = {};
    kit.stats.forEach(t => { stats[t[0]] = v; });
    return { id: 'h1', name: 'Test', stats };
  };
  const basis = (over) => Object.assign({
    players: [hel(0)], comp: null, compName: '', compStat: '', visited: [], gnists: 0, feather: false, featherUsed: false,
    turn: 0, rolls: 0, wrong: {}, scene: null, awarded: false, flags: {}, remembered: [], story: 'lantern', gnistList: [],
    usedG: {}, lastUse: '', gnisterIn: [], magicUsed: {}, magicNote: '', maxUsed: {}, mester: null
  }, over);
  const gnister = (n) => {
    const liste = [], navne = [];
    for (let i = 0; i < n; i++) { liste.push({ key: 'g' + i, c: 'test', def: 'Gnist ' + (i + 1), name: '' }); navne.push('Gnist ' + (i + 1)); }
    return basis({ gnists: n, gnistList: liste, gnisterIn: navne.slice(0, 4) });
  };
  const flags = {};
  kit.FRIEND_FLAGS.forEach(f => { flags[f] = true; });
  return [
    basis({}),
    basis({ players: [hel(5)], flags, remembered: kit.friendNames(flags), mester: { name: 'Test', stat: 'Mod' } }),
    basis({ visited: stier }),
    gnister(0), gnister(1), gnister(3)
  ];
}

// Hent historier fra en fil. Returnerer { historier, kit, ctx, sæt } hvor sæt sætter aktuel tilstand.
function indlaesFil(fil, kraevBilleder) {
  const ctx = nyKontekst();
  if (kraevBilleder && existsSync(resolve(rod, 'js/art.js'))) koer(ctx, 'js/art.js');
  let aktuel = null;
  const kit = ctx.LK.lavKit(() => aktuel);
  const lavere = [];
  ctx.LK.addStory = (fn) => { lavere.push(fn); };
  koer(ctx, fil);
  const historier = lavere.map(fn => fn(kit));
  return { ctx, kit, historier, saet: (s) => { aktuel = s; } };
}

function tjekHistorie(story, kit, saet, ctx, valg, fejl) {
  const navn = story.id || '(uden id)';
  const meld = (scene, besked) => {
    if (!fejl.some(f => f.historie === navn && f.scene === scene && f.besked === besked)) fejl.push({ historie: navn, scene, besked });
  };
  const scener = story.scenes || {};
  const ids = Object.keys(scener);
  const tilstande = falskeTilstande(kit, story);
  const maal = {};      // scene -> Set af mål
  const valgIAlle = {}; // scene -> sand hvis der er valg i alle tilstande
  const titlerOk = {};
  const askOk = {};
  const tekst = (v) => (Array.isArray(v) ? v.join(' ') : v == null ? '' : String(v)).trim();

  ids.forEach(id => {
    const sc = scener[id];
    maal[id] = new Set();
    valgIAlle[id] = true;
    askOk[id] = true;
    const laeg = (v) => { if (v) maal[id].add(v); };
    ((story.magi || {})[id] ? Object.values(story.magi[id]) : []).forEach(o => laeg(o && o.to));
    ((story.mester || {})[id] || []).forEach(o => laeg(o && o.to));
    laeg(sc.next);
    tilstande.forEach(st => {
      saet(st);
      let valgListe = [];
      try {
        if (typeof sc.text === 'function') sc.text();
        if (typeof sc.ask === 'function') sc.ask();
        if (typeof sc.ask !== 'function' ? !tekst(sc.ask) : !tekst(sc.ask())) askOk[id] = false;
        valgListe = sc.dyn ? sc.dyn() : (sc.choices || (sc.next ? [{ to: sc.next }] : []));
      } catch (e) {
        meld(id, 'Fejl i koden: ' + (e && e.message));
        valgListe = null;
      }
      if (valgListe) {
        if (!valgListe.length) valgIAlle[id] = false;
        valgListe.forEach(c => {
          laeg(c.to);
          if (c.roll) { laeg(c.roll.win); laeg(c.roll.lose); }
        });
      }
    });
    saet(null);
  });

  // Mål der ikke findes
  ids.forEach(id => {
    maal[id].forEach(m => { if (!scener[m]) meld(id, 'Valget fører til "' + m + '", som ikke findes'); });
  });
  if (!scener[story.start]) meld('', 'Startscenen "' + story.start + '" findes ikke');

  // Nåbare scener fra start
  const naabar = new Set();
  const stak = scener[story.start] ? [story.start] : [];
  while (stak.length) {
    const id = stak.pop();
    if (naabar.has(id)) continue;
    naabar.add(id);
    maal[id].forEach(m => { if (scener[m]) stak.push(m); });
  }

  // Scener hvorfra en slutning kan nås
  const kanSlutte = new Set(ids.filter(id => scener[id].end));
  let aendret = true;
  while (aendret) {
    aendret = false;
    ids.forEach(id => {
      if (!kanSlutte.has(id) && [...maal[id]].some(m => kanSlutte.has(m))) { kanSlutte.add(id); aendret = true; }
    });
  }

  ids.filter(id => naabar.has(id)).forEach(id => {
    const sc = scener[id];
    if (!tekst(sc.title)) meld(id, 'Mangler titel');
    if (!askOk[id]) meld(id, 'Mangler spørgsmål til børnene');
    if (!sc.end && !valgIAlle[id]) meld(id, 'Blindgyde: ingen valg');
    if (!kanSlutte.has(id)) meld(id, 'Kan ikke nå en slutning');
    if (valg.kraevBilleder) {
      const spec = (story.billeder || {})[id];
      if (!spec) meld(id, 'Mangler billede');
      else {
        try {
          if (!ctx.LK.art || !ctx.LK.art.scene) throw new Error('LK.art.scene findes ikke');
          ctx.LK.art.scene(spec);
        } catch (e) { meld(id, 'Billedfejl: ' + (e && e.message)); }
      }
    }
  });
}

export function tjek(filer, valg = {}) {
  const fejl = [];
  for (const fil of filer) {
    let l;
    try { l = indlaesFil(fil, valg.kraevBilleder); } catch (e) {
      fejl.push({ historie: fil, scene: '', besked: 'Fejl i koden: ' + (e && e.message) });
      continue;
    }
    for (const story of l.historier) tjekHistorie(story, l.kit, l.saet, l.ctx, valg, fejl);
  }
  return fejl;
}

// Kataloget er stories/katalog.js, som kalder LK.katalog([...]) fra js/katalog.js.
// Hver post peger på sin fil med `fil`, ellers stories/<id>/historie.js.
function filerFraKatalog() {
  const sti = resolve(rod, 'stories/katalog.js');
  if (!existsSync(sti)) return null;
  const ctx = {};
  ctx.self = ctx; ctx.window = ctx;
  createContext(ctx);
  koer(ctx, 'js/katalog.js');
  koer(ctx, 'stories/katalog.js');
  const kat = ctx.LK.katalogPoster || [];
  return kat.map(e => e.fil || 'stories/' + e.id + '/historie.js');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const filer = filerFraKatalog();
  if (!filer) { console.error('Kan ikke finde stories/katalog.js'); process.exit(1); }
  const fejl = tjek(filer, { kraevBilleder: process.argv.includes('--billeder') });
  fejl.forEach(f => console.error(f.historie + (f.scene ? ' / ' + f.scene : '') + ': ' + f.besked));
  console.log(fejl.length ? fejl.length + ' fejl' : 'Ingen fejl i ' + filer.length + ' historier');
  process.exit(fejl.length ? 1 : 0);
}
