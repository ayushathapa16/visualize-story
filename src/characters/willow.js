// ============================================================================
// willow.js - the protagonist. One layered SVG Tree Swallow that becomes
// expressive purely through animation (docs/direction.md "Willow Character").
//
//   createWillow() -> { node, flap(), setMood(state), flyAlong(path,opts),
//                        stop() }
//
// Local space: bird faces +x (right), ~120px long, origin at body centre so
// MotionPath autoRotate points her the way she travels.
// ============================================================================

import { g, path, ellipse, circle } from '../engine/svg.js';
import { gsap, REDUCED } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

const MOODS = {
  happy: { flapDur: 0.22, flapAmp: 62, tilt: -6, sat: 1.05, bright: 1.06 },
  curious: { flapDur: 0.34, flapAmp: 46, tilt: -2, sat: 1, bright: 1 },
  worried: { flapDur: 0.32, flapAmp: 50, tilt: 3, sat: 0.95, bright: 0.98 },
  tired: { flapDur: 0.6, flapAmp: 30, tilt: 8, sat: 0.72, bright: 0.9 },
  hopeful: { flapDur: 0.26, flapAmp: 58, tilt: -5, sat: 1.08, bright: 1.1 },
};

// The shoulder sits at the wing's local (0,0) - see pivot() in engine/svg.js -
// so a plain `rotation` tween swings the wing about the shoulder.
const SHOULDER = { x: 4, y: -8 };

function wingPath() {
  // A pointed swallow wing sweeping back and down from the shoulder at (0,0).
  return 'M0,0 C -14,-32 -50,-44 -82,-32 C -56,-18 -34,-4 -10,2 Z';
}

export function createWillow({ scale = 1 } = {}) {
  const back = 'var(--willow-back)';
  const back2 = 'var(--willow-back-2)';
  const belly = 'var(--willow-belly)';

  // Darker + dimmer so it reads as the *far* wing rather than a bright fin.
  const farWing = g({ class: 'willow__farwing' }, [
    path(wingPath(), { fill: back2, opacity: 0.75 }),
  ]);

  const body = g({ class: 'willow__body' }, [
    // forked tail
    path('M-28,0 C -52,-4 -70,-10 -84,-16 C -70,-6 -66,0 -66,2 C -66,4 -70,10 -84,16 C -70,10 -52,4 -28,2 Z', {
      fill: back,
    }),
    // body
    ellipse(0, 0, 34, 20, { fill: back }),
    // white belly
    path('M-18,6 C -6,20 26,18 40,6 C 30,16 -6,20 -18,10 Z', { fill: belly }),
    // head
    circle(30, -7, 16, { fill: back }),
    // cheek/belly meets throat
    path('M20,2 C 30,10 42,8 46,2 C 40,8 30,8 22,2 Z', { fill: belly }),
    // beak
    path('M44,-7 L60,-4 L44,0 Z', { fill: 'var(--willow-beak)' }),
    // eye
    circle(35, -10, 3.1, { fill: '#12100c' }),
    circle(36.1, -11, 1, { fill: '#fff', opacity: 0.85 }),
  ]);

  const nearWing = g({ class: 'willow__nearwing' }, [
    path(wingPath(), { fill: back }),
    // a hint of iridescence highlight
    path('M-4,-2 C -18,-22 -44,-32 -66,-26', { fill: 'none', stroke: '#bfe0ea', 'stroke-width': 2, opacity: 0.5 }),
  ]);

  // An insect held in the beak. This is the clearest read of "she found food"
  // versus "she came back with nothing" - the Frame 6 / Frame 12 contrast.
  const prey = g({ class: 'willow__prey' }, [
    ellipse(66, -4, 6, 4, { fill: '#3a3327' }),
    path('M62,-7 L70,-12 M66,-7 L72,-11', { stroke: '#3a3327', 'stroke-width': 1.2, fill: 'none' }),
  ]);
  gsap.set(prey, { opacity: 0 });

  // Each wing is drawn with its shoulder at (0,0) and anchored at the shoulder,
  // so `rotation` swings it about the joint. Body art is drawn around (0,0) too.
  const node = g({ class: 'willow' }, [farWing, body, nearWing, prey]);
  const wrap = g({ class: 'willow-wrap' }, [node]);

  const xNear = xform(nearWing, { x: SHOULDER.x, y: SHOULDER.y });
  const xFar = xform(farWing, { x: SHOULDER.x, y: SHOULDER.y });
  const xBody = xform(body);
  xform(node, { scale });

  let flapTween = null;
  let mood = 'curious';

  function flap(state = mood) {
    const m = MOODS[state] || MOODS.curious;
    if (flapTween) flapTween.kill();
    if (REDUCED) {
      xNear.set({ rotation: -m.flapAmp * 0.3 });
      xFar.set({ rotation: m.flapAmp * 0.2 });
      return;
    }
    xNear.set({ rotation: -m.flapAmp * 0.85 });
    xFar.set({ rotation: m.flapAmp * 0.6 });
    flapTween = gsap.timeline({ repeat: -1, yoyo: true });
    flapTween
      .add(xNear.to({ rotation: m.flapAmp }, { duration: m.flapDur, ease: 'sine.inOut' }), 0)
      .add(xFar.to({ rotation: -m.flapAmp * 0.7 }, { duration: m.flapDur, ease: 'sine.inOut' }), 0);
  }

  function setMood(state) {
    const m = MOODS[state] || MOODS.curious;
    mood = state;
    xBody.to({ rotation: m.tilt }, { duration: 0.8, ease: 'sine.inOut' });
    gsap.to(node, {
      filter: `saturate(${m.sat}) brightness(${m.bright})`,
      duration: 0.8,
    });
    flap(state);
  }

  /**
   * Fly along an SVG path. Returns the tween (add to a scrubbed timeline).
   * @param {SVGPathElement|string} shape  path element or selector
   */
  function flyAlong(shape, { start = 0, end = 1, autoRotate = true, ...rest } = {}) {
    return gsap.to(wrap, {
      motionPath: {
        path: shape,
        align: shape,
        alignOrigin: [0.5, 0.5],
        autoRotate,
        start,
        end,
      },
      ease: 'none',
      ...rest,
    });
  }

  /** Show/hide the insect in her beak. */
  function carry(show = true) {
    return gsap.to(prey, { opacity: show ? 1 : 0, duration: 0.25 });
  }

  function stop() {
    if (flapTween) flapTween.kill();
  }

  return { node: wrap, inner: node, flap, setMood, flyAlong, carry, stop };
}
