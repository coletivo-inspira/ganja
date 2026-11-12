import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lookTag, setLookTag] = useState<string | null>(null);

  useEffect(() => {
    const inspectTarget = (target: EventTarget | null) => {
      if (target && typeof (target as Element).closest === 'function') {
        const lookEl = (target as Element).closest('[data-cursor-look]');
        if (lookEl) {
          const attr = lookEl.getAttribute('data-cursor-look');
          setLookTag(attr || null);
          return;
        }
      }
      setLookTag(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setCoords({ x: event.clientX, y: event.clientY });
      inspectTarget(event.target);
    };

    const handleMouseOver = (event: MouseEvent) => {
      inspectTarget(event.target);
    };

    const handleMouseOut = (event: MouseEvent) => {
      inspectTarget(event.relatedTarget);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div
      data-testid="custom-cursor"
      data-x={coords.x}
      data-y={coords.y}
      data-expanded={lookTag ? 'true' : 'false'}
      aria-hidden="true"
      className="studio-custom-cursor fixed top-0 left-0 z-[9999] pointer-events-none select-none flex items-center"
      style={{
        transform: `translate3d(${coords.x}px, ${coords.y}px, 0)`,
        borderRadius: '0px',
        transitionDuration: '0ms',
      }}
    >
      <span
        data-testid="custom-cursor-crosshair"
        className="inline-flex items-center justify-center w-6 h-6 bg-[#0D0D0D] text-[#F4F3EF] font-mono-tech text-sm font-bold border border-[#111111]"
        style={{
          borderRadius: '0px',
          transitionDuration: '0ms',
        }}
      >
        +
      </span>

      <span
        data-testid="custom-cursor-label"
        data-active={lookTag ? 'true' : 'false'}
        className={`ml-1.5 px-2.5 py-1 bg-[#F5C400] text-[#111111] font-mono-tech text-xs font-bold uppercase whitespace-nowrap brutal-border brutal-shadow ${
          lookTag ? 'inline-block' : 'hidden'
        }`}
        style={{
          borderRadius: '0px',
          border: '1px solid #111111',
          boxShadow: '4px 4px 0px #111111',
          transitionDuration: '0ms',
        }}
      >
        {lookTag ?? ''}
      </span>
    </div>
  );
};
