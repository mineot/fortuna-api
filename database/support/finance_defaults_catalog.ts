export const accountTypeDefaults = [
  {
    name: 'Cash',
    description: 'Physical cash wallet',
  },
  {
    name: 'Checking',
    description: 'Bank checking account',
  },
  {
    name: 'Savings',
    description: 'Bank savings account',
  },
  {
    name: 'Credit Card',
    description: 'Credit card account',
  },
] as const;

export const categoryGroupDefaults = [
  {
    termKey: 'category_group.income.name',
    position: 0,
    enUS: 'Income',
    ptBR: 'Receitas',
  },
  {
    termKey: 'category_group.fixed_expenses.name',
    position: 1,
    enUS: 'Fixed Expenses',
    ptBR: 'Despesas fixas',
  },
  {
    termKey: 'category_group.variable_expenses.name',
    position: 2,
    enUS: 'Variable Expenses',
    ptBR: 'Despesas variáveis',
  },
] as const;

export const categoryDefaults = [
  {
    groupTermKey: 'category_group.income.name',
    termKey: 'category.salary.name',
    type: 'income',
    color: '#198754',
    icon: 'cash-stack',
    position: 0,
    enUS: 'Salary',
    ptBR: 'Salário',
  },
  {
    groupTermKey: 'category_group.income.name',
    termKey: 'category.freelance.name',
    type: 'income',
    color: '#20c997',
    icon: 'briefcase',
    position: 1,
    enUS: 'Freelance',
    ptBR: 'Freelance',
  },
  {
    groupTermKey: 'category_group.fixed_expenses.name',
    termKey: 'category.rent.name',
    type: 'expense',
    color: '#dc3545',
    icon: 'house-door',
    position: 0,
    enUS: 'Rent',
    ptBR: 'Aluguel',
  },
  {
    groupTermKey: 'category_group.fixed_expenses.name',
    termKey: 'category.utilities.name',
    type: 'expense',
    color: '#fd7e14',
    icon: 'lightning-charge',
    position: 1,
    enUS: 'Utilities',
    ptBR: 'Contas',
  },
  {
    groupTermKey: 'category_group.variable_expenses.name',
    termKey: 'category.groceries.name',
    type: 'expense',
    color: '#0d6efd',
    icon: 'basket',
    position: 0,
    enUS: 'Groceries',
    ptBR: 'Supermercado',
  },
  {
    groupTermKey: 'category_group.variable_expenses.name',
    termKey: 'category.transport.name',
    type: 'expense',
    color: '#6f42c1',
    icon: 'car-front',
    position: 1,
    enUS: 'Transport',
    ptBR: 'Transporte',
  },
] as const;
