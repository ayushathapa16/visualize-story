// ============================================================================
// main.js - boot the documentary.
// ============================================================================

import './styles/base.css';
import { ScrollTrigger } from './engine/gsap.js';
import { initScroll } from './engine/scroll.js';
import { mountFrame } from './engine/frame.js';
import { initHUD } from './ui/progress.js';
import { FRAMES } from './frames/registry.js';

function boot() {
  // Debug flag for the Memory Test: ?nolabels hides all text/narration.
  if (new URLSearchParams(location.search).has('nolabels')) {
    document.body.classList.add('nolabels');
  }

  initScroll();

  const story = document.getElementById('story');
  const sections = FRAMES.map((spec, i) => {
    const section = mountFrame(spec, i);
    story.appendChild(section);
    return section;
  });

  initHUD(sections);

  // Recalculate once fonts + layout settle.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

boot();
