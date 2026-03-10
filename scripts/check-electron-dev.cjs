const fs = require('node:fs');
const path = require('node:path');

const files = [
  path.join(process.cwd(), 'dist-dev/main.cjs'),
  path.join(process.cwd(), 'dist-dev/preload.cjs'),
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Missing dev artifact: ${file}`);
    process.exit(1);
  }
}
