import { useEffect, useState } from 'react';

export type AppRoute = 'home' | 'feed';

export const FEED_HASH = '#/feed';
export const HOME_HASH = '#/';

export function routeFromHash(hash: string): AppRoute {
  return hash.replace(/\/+$/, '') === FEED_HASH ? 'feed' : 'home';
}

/** Hash routing keeps GitHub Pages free of server rewrites. */
export function useHashRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === 'undefined' ? 'home' : routeFromHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
