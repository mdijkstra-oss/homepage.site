import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the built site work when opened from any static path
// (e.g. GitHub Pages subfolders or just double-clicking dist/index.html).
export default defineConfig({
  plugins: [react()],
  base: './',
  // Some source files (e.g. components/ui.js) carry JSX with a .js extension.
  // Tell esbuild to parse .js as JSX so both dev and the production build work.
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
});
