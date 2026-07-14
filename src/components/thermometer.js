// ============================================================================
// thermometer.js - the warming (Frame 8) and the cold snap (Frame 11).
// Primary motion: the mercury rises (+1 → +2 °C) or drops sharply.
// ============================================================================

import { g, path, rect, circle, text, line } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

// The default scale is the one Frame 8 taught the audience to read.
// Frame 20 re-labels this same instrument to Audubon's warming scenarios
// (see components/climate.js) - hence `marks` is a parameter, not a fork.
export const SCALE_OBSERVED = [
  { t: 0.16, l: '0°' },
  { t: 0.5, l: '+1°C' },
  { t: 0.84, l: '+2°C' },
];
export const SCALE_SCENARIOS = [
  { t: 0.16, l: '0°' },
  { t: 0.5, l: '+1.5°C' },
  { t: 0.84, l: '+3.0°C' },
];

export function thermometer({ x = 1250, y = 250, h = 380, marks = SCALE_OBSERVED } = {}) {
  const bulbR = 40;
  const tubeW = 34;
  const node = g({ class: 'thermo', transform: `translate(${x} ${y})` });

  // Glass
  node.appendChild(
    path(
      `M${-tubeW / 2},0 a${tubeW / 2},${tubeW / 2} 0 0 1 ${tubeW},0 L${tubeW / 2},${h}
       a${bulbR},${bulbR} 0 1 1 ${-tubeW},0 Z`,
      { fill: '#f4ecd8', stroke: '#cbb98f', 'stroke-width': 4 }
    )
  );

  // Mercury (clipped column + bulb)
  const bulb = circle(0, h + 36, bulbR - 8, { fill: '#c0392b' });
  // Drawn upward from (0,0) and anchored at the tube's base, so scaleY rises
  // from the bulb rather than from the top of the tube.
  const column = rect(-tubeW / 2 + 7, -h, tubeW - 14, h, { rx: 8, fill: '#c0392b' });
  node.appendChild(bulb);
  node.appendChild(column);
  const xCol = xform(column, { x: 0, y: h, scaleY: 0.16 });

  // Scale ticks + labels
  const labels = marks.map((m) => {
    const my = h - m.t * h;
    node.appendChild(line(tubeW / 2 + 4, my, tubeW / 2 + 16, my, { stroke: 'var(--ink-soft)', 'stroke-width': 2 }));
    const t = text(m.l, {
      x: tubeW / 2 + 22,
      y: my + 6,
      'font-size': 22,
      'font-family': 'var(--font-sans)',
      'font-weight': 600,
      fill: 'var(--ink)',
    });
    node.appendChild(t);
    return t;
  });

  /**
   * Re-label the scale in place (Frame 20). The instrument doesn't change -
   * only what its numbers mean does, which is the entire beat.
   */
  function setMarks(next) {
    const tl = gsap.timeline();
    labels.forEach((el, i) => {
      if (!next[i]) return;
      tl.to(el, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0)
        .add(() => {
          el.textContent = next[i].l;
        }, 0.35)
        .to(el, { opacity: 1, fill: 'var(--terracotta)', duration: 0.5, ease: 'power2.out' }, 0.4 + i * 0.08);
    });
    return tl;
  }

  /** level 0..1 - mapped so 0.16 baseline reads as "0°". */
  function setLevel(level) {
    xCol.set({ scaleY: Math.max(0.05, level) });
    // warm→cool tint of mercury as it drops
    const cool = level < 0.3;
    gsap.to([column, bulb], { fill: cool ? '#5b7c99' : '#c0392b', duration: 0.6 });
  }

  return { node, setLevel, setMarks, column, bulb, labels };
}
