// Scene 20 - Toronto's Birds. Beat: NARROWING. "How many of us are left?"
//
// Scene 19 counted every animal. This frame keeps only Class == Aves and asks
// the question the whole story has been circling: how many kinds of bird can
// still live here?
//
// This is the frame where the piece stops being comfortable. For Toronto as a
// whole the paper predicts a net species GAIN. For birds specifically it is a
// net LOSS - 218 species have a suitable Toronto climate today, 154 under the
// low scenario and 141 under the high one. The column has to shrink for that to
// land, which is why the lost block drains away BEFORE the smaller gained block
// stacks back on. Play them together and the reader reads a swap. It is not a
// swap; the replacement doesn't cover the loss.
//
// THREE CAVEATS, all of them on the stage, none of them in a drawer:
//   1. These are climate-suitability values (0-1), not counts of birds.
//   2. The 0.5 presence cut is OURS. The paper's per-species MaxEnt threshold
//      isn't published, so no headline number may be derived from this chart -
//      Scene 19's 888 / 159 / 40 / 360 / 195 come from the paper's own table.
//   3. This chart's scenarios are ssp126/ssp370/ssp585, from
//      climateProjections.csv. Scene 19's middle scenario is ssp245, from
//      AppendixTable2.csv. The published data disagrees with itself and we do
//      not reconcile it - each chart says which file it came from.
import { stackedCount, sourceNote, legend, LOSS, GAIN } from '../components/chart.js';
import { TORONTO_BIRDS } from '../data/torontoBirds.js';
import { g, text } from '../engine/svg.js';
import { revealText, revealData } from '../engine/reveal.js';

const CITE =
  'Filazzola et al. 2024, PLOS ONE 19(3):e0299217 · climateProjections.csv · CC BY 4.0';

export default {
  id: 's20-torontos-birds',
  title: "Toronto's Birds",
  act: 'VI-B',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, annotate, camera } = ctx;

    ctx.backdrop('#e9e1c9');

    const D = TORONTO_BIRDS;
    // Both columns sit inside viewBox x 330-1270 - the only band a portrait
    // screen ever shows, because base.css scales the stage 1.7x there and crops
    // the margins. The right column started at x 900 and its callout labels ran
    // off the edge of a phone.
    const cols = [
      { ssp: 'ssp126', x: 380, title: 'SSP1-2.6', sub: 'if we cut emissions' },
      { ssp: 'ssp585', x: 830, title: 'SSP5-8.5', sub: 'if we do not' },
    ];

    // Two columns, one scale. Both are drawn against the same 218 and the same
    // pixel height, so their finished heights are directly comparable - this is
    // the reason the piece never uses two y-axes.
    const charts = cols.map((c) => {
      const r = D.richness[c.ssp];
      const chart = stackedCount({
        total: r.now,
        kept: r.now - r.lostByEnd,
        lost: r.lostByEnd,
        gained: r.gainedByEnd,
        w: 200,
        h: 360,
      });
      // Raised, and the columns shortened, so that the column, its two title
      // lines and the legend all clear the caption band on a 620px-tall window
      // - where the caption climbs to about viewBox y 700.
      const wrap = g({ transform: `translate(${c.x} 205)` });
      wrap.appendChild(chart.node);
      wrap.appendChild(
        text(c.title, {
          x: 100, y: 408, 'text-anchor': 'middle', 'font-family': 'var(--font-sans)',
          'font-size': 24, 'font-weight': 600, fill: 'var(--ink)', class: 'chart-ink',
        })
      );
      wrap.appendChild(
        text(c.sub, {
          x: 100, y: 436, 'text-anchor': 'middle', 'font-family': 'var(--font-sans)',
          'font-size': 19, fill: 'var(--ink-soft)', class: 'chart-ink',
        })
      );
      scene.appendChild(wrap);
      return { ...c, chart, end: r.now - r.lostByEnd + r.gainedByEnd };
    });

    scene.appendChild(
      legend(
        [
          { label: 'still suitable', color: 'var(--sage)' },
          { label: 'loses its climate', color: LOSS },
          { label: 'gains one', color: GAIN },
        ],
        { x: 380, y: 676, gap: 250 }
      )
    );

    // Above the chart - the foot of the stage belongs to the caption, which
    // climbs into the viewBox on a short window (see frame19 for the full note).
    // Two lines, not one: SVG text does not wrap, and one line of this runs off
    // the right edge of a 1600-unit viewBox.
    scene.appendChild(
      sourceNote(
        `${D.meta.birdsModelled} modelled Toronto bird species · 2081-2100 · presence at suitability ≥ ${D.meta.presenceCut} (our cut, not the paper's)`,
        { x: 380, y: 108 }
      )
    );
    scene.appendChild(sourceNote(CITE, { x: 380, y: 132 }));

    camera.set({ fx: 800, fy: 470, scale: 0.9 });

    const n1 = narrate({
      willow: '&ldquo;How many of us can still live here?&rdquo;',
      narrator:
        'Of the animals modelled for Toronto, 354 are birds. Today 218 of them find a climate here they can live in. New species arrive as the city warms - but for birds, fewer arrive than leave.',
    });

    const r126 = D.richness.ssp126;
    const r585 = D.richness.ssp585;
    const evidence = annotate(
      `<strong>${r126.now}</strong> bird species today &rarr; <strong>${r126.end}</strong> if we cut emissions,
       <strong>${r585.end}</strong> if we don&rsquo;t. Roughly
       <strong>${r585.lostByEnd}</strong> lose their climate and only about
       <strong>${r585.gainedByEnd}</strong> gain one.<br/>
       <em>Climate suitability, not bird counts &mdash; the models ignore dispersal, habitat and
       who else is already there.</em>`,
      { left: '3%', top: '62%' }
    );

    tl.add(revealText(n1.lines[0]), 0.2);

    // Reduced motion drops the scrub (engine/scroll.js), leaving the timeline at
    // progress 0 - where a proxy-driven growth tween would keep writing 0 over
    // any end state. So don't add it; settle both columns instead.
    if (ctx.reduced) {
      charts.forEach((c) => c.chart.setProgress(1));
    } else {
      tl.to(
        { p: 0 },
        {
          p: 1,
          duration: 3.4,
          ease: 'power1.inOut',
          onUpdate() {
            const p = this.targets()[0].p;
            charts.forEach((c) => c.chart.setProgress(p));
          },
        },
        0.8
      );
    }

    tl.add(revealText(n1.lines[1]), 1.8)
      // The two end-totals arrive last, side by side, once both columns have
      // finished moving - the comparison is the point, not either number alone.
      .add(revealData(evidence), 4.4)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('Which ones are already in trouble?');
  },
};
