// ============================================================================
// flora.js - trees, flowers, grass, reeds. Paper-cut. Reused everywhere so the
// world stays familiar (docs/direction.md "Visual Continuity").
// ============================================================================

import { g, path, ellipse, circle, rect, line } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';
import { rand } from '../engine/motion.js';

const GREENS = ['#3f5e3a', '#4f7040', '#6e8b4e', '#5a7a44'];

/** A rounded paper tree. Returns { node, canopy, bloom(t) } where bloom greens/flowers it. */
export function tree({ x = 0, y = 0, s = 1, green = '#4f7040' } = {}) {
  const trunk = path('M-8,0 C -6,-40 -6,-70 -3,-96 L3,-96 C 6,-70 6,-40 8,0 Z', {
    fill: 'var(--bark)',
  });
  const c1 = ellipse(-22, -108, 34, 30, { fill: green });
  const c2 = ellipse(20, -116, 38, 34, { fill: green });
  const c3 = ellipse(0, -140, 40, 36, { fill: green });
  const canopy = g({ class: 'tree__canopy' }, [c1, c2, c3]);
  const node = g({ class: 'tree', transform: `translate(${x} ${y}) scale(${s})` }, [trunk, canopy]);

  function bloom(on = true) {
    gsap.to([c1, c2, c3], {
      fill: on ? '#6e8b4e' : '#7f9a5c',
      duration: 1,
      stagger: 0.1,
    });
  }
  return { node, canopy, bloom };
}

/** A single flower on a stem. bloom() opens the petals. */
export function flower({ x = 0, y = 0, s = 1, color = '#e0a93b' } = {}) {
  const stem = path('M0,0 C -2,-14 2,-24 0,-38', { stroke: '#5a7a44', 'stroke-width': 3, fill: 'none' });
  const leaf = ellipse(-6, -18, 7, 3.4, { fill: '#5a7a44', transform: 'rotate(-30 -6 -18)' });
  // Bloom head is drawn around (0,0); xform() anchors it at the top of the
  // stem, so the petals open outward from the flower's own centre.
  const petals = g({ class: 'flower__petals' });
  for (let i = 0; i < 6; i++) {
    petals.appendChild(ellipse(0, -8, 4.5, 9, { fill: color, transform: `rotate(${i * 60})` }));
  }
  const center = circle(0, 0, 4, { fill: '#b5482e' });
  const node = g({ class: 'flower', transform: `translate(${x} ${y}) scale(${s})` }, [
    stem, leaf, petals, center,
  ]);
  // Head art is drawn around (0,0) and anchored at the top of the stem.
  const xPetals = xform(petals, { x: 0, y: -38, scale: 0 });
  const xCenter = xform(center, { x: 0, y: -38, scale: 0 });

  function bloom() {
    return gsap
      .timeline()
      .add(xPetals.to({ scale: 1 }, { duration: 0.7, ease: 'back.out(2)' }))
      .add(xCenter.to({ scale: 1 }, { duration: 0.4, ease: 'back.out(2)' }), '-=0.3');
  }
  return { node, bloom };
}

/** A tuft of grass blades that sway. */
export function grass({ x = 0, y = 0, s = 1, blades = 5, color = '#5a7a44' } = {}) {
  const node = g({ class: 'grass', transform: `translate(${x} ${y}) scale(${s})` });
  for (let i = 0; i < blades; i++) {
    const bx = (i - blades / 2) * 6;
    node.appendChild(
      path(`M${bx},0 C ${bx - 3},-14 ${bx + 4},-22 ${bx + rand(-2, 2)},-30`, {
        stroke: color,
        'stroke-width': 3,
        fill: 'none',
        'stroke-linecap': 'round',
      })
    );
  }
  return { node };
}

/** Cattail reeds for wetlands. */
export function reeds({ x = 0, y = 0, s = 1, n = 4 } = {}) {
  const node = g({ class: 'reeds', transform: `translate(${x} ${y}) scale(${s})` });
  for (let i = 0; i < n; i++) {
    const rx = (i - n / 2) * 12;
    node.appendChild(line(rx, 0, rx, -60, { stroke: '#6e8b4e', 'stroke-width': 3 }));
    node.appendChild(rect(rx - 3, -66, 6, 16, { rx: 3, fill: '#7a5a3a' }));
  }
  return { node };
}

export { GREENS };
