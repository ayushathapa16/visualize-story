// ============================================================================
// scroll.js - Lenis smooth scroll bridged to GSAP ScrollTrigger.
// Also exposes scrubTimeline(), the primary way frames animate on scroll.
// ============================================================================

import Lenis from 'lenis';
import { gsap, ScrollTrigger, REDUCED } from './gsap.js';

let lenis;

export function initScroll() {
  lenis = new Lenis({
    duration: 1.1,
    // Gentle, filmic easing so scrolling itself feels like a slow camera move.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !REDUCED,
    syncTouch: false,
  });

  // Drive ScrollTrigger from Lenis' scroll, and GSAP's ticker from RAF.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Lenis owns the scroll position, so a plain window.scrollTo() gets fought
  // and undone on the next frame. Expose it in dev so a frame can be seeked to
  // directly (`__lenis.scrollTo(y, { immediate: true })`) when checking a
  // scrubbed timeline in a browser.
  if (import.meta.env.DEV) window.__lenis = lenis;

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, ...opts });
}

/**
 * A timeline scrubbed by the scroll position over a frame section.
 * The section should be `.frame--tall` with a sticky stage inside; the extra
 * height becomes the scroll distance the timeline scrubs across.
 *
 * @param {HTMLElement} section
 * @param {Object} [opts]
 * @param {number} [opts.scrub=1]  seconds of smoothing on the scrub
 * @param {string} [opts.start='top top']
 * @param {string} [opts.end='bottom bottom']
 * @param {Function} [opts.onProgress]  (progress:0..1) => void
 */
export function scrubTimeline(section, opts = {}) {
  const { scrub = 1, start = 'top top', end = 'bottom bottom', onProgress } = opts;
  return gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start,
      end,
      scrub: REDUCED ? false : scrub,
      onUpdate: onProgress ? (self) => onProgress(self.progress) : undefined,
    },
  });
}

/** A one-shot timeline that plays when the section enters (not scrubbed). */
export function enterTimeline(section, opts = {}) {
  const { start = 'top 70%' } = opts;
  return gsap.timeline({
    scrollTrigger: { trigger: section, start, toggleActions: 'play none none reverse' },
  });
}
