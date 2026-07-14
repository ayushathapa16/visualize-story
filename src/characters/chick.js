// ============================================================================
// chick.js - a nestling. Small, round, big open beak when begging.
// createChick() -> { node, beg(open), setEnergy(0..1), setGrowth(0..1) }
//
// Two independent dials, and they must not fight over the same transform:
//   growth (Scene 7)  - how far along it is: size, feathers, eyes open.
//   energy (Scenes 14/15) - how well it is being fed: brightness and slump.
// A well-fed newborn and a starving fledgling are different pictures, so both
// dials feed ONE scale computation (see apply()) rather than each writing their
// own. The old code hardcoded scale 1.5 inside setEnergy, which is why growth
// had to be threaded through here rather than bolted on in nest.js.
// ============================================================================

import { g, path, ellipse, circle } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

/** Nestling scale at full growth, relative to the hatchling. */
const BASE = 1.5;
const GROWN = 1.5;

export function createChick() {
  const body = ellipse(0, 0, 15, 13, { fill: '#8a6b45' });
  const belly = ellipse(0, 4, 10, 8, { fill: '#c8ab74' });
  const head = circle(0, -12, 10, { fill: '#8a6b45' });
  // Eyes: shut at hatch, open as it grows. Two layers - a lid over the eye -
  // so opening is an opacity crossfade, not a redraw.
  const eyeL = circle(-4, -13, 1.6, { fill: '#12100c', opacity: 0 });
  const eyeR = circle(4, -13, 1.6, { fill: '#12100c', opacity: 0 });
  const lidL = path('M-6,-13 q2,2 4,0', { stroke: '#6f5335', 'stroke-width': 1.2, fill: 'none' });
  const lidR = path('M2,-13 q2,2 4,0', { stroke: '#6f5335', 'stroke-width': 1.2, fill: 'none' });
  // open beak (upper + lower) - the classic begging gape
  // Drawn around (0,0) = the gape hinge; xform() anchors them there.
  const beakUpper = path('M-6,0 L6,0 L0,-4 Z', { fill: '#e0a93b' });
  const beakLower = path('M-6,1 L6,1 L0,6 Z', { fill: '#c77f2a' });
  const tuft = path('M-2,-22 q2,-6 4,0 M2,-22 q2,-5 4,-1', {
    stroke: '#6f5335',
    'stroke-width': 1.5,
    fill: 'none',
  });
  // Wing feathers - the visible proof of growth. Hidden at hatch.
  const wing = path('M-2,-2 q-13,3 -16,12 q9,3 16,-4 z', { fill: '#6f5335', opacity: 0 });

  const node = g({ class: 'chick' }, [
    body,
    belly,
    wing,
    head,
    eyeL,
    eyeR,
    lidL,
    lidR,
    beakLower,
    beakUpper,
    tuft,
  ]);
  // Beak halves are drawn around (0,0) = the gape hinge, and anchored there.
  const xUpper = xform(beakUpper, { x: 0, y: -9 });
  const xLower = xform(beakLower, { x: 0, y: -9 });
  const xNode = xform(node);

  let growth = 0;
  let energy = 1;

  /** The single place both dials resolve into a transform + a filter. */
  function apply(duration = 0.8) {
    const size = BASE * (1 + growth * (GROWN - 1)) * (0.9 + energy * 0.1);
    xNode.to({ scale: size }, { duration });
    gsap.to(node, {
      filter: `saturate(${0.5 + energy * 0.6}) brightness(${0.85 + energy * 0.2})`,
      duration,
    });
  }

  function beg(open = true) {
    xUpper.to({ rotation: open ? -16 : 0 }, { duration: 0.25 });
    xLower.to({ rotation: open ? 16 : 0 }, { duration: 0.25 });
    gsap.to(head, { y: open ? -2 : 0, duration: 0.25, yoyo: !!open, repeat: open ? 1 : 0 });
  }

  function setEnergy(e) {
    energy = e;
    apply();
  }

  /** 0 = just hatched (blind, bald). 1 = feathered, eyes open, ready to fledge. */
  function setGrowth(t, { duration = 0.8 } = {}) {
    growth = Math.min(1, Math.max(0, t));
    // Eyes open early (first third), feathers come in across the rest.
    const eyes = Math.min(1, growth / 0.35);
    const feather = Math.max(0, (growth - 0.25) / 0.75);
    gsap.to([eyeL, eyeR], { opacity: eyes, duration });
    gsap.to([lidL, lidR], { opacity: 1 - eyes, duration });
    gsap.to(wing, { opacity: feather * 0.9, duration });
    gsap.to(tuft, { opacity: 1 - feather * 0.8, duration });
    apply(duration);
  }

  return { node, beg, setEnergy, setGrowth, xf: xNode };
}
