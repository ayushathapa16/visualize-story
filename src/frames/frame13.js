// Scene 13 - Searching Further. Beat: LOSS. "How long can she keep this up?"
//
// Top-down. The search radius grows with every trip, and every trip takes longer
// than the one before. The rings are the frame: she is spending time she does
// not have.
import { circle, g } from '../engine/svg.js';
import { createWillow } from '../characters/willow.js';
import { swarm } from '../components/insects.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's13-searching',
  title: 'Searching Further',
  act: 'V',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera } = ctx;
    const cx = 800;
    const cy = 460;

    ctx.backdrop('#7f9a5c');

    // Top-down foliage texture.
    const foliage = g({ class: 'topdown' });
    for (let i = 0; i < 26; i++) {
      foliage.appendChild(circle(rand(0, W), rand(0, H), rand(10, 34), { fill: '#6e8b4e', opacity: 0.5 }));
    }
    scene.appendChild(foliage);

    // A thin scatter of insects, and they thin further as she goes out. The sky
    // is not empty - it just isn't enough, which is the finding.
    const bugs = swarm({ cx, cy: cy - 40, spread: 620, count: 30 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.3);

    const nestTop = g({ transform: `translate(${cx} ${cy})` }, [
      circle(0, 0, 40, { fill: '#5b4227' }),
      circle(0, 0, 24, { fill: '#3b2c1a' }),
    ]);

    const rings = [1, 2, 3].map(() =>
      circle(cx, cy, 60, {
        fill: 'none',
        stroke: '#c0392b',
        'stroke-width': 3,
        'stroke-dasharray': '6 10',
        opacity: 0,
      })
    );
    rings.forEach((r) => scene.appendChild(r));
    scene.appendChild(nestTop);

    const willow = createWillow({ scale: 0.5 });
    scene.appendChild(willow.node);
    willow.setMood('curious');
    gsap.set(willow.node, { x: cx, y: cy });

    // Already pulled back: the caption is revealed long before the camera eases
    // out at the end, so the resting framing has to clear the outer ring too.
    camera.set({ fx: cx, fy: cy, scale: 0.9 });

    const n1 = narrate({
      willow: '&ldquo;Where did all the insects go? How will I feed my children now?&rdquo;',
      narrator:
        'Cold weather keeps flying insects grounded. Even when insects are present, Tree Swallows often cannot catch enough of them to feed a brood.',
    });

    // The rings share the stage with a two-voice caption pinned near the bottom
    // of the viewport, and the outermost one printed straight through it. The
    // constraint is: outerRadius * cameraScale must stay under ~240 stage units
    // below centre, or the ring crosses the text. What matters here is that each
    // ring is visibly bigger than the last, not how big the last one is.
    const radii = [110, 185, 255];
    rings.forEach((r, i) => {
      tl.to(r, { attr: { r: radii[i] }, opacity: 0.8, duration: 1.4, ease: 'power1.out' }, i * 1.6);
    });

    // Three trips: each one farther, each one slower, each one more tired.
    const trips = [
      { r: 110, dur: 1.2, mood: 'curious' },
      { r: 185, dur: 1.6, mood: 'worried' },
      { r: 255, dur: 2.1, mood: 'tired' },
    ];
    trips.forEach((t, i) => {
      const ang = -Math.PI / 2 + i * 0.7;
      const tx = cx + Math.cos(ang) * t.r;
      const ty = cy + Math.sin(ang) * t.r;
      tl.add(() => willow.setMood(t.mood), i * 1.6)
        .to(willow.node, { x: tx, y: ty, duration: t.dur, ease: 'sine.inOut' }, i * 1.6 + 0.1)
        .to(willow.node, { x: cx, y: cy, duration: t.dur * 1.15, ease: 'sine.inOut' }, i * 1.6 + 0.1 + t.dur);
    });

    tl.to({ p: 0.3 }, {
      p: 0.12,
      duration: 4,
      onUpdate() { bugs.setPopulation(this.targets()[0].p); },
    }, 1)
      .add(revealText(n1.lines[0]), 2.0)
      .add(revealText(n1.lines[1]), 4.2)
      .to(camera.state, { scale: 0.85, duration: 2, onUpdate: () => camera.set({}) }, 4.4)
      .to({}, { duration: 1.2 });

    ctx.scrollCue('');
  },
};
