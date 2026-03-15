import { Hono } from 'hono';

export async function indexRoute(app: Hono) {
  const env = process.env.FORTUNA_ENV;
  if (env === 'dev') {
    app.get('/', (c) => c.text('DEV'));
  } else {
    app.get('/', (c) => c.text('Prod'));
  }
}
