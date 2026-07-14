// ============================================================================
// audio.js - layered ambient beds + one-shots + silence as a cue.
// Files are OPTIONAL: drop mp3s in src/assets/audio/ and they'll be used;
// if missing, every call is a graceful no-op. Starts muted; unlocks on the
// first user gesture (autoplay policy).
// ============================================================================

// Vite: eagerly discover any provided audio files without failing when absent.
const files = import.meta.glob('../assets/audio/*.{mp3,ogg,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Map a logical name ("wind") to a resolved URL if the file exists.
function urlFor(name) {
  const key = Object.keys(files).find((k) => k.includes(`/${name}.`));
  return key ? files[key] : null;
}

class AudioManager {
  constructor() {
    this.muted = true;
    this.beds = new Map(); // name -> HTMLAudioElement (looping)
    this.unlocked = false;
    this._pending = new Set(); // beds requested before unlock
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (!this.muted) this._pending.forEach((n) => this.bed(n));
  }

  setMuted(m) {
    this.muted = m;
    this.beds.forEach((a) => (a.muted = m));
    if (!m && this.unlocked) this._pending.forEach((n) => this.bed(n));
  }

  toggle() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Start/keep a looping ambient bed (wind, insects, rain...) at a volume. */
  bed(name, { volume = 0.5, fade = 1.5 } = {}) {
    if (!this.unlocked || this.muted) {
      this._pending.add(name);
      return;
    }
    if (this.beds.has(name)) return;
    const url = urlFor(name);
    if (!url) return; // no file supplied - silent
    const a = new Audio(url);
    a.loop = true;
    a.volume = 0;
    a.muted = this.muted;
    a.play().catch(() => {});
    this.beds.set(name, a);
    this._ramp(a, volume, fade);
  }

  /** Fade a bed out and stop it (e.g. birds → silence in Frame 11). */
  stopBed(name, { fade = 1.5 } = {}) {
    const a = this.beds.get(name);
    if (!a) {
      this._pending.delete(name);
      return;
    }
    this._ramp(a, 0, fade, () => {
      a.pause();
      this.beds.delete(name);
    });
  }

  /** One-shot sound (a single swallow call). */
  play(name, { volume = 0.7 } = {}) {
    if (!this.unlocked || this.muted) return;
    const url = urlFor(name);
    if (!url) return;
    const a = new Audio(url);
    a.volume = volume;
    a.play().catch(() => {});
  }

  _ramp(a, to, dur, done) {
    const from = a.volume;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / (dur * 1000));
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else done && done();
    };
    requestAnimationFrame(step);
  }
}

export const audio = new AudioManager();

// Unlock on first interaction.
['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) =>
  window.addEventListener(ev, () => audio.unlock(), { once: true, passive: true })
);
