import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cp, mkdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDir = path.join(projectRoot, 'src', 'renderer', 'dist');
const distDir = path.join(projectRoot, 'dist');
const sourcePreload = path.join(projectRoot, 'src', 'preload.cjs');
const targetPreload = path.join(distDir, 'preload.cjs');

await mkdir(distDir, { recursive: true });
await cp(sourceDir, distDir, { recursive: true, force: true });
await cp(sourcePreload, targetPreload, { force: true });
