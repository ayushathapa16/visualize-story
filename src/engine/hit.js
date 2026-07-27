// ============================================================================
// hit.js - make a piece of SVG art clickable, without making the SVG clickable.
//
// The stage <svg> is `role="img" aria-hidden="true"`: to a screen reader the
// whole scene is one decorative image, which is correct - it's an animation, not
// content. Putting a focusable <g role="button"> inside it would bury a real
// control inside an aria-hidden subtree, where assistive tech cannot reach it.
//
// So instead: a real DOM <button> is positioned over the art, in the stage's own
// coordinate space. It carries the label, the focus ring and the keyboard
// behaviour; the SVG underneath stays decorative and just reacts to hover.
// This is the same rule choice.js follows - anything clickable is DOM over the
// stage, never SVG inside it.
//
// The projection uses getScreenCTM(), so it survives the viewBox fit AND the
// portrait `scale(1.7)` on .frame__svg (base.css) for free.
// ============================================================================

/**
 * @param {Object} o
 * @param {SVGSVGElement} o.svg    ctx.svg
 * @param {HTMLElement} o.stage    ctx.stage
 * @param {SVGGraphicsElement} o.target  the art to cover. Use a node with a
 *   STATIC transform - if GSAP is animating the node, its box moves and the
 *   button drifts off it.
 * @param {string} o.label         accessible name
 * @param {() => void} o.onActivate
 * @param {string} [o.cls]
 * @returns {{ node, sync(), destroy() }}
 */
export function hitTarget({ svg, stage, target, label, onActivate, cls = '' }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `hit ${cls}`.trim();
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', onActivate);

  // Hover/focus on the button should light up the art it covers, or the card
  // would look inert while the cursor is plainly over it.
  const setHot = (on) => target.classList.toggle('is-hot', on);
  btn.addEventListener('pointerenter', () => setHot(true));
  btn.addEventListener('pointerleave', () => setHot(false));
  btn.addEventListener('focus', () => setHot(true));
  btn.addEventListener('blur', () => setHot(false));

  stage.appendChild(btn);

  function sync() {
    const ctm = target.getScreenCTM();
    if (!ctm) return; // not laid out yet (display:none, or pre-paint)
    const b = target.getBBox();
    const pt = svg.createSVGPoint();
    const corners = [
      [b.x, b.y],
      [b.x + b.width, b.y],
      [b.x, b.y + b.height],
      [b.x + b.width, b.y + b.height],
    ].map(([x, y]) => {
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(ctm);
    });

    const stageRect = stage.getBoundingClientRect();
    const xs = corners.map((c) => c.x);
    const ys = corners.map((c) => c.y);
    const left = Math.min(...xs) - stageRect.left;
    const top = Math.min(...ys) - stageRect.top;

    btn.style.left = `${left}px`;
    btn.style.top = `${top}px`;
    btn.style.width = `${Math.max(...xs) - Math.min(...xs)}px`;
    btn.style.height = `${Math.max(...ys) - Math.min(...ys)}px`;
  }

  // The stage is sticky and full-height, so it only changes size when the window
  // does - one observer, no scroll listener.
  const ro = new ResizeObserver(sync);
  ro.observe(stage);
  requestAnimationFrame(sync);

  return {
    node: btn,
    sync,
    destroy() {
      ro.disconnect();
      btn.remove();
    },
  };
}
