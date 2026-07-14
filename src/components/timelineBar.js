// ============================================================================
// timelineBar.js - phenologyBars(): Scene 10, the mismatch.
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

/** Scene 10 - the mismatch. */
export function phenologyBars({ x = 360, y = 250, w = 880 } = {}) {
  const node = g({ class: 'pheno', transform: `translate(${x} ${y})` });
  // Tight rows: the chart shares the stage with a two-voice caption AND the
  // clickable term below it, and it is the tallest thing in the piece.
  const rowH = 78;
  const curveH = rowH * 0.78;

  // Four abundance curves. `muBase` is where each peak falls in a normal year -
  // they start clustered, food and mouths lined up. `muShift` is how far the
  // peak slides earlier once fully warmed: the food advances, the birds don't.
  const rows = [
    { key: 'plants', label: '🌱 Plants', fill: '#c77fa0', stroke: '#a85f83', muBase: 0.5, muShift: 0.22 },
    { key: 'insects', label: '🦟 Insects', fill: '#6e8b4e', stroke: '#4f7040', muBase: 0.54, muShift: 0.2 },
    { key: 'swallow', label: '🐦 Swallow', fill: '#3a6ea5', stroke: '#2c5580', muBase: 0.58, muShift: 0.02 },
    { key: 'chicks', label: '🐥 Chicks', fill: '#e0a93b', stroke: '#b6842a', muBase: 0.62, muShift: 0.0 },
  ];

  const abundance = (t, mu) => Math.exp(-((t - mu) ** 2) / (2 * SIGMA * SIGMA));

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
