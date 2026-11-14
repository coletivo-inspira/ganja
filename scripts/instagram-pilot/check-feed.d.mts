export const DEFAULT_ORIGIN: string;
export const DEFAULT_FOREIGN_ORIGIN: string;

export type CheckStatus = 'pass' | 'fail' | 'warn' | 'skip';

export interface PilotCheck {
  id: string;
  name: string;
  status: CheckStatus;
  detail: string;
}

export interface FeedSnapshot {
  checkedAt: string;
  url: string;
  slug?: string;
  status?: string;
  revision?: number;
  hash?: string;
  syncedAt?: string;
  items: Array<{ id: string; mediaType: string; permalink: string; publishedAt: string }>;
}

export interface PilotCheckOptions {
  url: string;
  origin?: string;
  foreignOrigin?: string;
  otherUrl?: string;
  slug?: string;
  limit?: number;
  maxPages?: number;
  compare?: FeedSnapshot;
  timeoutMs?: number;
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}

export interface PilotCheckResult {
  checks: PilotCheck[];
  snapshot: FeedSnapshot | null;
  expectedSlug?: string;
}

export function runPilotCheck(options: PilotCheckOptions): Promise<PilotCheckResult>;
export function renderReport(result: PilotCheckResult, options: { url: string; origin?: string }): string;
