import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20', // ou node18, conforme seu Node
  format: 'esm', // mantém compatível com "type": "module"
  sourcemap: false,
  minify: true,
  treeShaking: true,
  legalComments: 'none',
});

console.log('✅ Build concluído: dist/index.js');
