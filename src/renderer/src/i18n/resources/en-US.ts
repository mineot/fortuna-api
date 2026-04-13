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
      searchPlaceholder: 'Search by group or name',
      headers: {
        group: 'Group',
        value: 'Value',
        actions: 'Actions',
      },
      actions: {
        new: 'New',
        save: 'Save',
        cancel: 'Cancel',
        remove: 'Remove',
      },
      errors: {
        load: 'Unknown error while loading types',
      },
    },
  },
} as const;
