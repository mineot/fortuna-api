import { runSeeds, type SeedMode } from './runner';

const SUPPORTED_SEED_MODES: readonly SeedMode[] = ['all', 'account-types', 'categories'];

const parseMode = (): SeedMode => {
  const firstArg = process.argv[2];

  if (!firstArg || firstArg.startsWith('--')) {
    return 'all';
  }

  if (SUPPORTED_SEED_MODES.includes(firstArg as SeedMode)) {
    return firstArg as SeedMode;
  }

  throw new Error(
    `Unknown seed mode "${firstArg}". Supported modes: ${SUPPORTED_SEED_MODES.join(', ')}`,
  );
};

const parseUserId = (): number | undefined => {
  const userIdArg = process.argv.find((arg) => arg.startsWith('--user-id='));

  if (!userIdArg) {
    return undefined;
  }

  const parsedUserId = Number(userIdArg.slice('--user-id='.length));

  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error(`Invalid --user-id value: "${userIdArg}". Expected a positive integer.`);
  }

  return parsedUserId;
};

const mode = parseMode();
const userId = parseUserId();

const report = await runSeeds(userId ? { mode, userId } : { mode });

console.log(`mode=${report.mode}`);
console.log(`account_types_inserted=${report.accountTypesInserted}`);
console.log(`category_groups_inserted=${report.categoryGroupsInserted}`);
console.log(`categories_inserted=${report.categoriesInserted}`);
