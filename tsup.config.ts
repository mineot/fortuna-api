import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    bundle: "src/main.ts",
    fortuna: "cli.js",
  },
  format: ["cjs"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  minify: true,
  splitting: false,
  sourcemap: false,
  dts: false,
});
