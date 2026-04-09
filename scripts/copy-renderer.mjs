import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceHtml = path.join(projectRoot, 'src', 'renderer', 'index.html');
const distDir = path.join(projectRoot, 'dist');
const targetHtml = path.join(distDir, 'index.html');

await mkdir(distDir, { recursive: true });
await copyFile(sourceHtml, targetHtml);
