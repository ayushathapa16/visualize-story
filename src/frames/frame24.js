// Scene 24 - Empty Sky. Beat: LOSS. "How many meals can they miss?"
//
// This is Scene 11 played again with the abundance taken out. Same nest, same
// branch, same tree, same flight path, same golden light drained grey - and one
// insect in her beak instead of a full one.
//
// The repetition IS the argument. Nothing here needs explaining if Scene 11 landed.
//
// This frame carries the piece's only ONTARIO figure about this species: the 62%
// fall in insect biomass at Long Point, an hour down the lake. It is also the
// piece's only 🟡 SECONDARY figure - PNAS serves Probst et al. 2026 behind a 403
// and nobody here has read it, so the number comes from the authors' press
// release. docs/sources.md §F4 records that, and so does STUDIES.probst2026.
// If anyone gets access: read it, and correct this if it needs correcting.
//
// Note it does NOT agree with Shipley et al., whose Ithaca insect record shows
// no long-term trend at all. Different site, different window. We show the
// Ontario one on the Ontario story and label where it was measured; we do not
// reconcile them and we do not imply either is the general case.
import { rect } from '../engine/svg.js';
import { sourceNote } from '../components/chart.js';
import { FIGURES, citeFigure } from '../data/phenology.js';
// Aliased: two modules meet on this frame - Long Point (phenology) and the
// global meta-analysis (context) - and they must not be able to borrow each
// other's citation.
import { FIGURES as CONTEXT, citeFigure as citeContext } from '../data/context.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { tree, reeds } from '../components/flora.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's24-empty-sky',
  title: 'Empty Sky',
  act: 'V',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#c9d0cb'); // Scene 11's gold, gone out
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#6f855a' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#5a7a44' }).node);
    scene.appendChild(reeds({ x: 1400, y: H - 100, s: 1.5 }).node);

    const bugs = swarm({ cx: 880, cy: 250, spread: 420, count: 70 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.14); // a few. Not none - never none.

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.35, { duration: 0 }); // stalled - they should be further on
    home.setEnergy(0.7);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('tired');
    gsap.set(willow.node, { x: 800, y: 420 });

    camera.set({ fx: 800, fy: 440, scale: 1.25 });

    // Overlay, not `scene` - a 1.25x push would carry this off the top. And it
    // appears with the frame rather than being revealed: this is not a
    // punchline, it is the caption on a sky the reader is already looking at.
    overlay.appendChild(
      sourceNote(
        `Insect biomass fell ${FIGURES.ontarioInsectLoss.value}`,
        { x: 380, y: 60 }
      )
    );
    overlay.appendChild(sourceNote(citeFigure('ontarioInsectLoss'), { x: 380, y: 84 }));

    // The second pair is here to make the first pair SMALLER, and that is the
    // whole reason it was added.
    //
    // 62% at one observatory reads, standing alone, as the rate everywhere. It
    // is not: the largest meta-analysis of insect time series puts the average
    // terrestrial decline at about 9% per decade, and stresses that trends vary
    // widely even between neighbouring sites. Long Point is a place where it
    // went badly, which is the honest version of this frame and still a sky with
    // nothing in it.
    //
    // Two studies, two scopes, so each keeps its own citation line - the reader
    // has to be able to tell which number was measured where.
    overlay.appendChild(
      sourceNote(
        `Worldwide the average is smaller: terrestrial insects are down ` +
          `${CONTEXT.terrestrialInsectTrend.value}`,
        { x: 380, y: 120 }
      )
    );
    overlay.appendChild(sourceNote(citeContext('terrestrialInsectTrend'), { x: 380, y: 144 }));

    const n1 = narrate({
      willow: '&ldquo;I found one&hellip;&rdquo;',
      narrator:
        'The insect boom has already passed. Every trip that comes back empty makes the next day harder than the last.',
    });

    tl.add(() => home.begAll(true), 0.2)
      // Trip one: the long way out, and she finds nothing at all.
      .to(willow.node, { x: 1240, y: 210, duration: 1.6, ease: 'sine.inOut' }, 0.6)
      .add(stillness(1.2)) // hunting an empty sky
      .to(willow.node, { x: 800, y: 420, duration: 1.8, ease: 'sine.inOut' }, 3.4)
      .add(() => willow.carry(false), 3.4) // empty beak - the mirror of Scene 11
      .add(revealText(n1.lines[0]), 5.0)

      // Trip two: she finds exactly one.
      .to(willow.node, { x: 480, y: 240, duration: 1.6, ease: 'sine.inOut' }, 5.6)
      .add(() => willow.carry(true), 7.0)
      .to(willow.node, { x: 800, y: 420, duration: 1.8, ease: 'sine.inOut' }, 7.2)
      .add(() => {
        willow.carry(false);
        home.feed(0); // one chick eats. Three do not.
      }, 9.0)

      // The sky keeps thinning while she works.
      .to({ p: 0.14 }, {
        p: 0.05,
        duration: 6,
        onUpdate() { bugs.setPopulation(this.targets()[0].p); },
      }, 3)
      .to({ e: 0.7 }, {
        e: 0.4,
        duration: 2,
        onUpdate() { home.setEnergy(this.targets()[0].e); },
      }, 9.2)
      .add(revealText(n1.lines[1]), 9.6)
      .add(stillness(1.6));

    audio.stopBed('insects');
    audio.bed('wind', { volume: 0.3 });
    audio.play('chicks', { volume: 0.3 });

    ctx.scrollCue('');
  },
};
