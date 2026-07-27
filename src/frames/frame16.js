// Scene 16 - Zooming Out. Beat: REFLECTION. "Who else is up there?"
//
// The camera leaves her nest and keeps going until it is over the province, and
// the one nest the reader has been living in turns out to be one of hundreds.
//
// The Ontario map's geometry is illustrative paper-cut, and the nest field
// scattered across it is illustrative too - it is a picture of "many", not a
// census. Nothing here is captioned with a number, and it must not be.
//
// THAT RULE IS UNCHANGED by the drawer added below. The drawer carries a
// DIFFERENT number - 888 species with a modelled range over the city, from the
// Filazzola paper - and it is behind a button, closed by default. Nothing sits
// next to the flock art. The distinction matters: "how many nests are in this
// picture" is unanswerable and always will be; "how many bird species have been
// recorded over Toronto" is published. Do not let the second migrate onto the
// stage as a caption for the first.
import { nest } from '../components/nest.js';
import { panelTrigger } from '../components/panel.js';
import { PAPER } from '../data/sources.js';
import { TORONTO_BIRDS } from '../data/torontoBirds.js';
import { flock } from '../components/flock.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText, revealTerm } from '../engine/reveal.js';

export default {
  id: 's16-zoom-out',
  title: 'Zooming Out',
  act: 'VI',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera, stage } = ctx;

    ctx.backdrop('#cfe0e6');

    // Her nest, where we left it.
    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.4, { duration: 0 });
    home.setEnergy(0.35);

    const willow = createWillow({ scale: 0.6 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 700, y: 420 });

    // Everyone else's.
    const others = flock({ cx: 800, cy: 420, spreadX: 620, spreadY: 300, count: 30 });
    scene.appendChild(others.node);

    camera.set({ shot: 'close', fx: 800, fy: 470, scale: 1.6 });

    const n1 = narrate({
      willow: '&ldquo;I&rsquo;m not the only one.&rdquo;',
      narrator:
        'Many bird species are facing the same squeeze as the climate warms - and they are not all facing it in the same way.',
    });

    // Optional depth, opt-in, and closed by default - the scene's primary read
    // (the camera pulling back until one nest is many) has to land without it.
    // Same panelContent shape Scenes 10, 17 and 21 use, so no new component and
    // no new CSS; `.panel-trigger` is already in base.css's body.nolabels list.
    const D = TORONTO_BIRDS;
    const trigger = panelTrigger({
      stage,
      // Short: the button is centred at the head of the stage and must not run
      // to the edges of a phone. Its position is set in base.css, not inline -
      // an inline value would beat any media query (see panel.js).
      label: 'How many birds?',
      content: {
        title: 'The birds of a city',
        body: [
          `Filazzola and colleagues modelled which animal species have a suitable <em>climate</em> in each of the largest cities in Canada and the United States. For Toronto - a 20&times;20&nbsp;km square - <strong>${D.city.historicSpecies}</strong> species have historically been recorded with a modelled range over the city, ${D.meta.birdsModelled} of them birds.`,
          'That is a count of <em>species</em>, not of birds, and it is a count of who has a climate they can live in - not of who is actually out there tonight. The nests in this picture are a drawing of &ldquo;many&rdquo;; they are not any of these numbers.',
          'Scenes 19 to 21 take this apart properly.',
        ],
        facts: [
          { label: 'Species with a modelled range over Toronto', value: String(D.city.historicSpecies) },
          { label: 'Of those, birds', value: String(D.meta.birdsModelled) },
          { label: 'Area modelled', value: 'One 20 × 20 km quadrat over the city' },
        ],
        sources: [PAPER],
      },
    });
    gsap.set(trigger, { opacity: 0 });

    tl
      // Up, and up. She becomes small, then a dot, then one of many.
      .to(
        camera.state,
        { fx: 800, fy: 440, scale: 0.8, duration: 6, ease: 'power2.inOut', onUpdate: () => camera.set({}) },
        0
      )
      .to([home.node, willow.node], { opacity: 0.35, duration: 2.5 }, 2.4)
      .add(others.showUpTo(8, 1.2), 2.6)
      .add(others.showUpTo(18, 1.4), 3.8)
      .add(others.showUpTo(30, 1.6), 4.8)
      .add(revealText(n1.lines[0]), 4.4)
      .add(revealText(n1.lines[1]), 5.6)
      // Offered only once all thirty nests are on screen and both lines have
      // landed - the picture makes the point, the drawer is for afterwards.
      .add(revealTerm(trigger), 6.6)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('Who are they?');
  },
};
