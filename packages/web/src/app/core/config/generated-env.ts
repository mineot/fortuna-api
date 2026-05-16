export type FortunaEnv = 'DEV' | 'PROD';

export interface GeneratedEnv {
  fortunaEnv: FortunaEnv;
  webPort: number;
  apiPort: number;
  webUrl: string;
  apiBaseUrl: string;
}

export const generatedEnv: GeneratedEnv = {
  "fortunaEnv": "DEV",
  "webPort": 4200,
  "apiPort": 3000,
  "webUrl": "http://localhost:4200",
  "apiBaseUrl": "http://localhost:3000/api/v1"
} as const;
