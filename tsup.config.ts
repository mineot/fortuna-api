import { defineConfig } from 'tsup';

export default defineConfig({
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
});
