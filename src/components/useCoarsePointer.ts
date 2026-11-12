import { useEffect, useState } from 'react';

export const COARSE_POINTER_QUERY = '(hover: none) and (pointer: coarse)';

function matches(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(COARSE_POINTER_QUERY).matches
    : false;
}

/** True on devices without hover and with a coarse pointer (phones, most tablets). */
export function useCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(matches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(COARSE_POINTER_QUERY);
    const update = () => setIsCoarse(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isCoarse;
}
