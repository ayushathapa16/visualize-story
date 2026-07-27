// ============================================================================
// morph.js - continuity. "Everything morphs naturally."
// Thin wrappers over MorphSVGPlugin so a shape in one beat becomes the next
// (gear → timeline → thermometer → tree → nest) rather than hard-cutting.
// ============================================================================

import { gsap } from './gsap.js';

/**
 * Morph a path's `d` toward a target (another path element or a `d` string).
 * @param {SVGPathElement} target
 * @param {SVGPathElement|string} shape
 */
export function morphTo(target, shape, { dur = 1.1, ease = 'power2.inOut', ...rest } = {}) {
  return gsap.to(target, { duration: dur, ease, morphSVG: shape, ...rest });
}

/** Crossfade one group out while morphing/fading the next in, at the same spot. */
export function handoff(fromEl, toEl, { dur = 1 } = {}) {
  const tl = gsap.timeline();
  tl.to(fromEl, { opacity: 0, duration: dur * 0.6, ease: 'power1.in' }, 0);
  tl.fromTo(
    toEl,
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: dur, ease: 'power2.out' },
    dur * 0.25
  );
  return tl;
}
