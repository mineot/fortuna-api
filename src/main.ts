import { Hono } from 'hono';
import { initDb, type DB } from './database/db';
import { serve } from '@hono/node-server';

const db: DB = initDb();
const app: Hono = new Hono();

app.get('/', (c) => {
  console.log(db);
  return c.text('Hello Hono!');
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
