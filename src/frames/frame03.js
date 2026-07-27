// Scene 3 - Building a Home. Beat: CONNECTION. "Will it be enough?"
//
// She lands, and she works. Grass, feathers, twigs - ferried in one trip at a
// time, and the cup grows under the reader's own scroll (nest.buildTo).
//
// This is the nest the entire story then happens in: Scene 5 lays in it, Scene 7
// grows in it, Scene 15 goes quiet in it, Scene 22 fledges out of it. Watching it
// get made is what earns all of that.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree, grass, reeds } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's3-building',
  title: 'Building a Home',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#cfe0e6');
    scene.appendChild(rect(-600, H - 140, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 250, y: H, s: 1.7, green: '#4f7040' }).node);
    for (let i = 0; i < 7; i++) {
      scene.appendChild(grass({ x: rand(60, W - 60), y: H - 120 + rand(0, 40), s: rand(0.8, 1.5) }).node);
    }
    scene.appendChild(reeds({ x: 1420, y: H - 110, s: 1.4 }).node);

    // The nest starts as nothing but a branch.
    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4, built: false });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.6 });
    scene.appendChild(willow.node);
    willow.setMood('curious');
    gsap.set(willow.node, { x: 1500, y: 300 });

    camera.set({ fx: 800, fy: 460, scale: 1.3 });

    const n1 = narrate({
      willow: '&ldquo;This looks like a good place to raise my family.&rdquo;',
      narrator:
        'Tree Swallows depend on cavities and nest boxes to raise their young. Finding a safe home is the first challenge of every breeding season.',
    });

    // Four trips. Each one is: fly out, come back carrying, and the cup grows.
    // The build is scrubbed rather than played, so the nest is literally being
    // woven by the reader's scroll.
    const TRIPS = 4;
    for (let i = 0; i < TRIPS; i++) {
      const t = i * 1.5;
      const from = i % 2 === 0 ? -160 : W + 160;
      tl.add(() => willow.carry(true), t)
        .to(willow.node, { x: 810, y: 400, duration: 0.9, ease: 'sine.inOut' }, t)
        .add(() => willow.carry(false), t + 0.9)
        // material goes in
        .to(
          { b: i / TRIPS },
          {
            b: (i + 1) / TRIPS,
            duration: 0.5,
            ease: 'power1.out',
            onUpdate() {
              home.buildTo(this.targets()[0].b);
            },
          },
          t + 0.9
        )
        .to(willow.node, { x: from, y: 280, duration: 0.9, ease: 'sine.in' }, t + 1.0);
    }

    // She settles into the finished cup.
    tl.to(willow.node, { x: 800, y: 410, duration: 1, ease: 'sine.inOut' }, TRIPS * 1.5)
      .add(() => willow.setMood('hopeful'), TRIPS * 1.5 + 0.6)
      .to(camera.state, { scale: 1.5, fy: 440, duration: 1.6, onUpdate: () => camera.set({}) }, TRIPS * 1.5)
      .add(revealText(n1.lines[0]), TRIPS * 1.5 + 0.8)
      .add(revealText(n1.lines[1]), TRIPS * 1.5 + 1.8)
      .to({}, { duration: 1.2 });

    audio.bed('wind', { volume: 0.2 });

    ctx.scrollCue('And then, spring');
  },
};
