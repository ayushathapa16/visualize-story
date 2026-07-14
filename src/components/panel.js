// ============================================================================
// panel.js - a side drawer for the material that doesn't belong on the stage.
//
// The story shows; the panel explains. Scene 10 uses it for the phenological
// mismatch definition and its papers, Scene 17 for a species' outlook. Anything
// in here is opt-in by definition - if a viewer never opens it, the scene must
// still land. That is why nothing load-bearing goes inside.
//
// DOM over the stage, not SVG: `.narration` is pointer-events none, so anything
// clickable needs its own class and its own layer (same reasoning as choice.js).
// ============================================================================

const FOCUSABLE =
  'a[href], button:not(:disabled), input, [tabindex]:not([tabindex="-1"])';

/**
 * A single drawer shared by every opener on the page. Created lazily.
 * @returns {{ open(content), close(), node }}
 */
function createDrawer() {
  const root = document.createElement('div');
  root.className = 'panel';
  root.setAttribute('aria-hidden', 'true');

  const scrim = document.createElement('div');
  scrim.className = 'panel__scrim';
  root.appendChild(scrim);

  const dialog = document.createElement('div');
  dialog.className = 'panel__dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'panel-title');
  root.appendChild(dialog);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'panel__close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = '&times;';
  dialog.appendChild(close);

  const body = document.createElement('div');
  body.className = 'panel__body';
  dialog.appendChild(body);

  document.body.appendChild(root);

  let isOpen = false;
  let lastFocused = null;

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key !== 'Tab') return;
    // Focus trap. Without it, Tab walks straight out of the drawer and into the
    // scrolling story behind it, which is still there and still scrubbing.
    const items = [...dialog.querySelectorAll(FOCUSABLE)].filter(
      (n) => n.offsetParent !== null
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function show(content) {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    body.innerHTML = '';
    body.appendChild(content);
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    // The story is scroll-scrubbed: letting the page scroll behind an open
    // drawer would animate frames the viewer can't see and dump them somewhere
    // unrelated when they close it.
    document.body.classList.add('is-panel-open');
    document.addEventListener('keydown', onKey);
    close.focus();
  }

  function hide() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-panel-open');
    document.removeEventListener('keydown', onKey);
    if (lastFocused && lastFocused.isConnected) lastFocused.focus();
  }

  close.addEventListener('click', hide);
  scrim.addEventListener('click', hide);

  return { open: show, close: hide, node: root };
}

let drawer = null;
function getDrawer() {
  if (!drawer) drawer = createDrawer();
  return drawer;
}

/**
 * Build the panel's inner content from a plain spec.
 * @param {Object} o
 * @param {string} o.title
 * @param {string[]} [o.body]     paragraphs (HTML allowed)
 * @param {{label:string,value:string}[]} [o.facts]
 * @param {{title:string,authors?:string,year?:string|number,url?:string}[]} [o.sources]
 * @returns {HTMLElement}
 */
export function panelContent({ title, body = [], facts = [], sources = [] }) {
  const frag = document.createElement('div');

  const h = document.createElement('h2');
  h.id = 'panel-title';
  h.className = 'panel__title';
  h.textContent = title;
  frag.appendChild(h);

  for (const p of body) {
    const n = document.createElement('p');
    n.className = 'panel__p';
    n.innerHTML = p;
    frag.appendChild(n);
  }

  // Facts and sources are both allowed to be empty, and are simply omitted when
  // they are. Until the author supplies real figures, `src/data/sources.js`
  // hands us empty arrays - so the panel renders its prose and nothing else,
  // rather than shipping a visible placeholder.
  if (facts.length) {
    const dl = document.createElement('dl');
    dl.className = 'panel__facts';
    for (const f of facts) {
      const dt = document.createElement('dt');
      dt.textContent = f.label;
      const dd = document.createElement('dd');
      dd.textContent = f.value;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    frag.appendChild(dl);
  }

  if (sources.length) {
    const h3 = document.createElement('h3');
    h3.className = 'panel__subtitle';
    h3.textContent = 'Further reading';
    frag.appendChild(h3);

    const ul = document.createElement('ul');
    ul.className = 'panel__sources';
    for (const s of sources) {
      const li = document.createElement('li');
      const cite = [s.authors, s.year].filter(Boolean).join(', ');
      if (s.url) {
        const a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = s.title;
        li.appendChild(a);
      } else {
        li.appendChild(document.createTextNode(s.title));
      }
      if (cite) {
        const span = document.createElement('span');
        span.className = 'panel__cite';
        span.textContent = ` - ${cite}`;
        li.appendChild(span);
      }
      ul.appendChild(li);
    }
    frag.appendChild(ul);
  }

  return frag;
}

/** Open the drawer with a content spec (see panelContent). */
export function openPanel(spec) {
  getDrawer().open(panelContent(spec));
}

/**
 * A text button that opens the drawer - used for the inline "Phenological
 * Mismatch" term, so the word itself is the affordance.
 * @param {Object} o
 * @param {HTMLElement} o.stage
 * @param {string} o.label
 * @param {Object} o.content  panelContent spec
 * @param {string} [o.left]   position over the stage. OMIT to let the stylesheet
 * @param {string} [o.top]    place it - which is what you want for anything that
 *   has to dodge the caption on a short screen. Setting these writes an inline
 *   custom property, and an inline value beats a media query, so a trigger
 *   positioned from JS cannot be moved responsively.
 * @returns {HTMLElement}
 */
export function panelTrigger({ stage, label, content, left, top }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'panel-trigger';
  if (left) b.style.setProperty('--trigger-left', left);
  if (top) b.style.setProperty('--trigger-top', top);
  b.innerHTML = `<span>${label}</span>`;
  b.addEventListener('click', () => openPanel(content));
  stage.appendChild(b);
  return b;
}
