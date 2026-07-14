// ============================================================================
// svg.js - tiny helpers for building layered paper-cut SVG without JSX.
// Every visual in this project is composed from these primitives.
// ============================================================================

import { gsap } from './gsap.js';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with attributes and children.
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {(Node|string)[]} [children]
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') node.setAttribute('class', v);
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, String(v));
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export const g = (attrs, children) => el('g', attrs, children);
export const path = (d, attrs = {}) => el('path', { d, ...attrs });
export const circle = (cx, cy, r, attrs = {}) => el('circle', { cx, cy, r, ...attrs });
export const ellipse = (cx, cy, rx, ry, attrs = {}) => el('ellipse', { cx, cy, rx, ry, ...attrs });
export const rect = (x, y, w, h, attrs = {}) => el('rect', { x, y, width: w, height: h, ...attrs });
export const line = (x1, y1, x2, y2, attrs = {}) => el('line', { x1, y1, x2, y2, ...attrs });
export const text = (str, attrs = {}) => el('text', { text: str, ...attrs });

/** A regular polygon path (used for gear-ish and hill shapes). */
export function polygon(points, attrs = {}) {
  return el('polygon', { points: points.map((p) => p.join(',')).join(' '), ...attrs });
}

/** Append several children to a parent, return the parent. */
export function append(parent, ...children) {
  for (const c of children.flat()) if (c) parent.appendChild(c);
  return parent;
}

/**
 * A paper-cut layer: a group carrying a soft drop shadow so cutouts read as
 * stacked construction paper. Slightly rotates/offsets for a handmade feel.
 */
export function layer(children = [], { shadow = true, dx = 0, dy = 0, rot = 0, cls = '' } = {}) {
  const attrs = { class: `paper-layer ${cls}`.trim() };
  if (dx || dy || rot) attrs.transform = `translate(${dx} ${dy}) rotate(${rot})`;
  if (shadow) attrs.filter = 'url(#paperShadow)';
  return g(attrs, children);
}

/**
 * Shared <defs> injected once per stage svg: paper drop-shadow + grain filter
 * + a soft warm glow used for migration paths and lights.
 */
export function defs() {
  return el('defs', {}, [
    el('filter', { id: 'paperShadow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, [
      el('feDropShadow', {
        dx: 0,
        dy: 4,
        stdDeviation: 5,
        'flood-color': '#2e2a24',
        'flood-opacity': 0.22,
      }),
    ]),
    // Outputs *only* noise (never composites SourceGraphic), so the rect it is
    // applied to contributes nothing but paper grain regardless of its fill.
    el('filter', { id: 'grain', x: '0', y: '0', width: '100%', height: '100%' }, [
      el('feTurbulence', {
        type: 'fractalNoise',
        baseFrequency: '0.85',
        numOctaves: 2,
        stitchTiles: 'stitch',
        result: 'noise',
      }),
      el('feColorMatrix', { in: 'noise', type: 'saturate', values: '0' }),
      el('feComponentTransfer', {}, [el('feFuncA', { type: 'linear', slope: '0.055' })]),
    ]),
    el('filter', { id: 'softGlow', x: '-60%', y: '-60%', width: '220%', height: '220%' }, [
      el('feGaussianBlur', { stdDeviation: 6, result: 'b' }),
      el('feMerge', {}, [el('feMergeNode', { in: 'b' }), el('feMergeNode', { in: 'SourceGraphic' })]),
    ]),
    el('radialGradient', { id: 'warmGlow', cx: '50%', cy: '50%', r: '50%' }, [
      el('stop', { offset: '0%', 'stop-color': '#ffe6a8', 'stop-opacity': '0.9' }),
      el('stop', { offset: '100%', 'stop-color': '#ffe6a8', 'stop-opacity': '0' }),
    ]),
    // Sphere shading for globe.js: light from the upper left, terminator falling
    // away to the lower right. Off-centre focal point is what reads as "round"
    // rather than "disc with a vignette".
    el('radialGradient', { id: 'globeShade', cx: '32%', cy: '28%', r: '78%' }, [
      el('stop', { offset: '0%', 'stop-color': '#ffffff', 'stop-opacity': '0.30' }),
      el('stop', { offset: '48%', 'stop-color': '#ffffff', 'stop-opacity': '0' }),
      el('stop', { offset: '100%', 'stop-color': '#0f2430', 'stop-opacity': '0.62' }),
    ]),
  ]);
}

/** Grain overlay rect that sits above a scene for paper texture. */
export function grainOverlay(w, h) {
  return rect(0, 0, w, h, {
    fill: 'none',
    filter: 'url(#grain)',
    opacity: 0.75,
    'pointer-events': 'none',
  });
}

/**
 * Position/scale a node via GSAP rather than a `transform` attribute.
 *
 * Important: GSAP writes a CSS `transform`, which *overrides* an SVG
 * `transform` attribute on the same element. Any node we later animate must
 * therefore be placed with this helper, never with `transform="translate(...)"`,
 * or its placement is silently discarded the first time GSAP touches it.
 */
export function place(node, { x = 0, y = 0, scale = 1, rotation = 0 } = {}) {
  gsap.set(node, { x, y, scale, rotation });
  return node;
}

/** Total length of a path element (for DrawSVG-free stroke reveals). */
export function pathLength(pathEl) {
  return pathEl.getTotalLength ? pathEl.getTotalLength() : 0;
}
