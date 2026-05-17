export interface ParsedArgv {
  command: string | null;
  commandArgs: string[];
}

function isFlag(arg: string): boolean {
  return arg.startsWith('-');
}

export function parseArgv(argv: readonly string[]): ParsedArgv {
  const args = [...argv];
  let index = 0;

  while (index < args.length) {
    const current = args[index];
    if (!current || !isFlag(current)) {
      break;
    }
    const next = args[index + 1];
    if ((current === '--mode' || current === '--output') && next && !isFlag(next)) {
      index += 2;
      continue;
    }
    index += 1;
  }

  const first = args[index];
  const second = args[index + 1];

  if (!first) {
    return { command: null, commandArgs: [] };
  }

  if (second && !isFlag(second)) {
    const command = `${first} ${second}`;
    return { command, commandArgs: args.slice(index + 2) };
  }

  return { command: first, commandArgs: args.slice(index + 1) };
}
