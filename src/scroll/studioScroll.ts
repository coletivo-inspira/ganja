type ScrollListener = (scrollY: number) => void;

const listeners = new Set<ScrollListener>();

/** Map page scroll to the kinetic title's letter-spacing (0.08em → 0.5em). */
export function kineticLetterSpacingEm(scrollY: number): number {
  const safe = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  const ratio = Math.min(1, safe / 900);
  return Number((0.08 + ratio * 0.42).toFixed(3));
}

export function publishStudioScroll(scrollY: number): void {
  const next = Number.isFinite(scrollY) ? scrollY : 0;
  for (const listener of listeners) {
    listener(next);
  }
}

export function subscribeStudioScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
