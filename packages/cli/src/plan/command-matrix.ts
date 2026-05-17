export type CliMode = 'local' | 'remote';

export type CliModule =
  | 'auth'
  | 'accounts'
  | 'categories'
  | 'transactions'
  | 'transfers'
  | 'reports'
  | 'credit-cards'
  | 'statement-payments';

export type CliCommandStatus = 'planned' | 'in_progress' | 'implemented';

export type PhaseMilestone = 'M1' | 'M2' | 'M3' | 'M4';

export interface CliCommandSpec {
  module: CliModule;
  command: string;
  description: string;
  modes: CliMode[];
  status: CliCommandStatus;
  milestone: PhaseMilestone;
  flags: string[];
  output: 'human' | 'json' | 'both';
}

export const PHASE_6_COMMAND_MATRIX: ReadonlyArray<CliCommandSpec> = [
  {
    module: 'auth',
    command: 'auth login',
    description: 'Authenticate and persist session token for remote usage.',
    modes: ['remote'],
    status: 'planned',
    milestone: 'M1',
    flags: ['--email', '--password'],
    output: 'both',
  },
  {
    module: 'auth',
    command: 'auth refresh',
    description: 'Refresh current remote access token.',
    modes: ['remote'],
    status: 'planned',
    milestone: 'M1',
    flags: [],
    output: 'both',
  },
  {
    module: 'auth',
    command: 'auth logout',
    description: 'Invalidate/clear current remote session token.',
    modes: ['remote'],
    status: 'planned',
    milestone: 'M1',
    flags: [],
    output: 'both',
  },
  {
    module: 'auth',
    command: 'auth me',
    description: 'Show authenticated user profile from remote API.',
    modes: ['remote'],
    status: 'planned',
    milestone: 'M1',
    flags: [],
    output: 'both',
  },
  {
    module: 'transactions',
    command: 'transactions create',
    description: 'Create a transaction (income or expense).',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M1',
    flags: [
      '--account-id',
      '--category-id',
      '--type',
      '--amount',
      '--date',
      '--description',
      '--status',
      '--payee-id?',
      '--notes?',
    ],
    output: 'both',
  },
  {
    module: 'transactions',
    command: 'transactions list',
    description: 'List transactions with optional filters and pagination.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M1',
    flags: [
      '--account-id?',
      '--category-id?',
      '--type?',
      '--status?',
      '--from?',
      '--to?',
      '--page?',
      '--page-size?',
    ],
    output: 'both',
  },
  {
    module: 'accounts',
    command: 'accounts list',
    description: 'List all user accounts.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: ['--page?', '--page-size?'],
    output: 'both',
  },
  {
    module: 'accounts',
    command: 'accounts create',
    description: 'Create a new account.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: ['--name', '--account-type-id', '--initial-balance', '--notes?'],
    output: 'both',
  },
  {
    module: 'categories',
    command: 'categories list',
    description: 'List categories with optional type filtering.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: ['--type?', '--page?', '--page-size?'],
    output: 'both',
  },
  {
    module: 'categories',
    command: 'categories create',
    description: 'Create a category under a category group.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: ['--name', '--type', '--category-group-id'],
    output: 'both',
  },
  {
    module: 'transfers',
    command: 'transfers create',
    description: 'Create transfer between two different accounts.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: [
      '--source-account-id',
      '--destination-account-id',
      '--amount',
      '--date',
      '--status',
      '--description?',
    ],
    output: 'both',
  },
  {
    module: 'transfers',
    command: 'transfers list',
    description: 'List transfers with optional account/date filters.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M2',
    flags: [
      '--source-account-id?',
      '--destination-account-id?',
      '--status?',
      '--from?',
      '--to?',
      '--page?',
      '--page-size?',
    ],
    output: 'both',
  },
  {
    module: 'reports',
    command: 'reports summary',
    description: 'Show summarized balances and period totals.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M3',
    flags: ['--from?', '--to?'],
    output: 'both',
  },
  {
    module: 'reports',
    command: 'reports account-balances',
    description: 'Show account balances calculated from movements.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M3',
    flags: ['--as-of?'],
    output: 'both',
  },
  {
    module: 'credit-cards',
    command: 'credit-cards list',
    description: 'List registered credit cards.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M3',
    flags: ['--page?', '--page-size?'],
    output: 'both',
  },
  {
    module: 'credit-cards',
    command: 'credit-cards purchase',
    description: 'Register credit-card purchase with installments.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M3',
    flags: [
      '--credit-card-id',
      '--category-id',
      '--total-amount',
      '--installment-count',
      '--purchase-date',
      '--description',
      '--payee-id?',
    ],
    output: 'both',
  },
  {
    module: 'statement-payments',
    command: 'statement-payments create',
    description: 'Register statement payment and generate linked financial transaction.',
    modes: ['local', 'remote'],
    status: 'planned',
    milestone: 'M3',
    flags: ['--credit-card-statement-id', '--account-id', '--amount', '--date', '--category-id'],
    output: 'both',
  },
];

export const PHASE_6_PRIMARY_MODULES: ReadonlyArray<CliModule> = [
  'auth',
  'accounts',
  'categories',
  'transactions',
  'transfers',
  'reports',
  'credit-cards',
  'statement-payments',
];

export function getCommandsByMilestone(milestone: PhaseMilestone): ReadonlyArray<CliCommandSpec> {
  return PHASE_6_COMMAND_MATRIX.filter((command) => command.milestone === milestone);
}
