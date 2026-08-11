// Scene 29 - The Great Urban Shift. Beat: EVIDENCE. "It isn't only Toronto."
//
// The first of three data scenes, and the first chart in the piece that is
// actually made of published numbers rather than of shapes that teach a concept.
// Everything before this frame is illustrative on purpose; from here to Scene 31
// every mark is a value, and every value carries its citation on the stage.
//
// This recreates Fig 1 of Filazzola et al. 2024: one row per city, species lost
// to the left of a zero line and species gained to the right. The mirroring is
// the finding. A net bar would show Toronto as a comfortable gain and hide that
// the gain and the loss are happening at the same time, to different species.
//
// THE WORD MATTERS. The paper models climate-driven species TURNOVER - which
// species have a suitable climate in a city - not migration. Nothing in this
// frame says "migration", and nothing downstream of it should either.
//
// Two honesty constraints baked into the labels:
//   - AppendixTable2.csv carries 56 cities, not the 60 the paper models. The
//     caption says 56, because that is what is drawn.
//   - The middle scenario in this file is ssp245, which is what this table and
//     Fig 1's legend say. climateProjections.csv (Scene 30) says ssp370. We do
//     not reconcile them; each chart is keyed to its own source file.
import { divergingBars, sourceNote, legend, LOSS, GAIN } from '../components/chart.js';
import { TORONTO_BIRDS } from '../data/torontoBirds.js';
import { revealText, revealData } from '../engine/reveal.js';
import { gsap } from '../engine/gsap.js';

const CITE = 'Filazzola et al. 2024, PLOS ONE 19(3):e0299217, Fig 1 · CC BY 4.0';

export default {
  id: 's29-the-great-urban-shift',
  title: 'The Great Urban Shift',
  act: 'VI-B',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, annotate, camera } = ctx;

    ctx.backdrop('#efe6d0');

    const D = TORONTO_BIRDS;
    // SSP5-8.5 - the scenario Scene 27's +3 °C thermometer corresponds to, and
    // the one that makes the mirroring widest. Sorted the way Fig 1 sorts: most
    // net gain at the top, so Toronto's row has a position that means something.
    const SSP = 'ssp585';
    const rows = Object.entries(D.cities)
      .filter(([, c]) => c[SSP])
      .map(([name, c]) => ({ name, gains: c[SSP].gains, losses: c[SSP].losses }))
      .sort((a, b) => b.gains - b.losses - (a.gains - a.losses));

    const chart = divergingBars({ rows, w: 900, h: 420, highlight: 'Toronto' });
    // Placed with a static transform: nothing in this frame is ever transformed
    // by GSAP, so the attribute is safe (CLAUDE.md invariant 1).
    chart.node.setAttribute('transform', 'translate(350 215)');
    scene.appendChild(chart.node);

    scene.appendChild(
      legend(
        [
          { label: 'species lost', color: LOSS },
          { label: 'species gained', color: GAIN },
        ],
        { x: 350, y: 672 }
      )
    );

    // ABOVE the chart, not below it. The citation must stay on the stage - a
    // chart in this file without a visible source is a bug - but the bottom of
    // the stage belongs to the caption, which is pinned to `bottom: 9vh` and
    // therefore climbs into the viewBox as the window gets shorter. On a
    // 1440x620 window a line at the foot of the chart lands squarely on Willow's
    // voice. The head of the stage is empty at every aspect ratio.
    const cite = sourceNote(`${rows.length} of the 60 cities modelled · SSP5-8.5 · ${CITE}`, {
      x: 350,
      y: 132,
    });
    scene.appendChild(cite);

    // What SSP5-8.5 actually means for this city. Until this line, both this
    // frame and Scene 30 label their scenarios with nothing but the code - the
    // reader is asked to read a chart keyed to an abstraction. These are the
    // paper's own ClimateNA figures for Toronto's quadrat, and they are the only
    // place in the piece that a scenario is given a physical size.
    scene.appendChild(
      sourceNote(
        `Toronto mean annual temperature ${D.temperature.now} °C (1990-2020) → ` +
          `${D.temperature.ssp126}-${D.temperature.ssp585} °C by 2081-2100 · ClimateNA, same paper`,
        { x: 350, y: 156 }
      )
    );

    camera.set({ fx: 800, fy: 460, scale: 0.92 });

    const n1 = narrate({
      willow: '&ldquo;It isn&rsquo;t only my city.&rdquo;',
      narrator:
        'Researchers modelled 2,019 animal species across the largest cities in Canada and the United States. Every bar is one city: what it loses, and what arrives to replace it.',
    });

    // The number lands only after the bars have finished moving - the picture
    // makes the argument, the figure confirms it.
    const evidence = annotate(
      `In Toronto, <strong>${D.city.historicSpecies}</strong> species have a suitable climate today.
       By 2081&ndash;2100 the models predict <strong>${D.city.ssp126.gains}&ndash;${D.city.ssp585.gains}</strong>
       species gained and <strong>${D.city.ssp126.losses}&ndash;${D.city.ssp585.losses}</strong> lost,
       depending on emissions &mdash; the paper&rsquo;s own range across its scenarios.<br/>
       <em>This is species turnover: which animals can live here. It is not a count of birds.</em>`,
      { left: '3%', top: '64%' }
    );

    tl.fromTo(chart.node, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
      .add(revealText(n1.lines[0]), 0.4);

    // Under reduced motion the timeline is NOT scrubbed (engine/scroll.js drops
    // to scrub:false), so it sits at progress 0 - and a growth tween driven from
    // a proxy object would keep writing 0 back over any end state set here.
    // Don't add it at all: settle the bars and let the text still reveal.
    if (ctx.reduced) {
      chart.setProgress(1);
      gsap.set(chart.callout, { opacity: 1 });
    } else {
      // The bars sweep out of the zero line in both directions at once.
      tl.to(
        { p: 0 },
        {
          p: 1,
          duration: 3,
          ease: 'power2.out',
          onUpdate() {
            chart.setProgress(this.targets()[0].p);
          },
        },
        0.6
      )
        // Toronto is named last, once the reader has seen the field it sits in.
        .add(gsap.to(chart.callout, { opacity: 1, duration: 0.8 }), 3.8);
    }

    tl.add(revealText(n1.lines[1]), 1.6)
      .add(revealData(evidence), 4.4)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('And the birds?');
  },
};
