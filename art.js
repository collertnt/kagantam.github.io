/* =====================================================================
   BUILT-IN LINE DRAWINGS
   Used for project cards and project page headers when a project has no
   photo yet. Pick one in js/projects.js with  art: "venturi"  etc.
   Each drawing is plain SVG, 400 × 275 units, white lines on the
   project's colour.
   ===================================================================== */
(function(){
  const open = label => `<svg class="art" viewBox="0 0 400 275" role="img" aria-label="${label}">`;

  /* Venturi tube cross-section, to scale (4.6 px per mm) */
  function venturi(){
    const top = '38,122.4 362.3,122.4 362.3,135.3 316.3,135.3 316.3,139 293.3,139 187.5,145.4 173.7,145.4 139.2,139 84,139 84,135.3 38,135.3';
    const bot = top.split(' ').map(p => { const [x, y] = p.split(','); return x + ',' + (300 - y).toFixed(1); }).join(' ');
    let dots = '';
    for (let i = 0; i < 7; i++) dots += `<circle class="hot flowdot" cx="${44 + (i % 2) * 4}" cy="${146 + (i * 3) % 9}" r="2.6" style="animation-delay:${(-i * .37).toFixed(2)}s"/>`;
    return open('Cross-section drawing of a Venturi tube') + `
      <defs><clipPath id="vbore"><polygon points="38,135.3 84,135.3 84,139 139.2,139 173.7,145.4 187.5,145.4 293.3,139 316.3,139 316.3,135.3 362.3,135.3 362.3,164.7 316.3,164.7 316.3,161 293.3,161 187.5,154.6 173.7,154.6 139.2,161 84,161 84,164.7 38,164.7"/></clipPath></defs>
      <polygon class="fillw" points="${top}"/><polygon class="fillw" points="${bot}"/>
      <path class="ln" d="M108.6 122.4V84M114.6 122.4V84M177.6 122.4V84M183.6 122.4V84"/>
      <path class="thin" stroke-dasharray="14 4 2 4" d="M22 150H380"/>
      <g clip-path="url(#vbore)">${dots}</g>
      <path class="thin" d="M38 186V226M362.3 186V226M38 218H362.3"/>
      <path class="hot" d="M38 218l9 -3.5v7zM362.3 218l-9 -3.5v7z" style="fill:#fff"/>
      <text x="200" y="212" text-anchor="middle">70.5 overall</text>
      <text x="111.6" y="74" text-anchor="middle">tap 1</text><text x="180.6" y="74" text-anchor="middle">tap 2</text>
      <path class="thin" d="M181 150L214 244"/><text x="220" y="250">throat Ø2</text>
      <text x="38" y="112">air in</text>
    </svg>`;
  }

  /* Ultrasonic ranging: goggles, outgoing pulses, obstacle */
  function sonar(){
    let hatch = '';
    for (let y = 70; y < 205; y += 12) hatch += `M312 ${y + 12}L342 ${y}`;
    return open('Drawing of goggles sending ultrasonic pulses toward an obstacle') + `
      <rect class="fillw" x="312" y="62" width="30" height="150"/><path class="thin" d="${hatch}"/>
      <g fill="none" stroke="var(--ball)" stroke-width="2" stroke-linecap="round">
        <path class="pingarc" d="M223 17A160 160 0 0 1 223 243"/>
        <path class="pingarc" style="animation-delay:-.8s" d="M223 17A160 160 0 0 1 223 243"/>
        <path class="pingarc" style="animation-delay:-1.6s" d="M223 17A160 160 0 0 1 223 243"/>
      </g>
      <path class="fillw" d="M40 108q0 -14 14 -14h30q10 0 14 8q4 -8 14 -8h4q14 0 14 14v36q0 14 -14 14h-10q-10 0 -14 -10q-2 -4 -4 0q-4 10 -14 10h-20q-14 0 -14 -14z"/>
      <path class="ln" d="M40 120H22M130 120h-4"/>
      <circle class="hot" cx="110" cy="130" r="5"/>
      <path class="thin" stroke-dasharray="5 5" d="M306 150H124"/><path d="M124 150l10 -4v8z" fill="#fff"/>
      <text x="215" y="170" text-anchor="middle">echo</text>
      <text x="40" y="190">sensor</text><text x="327" y="52" text-anchor="middle">obstacle</text>
      <path class="thin" d="M110 232H312M110 226v12M312 226v12"/><text x="211" y="252" text-anchor="middle">distance = speed of sound × time ÷ 2</text>
    </svg>`;
  }

  /* Honeycomb lattice with a few highlighted atoms */
  function lattice(){
    const s = 26, w = s * 1.5, h = s * Math.sqrt(3), seen = new Map();
    let line = '';
    for (let c = -1; c < 12; c++) for (let r = -1; r < 8; r++){
      const cx = c * w, cy = r * h + (c % 2 ? h / 2 : 0), v = [];
      for (let k = 0; k < 6; k++) v.push([cx + s * Math.cos(k * Math.PI / 3), cy + s * Math.sin(k * Math.PI / 3)]);
      line += 'M' + v.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
      v.forEach(p => seen.set(Math.round(p[0]) + ',' + Math.round(p[1]), p));
    }
    const dots = [...seen.values()].map(([x, y], i) => i % 13 === 5
      ? `<circle class="hot atom" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" style="animation-delay:${(-(i % 7) * .4).toFixed(1)}s"/>`
      : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#fff"/>`).join('');
    return open('Drawing of a honeycomb atomic lattice') + `<path class="thin" d="${line}"/>${dots}</svg>`;
  }

  /* Fallback for a project with no image and no drawing: its initials */
  function initials(title){
    const t = (title || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
    return open(title || 'Project') + `<path class="thin" d="M40 40H360V235H40z"/><path class="thin" d="M40 40L360 235M360 40L40 235"/>
      <text x="200" y="166" text-anchor="middle" style="font-size:110px;font-stretch:125%;font-weight:900;letter-spacing:-4px">${t}</text></svg>`;
  }

  window.ART = { venturi, sonar, lattice, initials };
})();
