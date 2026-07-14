// ============================================================================
// motion.js - the three motion tiers from docs/direction.md.
//   primary   : the one focal move (usually scrubbed by the frame timeline)
//   secondary : supporting story motion
//   ambient   : always-alive loops (clouds, water, grass, idle) - organic,
//               slightly randomised so nothing feels mechanical.
// Under reduced-motion, ambient loops are suppressed (elements rest at base).
// ============================================================================

import { gsap, REDUCED } from './gsap.js';

const rand = (min, max) => min + Math.random() * (max - min);

/** Gentle horizontal drift, e.g. clouds. */
export function drift(target, { x = 40, dur = 18 } = {}) {
  if (REDUCED) return;
  gsap.to(target, {
    x: `+=${x}`,
    duration: dur * rand(0.85, 1.15),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: rand(0, 2),
  });
}

/** Soft rotational sway around the element's own base, e.g. leaves, grass, trees. */
export function sway(target, { deg = 2.2, dur = 3.4 } = {}) {
  if (REDUCED) return;
  gsap.fromTo(
    target,
    { rotation: -deg },
    {
      rotation: deg,
      duration: dur * rand(0.8, 1.2),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: rand(0, 1.5),
    }
  );
}

/** Vertical bob, e.g. hovering bird, floating leaf. */
export function bob(target, { y = 6, dur = 2.6 } = {}) {
  if (REDUCED) return;
  gsap.to(target, {
    y: `+=${y}`,
    duration: dur * rand(0.85, 1.15),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: rand(0, 1.2),
  });
}

/** Slow water shimmer via subtle scaleY + opacity pulsing on ripple lines. */
export function ripple(targets, { dur = 4 } = {}) {
  if (REDUCED) return;
  gsap.to(targets, {
    scaleX: 1.04,
    opacity: '-=0.15',
    duration: dur,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.3, from: 'random' },
  });
}

/** Twinkle for stars / distant lights. */
export function twinkle(targets) {
  if (REDUCED) return;
  gsap.to(targets, {
    opacity: rand(0.2, 0.4),
    duration: () => rand(1.2, 2.8),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.15, from: 'random' },
  });
}

/**
 * stillness - deliberately hold a beat. Returns a tween of the given duration
 * that does nothing, so it can be dropped into a timeline to create a pause
 * (used for emotional silence: "parents return → pause → no food").
 */
export function stillness(dur = 0.6) {
  return gsap.to({}, { duration: dur });
}

export { rand };
