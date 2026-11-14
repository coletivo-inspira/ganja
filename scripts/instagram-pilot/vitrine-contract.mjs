// Validator for the Vitrine public Instagram feed, schemaVersion 1
// (vitrine docs/instagram/interface-publica-feed.md, vitrine #51).
// Plain ESM so the pilot CLI runs with `node` and Vitest imports the same rules.

export const SCHEMA_VERSION = 1;
export const MEDIA_TYPES = ['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'];
export const PAGE_STATUSES = ['active', 'empty', 'stale'];
export const MAX_LIMIT = 24;
export const MAX_CURSOR_LENGTH = 128;

/** FORBIDDEN_PUBLIC_KEYS from vitrine src/publication-engine.mjs plus the feed-specific list (section 4). */
export const FORBIDDEN_KEYS = [
  'owner_user_id', 'ownerUserId', 'ownerEmail', 'email', 'userId', 'user_id', 'siteId', 'site_id',
  'session', 'token', 'accessToken', 'refreshToken', 'service_role', 'serviceRoleKey', 'internalCost',
  'internalNotes', 'active', 'available', 'password', 'secret',
  'instagramAccessToken', 'access_token', 'refresh_token', 'tokenExpiresAt', 'token_expires_at',
  'oauthState', 'oauth_state', 'appSecret', 'webhookSecret', 'webhook_secret', 'webhookUrl',
  'webhook_url', 'rawApiError',
];

// Meta user/page token prefixes. Matching is a tripwire only; the report never prints the value.
const TOKEN_PATTERN = /\b(?:IGQV|IGAA|EAA[A-Za-z0-9])[A-Za-z0-9_-]{20,}/;

const PRIVATE_HOST =
  /^(?:localhost|.*\.local|.*\.internal|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|0\.0\.0\.0|\[?::1\]?)$/i;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoUtc(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) && !Number.isNaN(Date.parse(value));
}

/** Public https URL: no other scheme, no credentials, no loopback/private host. */
export function isSafePublicHttpsUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !PRIVATE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

export function isInstagramUrl(value) {
  if (!isSafePublicHttpsUrl(value)) return false;
  const host = new URL(value).hostname.toLowerCase();
  return host === 'instagram.com' || host.endsWith('.instagram.com');
}

export function isInstagramPermalink(value) {
  return isInstagramUrl(value) && /^\/(?:p|reel|tv)\/[^/]+\/?$/.test(new URL(value).pathname);
}

/** Paths (e.g. `items[0].owner_user_id`) of keys that must never reach a public projection. */
export function findForbiddenKeys(value, path = '$') {
  const hits = [];
  if (Array.isArray(value)) {
    value.forEach((entry, index) => hits.push(...findForbiddenKeys(entry, `${path}[${index}]`)));
  } else if (isObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      const here = `${path}.${key}`;
      if (FORBIDDEN_KEYS.includes(key)) hits.push(here);
      hits.push(...findForbiddenKeys(entry, here));
    }
  }
  return hits;
}

/** Paths of string values shaped like a Meta access token. */
export function findTokenLikeValues(value, path = '$') {
  const hits = [];
  if (typeof value === 'string') {
    if (TOKEN_PATTERN.test(value)) hits.push(path);
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => hits.push(...findTokenLikeValues(entry, `${path}[${index}]`)));
  } else if (isObject(value)) {
    for (const [key, entry] of Object.entries(value)) hits.push(...findTokenLikeValues(entry, `${path}.${key}`));
  }
  return hits;
}

function checkMedia(media, path, errors, { allowChildren }) {
  if (!isNonEmptyString(media.id)) errors.push(`${path}.id ausente`);
  if (!MEDIA_TYPES.includes(media.mediaType)) errors.push(`${path}.mediaType inválido: ${JSON.stringify(media.mediaType)}`);
  if (!isSafePublicHttpsUrl(media.mediaUrl)) errors.push(`${path}.mediaUrl não é https público`);
  if (media.thumbnailUrl !== undefined && !isSafePublicHttpsUrl(media.thumbnailUrl)) {
    errors.push(`${path}.thumbnailUrl não é https público`);
  }
  if (media.mediaType === 'VIDEO' && media.thumbnailUrl === undefined) errors.push(`${path}: VIDEO sem thumbnailUrl`);
  if (!allowChildren && media.children !== undefined) errors.push(`${path}: children aninhado`);
}

/**
 * Validate a 200 body. Returns `{ errors, warnings }`; an empty `errors` list
 * means the page meets the contract Ganja relies on.
 */
export function validateFeedPage(body, { expectedSlug, requestedLimit } = {}) {
  const errors = [];
  const warnings = [];
  if (!isObject(body)) return { errors: ['corpo não é um objeto JSON'], warnings };

  for (const path of findForbiddenKeys(body)) errors.push(`chave proibida na projeção pública: ${path}`);
  for (const path of findTokenLikeValues(body)) errors.push(`valor com formato de token em ${path}`);

  if (body.schemaVersion !== SCHEMA_VERSION) errors.push(`schemaVersion ${JSON.stringify(body.schemaVersion)} (esperado ${SCHEMA_VERSION})`);
  if (!isNonEmptyString(body.slug)) errors.push('slug ausente');
  else if (expectedSlug && body.slug.toLowerCase() !== expectedSlug.toLowerCase()) {
    errors.push(`slug "${body.slug}" não é a vitrine esperada "${expectedSlug}"`);
  }
  if (!PAGE_STATUSES.includes(body.status)) errors.push(`status inválido para 200: ${JSON.stringify(body.status)}`);
  if (body.status === 'stale' && body.stale !== true) warnings.push('status "stale" sem "stale": true');
  if (!Number.isInteger(body.revision)) warnings.push('revision ausente ou não inteiro');
  if (!isNonEmptyString(body.hash)) warnings.push('hash ausente');
  if (!isIsoUtc(body.syncedAt)) errors.push('syncedAt não é ISO-8601 UTC');

  const profile = body.profile;
  if (!isObject(profile)) {
    errors.push('profile ausente');
  } else {
    if (!isNonEmptyString(profile.username)) errors.push('profile.username ausente');
    if (!isInstagramUrl(profile.profileUrl)) errors.push('profile.profileUrl não é https do Instagram');
    if (profile.avatarUrl !== undefined && !isSafePublicHttpsUrl(profile.avatarUrl)) errors.push('profile.avatarUrl não é https público');
  }

  const pageInfo = body.pageInfo;
  if (!isObject(pageInfo)) {
    errors.push('pageInfo ausente');
  } else {
    if (!Number.isInteger(pageInfo.limit) || pageInfo.limit < 1 || pageInfo.limit > MAX_LIMIT) {
      errors.push(`pageInfo.limit fora de 1..${MAX_LIMIT}`);
    } else if (requestedLimit && pageInfo.limit !== Math.min(requestedLimit, MAX_LIMIT)) {
      warnings.push(`pageInfo.limit ${pageInfo.limit} difere do pedido ${requestedLimit}`);
    }
    if (typeof pageInfo.hasNextPage !== 'boolean') errors.push('pageInfo.hasNextPage não é booleano');
    if (pageInfo.hasNextPage === true) {
      if (!isNonEmptyString(pageInfo.nextCursor)) errors.push('hasNextPage true sem nextCursor');
      else if (pageInfo.nextCursor.length > MAX_CURSOR_LENGTH) errors.push(`nextCursor maior que ${MAX_CURSOR_LENGTH} caracteres`);
    }
    if (pageInfo.hasNextPage === false && pageInfo.nextCursor !== null) errors.push('hasNextPage false com nextCursor diferente de null');
  }

  if (!Array.isArray(body.items)) {
    errors.push('items não é lista');
    return { errors, warnings };
  }
  if (Array.isArray(body.items) && isObject(pageInfo) && Number.isInteger(pageInfo.limit) && body.items.length > pageInfo.limit) {
    errors.push(`items (${body.items.length}) excede pageInfo.limit (${pageInfo.limit})`);
  }
  if (body.status === 'empty' && body.items.length > 0) errors.push('status "empty" com publicações');
  if (body.status === 'active' && body.items.length === 0) warnings.push('status "active" sem publicações na página');

  const seen = new Set();
  let previous;
  body.items.forEach((item, index) => {
    const path = `items[${index}]`;
    if (!isObject(item)) {
      errors.push(`${path} não é objeto`);
      return;
    }
    checkMedia(item, path, errors, { allowChildren: true });
    if (item.caption !== undefined && typeof item.caption !== 'string') errors.push(`${path}.caption não é texto`);
    if (!isInstagramPermalink(item.permalink)) errors.push(`${path}.permalink não é publicação https do Instagram`);
    if (!isIsoUtc(item.publishedAt)) errors.push(`${path}.publishedAt não é ISO-8601 UTC`);
    if (item.children !== undefined) {
      if (item.mediaType !== 'CAROUSEL_ALBUM') errors.push(`${path}: children fora de CAROUSEL_ALBUM`);
      if (!Array.isArray(item.children)) errors.push(`${path}.children não é lista`);
      else item.children.forEach((child, c) => (isObject(child) ? checkMedia(child, `${path}.children[${c}]`, errors, { allowChildren: false }) : errors.push(`${path}.children[${c}] não é objeto`)));
    }
    if (isNonEmptyString(item.id)) {
      if (seen.has(item.id)) errors.push(`${path}: id repetido na página (${item.id})`);
      seen.add(item.id);
    }
    if (previous && isIsoUtc(previous) && isIsoUtc(item.publishedAt) && Date.parse(item.publishedAt) > Date.parse(previous)) {
      errors.push(`${path}: fora da ordem publishedAt decrescente`);
    }
    previous = item.publishedAt;
  });

  return { errors, warnings };
}

const ERROR_CONTRACT = {
  400: { error: 'INVALID_CURSOR' },
  404: { error: 'FEED_NOT_FOUND', status: 'disconnected' },
  503: { error: 'FEED_UNAVAILABLE', status: 'unavailable' },
};

/** Validate a non-200 body against section 8 of the contract; it must not leak internals either. */
export function validateErrorBody(httpStatus, body) {
  const errors = [];
  const expected = ERROR_CONTRACT[httpStatus];
  if (!expected) return { errors: [`status HTTP ${httpStatus} fora do contrato`], warnings: [] };
  if (!isObject(body)) return { errors: ['corpo de erro não é JSON'], warnings: [] };
  for (const [key, value] of Object.entries(expected)) {
    if (body[key] !== value) errors.push(`${key} ${JSON.stringify(body[key])} (esperado ${JSON.stringify(value)})`);
  }
  for (const path of findForbiddenKeys(body)) errors.push(`chave proibida no erro: ${path}`);
  for (const path of findTokenLikeValues(body)) errors.push(`valor com formato de token em ${path}`);
  if (body.items !== undefined) errors.push('erro não deve trazer publicações');
  return { errors, warnings: [] };
}
