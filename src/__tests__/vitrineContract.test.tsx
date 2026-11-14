import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeedPage } from '../components/FeedPage';
import { CreatorContactFooter } from '../components/CreatorContactFooter';
import { FeedDisconnectedError, FeedError, STATIC_PROFILE, VitrineFeedSource, slugFromEndpoint } from '../feed';
import {
  findForbiddenKeys,
  validateErrorBody,
  validateFeedPage,
} from '../../scripts/instagram-pilot/vitrine-contract.mjs';
import pageOne from '../../tests/fixtures/vitrine-feed-v1/active-page-1.json';
import pageTwo from '../../tests/fixtures/vitrine-feed-v1/active-page-2.json';
import empty from '../../tests/fixtures/vitrine-feed-v1/empty.json';
import stale from '../../tests/fixtures/vitrine-feed-v1/stale.json';
import otherStorefront from '../../tests/fixtures/vitrine-feed-v1/other-storefront.json';
import leaky from '../../tests/fixtures/vitrine-feed-v1/leaky.json';
import unavailable from '../../tests/fixtures/vitrine-feed-v1/unavailable-503.json';
import disconnected from '../../tests/fixtures/vitrine-feed-v1/disconnected-404.json';
import invalidCursor from '../../tests/fixtures/vitrine-feed-v1/invalid-cursor-400.json';

const ENDPOINT = 'https://vitrine.inspira.dev.br/data/vitrines/ganja/instagram-feed.json';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

/** Serves page 1 without a cursor and page 2 for page 1's nextCursor, like the documented route. */
function pagedVitrine(overrides: { first?: unknown; second?: unknown } = {}) {
  const fetchImpl = vi.fn(async (input: string) => {
    const cursor = new URL(input).searchParams.get('cursor');
    if (!cursor) return json(overrides.first ?? pageOne);
    if (cursor === pageOne.pageInfo.nextCursor) return json(overrides.second ?? pageTwo);
    return json(invalidCursor, 400);
  });
  const source = new VitrineFeedSource({ endpoint: ENDPOINT, fallbackProfile: STATIC_PROFILE, pageSize: 3, fetch: fetchImpl });
  return { source, fetchImpl };
}

function single(body: unknown, status = 200, endpoint = ENDPOINT) {
  return new VitrineFeedSource({ endpoint, fallbackProfile: STATIC_PROFILE, fetch: async () => json(body, status) });
}

describe('Vitrine contract fixtures (schemaVersion 1)', () => {
  it.each([
    ['active-page-1', pageOne],
    ['active-page-2', pageTwo],
    ['empty', empty],
    ['stale', stale],
  ])('%s meets the documented contract for the ganja storefront', (_name, body) => {
    expect(validateFeedPage(body, { expectedSlug: 'ganja' }).errors).toEqual([]);
  });

  it('flags a projection from another storefront', () => {
    expect(validateFeedPage(otherStorefront, { expectedSlug: 'ganja' }).errors).toEqual([
      'slug "loja2" não é a vitrine esperada "ganja"',
    ]);
  });

  it('flags private keys anywhere in the projection', () => {
    expect(findForbiddenKeys(leaky)).toEqual(['$.profile.accessToken', '$.items[0].owner_user_id']);
    expect(validateFeedPage(leaky).errors.filter((e) => e.startsWith('chave proibida'))).toHaveLength(2);
  });

  it('rejects unsafe URLs, missing video covers, misplaced children and broken pagination', () => {
    const broken = structuredClone(pageOne) as Record<string, any>;
    broken.items[1].mediaUrl = 'http://scontent.cdninstagram.com/x.jpg';
    broken.items[1].permalink = 'https://evil.example/p/X/';
    broken.items[2].thumbnailUrl = undefined;
    broken.items[1].children = [];
    broken.pageInfo = { limit: 3, hasNextPage: true, nextCursor: null };
    const { errors } = validateFeedPage(broken, { expectedSlug: 'ganja' });
    expect(errors).toEqual(
      expect.arrayContaining([
        'items[1].mediaUrl não é https público',
        'items[1].permalink não é publicação https do Instagram',
        'items[2]: VIDEO sem thumbnailUrl',
        'items[1]: children fora de CAROUSEL_ALBUM',
        'hasNextPage true sem nextCursor',
      ])
    );
  });

  it('accepts the documented error bodies for 400, 404 and 503 only', () => {
    expect(validateErrorBody(400, invalidCursor).errors).toEqual([]);
    expect(validateErrorBody(404, disconnected).errors).toEqual([]);
    expect(validateErrorBody(503, unavailable).errors).toEqual([]);
    expect(validateErrorBody(500, {}).errors).toEqual(['status HTTP 500 fora do contrato']);
    expect(validateErrorBody(404, { ...disconnected, rawApiError: 'x' }).errors).toContain('chave proibida no erro: $.rawApiError');
  });
});

describe('VitrineFeedSource reading the schemaVersion 1 contract', () => {
  it('derives the storefront slug from the documented route', () => {
    expect(slugFromEndpoint(ENDPOINT)).toBe('ganja');
    expect(slugFromEndpoint('https://vitrine.example/v1/sites/ganja/feed')).toBeUndefined();
  });

  it('maps carousel children, video covers, publishedAt, displayName and pageInfo.nextCursor', async () => {
    const page = await pagedVitrine().source.getPage();
    expect(page.items.map((item) => [item.type, item.childCount])).toEqual([
      ['carousel', 2],
      ['image', undefined],
      ['video', undefined],
    ]);
    expect(page.items[0].publishedAt).toBe('2026-11-11T19:42:10.000Z');
    expect(page.items[2].imageUrl).toBe(pageOne.items[2].thumbnailUrl);
    expect(page.items[2].permalink).toBe('https://www.instagram.com/reel/DCzQ1w2E3r4/');
    expect(page.profile).toMatchObject({ handle: '@ganjastudio.br', displayName: 'Ganja Studio' });
    expect(page.nextCursor).toBe(pageOne.pageInfo.nextCursor);
    expect(page.stale).toBe(false);
  });

  it('walks every page with the opaque cursor and stops at hasNextPage false, without duplicates', async () => {
    const { source, fetchImpl } = pagedVitrine();
    const first = await source.getPage();
    const second = await source.getPage(first.nextCursor);
    const ids = [...first.items, ...second.items].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(second.nextCursor).toBeNull();
    for (const [url, init] of fetchImpl.mock.calls as unknown as Array<[string, RequestInit]>) {
      expect(new URL(url).searchParams.get('limit')).toBe('3');
      expect(init.credentials).toBe('omit');
      expect(JSON.stringify(init.headers)).not.toMatch(/authorization|cookie|token/i);
    }
  });

  it('caps the page size at the documented 24', async () => {
    const fetchImpl = vi.fn(async () => json(empty));
    await new VitrineFeedSource({ endpoint: ENDPOINT, fallbackProfile: STATIC_PROFILE, pageSize: 100, fetch: fetchImpl }).getPage();
    expect(new URL((fetchImpl.mock.calls[0] as unknown as [string])[0]).searchParams.get('limit')).toBe('24');
  });

  it('reads empty and stale projections', async () => {
    expect((await single(empty).getPage()).items).toEqual([]);
    const stalePage = await single(stale).getPage();
    expect(stalePage.stale).toBe(true);
    expect(stalePage.syncedAt).toBe('2026-11-11T15:00:00.000Z');
    expect(stalePage.items).toHaveLength(2);
  });

  it('treats 404 FEED_NOT_FOUND as disconnected, but a bare 404 as an HTTP failure', async () => {
    await expect(single(disconnected, 404).getPage()).rejects.toBeInstanceOf(FeedDisconnectedError);
    await expect(single({}, 404).getPage()).rejects.toMatchObject({ reason: 'http', status: 404 });
  });

  it('surfaces FEED_UNAVAILABLE and INVALID_CURSOR codes as FeedError', async () => {
    await expect(single(unavailable, 503).getPage()).rejects.toMatchObject({ status: 503, code: 'FEED_UNAVAILABLE' });
    await expect(single(invalidCursor, 400).getPage('x')).rejects.toMatchObject({ status: 400, code: 'INVALID_CURSOR' });
  });

  it('refuses a projection that belongs to another storefront', async () => {
    const error = await single(otherStorefront).getPage().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(FeedError);
    expect(error).toMatchObject({ reason: 'invalid', code: 'SLUG_MISMATCH' });
  });

  it('only maps allowlisted fields, so private keys never reach the page model', async () => {
    const page = await single(leaky).getPage();
    expect(JSON.stringify(page)).not.toMatch(/FAKE-VALUE-NOT-A-TOKEN|fake-user|accessToken|owner_user_id/);
  });
});

describe('Feed page and footer strip with the schemaVersion 1 contract', () => {
  it('paginates through both fixture pages and ends at the accessible history', async () => {
    const user = userEvent.setup();
    render(<FeedPage source={pagedVitrine().source} manageUrl="https://painel.example/" />);
    expect(await screen.findByTestId('feed-source-badge')).toHaveTextContent('SINCRONIZADO VIA VITRINE');
    await waitFor(() => expect(within(screen.getByTestId('feed-grid')).getAllByRole('link')).toHaveLength(3));
    expect(screen.getAllByTestId('feed-tile-type').map((el) => el.textContent)).toEqual([
      'CARROSSEL · 2',
      'FOTO',
      'VÍDEO · CAPA',
    ]);
    await user.click(screen.getByTestId('feed-load-more'));
    await waitFor(() => expect(within(screen.getByTestId('feed-grid')).getAllByRole('link')).toHaveLength(5));
    expect(screen.getByTestId('feed-end')).toHaveTextContent('FIM DO HISTÓRICO ACESSÍVEL // 5');
  });

  it('skips a repeated post when a sync shifts items between pages', async () => {
    const shifted = { ...pageTwo, items: [pageOne.items[2], ...pageTwo.items] };
    const user = userEvent.setup();
    render(<FeedPage source={pagedVitrine({ second: shifted }).source} manageUrl="https://painel.example/" />);
    await waitFor(() => expect(screen.getByTestId('feed-load-more')).toBeEnabled());
    await user.click(screen.getByTestId('feed-load-more'));
    await waitFor(() => expect(screen.getByTestId('feed-end')).toHaveTextContent('// 5'));
  });

  it('labels a stale projection on the page and in the footer strip', async () => {
    render(<FeedPage source={single(stale)} manageUrl="https://painel.example/" />);
    expect(await screen.findByText('ÚLTIMA SINCRONIZAÇÃO VÁLIDA — DESATUALIZADO')).toBeInTheDocument();
    expect(screen.getByTestId('feed-source-note')).toHaveTextContent(/mantém a última versão válida/);
    expect(screen.getByTestId('feed-page')).toHaveAttribute('data-feed-stale', 'true');

    render(<CreatorContactFooter feedSource={single(stale)} />);
    expect(await screen.findByText('FEED DO VITRINE — ÚLTIMA SINCRONIZAÇÃO VÁLIDA, DESATUALIZADO')).toBeInTheDocument();
  });

  it('shows the disconnected guidance for 404 and the retryable error for 503', async () => {
    const { unmount } = render(<FeedPage source={single(disconnected, 404)} manageUrl="https://painel.example/" />);
    expect(await screen.findByTestId('feed-disconnected')).toBeInTheDocument();
    unmount();
    render(<FeedPage source={single(unavailable, 503)} manageUrl="https://painel.example/" />);
    expect(await screen.findByTestId('feed-error')).toBeInTheDocument();
    expect(screen.getByTestId('feed-retry')).toBeInTheDocument();
  });

  it('never renders another storefront: the footer falls back to the labeled archive', async () => {
    render(<CreatorContactFooter feedSource={single(otherStorefront)} />);
    expect(
      await screen.findByText('FEED INDISPONÍVEL — EXIBINDO ARQUIVO ESTÁTICO, NÃO SINCRONIZADO')
    ).toBeInTheDocument();
    expect(screen.queryByText(/loja2/)).not.toBeInTheDocument();
  });
});
