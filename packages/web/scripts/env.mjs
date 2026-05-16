import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const generatedEnvPath = resolve(projectRoot, 'src/app/core/config/generated-env.ts');

const DEFAULT_ENV = 'DEV';
const DEFAULT_WEB_PORT = 4200;
const DEFAULT_API_PORT = 3000;

const requiredProdKeys = [
  'FORTUNA_WEB_PORT',
  'FORTUNA_API_PORT',
  'FORTUNA_WEB_URL',
  'FORTUNA_API_BASE_URL',
];

const readValue = (key) => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
};

const parsePort = (value, key) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`[env] ${key} must be a valid TCP port (1-65535). Received "${value}".`);
  }

  return parsed;
};

const getFortunaEnv = () => {
  const env = (readValue('FORTUNA_ENV') ?? DEFAULT_ENV).toUpperCase();

  if (env !== 'DEV' && env !== 'PROD') {
    throw new Error(`[env] FORTUNA_ENV must be DEV or PROD. Received "${env}".`);
  }

  return env;
};

const resolveRuntimeEnv = () => {
  const fortunaEnv = getFortunaEnv();

  if (fortunaEnv === 'PROD') {
    const missing = requiredProdKeys.filter((key) => !readValue(key));
    if (missing.length > 0) {
      throw new Error(
        `[env] Missing required PROD variables: ${missing.join(', ')}. ` +
          'Define them in environment before starting/building the web app.',
      );
    }
  }

  const webPort = readValue('FORTUNA_WEB_PORT')
    ? parsePort(readValue('FORTUNA_WEB_PORT'), 'FORTUNA_WEB_PORT')
    : DEFAULT_WEB_PORT;
  const apiPort = readValue('FORTUNA_API_PORT')
    ? parsePort(readValue('FORTUNA_API_PORT'), 'FORTUNA_API_PORT')
    : DEFAULT_API_PORT;
  const webUrl = readValue('FORTUNA_WEB_URL') ?? `http://localhost:${webPort}`;
  const apiBaseUrl = readValue('FORTUNA_API_BASE_URL') ?? `http://localhost:${apiPort}/api/v1`;

  return {
    fortunaEnv,
    webPort,
    apiPort,
    webUrl,
    apiBaseUrl,
  };
};

const writeGeneratedEnv = (runtimeEnv) => {
  const content = `export type FortunaEnv = 'DEV' | 'PROD';

export interface GeneratedEnv {
  fortunaEnv: FortunaEnv;
  webPort: number;
  apiPort: number;
  webUrl: string;
  apiBaseUrl: string;
}

export const generatedEnv: GeneratedEnv = ${JSON.stringify(runtimeEnv, null, 2)} as const;
`;

  writeFileSync(generatedEnvPath, content, 'utf8');
};

export const prepareWebEnvironment = () => {
  const runtimeEnv = resolveRuntimeEnv();
  writeGeneratedEnv(runtimeEnv);
  return runtimeEnv;
};
