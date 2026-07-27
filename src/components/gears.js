// ============================================================================
// gears.js - "Nature's Clock." Meshed gears turning in perfect sync.
// Show ICONS first (🌸🦟🐦🥚🐥); reveal LABELS only after the viewer gets it;
// later ONE gear slips - gradually - and a crack draws across (Frame 7).
// ============================================================================

import { g, path, circle, text, line } from '../engine/svg.js';
import { gsap, REDUCED } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

const STATIONS = [
  { icon: '🌸', label: 'Plants bloom', color: '#c77fa0' },
  { icon: '🦟', label: 'Insects emerge', color: '#6e8b4e' },
  { icon: '🐦', label: 'Swallow arrives', color: '#3a6ea5' },
  { icon: '🥚', label: 'Eggs hatch', color: '#e0a93b' },
  { icon: '🐥', label: 'Chicks are fed', color: '#d98a2b' },
];

/** A cog wheel: body circle + trapezoid teeth. */
function makeGear(r, teeth, color, hub = '#efe6d0') {
  const grp = g({ class: 'gear' });
  const body = circle(0, 0, r, { fill: color });
  const toothGroup = g({ class: 'gear__teeth' });
  const tw = (Math.PI * 2 * r) / teeth / 2.4;
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * 360;
    toothGroup.appendChild(
      path(`M${-tw / 2},${-r} L${-tw / 2 - 2},${-r - r * 0.16} L${tw / 2 + 2},${-r - r * 0.16} L${tw / 2},${-r} Z`, {
        fill: color,
        transform: `rotate(${a})`,
      })
    );
  }
  grp.appendChild(toothGroup);
  grp.appendChild(body);
  grp.appendChild(circle(0, 0, r * 0.34, { fill: hub }));
  grp.appendChild(circle(0, 0, r * 0.12, { fill: color }));
  return grp;
}

export function natureClock({ cx = 800, cy = 400 } = {}) {
  // The clock's own transform attribute is safe: GSAP never touches this node.
  const node = g({ class: 'clock', transform: `translate(${cx} ${cy})` });

  // Central hub gear - art centred on (0,0), so it rotates in place.
  const hubEl = makeGear(100, 16, '#7a5a3a', '#efe6d0');
  const hub = xform(hubEl);
  node.appendChild(hubEl);

  // Satellite gears on a ring sized so their teeth mesh with the hub's:
  // hub outer ≈ 100*1.16 = 116, satellite outer ≈ 55*1.16 = 64 → 116 + 64 = 180.
  // The whole clock is kept compact on purpose: the camera pushes in on it in
  // Frame 7, and a larger dial would drive the lower station labels down into
  // the caption band on short viewports.
  const ringR = 180;
  const sats = [];
  const labels = [];
  STATIONS.forEach((st, i) => {
    const a = (i / STATIONS.length) * Math.PI * 2 - Math.PI / 2;
    const sx = Math.cos(a) * ringR;
    const sy = Math.sin(a) * ringR;
    // Gear art is centred on its own (0,0), so xform() rotates it in place.
    const gearEl = makeGear(55, 12, st.color, '#f4ecd8');
    const gear = xform(gearEl, { x: sx, y: sy });
    node.appendChild(gearEl);
    // Upright icon - stays level, so the eye can always read the event.
    const iconEl = g({});
    iconEl.appendChild(text(st.icon, { 'font-size': 38, 'text-anchor': 'middle', dy: 13 }));
    const iconWrap = xform(iconEl, { x: sx, y: sy });
    node.appendChild(iconEl);
    // Hidden label, pushed clear of the gear. A single radial ring made the
    // side labels' horizontal text run straight into their gear, so labels fan
    // OUT by direction: side gears get their text anchored past the gear edge
    // (start on the right, end on the left); the top/bottom ones stay centred
    // and clear the gear vertically. gearOuter ≈ 55 * 1.16 tooth reach.
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const gearOuter = 64;
    let anchor = 'middle';
    let lx = sx;
    let ly = sy;
    let dy = -14;
    if (cosA > 0.35) {
      anchor = 'start';
      lx = sx + gearOuter + 18;
      ly = sy;
      dy = 7;
    } else if (cosA < -0.35) {
      anchor = 'end';
      lx = sx - gearOuter - 18;
      ly = sy;
      dy = 7;
    } else {
      // Near-vertical (top/bottom): clear the gear above or below.
      ly = sy + (sinA > 0 ? gearOuter + 30 : -(gearOuter + 16));
      dy = 0;
    }
    const label = text(st.label, {
      'font-size': 22,
      'font-family': 'var(--font-sans)',
      'font-weight': 600,
      fill: 'var(--ink)',
      'text-anchor': anchor,
      dy,
      x: lx,
      y: ly,
      opacity: 0,
    });
    node.appendChild(label);
    labels.push(label);
    sats.push({ gear, iconWrap, angle: a, x: sx, y: sy });
  });

  // Crack (hidden until slip)
  const crack = path('M-100,-6 L-34,-17 L-8,15 L37,-5 L100,8', {
    fill: 'none',
    stroke: '#2e2a24',
    'stroke-width': 3,
    opacity: 0,
    'stroke-linecap': 'round',
  });
  gsap.set(crack, { drawSVG: '0%' });
  node.appendChild(crack);

  let spinTween = null;

  /** Continuous synchronized spin (ambient sense of a working clock). */
  function spin(speed = 1) {
    if (REDUCED) return;
    if (spinTween) spinTween.kill();
    spinTween = gsap.timeline({ repeat: -1 });
    spinTween.add(hub.to({ rotation: 360 }, { duration: 20 / speed, ease: 'none' }), 0);
    sats.forEach((s) =>
      spinTween.add(s.gear.to({ rotation: -360 * 1.8 }, { duration: 20 / speed, ease: 'none' }), 0)
    );
  }

  /** Scrub-friendly: set overall angle 0..1. */
  function setAngle(t) {
    hub.set({ rotation: t * 360 });
    sats.forEach((s) => s.gear.set({ rotation: -t * 360 * 1.8 }));
  }

  function showLabels() {
    return gsap.to(labels, { opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' });
  }

  /** One gear slips out of sync + a crack draws. Gradual, not instant. */
  function slip() {
    const tl = gsap.timeline();
    // Desync the insect gear (index 1) - gradually, so the eye notices before
    // the narration says anything.
    const ins = sats[1];
    tl.add(ins.gear.to({ rotation: ins.gear.state.rotation + 140 }, { duration: 4, ease: 'power1.inOut' }), 0);
    tl.add(ins.iconWrap.to({ y: ins.iconWrap.state.y + 10, rotation: 8 }, { duration: 4, ease: 'power1.inOut' }), 0);
    tl.to(crack, { opacity: 1, drawSVG: '100%', duration: 2.5, ease: 'power1.in' }, 0.5);
    return tl;
  }

  function setHealth(hlth) {
    gsap.to(node, { filter: `saturate(${0.4 + hlth * 0.6})`, duration: 1 });
  }

  return { node, spin, setAngle, showLabels, slip, setHealth, hub, sats, labels, crack };
}
