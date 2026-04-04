import type { TranslationSchema } from '../language.types';

export const pt = {
  common: {
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    error: 'Erro',
    group: 'Grupo',
    info: 'Informação',
    menu: 'Menu',
    name: 'Nome',
    save: 'Salvar',
    search: 'Pesquisar',
    success: 'Sucesso',
    title: 'Título',
    warning: 'Aviso',
  },
  messages: {
    types_error_list_all: 'Erro ao listas os tipos',
    types_error_create: 'Erro ao criar um novo tipo',
    types_error_update: 'Erro ao atualizar um tipo',
    types_error_delete: 'Erro ao excluir um tipo',
  },
  home: {
    title: 'Principal',
  },
  registers: {
    title: 'Cadastros',
    types: {
      create: 'Novo Tipo',
      empty: 'Nenhum tipo encontrado',
      title: 'Cadastro de Tipos',
    },
  },
} satisfies TranslationSchema;
