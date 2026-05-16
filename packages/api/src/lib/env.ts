const DEFAULT_PORT = 3000;
const DEFAULT_FORTUNA_ENV = 'DEV';

const toPort = (value: string | undefined): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    return DEFAULT_PORT;
  }

  return parsed;
};

export interface ApiEnvironment {
  fortunaEnv: string;
  port: number;
}

export const getApiEnvironment = (): ApiEnvironment => ({
  fortunaEnv: process.env.FORTUNA_ENV ?? DEFAULT_FORTUNA_ENV,
  port: toPort(process.env.PORT),
});
