import { serve } from '@hono/node-server';

import { createApp } from './app.js';
import { getApiEnvironment } from './lib/env.js';

const { port } = getApiEnvironment();
const app = createApp();

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`[api] listening on http://localhost:${info.port}`);
  },
);
