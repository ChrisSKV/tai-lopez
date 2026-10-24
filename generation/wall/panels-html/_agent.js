// Shared helpers for the agent-wall panels (rendered by ../render.cjs, never shipped to the page).
// 1) <div class="face" data-shell="#fff" data-rim="#EF4444" data-eye="#fff" data-mood="happy" data-icon="mail"
//         data-extra="antenna|headset|ears" data-shadow=".2"></div>
//    becomes a friendly AI agent head: glossy shell, black LCD screen, glowing dot-matrix eyes
//    (same family as the 3D renders in assets/agents/white-*.png).
// 2) <i class="ic" data-i="mail"></i> becomes a 24x24 stroke icon (currentColor).
(function () {
  let uid = 0;
  const ICON = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.8 7.2l8.2 6 8.2-6"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    calok: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M9 14.6l2 2 4-4.2"/>',
    chat: '<path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
    plane: '<path d="M10.5 13.5L3 11l1.5-1.5 8 1 4.5-4.5a2 2 0 0 1 3 3L15.5 13.5l1 8L15 23l-2.5-7.5-3 3V21l-1.5 1-1-3.5L3.5 17.5l1-1.5h2.5z"/>',
    bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7.5H17"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    box: '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9"/>',
    truck: '<path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5V16h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    spark: '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    home: '<path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5"/>',
    bolt: '<path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
    flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
    archive: '<rect x="3" y="4.5" width="18" height="4.5" rx="1.5"/><path d="M5 9v10h14V9M10 13h4"/>',
    reply: '<path d="M10 7L4.5 12 10 17M4.5 12H14a5.5 5.5 0 0 1 5.5 5.5"/>',
    send: '<path d="M4 12l16-8-6 16-3-6z"/>',
    block: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    gift: '<rect x="3.5" y="9" width="17" height="4" rx="1"/><path d="M5 13v7.5h14V13M12 9v11.5M12 9C10 5 6.5 5.5 7.5 8 8 9 12 9 12 9zM12 9c2-4 5.5-3.5 4.5-1C16 9 12 9 12 9z"/>',
    tooth: '<path d="M7.5 4C5 4 4 6 4 8.5c0 3 1.5 4 2 7.5.4 3 1 4.5 2 4.5 1.5 0 1.5-5 4-5s2.5 5 4 5c1 0 1.6-1.5 2-4.5.5-3.5 2-4.5 2-7.5C20 6 19 4 16.5 4c-2 0-3 1-4.5 1S9.5 4 7.5 4z"/>',
    cart: '<path d="M3 4h2.5l2.2 11h10.6L20.5 7.5H6.3"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    run: '<circle cx="14.5" cy="4.5" r="2"/><path d="M8 21l3-6 3 2.5V22M6.5 11.5L9.5 8h5l2.5 4 3 1M11 15l1.5-7"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7l1.5-3h4l1.5 3"/><circle cx="12" cy="13.5" r="3.5"/>',
    note: '<path d="M5 3.5h14v17H5z"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  };
  const svgIcon = (n, sw = 2.2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON[n] || ''}</svg>`;
  window.svgIcon = svgIcon;

  // ---- dot-matrix eyes (hand-drawn bitmaps, '#' = lit pixel)
  const EYES = {
    round: ['..###..', '.#####.', '###..##', '###..##', '#######', '#######', '#######', '.#####.', '..###..'],
    look:  ['..###..', '.#####.', '##..###', '##..###', '#######', '#######', '#######', '.#####.', '..###..'],
    big:   ['..####..', '.######.', '####..##', '####..##', '########', '########', '.######.', '..####..'],
    happy: ['..####..', '.######.', '###..###', '##....##', '##....##'],
    focus: ['.##.', '####', '####', '####', '####', '####', '####', '.##.'],
  };
  function cells(mood, right) {
    const m = mood === 'wink' ? (right ? 'happy' : 'round') : (EYES[mood] ? mood : 'round');
    const bm = EYES[m], h = bm.length, w = bm[0].length, out = [];
    bm.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') out.push([i - (w - 1) / 2, j - (h - 1) / 2]); }));
    return out;
  }
  function mouth(kind, cx, cy, col) {
    if (!kind || kind === 'none') return '';
    if (kind === 'smile') {
      let s = ''; const p = 6.2;
      [[-2, 0], [-1, 1], [0, 1], [1, 1], [2, 0]].forEach(([x, y]) => { s += `<rect x="${cx + x * p - 2.6}" y="${cy + y * p - 2.6}" width="5.2" height="5.2" rx="1.3"/>`; });
      return `<g fill="${col}">${s}</g>`;
    }
    return `<g transform="translate(${cx - 15} ${cy - 13}) scale(1.25)" fill="none" stroke="${col}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" opacity=".92">${ICON[kind] || ''}</g>`;
  }
  const shade = (hex, k) => { // k<0 darker, k>0 lighter
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = (v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
    return '#' + [f(r), f(g), f(b)].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  };
  function face(o) {
    const id = 'f' + (uid++);
    const shell = o.shell || '#FFFFFF', rim = o.rim || shade(shell, -0.12), eye = o.eye || '#FFFFFF';
    const hi = shade(shell, 0.45), lo = shade(shell, -0.2);
    const extra = (o.extra || '').split(/[ ,|]+/);
    const p = 4.7, d = 3.9; let dots = '';
    [[-1, 73], [1, 127]].forEach(([s, ex]) => cells(o.mood || 'round', s > 0).forEach(([x, y]) => {
      dots += `<rect x="${(ex + x * p - d / 2).toFixed(2)}" y="${(88 + y * p - d / 2).toFixed(2)}" width="${d}" height="${d}" rx="1"/>`;
    }));
    let pre = '', post = '';
    if (extra.includes('antenna')) pre += `<rect x="96" y="2" width="8" height="26" rx="4" fill="${lo}"/><circle cx="100" cy="8" r="9" fill="${o.led || rim}"/><circle cx="97" cy="5" r="3" fill="#fff" opacity=".55"/>`;
    if (extra.includes('ears')) pre += `<rect x="4" y="78" width="20" height="50" rx="10" fill="${lo}"/><rect x="176" y="78" width="20" height="50" rx="10" fill="${lo}"/>`;
    if (extra.includes('headset')) {
      pre += `<path d="M20 84 C20 -16 180 -16 180 84" fill="none" stroke="${lo}" stroke-width="9" stroke-linecap="round"/>`;
      post += `<rect x="170" y="72" width="26" height="58" rx="13" fill="${o.led || rim}"/><path d="M184 128 C184 170 160 180 128 180" fill="none" stroke="${lo}" stroke-width="6" stroke-linecap="round"/><rect x="108" y="172" width="28" height="16" rx="8" fill="${o.led || rim}"/>`;
    }
    const sh = o.shadow != null ? +o.shadow : 0.22;
    return `<svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible">
<defs>
<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".5" stop-color="${shell}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
<radialGradient id="${id}c" cx=".32" cy=".22" r="1"><stop offset="0" stop-color="#2A2A33"/><stop offset=".55" stop-color="#0D0D11"/><stop offset="1" stop-color="#050506"/></radialGradient>
<filter id="${id}g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
<filter id="${id}b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>
${sh > 0 ? `<ellipse cx="100" cy="190" rx="70" ry="9" fill="#000" opacity="${sh}" filter="url(#${id}b)"/>` : ''}
${pre}
<rect x="14" y="20" width="172" height="164" rx="56" fill="url(#${id}s)"/>
<path d="M44 30 C70 22 130 22 156 30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>
<rect x="30" y="38" width="140" height="130" rx="42" fill="${rim}"/>
<rect x="36" y="44" width="128" height="118" rx="37" fill="url(#${id}c)"/>
<path d="M52 62 C58 52 70 50 84 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".14"/>
<g fill="${eye}" filter="url(#${id}g)">${dots}</g>
<g fill="${eye}">${dots}</g>
${mouth(o.icon || 'smile', 100, 138, eye)}
${post}
</svg>`;
  }
  window.agentFace = face;
  const run = () => {
    document.querySelectorAll('.face').forEach(el => {
      el.innerHTML = face({ shell: el.dataset.shell, rim: el.dataset.rim, eye: el.dataset.eye, mood: el.dataset.mood, icon: el.dataset.icon, extra: el.dataset.extra, led: el.dataset.led, shadow: el.dataset.shadow });
    });
    document.querySelectorAll('i.ic').forEach(el => { el.innerHTML = svgIcon(el.dataset.i, el.dataset.w || 2.2); });
    // <i class="sp" data-c="#F59E0B" data-t="#E5E7EB" data-p=".3"></i> -> a frozen "working on it" ring
    document.querySelectorAll('i.sp').forEach(el => {
      const c = el.dataset.c || '#F59E0B', t = el.dataset.t || 'rgba(0,0,0,.1)', f = +(el.dataset.p || .3), L = 2 * Math.PI * 17;
      el.innerHTML = `<svg viewBox="0 0 44 44" width="100%" height="100%"><circle cx="22" cy="22" r="17" fill="none" stroke="${t}" stroke-width="6"/><circle cx="22" cy="22" r="17" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(L * f).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 22 22)"/></svg>`;
    });
    // <span class="ok"></span> -> green check disc
    document.querySelectorAll('.ok:empty').forEach(el => { el.innerHTML = svgIcon('check', 3.4); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
