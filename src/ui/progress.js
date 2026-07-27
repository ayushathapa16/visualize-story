// ============================================================================
// progress.js - slim HUD: scroll progress bar, current Act label, mute + skip.
// Accessible: real buttons, focusable, aria-labelled.
// ============================================================================

import { gsap, ScrollTrigger } from '../engine/gsap.js';
import { audio } from '../engine/audio.js';
import { scrollTo } from '../engine/scroll.js';
import { ACTS } from '../frames/registry.js';

export function initHUD(sections) {
  const bar = document.createElement('div');
  bar.className = 'hud__progress';
  bar.innerHTML = '<div class="hud__progress-bar"></div>';
  const barFill = bar.firstElementChild;

  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `
    <span class="hud__act" aria-live="polite">${ACTS.I}</span>
    <span class="hud__spacer"></span>
    <button class="hud__mute" aria-label="Toggle sound">🔇 Sound off</button>
    <button class="hud__skip" aria-label="Skip to the end of the story">Skip ↧</button>
  `;

  document.body.append(bar, hud);
  const actLabel = hud.querySelector('.hud__act');
  const muteBtn = hud.querySelector('.hud__mute');
  const skipBtn = hud.querySelector('.hud__skip');

  muteBtn.addEventListener('click', () => {
    const muted = audio.toggle();
    muteBtn.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
  });

  skipBtn.addEventListener('click', () => {
    const last = sections[sections.length - 1];
    scrollTo(last, { offset: -0 });
  });

  // Update progress + act label as you scroll.
  const doc = document.documentElement;
  const update = () => {
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    barFill.style.width = `${p * 100}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  // Per-section act label via ScrollTrigger.
  sections.forEach((sec) => {
    const act = sec.dataset.act;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive && ACTS[act]) actLabel.textContent = ACTS[act];
      },
    });
  });
}
