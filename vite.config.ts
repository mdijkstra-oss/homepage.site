import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const RELATIVE_DEPLOYMENT_BASE = './';

export default defineConfig({
  plugins: [react()],
  base: RELATIVE_DEPLOYMENT_BASE,
});
