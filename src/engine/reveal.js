// ============================================================================
// reveal.js - "show before explaining."
// Text, labels and data annotations start hidden and are revealed only after
// the animation that earns them. These helpers add reveals onto a timeline.
// ============================================================================

import { gsap } from './gsap.js';

/** Fade + rise a narration line in. Cinematic, unhurried. */
export function revealText(target, { y = 14, dur = 0.9, ease = 'power2.out' } = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration: dur, ease }
  );
}

/** Fade a narration line back out (for held single-line captions). */
export function hideText(target, { y = -10, dur = 0.6 } = {}) {
  return gsap.to(target, { opacity: 0, y, duration: dur, ease: 'power1.in' });
}

/** Reveal a small data annotation - only after the viewer understood the viz. */
export function revealData(target, { dur = 0.7 } = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: dur, ease: 'power2.out' }
  );
}

/** The delayed "term" reveal (e.g. Phenological Mismatch) - scale + fade. */
export function revealTerm(target, { dur = 1.1 } = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: dur, ease: 'power3.out' }
  );
}
