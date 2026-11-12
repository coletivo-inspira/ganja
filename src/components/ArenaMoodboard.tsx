import React, { useRef, useState } from 'react';
import { MOODBOARD_ARTIFACTS } from '../data/moodboard';
import type { MoodboardArtifact } from '../types/ganja';

interface CardOffset {
  x: number;
  y: number;
  z: number;
}

export const ArenaMoodboard: React.FC = () => {
  const [offsets, setOffsets] = useState<Record<string, CardOffset>>(() => {
    const init: Record<string, CardOffset> = {};
    MOODBOARD_ARTIFACTS.forEach((item, idx) => {
      init[item.id] = { x: 0, y: 0, z: 10 + idx };
    });
    return init;
  });

  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    artifact: MoodboardArtifact
  ) => {
    const current = offsets[artifact.id] ?? { x: 0, y: 0, z: 10 };
    const maxZ = Math.max(...Object.values(offsets).map((o) => o.z), 10);
    setOffsets((prev) => ({
      ...prev,
      [artifact.id]: { ...current, z: maxZ + 1 },
    }));
    dragRef.current = {
      id: artifact.id,
      startX: event.clientX,
      startY: event.clientY,
      origX: current.x,
      origY: current.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { id, startX, startY, origX, origY } = dragRef.current;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    setOffsets((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: origX + dx,
        y: origY + dy,
      },
    }));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      data-testid="arena-moodboard"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="w-full bg-[#F4F3EF] texture-halftone border-t border-[#111111] p-6 sm:p-10"
      style={{ borderRadius: '0px' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#111111] bg-[#F4F3EF] p-4 brutal-border brutal-shadow">
        <div>
          <span className="font-mono-tech text-xs font-bold px-2 py-0.5 bg-[#008055] text-[#FFFFFF] inline-block mb-1">
            CAMADA 3 // PROCESSO & CONCEITO (ESTILO ARE.NA)
          </span>
          <h3 className="font-display-compressed text-2xl sm:text-3xl font-extrabold uppercase">
            MESA DE LUZ DIGITAL — GARIMPO, RECORTES URBANOS & ATELIÊ SP
          </h3>
        </div>
        <div className="font-mono-tech text-xs font-bold">
          [ARRASTE OS BLOCOS DE PESQUISA PELA MESA DE LUZ]
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOODBOARD_ARTIFACTS.map((artifact) => {
          const pos = offsets[artifact.id] ?? { x: 0, y: 0, z: 10 };
          return (
            <div
              key={artifact.id}
              data-testid={`moodboard-card-${artifact.id}`}
              data-linked-look={artifact.linkedLookCode}
              data-offset-x={pos.x}
              data-offset-y={pos.y}
              onPointerDown={(e) => handlePointerDown(e, artifact)}
              className="bg-[#FFFFFF] text-[#111111] brutal-border brutal-shadow p-4 cursor-grab active:cursor-grabbing select-none sheen-mylar-archive"
              style={{
                borderRadius: '0px',
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                zIndex: pos.z,
                touchAction: 'none',
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#111111] font-mono-tech text-[11px] font-bold">
                <span className="text-[#D92B2B]">{artifact.category}</span>
                <span className="px-1.5 py-0.5 bg-[#F5C400] text-[#111111]">
                  {artifact.linkedLookCode}
                </span>
              </div>
              <img
                src={artifact.imagePath}
                alt={artifact.title}
                className="w-full h-40 object-cover border border-[#111111] mb-3 pointer-events-none"
              />
              <h4 className="font-display-compressed text-base font-extrabold uppercase mb-1">
                {artifact.title}
              </h4>
              <p className="font-mono-tech text-xs leading-relaxed">{artifact.sourceNote}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
