// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { ConfigEnv, UserConfig } from 'vite';
import viteConfig from '../../vite.config';

const ROOT_DIR = path.resolve(__dirname, '../..');

function resolveBase(env: ConfigEnv): string | undefined {
  const config = typeof viteConfig === 'function' ? viteConfig(env) : viteConfig;
  return (config as UserConfig).base;
}

describe('GitHub Pages custom-domain deploy (ganja.inspira.dev.br)', () => {
  const originalBase = process.env.VITE_BASE;

  afterEach(() => {
    if (originalBase === undefined) delete process.env.VITE_BASE;
    else process.env.VITE_BASE = originalBase;
  });

  it('defaults production builds to the domain root', () => {
    delete process.env.VITE_BASE;
    expect(resolveBase({ command: 'build', mode: 'production' })).toBe('/');
    expect(resolveBase({ command: 'serve', mode: 'development' })).toBe('/');
  });

  it('still honours a non-root VITE_BASE override', () => {
    process.env.VITE_BASE = '/ganja/';
    expect(resolveBase({ command: 'build', mode: 'production' })).toBe('/ganja/');
  });

  it('ships public/CNAME pointing at the custom domain', () => {
    const cname = fs.readFileSync(path.join(ROOT_DIR, 'public/CNAME'), 'utf8');
    expect(cname.trim()).toBe('ganja.inspira.dev.br');
  });

  it('builds the Pages workflow with a root base', () => {
    const workflow = fs.readFileSync(path.join(ROOT_DIR, '.github/workflows/pages.yml'), 'utf8');
    expect(workflow).toMatch(/VITE_BASE:\s*\/\s*$/m);
    expect(workflow).not.toContain('/ganja/');
  });
});
