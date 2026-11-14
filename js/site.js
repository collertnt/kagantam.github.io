/* =====================================================================
   KAGAN TAM — site behaviour (shared by the homepage and project pages)
   Each block below only runs if its part of the page exists, so the same
   file works everywhere. You should rarely need to edit this file: text
   lives in the .html pages and the project list lives in js/projects.js.
   ===================================================================== */
(function(){
  const d = document, body = d.body;
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOT = body.dataset.root || '';            /* "" on the homepage, "../" on project pages */
  const PROJECTS = window.PROJECTS || [];
  const ART = window.ART || {};
  const pageOf = p => ROOT + 'projects/' + p.slug + '.html';
  const artOf = p => p.image
    ? `<img src="${ROOT}${esc(p.image)}" alt="" class="${p.blueprint ? 'blueprint' : 'photo'}" draggable="false">`
    : (ART[p.art] || ART.initials || (() => ''))(p.title);
  const ARROW = '<svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M0 7h24M18 1l6 6-6 6"/></svg>';
  const onVisible = (el, fn) => {
    if (!('IntersectionObserver' in window)) return fn(true);
    new IntersectionObserver(es => es.forEach(e => fn(e.isIntersecting))).observe(el);
  };

  /* ---------- nav ---------- */
  const nav = $('.nav');
  if (nav){
    const paint = () => nav.classList.toggle('solid', scrollY > 30);
    addEventListener('scroll', paint, {passive:true}); paint();
    const tog = $('.nav-toggle', nav);
    if (tog){
      tog.addEventListener('click', () => tog.setAttribute('aria-expanded', nav.classList.toggle('open')));
      $$('.nav-links a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); tog.setAttribute('aria-expanded', false); }));
    }
  }
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- quiet scroll reveals ---------- */
  const rev = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.1, rootMargin:'0px 0px -40px 0px'});
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add('in'));

  /* =====================================================================
     HOME: hero. The name is sized to fit, then "dimensioned" like a part.
     ===================================================================== */
  const hero = $('.hero');
  if (hero){
    const name = $('.dim-name', hero), lines = $$('.ln', name);
    const bw = $('[data-dim="w"]', hero), bh = $('[data-dim="h"]', hero);
    let counted = false;
    const fit = () => {
      const avail = name.parentElement.clientWidth - (innerWidth > 900 ? 64 : 0);
      name.style.fontSize = '100px';
      const widest = Math.max(...lines.map(l => l.getBoundingClientRect().width));
      name.style.fontSize = Math.min(100 * avail / widest, innerHeight * .21, 220).toFixed(1) + 'px';
      if (counted) dims(1);
    };
    const dims = k => {
      const r = name.getBoundingClientRect();
      bw.textContent = Math.round(r.width * k);
      bh.textContent = Math.round(r.height * k);
    };
    fit();
    addEventListener('resize', fit);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit);
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('go')));
    /* the dimension numbers count up while the lines extend */
    const t0 = performance.now() + 500;
    (function count(now){
      const k = reduce ? 1 : clamp((now - t0) / 900);
      dims(1 - Math.pow(1 - k, 3));
      if (k < 1) requestAnimationFrame(count); else counted = true;
    })(performance.now());
    /* live cursor position in the title block, like a CAD status bar */
    const xy = $('[data-xy]', hero);
    if (xy && matchMedia('(hover:hover)').matches){
      let queued = false, ev;
      hero.addEventListener('pointermove', e => {
        ev = e; if (queued) return; queued = true;
        requestAnimationFrame(() => { queued = false; xy.textContent = 'X ' + String(Math.round(ev.clientX)).padStart(4, '0') + '  Y ' + String(Math.round(ev.clientY + scrollY)).padStart(4, '0'); });
      });
    }
  }

  /* =====================================================================
     HOME: design-process loop. Scrolling walks round the eight stages.
     ===================================================================== */
  const proc = $('.process');
  if (proc){
    const cards = $$('.stage-card', proc), svg = $('.loop', proc), track = $('.process-track', proc), N = cards.length;
    const CX = 260, CY = 260, R = 178, C = 2 * Math.PI * R, NS = 'http://www.w3.org/2000/svg';
    const pos = (i, r) => { const a = (-90 + i * 360 / N) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
    let nodes = '';
    cards.forEach((c, i) => {
      const [x, y] = pos(i, R), [lx, ly] = pos(i, R + 36);
      const anchor = lx > CX + 20 ? 'start' : lx < CX - 20 ? 'end' : 'middle';
      const dy = Math.abs(lx - CX) < 20 ? (ly < CY ? -4 : 14) : 5;
      nodes += `<g class="node" data-i="${i}" tabindex="0" role="button" aria-label="Stage ${i + 1}: ${esc(c.dataset.short)}">
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19"/><text class="n" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${i + 1}</text>
        <text class="t" x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}">${esc(c.dataset.short)}</text></g>`;
    });
    svg.setAttribute('viewBox', '-40 10 600 500');
    svg.innerHTML = `
      <circle class="ring" cx="${CX}" cy="${CY}" r="${R}"/>
      <circle class="arc" cx="${CX}" cy="${CY}" r="${R}" transform="rotate(-90 ${CX} ${CY})" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}"/>
      <g class="backgrp"><path class="back" d="M116 286C150 352 252 386 338 356"/><path d="M338 356l-13 -2l6 11z" fill="var(--pen)"/>
      <text class="backnote" transform="translate(190 318) rotate(-2)"><tspan x="0" dy="0">fails a test?</tspan><tspan x="0" dy="18">back to the sketches</tspan></text></g>
      <text class="big" x="${CX}" y="${CY + 8}">1</text><text class="of" x="${CX}" y="${CY + 34}">of ${N}</text>
      <g class="ballwrap"><g transform="translate(${CX} ${CY - R + 40})"><circle r="11" fill="var(--ball)" stroke="var(--navy)" stroke-width="1.5"/><path d="M-11 0q11 -5 22 0M0 -11q-6 11 0 22M-7 -8q9 4 15 15" stroke="var(--blue)" stroke-width="2" fill="none"/></g></g>
      ${nodes}`;
    const arc = $('.arc', svg), big = $('.big', svg), ball = $('.ballwrap', svg), nodeEls = $$('.node', svg);
    let cur = -1;
    const set = i => {
      if (i === cur) return; cur = i;
      cards.forEach((c, k) => c.classList.toggle('on', k === i));
      nodeEls.forEach((n, k) => { n.classList.toggle('done', k <= i); n.classList.toggle('on', k === i); });
      arc.style.strokeDashoffset = (C * (1 - i / N)).toFixed(1);
      ball.style.transform = `rotate(${i * 360 / N}deg)`;
      big.textContent = i + 1;
      svg.classList.toggle('testing', cards[i].dataset.short === 'Test');
    };
    const mq = matchMedia('(min-width: 980px) and (min-height: 620px)');
    const span = () => track.offsetHeight - innerHeight;
    const update = () => {
      if (!proc.classList.contains('pinned')) return;
      const p = clamp(-track.getBoundingClientRect().top / span(), 0, .9999);
      set(Math.floor(p * N));
    };
    const mode = () => { proc.classList.toggle('pinned', mq.matches && !reduce); cur = -1; set(0); update(); };
    const go = i => scrollTo({top: track.getBoundingClientRect().top + scrollY + (i + .5) / N * span(), behavior: 'smooth'});
    nodeEls.forEach(n => {
      n.addEventListener('click', () => go(+n.dataset.i));
      n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(+n.dataset.i); } });
    });
    mq.addEventListener ? mq.addEventListener('change', mode) : mq.addListener(mode);
    addEventListener('scroll', update, {passive:true});
    addEventListener('resize', update);
    mode();
  }

  /* =====================================================================
     HOME: project scroller, built from js/projects.js
     ===================================================================== */
  const rack = $('.rack');
  if (rack){
    rack.innerHTML = PROJECTS.map((p, i) => `
      <a class="card" href="${pageOf(p)}" draggable="false">
        <div class="card-art sheet" style="--ground:${esc(p.color || '#1b40ad')}">
          <span class="card-no lbl num">KT-${String(i + 1).padStart(3, '0')}</span>${artOf(p)}
        </div>
        <div class="card-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <div class="card-spacer"></div>
          <dl class="card-tb">
            <div><dt>Type</dt><dd>${esc(p.kind)}</dd></div>
            <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
            <div><dt>When</dt><dd>${esc(p.when)}</dd></div>
            <div><dt>Tools</dt><dd>${esc((p.tools || []).join(', '))}</dd></div>
          </dl>
          <span class="card-open">Open the project ${ARROW}</span>
        </div>
      </a>`).join('') + `
      <div class="card next">
        <h3>Next build</h3>
        <p>This slot is saved for whatever I make next. New projects get added here as I finish them.</p>
        <p class="hand">drawing in progress</p>
      </div>`;
    const cardsEl = $$('.card', rack), prev = $('[data-rack="prev"]'), next = $('[data-rack="next"]'), count = $('.rack-count');
    const stepW = () => cardsEl[0].getBoundingClientRect().width + 22;
    const sync = () => {
      const i = Math.round(rack.scrollLeft / stepW());
      const end = rack.scrollLeft > rack.scrollWidth - rack.clientWidth - 4;
      if (count) count.textContent = Math.min(i + 1, PROJECTS.length) + ' / ' + PROJECTS.length;
      if (prev) prev.disabled = rack.scrollLeft < 4;
      if (next) next.disabled = end;
    };
    const move = dir => rack.scrollBy({left: dir * stepW(), behavior: reduce ? 'auto' : 'smooth'});
    if (prev) prev.addEventListener('click', () => move(-1));
    if (next) next.addEventListener('click', () => move(1));
    rack.addEventListener('scroll', sync, {passive:true}); addEventListener('resize', sync); sync();
    rack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); });
    /* click-and-drag with a mouse (touch already scrolls natively) */
    let down = false, moved = false, x0 = 0, s0 = 0;
    rack.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved = false; x0 = e.clientX; s0 = rack.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6){ moved = true; rack.classList.add('drag'); }
      if (moved) rack.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved){ rack.classList.remove('drag'); const i = Math.round(rack.scrollLeft / stepW()); rack.scrollTo({left: i * stepW(), behavior: reduce ? 'auto' : 'smooth'}); }
    });
    rack.addEventListener('click', e => { if (moved){ e.preventDefault(); moved = false; } }, true);
  }

  /* =====================================================================
     PROJECT PAGES: colour, header drawing, stage rail, next-project link
     ===================================================================== */
  const slug = body.dataset.project;
  if (slug){
    const i = PROJECTS.findIndex(p => p.slug === slug), me = PROJECTS[i];
    const artBox = $('[data-art]');
    if (me && me.color) body.style.setProperty('--ground', me.color);
    if (artBox) artBox.innerHTML = me ? artOf(me) : (ART.initials ? ART.initials(($('h1') || {}).textContent) : '');
    const nextBox = $('.pnext .wrap');
    if (nextBox && PROJECTS.length){
      const n = PROJECTS[(i + 1) % PROJECTS.length] || PROJECTS[0];
      nextBox.innerHTML = `<div><p class="lbl" style="opacity:.75">Next project</p><a class="big" href="${pageOf(n)}">${esc(n.title)} ${ARROW.replace('width="26" height="14"', 'width="40" height="22"')}</a></div>
        <a class="btn" href="${ROOT}index.html#projects">All projects</a>`;
    }
    /* stage rail: one link per <section class="stage" id="..." data-stage="..."> */
    const rail = $('.rail ol'), stages = $$('.stage[id][data-stage]');
    if (rail && stages.length){
      rail.innerHTML = stages.map(s => `<li><a href="#${s.id}" data-status="${s.dataset.status || 'done'}">${esc(s.dataset.stage)}</a></li>`).join('');
      const links = $$('a', rail);
      const spy = () => {
        let on = 0;
        stages.forEach((s, k) => { if (s.getBoundingClientRect().top < innerHeight * .4) on = k; });
        links.forEach((a, k) => a.classList.toggle('on', k === on));
      };
      addEventListener('scroll', spy, {passive:true}); spy();
    }
  }

  /* =====================================================================
     WIDGET: weighted decision matrix with live weights
     <div class="matrix" data-options="A|B|C"> with .wrow[data-weight][data-scores]
     ===================================================================== */
  $$('.matrix[data-options]').forEach(m => {
    const opts = m.dataset.options.split('|'), rows = $$('.wrow', m), out = $('.bars', m), verdict = $('.verdict', m);
    rows.forEach((r, k) => {
      const id = 'w' + k + Math.random().toString(36).slice(2, 6), lab = $('label', r);
      lab.htmlFor = id;
      r.insertAdjacentHTML('beforeend', `<output></output><input id="${id}" type="range" min="0" max="60" step="5" value="${r.dataset.weight}">`);
      $('input', r).addEventListener('input', calc);
    });
    out.innerHTML = opts.map(o => `<div class="bar"><div class="top"><span>${esc(o)}</span><b>0</b></div><div class="trk"><div class="fill"></div></div></div>`).join('');
    const bars = $$('.bar', out);
    function calc(){
      const w = rows.map(r => +$('input', r).value), sum = w.reduce((a, b) => a + b, 0) || 1;
      rows.forEach((r, k) => $('output', r).textContent = (w[k] / sum).toFixed(2));
      const totals = opts.map((_, j) => rows.reduce((a, r, k) => a + w[k] / sum * +r.dataset.scores.split(',')[j], 0));
      const best = Math.max(...totals), lead = totals.indexOf(best), tie = totals.filter(t => Math.abs(t - best) < .005).length > 1;
      bars.forEach((b, j) => {
        $('b', b).textContent = totals[j].toFixed(2);
        $('.fill', b).style.width = (totals[j] / 5 * 100).toFixed(1) + '%';
        b.classList.toggle('lead', j === lead && !tie);
      });
      const second = Math.max(...totals.filter((_, j) => j !== lead));
      if (verdict) verdict.textContent = tie ? 'A tie at these weights.' : `${opts[lead].split('.')[0]} wins at these weights, ${(best - second).toFixed(2)} ahead of the runner-up.`;
    }
    const reset = $('.reset', m);
    if (reset) reset.addEventListener('click', () => { rows.forEach(r => $('input', r).value = r.dataset.weight); calc(); });
    calc();
  });

  /* =====================================================================
     WIDGET: Venturi flow bench (digital manometer page)
     Geometry from the design: lengths and bore diameters in mm.
     ===================================================================== */
  $$('[data-bench="venturi"]').forEach(box => {
    const S = 8, X0 = 78, CY = 150;                           /* 8 px per mm */
    const seg = [[0, 3.2], [10, 3.2], [10, 2.4], [22, 2.4], [29.5, 1], [32.5, 1], [55.5, 2.4], [60.5, 2.4], [60.5, 3.2], [70.5, 3.2]]; /* [x, bore radius] */
    const rad = x => { for (let k = 1; k < seg.length; k++){ const [x1, r1] = seg[k - 1], [x2, r2] = seg[k]; if (x <= x2) return x2 === x1 ? r2 : r1 + (r2 - r1) * (x - x1) / (x2 - x1); } return 3.2; };
    const X = x => X0 + x * S;
    const topIn = seg.map(([x, r]) => `${X(x)},${CY - r * S}`), botIn = seg.map(([x, r]) => `${X(x)},${CY + r * S}`);
    const wallT = `${X(0)},${CY - 48} ${X(70.5)},${CY - 48} ` + topIn.slice().reverse().join(' ');
    const wallB = `${X(0)},${CY + 48} ${X(70.5)},${CY + 48} ` + botIn.slice().reverse().join(' ');
    const chain = [[0, 10, 'socket'], [10, 22, 'inlet Ø4.8'], [22, 29.5, 'cone'], [29.5, 32.5, 'throat Ø2'], [32.5, 55.5, 'diffuser'], [55.5, 60.5, ''], [60.5, 70.5, 'socket']];
    let dimsvg = '';
    chain.forEach(([a, b, t]) => {
      dimsvg += `<path class="thin" d="M${X(a)} ${CY + 56}V${CY + 92}M${X(b)} ${CY + 56}V${CY + 92}M${X(a) + 1} ${CY + 84}H${X(b) - 1}"/>
        <text x="${(X(a) + X(b)) / 2}" y="${CY + 78}" text-anchor="middle">${+(b - a).toFixed(1)}</text>
        <text x="${(X(a) + X(b)) / 2}" y="${CY + (t.startsWith('throat') ? 124 : 108)}" text-anchor="middle" ${t.startsWith('throat') ? 'style="fill:var(--ball)"' : ''}>${t}</text>`;
    });
    const N = 54;
    box.querySelector('.bench-draw').innerHTML = `<svg class="art" viewBox="0 0 720 300" role="img" aria-label="Venturi cross-section with air flowing through it">
      <polygon class="fillw" points="${wallT}"/><polygon class="fillw" points="${wallB}"/>
      <path class="ln" d="M${X(16) - 6} ${CY - 48}V${CY - 100}M${X(16) + 6} ${CY - 48}V${CY - 100}M${X(31) - 6} ${CY - 48}V${CY - 100}M${X(31) + 6} ${CY - 48}V${CY - 100}"/>
      <path class="thin" d="M${X(16)} ${CY - 48}V${CY - 2.4 * S}M${X(31)} ${CY - 48}V${CY - S}"/>
      <text x="${X(16)}" y="${CY - 110}" text-anchor="middle">tap 1 to P1 +</text><text x="${X(31) + 4}" y="${CY - 110}">tap 2 to P2 −</text>
      <path class="thin" stroke-dasharray="14 4 2 4" d="M${X0 - 30} ${CY}H${X(70.5) + 30}"/>
      <text x="${X0 - 62}" y="${CY - 10}">air in</text><path class="ln" d="M${X0 - 62} ${CY}H${X0 - 14}"/><path d="M${X0 - 8} ${CY}l-11 -4.5v9z" fill="#fff"/>
      <g class="parts">${'<circle class="hot" r="2.6"/>'.repeat(N)}</g>
      ${dimsvg}
      <text x="${X(70.5)}" y="${CY + 138}" text-anchor="end">dimensions in mm, 70.5 overall</text>
    </svg>`;
    const dots = $$('.parts circle', box), parts = dots.map((_, k) => ({x: (k / N) * 70.5, y: ((k * 0.618) % 1) * 1.7 - .85}));
    const slider = $('input[type=range]', box), outQ = $('[data-out="q"]', box), outV1 = $('[data-out="v1"]', box), outV2 = $('[data-out="v2"]', box), outRe = $('[data-out="re"]', box), lcd = $('.lcd', box);
    const RHO = 1.20, NU = 1.5e-5, A1 = Math.PI * 0.0024 ** 2, A2 = Math.PI * 0.001 ** 2;
    let v1 = 0;
    const calc = () => {
      const q = +slider.value, Q = q / 60000;                 /* L/min to m³/s */
      v1 = Q / A1; const v2 = Q / A2, dP = .5 * RHO * (v2 * v2 - v1 * v1), re = v2 * 0.002 / NU;
      outQ.textContent = q.toFixed(1) + ' L/min';
      outV1.textContent = v1.toFixed(1) + ' m/s'; outV2.textContent = v2.toFixed(1) + ' m/s';
      outRe.textContent = (Math.round(re / 10) * 10).toLocaleString('en-CA');
      lcd.textContent = ('dP ' + dP.toFixed(1) + ' Pa').padEnd(16) + '\n' + ('   ' + (dP / 97.9).toFixed(2) + ' cmH2O').padEnd(16);
    };
    const draw = dt => parts.forEach((p, k) => {
      const r = rad(p.x);
      p.x += v1 * (2.4 / r) ** 2 * 5 * dt;                    /* local speed from continuity; ×5 so it reads on screen */
      if (p.x > 70.5){ p.x -= 70.5; p.y = Math.random() * 1.7 - .85; }
      dots[k].setAttribute('cx', X(p.x).toFixed(1)); dots[k].setAttribute('cy', (CY + p.y * rad(p.x) * S).toFixed(1));
    });
    slider.addEventListener('input', calc); calc(); draw(0);
    let vis = false, last = 0;
    onVisible(box, v => { vis = v; if (v && !reduce){ last = 0; requestAnimationFrame(loop); } });
    function loop(t){ if (!vis) return; if (last) draw(Math.min(.05, (t - last) / 1000)); last = t; requestAnimationFrame(loop); }
  });

  /* =====================================================================
     WIDGET: compare the three driving-range designs
     ===================================================================== */
  $$('[data-compare]').forEach(box => {
    const tabs = $$('[role="tab"]', box), rows = $$('.life-row', box);
    const f = k => $('[data-f="' + k + '"]', box);
    const pick = i => {
      const t = tabs[i].dataset;
      tabs.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
      rows.forEach((r, k) => r.classList.toggle('on', k === i));
      f('img').src = t.img; f('img').alt = t.alt;
      ['name', 'note', 'cost', 'life', 'weather', 'build'].forEach(k => f(k).textContent = t[k]);
    };
    tabs.forEach((b, i) => {
      b.addEventListener('click', () => pick(i));
      b.addEventListener('keydown', e => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (dir){ const n = (i + dir + tabs.length) % tabs.length; pick(n); tabs[n].focus(); }
      });
    });
    pick(Math.max(0, tabs.findIndex(b => b.hasAttribute('data-start'))));
  });

  /* =====================================================================
     WIDGET: ultrasonic time-of-flight sketch (assistive goggles page)
     ===================================================================== */
  $$('[data-bench="sonar"]').forEach(box => {
    const SX = 132, X1 = 230, X2 = 664, CY = 150, SOUND = 343;      /* speed of sound, m/s */
    const slider = $('input[type=range]', box), outD = $('[data-out="d"]', box), outT = $('[data-out="t"]', box);
    box.querySelector('.sonar-draw').innerHTML = `<svg class="art" viewBox="0 0 720 300" role="img" aria-label="An ultrasonic pulse travels from the goggles to an obstacle and back">
      <path class="thin" stroke-dasharray="4 6" d="M${SX} ${CY}H700"/>
      <path class="fillw" d="M40 122q0 -16 16 -16h34q11 0 16 9q5 -9 16 -9h2q16 0 16 16v44q0 16 -16 16h-10q-11 0 -16 -12q-2 -4 -4 0q-5 12 -16 12h-22q-16 0 -16 -16z"/>
      <circle class="hot" cx="${SX - 8}" cy="${CY}" r="6"/><text x="40" y="208">ultrasonic sensor</text>
      <g class="wall"><rect class="fillw" x="0" y="60" width="26" height="180"/><path class="thin" d="M0 84L26 72M0 108L26 96M0 132L26 120M0 156L26 144M0 180L26 168M0 204L26 192M0 228L26 216"/><text x="13" y="262" text-anchor="middle">obstacle</text></g>
      <path class="pulse" d="M0 -34A60 60 0 0 1 0 34" fill="none" stroke="var(--ball)" stroke-width="3" stroke-linecap="round"/>
      <g class="rule"><path class="thin" d="M${SX} 30V46M${SX} 38H0"/><text class="dtxt" y="28" text-anchor="middle"></text></g>
    </svg>`;
    const wall = $('.wall', box), pulse = $('.pulse', box), ruleP = $('.rule path', box), dtxt = $('.dtxt', box);
    let dist = 1.5, wx = 0;
    const calc = () => {
      dist = +slider.value; wx = X1 + (dist - .3) / (3 - .3) * (X2 - X1);
      wall.setAttribute('transform', `translate(${wx} 0)`);
      ruleP.setAttribute('d', `M${SX} 30V46M${wx} 30V46M${SX} 38H${wx}`);
      dtxt.setAttribute('x', (SX + wx) / 2); dtxt.textContent = dist.toFixed(2) + ' m';
      outD.textContent = dist.toFixed(2) + ' m';
      outT.textContent = (2 * dist / SOUND * 1000).toFixed(1) + ' ms';
    };
    const draw = t => {
      const trip = .45 + dist * .55, f = (t % (trip + .35)) / trip;       /* slowed right down so you can see it */
      if (f > 1){ pulse.setAttribute('opacity', 0); return; }
      const outbound = f < .5, u = outbound ? f * 2 : (1 - f) * 2, x = SX + u * (wx - SX - 4);
      pulse.setAttribute('opacity', outbound ? 1 : .55);
      pulse.setAttribute('transform', `translate(${x.toFixed(1)} ${CY}) scale(${outbound ? 1 : -1} 1)`);
    };
    slider.addEventListener('input', calc); calc(); draw(.2);
    let vis = false;
    onVisible(box, v => { vis = v; if (v && !reduce) requestAnimationFrame(loop); });
    function loop(t){ if (!vis) return; draw(t / 1000); requestAnimationFrame(loop); }
  });
})();
