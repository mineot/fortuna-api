const DEFAULT_FORTUNA_ENV = 'DEV';
const DEFAULT_WEB_PORT = 4200;
const DEFAULT_API_PORT = 3000;
const DEFAULT_WEB_URL = `http://localhost:${DEFAULT_WEB_PORT}`;
const DEFAULT_API_BASE_URL = `http://localhost:${DEFAULT_API_PORT}/api/v1`;

const REQUIRED_PROD_KEYS = [
  'FORTUNA_WEB_PORT',
  'FORTUNA_API_PORT',
  'FORTUNA_WEB_URL',
  'FORTUNA_API_BASE_URL',
] as const;

type RequiredProdKey = (typeof REQUIRED_PROD_KEYS)[number];

const readValue = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
};

const parsePort = (value: string, key: string): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`[env] ${key} must be a valid TCP port (1-65535). Received "${value}".`);
  }

  return parsed;
};

const getFortunaEnv = (): 'DEV' | 'PROD' => {
  const value = (readValue('FORTUNA_ENV') ?? DEFAULT_FORTUNA_ENV).toUpperCase();

  if (value !== 'DEV' && value !== 'PROD') {
    throw new Error(`[env] FORTUNA_ENV must be DEV or PROD. Received "${value}".`);
  }

  return value;
};

const assertRequiredProdValues = (): Record<RequiredProdKey, string> => {
  const values = {} as Record<RequiredProdKey, string>;
  const missing: string[] = [];

  for (const key of REQUIRED_PROD_KEYS) {
    const value = readValue(key);

    if (!value) {
      missing.push(key);
      continue;
    }

    values[key] = value;
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required PROD variables: ${missing.join(', ')}. ` +
        'Define them in environment before starting the app.',
    );
  }

  return values;
};

export interface ApiEnvironment {
  fortunaEnv: 'DEV' | 'PROD';
  port: number;
  webPort: number;
  webUrl: string;
  apiBaseUrl: string;
}

export const getApiEnvironment = (): ApiEnvironment => {
  const fortunaEnv = getFortunaEnv();

  if (fortunaEnv === 'PROD') {
    const prod = assertRequiredProdValues();

    return {
      fortunaEnv,
      webPort: parsePort(prod.FORTUNA_WEB_PORT, 'FORTUNA_WEB_PORT'),
      port: parsePort(prod.FORTUNA_API_PORT, 'FORTUNA_API_PORT'),
      webUrl: prod.FORTUNA_WEB_URL,
      apiBaseUrl: prod.FORTUNA_API_BASE_URL,
    };
  }

  const webPort = readValue('FORTUNA_WEB_PORT')
    ? parsePort(readValue('FORTUNA_WEB_PORT') as string, 'FORTUNA_WEB_PORT')
    : DEFAULT_WEB_PORT;
  const apiPort = readValue('FORTUNA_API_PORT')
    ? parsePort(readValue('FORTUNA_API_PORT') as string, 'FORTUNA_API_PORT')
    : DEFAULT_API_PORT;

  return {
    fortunaEnv,
    webPort,
    port: apiPort,
    webUrl: readValue('FORTUNA_WEB_URL') ?? DEFAULT_WEB_URL,
    apiBaseUrl: readValue('FORTUNA_API_BASE_URL') ?? DEFAULT_API_BASE_URL,
  };
};
