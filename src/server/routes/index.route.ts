import { Hono } from 'hono';

export async function indexRoute(app: Hono) {
  const env = process.env.FORTUNA_ENV;

  if (env === 'dev') {
    await runDevUI(app);
  } else {
    await runProdUI(app);
  }
}

async function runDevUI(app: Hono) {
  app.get('/', (c) => c.redirect('http://localhost:4200', 302));
}

async function runProdUI(app: Hono) {
  app.get('/', (c) => c.text('Prod'));
}
