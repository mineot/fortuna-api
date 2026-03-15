import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { indexRoute } from './routes';

export async function runServer() {
  // Create app
  const app = new Hono();
  const port = 3000;

  // Register routes
  await indexRoute(app);

  // Start server
  serve({ fetch: app.fetch, port });

  // Log
  console.log(`Server running at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop');
}
