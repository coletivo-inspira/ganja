import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  const fromEnv = process.env.VITE_BASE;
  const base = fromEnv && fromEnv.length > 0 ? fromEnv : '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: false,
      host: true,
    },
    preview: {
      port: 4173,
      strictPort: false,
      host: true,
    },
  };
});
