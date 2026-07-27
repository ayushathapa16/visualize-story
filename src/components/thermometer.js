// ============================================================================
// thermometer.js - the warming (Scene 8) and the cold snap (Scene 12).
// Primary motion: the mercury rises, or drops sharply.
//
// THE DEFAULT SCALE CARRIES NO NUMBERS, AND THAT IS THE POINT. Scene 8 is
// illustrative - it argues that the season has crept earlier as the decades
// warmed, and nothing in this repo sources how far. The scale used to print
// "+1°C" and "+2°C", which was the only quantitative claim in the whole
// illustrative half of the piece with no citation behind it anywhere, and it
// survived the ?nolabels Memory Test as well, so the frame took credit for
// evidence it did not have. Ticks show the rise; only SCALE_SCENARIOS, whose
// values are published (Audubon - see docs/sources.md section C), speaks in
// degrees. Do not put numbers back on SCALE_OBSERVED without a source.
//
// UPDATE 2026-07-27: there is now a sourced observed-warming figure in the repo
// - Ontario +1.5 °C in spring, 1948-2016 (context.js / docs/sources.md §G1) -
// and it is deliberately NOT on this scale. The figure is a single provincial
// trend; these three ticks are evenly spaced positions on a tube whose mercury
// is animated for feel. Labelling them would assert a linear axis nobody
// measured, and the number would then be doing the work of an axis rather than
// of a sentence. Scene 8 states it in its evidence box, where it can carry its
// own scope. Same rule as before: a number goes on this scale only when the
// scale itself is what was measured.
// ============================================================================

import { g, path, rect, circle, text, line } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { xform } from '../engine/xform.js';

// The default scale: three ticks, no numbers. It reads as "rising" without
// asserting how far - see the header. Scene 17 can re-label this same
// instrument to Audubon's published warming scenarios (see components/
// climate.js) - hence `marks` is a parameter, not a fork.
export const SCALE_OBSERVED = [{ t: 0.16 }, { t: 0.5 }, { t: 0.84 }];
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
    // Always built, even when the mark has no label: setMarks() fills these in
    // when a frame swaps to a scale whose numbers are actually sourced.
    const t = text(m.l || '', {
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
