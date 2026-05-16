import { getMigrationStatus, reconcileMigrations } from './runner';

const parseTargetVersionArg = (): string | undefined => {
  const targetArg = process.argv.find((arg) => arg.startsWith('--target='));

  if (!targetArg) {
    return undefined;
  }

  return targetArg.slice('--target='.length).trim() || undefined;
};

const command = process.argv[2] === 'status' ? 'status' : 'reconcile';
const targetVersion = parseTargetVersionArg();
const options = targetVersion ? { targetVersion } : {};

if (command === 'status') {
  const status = await getMigrationStatus(options);

  console.log(`target_version=${status.targetVersion}`);
  console.log(`applied=${status.applied.length ? status.applied.join(',') : '(none)'}`);
  console.log(`pending_up=${status.pendingUp.length ? status.pendingUp.join(',') : '(none)'}`);
  console.log(`pending_down=${status.pendingDown.length ? status.pendingDown.join(',') : '(none)'}`);
} else {
  const report = await reconcileMigrations(options);

  console.log(`target_version=${report.targetVersion}`);
  console.log(`applied=${report.applied.length ? report.applied.join(',') : '(none)'}`);
  console.log(`rolled_back=${report.rolledBack.length ? report.rolledBack.join(',') : '(none)'}`);
}
