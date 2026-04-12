export const ptBR = {
  app: {
    title: 'Fortuna',
    nav: {
      home: 'Início',
      types: 'Tipos',
    },
    language: {
      label: 'Idioma',
      enUS: 'en-US',
      ptBR: 'pt-BR',
    },
  },
  pages: {
    home: {
      title: 'Início',
      description: 'Renderer do Fortuna está rodando com React.',
    },
    types: {
      title: 'Tipos',
      empty: 'Sem dados por enquanto',
      headers: {
        id: 'ID',
        group: 'Grupo',
        value: 'Valor',
      },
      errors: {
        load: 'Erro desconhecido ao carregar tipos',
      },
    },
  },
} as const;
