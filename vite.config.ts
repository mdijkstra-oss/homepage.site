import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const RELATIVE_DEPLOYMENT_BASE = './';

export default defineConfig({
  plugins: [react()],
  base: RELATIVE_DEPLOYMENT_BASE,
});
