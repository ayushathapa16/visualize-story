// ============================================================================
// globe.js - Scene 2. Toronto becomes Canada becomes the hemisphere.
//
// A real globe, drawn in the piece's own paper-cut palette: flat fills, no
// photography, no texture maps - but the coastlines are Natural Earth 1:50m
// (data/coastlines.js) and the geometry is a true orthographic projection, so
// the shapes and the flight path are correct rather than traced by eye.
//
// Because the projection is real, three things follow for free:
//   - setSpin() is an actual rotation of the Earth about its axis (it sweeps the
//     centre longitude), not a texture sliding sideways behind a mask.
//   - land disappears round the limb because it is genuinely on the far side.
//   - the flyway stops are real coordinates, so the route she flies is the route.
//
// What this still is NOT is a claim: the globe carries no distances, no bearings
// and no scale bar, and the line between stops is a drawn flight, not a modelled
// track. It says "this journey is planetary", which is all Scene 2 needs it to.
// ============================================================================

import { g, path, circle, text } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { LAND, LAKES } from '../data/coastlines.js';

const OCEAN = '#8fb3c4';
const OCEAN_DEEP = '#6c93a6';
const LAND_FILL = '#6e8b4e';
const LAKE_FILL = '#7fa7ba';

/** Where the globe's face sits on the 1600x900 stage. Sized and lifted so the
 *  lower limb - and the "South America" label hanging off it - stay clear of the
 *  two-voice caption band. Scene 2's camera framing is tuned to match. */
const CX = 800;
const CY = 380;
const R = 250;

/** The camera's latitude. Tilted north so the Americas sit square to the viewer. */
const PHI0 = 18;

/** Centre longitude at rest (the Americas) and at the start of the spin (Africa). */
const LON_END = -72;
const LON_START = 24;

const RAD = Math.PI / 180;

/**
 * The Atlantic Flyway, south → north - the order she actually flies it.
 * Real coordinates, so the route lands on the right coastlines.
 * `ly` nudges a label off its dot: Toronto and Lake Ontario are all but the same
 * point at this scale, and their labels would otherwise print on top of each other.
 */
const STOPS = [
  { lon: -60.0, lat: -10.0, label: 'South America', side: 'right', ly: 6 },
  { lon: -84.0, lat: 10.5, label: 'Central America', side: 'right', ly: 6 },
  { lon: -93.0, lat: 38.0, label: 'United States', side: 'left', ly: 6 },
  { lon: -77.5, lat: 43.7, label: 'Lake Ontario', side: 'right', ly: 34 },
  { lon: -79.4, lat: 43.7, label: 'Toronto', side: 'left', ly: -14 },
];

/**
 * Orthographic projection. Returns the point on the face plus whether it is on
 * the near hemisphere - the far side must be culled, or it folds back over the
 * front as a mirror image.
 */
function project(lon, lat, lon0) {
  const p = lat * RAD;
  const l = (lon - lon0) * RAD;
  const p0 = PHI0 * RAD;
  const cosC = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return {
    x: CX + R * Math.cos(p) * Math.sin(l),
    y: CY - R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
    visible: cosC >= 0,
  };
}

/** Push a point that fell just over the horizon back onto the limb exactly. */
function toLimb(pt) {
  const dx = pt.x - CX;
  const dy = pt.y - CY;
  const d = Math.hypot(dx, dy) || 1;
  return { x: CX + (dx / d) * R, y: CY + (dy / d) * R };
}

/**
 * One ring -> SVG path data at a given centre longitude, culled to the near side.
 *
 * A ring straddling the terminator is cut into runs, and each run is closed along
 * the LIMB itself (an `A` arc) rather than with a straight chord: a continent
 * going round the edge of a sphere is bounded by the sphere's edge, and a chord
 * would slice a flat bite out of Asia every time it rotated away.
 */
function ringPath(ring, lon0) {
  let pts = ring.map(([lon, lat]) => project(lon, lat, lon0));
  const n = pts.length;
  if (pts.every((p) => !p.visible)) return '';

  // Wholly on the near side: an ordinary closed polygon, no limb involved.
  if (pts.every((p) => p.visible)) {
    return (
      pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join('') + 'Z'
    );
  }

  // Straddling the terminator. Rotate the ring to START on the far side, so every
  // run necessarily begins at a limb entry and ends at a limb exit. Without this,
  // a ring whose first point happens to be visible opens its run at an INTERIOR
  // point, and the closing arc then swings across the middle of the sphere -
  // which is what drew a straight diagonal gash through Asia.
  const start = pts.findIndex((p) => !p.visible);
  pts = pts.slice(start).concat(pts.slice(0, start));

  let d = '';
  let run = [];

  const flush = () => {
    if (run.length < 2) {
      run = [];
      return;
    }
    const first = run[0];
    const last = run[run.length - 1];
    d += `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
    for (let i = 1; i < run.length; i++) d += `L${run[i].x.toFixed(1)},${run[i].y.toFixed(1)}`;
    // Close along the horizon. large-arc=0 keeps it to the shorter way round,
    // which is right for any landmass that fits on one hemisphere - i.e. all of
    // them. The sweep follows the direction the run left the limb in.
    const a1 = Math.atan2(first.y - CY, first.x - CX);
    const a2 = Math.atan2(last.y - CY, last.x - CX);
    let delta = a1 - a2;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    const sweep = delta > 0 ? 1 : 0;
    d += `A${R},${R} 0 0 ${sweep} ${first.x.toFixed(1)},${first.y.toFixed(1)} Z`;
    run = [];
  };

  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const prev = pts[(i - 1 + n) % n];
    if (cur.visible) {
      if (!prev.visible) run.push(toLimb(cur)); // entering: start on the horizon
      run.push(cur);
    } else if (prev.visible) {
      run.push(toLimb(prev)); // leaving: end on the horizon, then close
      flush();
    }
  }
  flush();
  return d;
}

/**
 * @param {Object} [o]
 * @param {boolean} [o.labels] draw the stop labels (off for the Memory Test's sake)
 * @returns {{ node, setSpin(t), drawTo(p), flightPath, stops, centre }}
 */
export function globe({ labels = true } = {}) {
  const node = g({ class: 'globe' });

  // Everything on the sphere is clipped to it. The projection already culls the
  // far side, but a limb-closing arc can round a hair past the edge.
  const clipId = `globeClip-${Math.random().toString(36).slice(2, 8)}`;
  const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clip.setAttribute('id', clipId);
  clip.appendChild(circle(CX, CY, R));
  node.appendChild(clip);

  node.appendChild(circle(CX, CY, R, { fill: OCEAN }));

  const face = g({ 'clip-path': `url(#${clipId})` });
  node.appendChild(face);

  // Graticule - projected, so it curves the way a globe's does. It is what makes
  // the rotation legible over open ocean, where there is no coastline to watch.
  const grat = path('', { fill: 'none', stroke: '#ffffff', 'stroke-width': 1, opacity: 0.16 });
  face.appendChild(grat);

  const landPath = path('', { fill: LAND_FILL });
  const lakePath = path('', { fill: LAKE_FILL });
  face.appendChild(landPath);
  face.appendChild(lakePath);

  // Sphere shading: a terminator falling away to the lower right, plus a rim
  // light. The two cues that stop a filled circle reading as a flat disc.
  face.appendChild(circle(CX, CY, R, { fill: 'url(#globeShade)', 'pointer-events': 'none' }));
  node.appendChild(
    circle(CX, CY, R, { fill: 'none', stroke: OCEAN_DEEP, 'stroke-width': 3, opacity: 0.7 })
  );
  node.appendChild(
    circle(CX, CY, R + 10, { fill: 'none', stroke: '#cfe4ee', 'stroke-width': 12, opacity: 0.18 })
  );

  /** Redraw the sphere at a given centre longitude. */
  function renderAt(lon0) {
    landPath.setAttribute('d', LAND.map((r) => ringPath(r, lon0)).join(' '));
    lakePath.setAttribute('d', LAKES.map((r) => ringPath(r, lon0)).join(' '));

    let d = '';
    for (let lon = -180; lon < 180; lon += 30) {
      let pen = false;
      for (let lat = -80; lat <= 80; lat += 4) {
        const p = project(lon, lat, lon0);
        if (!p.visible) {
          pen = false;
          continue;
        }
        d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        pen = true;
      }
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      let pen = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = project(lon, lat, lon0);
        if (!p.visible) {
          pen = false;
          continue;
        }
        d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        pen = true;
      }
    }
    grat.setAttribute('d', d);
  }

  // --- the flyway ----------------------------------------------------------
  // Built at the RESTING longitude and never re-projected: by the time it draws,
  // the planet has stopped turning. Re-projecting it under the spin would mean
  // rebuilding the very path Willow is flying along, mid-flight.
  const pts = STOPS.map((s) => project(s.lon, s.lat, LON_END));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    // Bow each leg slightly, so the route arcs like a flight rather than a ruler.
    const mx = (prev.x + p.x) / 2 - 22;
    const my = (prev.y + p.y) / 2;
    return `${acc} Q${mx.toFixed(1)},${my.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }, '');

  const flightGlow = path(d, {
    fill: 'none',
    stroke: '#e0a93b',
    'stroke-width': 5,
    'stroke-linecap': 'round',
    filter: 'url(#softGlow)',
  });
  node.appendChild(flightGlow);
  gsap.set(flightGlow, { drawSVG: '0%' });

  const stops = [];
  STOPS.forEach((s, i) => {
    const p = pts[i];
    const dot = circle(p.x, p.y, 7, { fill: '#b5482e', stroke: '#f4ecd8', 'stroke-width': 2.5 });
    gsap.set(dot, { scale: 0, transformOrigin: '50% 50%' });
    node.appendChild(dot);

    let lab = null;
    if (labels) {
      const right = s.side === 'right';
      lab = text(s.label, {
        x: p.x + (right ? 18 : -18),
        y: p.y + (s.ly ?? 6),
        'text-anchor': right ? 'start' : 'end',
        'font-size': 21,
        'font-family': 'var(--font-sans)',
        'font-weight': 600,
        fill: 'var(--paper)',
        opacity: 0,
      });
      node.appendChild(lab);
    }
    stops.push({ dot, lab, t: i / (STOPS.length - 1), ...p });
  });

  /** 0 = Africa facing us, 1 = the Americas. A real rotation about the axis. */
  function setSpin(t) {
    const p = Math.min(1, Math.max(0, t));
    renderAt(LON_START + (LON_END - LON_START) * p);
  }
  setSpin(0);

  /** progress 0..1 draws the flyway and pops each stop as it is passed. */
  function drawTo(p) {
    gsap.set(flightGlow, { drawSVG: `${p * 100}%` });
    stops.forEach((l) => {
      // `p > 0` matters: the first stop sits at t=0, so without it the South
      // America pin is on screen from the start - hanging over Africa while the
      // planet is still turning, because the stops are projected at the RESTING
      // longitude. Nothing shows until the route actually starts drawing.
      const on = p > 0.001 && p >= l.t - 0.03;
      gsap.set(l.dot, { scale: on ? 1 : 0 });
      if (l.lab) gsap.set(l.lab, { opacity: on ? 1 : 0 });
    });
  }
  drawTo(0);

  return { node, setSpin, drawTo, flightPath: flightGlow, stops, centre: { x: CX, y: CY, r: R } };
}
