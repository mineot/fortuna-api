import { getEnvironment } from '@env';
import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RUNTIME_DIR = dirname(fileURLToPath(import.meta.url));
const UI_DIST_BROWSER_DIR = resolve(RUNTIME_DIR, 'browser');
const UI_INDEX_FILE = resolve(UI_DIST_BROWSER_DIR, 'index.html');

const MIME_BY_EXT: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export async function indexRoute(app: Hono) {
  const env = getEnvironment();

  if (env === 'dev') {
    await runDevUI(app);
  } else {
    await runProdUI(app);
  }
}

async function runDevUI(app: Hono) {
  app.get('/', (c) =>
    c.html(`
    <!DOCTYPE html><html>
      <body>
        <h1>Dev Mode</h1>
        <a href="http://localhost:4200" target="_blank">Go to Angular Started App</a>
      </body>
    </html>
  `),
  );
}

async function runProdUI(app: Hono) {
  app.get('*', async (c) => {
    const path = c.req.path;

    if (path === '/api' || path.startsWith('/api/')) {
      return c.json({ error: 'Not Found' }, 404);
    }

    if (path === '/' || !extname(path)) {
      return serveFile(UI_INDEX_FILE);
    }

    const requestedPath = resolve(UI_DIST_BROWSER_DIR, `.${path}`);
    const distPrefix = `${UI_DIST_BROWSER_DIR}${sep}`;

    if (requestedPath !== UI_DIST_BROWSER_DIR && !requestedPath.startsWith(distPrefix)) {
      return c.text('Forbidden', 403);
    }

    const staticResponse = await serveFile(requestedPath);

    if (staticResponse.status === 404) {
      return c.text('Not Found', 404);
    }

    return staticResponse;
  });
}

async function serveFile(filePath: string): Promise<Response> {
  try {
    const content = await readFile(filePath);
    const contentType = MIME_BY_EXT[extname(filePath)] ?? 'application/octet-stream';

    return new Response(content, {
      status: 200,
      headers: {
        'content-type': contentType,
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
