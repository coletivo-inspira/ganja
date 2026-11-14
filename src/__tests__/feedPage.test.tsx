import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { CreatorContactFooter } from '../components/CreatorContactFooter';
import { FeedPage } from '../components/FeedPage';
import { FeedDisconnectedError, FeedError, STATIC_PROFILE, StaticFeedSource } from '../feed';
import type { FeedItem, FeedPage as FeedPageData, FeedSource } from '../feed';

function item(id: string, type: FeedItem['type'] = 'image', extra: Partial<FeedItem> = {}): FeedItem {
  return {
    id,
    type,
    imageUrl: `https://cdn.example/${id}.jpg`,
    caption: `Legenda ${id}`,
    permalink: `https://www.instagram.com/p/${id}/`,
    ...extra,
  };
}

function page(items: FeedItem[], nextCursor: string | null = null): FeedPageData {
  return { source: 'vitrine', profile: STATIC_PROFILE, items, nextCursor, syncedAt: '2026-11-14T10:00:00Z' };
}

/** Each call to getPage takes the next scripted response. */
function scriptedSource(responses: Array<FeedPageData | Error>): FeedSource & { calls: Array<string | null> } {
  const calls: Array<string | null> = [];
  return {
    kind: 'vitrine',
    calls,
    getPage(cursor) {
      calls.push(cursor ?? null);
      const next = responses.shift();
      if (!next) return new Promise(() => {});
      return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
    },
  };
}

describe('FeedPage — static archive', () => {
  it('labels the archive as static, links every tile to the original post and ends the list', () => {
    render(<FeedPage source={new StaticFeedSource()} manageUrl="https://painel.example/" />);
    expect(screen.getByTestId('feed-source-badge')).toHaveTextContent('ARQUIVO ESTÁTICO — NÃO SINCRONIZADO');
    expect(screen.getByTestId('feed-source-note')).toHaveTextContent(/não é o feed sincronizado/i);
    const tiles = within(screen.getByTestId('feed-grid')).getAllByRole('link');
    expect(tiles).toHaveLength(6);
    for (const tile of tiles) {
      expect(tile).toHaveAttribute('href', expect.stringMatching(/^https:\/\/www\.instagram\.com\//));
      expect(tile).toHaveAttribute('target', '_blank');
      expect(tile).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(tile.getAttribute('aria-label')).toMatch(/^Foto: .+publicação original no Instagram/);
    }
    expect(screen.getByTestId('feed-end')).toHaveTextContent('FIM DO ARQUIVO ESTÁTICO // 6');
    expect(screen.queryByTestId('feed-load-more')).not.toBeInTheDocument();
  });

  it('offers a manage link that explains it grants nothing by itself, plus a way back', () => {
    render(<FeedPage source={new StaticFeedSource()} manageUrl="https://painel.example/" />);
    const manage = screen.getByTestId('feed-manage-link');
    expect(manage).toHaveAttribute('href', 'https://painel.example/');
    expect(manage).toHaveAccessibleName(/gerenciar no vitrine/i);
    expect(manage).toHaveAccessibleDescription(/não concede acesso por si só/i);
    expect(screen.getByTestId('feed-back-link')).toHaveAttribute('href', '#/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });
});

describe('FeedPage — Vitrine states', () => {
  it('shows loading, then photo, carousel and video-cover tiles from Vitrine', async () => {
    let resolve!: (value: FeedPageData) => void;
    const source: FeedSource = {
      kind: 'vitrine',
      getPage: () => new Promise((r) => (resolve = r)),
    };
    render(<FeedPage source={source} />);
    expect(screen.getByTestId('feed-loading')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('feed-source-badge')).toHaveTextContent('CONSULTANDO O VITRINE');

    await act(async () =>
      resolve(page([item('a'), item('b', 'carousel', { childCount: 5 }), item('c', 'video')]))
    );

    expect(screen.getByTestId('feed-source-badge')).toHaveTextContent('SINCRONIZADO VIA VITRINE');
    expect(screen.getByTestId('feed-source-note')).toHaveTextContent('Última sincronização: 14/11/2026');
    const labels = screen.getAllByTestId('feed-tile-type').map((el) => el.textContent);
    expect(labels).toEqual(['FOTO', 'CARROSSEL · 5', 'VÍDEO · CAPA']);
    expect(screen.getByTestId('feed-tile-b').getAttribute('aria-label')).toMatch(/^Carrossel com 5 mídias/);
    expect(screen.getByTestId('feed-tile-c').getAttribute('aria-label')).toMatch(/^Capa de vídeo/);
    expect(screen.getByTestId('feed-tile-c').querySelector('video')).toBeNull();
    expect(screen.getByTestId('feed-announcer')).toHaveTextContent('3 publicações exibidas.');
  });

  it('paginates with the cursor, skips duplicates and focuses the first new tile', async () => {
    const source = scriptedSource([
      page([item('a'), item('b')], 'c2'),
      page([item('b'), item('c')], null),
    ]);
    const user = userEvent.setup();
    render(<FeedPage source={source} />);
    await screen.findByTestId('feed-tile-a');

    await user.click(screen.getByTestId('feed-load-more'));
    await waitFor(() => expect(screen.getByTestId('feed-tile-c')).toHaveFocus());
    expect(source.calls).toEqual([null, 'c2']);
    expect(within(screen.getByTestId('feed-grid')).getAllByRole('link')).toHaveLength(3);
    expect(screen.getByTestId('feed-end')).toHaveTextContent('FIM DO HISTÓRICO ACESSÍVEL // 3');
  });

  it('keeps loaded tiles and offers retry when a later page fails', async () => {
    const source = scriptedSource([page([item('a')], 'c2'), new FeedError('network', 'x'), page([item('b')])]);
    const user = userEvent.setup();
    render(<FeedPage source={source} />);
    await user.click(await screen.findByTestId('feed-load-more'));
    expect(await screen.findByTestId('feed-load-more-error')).toBeInTheDocument();
    expect(screen.getByTestId('feed-tile-a')).toBeInTheDocument();

    await user.click(screen.getByTestId('feed-load-more'));
    await screen.findByTestId('feed-tile-b');
    expect(screen.queryByTestId('feed-load-more-error')).not.toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    render(<FeedPage source={scriptedSource([page([])])} />);
    expect(await screen.findByTestId('feed-empty')).toHaveTextContent('Nenhuma publicação');
    expect(screen.queryByTestId('feed-grid')).not.toBeInTheDocument();
  });

  it('shows the error state and recovers on retry', async () => {
    const source = scriptedSource([new FeedError('http', 'down', 503), page([item('a')])]);
    const user = userEvent.setup();
    render(<FeedPage source={source} />);
    const alert = await screen.findByTestId('feed-error');
    expect(alert).toHaveAttribute('role', 'alert');
    expect(screen.getByTestId('feed-source-badge')).toHaveTextContent('VITRINE INDISPONÍVEL');
    await user.click(within(alert).getByRole('button', { name: 'TENTAR NOVAMENTE' }));
    expect(await screen.findByTestId('feed-tile-a')).toBeInTheDocument();
  });

  it('shows the disconnected state with the manage link and no tiles', async () => {
    render(
      <FeedPage source={scriptedSource([new FeedDisconnectedError()])} manageUrl="https://painel.example/" />
    );
    const box = await screen.findByTestId('feed-disconnected');
    expect(box).toHaveTextContent('Conta desconectada');
    expect(screen.getByTestId('feed-source-badge')).toHaveTextContent('CONTA DESCONECTADA');
    expect(screen.getByTestId('feed-source-badge')).not.toHaveTextContent(/SINCRONIZADO/);
    expect(within(box).getByTestId('feed-disconnected-manage-link')).toHaveAttribute(
      'href',
      'https://painel.example/'
    );
    expect(screen.queryByTestId('feed-grid')).not.toBeInTheDocument();
  });
});

describe('Footer strip through the feed adapter', () => {
  it('renders the static archive immediately, labeled as not synced, with a link to #/feed', () => {
    render(<CreatorContactFooter feedSource={new StaticFeedSource()} />);
    expect(screen.getByTestId('instagram-strip-source')).toHaveTextContent(
      'ARQUIVO ESTÁTICO — NÃO SINCRONIZADO COM O INSTAGRAM'
    );
    expect(screen.getByTestId('instagram-contact-strip').querySelectorAll('[data-testid^="ig-strip-item-"]')).toHaveLength(6);
    expect(screen.getByTestId('instagram-strip-feed-link')).toHaveAttribute('href', '#/feed');
  });

  it('shows up to six Vitrine items labeled as synced', async () => {
    const items = Array.from({ length: 8 }, (_, idx) => item(`v${idx}`, idx === 1 ? 'video' : 'image'));
    render(<CreatorContactFooter feedSource={scriptedSource([page(items, 'more')])} />);
    expect(screen.getAllByTestId('ig-strip-skeleton')).toHaveLength(6);
    await screen.findByTestId('ig-strip-item-v0');
    expect(screen.getByTestId('instagram-strip-source')).toHaveTextContent('FEED SINCRONIZADO VIA VITRINE');
    expect(screen.getByTestId('instagram-contact-strip').querySelectorAll('a')).toHaveLength(6);
    expect(screen.getByTestId('ig-strip-item-v1')).toHaveTextContent('VÍDEO · CAPA');
  });

  it('falls back to the static archive when Vitrine fails, and says so', async () => {
    render(<CreatorContactFooter feedSource={scriptedSource([new FeedError('network', 'x')])} />);
    await screen.findByTestId('ig-strip-item-ig-item-01');
    expect(screen.getByTestId('instagram-strip-source')).toHaveTextContent(
      'FEED INDISPONÍVEL — EXIBINDO ARQUIVO ESTÁTICO, NÃO SINCRONIZADO'
    );
  });
});

describe('Hash route', () => {
  it('switches between the site and #/feed on hashchange', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    window.location.hash = '#/feed';
    render(<App />);
    expect(screen.getByTestId('feed-page')).toBeInTheDocument();
    expect(screen.queryByTestId('sticky-header')).not.toBeInTheDocument();

    await act(async () => {
      window.location.hash = '#/';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.queryByTestId('feed-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-contato-06')).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
    window.location.hash = '';
  });
});
