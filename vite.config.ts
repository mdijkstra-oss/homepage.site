import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes the built site work when opened from any static path
// (e.g. GitHub Pages subfolders or just double-clicking dist/index.html).
export default defineConfig({
  plugins: [react()],
  base: './',
});
