import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    bundle: "src/main.ts",
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
