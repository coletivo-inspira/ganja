import { useCallback, useEffect, useRef, useState } from 'react';
import { FeedDisconnectedError } from './types';
import type { FeedItem, FeedPage, FeedProfile, FeedSource, FeedSourceKind } from './types';

export type FeedStatus = 'loading' | 'ready' | 'empty' | 'error' | 'disconnected';

export interface FeedState {
  status: FeedStatus;
  source: FeedSourceKind;
  profile: FeedProfile | null;
  items: FeedItem[];
  nextCursor: string | null;
  syncedAt: string | null;
  stale: boolean;
  loadingMore: boolean;
  loadMoreFailed: boolean;
}

function fromPage(page: FeedPage): FeedState {
  return {
    status: page.items.length > 0 ? 'ready' : 'empty',
    source: page.source,
    profile: page.profile,
    items: page.items,
    nextCursor: page.nextCursor,
    syncedAt: page.syncedAt ?? null,
    stale: page.stale ?? false,
    loadingMore: false,
    loadMoreFailed: false,
  };
}

function initialState(source: FeedSource): FeedState {
  const snap = source.snapshot?.();
  if (snap) return fromPage(snap);
  return {
    status: 'loading',
    source: source.kind,
    profile: null,
    items: [],
    nextCursor: null,
    syncedAt: null,
    stale: false,
    loadingMore: false,
    loadMoreFailed: false,
  };
}

function isAbort(error: unknown): boolean {
  return (error as Error)?.name === 'AbortError';
}

export function useFeed(source: FeedSource) {
  const [state, setState] = useState<FeedState>(() => initialState(source));
  const [attempt, setAttempt] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (attempt === 0 && source.snapshot?.()) {
      setState(initialState(source));
      return;
    }
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    setState((prev) => ({ ...initialState(source), status: 'loading', profile: prev.profile }));

    source
      .getPage(null, { signal: controller.signal })
      .then((page) => {
        if (!controller.signal.aborted) setState(fromPage(page));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbort(error)) return;
        setState((prev) => ({
          ...prev,
          status: error instanceof FeedDisconnectedError ? 'disconnected' : 'error',
          items: [],
          nextCursor: null,
        }));
      });

    return () => controller.abort();
  }, [source, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const loadMore = useCallback(async (): Promise<FeedItem[]> => {
    const cursor = state.nextCursor;
    if (!cursor || state.loadingMore) return [];
    setState((prev) => ({ ...prev, loadingMore: true, loadMoreFailed: false }));
    try {
      const page = await source.getPage(cursor, { signal: controllerRef.current?.signal });
      const seen = new Set(state.items.map((item) => item.id));
      const fresh = page.items.filter((item) => !seen.has(item.id));
      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...fresh],
        nextCursor: page.nextCursor,
        syncedAt: page.syncedAt ?? prev.syncedAt,
        stale: page.stale ?? prev.stale,
        loadingMore: false,
      }));
      return fresh;
    } catch (error) {
      if (isAbort(error)) return [];
      if (error instanceof FeedDisconnectedError) {
        setState((prev) => ({ ...prev, status: 'disconnected', items: [], nextCursor: null, loadingMore: false }));
      } else {
        setState((prev) => ({ ...prev, loadingMore: false, loadMoreFailed: true }));
      }
      return [];
    }
  }, [source, state.nextCursor, state.loadingMore, state.items]);

  return { state, retry, loadMore };
}
