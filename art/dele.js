// Billeddele i billedbogsstil (stil A). Klassisk script, sætter self.LK.art.
// LK.art.scene(spec) sætter et sted, en himmel, ting og figurer sammen til én SVG (viewBox 0 0 400 250).
// Hver del er en funktion (c, ...) => SVG-streng. c.u('navn') giver url(#præfiks-navn) til billedets egne gradienter,
// så flere billeder på samme side aldrig deler id'er.
// Figurer tegnes om (0,0) = midt på kroppen; fødderne står ca. 40-46 længere nede (som Uffe på grenen i skitsen).
// Bevægelse sker via CSS-klasserne lk-blafr (lanterneglød), lk-blink (øjne) og lk-glimt (stjerner, gnister); se LK.art.css.
self.LK = self.LK || {};
(function () {
  const MORK = '#1B1B22';
  const HUMOER = ['glad', 'bekymret', 'overrasket', 'rolig'];

  // ---------- Fælles hjælpere ----------

  const glod = (c, x, y, r, slags = 'guld', klasse = 'lk-blafr') =>
    `<circle${klasse ? ` class="${klasse}"` : ''} cx="${x}" cy="${y}" r="${r}" fill="${c.u(slags === 'guld' ? 'glod' : 'kold')}"/>`;

  // Ansigt, der skifter med humøret. o: { dx, y, r (pupil), hvid (radius på det hvide, 0 = intet),
  // mund: {y, w} | null, naeb: {y, farve} | null, kinder: y | null, bryn: farve }
  function ansigt(h, o) {
    const { dx, y, r } = o, hvid = o.hvid || 0, bryn = o.bryn || MORK, top = y - (hvid || r) - 3;
    let s = '';
    if (hvid) s += `<circle cx="${-dx}" cy="${y}" r="${hvid}" fill="#F7EBD0"/><circle cx="${dx}" cy="${y}" r="${hvid}" fill="#F7EBD0"/>`;
    if (h === 'rolig') {
      // Lukkede, tilfredse øjne.
      s += `<path d="M${-dx - r} ${y} Q${-dx} ${y + r} ${-dx + r} ${y} M${dx - r} ${y} Q${dx} ${y + r} ${dx + r} ${y}" fill="none" stroke="${MORK}" stroke-width="2.2" stroke-linecap="round"/>`;
    } else {
      const pr = h === 'overrasket' ? r * 0.7 : r, g = pr / 3;
      s += `<g class="lk-blink"><circle cx="${-dx}" cy="${y}" r="${pr}" fill="${MORK}"/><circle cx="${dx}" cy="${y}" r="${pr}" fill="${MORK}"/>` +
        `<circle cx="${-dx + g}" cy="${y - g}" r="${g}" fill="#fff"/><circle cx="${dx + g}" cy="${y - g}" r="${g}" fill="#fff"/></g>`;
    }
    const w = Math.max(r, 3);
    if (h === 'bekymret') // Bryn, der løfter sig ind mod midten.
      s += `<path d="M${-dx - w} ${top} L${-dx + w} ${top - 4} M${dx + w} ${top} L${dx - w} ${top - 4}" stroke="${bryn}" stroke-width="2" stroke-linecap="round"/>`;
    if (h === 'overrasket') // Høje, runde bryn.
      s += `<path d="M${-dx - w} ${top - 2} Q${-dx} ${top - 7} ${-dx + w} ${top - 2} M${dx - w} ${top - 2} Q${dx} ${top - 7} ${dx + w} ${top - 2}" fill="none" stroke="${bryn}" stroke-width="2" stroke-linecap="round"/>`;
    if (o.kinder != null && (h === 'glad' || h === 'rolig'))
      s += `<ellipse cx="${-dx - 3}" cy="${o.kinder}" rx="4" ry="2.5" fill="#F29A9A" opacity=".55"/><ellipse cx="${dx + 3}" cy="${o.kinder}" rx="4" ry="2.5" fill="#F29A9A" opacity=".55"/>`;
    if (o.mund) {
      const { y: my, w: mw } = o.mund;
      const d = {
        glad: `M${-mw} ${my} Q0 ${my + mw} ${mw} ${my}`,
        bekymret: `M${-mw} ${my + mw * 0.35} Q0 ${my - mw * 0.35} ${mw} ${my + mw * 0.35}`,
        rolig: `M${-mw * 0.6} ${my} Q0 ${my + mw * 0.4} ${mw * 0.6} ${my}`,
      }[h];
      s += d ? `<path d="${d}" fill="none" stroke="${MORK}" stroke-width="2" stroke-linecap="round"/>`
        : `<ellipse cx="0" cy="${my + 1}" rx="${mw * 0.4}" ry="${mw * 0.55}" fill="#5A2A2A"/>`;
    }
    if (o.naeb) {
      const { y: ny, farve } = o.naeb;
      s += h === 'overrasket'
        ? `<path d="M-5 ${ny - 2} L5 ${ny - 2} L0 ${ny + 4}Z" fill="${farve}"/><path d="M-4 ${ny + 6} L4 ${ny + 6} L0 ${ny + 11}Z" fill="${farve}"/>`
        : `<path d="M-5 ${ny} L5 ${ny} L0 ${ny + 10}Z" fill="${farve}"/>`;
    }
    return s;
  }

  // Trekanttræer: [x, bund, højde] pr. træ.
  const traeer = (farve, liste, ekstra = '') =>
    `<g fill="${farve}"${ekstra}>${liste.map(([x, b, h]) => `<path d="M${x - h * 0.47} ${b} L${x} ${b - h} L${x + h * 0.47} ${b}Z"/>`).join('')}</g>`;
  // De to jordbølger fra skitsen, løftet dy.
  const jord = (p, dy = 0) =>
    `<path d="M0 ${210 + dy} Q100 ${190 + dy} 200 ${205 + dy} T400 ${200 + dy} V250 H0Z" fill="${p.jord1}"/>` +
    `<path d="M0 ${230 + dy} Q120 ${215 + dy} 230 ${228 + dy} T400 ${222 + dy} V250 H0Z" fill="${p.jord2}"/>`;
  // Skitsens skovkant: træer i to lag til venstre og højre.
  const skovkant = (p, ekstra = '') =>
    traeer(p.trae1, [[30, 190, 95], [85, 200, 130], [345, 200, 120], [385, 195, 85]], ekstra) +
    traeer(p.trae2, [[25, 215, 90], [360, 220, 100]], ekstra);
  const totter = (farve, xs, y) =>
    `<g stroke="${farve}" stroke-width="2" stroke-linecap="round" fill="none">${xs.map(x => `<path d="M${x - 4} ${y} l2 -7 M${x} ${y} l0 -9 M${x + 4} ${y} l-2 -7"/>`).join('')}</g>`;
  const siv = (xs, y, p) =>
    `<g>${xs.map((x, i) => `<path d="M${x} ${y} q${i % 2 ? 3 : -3} -18 ${i % 2 ? 1 : -1} -34" stroke="${p.trae2}" stroke-width="2.5" fill="none"/><ellipse cx="${x + (i % 2 ? 1 : -1)}" cy="${y - 30}" rx="3" ry="7" fill="#6B4A2F"/>`).join('')}</g>`;
  const lyskaede = (c, punkter) =>
    punkter.map(([x, y], i) => glod(c, x, y, 9, 'guld', 'lk-glimt').replace('/>', ` style="animation-delay:-${i * 0.7}s"/>`) +
      `<circle cx="${x}" cy="${y}" r="2.6" fill="#FFE08A"/>`).join('');

  // ---------- Himmel ----------

  const PALETTE = {
    nat: { himmel: ['#1E2E52', '#355C78'], trae1: '#24514A', trae2: '#2F6B58', jord1: '#1F4A3C', jord2: '#183A30', sti: '#4E4636', vand: '#2C5470', glans: '#7FA6C4', sten: '#4A4E5E', sump: '#24403A', bjerg: '#3E4E6E', taage: '#C9D6E8' },
    skumring: { himmel: ['#2C3463', '#A9748C'], trae1: '#2E4A55', trae2: '#365E58', jord1: '#2A4A42', jord2: '#203A34', sti: '#6A5848', vand: '#4A5A80', glans: '#C9A0B4', sten: '#5A5468', sump: '#2E4640', bjerg: '#544E72', taage: '#E0CCD8' },
    aften: { himmel: ['#3D4F86', '#F2A96B'], trae1: '#3F6B55', trae2: '#4A7A58', jord1: '#4E7E4E', jord2: '#3E6A42', sti: '#9A7A56', vand: '#5A7AA0', glans: '#F6C99A', sten: '#7A6E6A', sump: '#3E5A44', bjerg: '#6A6488', taage: '#F4E0D0' },
    dag: { himmel: ['#7FC4E6', '#D4F0F2'], trae1: '#4F9A6E', trae2: '#3E8A5C', jord1: '#6DB06A', jord2: '#5A9A58', sti: '#C9A878', vand: '#5AA8D0', glans: '#E6F6FF', sten: '#9A9690', sump: '#5A8A5E', bjerg: '#8A9AB4', taage: '#FFFFFF' },
  };

  const halvmaane = (x, y, r, farve, op = 1) =>
    `<path d="M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.75} ${r} 0 1 1 ${x} ${y - r}Z" fill="${farve}" opacity="${op}"/>`;
  const stjerner = (punkter, op = 1) =>
    `<g fill="#FFF4CF" opacity="${op}">${punkter.map(([x, y, r], i) => `<circle class="lk-glimt" style="animation-delay:-${i * 0.6}s" cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
  const sky = (x, y, s) =>
    `<g fill="#fff" opacity=".85" transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="12"/><circle cx="14" cy="-5" r="15"/><circle cx="30" cy="0" r="11"/><rect x="0" y="0" width="30" height="11"/></g>`;

  const himle = {
    nat: (c, p, maane) => stjerner([[60, 30, 2], [120, 55, 1.6], [210, 24, 2], [270, 70, 1.5], [370, 100, 1.7], [165, 90, 1.2], [25, 75, 1.4]]) +
      (maane ? halvmaane(330, 48, 22, '#F6E7B8') : ''),
    skumring: (c, p, maane) => stjerner([[60, 30, 1.6], [210, 24, 1.6], [150, 60, 1.2]], 0.7) + (maane ? halvmaane(320, 50, 18, '#F6E7B8', 0.8) : ''),
    aften: c => glod(c, 300, 175, 70, 'guld', '') + `<circle cx="300" cy="182" r="26" fill="#FFC977"/>`,
    dag: c => glod(c, 335, 45, 55, 'guld', '') + `<circle cx="335" cy="45" r="20" fill="#FFE07A"/>` + sky(60, 50, 1) + sky(200, 35, 0.75),
  };

  // ---------- Steder ----------

  const steder = {
    skovsti: (c, p) => skovkant(p) + jord(p) +
      `<path d="M150 250 Q185 228 200 212 Q210 203 222 201 L232 202 Q224 212 232 226 Q244 240 280 250Z" fill="${p.sti}"/>` +
      totter(p.trae2, [120, 300, 330], 238),
    lysning: (c, p) =>
      traeer(p.trae1, [[20, 190, 80], [60, 195, 105], [340, 195, 100], [385, 190, 80]]) +
      traeer(p.trae2, [[-5, 205, 85], [400, 205, 90]]) + jord(p, 5) +
      totter(p.trae2, [70, 150, 250, 330], 236) +
      `<g>${[[110, 228, '#F2C14E'], [170, 240, '#E8A0C0'], [285, 232, '#F6F0E0'], [340, 242, '#F2C14E']].map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="3" fill="${f}"/>`).join('')}</g>`,
    baek: (c, p) => skovkant(p) + jord(p) +
      `<path d="M0 220 Q80 206 160 214 T300 210 T400 214 V230 Q300 224 200 232 T0 238Z" fill="${p.vand}"/>` +
      `<g stroke="${p.glans}" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M40 224 h18 M150 220 h24 M260 220 h16 M330 218 h20"/></g>` +
      `<g fill="${p.sten}"><ellipse cx="110" cy="226" rx="10" ry="5"/><ellipse cx="230" cy="223" rx="8" ry="4"/><ellipse cx="370" cy="222" rx="9" ry="4"/></g>`,
    tornekrat: (c, p) => traeer(p.trae1, [[40, 190, 100], [360, 195, 110]]) + jord(p) +
      [[60, 205, 38], [150, 215, 30], [250, 210, 34], [345, 212, 40]].map(([x, y, r]) =>
        `<g><circle cx="${x - r * 0.5}" cy="${y}" r="${r * 0.7}" fill="#3A3A4E"/><circle cx="${x + r * 0.4}" cy="${y - 4}" r="${r * 0.8}" fill="#34344A"/>` +
        `<path d="M${x - r} ${y - 6} l6 -4 l2 6 l6 -5 l2 6 l6 -4 M${x - r * 0.4} ${y - r * 0.6} l5 -5 l3 5 l5 -5 l3 5" stroke="#7A4A3A" stroke-width="1.6" fill="none"/>` +
        `<circle cx="${x + r * 0.5}" cy="${y - r * 0.3}" r="2.4" fill="#C8352E"/><circle cx="${x - r * 0.2}" cy="${y + 4}" r="2.4" fill="#C8352E"/></g>`).join(''),
    hule: (c, p) => traeer(p.trae1, [[25, 190, 90], [380, 190, 90]]) +
      `<path d="M30 250 L30 150 Q60 80 150 75 Q230 60 300 95 Q360 115 370 160 L370 250Z" fill="${p.sten}"/>` +
      `<path d="M140 250 V175 Q140 118 200 118 Q260 118 260 175 V250Z" fill="#14141C"/>` +
      `<g fill="${p.trae2}"><ellipse cx="120" cy="92" rx="22" ry="7"/><ellipse cx="290" cy="104" rx="18" ry="6"/></g>` + jord(p, 12),
    lanternetrae: (c, p) => skovkant(p) + jord(p) +
      `<path d="M178 215 Q190 160 176 112 L224 112 Q210 160 222 215 Q240 222 250 220 L150 220 Q160 222 178 215Z" fill="#5A3E26"/>` +
      `<g fill="${p.trae2}">${[[200, 72, 70], [140, 98, 38], [262, 98, 38], [150, 60, 34], [250, 60, 34], [200, 30, 34], [115, 112, 24], [288, 112, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>` +
      `<g stroke="#3B2A1A" stroke-width="1">${[[120, 110], [165, 92], [200, 108], [240, 90], [285, 112], [190, 62]].map(([x, y]) => `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y}"/>`).join('')}</g>` +
      lyskaede(c, [[120, 112], [165, 94], [200, 110], [240, 92], [285, 114], [190, 64]]),
    taage: (c, p) => skovkant(p, ' opacity=".55"') + jord(p) +
      `<g fill="${p.taage}">${[[80, 175, 120, 14, 0.3], [300, 185, 140, 16, 0.3], [180, 205, 200, 14, 0.35], [60, 225, 120, 12, 0.3], [330, 230, 110, 10, 0.3]]
        .map(([x, y, rx, ry, o]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" opacity="${o}"/>`).join('')}</g>`,
    sump: (c, p) => traeer(p.trae1, [[30, 190, 85], [370, 195, 95]]) + jord(p) +
      `<g fill="${p.sump}"><ellipse cx="110" cy="226" rx="80" ry="12"/><ellipse cx="290" cy="232" rx="90" ry="11"/></g>` +
      `<g fill="${p.trae2}"><path d="M90 225 a8 4 0 1 0 8 -2 l-8 2Z"/><path d="M300 231 a8 4 0 1 0 8 -2 l-8 2Z"/><path d="M140 228 a6 3 0 1 0 6 -2 l-6 2Z"/></g>` +
      siv([30, 38, 190, 198, 370, 378], 226, p) +
      `<path d="M240 215 L242 190 L234 180 M242 190 L252 178" stroke="#4A3A2A" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    maanesoe: (c, p) => traeer(p.trae1, Array.from({ length: 10 }, (_, i) => [i * 44 + 10, 158, 40 + (i % 3) * 12])) +
      `<rect x="0" y="156" width="400" height="70" fill="${p.vand}"/>` +
      `<g stroke="${p.glans}" stroke-linecap="round">${[[300, 166, 30], [300, 178, 22], [300, 190, 34], [300, 202, 18], [300, 214, 26]].map(([x, y, w], i) =>
        `<line class="lk-glimt" style="animation-delay:-${i * 0.5}s" x1="${x - w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y}" stroke-width="2.5"/>`).join('')}</g>` +
      `<path d="M0 226 Q120 216 230 226 T400 222 V250 H0Z" fill="${p.jord2}"/>` + siv([20, 28, 60, 350, 360], 232, p),
    bjerg: (c, p) =>
      `<path d="M-20 210 L110 50 L190 150 L260 70 L420 210Z" fill="${p.bjerg}"/>` +
      `<g fill="#F2F2F6"><path d="M110 50 L88 77 L100 72 L110 82 L120 70 L131 76Z"/><path d="M260 70 L240 95 L252 90 L262 99 L272 88 L282 96Z"/></g>` +
      traeer(p.trae2, [[20, 215, 70], [380, 215, 80]]) + jord(p) +
      `<path d="M200 250 Q170 236 205 226 Q240 216 210 206" stroke="${p.sti}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<g fill="${p.sten}"><ellipse cx="120" cy="232" rx="12" ry="6"/><ellipse cx="300" cy="236" rx="9" ry="5"/></g>`,
    festplads: (c, p) =>
      traeer(p.trae1, [[25, 200, 130], [375, 200, 130]]) + jord(p, 5) +
      `<path d="M30 80 Q200 125 370 80" stroke="#3B2A1A" stroke-width="1.5" fill="none"/>` +
      Array.from({ length: 11 }, (_, i) => {
        const t = (i + 0.5) / 11, x = 30 + 340 * t, y = 80 + 45 * 4 * t * (1 - t) * 0.5;
        return `<path d="M${(x - 9).toFixed(1)} ${y.toFixed(1)} L${(x + 9).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y + 16).toFixed(1)}Z" fill="${['#E35D5B', '#F2C14E', '#5BA4CF', '#7DC47A'][i % 4]}"/>`;
      }).join('') +
      lyskaede(c, [[60, 50], [130, 66], [200, 72], [270, 66], [340, 50]]) +
      `<rect x="150" y="214" width="100" height="10" rx="5" fill="#6B4A2F"/><rect x="160" y="222" width="6" height="12" fill="#5A3E26"/><rect x="234" y="222" width="6" height="12" fill="#5A3E26"/>`,
  };

  // ---------- Figurer ----------

  const figurer = {
    uffe: (c, h) =>
      `<path d="M-24 -40 L-18 -58 L-8 -44Z M24 -40 L18 -58 L8 -44Z" fill="#8E5C34"/>` +
      `<ellipse cx="0" cy="0" rx="32" ry="42" fill="#A86E3E"/><ellipse cx="0" cy="12" rx="20" ry="26" fill="#EBCB98"/>` +
      `<path d="M-32 -2 Q-44 20 -26 36 Q-24 14 -32 -2Z M32 -2 Q44 20 26 36 Q24 14 32 -2Z" fill="#8E5C34"/>` +
      ansigt(h, { dx: 12, y: -16, r: 6, hvid: 13, naeb: { y: -6, farve: '#E3A21A' }, bryn: '#4A2E18' }) +
      `<g stroke="#E3A21A" stroke-width="3" stroke-linecap="round"><path d="M-12 40 l-4 6 M-12 40 l0 7 M-12 40 l4 6"/><path d="M12 40 l-4 6 M12 40 l0 7 M12 40 l4 6"/></g>`,
    nusse: (c, h) =>
      `<g fill="#4A3424"><ellipse cx="-9" cy="40" rx="8" ry="5"/><ellipse cx="9" cy="40" rx="8" ry="5"/></g>` +
      `<path d="M-20 38 Q-22 6 0 2 Q22 6 20 38Z" fill="#7A8699"/>` +
      `<g fill="#F2C9A0"><circle cx="-20" cy="24" r="5"/><circle cx="20" cy="24" r="5"/><circle cx="-17" cy="-6" r="4"/><circle cx="17" cy="-6" r="4"/><circle cx="0" cy="-6" r="17"/></g>` +
      `<path d="M-20 -12 Q-16 -40 4 -58 Q16 -64 24 -52 Q12 -48 10 -40 Q17 -26 20 -12Z" fill="#C8352E"/><circle cx="25" cy="-51" r="3.5" fill="#F4F1EA"/>` +
      ansigt(h, { dx: 7, y: -6, r: 3.2, mund: { y: 3, w: 5 }, kinder: -1, bryn: '#6B4A2F' }),
    moll: (c, h) =>
      `<g fill="#F2A0B0"><ellipse cx="-12" cy="40" rx="9" ry="5"/><ellipse cx="12" cy="40" rx="9" ry="5"/></g>` +
      `<ellipse cx="0" cy="6" rx="28" ry="35" fill="#5E5059"/><ellipse cx="0" cy="14" rx="18" ry="22" fill="#8A7A82"/>` +
      `<ellipse cx="0" cy="-6" rx="14" ry="10" fill="#A8979E"/><ellipse cx="0" cy="-11" rx="6" ry="4.5" fill="#E88A9E"/>` +
      ansigt(h, { dx: 9, y: -21, r: 2.8, hvid: 5, mund: { y: -1, w: 4.5 }, bryn: '#D8C8D0' }) +
      `<g fill="none" stroke="#D9B04A" stroke-width="1.6"><circle cx="-9" cy="-21" r="7"/><circle cx="9" cy="-21" r="7"/><path d="M-2 -22 Q0 -24 2 -22"/></g>` +
      `<rect x="-14" y="16" width="28" height="20" rx="2" fill="#B04A3A"/><rect x="-11" y="18" width="22" height="16" fill="#F4EBD8"/><line x1="0" y1="18" x2="0" y2="34" stroke="#B04A3A"/>` +
      `<g fill="#F2A0B0"><ellipse cx="-16" cy="24" rx="6" ry="5"/><ellipse cx="16" cy="24" rx="6" ry="5"/></g>`,
    tut: (c, h) =>
      `<g fill="#6B4A2F"><ellipse cx="-10" cy="40" rx="9" ry="5"/><ellipse cx="10" cy="40" rx="9" ry="5"/></g>` +
      `<path d="M-38 -14 L-20 -8 L-22 0Z M38 -14 L20 -8 L22 0Z" fill="#8DB36A"/>` +
      `<circle cx="0" cy="8" r="27" fill="#9CC27A"/><path d="M-26 14 Q0 22 26 14 Q24 36 0 38 Q-24 36 -26 14Z" fill="#8A5A34"/>` +
      `<path d="M-24 -6 Q-20 -20 -6 -26 Q2 -50 20 -48 Q8 -40 10 -26 Q22 -20 24 -6 Q0 -12 -24 -6Z" fill="#7A4E2C"/>` +
      `<circle cx="0" cy="-5" r="4.5" fill="#86B064"/>` +
      ansigt(h, { dx: 9, y: -11, r: 3.4, hvid: 5.5, mund: { y: 4, w: 8 }, kinder: 1, bryn: '#4A5A2A' }) +
      glod(c, 30, 14, 14, 'kold', 'lk-glimt') +
      `<path d="M28 24 L28 16 L32 16 L32 24Z" fill="#F4EBD8"/><path d="M22 17 Q30 4 38 17Z" fill="#7FE0D0"/><circle cx="22" cy="22" r="5" fill="#9CC27A"/>`,
    maanen: (c, h) => glod(c, 0, 0, 70, 'kold', '') +
      `<circle cx="0" cy="0" r="40" fill="#F6E7B8"/><g fill="#E8D59A"><circle cx="-20" cy="18" r="6"/><circle cx="22" cy="-22" r="5"/><circle cx="26" cy="16" r="3.5"/></g>` +
      ansigt(h, { dx: 13, y: -6, r: 3.6, mund: { y: 10, w: 9 }, kinder: 4, bryn: '#9A8A5A' }),
    vinden: (c, h) =>
      `<g fill="none" stroke="#DDEBF5" stroke-linecap="round" opacity=".85">` +
      `<path d="M-6 -30 Q30 -32 32 0 Q30 30 -4 30 Q-34 28 -34 0 Q-32 -20 -16 -26" stroke-width="7"/>` +
      `<path d="M-40 22 Q-70 30 -84 14 M-44 -12 Q-70 -20 -90 -6 M30 26 Q50 40 74 30" stroke-width="5"/></g>` +
      `<circle cx="0" cy="0" r="22" fill="#E8F2FA" opacity=".92"/>` +
      ansigt(h, { dx: 8, y: -4, r: 3.2, mund: { y: 7, w: 5 }, kinder: 3, bryn: '#4A6A8A' }),
    raev: (c, h) =>
      `<path d="M14 32 Q50 24 46 -6 Q34 0 32 14 Q24 24 12 22Z" fill="#D9772E"/><path d="M46 -6 Q34 0 37 8 Q46 4 46 -6Z" fill="#F6E7D8"/>` +
      `<path d="M-18 42 Q-22 2 0 -4 Q22 2 18 42Z" fill="#D9772E"/><path d="M-9 42 Q-10 12 0 6 Q10 12 9 42Z" fill="#F6E7D8"/>` +
      `<path d="M-22 -26 L-20 -50 L-6 -34Z M22 -26 L20 -50 L6 -34Z" fill="#D9772E"/><path d="M-20 -50 L-18 -42 L-14 -44Z M20 -50 L18 -42 L14 -44Z" fill="#3B2A1A"/>` +
      `<ellipse cx="0" cy="-18" rx="23" ry="18" fill="#D9772E"/><ellipse cx="0" cy="-9" rx="13" ry="9" fill="#F6E7D8"/><ellipse cx="0" cy="-14" rx="3.2" ry="2.5" fill="${MORK}"/>` +
      ansigt(h, { dx: 9, y: -22, r: 3.2, mund: { y: -7, w: 4.5 }, bryn: '#7A3E14' }),
    bjorn: (c, h) =>
      `<g fill="#5E3E26"><ellipse cx="-16" cy="44" rx="11" ry="6"/><ellipse cx="16" cy="44" rx="11" ry="6"/></g>` +
      `<ellipse cx="0" cy="12" rx="34" ry="36" fill="#7A5134"/><ellipse cx="0" cy="18" rx="21" ry="24" fill="#A9805A"/>` +
      `<g fill="#7A5134"><circle cx="-18" cy="-46" r="9"/><circle cx="18" cy="-46" r="9"/><circle cx="0" cy="-28" r="25"/></g>` +
      `<g fill="#A9805A"><circle cx="-18" cy="-46" r="4.5"/><circle cx="18" cy="-46" r="4.5"/></g>` +
      `<ellipse cx="0" cy="-19" rx="12" ry="9" fill="#C9A27A"/><ellipse cx="0" cy="-23" rx="4.5" ry="3.2" fill="${MORK}"/>` +
      ansigt(h, { dx: 10, y: -33, r: 3.4, mund: { y: -16, w: 5 }, kinder: -24, bryn: '#3B2414' }),
    pind: (c, h) => {
      const pig = Array.from({ length: 17 }, (_, i) => {
        const v = Math.PI * (1.05 + 0.9 * i / 16), r = i % 2 ? 30 : 40;
        return `${(Math.cos(v) * r).toFixed(1)} ${(8 + Math.sin(v) * r).toFixed(1)}`;
      });
      return `<path d="M-34 30 L${pig.join(' L')} L34 30Z" fill="#6B5038"/><ellipse cx="0" cy="18" rx="30" ry="22" fill="#6B5038"/>` +
        `<g fill="#4A3424"><ellipse cx="-12" cy="40" rx="7" ry="4"/><ellipse cx="12" cy="40" rx="7" ry="4"/></g>` +
        `<g fill="#E8C9A0"><circle cx="-15" cy="-6" r="5"/><circle cx="15" cy="-6" r="5"/><ellipse cx="0" cy="12" rx="20" ry="22"/></g>` +
        `<ellipse cx="0" cy="14" rx="3.5" ry="3" fill="${MORK}"/>` +
        ansigt(h, { dx: 8, y: 3, r: 3, mund: { y: 20, w: 5 }, kinder: 13, bryn: '#6B5038' });
    },
    lysorm: (c, h) =>
      glod(c, -34, 30, 18, 'guld', 'lk-glimt') +
      [[-34, 30, 8, '#FFE08A'], [-22, 32, 8.5, '#B8D86A'], [-10, 30, 9, '#B8D86A'], [1, 24, 9.5, '#B8D86A'], [10, 14, 10, '#B8D86A']]
        .map(([x, y, r, f]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`).join('') +
      `<path d="M10 -14 q-4 -10 -10 -12 M22 -14 q4 -10 10 -12" stroke="#7A9A3A" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
      `<circle cx="16" cy="0" r="15" fill="#C8E07A"/>` +
      `<g transform="translate(16 0)">${ansigt(h, { dx: 5.5, y: -3, r: 2.6, mund: { y: 6, w: 4 }, kinder: 3, bryn: '#5A7A2A' })}</g>`,
    krage: (c, h) =>
      `<g stroke="#8A8F9A" stroke-width="2.5" stroke-linecap="round"><path d="M-8 36 l-4 7 M-8 36 l1 8 M8 36 l-1 8 M8 36 l4 7"/></g>` +
      `<path d="M14 18 L34 36 L20 36Z" fill="#20202C"/>` +
      `<ellipse cx="0" cy="8" rx="24" ry="30" fill="#2A2A38"/><path d="M-24 4 Q-34 24 -16 34 Q-16 16 -24 4Z M24 4 Q34 24 16 34 Q16 16 24 4Z" fill="#20202C"/>` +
      `<circle cx="0" cy="-22" r="18" fill="#2A2A38"/>` +
      `<path d="M-2 -38 q-6 -10 2 -14 q8 -2 6 6 q-2 5 -6 2" stroke="#2A2A38" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      ansigt(h, { dx: 7, y: -25, r: 3, hvid: 5.5, naeb: { y: -18, farve: '#9AA0AC' }, bryn: '#BFC4D0' }),
    mus: (c, h) =>
      `<path d="M10 32 Q34 40 30 20 Q28 10 38 8" stroke="#E8A0B0" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<g fill="#A9A2A8"><ellipse cx="0" cy="18" rx="15" ry="20"/><circle cx="-13" cy="-21" r="9"/><circle cx="13" cy="-21" r="9"/><circle cx="0" cy="-8" r="15"/></g>` +
      `<g fill="#F2B8C4"><circle cx="-13" cy="-21" r="5"/><circle cx="13" cy="-21" r="5"/><ellipse cx="-6" cy="38" rx="5" ry="3"/><ellipse cx="6" cy="38" rx="5" ry="3"/></g>` +
      `<ellipse cx="0" cy="22" rx="9" ry="13" fill="#D8D0D4"/><circle cx="0" cy="-3" r="2.5" fill="#E88A9E"/>` +
      `<g stroke="#6A6268" stroke-width=".8"><path d="M-3 -2 l-12 -2 M-3 0 l-12 2 M3 -2 l12 -2 M3 0 l12 2"/></g>` +
      ansigt(h, { dx: 6, y: -11, r: 2.6, mund: { y: 2, w: 3.5 }, kinder: -5, bryn: '#5A5258' }) +
      `<line x1="22" y1="12" x2="30" y2="26" stroke="#6B4A2F" stroke-width="3.5" stroke-linecap="round"/>` +
      `<circle cx="18" cy="4" r="9" fill="#CDE8F4" opacity=".6" stroke="#6B4A2F" stroke-width="2.5"/><circle cx="12" cy="16" r="3.5" fill="#A9A2A8"/>`,
  };

  // ---------- Ting ----------

  const ting = {
    lanterne: (c, t) =>
      `<line x1="0" y1="-24" x2="0" y2="-10" stroke="#3B2A1A" stroke-width="2"/>` + (t ? glod(c, 0, 0, 20) : '') +
      `<rect x="-7" y="-10" width="14" height="18" rx="4" fill="${t ? '#E3A21A' : '#5B6B6A'}"/><rect x="-4" y="-7" width="8" height="12" rx="2" fill="${t ? '#FFE08A' : '#3E4A4A'}"/>`,
    gnist: (c, t) => (t ? glod(c, 0, 0, 14, 'guld', 'lk-glimt') : '') +
      `<path d="M0 -8 Q1.5 -1.5 8 0 Q1.5 1.5 0 8 Q-1.5 1.5 -8 0 Q-1.5 -1.5 0 -8Z" fill="${t ? '#FFE08A' : '#8A8F9A'}"/>`,
    gren: () =>
      `<path d="M-150 6 Q-60 -12 25 0 Q90 8 150 -4" fill="none" stroke="#6B4A2F" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M100 0 Q112 -14 130 -18" fill="none" stroke="#6B4A2F" stroke-width="5" stroke-linecap="round"/>` +
      `<ellipse cx="132" cy="-20" rx="9" ry="5" fill="#4E8B5E" transform="rotate(-20 132 -20)"/>`,
    svamp: (c, t) => (t ? glod(c, 0, -6, 18, 'kold', 'lk-glimt') : '') +
      `<path d="M-5 12 Q-6 0 -4 -2 L4 -2 Q6 0 5 12Z" fill="#F4EBD8"/><path d="M-14 -1 Q-12 -16 0 -16 Q12 -16 14 -1Z" fill="${t ? '#7FE0D0' : '#C8352E'}"/>` +
      `<g fill="#F4F1EA" opacity="${t ? 0.6 : 1}"><circle cx="-6" cy="-8" r="2"/><circle cx="4" cy="-11" r="1.8"/><circle cx="8" cy="-5" r="1.5"/></g>`,
    bog: (c, t) => (t ? glod(c, 0, -2, 26) : '') +
      `<path d="M-23 -4 L0 0 L23 -4 L23 13 L0 16 L-23 13Z" fill="#7A3E2E"/>` +
      `<path d="M0 -2 Q-10 -7 -20 -4 L-20 10 Q-10 7 0 12Z M0 -2 Q10 -7 20 -4 L20 10 Q10 7 0 12Z" fill="#F4EBD8"/>` +
      `<g stroke="#B8AC98" stroke-width="1"><path d="M-16 0 h11 M-16 4 h11 M5 0 h11 M5 4 h11"/></g>`,
    brev: (c, t) => (t ? glod(c, 0, 0, 24) : '') +
      `<rect x="-14" y="-9" width="28" height="18" rx="2" fill="#F4EBD8" stroke="#C9B89A"/>` +
      `<path d="M-14 -9 L0 3 L14 -9" fill="none" stroke="#C9B89A" stroke-width="1.2"/>` +
      `<path d="M0 7 Q-6 1 -3.5 -1 Q-1.5 -2.5 0 0 Q1.5 -2.5 3.5 -1 Q6 1 0 7Z" fill="#C8352E"/>`,
  };

  // ---------- Samling ----------

  let taeller = 0;
  const escape = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hent = (samling, navn, slags) => {
    if (!Object.prototype.hasOwnProperty.call(samling, navn)) throw new Error(`Ukendt ${slags}: ${navn}`);
    return samling[navn];
  };
  const placer = (d, indhold) => `<g transform="translate(${d.x} ${d.y}) scale(${d.skala == null ? 1 : d.skala})">${indhold}</g>`;

  function scene(spec) {
    const sted = hent(steder, spec.sted, 'sted'), p = hent(PALETTE, spec.himmel, 'himmel');
    const figs = (spec.figurer || []).map(f => {
      const humoer = f.humoer || 'glad';
      if (!HUMOER.includes(humoer)) throw new Error(`Ukendt humør: ${humoer}`);
      return [f, hent(figurer, f.navn, 'figur'), humoer];
    });
    const tings = (spec.ting || []).map(t => [t, hent(ting, t.navn, 'ting')]);
    const pre = `lk${++taeller}-`, c = { u: n => `url(#${pre}${n})` };
    const harMaane = figs.some(([f]) => f.navn === 'maanen');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" role="img" aria-label="${escape(spec.alt)}">` +
      `<defs><linearGradient id="${pre}himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.himmel[0]}"/><stop offset="1" stop-color="${p.himmel[1]}"/></linearGradient>` +
      `<radialGradient id="${pre}glod"><stop offset="0" stop-color="#FFD66B" stop-opacity=".85"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="${pre}kold"><stop offset="0" stop-color="#DFF6F0" stop-opacity=".7"/><stop offset="1" stop-color="#DFF6F0" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="400" height="250" fill="${c.u('himmel')}"/>` + himle[spec.himmel](c, p, !harMaane) + sted(c, p) +
      tings.map(([t, tegn]) => placer(t, tegn(c, !!t.taendt))).join('') +
      figs.map(([f, tegn, humoer]) => placer(f, tegn(c, humoer))).join('') + '</svg>';
  }

  const css = '.lk-blink{transform-box:fill-box;transform-origin:center;animation:lk-blink 5s infinite}' +
    '@keyframes lk-blink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}' +
    '.lk-blafr{animation:lk-blafr 2.4s ease-in-out infinite alternate}@keyframes lk-blafr{0%{opacity:.7}50%{opacity:1}100%{opacity:.85}}' +
    '.lk-glimt{animation:lk-glimt 3s ease-in-out infinite}@keyframes lk-glimt{0%,100%{opacity:1}50%{opacity:.35}}' +
    '@media (prefers-reduced-motion:reduce){.lk-blink,.lk-blafr,.lk-glimt{animation:none}}';

  self.LK.art = { scene, steder, figurer, ting, css };
})();
