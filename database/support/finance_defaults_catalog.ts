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
    name: 'Income',
    position: 0,
  },
  {
    name: 'Fixed Expenses',
    position: 1,
  },
  {
    name: 'Variable Expenses',
    position: 2,
  },
] as const;

export const categoryDefaults = [
  {
    groupName: 'Income',
    termKey: 'category.salary.name',
    type: 'income',
    color: '#198754',
    icon: 'cash-stack',
    position: 0,
    enUS: 'Salary',
    ptBR: 'Salário',
  },
  {
    groupName: 'Income',
    termKey: 'category.freelance.name',
    type: 'income',
    color: '#20c997',
    icon: 'briefcase',
    position: 1,
    enUS: 'Freelance',
    ptBR: 'Freelance',
  },
  {
    groupName: 'Fixed Expenses',
    termKey: 'category.rent.name',
    type: 'expense',
    color: '#dc3545',
    icon: 'house-door',
    position: 0,
    enUS: 'Rent',
    ptBR: 'Aluguel',
  },
  {
    groupName: 'Fixed Expenses',
    termKey: 'category.utilities.name',
    type: 'expense',
    color: '#fd7e14',
    icon: 'lightning-charge',
    position: 1,
    enUS: 'Utilities',
    ptBR: 'Contas',
  },
  {
    groupName: 'Variable Expenses',
    termKey: 'category.groceries.name',
    type: 'expense',
    color: '#0d6efd',
    icon: 'basket',
    position: 0,
    enUS: 'Groceries',
    ptBR: 'Supermercado',
  },
  {
    groupName: 'Variable Expenses',
    termKey: 'category.transport.name',
    type: 'expense',
    color: '#6f42c1',
    icon: 'car-front',
    position: 1,
    enUS: 'Transport',
    ptBR: 'Transporte',
  },
] as const;
