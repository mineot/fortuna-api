import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    fortuna: 'src/main.ts',
  },
  format: ['esm'],
  outDir: 'dist',
  bundle: true,
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  treeshake: true,
});
