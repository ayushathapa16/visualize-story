// ============================================================================
// gsap.js - single place that registers GSAP + its (now free) plugins.
// Import { gsap, ScrollTrigger } from here everywhere else.
// ============================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, MorphSVGPlugin);

// Honour the OS "reduce motion" setting globally.
export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, MorphSVGPlugin };
