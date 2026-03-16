import { getEnvironment } from '@env';
import { Hono } from 'hono';

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
  app.get('/', (c) => c.text('Prod'));
}
