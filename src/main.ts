import { closeDatabase, initDatabase } from "./database";

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`Received ${signal}. Shutting down...`);

  try {
    await closeDatabase();
  } catch (error) {
    console.error("Failed to close database cleanly:", error);
  }
}

process.once("SIGINT", () => {
  shutdown("SIGINT")
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
});

process.once("SIGTERM", () => {
  shutdown("SIGTERM")
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
});

process.once("beforeExit", () => {
  void closeDatabase();
});

async function bootstrap() {
  await initDatabase();
  console.log("Fortuna Initiated");
}

bootstrap().catch((error) => {
  console.error("Fortuna bootstrap failed:", error);
  shutdown("bootstrap-error")
    .finally(() => {
      process.exit(1);
    })
    .catch(() => process.exit(1));
});
