import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@db/schema': path.join(__dirname, '..', 'database', 'schema', 'index.ts'),
      '@shared': path.join(__dirname, '..', 'shared'),
      '@components': path.join(__dirname, 'src', 'components', 'index.ts'),
      '@widgets': path.join(__dirname, 'src', 'widgets', 'index.ts'),
      '@i18n': path.join(__dirname, 'src', 'core', 'i18n', 'index.ts'),
      '@router': path.join(__dirname, 'src', 'core', 'router', 'index.tsx'),
      '@services': path.join(__dirname, 'src', 'core', 'services', 'index.ts'),
      '@pages': path.join(__dirname, 'src', 'pages', 'index.ts'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: {
      allow: [path.join(__dirname, '..', '..')],
    },
  },
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
