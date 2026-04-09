import type { TranslationSchema } from '../language.types';

export const pt = {
  common: {
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    error: 'Erro',
    group: 'Grupo',
    info: 'Informação',
    invalid_form: 'Formulário inválido',
    menu: 'Menu',
    name: 'Nome',
    no: 'Não',
    save: 'Salvar',
    search: 'Pesquisar',
    success: 'Sucesso',
    title: 'Título',
    warning: 'Aviso',
    yes: 'Sim',
  },
  home: {
    title: 'Principal',
  },
  registers: {
    title: 'Cadastros',
    types: {
      create: 'Novo Tipo',
      empty: 'Nenhum tipo encontrado',
      error_create: 'Erro ao criar um novo tipo',
      error_delete: 'Erro ao excluir um tipo',
      error_get: 'Erro ao obter um tipo',
      error_list_all: 'Erro ao listas os tipos',
      error_update: 'Erro ao atualizar um tipo',
      min_group: 'O grupo deve ser maior que 0',
      required_group: 'Grupo é obrigatório',
      required_name: 'Nome é obrigatório',
      success_create: 'Tipo criado com sucesso',
      success_delete: 'Tipo excluído com sucesso',
      success_update: 'Tipo atualizado com sucesso',
      title: 'Cadastro de Tipos',
    },
  },
} satisfies TranslationSchema;
