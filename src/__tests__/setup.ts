import '@testing-library/jest-dom';

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// jsdom's PointerEvent drops clientX/clientY. MouseEvent keeps them, which is
// what the drag handlers and Playwright's real pointer events both expose.
if (typeof window !== 'undefined' && typeof MouseEvent !== 'undefined') {
  class PointerEventWithCoords extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: MouseEventInit & { pointerId?: number } = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
    }
  }
  window.PointerEvent = PointerEventWithCoords as unknown as typeof PointerEvent;
}
