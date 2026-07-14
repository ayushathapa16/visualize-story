// ============================================================================
// camera.js - "the camera is another storyteller."
// Wraps a <g.camera> inside a stage svg and animates viewBox-style pushes,
// pulls and pans (Wide / Medium / Close-up / Macro / Zoom-out).
//
// The transform focuses point (fx,fy) at the stage centre with a given zoom:
//   translate(cx,cy) scale(s) translate(-fx,-fy)
// ============================================================================

import { gsap } from './gsap.js';

// Named shots → default zoom levels (frames can override with explicit scale).
export const SHOTS = {
  wide: 1,
  medium: 1.35,
  close: 2.1,
  macro: 3.4,
  zoomout: 0.72,
};

export function createCamera(group, { width, height }) {
  const cx = width / 2;
  const cy = height / 2;
  // Current camera state, mutated by tweens.
  const state = { fx: cx, fy: cy, scale: 1 };

  function apply() {
    group.setAttribute(
      'transform',
      `translate(${cx} ${cy}) scale(${state.scale}) translate(${-state.fx} ${-state.fy})`
    );
  }
  apply();

  /**
   * Move the camera. Accepts a named shot or explicit focus/scale.
   * @param {Object} o
   * @param {keyof SHOTS} [o.shot]
   * @param {number} [o.fx] @param {number} [o.fy] @param {number} [o.scale]
   * Remaining keys are passed to gsap (duration, ease, ...).
   */
  function to({ shot, fx, fy, scale, ...tween }) {
    const target = {
      fx: fx ?? state.fx,
      fy: fy ?? state.fy,
      scale: scale ?? (shot ? SHOTS[shot] : state.scale),
    };
    return gsap.to(state, {
      ...target,
      duration: 1.2,
      ease: 'power2.inOut',
      ...tween,
      onUpdate: apply,
    });
  }

  /** Set immediately (no tween) - for initial framing. */
  function set({ shot, fx, fy, scale }) {
    if (fx != null) state.fx = fx;
    if (fy != null) state.fy = fy;
    if (scale != null) state.scale = scale;
    else if (shot) state.scale = SHOTS[shot];
    apply();
  }

  return { to, set, state, center: { cx, cy } };
}
