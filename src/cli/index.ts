import { program } from 'commander';
import pkg from '../../package.json';

export async function runCli(): Promise<void> {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program
    .command('ui')
    .description(
      'Opens the financial control web interface in your browser for managing and editing your finances.',
    )
    .action((name: string, options: unknown) => {
      console.log(name, options);
    });

  program.parse();
}
