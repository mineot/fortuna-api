import { Hono } from 'hono';
import { apiTypes } from './apis/types.api.route';

export async function apiRoutes(app: Hono) {
  const api = new Hono();
  api.route('/types', apiTypes);
  app.route('/api', api);
}
