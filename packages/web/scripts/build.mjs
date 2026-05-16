import { spawn } from 'node:child_process';
import { platform } from 'node:os';

import { prepareWebEnvironment } from './env.mjs';

prepareWebEnvironment();
const ngBin = platform() === 'win32' ? 'ng.cmd' : 'ng';

const child = spawn(ngBin, ['build'], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
