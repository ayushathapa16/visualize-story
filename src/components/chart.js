// ============================================================================
// chart.js - the piece's only charting vocabulary (Scenes 13, 29, 30, 31).
//
// Some art in this project is illustrative: the Ontario range blobs, the Scene
// 10 abundance curves, the Scene 19 timeline bars. They teach a shape and are
// never labelled with a number. THIS FILE IS THE EXCEPTION. Every mark built
// here is a real value from a published source, which is why every chart built
// from this file carries a citation ON THE STAGE - see sourceNote().
//
// The rule used to be positional - "only Scenes 29 to 21" - and it no longer is.
// Scene 13 draws from this file too, and Scenes 11, 20, 22 and 24 use sourceNote()
// beside illustrative art to cite a claim the art is making. So the register is
// no longer signalled by WHERE you are in the story; it is signalled by whether
// a citation is on the stage. That puts more weight on this file, not less: a
// number rendered from here without a visible source is now the only thing
// standing between a reader and a figure they cannot check.
//
// Rules this file follows, and any new chart must too:
//
// - One measure, one axis. No dual scales, ever.
// - Colour carries the entity, never its rank. Losses are always --declines,
//   gains always --arrives, and they keep those hues in every chart.
//   Palette validated (light, surface #f4ecd8): diverging pair passes CVD
//   separation at dE 18.2 (protan); the status trio passes at dE 19.5. The
//   mustard sits below 3:1 against paper, which is discharged by the direct
//   label every bar carries.
// - Every bar is directly labelled. Nothing here depends on colour alone.
// - `xform()` owns rotation/scale; bars grow by animating a width/height
//   attribute, so no transform-origin can be got wrong.
//
// The Memory Test: all text in this file is tagged `chart-ink` or
// `chart-source`, both hidden by `body.nolabels` in base.css. Under ?nolabels
// these charts must still read as shapes - bars diverging, a column shrinking,
// a stack going grey.
// ============================================================================

import { g, rect, text, line } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';

const AXIS = '#8a8069';
const SANS = 'var(--font-sans)';

/** Losses and gains keep these two hues in every chart in the piece. */
export const LOSS = 'var(--declines)';
export const GAIN = 'var(--arrives)';

/** IUCN status ramp, in severity order. `Not assessed` is a neutral, not a hue. */
export const STATUS = {
  'Least Concern': 'var(--stays)',
  'Near Threatened': 'var(--uncertain)',
  Vulnerable: 'var(--declines)',
  'Not assessed': AXIS,
};

function label(str, attrs = {}) {
  return text(str, {
    'font-family': SANS,
    fill: 'var(--ink)',
    class: 'chart-ink',
    ...attrs,
  });
}

/**
 * The citation line. Every chart in this file renders one, on the stage, in the
 * frame - not tucked inside a drawer. A chart here without a visible source is
 * a bug, not a style choice.
 */
export function sourceNote(str, { x = 0, y = 0, anchor = 'start' } = {}) {
  return text(str, {
    x,
    y,
    'text-anchor': anchor,
    'font-family': SANS,
    'font-size': 15,
    fill: 'var(--ink-soft)',
    opacity: 0.85,
    class: 'chart-source',
  });
}

/**
 * A small legend. Present whenever a chart carries two or more series, so
 * identity is never colour alone (the bars are directly labelled as well).
 */
export function legend(items, { x = 0, y = 0, gap = 210 } = {}) {
  const node = g({ class: 'chart-legend' });
  items.forEach((it, i) => {
    const lx = x + i * gap;
    node.appendChild(rect(lx, y - 12, 16, 16, { fill: it.color, rx: 3 }));
    node.appendChild(label(it.label, { x: lx + 24, y, 'font-size': 18, fill: 'var(--ink-soft)' }));
  });
  return node;
}

/**
 * Scene 29 - the recreation of the paper's Fig 1.
 *
 * One row per city: species LOST to the left, species GAINED to the right, off a
 * shared zero line. That mirroring is the whole point of the figure - a city can
 * be busy in both directions at once, which is what "turnover" means and what a
 * single net bar would hide.
 *
 * @param {Object} o
 * @param {{name:string,losses:number,gains:number}[]} o.rows  pre-sorted
 * @param {string} [o.highlight] a city name to pull forward (Toronto)
 */
export function divergingBars({ rows, w = 900, h = 470, highlight = null }) {
  const node = g({ class: 'chart-diverging' });
  const mid = w / 2;
  const rowH = h / rows.length;
  const barH = Math.max(3, rowH - 2); // 2px surface gap between adjacent bars
  const max = Math.max(...rows.flatMap((r) => [r.losses, r.gains])) || 1;
  const scale = (v) => (v / max) * (mid - 70);

  // The zero line is the only axis. One measure, one scale, both directions.
  node.appendChild(line(mid, -16, mid, h + 8, { stroke: AXIS, 'stroke-width': 2 }));

  const bars = rows.map((r, i) => {
    const y = i * rowH;
    const on = r.name === highlight;
    const lost = rect(mid, y, 0, barH, { fill: LOSS, opacity: on ? 1 : 0.5, rx: 2 });
    const gained = rect(mid, y, 0, barH, { fill: GAIN, opacity: on ? 1 : 0.5, rx: 2 });
    node.appendChild(lost);
    node.appendChild(gained);
    return { ...r, y, lost, gained, on };
  });

  // Direction labels sit above the axis, so the mirroring is readable before a
  // single number appears.
  node.appendChild(
    label('← species lost', { x: mid - 20, y: -26, 'text-anchor': 'end', 'font-size': 19, fill: LOSS, 'font-weight': 600 })
  );
  node.appendChild(
    label('species gained →', { x: mid + 20, y: -26, 'text-anchor': 'start', 'font-size': 19, fill: GAIN, 'font-weight': 600 })
  );

  // The highlighted city is the only row that is ever named or numbered. 56 tiny
  // labelled rows would be a table, not a picture.
  const hit = bars.find((b) => b.on);
  const callout = g({ class: 'chart-callout', opacity: 0 });
  if (hit) {
    callout.appendChild(
      label(hit.name, { x: mid, y: hit.y - 10, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600 })
    );
    callout.appendChild(
      label(`${hit.losses} lost`, {
        x: mid - scale(hit.losses) - 12, y: hit.y + barH * 0.85,
        'text-anchor': 'end', 'font-size': 21, 'font-weight': 600, fill: LOSS,
      })
    );
    callout.appendChild(
      label(`${hit.gains} gained`, {
        x: mid + scale(hit.gains) + 12, y: hit.y + barH * 0.85,
        'text-anchor': 'start', 'font-size': 21, 'font-weight': 600, fill: GAIN,
      })
    );
    node.appendChild(callout);
  }

  /** 0..1 - bars grow out of the zero line, both directions at once. */
  function setProgress(p) {
    const t = Math.min(1, Math.max(0, p));
    bars.forEach((b) => {
      const lw = scale(b.losses) * t;
      const gw = scale(b.gains) * t;
      gsap.set(b.lost, { attr: { x: mid - lw, width: lw } });
      gsap.set(b.gained, { attr: { width: gw } });
    });
  }

  setProgress(0);
  return { node, setProgress, callout, bars };
}

/**
 * Scene 30 - one column of birds, splitting into what stays, what is lost and
 * what arrives.
 *
 * Deliberately a COLUMN and not a pair of bars: the reader has to see the same
 * 218 birds becoming 154, rather than two unrelated totals side by side. The
 * gained block stacks on top of what remains, so the shortfall is the visible
 * gap between the column's old height and its new one.
 */
export function stackedCount({ total, kept, lost, gained, w = 190, h = 430 }) {
  const node = g({ class: 'chart-stack' });
  const unit = h / total;

  const keptH = kept * unit;
  const lostH = lost * unit;
  const gainedH = gained * unit;

  // Ghost of today's column - the reference the new one is read against.
  const ghost = rect(0, 0, w, h, {
    fill: 'none', stroke: AXIS, 'stroke-width': 2, 'stroke-dasharray': '6 7', opacity: 0,
  });

  // Drawn from the baseline up. y/height animate; nothing here is transformed.
  const keptBar = rect(0, h - keptH, w, keptH, { fill: 'var(--sage)', rx: 3 });
  const lostBar = rect(0, h - keptH - lostH, w, lostH, { fill: LOSS, rx: 3 });
  const gainedBar = rect(0, h - keptH - gainedH, w, gainedH, { fill: GAIN, rx: 3, opacity: 0 });

  node.appendChild(ghost);
  node.appendChild(keptBar);
  node.appendChild(lostBar);
  node.appendChild(gainedBar);

  const nowLabel = label(String(total), {
    x: w / 2, y: -18, 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 600,
  });
  node.appendChild(nowLabel);

  const marks = {
    lost: label(`${lost} lose their climate`, {
      x: w + 20, y: h - keptH - lostH / 2, 'font-size': 20, 'font-weight': 600, fill: LOSS, opacity: 0,
    }),
    gained: label(`${gained} gain one`, {
      x: w + 20, y: h - keptH - gainedH / 2, 'font-size': 20, 'font-weight': 600, fill: GAIN, opacity: 0,
    }),
    end: label(`${kept + gained}`, {
      x: w / 2, y: h - keptH - gainedH - 18, 'text-anchor': 'middle',
      'font-size': 40, 'font-weight': 600, opacity: 0,
    }),
  };
  Object.values(marks).forEach((m) => node.appendChild(m));

  /**
   * 0..1. The lost block drains away first; only then does the smaller gained
   * block stack back on. Order matters - it is the argument. If they animated
   * together the reader would read a swap, and it is not a swap.
   */
  function setProgress(p) {
    const t = Math.min(1, Math.max(0, p));
    const drain = Math.min(1, t / 0.6);
    const fill = Math.max(0, (t - 0.6) / 0.4);

    const lh = lostH * (1 - drain);
    gsap.set(lostBar, { attr: { y: h - keptH - lh, height: lh } });

    const gh = gainedH * fill;
    gsap.set(gainedBar, { attr: { y: h - keptH - gh, height: gh }, opacity: fill > 0 ? 1 : 0 });

    gsap.set(ghost, { opacity: drain > 0.15 ? 0.7 : 0 });
    gsap.set(marks.lost, { opacity: drain > 0.35 ? 1 : 0 });
    gsap.set(marks.gained, { opacity: fill > 0.5 ? 1 : 0 });
    gsap.set(marks.end, { opacity: t > 0.92 ? 1 : 0, attr: { y: h - keptH - gainedH - 18 } });
  }

  setProgress(0);
  return { node, setProgress, marks };
}

/**
 * Scene 31 - flat categorical counts (Red List category, population trend,
 * IUCN systems). Horizontal bars, every one directly labelled with its count
 * and its name, so nothing depends on the colour.
 *
 * @param {{label:string,value:number,color:string}[]} items
 */
export function statusBars({ items, w = 620, rowH = 62, max = null, labelW = 230, fontSize = 21 }) {
  const node = g({ class: 'chart-status' });
  const top = max || Math.max(...items.map((i) => i.value));
  const barW = w - labelW;

  const bars = items.map((it, i) => {
    const y = i * rowH;
    node.appendChild(
      label(it.label, { x: labelW - 16, y: y + rowH * 0.62, 'text-anchor': 'end', 'font-size': fontSize, fill: 'var(--ink-soft)' })
    );
    const bar = rect(labelW, y + 8, 0, rowH - 18, { fill: it.color, rx: 3 });
    node.appendChild(bar);
    const value = label(String(it.value), {
      x: labelW + 12, y: y + rowH * 0.62, 'font-size': 22, 'font-weight': 600, opacity: 0,
    });
    node.appendChild(value);
    return { ...it, bar, value, y, width: (it.value / top) * barW };
  });

  /** 0..1 - bars sweep out, counts land behind them. */
  function setProgress(p) {
    const t = Math.min(1, Math.max(0, p));
    bars.forEach((b, i) => {
      // Staggered: each row starts a little after the one above it.
      const local = Math.min(1, Math.max(0, (t - i * 0.06) / 0.7));
      gsap.set(b.bar, { attr: { width: b.width * local } });
      gsap.set(b.value, {
        opacity: local > 0.6 ? 1 : 0,
        attr: { x: labelW + b.width * local + 12 },
      });
    });
  }

  setProgress(0);
  return { node, setProgress, bars };
}
