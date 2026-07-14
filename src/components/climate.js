// ============================================================================
// climate.js - the warming scenarios (Frame 20).
//
// Frame 8 showed a thermometer reading +1 °C / +2 °C and the audience filed it
// away as a small number. This is where that number is re-read: Audubon models
// birds at +1.5 °C, +2.0 °C and +3.0 °C, and the difference between the ends of
// that range is most of Ontario's bird community.
//
// The FIGURES below are published and citable - see SOURCES. The map geometry
// is illustrative paper-cut, not a projection: it shows ranges shrinking and
// retreating north past Toronto, which is what the numbers *mean*. Only the
// numbers get stated.
// ============================================================================

import { g, path, circle, ellipse, text } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

/**
 * Audubon, "Survival by Degrees: 389 Bird Species on the Brink" (2019).
 * https://www.audubon.org/climate/survivalbydegrees
 * Ontario: https://www.audubon.org/climate/survivalbydegrees/state/ca/on
 *
 * "Vulnerable" = moderately or highly vulnerable; such birds may lose more than
 * half of their current range.
 */
export const SCENARIOS = {
  vulnerableAt3: 389, // of 604 North American bird species (64%)
  speciesStudied: 604,
  betterOffAt15: 0.76, // 76% of vulnerable species are better off at +1.5 °C
  savedAt15: 150, // ~150 species would no longer be vulnerable at +1.5 °C
  treeSwallowRangeLossAt3: 0.43, // Tree Swallow, Northeast/Upper Midwest (Climate Central)
};

// Ontario's bird neighbours (the six from docs/story.md). `loss15`/`loss30` drive
// how far each range shrinks on the map - illustrative, not quoted as data.
const RANGES = [
  { name: 'Tree Swallow', cx: 330, cy: 430, rx: 120, ry: 74, color: 'var(--willow-back)', loss15: 0.2, loss30: 0.43 },
  { name: 'Bobolink', cx: 232, cy: 470, rx: 96, ry: 56, color: 'var(--declines)', loss15: 0.34, loss30: 0.78 },
  { name: 'Wood Thrush', cx: 388, cy: 486, rx: 84, ry: 50, color: 'var(--uncertain)', loss15: 0.3, loss30: 0.82 },
  { name: 'Common Loon', cx: 268, cy: 300, rx: 130, ry: 80, color: 'var(--slate-blue)', loss15: 0.22, loss30: 0.6 },
  { name: 'Canada Jay', cx: 250, cy: 170, rx: 118, ry: 72, color: 'var(--forest)', loss15: 0.3, loss30: 0.7 },
];

const TORONTO = { x: 356, y: 478 };

/** Piecewise-linear loss at a given warming level (0 → 1.5 → 3.0 °C). */
function lossAt(deg, r) {
  if (deg <= 0) return 0;
  if (deg <= 1.5) return (deg / 1.5) * r.loss15;
  return r.loss15 + ((deg - 1.5) / 1.5) * (r.loss30 - r.loss15);
}

/**
 * @param {Object} [o]
 * @param {number} [o.x] @param {number} [o.y] @param {number} [o.s]
 * @returns {{ node, setWarming(deg), ranges, toronto }}
 */
export function ontarioMap({ x = 0, y = 0, s = 1 } = {}) {
  // Static wrapper - GSAP never animates this node, so the attribute is safe.
  const node = g({ class: 'ontario', transform: `translate(${x} ${y}) scale(${s})` });

  // Province silhouette (paper-cut, not survey-accurate).
  node.appendChild(
    path(
      `M52,74 C 150,40 330,30 468,54 C 500,120 494,190 470,246
       C 452,300 420,330 404,372 C 388,414 400,452 372,486
       C 330,532 250,540 196,516 C 150,494 130,452 96,414
       C 60,372 34,300 40,214 C 44,150 44,104 52,74 Z`,
      { fill: '#e6dcc0', stroke: '#c9bb96', 'stroke-width': 3 }
    )
  );
  // A hint of the Great Lakes along the southern edge.
  node.appendChild(ellipse(300, 520, 130, 26, { fill: 'var(--water)', opacity: 0.5 }));

  // Species ranges - each blob is drawn around its own (0,0) and anchored by
  // xform(), so shrinking it scales about the range's centre, not the viewBox.
  const ranges = RANGES.map((r) => {
    const el = ellipse(0, 0, r.rx, r.ry, { fill: r.color, opacity: 0.45 });
    const xf = xform(el, { x: r.cx, y: r.cy });
    node.appendChild(el);
    return { ...r, el, xf };
  });

  // Toronto - the anchor. The whole point is watching the ranges leave it.
  const dot = g({ class: 'ontario__toronto' }, [
    circle(TORONTO.x, TORONTO.y, 9, { fill: 'var(--ink)' }),
    circle(TORONTO.x, TORONTO.y, 16, { fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2, opacity: 0.5 }),
    text('Toronto', {
      x: TORONTO.x + 24,
      y: TORONTO.y + 6,
      'font-size': 22,
      'font-family': 'var(--font-sans)',
      'font-weight': 600,
      fill: 'var(--ink)',
    }),
  ]);
  node.appendChild(dot);

  /** Geometry for one range at a given warming level. */
  function shapeAt(deg, r) {
    const loss = lossAt(deg, r);
    return {
      // Losing range in the south = the blob shrinks AND pulls away from
      // Toronto, northward. Both reads matter: less room, and not here anymore.
      scale: Math.max(0.12, 1 - loss),
      y: r.cy - loss * 120,
      opacity: loss > 0.7 ? 0.12 : 0.45 - loss * 0.2,
    };
  }

  /**
   * Set the warming level in °C, immediately. This is the scrub-friendly form -
   * Frame 20 drives it from the scrolled timeline so the ranges shrink under
   * the reader's own thumb rather than playing out on their own clock.
   */
  function setWarming(deg) {
    ranges.forEach((r) => {
      const s = shapeAt(deg, r);
      r.xf.set({ scale: s.scale, y: s.y });
      gsap.set(r.el, { opacity: s.opacity });
    });
  }

  /** Tweened form, for non-scrubbed use. */
  function toWarming(deg, { duration = 1.2, ease = 'power2.inOut' } = {}) {
    const tl = gsap.timeline();
    ranges.forEach((r) => {
      const s = shapeAt(deg, r);
      tl.add(r.xf.to({ scale: s.scale, y: s.y }, { duration, ease }), 0);
      tl.to(r.el, { opacity: s.opacity, duration, ease }, 0);
    });
    return tl;
  }

  return { node, setWarming, toWarming, ranges, toronto: TORONTO };
}
