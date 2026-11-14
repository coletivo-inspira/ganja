#!/usr/bin/env node
// Pilot check for the Vitrine public Instagram feed consumed by Ganja (ganja #6).
// Reads only the public, unauthenticated projection: it sends no cookie, token or
// Authorization header and never prints captions, media URLs or token-like values.
//
//   node scripts/instagram-pilot/check-feed.mjs --url https://vitrine.inspira.dev.br/data/vitrines/ganja/instagram-feed.json \
//     [--origin https://ganja.inspira.dev.br] [--foreign-origin https://origem-nao-autorizada.example] \
//     [--other-url <feed de outra vitrine>] [--limit 12] [--max-pages 50] \
//     [--save snapshot.json] [--compare snapshot-anterior.json] [--out relatorio.md]

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { findForbiddenKeys, findTokenLikeValues, validateErrorBody, validateFeedPage } from './vitrine-contract.mjs';

export const DEFAULT_ORIGIN = 'https://ganja.inspira.dev.br';
export const DEFAULT_FOREIGN_ORIGIN = 'https://origem-nao-autorizada.example';

function slugFromUrl(url) {
  const match = new URL(url).pathname.match(/\/vitrines\/([^/]+)\//);
  return match ? decodeURIComponent(match[1]).toLowerCase() : undefined;
}

function pageUrl(base, limit, cursor) {
  const url = new URL(base);
  url.searchParams.set('limit', String(limit));
  if (cursor) url.searchParams.set('cursor', cursor);
  return url.href;
}

async function request(fetchImpl, url, { origin, headers = {}, timeoutMs }) {
  const response = await fetchImpl(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: 'application/json', Origin: origin, ...headers },
    signal: AbortSignal.timeout(timeoutMs),
  });
  let body;
  const text = response.status === 304 ? '' : await response.text();
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = undefined;
  }
  return { status: response.status, headers: response.headers, body };
}

function check(id, name, status, detail) {
  return { id, name, status, detail };
}

function summarize(list, max = 6) {
  return list.length <= max ? list.join('; ') : `${list.slice(0, max).join('; ')}; … +${list.length - max}`;
}

export async function runPilotCheck(options) {
  const {
    url,
    origin = DEFAULT_ORIGIN,
    foreignOrigin = DEFAULT_FOREIGN_ORIGIN,
    otherUrl,
    limit = 12,
    maxPages = 50,
    compare,
    timeoutMs = 15000,
    fetch: fetchImpl = globalThis.fetch,
  } = options;
  if (!url) throw new Error('--url é obrigatório');
  const expectedSlug = options.slug ?? slugFromUrl(url);
  const checks = [];
  const get = (target, extra = {}) => request(fetchImpl, target, { origin, timeoutMs, ...extra });

  let first;
  try {
    first = await get(pageUrl(url, limit));
  } catch (error) {
    checks.push(check('C01', 'Primeira página responde', 'fail', `falha de rede: ${error.name}`));
    return { checks, snapshot: null, expectedSlug };
  }

  const acao = first.headers.get('access-control-allow-origin');
  if (acao === origin) checks.push(check('C03', `CORS libera ${origin}`, 'pass', `Access-Control-Allow-Origin: ${acao}`));
  else if (acao === '*') checks.push(check('C03', `CORS libera ${origin}`, 'warn', 'Access-Control-Allow-Origin: * (o contrato prevê lista explícita de origens)'));
  else checks.push(check('C03', `CORS libera ${origin}`, 'fail', `Access-Control-Allow-Origin: ${acao ?? 'ausente'}`));

  const setCookie = first.headers.get('set-cookie');
  checks.push(
    setCookie
      ? check('C02', 'Leitura pública sem sessão', 'fail', 'resposta define cookie (Set-Cookie)')
      : check('C02', 'Leitura pública sem sessão', 'pass', 'requisição sem cookie/Authorization/token; resposta sem Set-Cookie')
  );

  if (first.status !== 200) {
    const { errors } = validateErrorBody(first.status, first.body);
    const state = first.status === 404 ? 'desconectada' : first.status === 503 ? 'indisponível' : `HTTP ${first.status}`;
    checks.push(
      check('C01', 'Primeira página responde', errors.length ? 'fail' : 'warn', errors.length ? summarize(errors) : `conta ${state}: corpo de erro segue o contrato, sem publicações`)
    );
    return { checks, snapshot: null, expectedSlug };
  }

  const firstResult = validateFeedPage(first.body, { expectedSlug, requestedLimit: limit });
  checks.push(
    check(
      'C01',
      'Contrato schemaVersion 1 na primeira página',
      firstResult.errors.length ? 'fail' : firstResult.warnings.length ? 'warn' : 'pass',
      firstResult.errors.length
        ? summarize(firstResult.errors)
        : `status ${first.body.status}, ${first.body.items.length} publicações, revisão ${first.body.revision ?? '—'}${firstResult.warnings.length ? `; avisos: ${summarize(firstResult.warnings)}` : ''}`
    )
  );

  const pages = [first.body];
  const pageErrors = [];
  const ids = new Set(first.body.items?.map((item) => item.id) ?? []);
  const duplicates = [];
  let cursor = first.body.pageInfo?.nextCursor ?? null;
  const firstCursor = cursor;
  let truncated = false;
  while (cursor) {
    if (pages.length >= maxPages) {
      truncated = true;
      break;
    }
    let next;
    try {
      next = await get(pageUrl(url, limit, cursor));
    } catch (error) {
      pageErrors.push(`página ${pages.length + 1}: falha de rede ${error.name}`);
      break;
    }
    if (next.status !== 200) {
      pageErrors.push(`página ${pages.length + 1}: HTTP ${next.status}${next.body?.error ? ` ${next.body.error}` : ''}`);
      break;
    }
    const result = validateFeedPage(next.body, { expectedSlug, requestedLimit: limit });
    pageErrors.push(...result.errors.map((e) => `página ${pages.length + 1}: ${e}`));
    const lastPrev = pages.at(-1).items?.at(-1)?.publishedAt;
    const firstNext = next.body.items?.[0]?.publishedAt;
    if (lastPrev && firstNext && Date.parse(firstNext) > Date.parse(lastPrev)) {
      pageErrors.push(`página ${pages.length + 1}: ordem publishedAt quebrada entre páginas`);
    }
    for (const item of next.body.items ?? []) {
      if (ids.has(item.id)) duplicates.push(item.id);
      ids.add(item.id);
    }
    pages.push(next.body);
    if (next.body.pageInfo?.nextCursor === cursor) {
      pageErrors.push(`página ${pages.length}: nextCursor repetido, paginação em laço`);
      break;
    }
    cursor = next.body.pageInfo?.nextCursor ?? null;
  }
  const allItems = pages.flatMap((page) => page.items ?? []);
  const paginationErrors = [...pageErrors, ...duplicates.map((id) => `id repetido entre páginas: ${id}`)];
  checks.push(
    check(
      'C05',
      'Paginação completa sem duplicatas',
      paginationErrors.length ? 'fail' : truncated ? 'warn' : 'pass',
      paginationErrors.length
        ? summarize(paginationErrors)
        : `${pages.length} página(s), ${allItems.length} publicações únicas${truncated ? `; parou em --max-pages ${maxPages}` : ''}`
    )
  );

  const counts = { IMAGE: 0, CAROUSEL_ALBUM: 0, VIDEO: 0 };
  for (const item of allItems) if (item.mediaType in counts) counts[item.mediaType] += 1;
  const missingTypes = Object.entries(counts).filter(([, n]) => n === 0).map(([type]) => type);
  checks.push(
    check(
      'C06',
      'Formatos presentes (foto, carrossel, vídeo)',
      missingTypes.length ? 'warn' : 'pass',
      `IMAGE ${counts.IMAGE}, CAROUSEL_ALBUM ${counts.CAROUSEL_ALBUM}, VIDEO ${counts.VIDEO}${missingTypes.length ? `; sem ${missingTypes.join(', ')} na conta — cenário não exercitado` : ''}`
    )
  );

  const status = first.body.status;
  checks.push(
    check(
      'C10',
      'Estado da projeção',
      status === 'active' ? 'pass' : 'warn',
      status === 'stale'
        ? `stale: Vitrine serve a última versão válida, sincronizada em ${first.body.syncedAt}`
        : status === 'empty'
          ? 'empty: conta conectada sem publicações acessíveis'
          : `active, sincronizado em ${first.body.syncedAt}`
    )
  );

  try {
    const foreign = await get(pageUrl(url, limit), { origin: foreignOrigin });
    const foreignAcao = foreign.headers.get('access-control-allow-origin');
    if (!foreignAcao || (foreignAcao !== foreignOrigin && foreignAcao !== '*')) {
      checks.push(check('C04', `CORS nega ${foreignOrigin}`, 'pass', `Access-Control-Allow-Origin: ${foreignAcao ?? 'ausente'}`));
    } else {
      checks.push(check('C04', `CORS nega ${foreignOrigin}`, foreignAcao === '*' ? 'warn' : 'fail', `Access-Control-Allow-Origin: ${foreignAcao}`));
    }
  } catch (error) {
    checks.push(check('C04', `CORS nega ${foreignOrigin}`, 'fail', `falha de rede: ${error.name}`));
  }

  const etag = first.headers.get('etag');
  if (!etag) {
    checks.push(check('C07', 'Cache por ETag (304)', 'warn', 'resposta sem ETag'));
  } else {
    try {
      const again = await get(pageUrl(url, limit), { headers: { 'If-None-Match': etag } });
      checks.push(check('C07', 'Cache por ETag (304)', again.status === 304 ? 'pass' : 'warn', `If-None-Match ${etag} → HTTP ${again.status}`));
    } catch (error) {
      checks.push(check('C07', 'Cache por ETag (304)', 'warn', `falha de rede: ${error.name}`));
    }
  }

  if (otherUrl) {
    const problems = [];
    try {
      const other = await get(pageUrl(otherUrl, limit));
      if (other.status === 200) {
        if (other.body?.slug && expectedSlug && other.body.slug.toLowerCase() === expectedSlug) problems.push('a outra vitrine devolve o mesmo slug');
        if (other.body?.profile?.username && other.body.profile.username === first.body.profile?.username) problems.push('a outra vitrine devolve o mesmo perfil');
        const shared = (other.body?.items ?? []).filter((item) => ids.has(item.id)).map((item) => item.id);
        if (shared.length) problems.push(`publicações compartilhadas: ${summarize(shared, 3)}`);
      } else if (other.status !== 404) {
        problems.push(`outra vitrine respondeu HTTP ${other.status}`);
      }
      if (firstCursor) {
        const crossed = await get(pageUrl(otherUrl, limit, firstCursor));
        if (crossed.status !== 400 || crossed.body?.error !== 'INVALID_CURSOR') {
          problems.push(`cursor da vitrine ${expectedSlug ?? 'principal'} aceito na outra: HTTP ${crossed.status}`);
        }
      }
    } catch (error) {
      problems.push(`falha de rede: ${error.name}`);
    }
    checks.push(
      check(
        'C08',
        'Isolamento entre vitrines',
        problems.length ? 'fail' : 'pass',
        problems.length ? summarize(problems) : `sem perfil/publicações em comum${firstCursor ? '; cursor cruzado → 400 INVALID_CURSOR' : '; sem cursor para testar reuso'}`
      )
    );
  } else {
    checks.push(check('C08', 'Isolamento entre vitrines', 'skip', 'informe --other-url com o feed de outra vitrine'));
  }

  const snapshot = {
    checkedAt: new Date().toISOString(),
    url,
    slug: first.body.slug,
    status: first.body.status,
    revision: first.body.revision,
    hash: first.body.hash,
    syncedAt: first.body.syncedAt,
    items: allItems.map(({ id, mediaType, permalink, publishedAt }) => ({ id, mediaType, permalink, publishedAt })),
  };

  if (compare) {
    const previousIds = new Set(compare.items.map((item) => item.id));
    const currentIds = new Set(snapshot.items.map((item) => item.id));
    const added = [...currentIds].filter((id) => !previousIds.has(id));
    const removed = [...previousIds].filter((id) => !currentIds.has(id));
    const changed = added.length > 0 || removed.length > 0;
    const sameHash = compare.hash && snapshot.hash && compare.hash === snapshot.hash;
    const problems = [];
    if (changed && sameHash) problems.push('publicações mudaram sem mudar o hash');
    if (!changed && compare.hash && snapshot.hash && !sameHash) problems.push('hash mudou sem mudança de publicações (pode ser renovação de URLs de mídia)');
    checks.push(
      check(
        'C09',
        'Comparação com execução anterior',
        changed && sameHash ? 'fail' : problems.length ? 'warn' : 'pass',
        `${compare.checkedAt} → agora: +${added.length} nova(s), −${removed.length} removida(s), revisão ${compare.revision ?? '—'} → ${snapshot.revision ?? '—'}${added.length ? `; novas: ${summarize(added, 3)}` : ''}${removed.length ? `; removidas: ${summarize(removed, 3)}` : ''}${problems.length ? `; ${problems.join('; ')}` : ''}`
      )
    );
  } else {
    checks.push(check('C09', 'Comparação com execução anterior', 'skip', 'rode com --save e, no próximo ciclo, --compare'));
  }

  checks.sort((a, b) => a.id.localeCompare(b.id));
  return { checks, snapshot, expectedSlug };
}

const ICON = { pass: 'PASSOU', fail: 'FALHOU', warn: 'ATENÇÃO', skip: 'NÃO EXECUTADO' };

export function renderReport({ checks, expectedSlug }, { url, origin = DEFAULT_ORIGIN }) {
  const failed = checks.filter((c) => c.status === 'fail').length;
  const lines = [
    `# Verificação do feed público Vitrine — ${new Date().toISOString()}`,
    '',
    `- Endpoint: \`${url}\``,
    `- Vitrine esperada: \`${expectedSlug ?? '—'}\``,
    `- Origem Ganja: \`${origin}\``,
    `- Resultado: ${failed ? `${failed} verificação(ões) falharam` : 'nenhuma falha'}`,
    '',
    '| ID | Verificação | Resultado | Detalhe |',
    '| --- | --- | --- | --- |',
    ...checks.map((c) => `| ${c.id} | ${c.name} | ${ICON[c.status]} | ${String(c.detail).replace(/\|/g, '\\|')} |`),
    '',
    'Este relatório cobre só a leitura pública. Autorização, revogação, reconexão e exclusão no painel Vitrine seguem o roteiro manual em docs/instagram-pilot-validation.md.',
  ];
  return `${lines.join('\n')}\n`;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url || args.help) {
    console.error('Uso: node scripts/instagram-pilot/check-feed.mjs --url <feed público da vitrine> [--origin] [--foreign-origin] [--other-url] [--limit] [--max-pages] [--save] [--compare] [--out]');
    process.exit(2);
  }
  if (/token|access_token|secret/i.test(new URL(args.url).search)) {
    console.error('A URL do feed não pode conter token ou segredo: o contrato é público.');
    process.exit(2);
  }
  const compare = args.compare ? JSON.parse(fs.readFileSync(args.compare, 'utf8')) : undefined;
  const options = {
    url: args.url,
    origin: args.origin ?? DEFAULT_ORIGIN,
    foreignOrigin: args.foreignOrigin ?? DEFAULT_FOREIGN_ORIGIN,
    otherUrl: args.otherUrl,
    slug: args.slug,
    limit: args.limit ? Number(args.limit) : 12,
    maxPages: args.maxPages ? Number(args.maxPages) : 50,
    compare,
  };
  const result = await runPilotCheck(options);
  const report = renderReport(result, options);
  process.stdout.write(report);
  if (args.out) fs.writeFileSync(args.out, report);
  if (args.save && result.snapshot) {
    const leaks = [...findForbiddenKeys(result.snapshot), ...findTokenLikeValues(result.snapshot)];
    if (leaks.length === 0) fs.writeFileSync(args.save, `${JSON.stringify(result.snapshot, null, 2)}\n`);
  }
  process.exit(result.checks.some((c) => c.status === 'fail') ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(`Falha inesperada: ${error.message}`);
    process.exit(1);
  });
}
