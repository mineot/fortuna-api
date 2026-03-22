const fs = require("node:fs");
const path = require("node:path");

const sourceDir = path.join(process.cwd(), "ui", "dist", "fortuna", "browser");
const targetDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(sourceDir)) {
  console.error(`Pasta de origem não encontrada: ${sourceDir}`);
  process.exit(1);
}

fs.cpSync(sourceDir, targetDir, {
  recursive: true,
  force: true,
});
