import { spawn } from 'node:child_process';
import { platform } from 'node:os';

import { prepareWebEnvironment } from './env.mjs';

prepareWebEnvironment();
const tscBin = platform() === 'win32' ? 'tsc.cmd' : 'tsc';

const child = spawn(tscBin, ['-p', 'tsconfig.app.json', '--noEmit'], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
