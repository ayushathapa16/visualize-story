// ============================================================================
// insects.js - a shimmering swarm of flying insects (the food supply).
// Population is the story variable: full in Frame 6, vanishing in Frame 11/12.
// ============================================================================

import { g, circle } from '../engine/svg.js';
import { gsap, REDUCED } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';
import { rand } from '../engine/motion.js';

/**
 * @param {Object} o
 * @param {number} o.cx @param {number} o.cy  swarm centre
 * @param {number} o.spread  radius the swarm occupies
 * @param {number} o.count
 * @returns {{ node, setPopulation(0..1), bugs }}
 */
export function swarm({ cx = 800, cy = 400, spread = 240, count = 40 } = {}) {
  const node = g({ class: 'swarm' });
  const bugs = [];
  for (let i = 0; i < count; i++) {
    const bx = cx + rand(-spread, spread);
    const by = cy + rand(-spread * 0.7, spread * 0.7);
    // Drawn at (0,0) and anchored at its spot, so it scales/jitters about itself.
    const el = circle(0, 0, rand(1.6, 3), { fill: '#3a3327', opacity: 0.85 });
    const bug = xform(el, { x: bx, y: by });
    node.appendChild(el);
    bugs.push({ el, xf: bug, bx, by });
    if (!REDUCED) {
      bug.to(
        { x: bx + rand(-14, 14), y: by + rand(-14, 14) },
        { duration: rand(0.6, 1.4), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: rand(0, 1) }
      );
    }
  }

  /** 0 = none flying, 1 = full swarm. Fades a proportion of bugs out. */
  function setPopulation(p) {
    bugs.forEach((b, i) => {
      const on = i / bugs.length < p;
      gsap.to(b.el, { opacity: on ? 0.85 : 0, duration: 0.8 });
      b.xf.to({ scaleX: on ? 1 : 0.3, scaleY: on ? 1 : 0.3 }, { duration: 0.8 });
    });
  }

  return { node, setPopulation, bugs };
}
