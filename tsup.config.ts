import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      fortuna: 'src/main.ts',
    },
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    bundle: true,
    splitting: false,
    sourcemap: false,
    minify: true,
    clean: true,
    treeshake: true,
    external: ['electron'],
  },
  {
    entry: {
      preload: 'src/preload.ts',
    },
    format: ['cjs'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    outExtension: () => ({ js: '.cjs' }),
    bundle: true,
    splitting: false,
    sourcemap: false,
    minify: true,
    clean: false,
    treeshake: true,
    external: ['electron'],
  },
]);
