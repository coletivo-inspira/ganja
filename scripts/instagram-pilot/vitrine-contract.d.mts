export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export const SCHEMA_VERSION: 1;
export const MEDIA_TYPES: readonly string[];
export const PAGE_STATUSES: readonly string[];
export const MAX_LIMIT: number;
export const MAX_CURSOR_LENGTH: number;
export const FORBIDDEN_KEYS: readonly string[];

export function isSafePublicHttpsUrl(value: unknown): boolean;
export function isInstagramUrl(value: unknown): boolean;
export function isInstagramPermalink(value: unknown): boolean;
export function findForbiddenKeys(value: unknown, path?: string): string[];
export function findTokenLikeValues(value: unknown, path?: string): string[];
export function validateFeedPage(
  body: unknown,
  options?: { expectedSlug?: string; requestedLimit?: number }
): ValidationResult;
export function validateErrorBody(httpStatus: number, body: unknown): ValidationResult;
