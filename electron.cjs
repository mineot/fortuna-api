const path = require('node:path');

const isDev = process.env.NODE_ENV === 'development';
const entry = isDev
  ? path.join(__dirname, 'dist-dev/main.cjs')
  : path.join(__dirname, 'dist/main.cjs');

require(entry);
