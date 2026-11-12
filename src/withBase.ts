/** Prefix a public asset path with Vite's base (`/` by default, including the ganja.inspira.dev.br Pages deploy; override with VITE_BASE). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  const relative = path.startsWith('/') ? path.slice(1) : path;
  return `${normalized}${relative}`;
}
