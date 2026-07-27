// ============================================================================
// calendar.js - Scene 11. The audience picks when Willow lays.
//
// The point of this interaction is that there is no right answer. Every option
// costs something, and the viewer has to commit before they're allowed to see
// what it costs - which is exactly the position the bird is in. So: no preview
// of the outcome on hover, and no "recommended" option.
//
// Same shape as choice.js (DOM over the stage, own class, idempotent pick), and
// the same reason: `.narration` is pointer-events none, so a click target needs
// its own layer.
//
// THE OPTIONS DO NOT CARRY DATES ANY MORE. They used to be `{day, month}` -
// May 6, May 18, May 29 - and those days were invented. Nothing in the sources
// gives a lay-date distribution for southern Ontario, so the fields are now the
// neutral `{label, sub}` and the frame fills them with relative timing. The
// rename is the point: with `day`/`month` sitting in the signature, the next
// person to touch this reaches for a date, and there isn't one to reach for.
// ============================================================================

/**
 * @param {Object} o
 * @param {HTMLElement} o.stage       ctx.stage
 * @param {string} o.question
 * @param {{id:string,label:string,sub?:string}[]} o.options
 * @param {(id:string)=>void} o.onPick called once, with the chosen id
 * @returns {{ node, pick(id), picked():string|null }}
 */
export function layDateCalendar({ stage, question, options, onPick }) {
  const node = document.createElement('div');
  node.className = 'calendar';

  const q = document.createElement('p');
  q.className = 'calendar__q';
  q.innerHTML = question;
  node.appendChild(q);

  const strip = document.createElement('div');
  strip.className = 'calendar__strip';
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', 'Choose a laying date');
  node.appendChild(strip);

  let chosen = null;
  const days = options.map((o) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'calendar__day';
    b.setAttribute('aria-label', [o.label, o.sub].filter(Boolean).join(', '));

    const d = document.createElement('span');
    d.textContent = o.label;
    const m = document.createElement('small');
    m.textContent = o.sub || '';
    b.appendChild(d);
    b.appendChild(m);

    b.addEventListener('click', () => pick(o.id));
    strip.appendChild(b);
    return { ...o, btn: b };
  });

  /** Idempotent - the first pick wins, whether clicked or auto-played. */
  function pick(id) {
    if (chosen) return;
    chosen = id;
    days.forEach((d) => {
      d.btn.disabled = true;
      d.btn.classList.toggle('is-chosen', d.id === id);
    });
    // Held for a beat, then the outcome caption takes over the same band.
    node.classList.add('is-done');
    onPick(id);
  }

  stage.appendChild(node);
  return { node, pick, picked: () => chosen };
}
