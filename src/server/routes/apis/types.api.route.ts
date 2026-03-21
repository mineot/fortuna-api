import { Hono } from 'hono';

export const apiTypes = new Hono();

apiTypes.get('/', async (c) => {
  return c.text('Lista de tipos');
});
