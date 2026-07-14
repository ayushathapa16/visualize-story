// ============================================================================
// nest.js - the same nest on the same branch, across the whole story.
//
// nest() -> { node, branch, chicks[], buildTo(t), layEggs(), hatch(), feed(i),
//             setGrowth(t), begAll(), setEnergy(e), quiet() }
//
// Emotional attachment comes from it being literally the same nest: Willow
// weaves it in Scene 3, lays in it in Scene 5, feeds it in Scene 6, watches it
// grow in Scene 7, and it is the thing that goes quiet in Scene 15. One
// parameterised component, four ages - not four nests (CLAUDE.md invariant 2).
//
// The lifecycle dials are independent and idempotent, so a scrubbed timeline can
// drive them backwards as happily as forwards.
// ============================================================================

import { g, path, ellipse } from '../engine/svg.js';
import { createChick } from '../characters/chick.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

const EGG_FILL = '#f2ead6';
const EGG_SHADE = '#d9cdb0';

/**
 * @param {Object} [o]
 * @param {number} [o.chickCount]
 * @param {boolean} [o.built] start fully woven (default true - most scenes join
 *   the nest already finished; only Scene 3 starts at 0 and weaves it).
 */
export function nest({ x = 800, y = 500, s = 1, chickCount = 4, built = true } = {}) {
  const node = g({ class: 'nest-scene', transform: `translate(${x} ${y}) scale(${s})` });

  // branch
  const branch = path('M-520,120 C -260,90 260,150 540,96', {
    stroke: 'var(--bark-deep)',
    'stroke-width': 22,
    fill: 'none',
    'stroke-linecap': 'round',
  });
  node.appendChild(branch);
  node.appendChild(path('M120,110 C 180,70 220,80 250,50', { stroke: 'var(--bark)', 'stroke-width': 10, fill: 'none' }));

  // woven nest cup - layers, outermost first. buildTo() brings them in in the
  // order she'd actually weave them: the coarse base, then the walls, then the
  // fine lining.
  const cupBase = ellipse(0, 40, 150, 60, { fill: '#7a5a3a' });
  const cupWall = ellipse(0, 24, 138, 48, { fill: '#5b4227' });
  const cupLine = ellipse(0, 30, 118, 36, { fill: '#3b2c1a' });
  const cup = g({ class: 'nest__cup' }, [cupBase, cupWall, cupLine]);

  // straw texture - each strand is a separate node so weaving can bring them in
  // one at a time under the scrub.
  const straws = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI - Math.PI / 2;
    const strand = path(`M${Math.cos(a) * 120},${20 + Math.sin(a) * 10} q10,-14 22,-6`, {
      stroke: '#8a6b45',
      'stroke-width': 3,
      fill: 'none',
      opacity: 0.7,
    });
    cup.appendChild(strand);
    straws.push(strand);
  }
  node.appendChild(cup);

  // eggs - laid in Scene 5, gone by the time the chicks are up.
  const eggs = [];
  for (let i = 0; i < chickCount; i++) {
    const ex = (i - (chickCount - 1) / 2) * 52;
    const shell = g({ class: 'nest__egg' }, [
      ellipse(0, 0, 20, 26, { fill: EGG_FILL }),
      ellipse(6, 6, 9, 12, { fill: EGG_SHADE, opacity: 0.5 }),
    ]);
    const xf = xform(shell, { x: ex, y: 26, scale: 0 });
    node.appendChild(shell);
    eggs.push({ node: shell, xf, x: ex });
  }

  // chicks (start hidden inside)
  const chicks = [];
  for (let i = 0; i < chickCount; i++) {
    const c = createChick();
    const cx = (i - (chickCount - 1) / 2) * 64;
    c.xf.set({ x: cx, y: 2, scale: 0 }); // hidden in the cup until hatch()
    node.appendChild(c.node);
    chicks.push(c);
  }
  // Front rim - kept low so the chicks' faces stay above it.
  const rim = ellipse(0, 56, 150, 30, { fill: '#6a4f32' });
  node.appendChild(rim);

  const cupParts = [cupBase, cupWall, cupLine, rim];

  /**
   * 0 = bare branch, 1 = finished cup. Scrub-friendly and idempotent.
   * Scene 3 drives this from the scroll as Willow ferries material in.
   */
  function buildTo(t) {
    const p = Math.min(1, Math.max(0, t));
    // Cup body arrives over the first 70%, strands weave in across the whole
    // range, so the last thing you see is the lining being tucked in.
    cupParts.forEach((el, i) => {
      const start = (i / cupParts.length) * 0.7;
      const k = Math.min(1, Math.max(0, (p - start) / 0.3));
      gsap.set(el, { opacity: k });
    });
    straws.forEach((el, i) => {
      const start = 0.15 + (i / straws.length) * 0.85;
      gsap.set(el, { opacity: p >= start ? 0.7 : 0 });
    });
  }

  if (!built) buildTo(0);

  /** Eggs appear one by one - "days pass" (Scene 5). */
  function layEggs({ stagger = 0.4 } = {}) {
    const tl = gsap.timeline();
    eggs.forEach((e, i) =>
      tl.add(e.xf.to({ scale: 1 }, { duration: 0.5, ease: 'back.out(1.6)' }), i * stagger)
    );
    return tl;
  }

  /** Eggs crack and give way to chicks. Safe to call with no eggs shown. */
  function hatch({ stagger = 0.25 } = {}) {
    const tl = gsap.timeline();
    eggs.forEach((e, i) => {
      tl.add(e.xf.to({ rotation: 8 }, { duration: 0.12, yoyo: true, repeat: 3 }), i * stagger);
      tl.add(e.xf.to({ scale: 0 }, { duration: 0.3, ease: 'power2.in' }), i * stagger + 0.4);
    });
    chicks.forEach((c, i) =>
      tl.add(c.xf.to({ scale: 1.5 }, { duration: 0.5, ease: 'back.out(1.7)' }), i * stagger + 0.5)
    );
    return tl;
  }

  /** feed chick i - quick beg + settle. */
  function feed(i) {
    const c = chicks[i % chicks.length];
    if (c) c.beg(true);
    return c;
  }

  function begAll(open = true) {
    chicks.forEach((c) => c.beg(open));
  }

  /**
   * 0 = just hatched, 1 = feathered and ready to fledge (Scene 7).
   * Only meaningful on a HATCHED nest - see setEnergy's note.
   */
  function setGrowth(t, opts) {
    chicks.forEach((c) => c.setGrowth(t, opts));
  }

  /**
   * energy 0..1 across the brood (dim + quiet as food runs short).
   *
   * Only call this on a HATCHED nest. Chicks rest at scale 0 until hatch(), and
   * setEnergy() scales them up - so calling it on an unhatched nest quietly
   * pops four chicks into a nest that is supposed to hold eggs (or nothing).
   * To show grown chicks without replaying the hatch: `hatch().progress(1)`.
   */
  function setEnergy(e) {
    chicks.forEach((c) => c.setEnergy(e));
  }

  return {
    node,
    branch,
    cup,
    chicks,
    eggs,
    buildTo,
    layEggs,
    hatch,
    feed,
    begAll,
    setGrowth,
    setEnergy,
  };
}
