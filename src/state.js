// ============================================================================
// state.js - the one thing the story remembers about the reader.
//
// Scene 21 asks when Willow should lay. Scene 22 plays out what happened. They
// are separate frames, mounted independently, so the answer has to live
// somewhere between them.
//
// Deliberately a plain value, NOT a subscription. Scene 22 reads it off its own
// scrubbed timeline, at the moment the reader is actually looking at Scene 22.
// An earlier version published the choice to a listener, and the outcome fired
// the instant the reader clicked - back in Scene 21, two frames away - so they
// arrived at "Three Springs" to find their spring already over.
//
// If a second piece of cross-frame state ever appears, that's the moment to
// think again about this file. Not before.
// ============================================================================

/** @type {'early'|'mid'|'late'|null} */
let layDate = null;

export function setChoice(id) {
  layDate = id;
}

/** null = the reader never got as far as choosing. Scene 22 handles that. */
export function getChoice() {
  return layDate;
}
