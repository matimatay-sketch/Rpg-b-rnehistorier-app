// Tjek af historier: kører scenernes kode under falske tilstande og finder blindgyder, manglende mål osv.
// Brug: node tools/tjek-historier.mjs   (læser stories/katalog.js, tjekker at hver post passer med sin fil, og kræver et billede til hver scene, der kan nås)
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

// En helt med samme felter som motorens helte (makeHero i index.html), med v i hvert træk.
function lavHelt(kit, v) {
  const stats = {};
  kit.stats.forEach(t => { stats[t[0]] = v; });
  return {
    id: 'h1', name: 'Test', skin: '#F6D3B8', cloak: '#2F6A9E', hat: 'ingen', hatCol: '#2C7A4B', hair: 'kort', hairCol: '#2A1D14',
    eyes: 'prik', brows: 'rolig', mouth: 'smil', spots: 'ingen', gear: 'ingen', pat: 'ingen', acc: 'ingen', bgc: 'none',
    stats, pts: 0, lastMonth: 0, bonusMonth: -1, stories: 4, magic: 'gnist', magic2: 'skjold'
  };
}

// Falske tilstande med alle felter, som motorens fresh() laver.
function falskeTilstande(kit, story) {
  const ids = Object.keys(story.scenes || {});
  const stier = [];
  ids.forEach(id => { stier.push(id); const p = story.scenes[id] && story.scenes[id].path; if (p) stier.push(p); });
  const hel = (v) => lavHelt(kit, v);
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
  if (kraevBilleder) koer(ctx, 'art/dele.js');
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

  // Magi- og mester-valgenes funktioner køres kun, når en helt har magien eller 5 i trækket.
  // Kør dem alle under hver falsk tilstand (nye tilstande hver gang, for eff() må ændre tilstanden).
  const korUnder = (id, hvad, fn) => {
    falskeTilstande(kit, story).forEach(st => {
      saet(st);
      try { fn(st, st.players[0]); } catch (e) { meld(id, 'Fejl i koden: ' + (e && e.message) + ' (i ' + hvad + ')'); }
    });
    saet(null);
  };
  Object.keys(story.magi || {}).forEach(id => {
    Object.keys(story.magi[id] || {}).forEach(m => {
      const o = story.magi[id][m];
      if (!o) return;
      korUnder(id, 'magien "' + m + '"', (st, helt) => {
        if (typeof o.show === 'function') o.show();
        if (typeof o.eff === 'function') o.eff(helt);
      });
    });
  });
  Object.keys(story.mester || {}).forEach(id => {
    (story.mester[id] || []).forEach(o => {
      if (!o) return;
      korUnder(id, 'mester-valget "' + o.stat + '"', (st, helt) => {
        if (typeof o.eff === 'function') o.eff(helt, o.stat);
        if (typeof o.n === 'function') o.n('Test');
      });
    });
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

// Posten i kataloget og historien i filen skal passe sammen: motoren læser type og udgivelsesdato fra
// kataloget, men kender kun historien under dens eget id. Et andet id gør fx en månedshistorie til en del af sagaen.
function tjekPost(post, historier, fejl) {
  const navn = post.id || '(uden id)';
  const meld = (besked) => fejl.push({ historie: navn, scene: '', besked });
  if (historier.length === 0) { meld('Filen ' + post.fil + ' registrerer ingen historie. Den skal kalde LK.addStory én gang.'); return; }
  if (historier.length > 1) { meld('Filen ' + post.fil + ' registrerer ' + historier.length + ' historier. Den må kun registrere én.'); return; }
  const st = historier[0];
  if (st.id !== post.id) meld('Historien i filen har id "' + st.id + '", men kataloget kalder den "' + post.id + '". De skal være ens.');
  const type = (x) => x.type || 'saga';
  if (type(st) !== type(post)) meld('Historien i filen har type "' + type(st) + '", men kataloget siger "' + type(post) + '"');
  if ((st.udgives || '') !== (post.udgives || ''))
    meld('Historien i filen har udgives "' + (st.udgives || '') + '", men kataloget siger "' + (post.udgives || '') + '"');
}

// `valg.poster[i]` er katalogets post for `filer[i]` (se tjekKatalog). `valg.kraevBilleder` kræver billeder.
export function tjek(filer, valg = {}) {
  const fejl = [];
  const ejer = {}; // scene-id -> historien, der først brugte det (motoren springer en historie over ved dobbelte id'er)
  for (const [i, fil] of filer.entries()) {
    let l;
    try { l = indlaesFil(fil, valg.kraevBilleder); } catch (e) {
      fejl.push({ historie: fil, scene: '', besked: 'Fejl i koden: ' + (e && e.message) });
      continue;
    }
    if (valg.poster && valg.poster[i]) tjekPost(valg.poster[i], l.historier, fejl);
    for (const story of l.historier) {
      tjekHistorie(story, l.kit, l.saet, l.ctx, valg, fejl);
      const navn = story.id || '(uden id)';
      Object.keys(story.scenes || {}).forEach(id => {
        if (ejer[id]) fejl.push({ historie: navn, scene: id, besked: 'Scene-id findes også i historien ' + ejer[id] });
        else ejer[id] = navn;
        // En månedshistorie må læse vennerne fra sagaen, men aldrig sætte dem.
        const flag = story.scenes[id] && story.scenes[id].flag;
        if (story.type === 'maaned' && flag && l.kit.FRIEND_FLAGS.indexOf(flag) >= 0)
          fejl.push({ historie: navn, scene: id, besked: 'En månedshistorie må ikke sætte venne-flaget "' + flag + '"' });
      });
    }
  }
  return fejl;
}

// Kataloget (fx stories/katalog.js) kalder LK.katalog([...]) fra js/katalog.js.
// Hver post peger på sin fil med `fil`, ellers stories/<id>/historie.js.
function posterFraKatalog(katalog) {
  const ctx = {};
  ctx.self = ctx; ctx.window = ctx;
  createContext(ctx);
  koer(ctx, 'js/katalog.js');
  koer(ctx, katalog);
  return (ctx.LK.katalogPoster || []).map(e => Object.assign({}, e, { fil: e.fil || 'stories/' + e.id + '/historie.js' }));
}

// Tjek alle historierne i et katalog, og at hver post passer med historien i sin fil.
export function tjekKatalog(katalog, valg = {}) {
  const poster = posterFraKatalog(katalog);
  return tjek(poster.map(p => p.fil), Object.assign({}, valg, { poster }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!existsSync(resolve(rod, 'stories/katalog.js'))) { console.error('Kan ikke finde stories/katalog.js'); process.exit(1); }
  const antal = posterFraKatalog('stories/katalog.js').length;
  const fejl = tjekKatalog('stories/katalog.js', { kraevBilleder: true });
  fejl.forEach(f => console.error(f.historie + (f.scene ? ' / ' + f.scene : '') + ': ' + f.besked));
  console.log(fejl.length ? fejl.length + ' fejl' : 'Ingen fejl i ' + antal + ' historier');
  process.exit(fejl.length ? 1 : 0);
}
