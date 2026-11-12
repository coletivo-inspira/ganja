import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';

export const LONG_PRESS_MS = 300;
export const TOUCH_SLOP_PX = 8;

interface PendingPress {
  timer: number;
  x: number;
  y: number;
}

/**
 * Lets touch users scroll past draggable elements: a touch only becomes a drag
 * after a still long-press, while mouse and pen drag immediately. The element
 * (or a common ancestor) must use `touch-action: pan-y` and receive `ref`.
 */
export function useTouchDragGate<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const armedRef = useRef(false);
  const pendingRef = useRef<PendingPress | null>(null);

  const cancelPending = useCallback(() => {
    if (pendingRef.current) {
      window.clearTimeout(pendingRef.current.timer);
      pendingRef.current = null;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // React registers touch listeners as passive, so scroll can only be blocked natively.
    const blockScrollWhileDragging = (event: TouchEvent) => {
      if (armedRef.current && event.cancelable) event.preventDefault();
    };
    el.addEventListener('touchmove', blockScrollWhileDragging, { passive: false });
    return () => {
      el.removeEventListener('touchmove', blockScrollWhileDragging);
      cancelPending();
    };
  }, [cancelPending]);

  /** Call from pointerdown. `start` runs now for mouse/pen, after the long-press for touch. */
  const begin = useCallback(
    (event: React.PointerEvent<HTMLElement>, start: () => void) => {
      cancelPending();
      if (event.pointerType !== 'touch') {
        armedRef.current = true;
        start();
        return;
      }
      const timer = window.setTimeout(() => {
        pendingRef.current = null;
        armedRef.current = true;
        start();
      }, LONG_PRESS_MS);
      pendingRef.current = { timer, x: event.clientX, y: event.clientY };
    },
    [cancelPending]
  );

  /** Call from pointermove. Returns whether the move should drag the element. */
  const shouldTrack = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const pending = pendingRef.current;
      if (
        pending &&
        Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > TOUCH_SLOP_PX
      ) {
        cancelPending();
      }
      return armedRef.current;
    },
    [cancelPending]
  );

  /** Call from pointerup / pointercancel. */
  const end = useCallback(() => {
    cancelPending();
    armedRef.current = false;
  }, [cancelPending]);

  return { ref, begin, shouldTrack, end };
}
