import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
