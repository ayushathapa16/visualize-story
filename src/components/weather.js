// ============================================================================
// weather.js - sun, clouds, rain, snow. Ambient + the Frame 11 cold turn.
// ============================================================================

import { g, path, circle, ellipse, line, place } from '../engine/svg.js';
import { gsap, REDUCED } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';
import { rand } from '../engine/motion.js';

/** A warm paper sun with soft rays. */
export function sun({ x = 0, y = 0, r = 46 } = {}) {
  const rays = g({ class: 'sun__rays' });
  for (let i = 0; i < 12; i++) {
    rays.appendChild(
      line(0, -r - 10, 0, -r - 26, {
        stroke: '#e8c25a',
        'stroke-width': 5,
        'stroke-linecap': 'round',
        transform: `rotate(${i * 30})`,
      })
    );
  }
  const disc = circle(0, 0, r, { fill: '#f2c94c' });
  const node = g({ class: 'sun', transform: `translate(${x} ${y})` }, [rays, disc]);
  const xRays = xform(rays); // rays are drawn around (0,0)
  if (!REDUCED) xRays.to({ rotation: 360 }, { duration: 90, ease: 'none', repeat: -1 });
  return { node, disc, rays };
}

/** A fluffy paper cloud. dark=true tints it storm-grey. */
export function cloud({ x = 0, y = 0, s = 1, dark = false } = {}) {
  const fill = dark ? '#6b717c' : '#f4ecd8';
  const node = g({ class: 'cloud' }, [
    ellipse(-34, 6, 34, 22, { fill }),
    ellipse(0, -8, 40, 30, { fill }),
    ellipse(36, 6, 32, 22, { fill }),
    ellipse(6, 14, 46, 18, { fill }),
  ]);
  place(node, { x, y, scale: s }); // GSAP owns the transform (drift() moves it)
  function darken(on = true) {
    gsap.to(node.querySelectorAll('ellipse'), { fill: on ? '#5c626d' : '#f4ecd8', duration: 1.2 });
  }
  return { node, darken };
}

/**
 * Rain/snow field within a bounding box. Returns { node, start(), stop() }.
 * type: 'rain' | 'snow'
 */
export function precip({ w = 1600, h = 900, count = 60, type = 'rain' } = {}) {
  const node = g({ class: `precip precip--${type}` });
  const drops = [];
  for (let i = 0; i < count; i++) {
    const el =
      type === 'rain'
        ? line(0, 0, 0, 16, { stroke: '#9fb8c9', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.7 })
        : circle(0, 0, rand(2, 4), { fill: '#f4f2ea', opacity: 0.9 });
    gsap.set(el, { x: rand(0, w), y: rand(0, h) });
    node.appendChild(el);
    drops.push(el);
  }
  gsap.set(node, { opacity: 0 });
  let tweens = [];

  function start() {
    gsap.to(node, { opacity: 1, duration: 1 });
    if (REDUCED) return;
    tweens = drops.map((d) => {
      const dur = type === 'rain' ? rand(0.5, 0.9) : rand(2.4, 4);
      const drift = type === 'snow' ? rand(-30, 30) : 0;
      const wrapY = gsap.utils.wrap(-20, h + 20);
      return gsap.to(d, {
        y: `+=${h + 40}`,
        x: `+=${drift}`,
        duration: dur,
        ease: 'none',
        repeat: -1,
        delay: rand(0, dur),
        modifiers: { y: (y) => wrapY(parseFloat(y)) + 'px' },
      });
    });
  }
  function stop() {
    gsap.to(node, { opacity: 0, duration: 1, onComplete: () => tweens.forEach((t) => t.kill()) });
  }
  return { node, start, stop };
}
