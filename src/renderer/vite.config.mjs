import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFile, mkdir } from 'node:fs/promises';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyLucideFontAssets() {
  const lucideDir = path.join(__dirname, '..', '..', 'node_modules', 'lucide-static', 'font');
  const files = ['lucide.eot', 'lucide.woff2', 'lucide.woff', 'lucide.ttf', 'lucide.svg'];

  return {
    name: 'copy-lucide-font-assets',
    async writeBundle(_, bundle) {
      const cssAsset = Object.values(bundle).find(
        (asset) => asset.type === 'asset' && asset.fileName.endsWith('.css') && asset.fileName.startsWith('assets/'),
      );

      if (!cssAsset) {
        return;
      }

      const assetsDir = path.join(__dirname, 'dist', 'assets');
      await mkdir(assetsDir, { recursive: true });

      await Promise.all(
        files.map((file) => copyFile(path.join(lucideDir, file), path.join(assetsDir, file))),
      );
    },
  };
}

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react(), copyLucideFontAssets()],
  resolve: {
    alias: {
      '@db/schema': path.join(__dirname, '..', 'database', 'schema', 'index.ts'),
      '@shared': path.join(__dirname, '..', 'shared'),
      '@widgets': path.join(__dirname, 'src', 'widgets', 'index.ts'),
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
