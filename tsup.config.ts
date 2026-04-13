import { defineConfig } from 'tsup';

const mainConfig = {
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
};

const preloadConfig = {
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
};

export default defineConfig(() => {
  const only = process.env.TSUP_ONLY;

  if (only === 'preload') {
    return [preloadConfig];
  }

  if (only === 'main') {
    return [mainConfig];
  }

  return [mainConfig, preloadConfig];
});
