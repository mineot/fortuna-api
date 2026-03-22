const { spawn } = require("child_process");
const electron = require("electron");
const path = require("path");

const bundlePath = path.join(__dirname, "bundle.js");

const args = [bundlePath, "--no-sandbox"];

const child = spawn(electron, args, {
  stdio: "inherit",
  windowsHide: false,
});

child.on("close", (code) => {
  process.exit(code);
});
