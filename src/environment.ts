export type FortunaEnv = 'dev' | 'prod';

export function getEnvironment(): FortunaEnv {
  const env = process.env.FORTUNA_ENV;
  return env === 'dev' ? 'dev' : 'prod';
}
