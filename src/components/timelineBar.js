// ============================================================================
// timelineBar.js - the year as four abundance curves.
//
//   phenologyBars() - Scene 20, the mismatch: both states in one frame.
//   seasonStrip()   - the small version Scenes 4-8 and 14-18 carry, one curve
//                     per scene, so the reader has read the instrument eight
//                     times before Scene 20 argues with it.
//
// Every row is an abundance CURVE, not a bar, and that is a claim about the
// science rather than a style choice. A bar says "present / absent"; only a
// curve can show "still there, but past the peak", which is the actual finding.
//
// Warming pulls the FOOD forward: plants leaf out and insects emerge earlier,
// so their peaks slide toward early spring. The birds' clock barely moves - a
// swallow times its brood by daylight, not temperature - so the Swallow and
// Chick curves stay put. The mismatch is the gap that opens between the food
// peaks (now on the left) and the chicks' peak demand (still where it was).
//
// Every curve's height is illustrative and is never quoted as a number.
// ============================================================================

import { g, path, circle, text, line } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';

const AXIS_COLOR = '#8a8069';
const SIGMA = 0.12;

// The four curves, at module scope because TWO components draw them. One source
// of truth on purpose: if the strip and the payoff chart ever disagreed about
// where a peak sits, the recognition in Scene 20 would die.
//
// `muBase` is where each peak falls in a normal year - they start clustered,
// food and mouths lined up. `muShift` is how far the peak slides earlier once
// fully warmed: the food advances, the birds don't.
const ROWS = [
  { key: 'plants', label: '🌱 Plants', icon: '🌱', fill: '#c77fa0', stroke: '#a85f83', muBase: 0.5, muShift: 0.22 },
  { key: 'insects', label: '🦟 Insects', icon: '🦟', fill: '#6e8b4e', stroke: '#4f7040', muBase: 0.54, muShift: 0.2 },
  { key: 'swallow', label: '🐦 Swallow', icon: '🐦', fill: '#3a6ea5', stroke: '#2c5580', muBase: 0.58, muShift: 0.02 },
  { key: 'chicks', label: '🐥 Chicks', icon: '🐥', fill: '#e0a93b', stroke: '#b6842a', muBase: 0.62, muShift: 0.0 },
];

const abundance = (t, mu) => Math.exp(-((t - mu) ** 2) / (2 * SIGMA * SIGMA));

/**
 * The same four curves, small, for the scenes that walk the year one stage at a
 * time: Scenes 4-8 at `shift: 0` ("A normal year") and Scenes 14-18 at
 * `shift: 1` ("A warmer year"). One row arrives per scene.
 *
 * It shows WHEN things happen and nothing else. None of Scene 20's furniture
 * lives here - no demand line, no dot riding the insect curve, no "peak", no
 * citation - because those marks argue what the timing costs, and that argument
 * belongs to the one frame carrying a paper for it.
 *
 * No axis labels, no numbers, no row names either. These curves are invented
 * shapes that teach an idea (see this file's header), and anything that reads as
 * measurement would quietly promote them into data.
 *
 * @param {Object} o
 * @param {number} o.shown  how many rows are drawn, 1-4
 * @param {number} o.shift  0 = a normal year, 1 = fully warmed
 * @param {string} o.title  the header
 * @param {string|string[]} o.note  a line, or lines, under the strip saying what
 *   is happening ON IT. Every scene passes one; Scene 4 passes two, because it
 *   is the first time a reader sees the thing and has to be told what it is.
 *
 *   The rule these lines live by: **describe what is drawn, never what it
 *   costs.** "The plants peak earlier than they used to" is a description of a
 *   curve the reader can see. "So the chicks miss the peak" is an inference,
 *   and it is Scene 20's, because Scene 20 is the frame with a paper behind it.
 * @returns {{ node, revealRow(i), showRows(n), rows }}
 */
export function seasonStrip({
  x = 560,
  y = 96,
  w = 470,
  shown = 4,
  shift = 0,
  title = 'A normal year',
  note = '',
} = {}) {
  const node = g({ class: 'season-strip', transform: `translate(${x} ${y})` });
  const rowH = 34;
  const curveH = rowH * 0.82;

  node.appendChild(
    text(title, {
      // Classed so ?nolabels can hide it: without the words the strip still has
      // to read as curves arriving in line, then sitting apart. If it doesn't,
      // the strip is not carrying its own weight.
      class: 'season-strip__title',
      x: 0,
      y: -16,
      'font-size': 20,
      'font-family': 'var(--font-sans)',
      'font-weight': 700,
      fill: 'var(--ink-soft)',
    })
  );

  const rows = ROWS.slice(0, shown).map((r, i) => {
    const rowY = i * rowH;
    const baseline = rowY + curveH;
    const mu = r.muBase - shift * r.muShift;

    const N = 48;
    let top = '';
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const px = t * w;
      const py = rowY + curveH * (1 - abundance(t, mu));
      top += `${k === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)} `;
    }

    const area = path(`${top} L${w},${baseline} L0,${baseline} Z`, { fill: r.fill, opacity: 0 });
    const stroke = path(top, { fill: 'none', stroke: r.stroke, 'stroke-width': 2.5, opacity: 0 });
    const icon = text(r.icon, {
      x: -22,
      y: baseline - 2,
      'text-anchor': 'end',
      'font-size': 22,
      opacity: 0,
    });
    node.appendChild(area);
    node.appendChild(stroke);
    node.appendChild(icon);
    return { ...r, area, stroke, icon };
  });

  // The only hint that the horizontal is time: a line the eye reads left to
  // right. No ticks, no "early spring / late spring" - that is Scene 20's.
  // Fixed to the full four rows, not to `shown`, so the strip occupies exactly
  // the same box in every scene and the reader's eye never has to re-find it.
  const axisY = ROWS.length * rowH + 6;
  node.appendChild(
    line(0, axisY, w, axisY, { stroke: AXIS_COLOR, 'stroke-width': 1.5, opacity: 0.5 })
  );
  node.appendChild(
    path(`M${w - 10},${axisY - 5} L${w},${axisY} L${w - 10},${axisY + 5}`, {
      fill: 'none',
      stroke: AXIS_COLOR,
      'stroke-width': 1.5,
      opacity: 0.5,
    })
  );

  [].concat(note || []).forEach((lineText, i) => {
    node.appendChild(
      text(lineText, {
        class: 'season-strip__title', // hidden by ?nolabels along with the header
        x: 0,
        y: axisY + 26 + i * 23,
        'font-size': 17,
        'font-family': 'var(--font-sans)',
        fill: 'var(--ink-soft)',
      })
    );
  });

  /** Fade row `i` in - played by the scene that introduces that stage. */
  function revealRow(i) {
    const r = rows[i];
    const tl = gsap.timeline();
    if (!r) return tl;
    tl.to(r.icon, { opacity: 1, duration: 0.5 }, 0)
      .to(r.stroke, { opacity: 1, duration: 0.7 }, 0)
      .to(r.area, { opacity: 0.42, duration: 0.7 }, 0);
    return tl;
  }

  /** Rows established by earlier scenes - on screen from the first frame. */
  function showRows(n) {
    rows.slice(0, n).forEach((r) => {
      gsap.set([r.icon, r.stroke], { opacity: 1 });
      gsap.set(r.area, { opacity: 0.42 });
    });
  }

  return { node, revealRow, showRows, rows };
}

/** Scene 20 - the mismatch. */
export function phenologyBars({ x = 360, y = 250, w = 880 } = {}) {
  const node = g({ class: 'pheno', transform: `translate(${x} ${y})` });
  // Tight rows: the chart shares the stage with a two-voice caption AND the
  // clickable term below it, and it is the tallest thing in the piece.
  const rowH = 78;
  const curveH = rowH * 0.78;

  // The same four curves seasonStrip() has been drawing since Scene 4, which is
  // the whole reason this chart is legible on sight (see ROWS above).
  const rows = ROWS;

  // axis
  const axisY = rows.length * rowH + 30;
  node.appendChild(line(0, axisY, w, axisY, { stroke: AXIS_COLOR, 'stroke-width': 2 }));
  ['Early spring', 'Late spring'].forEach((lab, i) =>
    node.appendChild(
      text(lab, { x: i === 0 ? 0 : w, y: axisY + 34, 'text-anchor': i === 0 ? 'start' : 'end', 'font-size': 18, 'font-family': 'var(--font-sans)', fill: 'var(--ink-soft)' })
    )
  );

  // The chicks' peak demand is fixed (muShift 0), so it is the reference the
  // food peaks are seen to leave behind.
  const chicksRow = rows.find((r) => r.key === 'chicks');
  const demandX = chicksRow.muBase * w;
  node.appendChild(
    line(demandX, -10, demandX, axisY, { stroke: '#c0392b', 'stroke-width': 2, opacity: 0.55 })
  );

  // Build one curve per row.
  const curves = rows.map((r, i) => {
    const rowY = i * rowH + 20;
    const baseline = rowY + curveH;

    const area = path('', { fill: r.fill, opacity: 0.42 });
    const stroke = path('', { fill: 'none', stroke: r.stroke, 'stroke-width': 3 });
    node.appendChild(area);
    node.appendChild(stroke);

    node.appendChild(
      text(r.label, { x: -20, y: rowY + curveH * 0.6, 'text-anchor': 'end', 'font-size': 22, 'font-family': 'var(--font-sans)', 'font-weight': 500, fill: 'var(--ink)' })
    );

    // A short dashed tick at each curve's own peak, so the drift between them is
    // legible as a set of separating verticals.
    const peakTick = line(0, rowY - 4, 0, baseline, { stroke: r.stroke, 'stroke-width': 2, 'stroke-dasharray': '5 6', opacity: 0.8 });
    node.appendChild(peakTick);

    return { ...r, area, stroke, peakTick, rowY, baseline };
  });

  const insect = curves.find((c) => c.key === 'insects');

  // 'peak' caption over the insect curve - the food peak the reader tracks.
  const peakLabel = text('peak', { x: 0, y: insect.rowY - 12, 'text-anchor': 'middle', 'font-size': 17, 'font-family': 'var(--font-sans)', 'font-weight': 600, fill: insect.stroke });
  node.appendChild(peakLabel);

  // A dot riding the insect curve at the chicks' fixed demand: how much food is
  // actually in the sky when the mouths open. It falls as the peak slides away,
  // but it never reaches zero - and that is the point of the frame.
  const hatchDot = circle(demandX, 0, 8, { fill: '#c0392b', stroke: 'var(--paper)', 'stroke-width': 2.5 });
  node.appendChild(hatchDot);

  // Sits to the RIGHT of the demand line and above the insect tail - the wedge
  // that is always clear once the peak has moved off.
  const gapLabel = text('the peak has already passed', {
    x: demandX + 16, y: insect.rowY + 26, 'text-anchor': 'start', 'font-size': 19,
    'font-family': 'var(--font-sans)', 'font-weight': 600, fill: '#c0392b', opacity: 0,
  });
  node.appendChild(gapLabel);

  function drawCurve(c, mu) {
    const N = 60;
    let top = '';
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const px = t * w;
      const py = c.rowY + curveH * (1 - abundance(t, mu));
      top += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)} `;
    }
    c.stroke.setAttribute('d', top);
    c.area.setAttribute('d', `${top} L${w},${c.baseline} L0,${c.baseline} Z`);
    const peakX = mu * w;
    gsap.set(c.peakTick, { attr: { x1: peakX, x2: peakX } });
  }

  /**
   * shift 0..1 slides the FOOD peaks (plants, insects) earlier while the birds'
   * peaks hold - opening the mismatch. Each curve advances by its own muShift.
   */
  function setShift(sVal) {
    const s = Math.min(1, Math.max(0, sVal));
    curves.forEach((c) => drawCurve(c, c.muBase - s * c.muShift));

    const insectMu = insect.muBase - s * insect.muShift;
    gsap.set(peakLabel, { attr: { x: insectMu * w } });

    // The dot rides the insect curve at the fixed demand date.
    const atDemand = abundance(chicksRow.muBase, insectMu);
    gsap.set(hatchDot, { attr: { cy: insect.rowY + curveH * (1 - atDemand) } });

    // The caption only earns its place once the peak is clearly behind the
    // demand line - not the instant the curve twitches.
    gsap.set(gapLabel, { opacity: chicksRow.muBase - insectMu > 0.08 ? 1 : 0 });
  }

  setShift(0);

  // No `term` here on purpose: in Scene 10 the words "Phenological Mismatch" are
  // the button that opens the explainer, so the frame owns them as a DOM node
  // (components/panel.js). An SVG copy would either duplicate the words or leak
  // past the ?nolabels Memory Test, which hides DOM overlays but not SVG text.
  return { node, setShift, curves };
}
