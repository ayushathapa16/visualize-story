// ============================================================================
// frame.js - mounts a frame spec into the DOM and hands it a rich context.
// Each frame is a tall <section> with a sticky stage <svg>; the extra height
// is the scroll distance its scrubbed timeline plays across.
// ============================================================================

import { el, defs, grainOverlay } from './svg.js';
import { createCamera } from './camera.js';
import { scrubTimeline } from './scroll.js';
import { audio } from './audio.js';
import { REDUCED } from './gsap.js';

export const VIEW = { W: 1600, H: 900 };

/**
 * @param {Object} spec  frame module default export
 * @param {number} index 0-based order
 * @returns {HTMLElement} the section element
 */
export function mountFrame(spec, index) {
  const section = document.createElement('section');
  section.className = 'frame' + (spec.tall === false ? '' : ' frame--tall');
  section.id = spec.id;
  section.dataset.act = spec.act || '';
  section.dataset.mood = spec.mood || '';
  section.setAttribute('aria-label', `${spec.title || spec.id}`);
  if (spec.height) section.style.minHeight = spec.height;

  const stage = document.createElement('div');
  stage.className = 'frame__stage';
  section.appendChild(stage);

  // Stage SVG with a camera group.
  // `meet` (fit-inside) rather than `slice` (cover): on a portrait phone, cover
  // would crop a 1600-unit-wide scene down to a ~400-unit sliver and cut the
  // charts in half. Fitting keeps every frame legible at any aspect ratio; the
  // resulting letterbox is filled because backdrops and ground planes overscan
  // well beyond the viewBox (SVG clips to the viewport, not the viewBox).
  const svg = el('svg', {
    class: 'frame__svg',
    viewBox: `0 0 ${VIEW.W} ${VIEW.H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-hidden': 'true',
  });
  svg.appendChild(defs());

  // Layer order: backdrop (never moves) < camera (the world) < overlay (grain).
  // Keeping the backdrop outside the camera means a push/pull can never drag
  // the sky off-screen and expose the page behind it.
  const bg = el('g', { class: 'backdrop' });
  const scene = el('g', { class: 'camera' });
  const overlay = el('g', { class: 'overlay' });
  svg.appendChild(bg);
  svg.appendChild(scene);
  svg.appendChild(overlay);
  stage.appendChild(svg);

  const camera = createCamera(scene, { width: VIEW.W, height: VIEW.H });

  /** Full-bleed background fill for the frame (sits behind the camera). */
  function backdrop(fill) {
    const r = el('rect', { x: -VIEW.W, y: -VIEW.H, width: VIEW.W * 3, height: VIEW.H * 3, fill });
    bg.appendChild(r);
    return r;
  }

  // --- narration overlay helper ---
  // Two shapes:
  //   narrate(['a', 'b'])                       - plain lines, one voice
  //   narrate({ willow: '...', narrator: '...' }) - the two-voice scene format
  // Both return `lines` in render order, so a frame can reveal them one by one
  // on the timeline without caring which shape it used.
  function narrate(content, position = 'lower', extraClass = '') {
    const box = document.createElement('div');
    box.className = `narration narration--${position} ${extraClass}`.trim();

    const add = (html, cls) => {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.innerHTML = html;
      box.appendChild(p);
    };

    if (content && !Array.isArray(content) && typeof content === 'object') {
      box.classList.add('narration--duet');
      // Willow speaks first: she reacts, then the narrator explains. Reversing
      // this would explain before showing, which direction.md forbids.
      if (content.willow) add(content.willow, 'narration__willow');
      if (content.narrator) add(content.narrator, 'narration__narrator');
    } else {
      for (const line of [].concat(content)) add(line);
    }

    stage.appendChild(box);
    return { box, lines: [...box.querySelectorAll('p')] };
  }

  // --- data annotation helper (positioned absolutely over the stage) ---
  function annotate(html, { left = '58%', top = '30%', cls = '' } = {}) {
    const n = document.createElement('div');
    n.className = `annotation ${cls}`.trim();
    n.style.position = 'absolute';
    n.style.left = left;
    n.style.top = top;
    n.style.zIndex = '5';
    n.innerHTML = html;
    stage.appendChild(n);
    return n;
  }

  // --- scroll cue ("every frame ends with a question") ---
  function scrollCue(label = '') {
    const c = document.createElement('div');
    c.className = 'scroll-cue';
    c.innerHTML = `<span>${label}</span><span class="scroll-cue__arrow"></span>`;
    stage.appendChild(c);
    return c;
  }

  // Grain sits above the world, outside the camera, so texture never scales.
  overlay.appendChild(grainOverlay(VIEW.W, VIEW.H));

  // The frame's master scrubbed timeline.
  const tl = scrubTimeline(section, { scrub: spec.scrub ?? 1 });

  const ctx = {
    index,
    section,
    stage,
    svg,
    scene,
    bg,
    overlay,
    backdrop,
    camera,
    tl,
    narrate,
    annotate,
    scrollCue,
    audio,
    reduced: REDUCED,
    W: VIEW.W,
    H: VIEW.H,
  };

  spec.build(ctx);
  return section;
}
