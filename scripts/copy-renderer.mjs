import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cp, mkdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDir = path.join(projectRoot, 'src', 'renderer', 'dist');
const distDir = path.join(projectRoot, 'dist');

await mkdir(distDir, { recursive: true });
await cp(sourceDir, distDir, { recursive: true, force: true });
