// ============================================================================
// parkLife.js - Tommy Thompson Park, early morning. Cyclists, kayakers,
// dog-walkers.
//
// Reused by Scene 1 and Scene 22, and the reuse IS the point: the story opens
// and closes on the same shoreline at two ends of a day, and the bookend only
// lands if the people are recognisably the same people. Don't fork it for the
// sunset - pass `mood: 'dusk'` (CLAUDE.md invariant 2).
//
// Paper-cut silhouettes: no faces, no detail. They are the city going about its
// morning, not characters - Willow is the character.
// ============================================================================

import { g, path, circle, ellipse, line } from '../engine/svg.js';
import { drift, bob, rand } from '../engine/motion.js';
import { xform } from '../engine/xform.js';

const PALETTE = {
  dawn: { body: '#3f3a31', accent: '#6b6154' },
  dusk: { body: '#2c2822', accent: '#4d4539' },
};

/** A cyclist, drawn around its own (0,0) at the wheels' contact line. */
function cyclist(c) {
  const n = g({ class: 'park__cyclist' });
  n.appendChild(circle(-13, -9, 9, { fill: 'none', stroke: c.body, 'stroke-width': 2.5 }));
  n.appendChild(circle(13, -9, 9, { fill: 'none', stroke: c.body, 'stroke-width': 2.5 }));
  n.appendChild(
    path('M-13,-9 L0,-14 L8,-26 M0,-14 L13,-9 M8,-26 L14,-24', {
      stroke: c.body,
      'stroke-width': 2.5,
      fill: 'none',
    })
  );
  // rider
  n.appendChild(path('M2,-40 L8,-26 M2,-40 L-2,-30 L0,-16', { stroke: c.body, 'stroke-width': 3, fill: 'none' }));
  n.appendChild(circle(3, -46, 5, { fill: c.body }));
  n.appendChild(path('M2,-38 L14,-30', { stroke: c.accent, 'stroke-width': 2.5, fill: 'none' }));
  return n;
}

/** A walker with a dog on a lead. */
function dogWalker(c) {
  const n = g({ class: 'park__walker' });
  // person
  n.appendChild(circle(0, -46, 6, { fill: c.body }));
  n.appendChild(path('M0,-40 L0,-20 M0,-20 L-6,0 M0,-20 L6,0 M0,-36 L10,-28', {
    stroke: c.body,
    'stroke-width': 3.5,
    fill: 'none',
    'stroke-linecap': 'round',
  }));
  // lead
  n.appendChild(path('M10,-28 Q22,-22 30,-12', { stroke: c.accent, 'stroke-width': 1.5, fill: 'none' }));
  // dog
  const dog = g({ class: 'park__dog' }, [
    ellipse(36, -8, 10, 6, { fill: c.body }),
    circle(46, -13, 4.5, { fill: c.body }),
    path('M28,-4 L28,0 M34,-4 L34,0 M40,-4 L40,0 M44,-4 L44,0', {
      stroke: c.body,
      'stroke-width': 2,
    }),
    path('M27,-11 Q23,-16 26,-18', { stroke: c.body, 'stroke-width': 2, fill: 'none' }),
  ]);
  n.appendChild(dog);
  return n;
}

/** A kayaker, seen from the shore - hull on the waterline, paddle swinging. */
function kayaker(c) {
  const n = g({ class: 'park__kayak' });
  const hull = path('M-34,0 Q0,10 34,0 Q0,4 -34,0 Z', { fill: c.body });
  n.appendChild(hull);
  n.appendChild(circle(0, -14, 5.5, { fill: c.body }));
  n.appendChild(path('M0,-9 L0,-2', { stroke: c.body, 'stroke-width': 4 }));
  // Paddle is drawn around its own centre so it can rotate about the grip.
  const paddle = line(-16, 0, 16, 0, { stroke: c.accent, 'stroke-width': 3, 'stroke-linecap': 'round' });
  const px = xform(paddle, { x: 0, y: -8, rotation: -22 });
  n.appendChild(paddle);
  return { node: n, paddle: px };
}

/**
 * @param {Object} [o]
 * @param {'dawn'|'dusk'} [o.mood]
 * @param {number} [o.shoreY]  y of the path along the spit
 * @param {number} [o.waterY]  y of the waterline
 * @param {boolean} [o.animate] ambient loops (off under reduced motion)
 * @returns {{ node, people[], boats[] }}
 */
export function parkLife({ mood = 'dawn', shoreY = 640, waterY = 720, animate = true } = {}) {
  const c = PALETTE[mood] || PALETTE.dawn;
  const node = g({ class: `park-life park-life--${mood}` });

  const people = [];
  const boats = [];

  // Placement (xform -> transform attribute) and ambient drift (GSAP -> CSS
  // transform) must never land on the same element: GSAP's transform silently
  // overrides the attribute and the figure snaps to the origin at full scale.
  // So every figure is a wrapper we xform, holding an inner group we animate.
  function mount(art, { x, y, s }) {
    const outer = g({ class: 'park__anchor' });
    const inner = g({ class: 'park__move' }, [art]);
    outer.appendChild(inner);
    const xf = xform(outer, { x, y, scale: s });
    node.appendChild(outer);
    return { node: outer, inner, xf };
  }

  // Along the shoreline path. Scale falls with distance so the spit reads as
  // receding, which is what gives Scene 1's camera glide something to move past.
  const cast = [
    { make: cyclist, x: 210, s: 1.0, speed: 54 },
    { make: dogWalker, x: 470, s: 0.86, speed: 26 },
    { make: cyclist, x: 1180, s: 0.78, speed: -44 },
    { make: dogWalker, x: 1390, s: 0.7, speed: -20 },
  ];

  for (const p of cast) {
    const fig = mount(p.make(c), { x: p.x, y: shoreY, s: p.s });
    if (animate) drift(fig.inner, { x: p.speed, dur: 22 + rand(0, 6) });
    people.push(fig);
  }

  // Kayakers sit on the water, lower and smaller.
  for (const k of [
    { x: 640, s: 0.9, speed: 30 },
    { x: 980, s: 0.72, speed: -24 },
  ]) {
    const boat = kayaker(c);
    const fig = mount(boat.node, { x: k.x, y: waterY, s: k.s });
    if (animate) {
      drift(fig.inner, { x: k.speed, dur: 26 + rand(0, 8) });
      bob(fig.inner, { y: 3, dur: 3.2 + rand(0, 0.8) });
      boat.paddle.to({ rotation: 22 }, { duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    boats.push(fig);
  }

  return { node, people, boats };
}
