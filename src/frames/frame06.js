// Scene 6 - And Then Me. Beat: HARMONY. "And after I land?"
//
// Third of five (see frame04.js). She puts herself into the order she is
// telling, and she puts herself third: the ground goes, then the air, then her.
//
// This is not Scene 1's arrival replayed. Scene 1 is her coming home and the
// camera meeting her; this is her placing herself in a sequence, so the shot
// stays wide and level and she is small in it. If this ever starts to feel like
// the opening, pull the camera further out - the run is a recital, not a return.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { nest } from '../components/nest.js';
import { tree, reeds } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { seasonStrip } from '../components/timelineBar.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's6-and-then-me',
  title: 'And Then Me',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#cfe0e6');

    // High horizon, flat foot - the caption owns the bottom. See frame04.js.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.3 }).node);

    // The air is already full. That is the point of the shot: she arrives into
    // a season that started without her.
    const bugs = swarm({ cx: 880, cy: 320, spread: 320, count: 55 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(1);

    // The nest she wove in Scene 3, waiting.
    const home = nest({ x: 800, y: 450, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('tired'); // she has just come a very long way
    gsap.set(willow.node, { x: W + 220, y: 250 });

    // The year as four curves, the same instrument Scene 20 later argues with.
    // On `overlay`, outside the camera group: this frame pushes in, and a strip
    // inside `scene` would scale and drift off the top of the stage.
    const strip = seasonStrip({
      x: 380,
      y: 96,
      w: 440,
      shown: 3,
      shift: 0,
      title: 'A normal year',
      note: 'She arrives after both of them',
    });
    overlay.appendChild(strip.node);
    strip.showRows(2);

    camera.set({ fx: 820, fy: 390, scale: 1 });

    const n1 = narrate({
      willow: '&ldquo;And then me. I get here when the air is already full. Never before it.&rdquo;',
      narrator:
        'Tree Swallows travel thousands of kilometres north each spring, and they arrive into a season that is already underway.',
    });

    // Long approach, then the landing settles her on the branch.
    tl.to(willow.node, { x: 880, y: 300, duration: 2.4, ease: 'sine.out' }, 0)
      .add(revealText(n1.lines[0]), 1.2)
      .to(willow.node, { x: 810, y: 385, duration: 1.1, ease: 'sine.inOut' }, 2.4)
      .add(() => willow.setMood('hopeful'), 3.2)
      .add(strip.revealRow(2), 3.2)
      .add(revealText(n1.lines[1]), 4)
      .to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.18 });

    ctx.scrollCue('Then the waiting');
  },
};
