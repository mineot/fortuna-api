import type { TranslationSchema } from '../language.types';

export const pt = {
  app: {
    title: 'Fortuna BR',
  },
  common: {
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    save: 'Salvar',
    title: 'Título',
  },
  home: {
    title: 'Principal',
  },
  configs: {
    title: 'Configurações',
    languages: {
      english: 'Inglês',
      portuguese: 'Português',
      title: 'Idiomas',
    },
  },
  registers: {
    title: 'Cadastros',
    types: {
      create: 'Criar tipo',
      empty: 'Nenhum tipo encontrado',
      name: 'Nome',
      title: 'Tipos',
    },
  },
} satisfies TranslationSchema;
