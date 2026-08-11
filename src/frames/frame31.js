// Scene 31 - Who Is Already in Trouble. Beat: THE FLOOR. "This started before the warming."
//
// The last of the three data scenes, and the one that changes what the other two
// mean. Scenes 29 and 30 are about a future climate. This frame is about the
// present: of the 354 modelled Toronto birds, 138 already have declining
// populations, 18 are Near Threatened and 6 are Vulnerable - today, before any
// of the projections arrive.
//
// ATTRIBUTION IS THE WHOLE POINT OF THIS FRAME. Every number here is the IUCN
// Red List's, not the paper's. The assessments ship alongside the paper's data;
// they are not one of its findings, and the label says so in as many words.
//
// The paper's own caveat travels with them, and it is on the stage rather than
// buried: at-risk species were NOT necessarily more vulnerable to climate change
// - they are already in decline from other stressors. That is a harder and more
// useful reading than "the endangered ones will go first".
//
// The habitat split is the honest answer to "where do these birds live?". The
// paper has no habitat classification at all - none, not for any of its 2,019
// species. IUCN's `systems` field is the only habitat evidence available, it is
// coarse (Terrestrial / Freshwater / Marine), and species hold more than one, so
// the three counts deliberately sum past 354. The label says that too.
import { statusBars, sourceNote, STATUS } from '../components/chart.js';
import { panelTrigger } from '../components/panel.js';
import { TORONTO_BIRDS } from '../data/torontoBirds.js';
import { g, text } from '../engine/svg.js';
import { revealText, revealData } from '../engine/reveal.js';

const IUCN_CITE = 'IUCN Red List of Threatened Species · bundled with Filazzola et al. 2024';

// THE PORTRAIT BAND. base.css scales the stage 1.7x on a portrait screen and
// crops the margins, so only viewBox x ~330-1270 is ever on screen there (the
// full height is). Three blocks of labelled bars have to live inside that
// ~940-unit column or a phone reader loses the labels off the left edge - which
// is exactly what the first version of this frame did. Vertical space is free;
// horizontal space is not.
const BAND = { x: 340, w: 460 };

/** A small titled block, so the three panels read as one system. */
function block(title, sub, chart, x, y) {
  const wrap = g({ transform: `translate(${x} ${y})` });
  wrap.appendChild(
    text(title, {
      x: 0, y: -34, 'font-family': 'var(--font-sans)', 'font-size': 23,
      'font-weight': 600, fill: 'var(--ink)', class: 'chart-ink',
    })
  );
  wrap.appendChild(
    text(sub, {
      x: 0, y: -10, 'font-family': 'var(--font-sans)', 'font-size': 17,
      fill: 'var(--ink-soft)', class: 'chart-ink',
    })
  );
  wrap.appendChild(chart.node);
  return wrap;
}

export default {
  id: 's31-already-in-trouble',
  title: 'Who Is Already in Trouble',
  act: 'VI-B',
  mood: 'day',
  build(ctx) {
    const { scene, stage, tl, narrate, annotate, camera } = ctx;

    ctx.backdrop('#e7e0ca');

    const D = TORONTO_BIRDS;
    const I = D.iucn;

    // Red List category, in severity order. `Not assessed` is a neutral, not a
    // fourth status - IUCN has simply never rated those 36 species.
    const catBars = statusBars({
      items: ['Vulnerable', 'Near Threatened', 'Least Concern', 'Not assessed']
        .filter((k) => I.categories[k])
        .map((k) => ({ label: k, value: I.categories[k], color: STATUS[k] })),
      w: BAND.w,
      rowH: 56,
      labelW: 178,
      fontSize: 18,
      max: D.meta.birdsModelled,
    });

    // Population trend. Declining (138) is the single largest group, but it does
    // not outweigh increasing plus stable (159) - which is exactly why this is
    // drawn as four bars on one scale rather than asserted in a sentence. The
    // shape is "the largest single group is falling", not "most birds are".
    const trendBars = statusBars({
      items: ['Decreasing', 'Increasing', 'Stable', 'Unknown']
        .filter((k) => I.trends[k])
        .map((k) => ({
          label: k,
          value: I.trends[k],
          color: k === 'Decreasing' ? 'var(--declines)'
            : k === 'Increasing' ? 'var(--stays)'
            : k === 'Stable' ? 'var(--slate-blue)' : '#8a8069',
        })),
      w: BAND.w,
      rowH: 56,
      labelW: 178,
      fontSize: 18,
      max: D.meta.birdsModelled,
    });

    // Habitat, such as it is. Coarse, IUCN's, and overlapping by design.
    const sysBars = statusBars({
      items: ['Terrestrial', 'Freshwater', 'Marine']
        .filter((k) => I.systems[k])
        .map((k) => ({ label: k, value: I.systems[k], color: 'var(--water)' })),
      w: BAND.w,
      rowH: 56,
      labelW: 178,
      fontSize: 18,
      max: D.meta.birdsModelled,
    });

    // Two status blocks side by side, habitat below - all inside BAND.
    scene.appendChild(
      block('Red List category', `all ${D.meta.birdsModelled} modelled Toronto birds`, catBars, BAND.x, 190)
    );
    scene.appendChild(
      block('Population trend', 'today, before any warming', trendBars, BAND.x + BAND.w + 30, 190)
    );
    scene.appendChild(
      block('Where they live', 'IUCN systems · a species can hold more than one', sysBars, BAND.x, 500)
    );

    // Above the blocks: the foot of the stage belongs to the caption, which
    // climbs into the viewBox on a short window (see frame29 for the full note).
    // Two lines because SVG text does not wrap and one line of this runs past
    // the right edge of the portrait band.
    scene.appendChild(sourceNote(IUCN_CITE, { x: BAND.x, y: 96 }));
    scene.appendChild(
      sourceNote("this is IUCN's assessment, not a finding of the paper", { x: BAND.x, y: 120 })
    );

    camera.set({ fx: 800, fy: 470, scale: 0.94 });

    const n1 = narrate({
      willow: '&ldquo;Some of us were already struggling.&rdquo;',
      narrator:
        'Before any of those futures arrive, the birds modelled for Toronto are assessed today. Most are of Least Concern - but 138 of them already have declining populations.',
    });

    const evidence = annotate(
      `<strong>${I.categories.Vulnerable}</strong> Vulnerable ·
       <strong>${I.categories['Near Threatened']}</strong> Near Threatened ·
       <strong>${I.trends.Decreasing}</strong> with declining populations.<br/>
       <em>The paper is careful here: at-risk species were not necessarily more vulnerable to
       climate change &mdash; they are already in decline from other pressures. Warming is
       arriving on top of that, not instead of it.</em>`,
      // The LEFT MARGIN, which is the only region empty at every aspect ratio in
      // this frame: the three bar blocks all start at viewBox x 340 (see BAND),
      // and that margin only widens as the window gets shorter. Anywhere inside
      // the chart area collides with either the trend bars or the drawer trigger
      // on one viewport or another - the right-hand placement this started with
      // collided with the trigger at 1440x620. On portrait base.css overrides
      // both values and pins it to the free strip above the scaled stage.
      { left: '1.5%', top: '34%' }
    );

    // The named list belongs in a drawer: 24 species with category, trend and
    // assessment year is a table, and a table on the stage would bury the three
    // shapes the frame is actually made of. The counts stay visible; only the
    // roll-call is one click away.
    panelTrigger({
      stage,
      // NO left/top here on purpose. Desktop and portrait need different spots -
      // the scaled portrait stage puts the same viewBox row 150px higher up the
      // viewport - and an inline position cannot be moved by a media query. The
      // two placements live in base.css, keyed on this frame's id.
      label: `The ${I.concern.length} already listed`,
      content: {
        title: `${I.concern.length} Toronto birds are already on the Red List`,
        body: [
          `Of the ${D.meta.birdsModelled} bird species modelled for Toronto by Filazzola et al. (2024), the IUCN Red List rates <strong>${I.categories.Vulnerable} as Vulnerable</strong> and <strong>${I.categories['Near Threatened']} as Near Threatened</strong>. ${I.categories['Not assessed']} have not been assessed.`,
          'These are assessments of the species today, worldwide - not projections, and not specific to Toronto. They come from the IUCN Red List data bundled with the paper, and they are IUCN&rsquo;s conclusions rather than the paper&rsquo;s.',
          I.concern
            .map(
              (c) =>
                `<strong>${c.name}</strong> <em>(${c.latin})</em> &mdash; ${c.category}, population ${c.trend.toLowerCase()}${c.year ? `, assessed ${c.year}` : ''}`
            )
            .join('<br/>'),
          'The paper notes that at-risk species were not necessarily the ones most vulnerable to climate change; many already have populations in decline from other stressors.',
        ],
        facts: [
          { label: 'Vulnerable', value: String(I.categories.Vulnerable) },
          { label: 'Near Threatened', value: String(I.categories['Near Threatened']) },
          { label: 'Least Concern', value: String(I.categories['Least Concern']) },
          { label: 'Not assessed', value: String(I.categories['Not assessed']) },
          { label: 'Populations decreasing', value: String(I.trends.Decreasing) },
        ],
        sources: [
          {
            title: 'The great urban shift: Climate change is predicted to drive mass species turnover in cities',
            authors: 'Filazzola A, Johnson MTJ, Barrett K, Hayes S, Shrestha N, Timms L, MacIvor JS',
            year: 2024,
            url: 'https://doi.org/10.1371/journal.pone.0299217',
          },
          {
            title: 'IUCN Red List of Threatened Species',
            authors: 'International Union for Conservation of Nature',
            url: 'https://www.iucnredlist.org',
          },
        ],
      },
    });

    tl.add(revealText(n1.lines[0]), 0.2);

    // Reduced motion drops the scrub (engine/scroll.js), leaving the timeline at
    // progress 0 - where a proxy-driven growth tween would keep writing 0 over
    // any end state. So don't add them; settle all three blocks instead.
    if (ctx.reduced) {
      catBars.setProgress(1);
      trendBars.setProgress(1);
      sysBars.setProgress(1);
    } else {
      tl.to(
        { p: 0 },
        {
          p: 1,
          duration: 2.6,
          ease: 'power2.out',
          onUpdate() {
            const p = this.targets()[0].p;
            catBars.setProgress(p);
            trendBars.setProgress(p);
          },
        },
        0.6
      )
        // The habitat block comes after the status blocks: it answers a different
        // question, and it is the weakest of the three claims.
        .to(
          { p: 0 },
          {
            p: 1,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              sysBars.setProgress(this.targets()[0].p);
            },
          },
          3.2
        );
    }

    tl.add(revealText(n1.lines[1]), 2.0)
      .add(revealData(evidence), 4.6)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('So what can any of us do?');
  },
};
