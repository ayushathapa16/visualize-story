// Scene 12 - Three Springs. Beat: STRESS→LOSS. "Could she have done better?"
//
// The reader's pick from Scene 11 plays out:
//   early → a cold snap catches the brood
//   mid   → a warm spring, and the chicks do well
//   late  → the insect peak has already gone by
//
// One of the three is genuinely good, and that matters: if every road led to
// disaster the scene would be rigged, and the reader would feel it. The point
// isn't that she always loses. It's that she cannot know which spring she's in.
//
// THIS SCENE IS NOW EVIDENCE, and it is the one that most needed to be. The
// cold-snap branch below is not a dramatic invention: it is the mechanism
// Winkler et al. 2013 and Shipley et al. 2020 measured, in this species, at a
// site 500 km from Toronto. A cold snap is a real defined thing - consecutive
// days whose maximum stays under 18.5 °C, the temperature at which flying
// insects peak - and its cost is a real measured number.
//
// The subtlety the citation must preserve, because it is the actual finding:
// THE COLD SNAPS HAVE NOT GOT WORSE. Their seasonal pattern is unchanged over
// 125 years. What moved is the hatch date, into them. Do not let this frame
// drift into "the weather is getting worse" - it is saying something sharper.
import { rect } from '../engine/svg.js';
import { sourceNote } from '../components/chart.js';
import { FIGURES, citeFigure } from '../data/phenology.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { cloud, precip } from '../components/weather.js';
import { tree } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { getChoice } from '../state.js';
import { gsap } from '../engine/gsap.js';
import { drift } from '../engine/motion.js';
import { revealText, revealData } from '../engine/reveal.js';

export default {
  id: 's12-three-springs',
  title: 'Three Springs',
  act: 'IV',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, annotate, camera, audio } = ctx;

    const sky = ctx.backdrop('#dfe6dc');
    scene.appendChild(rect(-600, H - 130, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 260, y: H, s: 1.6, green: '#5a7a44' }).node);

    const clouds = [cloud({ x: 320, y: 150, s: 1.3 }), cloud({ x: 1240, y: 180, s: 1.1 })];
    clouds.forEach((c) => {
      scene.appendChild(c.node);
      drift(c.node, { x: 40, dur: 24 });
    });

    const bugs = swarm({ cx: 900, cy: 270, spread: 340, count: 50 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.7);

    const snow = precip({ w: W, h: H, count: 60, type: 'snow' });
    scene.appendChild(snow.node);

    const home = nest({ x: 800, y: 450, s: 0.9, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.62 });
    scene.appendChild(willow.node);
    willow.setMood('curious');
    gsap.set(willow.node, { x: 1080, y: 370 });

    camera.set({ fx: 800, fy: 400, scale: 1.15 });

    // The citation goes on OVERLAY, not on `scene`. Overlay is outside the
    // camera group (see engine/frame.js), and this frame runs a 1.15x push -
    // inside the camera the line would be scaled and shifted off the head of
    // the stage. Overlay coordinates are raw viewBox, so y=60/84 is the empty
    // band at the top at every aspect ratio, and x=340 clears the portrait crop
    // (which shows only x 330-1270).
    overlay.appendChild(
      sourceNote(
        `A cold snap: ${FIGURES.coldSnapDefinition.value} - the temperature ` +
          `at which flying insects peak`,
        { x: 380, y: 60 }
      )
    );
    overlay.appendChild(
      sourceNote(
        `One 1-2 day snap can cut chick survival by ${FIGURES.coldSnapCost.value}`,
        { x: 380, y: 84 }
      )
    );
    overlay.appendChild(sourceNote(citeFigure('coldSnapCost'), { x: 380, y: 108 }));

    const n1 = narrate({
      willow: '&ldquo;I can&rsquo;t predict what spring will do.&rdquo;',
      narrator:
        'Climate change has made spring less predictable. A decision that was once reliable has become a gamble.',
    });

    // The actual finding, and it is sharper than "the weather is getting worse".
    // Lands last, after the reader has watched their own choice play out.
    const evidence = annotate(
      `The cold snaps themselves have <strong>not</strong> changed &mdash; their seasonal pattern is
       <strong>${FIGURES.coldSnapsUnchanged.value}</strong>. What moved is the hatch date, into them.
       A nestling&rsquo;s chance of meeting one has gone from
       <strong>${FIGURES.coldSnapRisk.value}</strong> &mdash; once every ten years, to once every five.<br/>
       <em>Measured near Ithaca, New York, 1972&ndash;2015. Not a Toronto measurement.</em>`,
      { left: '3%', top: '62%' }
    );

    /** Warm spring: she timed it, and it worked. Healthy, feathered chicks. */
    function warmSpring() {
      const t = gsap.timeline();
      t.add(home.hatch({ stagger: 0.2 }), 0)
        .to({ p: 0.7 }, { p: 1, duration: 1.6, onUpdate() { bugs.setPopulation(this.targets()[0].p); } }, 0.4)
        .add(() => willow.setMood('happy'), 1.2)
        .add(() => home.setEnergy(1), 1.6)
        .to({ gr: 0 }, {
          gr: 1,
          duration: 2.4,
          onUpdate() { home.setGrowth(this.targets()[0].gr, { duration: 0 }); },
        }, 1.8);
      return t;
    }

    /** Cold snap: they hatch, and then the sky shuts. */
    function coldSnap() {
      const t = gsap.timeline();
      t.add(home.hatch({ stagger: 0.2 }), 0)
        .add(() => clouds.forEach((c) => c.darken(true)), 0.6)
        .to(sky, { attr: { fill: '#b9c2c0' }, duration: 1.6 }, 0.8)
        .add(() => snow.start(), 1.2)
        .to({ p: 0.7 }, {
          p: 0.05,
          duration: 2.2,
          ease: 'power2.in',
          onUpdate() { bugs.setPopulation(this.targets()[0].p); },
        }, 1.2)
        .add(() => willow.setMood('tired'), 1.8)
        .add(() => home.begAll(true), 2.4)
        .add(() => { home.setGrowth(0.25); home.setEnergy(0.3); }, 2.8)
        .add(() => audio.play('chicks', { volume: 0.4 }), 2.6);
      return t;
    }

    /** Late: no cold snap at all - the boom simply peaked without her. */
    function tooLate() {
      const t = gsap.timeline();
      // The sky is briefly magnificent, and she is still sitting on eggs.
      t.to({ p: 0.7 }, { p: 1, duration: 1, onUpdate() { bugs.setPopulation(this.targets()[0].p); } }, 0)
        .to({ p: 1 }, {
          p: 0.12,
          duration: 2.6,
          ease: 'power2.in',
          onUpdate() { bugs.setPopulation(this.targets()[0].p); },
        }, 1.2)
        .add(home.hatch({ stagger: 0.2 }), 3.0) // hatching into the tail of it
        .add(() => willow.setMood('tired'), 3.4)
        .add(() => home.begAll(true), 4.0)
        .add(() => { home.setGrowth(0.3); home.setEnergy(0.4); }, 4.2);
      return t;
    }

    const SPRINGS = { early: coldSnap, mid: warmSpring, late: tooLate };

    // The outcome must not start until the reader is actually LOOKING at this
    // frame. Subscribing to the choice would fire it the instant they pick, back
    // in Scene 11 - the whole spring would play out two frames away from them,
    // and they would arrive here to find it already over. So the choice is only
    // READ here, off this frame's own scrubbed timeline.
    //
    // Reading late is safe in both directions: they cannot reach Scene 12 without
    // passing Scene 11 (which auto-picks her usual date if they scroll straight
    // through), and if they skipped ahead entirely there is no choice on record,
    // so she does what she'd have done without us.
    let played = false;
    function play() {
      if (played) return;
      played = true;
      const t = (SPRINGS[getChoice()] || warmSpring)();
      t.add(revealText(n1.lines[0]), '>-0.4').add(revealText(n1.lines[1]), '>-0.2');
    }

    // The figure lands after the spring has finished playing out - the reader
    // watches the consequence, and only then is told it was measured.
    tl.to({}, { duration: 1 })
      .call(play)
      .add(revealData(evidence), 5.5)
      .to({}, { duration: 6 });

    ctx.scrollCue('When the food runs short');
  },
};
