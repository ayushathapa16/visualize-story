// ============================================================================
// flock.js - distant birds. Willow is the only bird we ever draw in detail;
// everyone else is a silhouette, because Act V is about scale, not individuals.
// Reused in Frames 18 (zoom out), 24 (overhead) and 26 (the closing sky).
// ============================================================================

import { g, path } from '../engine/svg.js';
import { gsap, REDUCED } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';
import { rand } from '../engine/motion.js';

/** A two-stroke bird silhouette, drawn around its own (0,0). */
function bird(color) {
  return path('M-16,0 q8,-9 16,-1 q8,-8 16,1 q-8,-4 -16,3 q-8,-7 -16,-3 Z', { fill: color });
}

/**
 * @param {Object} [o]
 * @param {number} [o.count]  how many silhouettes to pre-build
 * @param {number} [o.cx] @param {number} [o.cy]  flock centre
 * @param {number} [o.spreadX] @param {number} [o.spreadY]
 * @param {string} [o.color]
 * @returns {{ node, birds, showUpTo(n, dur), drift(dist, dur) }}
 */
export function flock({
  cx = 800,
  cy = 300,
  spreadX = 620,
  spreadY = 200,
  count = 24,
  color = '#2e4a5e',
} = {}) {
  const node = g({ class: 'flock' });
  const birds = [];

  for (let i = 0; i < count; i++) {
    const el = bird(color);
    const xf = xform(el, {
      x: cx + rand(-spreadX, spreadX),
      y: cy + rand(-spreadY, spreadY),
      scale: rand(0.5, 1.15),
    });
    gsap.set(el, { opacity: 0 });
    node.appendChild(el);
    birds.push({ el, xf });

    // Wingbeat: a shallow scaleY pulse reads as flapping at this size, and
    // costs nothing next to a full Willow rig.
    if (!REDUCED) {
      const s = xf.state.scaleY;
      xf.to(
        { scaleY: s * 0.55 },
        { duration: rand(0.3, 0.55), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: rand(0, 0.6) }
      );
    }
  }

  /** Fade in the first n birds - the "one → several → many" build. */
  function showUpTo(n, dur = 0.9) {
    return gsap.to(
      birds.slice(0, n).map((b) => b.el),
      { opacity: 1, duration: dur, stagger: { each: 0.05, from: 'random' }, ease: 'power2.out' }
    );
  }

  /** Slow lateral drift of the whole flock. */
  function driftAcross(dist = 120, dur = 20) {
    if (REDUCED) return null;
    return gsap.to(node, { x: dist, duration: dur, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }

  return { node, birds, showUpTo, driftAcross };
}
