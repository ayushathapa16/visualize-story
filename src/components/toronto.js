// ============================================================================
// toronto.js - paper-cut Toronto: sky, skyline (with CN Tower), waterfront &
// wetland, foreground park. Built as parallax layers so the camera/scroll can
// glide Willow through it (Frames 3, 6, 10, 24). Reused for continuity.
// ============================================================================

import { g, path, rect, ellipse, circle, line } from '../engine/svg.js';
import { tree, grass, reeds } from './flora.js';
import { rand } from '../engine/motion.js';

const W = 1600;
const H = 900;

function building(x, w, h, color, windows = true) {
  const top = H - 250 - h;
  const b = g({ class: 'bldg' }, [rect(x, top, w, h + 700, { fill: color })]);
  if (windows) {
    for (let wy = top + 16; wy < H - 260; wy += 26) {
      for (let wx = x + 8; wx < x + w - 8; wx += 18) {
        if (Math.random() > 0.35)
          b.appendChild(rect(wx, wy, 8, 12, { fill: '#f0e4c4', opacity: rand(0.5, 0.9) }));
      }
    }
  }
  return b;
}

function cnTower(x) {
  const y = H - 250;
  return g({ class: 'cn-tower' }, [
    // shaft
    path(`M${x - 10},${y} L${x - 5},${y - 360} L${x + 5},${y - 360} L${x + 10},${y} Z`, { fill: '#b7bcc4' }),
    // main pod
    ellipse(x, y - 372, 26, 16, { fill: '#9aa0aa' }),
    path(`M${x - 22},${y - 372} L${x - 12},${y - 398} L${x + 12},${y - 398} L${x + 22},${y - 372} Z`, {
      fill: '#c3c8d0',
    }),
    // upper pod + antenna
    rect(x - 6, y - 470, 12, 74, { fill: '#9aa0aa' }),
    line(x, y - 470, x, y - 530, { stroke: '#7f858f', 'stroke-width': 3 }),
    circle(x, y - 532, 3, { fill: '#c0392b' }),
  ]);
}

/** person / cyclist silhouettes for life in the park */
function person(x, y, color = '#3f5e3a') {
  return g({ class: 'person', transform: `translate(${x} ${y})` }, [
    circle(0, -34, 7, { fill: color }),
    path('M-7,-27 C -9,-10 -6,-2 -6,0 L6,0 C 6,-2 9,-10 7,-27 Z', { fill: color }),
  ]);
}

/**
 * @param {Object} [o]
 * @param {boolean} [o.wetlandFront=true] show wetland/park foreground
 * @returns {{ node, layers:{sky,far,mid,near} }}
 */
export function toronto({ wetlandFront = true } = {}) {
  // --- Sky ---
  const sky = g({ class: 'ct-sky' }, [
    rect(-600, -500, W + 1200, H + 1000, { fill: 'url(#tSky)' }),
  ]);
  // define sky gradient inline (frame defs already present, add our own)
  const grad = g();
  const lg = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  lg.setAttribute('id', 'tSky');
  lg.setAttribute('x1', '0');
  lg.setAttribute('y1', '0');
  lg.setAttribute('x2', '0');
  lg.setAttribute('y2', '1');
  [
    ['0%', '#bcd6e6'],
    ['55%', '#d7e6e4'],
    ['100%', '#e9ecd6'],
  ].forEach(([o, c]) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s.setAttribute('offset', o);
    s.setAttribute('stop-color', c);
    lg.appendChild(s);
  });
  grad.appendChild(lg);
  sky.appendChild(grad);

  // --- Far skyline ---
  const far = g({ class: 'ct-far' });
  const skyBlues = ['#8a9bb0', '#7d90a8', '#93a3b6', '#6f83a0'];
  let bx = 120;
  far.appendChild(cnTower(430));
  const layout = [
    [90, 210], [70, 150], [110, 320], [80, 180], [95, 260], [70, 140], [120, 300], [85, 200], [100, 250], [75, 160],
  ];
  layout.forEach(([w, h], i) => {
    if (Math.abs(bx - 420) < 90) bx = 520; // leave room for CN tower
    far.appendChild(building(bx, w, h, skyBlues[i % skyBlues.length]));
    bx += w + rand(6, 20);
  });

  // --- Mid: waterfront band + trees ---
  const mid = g({ class: 'ct-mid' });
  mid.appendChild(rect(-600, H - 250, W + 1200, 90, { fill: '#6c93a6' })); // water
  for (let i = 0; i < 6; i++) {
    mid.appendChild(
      ellipse(rand(0, W), H - 250 + rand(20, 70), rand(30, 70), 4, { fill: '#8fb1bf', opacity: 0.5, class: 'ripple' })
    );
  }
  [tree({ x: 180, y: H - 160, s: 0.8, green: '#4f7040' }),
   tree({ x: 1300, y: H - 150, s: 0.95, green: '#3f5e3a' }),
   tree({ x: 980, y: H - 170, s: 0.7, green: '#5a7a44' })].forEach((t) => mid.appendChild(t.node));

  // --- Near: green park foreground with people & wetland ---
  const near = g({ class: 'ct-near' });
  near.appendChild(path(`M-600,${H - 160} C 400,${H - 200} 1200,${H - 130} ${W + 600},${H - 175} L${W + 600},${H + 500} L-600,${H + 500} Z`, {
    fill: '#6e8b4e',
  }));
  near.appendChild(path(`M-600,${H - 90} C 500,${H - 120} 1100,${H - 70} ${W + 600},${H - 100} L${W + 600},${H + 500} L-600,${H + 500} Z`, {
    fill: '#5a7a44',
  }));
  if (wetlandFront) {
    near.appendChild(reeds({ x: 120, y: H - 90, s: 1 }).node);
    near.appendChild(reeds({ x: 1440, y: H - 80, s: 1.1 }).node);
    near.appendChild(grass({ x: 700, y: H - 70, s: 1.2 }).node);
  }
  near.appendChild(person(520, H - 80, '#b5482e'));
  near.appendChild(person(560, H - 78, '#3f5e3a'));
  near.appendChild(person(1120, H - 84, '#2e4a5e'));
  near.appendChild(tree({ x: 1500, y: H - 40, s: 1.2, green: '#3f5e3a' }).node);

  const node = g({ class: 'toronto' }, [sky, far, mid, near]);
  return { node, layers: { sky, far, mid, near } };
}
