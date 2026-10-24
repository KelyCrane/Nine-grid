import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: './', cacheDir: '.storage/cache/vite', build: { outDir: 'dist', assetsDir: 'assets' } });
