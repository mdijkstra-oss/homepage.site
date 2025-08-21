import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'url';
import path from 'path';
import { configDefaults } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [preact()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/spec.*.{ts,tsx}'],
	},
});
