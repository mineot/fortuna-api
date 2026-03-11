import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    fortuna: 'src/main.ts',
  },
  format: ['esm'],
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  target: 'node22',
  platform: 'node',
  outDir: 'dist',
  outExtension() {
    return {
      js: '.js',
    };
  },
});
