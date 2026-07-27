// ============================================================================
// xform.js - deterministic SVG transforms.
//
// Why this exists: GSAP animates SVG through CSS transforms, and how a browser
// resolves `transform-origin` on an SVG element (against the viewBox, not the
// element) makes rotation/scale pivots unpredictable. `transform-box: fill-box`
// isn't a fix either - the SVG `transform` attribute maps to the same CSS
// property, so it re-interprets attribute rotate() origins and scrambles them.
//
// So for anything we ROTATE or SCALE we own the `transform` attribute directly.
// Rotation and scale are then always about the element's own local (0,0), which
// means art is drawn around its pivot (a wing around its shoulder, a gear around
// its centre) and the transform "just works" with no origin to get wrong.
//
// Pure translation is left to GSAP - that has no origin ambiguity.
// ============================================================================

import { gsap } from './gsap.js';

/**
 * @param {SVGElement} el
 * @param {{x?:number,y?:number,rotation?:number,scale?:number,scaleX?:number,scaleY?:number}} [base]
 * @returns {{ state, set(v), to(v,opts), apply() }}
 */
export function xform(el, base = {}) {
  const s = { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, ...base };
  if (base.scale != null) {
    s.scaleX = base.scale;
    s.scaleY = base.scale;
  }
  delete s.scale;

  function apply() {
    el.setAttribute(
      'transform',
      `translate(${s.x} ${s.y}) rotate(${s.rotation}) scale(${s.scaleX} ${s.scaleY})`
    );
  }
  apply();

  function set(v = {}) {
    if (v.scale != null) {
      v = { ...v, scaleX: v.scale, scaleY: v.scale };
      delete v.scale;
    }
    Object.assign(s, v);
    apply();
  }

  /** Tween the transform. `scale` is expanded to scaleX/scaleY. */
  function to(v = {}, opts = {}) {
    const target = { ...v };
    if (target.scale != null) {
      target.scaleX = target.scale;
      target.scaleY = target.scale;
      delete target.scale;
    }
    return gsap.to(s, { ...target, ...opts, onUpdate: apply });
  }

  return { state: s, set, to, apply, el };
}
