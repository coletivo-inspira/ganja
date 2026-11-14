import React, { useEffect, useRef, useState } from 'react';
import { getDefaultFeedSource, HOME_HASH, useFeed, vitrineManageUrl } from '../feed';
import type { FeedSource, FeedSourceKind, FeedStatus } from '../feed';
import { FeedTile, formatFeedDate } from './FeedTile';

const SKELETON_TILES = 6;

export interface FeedPageProps {
  source?: FeedSource;
  manageUrl?: string;
}

function sourceBadge(
  source: FeedSourceKind,
  status: FeedStatus,
  stale: boolean
): { label: string; className: string } {
  if (source === 'static') {
    return { label: 'ARQUIVO ESTÁTICO — NÃO SINCRONIZADO', className: 'bg-[#F5C400] text-[#111111]' };
  }
  if (status === 'loading') return { label: 'CONSULTANDO O VITRINE…', className: 'bg-[#FFFFFF] text-[#111111]' };
  if (status === 'error') return { label: 'VITRINE INDISPONÍVEL', className: 'bg-[#FFFFFF] text-[#111111]' };
  if (status === 'disconnected') return { label: 'CONTA DESCONECTADA', className: 'bg-[#111111] text-[#F5C400]' };
  if (stale) return { label: 'ÚLTIMA SINCRONIZAÇÃO VÁLIDA — DESATUALIZADO', className: 'bg-[#FFFFFF] text-[#111111]' };
  return { label: 'SINCRONIZADO VIA VITRINE', className: 'bg-[#008055] text-[#FFFFFF]' };
}

function ManageLink({ href, testId }: { href: string; testId: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={testId}
      aria-describedby="feed-manage-note"
      className="feed-action inline-flex items-center justify-between gap-3 px-4 py-3 bg-[#F5C400] text-[#111111] brutal-border brutal-shadow font-mono-tech text-xs font-bold"
    >
      <span>GERENCIAR NO VITRINE</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export const FeedPage: React.FC<FeedPageProps> = ({ source, manageUrl }) => {
  const feedSource = source ?? getDefaultFeedSource();
  const panelUrl = manageUrl ?? vitrineManageUrl();
  const { state, retry, loadMore } = useFeed(feedSource);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Feed Instagram — GANJA STUDIO';
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (state.status === 'ready') {
      setAnnouncement(`${state.items.length} publicações exibidas.`);
    } else if (state.status === 'empty') {
      setAnnouncement('Nenhuma publicação disponível.');
    }
  }, [state.status, state.items.length]);

  useEffect(() => {
    if (!focusId) return;
    const tiles = document.querySelectorAll<HTMLElement>('[data-feed-id]');
    Array.from(tiles)
      .find((tile) => tile.dataset.feedId === focusId)
      ?.focus();
    setFocusId(null);
  }, [focusId, state.items]);

  const handleLoadMore = async () => {
    const added = await loadMore();
    if (added.length > 0) setFocusId(added[0].id);
  };

  const isStatic = state.source === 'static';
  const handle = state.profile?.handle ?? '@ganjastudio.br';
  const syncedAt = formatFeedDate(state.syncedAt);
  const badge = sourceBadge(state.source, state.status, state.stale);

  return (
    <div
      data-testid="feed-page"
      data-feed-source={state.source}
      data-feed-status={state.status}
      data-feed-stale={state.stale ? 'true' : undefined}
      className="min-h-screen w-full bg-[#F4F3EF] text-[#111111]"
    >
      <header className="feed-topbar sticky top-0 z-[60] grid grid-cols-2 sm:grid-cols-[auto_1fr_auto] bg-[#F4F3EF] border-b border-[#111111]">
        <a
          href={HOME_HASH}
          data-testid="feed-back-link"
          className="feed-action flex items-center gap-2 px-3 sm:px-5 py-3 bg-[#0D0D0D] text-[#F4F3EF] border-r border-[#111111] font-mono-tech text-xs font-bold"
        >
          <span aria-hidden="true">←</span> VOLTAR AO SITE
        </a>
        <div className="flex items-center justify-end sm:justify-start px-3 sm:px-5 py-3 sm:border-r border-[#111111] font-mono-tech text-[11px] sm:text-xs font-bold min-w-0">
          <span className="truncate">FEED // {handle}</span>
        </div>
        <a
          href={panelUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="feed-manage-link"
          aria-describedby="feed-manage-note"
          className="feed-action col-span-2 sm:col-span-1 flex items-center justify-between gap-3 px-3 sm:px-5 py-3 bg-[#F5C400] text-[#111111] border-t sm:border-t-0 border-[#111111] font-mono-tech text-xs font-bold"
        >
          <span>GERENCIAR NO VITRINE</span>
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main className="px-4 sm:px-10 lg:px-12 py-8 sm:py-12">
        <section
          aria-labelledby="feed-heading"
          className="bg-[#FFFFFF] brutal-border brutal-shadow p-5 sm:p-8 mb-8 sm:mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#111111] font-mono-tech text-xs font-bold">
            <span className="px-2.5 py-1 bg-[#111111] text-[#F5C400]">FEED INSTAGRAM // {handle}</span>
            <span
              data-testid="feed-source-badge"
              className={`px-2.5 py-1 border border-[#111111] ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <h1
            id="feed-heading"
            ref={headingRef}
            tabIndex={-1}
            className="font-display-compressed text-6xl sm:text-8xl mb-5 outline-none [overflow-wrap:anywhere]"
          >
            Feed <span className="block text-3xl sm:text-5xl lg:text-6xl">{handle}</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono-tech text-xs leading-relaxed">
            <p data-testid="feed-source-note" className="lg:col-span-7">
              {isStatic
                ? 'Estas imagens são um arquivo fixo, curado à mão no código do site. Não é o feed sincronizado do Instagram: a sincronização depende da conexão autorizada pelo dono no Vitrine.'
                : `O feed vem da projeção pública do Vitrine, sincronizada periodicamente — não em tempo real.${
                    syncedAt ? ` Última sincronização: ${syncedAt}.` : ''
                  }${
                    state.stale
                      ? ' A sincronização mais recente falhou; o Vitrine mantém a última versão válida até o próximo ciclo.'
                      : ''
                  }`}
            </p>
            <p id="feed-manage-note" className="lg:col-span-5 lg:border-l border-[#111111] lg:pl-5">
              “Gerenciar no Vitrine” abre o painel. Login e autorização do dono são exigidos lá; o link
              não concede acesso por si só.
            </p>
          </div>

          {state.profile ? (
            <a
              href={state.profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="feed-profile-link"
              className="feed-action inline-flex mt-5 px-3 py-2 brutal-border font-mono-tech text-xs font-bold bg-[#F4F3EF]"
            >
              PERFIL {state.profile.handle} NO INSTAGRAM ↗
            </a>
          ) : null}
        </section>

        <p className="sr-only" role="status" aria-live="polite" data-testid="feed-announcer">
          {announcement}
        </p>

        {state.status === 'loading' ? (
          <div data-testid="feed-loading" aria-busy="true">
            <p className="font-mono-tech text-xs font-bold mb-4">CARREGANDO PUBLICAÇÕES…</p>
            <ul className="feed-grid" aria-hidden="true">
              {Array.from({ length: SKELETON_TILES }, (_, idx) => (
                <li key={idx} className="brutal-border brutal-shadow bg-[#FFFFFF]">
                  <div className="h-7 border-b border-[#111111]" />
                  <div className="aspect-[4/5] texture-halftone opacity-30" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {state.status === 'empty' ? (
          <div data-testid="feed-empty" className="bg-[#FFFFFF] brutal-border brutal-shadow p-6 sm:p-8">
            <p className="font-display-compressed text-3xl sm:text-4xl mb-3">Nenhuma publicação</p>
            <p className="font-mono-tech text-xs">
              A conta conectada ainda não tem publicações acessíveis pela API. Novas publicações aparecem
              após o próximo ciclo de sincronização do Vitrine.
            </p>
          </div>
        ) : null}

        {state.status === 'error' ? (
          <div
            data-testid="feed-error"
            role="alert"
            className="bg-[#FFFFFF] brutal-border brutal-shadow p-6 sm:p-8 border-l-8"
            style={{ borderLeftColor: '#BF2424' }}
          >
            <p className="font-display-compressed text-3xl sm:text-4xl mb-3">Feed indisponível</p>
            <p className="font-mono-tech text-xs mb-5">
              Não foi possível consultar o Vitrine agora. Tente novamente em instantes.
            </p>
            <button
              type="button"
              data-testid="feed-retry"
              onClick={retry}
              className="feed-action px-4 py-3 bg-[#111111] text-[#F4F3EF] brutal-border font-mono-tech text-xs font-bold"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        ) : null}

        {state.status === 'disconnected' ? (
          <div data-testid="feed-disconnected" role="alert" className="bg-[#FFFFFF] brutal-border brutal-shadow p-6 sm:p-8">
            <p className="font-display-compressed text-3xl sm:text-4xl mb-3">Conta desconectada</p>
            <p className="font-mono-tech text-xs mb-5">
              A conexão do Instagram com o Vitrine foi encerrada, expirou ou foi revogada. O dono da marca
              precisa reconectar a conta no painel; nenhuma publicação é exibida enquanto isso.
            </p>
            <ManageLink href={panelUrl} testId="feed-disconnected-manage-link" />
          </div>
        ) : null}

        {state.status === 'ready' ? (
          <>
            <ul data-testid="feed-grid" id="feed-grid" className="feed-grid" aria-label={`Publicações de ${handle}`}>
              {state.items.map((item) => (
                <FeedTile key={item.id} item={item} />
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3 font-mono-tech text-xs font-bold">
              {state.loadMoreFailed ? (
                <p data-testid="feed-load-more-error" role="alert" className="text-[#BF2424]">
                  FALHA AO CARREGAR MAIS PUBLICAÇÕES. TENTE NOVAMENTE.
                </p>
              ) : null}
              {state.nextCursor ? (
                <button
                  type="button"
                  data-testid="feed-load-more"
                  aria-controls="feed-grid"
                  aria-busy={state.loadingMore}
                  disabled={state.loadingMore}
                  onClick={handleLoadMore}
                  className="feed-action w-full sm:w-auto px-6 py-4 bg-[#111111] text-[#F4F3EF] brutal-border brutal-shadow"
                >
                  {state.loadingMore ? 'CARREGANDO…' : 'CARREGAR MAIS PUBLICAÇÕES'}
                </button>
              ) : (
                <p data-testid="feed-end" className="px-3 py-2 border border-[#111111]">
                  {isStatic ? 'FIM DO ARQUIVO ESTÁTICO' : 'FIM DO HISTÓRICO ACESSÍVEL'} // {state.items.length}{' '}
                  PUBLICAÇÕES
                </p>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};
