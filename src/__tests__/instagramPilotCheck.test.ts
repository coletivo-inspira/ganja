// @vitest-environment node
import { execFile } from 'node:child_process';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { renderReport, runPilotCheck } from '../../scripts/instagram-pilot/check-feed.mjs';
import type { FeedSnapshot, PilotCheck } from '../../scripts/instagram-pilot/check-feed.mjs';
import pageOne from '../../tests/fixtures/vitrine-feed-v1/active-page-1.json';
import pageTwo from '../../tests/fixtures/vitrine-feed-v1/active-page-2.json';
import otherStorefront from '../../tests/fixtures/vitrine-feed-v1/other-storefront.json';
import leaky from '../../tests/fixtures/vitrine-feed-v1/leaky.json';
import disconnected from '../../tests/fixtures/vitrine-feed-v1/disconnected-404.json';
import invalidCursor from '../../tests/fixtures/vitrine-feed-v1/invalid-cursor-400.json';

const GANJA_ORIGIN = 'https://ganja.inspira.dev.br';
const FEED = 'https://vitrine.test/data/vitrines/ganja/instagram-feed.json';
const OTHER = 'https://vitrine.test/data/vitrines/loja2/instagram-feed.json';

interface MockOptions {
  first?: unknown;
  firstStatus?: number;
  second?: unknown;
  cors?: (origin: string | null) => string | null;
  otherAcceptsCursor?: boolean;
  etag?: string | null;
}

/** In-memory Vitrine following the documented routes, CORS allowlist and ETag behaviour. */
function mockVitrine(options: MockOptions = {}) {
  const seen: Array<{ url: string; headers: Record<string, string> }> = [];
  const etag = options.etag === undefined ? `"${pageOne.hash}"` : options.etag;
  const cors = options.cors ?? ((origin) => (origin === GANJA_ORIGIN ? origin : null));
  const fetchImpl = async (input: string, init?: RequestInit) => {
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    seen.push({ url: input, headers });
    const url = new URL(input);
    const cursor = url.searchParams.get('cursor');
    const out = new Headers({ 'Content-Type': 'application/json' });
    const allowed = cors(headers.origin ?? null);
    if (allowed) out.set('Access-Control-Allow-Origin', allowed);
    const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: out });

    if (url.pathname.includes('/loja2/')) {
      if (cursor && !options.otherAcceptsCursor) return reply(invalidCursor, 400);
      return reply(otherStorefront);
    }
    if (!cursor) {
      if (etag) {
        out.set('ETag', etag);
        if (headers['if-none-match'] === etag) return new Response(null, { status: 304, headers: out });
      }
      return reply(options.first ?? pageOne, options.firstStatus ?? 200);
    }
    if (cursor === pageOne.pageInfo.nextCursor) return reply(options.second ?? pageTwo);
    return reply(invalidCursor, 400);
  };
  return { fetchImpl, seen };
}

function byId(checks: PilotCheck[]) {
  return Object.fromEntries(checks.map((c) => [c.id, c]));
}

describe('Instagram pilot feed check', () => {
  it('passes every read-only check against a compliant Vitrine and sends no credentials', async () => {
    const { fetchImpl, seen } = mockVitrine();
    const { checks, snapshot } = await runPilotCheck({ url: FEED, otherUrl: OTHER, limit: 3, fetch: fetchImpl });
    const result = byId(checks);
    for (const id of ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C10']) {
      expect(result[id], `${id}: ${result[id]?.detail}`).toMatchObject({ status: 'pass' });
    }
    expect(result.C09.status).toBe('skip');
    expect(result.C05.detail).toBe('2 página(s), 5 publicações únicas');
    expect(snapshot?.items.map((item) => item.id)).toHaveLength(5);
    for (const request of seen) {
      expect(request.headers.authorization).toBeUndefined();
      expect(request.headers.cookie).toBeUndefined();
      expect(request.url).not.toMatch(/token|secret/i);
    }
  });

  it('fails the contract when the projection leaks private keys, and never prints their values', async () => {
    const { fetchImpl } = mockVitrine({ first: leaky });
    const result = await runPilotCheck({ url: FEED, limit: 3, fetch: fetchImpl });
    const c01 = byId(result.checks).C01;
    expect(c01.status).toBe('fail');
    expect(c01.detail).toContain('$.profile.accessToken');
    const report = renderReport(result, { url: FEED });
    expect(report).not.toContain('FAKE-VALUE-NOT-A-TOKEN');
    expect(report).toContain('| C01 | Contrato schemaVersion 1 na primeira página | FALHOU |');
  });

  it('fails pagination when a post repeats across pages', async () => {
    const { fetchImpl } = mockVitrine({ second: { ...pageTwo, items: [pageOne.items[2], ...pageTwo.items.slice(0, 1)] } });
    const c05 = byId((await runPilotCheck({ url: FEED, limit: 3, fetch: fetchImpl })).checks).C05;
    expect(c05.status).toBe('fail');
    expect(c05.detail).toContain(`id repetido entre páginas: ${pageOne.items[2].id}`);
  });

  it('warns on wildcard CORS and fails when Ganja is not an allowed origin', async () => {
    const wildcard = byId((await runPilotCheck({ url: FEED, limit: 3, fetch: mockVitrine({ cors: () => '*' }).fetchImpl })).checks);
    expect(wildcard.C03.status).toBe('warn');
    expect(wildcard.C04.status).toBe('warn');
    const closed = byId((await runPilotCheck({ url: FEED, limit: 3, fetch: mockVitrine({ cors: () => null }).fetchImpl })).checks);
    expect(closed.C03).toMatchObject({ status: 'fail', detail: 'Access-Control-Allow-Origin: ausente' });
  });

  it('fails isolation when another storefront accepts the ganja cursor', async () => {
    const { fetchImpl } = mockVitrine({ otherAcceptsCursor: true });
    const c08 = byId((await runPilotCheck({ url: FEED, otherUrl: OTHER, limit: 3, fetch: fetchImpl })).checks).C08;
    expect(c08.status).toBe('fail');
    expect(c08.detail).toMatch(/cursor da vitrine ganja aceito na outra: HTTP 200/);
  });

  it('reports a disconnected account from a documented 404 without a snapshot', async () => {
    const { fetchImpl } = mockVitrine({ first: disconnected, firstStatus: 404 });
    const { checks, snapshot } = await runPilotCheck({ url: FEED, fetch: fetchImpl });
    expect(byId(checks).C01).toMatchObject({ status: 'warn', detail: expect.stringContaining('conta desconectada') });
    expect(snapshot).toBeNull();
  });

  it('compares with the previous cycle: new and removed posts, and a hash that must change with them', async () => {
    const previous: FeedSnapshot = {
      checkedAt: '2026-11-14T10:00:00.000Z',
      url: FEED,
      hash: 'hash-anterior',
      revision: 13,
      items: [...pageOne.items.slice(1), ...pageTwo.items, { id: 'removido-1', mediaType: 'IMAGE', permalink: 'https://www.instagram.com/p/R/', publishedAt: '2026-11-01T00:00:00.000Z' }].map(
        ({ id, mediaType, permalink, publishedAt }) => ({ id, mediaType, permalink, publishedAt })
      ),
    };
    const { fetchImpl } = mockVitrine();
    const c09 = byId((await runPilotCheck({ url: FEED, limit: 3, compare: previous, fetch: fetchImpl })).checks).C09;
    expect(c09.status).toBe('pass');
    expect(c09.detail).toContain('+1 nova(s), −1 removida(s), revisão 13 → 14');
    expect(c09.detail).toContain(pageOne.items[0].id);

    const sameHash = byId((await runPilotCheck({ url: FEED, limit: 3, compare: { ...previous, hash: pageOne.hash }, fetch: fetchImpl })).checks).C09;
    expect(sameHash.status).toBe('fail');
  });
});

describe('Instagram pilot CLI', () => {
  let server: http.Server;
  let base: string;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ganja-pilot-'));

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      const body = url.searchParams.get('cursor') ? pageTwo : pageOne;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (req.headers.origin === GANJA_ORIGIN) headers['Access-Control-Allow-Origin'] = GANJA_ORIGIN;
      res.writeHead(200, headers).end(JSON.stringify(body));
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/data/vitrines/ganja/instagram-feed.json`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('writes the Markdown report and a snapshot without captions or media URLs', async () => {
    const out = path.join(tmp, 'relatorio.md');
    const save = path.join(tmp, 'snapshot.json');
    const script = path.resolve(process.cwd(), 'scripts/instagram-pilot/check-feed.mjs');
    const { stdout } = await promisify(execFile)(process.execPath, [script, '--url', base, '--limit', '3', '--out', out, '--save', save]);
    expect(stdout).toContain('| C05 | Paginação completa sem duplicatas | PASSOU | 2 página(s), 5 publicações únicas |');
    expect(fs.readFileSync(out, 'utf8')).toBe(stdout);
    const snapshot = JSON.parse(fs.readFileSync(save, 'utf8'));
    expect(snapshot.items).toHaveLength(5);
    expect(JSON.stringify(snapshot)).not.toMatch(/caption|cdninstagram/);
  });

  it('refuses a feed URL that carries a token', async () => {
    const script = path.resolve(process.cwd(), 'scripts/instagram-pilot/check-feed.mjs');
    const error = await promisify(execFile)(process.execPath, [script, '--url', `${base}?access_token=x`]).catch((e) => e);
    expect(error.code).toBe(2);
    expect(error.stderr).toContain('não pode conter token');
  });
});
