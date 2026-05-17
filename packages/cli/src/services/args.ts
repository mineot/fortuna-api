export function getFlagValue(args: readonly string[], flag: string): string | undefined {
  const index = args.findIndex((arg) => arg === flag);
  if (index < 0) return undefined;
  return args[index + 1];
}

