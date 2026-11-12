/** Prefix a public asset path with Vite's base (`/` locally, `/ganja/` on Pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  const relative = path.startsWith('/') ? path.slice(1) : path;
  return `${normalized}${relative}`;
}
