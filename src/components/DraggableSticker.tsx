import React, { useRef, useState } from 'react';
import type { UrbanStickerItem } from '../types/ganja';
import { useTouchDragGate } from './useTouchDragGate';

export interface DraggableStickerProps {
  sticker: UrbanStickerItem;
  zIndex?: number;
  onBringToFront?: (id: string) => void;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  sticker,
  zIndex = 20,
  onBringToFront,
}) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [glossPos, setGlossPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  const gate = useTouchDragGate<HTMLDivElement>();

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onBringToFront?.(sticker.id);
    const target = event.currentTarget;
    const { pointerId, clientX, clientY } = event;
    gate.begin(event, () => {
      draggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        startX: clientX,
        startY: clientY,
        origX: offset.x,
        origY: offset.y,
      };
      if (typeof target.setPointerCapture === 'function') {
        try {
          target.setPointerCapture(pointerId);
        } catch {
          // Ignore in synthetic test environments
        }
      }
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const relX = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const relY = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      setGlossPos({ x: Math.round(relX), y: Math.round(relY) });
    }

    if (!gate.shouldTrack(event) || !draggingRef.current || !dragStartRef.current) return;
    const dx = event.clientX - dragStartRef.current.startX;
    const dy = event.clientY - dragStartRef.current.startY;
    setOffset({
      x: dragStartRef.current.origX + dx,
      y: dragStartRef.current.origY + dy,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    gate.end();
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    dragStartRef.current = null;
    if (typeof event.currentTarget.releasePointerCapture === 'function') {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore in synthetic test environments
      }
    }
  };

  return (
    <div
      ref={gate.ref}
      data-testid={`draggable-sticker-${sticker.id}`}
      data-sticker-code={sticker.code}
      data-linked-look={sticker.linkedLookCode}
      data-offset-x={offset.x}
      data-offset-y={offset.y}
      role="button"
      tabIndex={0}
      aria-label={`Sticker Urbano ${sticker.code} (${sticker.linkedLookCode})`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute select-none cursor-grab active:cursor-grabbing brutal-border brutal-shadow [--sticker-scale:0.75] md:[--sticker-scale:1]"
      style={{
        left: `${sticker.initialX}%`,
        top: `${sticker.initialY}%`,
        zIndex: isDragging ? 45 : zIndex,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${sticker.initialRotation}deg) scale(var(--sticker-scale, 1))`,
        backgroundColor: sticker.primaryColor,
        color: sticker.textColor,
        borderRadius: '0px',
        border: '2px solid #111111',
        boxShadow: isDragging ? '6px 6px 0px #111111' : '4px 4px 0px #111111',
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        transitionDuration: '0ms',
        maxWidth: 'min(78%, 240px)',
      }}
    >
      {/* Película Adesiva Vinílica (Sticker Gloss) — Zero Gaussian Backdrop Blur */}
      <div
        data-testid="sticker-gloss-layer"
        className="pointer-events-none absolute inset-0 sheen-vinyl-sticker"
        style={{
          borderRadius: '0px',
          backgroundPosition: `${glossPos.x}% ${glossPos.y}%`,
        }}
      />

      <div className="relative z-10 px-3 py-2">
        <div className="flex items-center justify-between gap-3 border-b border-current pb-1 mb-1 font-mono-tech text-[10px] font-bold">
          <span>{sticker.secondaryText}</span>
          <span>[{sticker.linkedLookCode}]</span>
        </div>
        <div className="font-display-compressed text-sm sm:text-base font-extrabold tracking-tight">
          {sticker.code}
        </div>
      </div>
    </div>
  );
};
