/* =====================================================================
   MINI ME CHARACTERS
   Each scene draws a little Kagan and animates him every frame.
   Put  <svg data-scene="about" viewBox="0 0 240 225"></svg>  anywhere and
   this file fills it in. Scenes: about, engineering, internship,
   volleyball, resume, contact, corner.
   Arm angles: 0 = hanging down, 90 = straight forward, 180 = straight up.
   ===================================================================== */
(function(){
  const D = Math.PI / 180;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const hand = (a, len = 36) => [64 + len * Math.sin(a * D), 106 + len * Math.cos(a * D)];

  function kid({front = '', prop = ''} = {}){
    return `
    <ellipse cx="61" cy="247" rx="24" ry="4" fill="rgba(0,0,0,.18)"/>
    <path class="lb" stroke="#e1ae84" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path class="lf" stroke="#ecbb92" stroke-width="9" stroke-linecap="round" fill="none"/>
    <rect x="39" y="240" width="15" height="8" rx="4" fill="#ffffff" stroke="#c5cfe6"/><rect x="66" y="240" width="17" height="8" rx="4" fill="#ffffff" stroke="#c5cfe6"/>
    <g class="up">
      <g transform="translate(58 106)"><g class="ab"><line x1="0" y1="0" x2="0" y2="36" stroke="#e1ae84" stroke-width="7" stroke-linecap="round"/></g></g>
      <path d="M45 148 h32 l3 20 h-16 l-3 -6 l-3 6 h-16 z" fill="#1b40ad"/>
      <rect x="45" y="100" width="32" height="54" rx="10" fill="#fff"/>
      <path d="M45 110 q0 -10 10 -10 h12 q10 0 10 10 v5 h-32 z" fill="#c5cfe6"/>
      <text x="61" y="141" text-anchor="middle" font-family="Archivo,Inter,Arial" font-weight="700" font-size="18" fill="#1b40ad">9</text>
      <rect x="56" y="88" width="10" height="12" fill="#e8b98f"/>
      <circle cx="61" cy="76" r="15" fill="#f0c49c"/>
      <circle cx="70" cy="82" r="3" fill="#e9a48f" opacity=".6"/><circle cx="53" cy="82" r="3" fill="#e9a48f" opacity=".6"/>
      <path d="M46 74 q0 -18 16 -18 q15 0 16 14 q-6 -6 -12 -5 q-4 5 -12 3 q-4 3 -8 6 z" fill="#1b1b1f"/>
      <circle cx="67" cy="78" r="1.8" fill="#222"/><circle cx="57" cy="78" r="1.8" fill="#222"/>
      <path d="M57 85 q4 3.5 9 0" stroke="#9b4a3a" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      ${prop}
      <g transform="translate(64 106)"><g class="af"><line x1="0" y1="0" x2="0" y2="36" stroke="#f0c49c" stroke-width="7" stroke-linecap="round"/>${front}</g></g>
    </g>`;
  }
  function grab(root){ const q = s => root.querySelector(s); return {af:q('.af'), ab:q('.ab'), up:q('.up'), lf:q('.lf'), lb:q('.lb')}; }
  function pose(k, af, ab, c = 0){
    k.af.setAttribute('transform', `rotate(${-af})`);
    k.ab.setAttribute('transform', `rotate(${-ab})`);
    k.up.setAttribute('transform', `translate(0 ${c})`);
    k.lf.setAttribute('d', `M66 ${160 + c} L${70 + c * .9} ${200 + c * .5} L72 244`);
    k.lb.setAttribute('d', `M54 ${160 + c} L${50 + c * .6} ${200 + c * .5} L48 244`);
  }
  const BALL = `<circle r="9" fill="#ffc933" stroke="#0d2057" stroke-width="1.3"/><path d="M-9 0 q9 -4 18 0" stroke="#1b40ad" stroke-width="2.4" fill="none"/><path d="M0 -9 q-5 9 0 18" stroke="#1b40ad" stroke-width="2.4" fill="none"/><path d="M-6 -7 q8 4 13 13" stroke="#1b40ad" stroke-width="2" fill="none"/>`;
  const GROUND = `<ellipse cx="120" cy="210" rx="96" ry="10" fill="rgba(0,0,0,.12)"/>`;

  /* Volleyball: bump the ball up, set it to yourself, repeat */
  function volley(k, ball, shadow, peaks = [-40, -95]){
    const BUMP = {x:94, y:134, arm:72, c:8}, SET = {x:72, y:50, arm:168, c:0}, durs = [1.1, 1.3];
    return t => {
      const T = durs[0] + durs[1], cyc = t % T, hop = cyc < durs[0] ? 0 : 1;
      const tt = hop ? (cyc - durs[0]) / durs[1] : cyc / durs[0];
      const from = hop ? SET : BUMP, to = hop ? BUMP : SET, peak = peaks[hop];
      const ctl = 2 * peak - (from.y + to.y) / 2;                      // quadratic = real projectile arc
      const x = lerp(from.x, to.x, tt), y = (1 - tt) ** 2 * from.y + 2 * tt * (1 - tt) * ctl + tt * tt * to.y;
      ball.setAttribute('transform', `translate(${x} ${y}) rotate(${t * 360})`);
      if (shadow){ shadow.setAttribute('cx', x); shadow.setAttribute('rx', 4 + 6 * (y + 110) / 360); }
      const follow = Math.max(0, 1 - tt / .15), prep = ease(clamp((tt - .25) / .55));
      pose(k, lerp(from.arm, to.arm, prep) + follow * 12, lerp(from.arm, to.arm, prep) - 6, lerp(from.c, to.c, prep) * (1 - follow * .6));
    };
  }

  const SCENES = {
    /* ---- About me: waving hello ---- */
    about(svg){
      svg.innerHTML = GROUND + `
        <g class="bubble"><path d="M138 78 l-12 16 l24 -14z" fill="#fff" stroke="#c5cfe6" stroke-width="2"/>
          <rect x="124" y="30" width="110" height="50" rx="18" fill="#fff" stroke="#c5cfe6" stroke-width="2"/>
          <rect x="134" y="74" width="20" height="6" fill="#fff"/>
          <text x="179" y="52" text-anchor="middle" font-family="Archivo,Inter,Arial" font-weight="600" font-size="15" fill="#101d45">Hi! I'm</text>
          <text x="179" y="70" text-anchor="middle" font-family="Archivo,Inter,Arial" font-weight="700" font-size="16" fill="#1b40ad">Kagan</text></g>
        <path class="heart" d="M0 3 C-6 -3 -10 2 0 10 C10 2 6 -3 0 3z" fill="#ffc933"/>
        <g transform="translate(40 27) scale(.72)">${kid()}</g>`;
      const k = grab(svg), b = svg.querySelector('.bubble'), h = svg.querySelector('.heart');
      return t => {
        pose(k, 150 + 22 * Math.sin(t * 9), 10 + 4 * Math.sin(t * 2), 1.5 + 1.5 * Math.sin(t * 3));
        b.setAttribute('transform', `translate(0 ${2 * Math.sin(t * 2)})`);
        const f = (t % 2.6) / 2.6;
        h.setAttribute('transform', `translate(${112 + 8 * Math.sin(f * 9)} ${100 - 80 * f}) scale(${.8 + f * .6})`);
        h.setAttribute('opacity', (1 - f).toFixed(2));
      };
    },

    /* ---- Engineering: stacking LEGO next to a little VEX robot ---- */
    engineering(svg){
      const colors = ['#ffc933', '#8a8f84', '#ffd866', '#7b8471', '#3e4336', '#ffc933'];
      let bricks = '';
      colors.forEach((c, i) => bricks += `<g class="brick" data-i="${i}"><rect x="100" y="${193 - i * 13}" width="30" height="13" rx="2" fill="${c}" stroke="rgba(0,0,0,.15)"/><rect x="105" y="${189 - i * 13}" width="7" height="4" rx="1" fill="${c}"/><rect x="118" y="${189 - i * 13}" width="7" height="4" rx="1" fill="${c}"/></g>`);
      svg.innerHTML = GROUND + bricks + `
        <g class="robot">
          <rect x="-16" y="-26" width="32" height="18" rx="4" fill="#8a8f84" stroke="#1b40ad" stroke-width="2"/>
          <rect x="-10" y="-22" width="8" height="6" rx="1" fill="#f5f5f4"/>
          <line x1="8" y1="-26" x2="8" y2="-36" stroke="#1b40ad" stroke-width="2"/><circle class="led" cx="8" cy="-38" r="3" fill="#ffc933"/>
          <g class="rarm"><line x1="16" y1="-18" x2="30" y2="-18" stroke="#1b40ad" stroke-width="3" stroke-linecap="round"/></g>
          <g class="w1" transform="translate(-9 -6)"><circle r="6" fill="#3b3f4f"/><line x1="-5" y1="0" x2="5" y2="0" stroke="#aaa"/></g>
          <g class="w2" transform="translate(9 -6)"><circle r="6" fill="#3b3f4f"/><line x1="-5" y1="0" x2="5" y2="0" stroke="#aaa"/></g>
        </g>
        <g transform="translate(6 27) scale(.72)">${kid({front:'<rect x="-7" y="34" width="14" height="8" rx="2" fill="#ffd866"/>'})}</g>`;
      const k = grab(svg), bs = [...svg.querySelectorAll('.brick')], r = svg.querySelector('.robot'),
            ra = svg.querySelector('.rarm'), w1 = svg.querySelector('.w1'), w2 = svg.querySelector('.w2'), led = svg.querySelector('.led');
      return t => {
        const cyc = t % 7.6, n = Math.floor(cyc), f = cyc % 1;
        bs.forEach((b, i) => {
          if (i < n){ b.setAttribute('opacity', 1); b.removeAttribute('transform'); }
          else if (i === n){ b.setAttribute('opacity', f); b.setAttribute('transform', `translate(0 ${-(1 - ease(f)) * 22})`); }
          else b.setAttribute('opacity', 0);
        });
        if (n >= 6) pose(k, 160 + 10 * Math.sin(t * 10), 160, 0);        // tower done: celebrate!
        else pose(k, 35 + 55 * Math.sin(Math.PI * f), 20, 6);
        const x = 190 + 20 * Math.sin(t * 1.2);
        r.setAttribute('transform', `translate(${x} 208)`);
        const spin = -Math.cos(t * 1.2) * t * 200;
        w1.setAttribute('transform', `translate(-9 -6) rotate(${spin})`); w2.setAttribute('transform', `translate(9 -6) rotate(${spin})`);
        ra.setAttribute('transform', `rotate(${-25 * (1 + Math.sin(t * 3)) / 2} 16 -18)`);
        led.setAttribute('opacity', (t * 2 % 1) < .5 ? 1 : .3);
      };
    },

    /* ---- Internship: hammering the driving-range cover together ---- */
    internship(svg){
      svg.innerHTML = GROUND + `
        <rect x="112" y="198" width="104" height="8" rx="3" fill="#9db58f"/>
        <rect x="107" y="112" width="6" height="94" fill="#9aa5b8"/><rect x="211" y="112" width="6" height="94" fill="#9aa5b8"/>
        <line x1="113" y1="140" x2="211" y2="118" stroke="#b9c2d0" stroke-width="2"/><line x1="113" y1="118" x2="211" y2="140" stroke="#b9c2d0" stroke-width="2"/>
        <path d="M98 118 L162 82 L226 118 L226 124 L162 89 L98 124 Z" fill="#c9d3df" stroke="#8a96a8" stroke-width="1.5"/>
        <path d="M114 112 L162 85 M130 104 L162 86 M146 95 L162 86 M178 95 L162 86 M194 104 L162 86 M210 112 L162 85" stroke="#a9b4c4" stroke-width="1"/>
        <line x1="196" y1="198" x2="196" y2="160" stroke="#3b3f4f" stroke-width="2"/><path d="M196 160 l18 6 l-18 6z" fill="#ffc933"/>
        <circle cx="172" cy="196" r="3.5" fill="#fff" stroke="#ccc"/>
        <g class="spark" transform="translate(106 116)"><path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2Z" fill="#ffd866"/></g>
        <g transform="translate(26 27) scale(.72)">${kid({front:'<line x1="0" y1="32" x2="0" y2="56" stroke="#a0673a" stroke-width="4" stroke-linecap="round"/><rect x="-9" y="52" width="18" height="9" rx="2" fill="#6b7280"/>'})}</g>`;
      const k = grab(svg), sp = svg.querySelector('.spark'), P = .85;
      return t => {
        const f = (t % P) / P; let a;
        if (f < .65) a = 70 + 85 * ease(f / .65); else { const g = (f - .65) / .35; a = 155 - 85 * g * g; }
        pose(k, a, 30, 2);
        const s = f < .2 ? 1 - f / .2 : 0;
        sp.setAttribute('opacity', s.toFixed(2)); sp.setAttribute('transform', `translate(106 116) scale(${.6 + (1 - s) * .8})`);
      };
    },

    /* ---- Volleyball: bump-set-bump on his own ---- */
    volleyball(svg){
      svg.innerHTML = GROUND + `
        <line x1="224" y1="206" x2="224" y2="96" stroke="#3b3f4f" stroke-width="3"/>
        <rect x="208" y="100" width="16" height="34" fill="url(#mesh)" stroke="#fff" stroke-width="2"/>
        <defs><pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0 L5 5 M5 0 L0 5" stroke="#9aa5b8" stroke-width=".6"/></pattern></defs>
        <g transform="translate(62 52) scale(.62)"><ellipse class="bs" cx="94" cy="247" rx="7" ry="2.5" fill="rgba(0,0,0,.2)"/>${kid()}<g class="ball">${BALL}</g></g>`;
      return volley(grab(svg), svg.querySelector('.ball'), svg.querySelector('.bs'), [-12, -62]);
    },

    /* ---- Resume: checking off his resume ---- */
    resume(svg){
      let rows = '';
      [98, 109, 120, 131].forEach((y, i) => rows += `<rect x="99" y="${y - 5}" width="7" height="7" rx="1.5" fill="#fff" stroke="#c9b3bc"/><line x1="110" y1="${y - 1}" x2="${132 - i * 3}" y2="${y - 1}" stroke="#d6c9ce" stroke-width="2.5" stroke-linecap="round"/><path class="chk" d="M99 ${y - 2} l3 3 l6 -7" stroke="#1b40ad" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
      const paper = `<g class="paper"><rect x="93" y="76" width="46" height="62" rx="4" fill="#fff" stroke="#c5cfe6" stroke-width="2"/><rect x="99" y="82" width="26" height="5" rx="2" fill="#ffc933"/>${rows}
        <g class="star" transform="translate(136 78)"><path d="M0 -9 L2.6 -2.8 L9 -2.8 L3.8 1.2 L5.8 7.6 L0 3.8 L-5.8 7.6 L-3.8 1.2 L-9 -2.8 L-2.6 -2.8Z" fill="#ffd866" stroke="#0d2057"/></g></g>`;
      svg.innerHTML = GROUND + `
        <g opacity=".9"><rect x="176" y="168" width="44" height="34" rx="4" fill="#ece6df" stroke="#8a8f84" stroke-width="2"/><rect x="172" y="160" width="20" height="10" rx="3" fill="#ece6df" stroke="#8a8f84" stroke-width="2"/></g>
        <g transform="translate(42 27) scale(.72)">${kid({prop:paper})}</g>`;
      const k = grab(svg), cs = [...svg.querySelectorAll('.chk')], st = svg.querySelector('.star');
      return t => {
        const cyc = t % 4.2, n = Math.floor(cyc / .75);
        cs.forEach((c, i) => c.setAttribute('opacity', i < n ? 1 : 0));
        const sv = n >= 4 ? Math.min(1, (cyc - 3) / .25) : 0;
        st.setAttribute('transform', `translate(136 78) scale(${sv}) rotate(${t * 60})`);
        pose(k, 75 + 3 * Math.sin(t * 2.5), 72, 1 + Math.sin(t * 2.5));
      };
    },

    /* ---- Contact: throwing a paper plane into the mailbox ---- */
    contact(svg){
      svg.innerHTML = GROUND + `
        <rect x="203" y="158" width="7" height="48" fill="#a0673a"/>
        <path d="M184 160 v-18 q0 -14 14 -14 h18 q14 0 14 14 v18 z" fill="#ffc933" stroke="#1b40ad" stroke-width="2"/>
        <rect x="186" y="142" width="14" height="4" rx="2" fill="#0d1b2e"/>
        <g class="flag"><line x1="0" y1="0" x2="0" y2="-20" stroke="#3b3f4f" stroke-width="2.5"/><rect x="0" y="-20" width="12" height="8" fill="#ffc933"/></g>
        <text class="sent" x="186" y="112" font-family="Archivo,Inter,Arial" font-weight="600" font-size="13" fill="#1b40ad">sent!</text>
        <g class="plane"><path d="M-10 -5 L11 0 L-10 5 L-5 0Z" fill="#fff" stroke="#1b40ad" stroke-width="1.6" stroke-linejoin="round"/><path d="M-5 0 L11 0" stroke="#1b40ad" stroke-width="1"/></g>
        <g transform="translate(14 27) scale(.72)">${kid()}</g>`;
      const k = grab(svg), pl = svg.querySelector('.plane'), fl = svg.querySelector('.flag'), sent = svg.querySelector('.sent');
      const tx = 14, ty = 27, s = .72, P0 = [tx + 96.6 * s, ty + 90.8 * s], P1 = [130, 0], P2 = [192, 144];
      return t => {
        const c = t % 3.6; let a;
        if (c < .7) a = lerp(20, 170, ease(c / .7));
        else if (c < .9) a = lerp(170, 60, (c - .7) / .2);
        else a = lerp(60, 20, clamp((c - .9) / .6));
        pose(k, a, 15, c > .7 && c < .95 ? 3 : 0);
        if (c < .8){ const [hx, hy] = hand(a, 40); pl.setAttribute('transform', `translate(${tx + hx * s} ${ty + hy * s}) rotate(-20)`); pl.setAttribute('opacity', 1); }
        else if (c < 2.3){
          const u = (c - .8) / 1.5, m = 1 - u;
          const x = m * m * P0[0] + 2 * m * u * P1[0] + u * u * P2[0], y = m * m * P0[1] + 2 * m * u * P1[1] + u * u * P2[1];
          const dx = 2 * m * (P1[0] - P0[0]) + 2 * u * (P2[0] - P1[0]), dy = 2 * m * (P1[1] - P0[1]) + 2 * u * (P2[1] - P1[1]);
          pl.setAttribute('transform', `translate(${x} ${y}) rotate(${Math.atan2(dy, dx) / D})`); pl.setAttribute('opacity', 1);
        } else pl.setAttribute('opacity', 0);
        const up = c >= 2.3;
        fl.setAttribute('transform', `translate(228 152) rotate(${up ? 0 : 90})`);
        sent.setAttribute('opacity', up ? clamp(1 - (c - 2.6) / .8) : 0);
      };
    },

    /* ---- Bottom-right corner buddy ---- */
    corner(svg){
      svg.innerHTML = `<ellipse class="bs" cx="80" cy="246" rx="7" ry="2" fill="rgba(0,0,0,.18)"/>${kid()}<g class="ball">${BALL}</g>`;
      return volley(grab(svg), svg.querySelector('.ball'), svg.querySelector('.bs'));
    }
  };

  /* ---------- runner: only animates the scenes that are on screen ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [...document.querySelectorAll('svg[data-scene]')].filter(svg => SCENES[svg.dataset.scene])
    .map(svg => ({svg, fn: SCENES[svg.dataset.scene](svg), seen: true}));
  if (!scenes.length) return;
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => es.forEach(e => { const s = scenes.find(s => s.svg === e.target); if (s) s.seen = e.isIntersecting; }));
    scenes.forEach(s => io.observe(s.svg));
  }
  let paused = false, offset = 0, pausedAt = 0;
  const mini = document.getElementById('mini-me');
  if (mini) mini.addEventListener('click', () => {
    const now = performance.now() / 1000;
    if (paused) offset += now - pausedAt; else pausedAt = now;
    paused = !paused;
    mini.setAttribute('aria-pressed', paused);
  });
  function tick(ms){
    const t = ms / 1000;
    scenes.forEach(s => {
      if (!s.seen) return;
      if (s.svg.dataset.scene === 'corner'){ if (!paused) s.fn(t - offset); }
      else s.fn(t);
    });
    if (!reduce) requestAnimationFrame(tick);
  }
  tick(1300);                      /* draw one still frame straight away */
  if (!reduce) requestAnimationFrame(tick);
})();
