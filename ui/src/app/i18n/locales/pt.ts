import type { TranslationSchema } from '../language.types';

export const pt = {
  common: {
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    menu: 'Menu',
    save: 'Salvar',
    title: 'Título',
  },
  home: {
    title: 'Principal',
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
