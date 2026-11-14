import { StaticFeedSource, STATIC_PROFILE } from './staticFeedSource';
import { VitrineFeedSource } from './vitrineFeedSource';
import type { FeedSource } from './types';

export const FEED_PAGE_SIZE = 12;
export const DEFAULT_VITRINE_MANAGE_URL = 'https://painel.inspira.dev.br/';

export interface FeedEnv {
  VITE_VITRINE_FEED_URL?: string;
  VITE_VITRINE_MANAGE_URL?: string;
}

function readEnv(): FeedEnv {
  return import.meta.env as unknown as FeedEnv;
}

/** Vitrine is used only when a public feed URL is configured; otherwise the static archive. */
export function createFeedSource(
  env: FeedEnv = readEnv(),
  options: { pageSize?: number } = {}
): FeedSource {
  const pageSize = options.pageSize ?? FEED_PAGE_SIZE;
  const endpoint = env.VITE_VITRINE_FEED_URL?.trim();
  if (endpoint) {
    return new VitrineFeedSource({ endpoint, pageSize, fallbackProfile: STATIC_PROFILE });
  }
  return new StaticFeedSource(undefined, { pageSize });
}

/** Panel login and authorization stay in Vitrine; this link grants nothing by itself. */
export function vitrineManageUrl(env: FeedEnv = readEnv()): string {
  return env.VITE_VITRINE_MANAGE_URL?.trim() || DEFAULT_VITRINE_MANAGE_URL;
}

let defaultSource: FeedSource | null = null;

export function getDefaultFeedSource(): FeedSource {
  if (!defaultSource) defaultSource = createFeedSource();
  return defaultSource;
}
