declare global {
  interface Window {
    electronApi?: {
      app: {
        getSystemLanguage: () => Promise<string[]>;
      };
    };
  }
}

export {};
