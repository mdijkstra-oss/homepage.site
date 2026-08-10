import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { requireAgentUrl } from './src/lib/env';

const RELATIVE_DEPLOYMENT_BASE = './';

export default defineConfig(({ mode }) => {
  requireAgentUrl(loadEnv(mode, process.cwd()));

  return {
    plugins: [react()],
    base: RELATIVE_DEPLOYMENT_BASE,
  };
});
