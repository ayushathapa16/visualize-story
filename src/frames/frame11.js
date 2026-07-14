// Scene 11 - A Difficult Decision. Beat: STRESS. "Was that the right call?"
//
// The reader picks Willow's laying date. There is no right answer, and the
// interaction is built so you can't hunt for one: no outcome preview on hover,
// no recommended option, and the consequence only arrives after you commit.
// That is the position the bird is in.
//
// The pick is remembered and Scene 12 plays it out.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { cloud } from '../components/weather.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { layDateCalendar } from '../components/calendar.js';
import { setChoice } from '../state.js';
import { gsap } from '../engine/gsap.js';
import { drift } from '../engine/motion.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's11-decision',
  title: 'A Difficult Decision',
  act: 'IV',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, stage } = ctx;

    ctx.backdrop('#dfe6dc');
    scene.appendChild(rect(-600, H - 130, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 260, y: H, s: 1.6, green: '#5a7a44' }).node);

    [cloud({ x: 320, y: 150, s: 1.2 }), cloud({ x: 1280, y: 190, s: 1 })].forEach((c) => {
      scene.appendChild(c.node);
      drift(c.node, { x: 40, dur: 24 });
    });

    // Some insects about - it is neither obviously too early nor obviously too
    // late. If the sky read as empty or as swarming, the choice would be easy.
    const bugs = swarm({ cx: 900, cy: 280, spread: 300, count: 40 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.55);

    // The nest is ready and empty. No setEnergy() here - the chicks rest at
    // scale 0 until hatch(), and setEnergy would pop them into a nest that is
    // supposed to be holding nothing yet (see nest.js).
    const home = nest({ x: 800, y: 430, s: 0.85, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.7 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 1120, y: 350 });

    // Framed high so the lower half of the stage is clear for the calendar,
    // which is a tall control.
    camera.set({ fx: 800, fy: 320, scale: 1.0 });

    const n1 = narrate({
      willow: '&ldquo;Should I start now&hellip; or wait?&rdquo;',
      narrator:
        'Every spring, Tree Swallows face a decision they cannot win outright. Laying too early and laying too late both carry a cost.',
    });

    const cal = layDateCalendar({
      stage,
      question: 'When should Willow lay her eggs?',
      options: [
        { id: 'early', day: '6', month: 'May', note: 'early' },
        { id: 'mid', day: '18', month: 'May', note: 'when she usually would' },
        { id: 'late', day: '29', month: 'May', note: 'late' },
      ],
      onPick(id) {
        setChoice(id);
        // A held beat, then her answer to it. The outcome belongs to Scene 12.
        const t = gsap.timeline();
        t.add(() => willow.setMood('tired'), 0.4)
          .add(revealText(n1.lines[0]), 0.6)
          .add(revealText(n1.lines[1]), 1.6);
      },
    });

    // If the reader scrolls straight past - or is running the ?nolabels Memory
    // Test, where the calendar is hidden - the story still has to resolve. Her
    // usual date is the honest default: it is what she'd do without us.
    tl.to({}, { duration: 4 })
      .call(() => cal.pick('mid'))
      .to({}, { duration: 3 });

    ctx.scrollCue('Now watch it play out');
  },
};
