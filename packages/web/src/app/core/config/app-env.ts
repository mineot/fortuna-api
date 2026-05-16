import { generatedEnv } from './generated-env.js';

export interface AppEnv {
  fortunaEnv: 'DEV' | 'PROD';
  webPort: number;
  apiPort: number;
  webUrl: string;
  apiBaseUrl: string;
}

export const appEnv: AppEnv = generatedEnv;
