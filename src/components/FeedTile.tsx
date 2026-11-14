import React from 'react';
import type { FeedItem } from '../feed';

export function feedTypeLabel(item: FeedItem): string {
  if (item.type === 'carousel') {
    return item.childCount ? `CARROSSEL · ${item.childCount}` : 'CARROSSEL';
  }
  if (item.type === 'video') return 'VÍDEO · CAPA';
  return 'FOTO';
}

function spokenType(item: FeedItem): string {
  if (item.type === 'carousel') {
    return item.childCount ? `Carrossel com ${item.childCount} mídias` : 'Carrossel';
  }
  if (item.type === 'video') return 'Capa de vídeo';
  return 'Foto';
}

export function formatFeedDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export interface FeedTileProps {
  item: FeedItem;
}

export const FeedTile = React.forwardRef<HTMLAnchorElement, FeedTileProps>(({ item }, ref) => {
  const date = formatFeedDate(item.publishedAt);
  const caption = item.caption || 'Publicação sem legenda';
  return (
    <li className="feed-tile-cell">
      <a
        ref={ref}
        href={item.permalink}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`feed-tile-${item.id}`}
        data-feed-id={item.id}
        data-media-type={item.type}
        aria-label={`${spokenType(item)}: ${caption}. Abre a publicação original no Instagram em nova aba.`}
        className="feed-tile flex flex-col h-full bg-[#FFFFFF] text-[#111111] brutal-border brutal-shadow"
      >
        <span className="flex flex-wrap items-center justify-between gap-1 px-2 py-1.5 border-b border-[#111111] font-mono-tech text-[10px] sm:text-[11px] font-bold">
          <span
            data-testid="feed-tile-type"
            className="feed-tile-type px-1.5 py-0.5 bg-[#111111] text-[#F4F3EF] whitespace-nowrap"
          >
            {feedTypeLabel(item)}
          </span>
          {date ? (
            <span className="whitespace-nowrap">{date}</span>
          ) : item.tag ? (
            <span className="truncate min-w-0">{item.tag}</span>
          ) : null}
        </span>
        <span className="relative block border-b border-[#111111] bg-[#F4F3EF]">
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="block w-full aspect-[4/5] object-cover"
          />
          {item.type === 'video' ? (
            <span
              aria-hidden="true"
              data-testid="feed-tile-video-mark"
              className="absolute left-2 bottom-2 px-2 py-1 bg-[#F5C400] text-[#111111] border border-[#111111] font-mono-tech text-[11px] font-bold"
            >
              ▶ CAPA
            </span>
          ) : null}
          {item.type === 'carousel' ? (
            <span
              aria-hidden="true"
              data-testid="feed-tile-carousel-mark"
              className="feed-carousel-stack absolute right-2 top-2 w-6 h-6 bg-[#FFFFFF] border border-[#111111]"
            />
          ) : null}
        </span>
        <span className="flex-1 px-2 py-2 font-mono-tech text-[11px] leading-snug line-clamp-3">{caption}</span>
        <span className="feed-tile-cta px-2 py-1.5 border-t border-[#111111] font-mono-tech text-[10px] font-bold">
          ABRIR NO INSTAGRAM ↗
        </span>
      </a>
    </li>
  );
});

FeedTile.displayName = 'FeedTile';
