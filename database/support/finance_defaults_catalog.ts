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
    name: 'Salary',
    type: 'income',
    color: '#198754',
    icon: 'cash-stack',
    position: 0,
  },
  {
    groupName: 'Income',
    name: 'Freelance',
    type: 'income',
    color: '#20c997',
    icon: 'briefcase',
    position: 1,
  },
  {
    groupName: 'Fixed Expenses',
    name: 'Rent',
    type: 'expense',
    color: '#dc3545',
    icon: 'house-door',
    position: 0,
  },
  {
    groupName: 'Fixed Expenses',
    name: 'Utilities',
    type: 'expense',
    color: '#fd7e14',
    icon: 'lightning-charge',
    position: 1,
  },
  {
    groupName: 'Variable Expenses',
    name: 'Groceries',
    type: 'expense',
    color: '#0d6efd',
    icon: 'basket',
    position: 0,
  },
  {
    groupName: 'Variable Expenses',
    name: 'Transport',
    type: 'expense',
    color: '#6f42c1',
    icon: 'car-front',
    position: 1,
  },
] as const;
