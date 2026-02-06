import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/fortuna-api.js',
  bundle: true,
  platform: 'node',
  target: 'node20', // ou node18, conforme seu Node
  format: 'esm', // mantém compatível com "type": "module"
  sourcemap: false,
  minify: true,
  treeShaking: true,
  legalComments: 'none',
});

console.log('✅ Build concluído: dist/fortuna-api.js');
