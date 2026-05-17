#!/usr/bin/env node
import { runCli } from './runtime/run-cli.js';

async function main(): Promise<void> {
  const result = await runCli({
    argv: process.argv.slice(2),
    env: process.env as Record<string, string | undefined>
  });

  if (result.output) {
    if (result.exitCode === 0) {
      console.log(result.output);
    } else {
      console.error(result.output);
    }
  }

  process.exitCode = result.exitCode;
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : 'Unexpected CLI runtime error';
  console.error(message);
  process.exitCode = 1;
});

