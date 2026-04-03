import type { TranslationSchema } from '../language.types';

export const pt = {
  common: {
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    save: 'Salvar',
    title: 'Título',
    menu: 'Menu',
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
      title: 'Cadastro de Tipos',
    },
  },
} satisfies TranslationSchema;
