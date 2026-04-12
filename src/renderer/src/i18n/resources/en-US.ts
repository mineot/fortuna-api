export const enUS = {
  app: {
    title: 'Fortuna',
    nav: {
      home: 'Home',
      types: 'Types',
    },
    language: {
      label: 'Language',
      enUS: 'en-US',
      ptBR: 'pt-BR',
    },
  },
  pages: {
    home: {
      title: 'Home',
      description: 'Fortuna renderer is running with React.',
    },
    types: {
      title: 'Types',
      empty: 'No data yet',
      headers: {
        id: 'ID',
        group: 'Group',
        value: 'Value',
      },
      errors: {
        load: 'Unknown error while loading types',
      },
    },
  },
} as const;
