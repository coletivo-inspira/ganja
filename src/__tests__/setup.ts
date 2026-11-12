import '@testing-library/jest-dom';

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// jsdom's PointerEvent drops clientX/clientY. MouseEvent keeps them, which is
// what the drag handlers and Playwright's real pointer events both expose.
if (typeof window !== 'undefined' && typeof MouseEvent !== 'undefined') {
  class PointerEventWithCoords extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(
      type: string,
      params: MouseEventInit & { pointerId?: number; pointerType?: string } = {}
    ) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
      this.pointerType = params.pointerType ?? 'mouse';
    }
  }
  window.PointerEvent = PointerEventWithCoords as unknown as typeof PointerEvent;
}
