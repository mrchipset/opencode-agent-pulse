/**
 * Production build.
 *
 * The TUI entry is Solid JSX. OpenCode's host only applies the Solid transform
 * to plugin .tsx/.jsx sources outside node_modules, and a published `dist/*.js`
 * is never transformed. We therefore compile with @opentui/solid's Bun plugin
 * here so the emitted bundle keeps getters/reactive reads instead of eagerly
 * evaluating every prop and child (which would freeze the sidebar).
 */
import solidTransformPlugin from "@opentui/solid/bun-plugin";

const external = [
  "@opencode/plugin",
  "@opencode/plugin/*",
  "@opentui/core",
  "@opentui/core/*",
  "@opentui/solid",
  "@opentui/solid/*",
  "solid-js",
  "solid-js/*",
  "node-notifier",
  "node:*",
];

const result = await Bun.build({
  entrypoints: ["src/index.ts", "src/tui.tsx"],
  outdir: "dist",
  naming: "[name].js",
  target: "bun",
  format: "esm",
  sourcemap: "inline",
  external,
  plugins: [solidTransformPlugin],
});

for (const log of result.logs) {
  console.error(log);
}
if (!result.success) {
  process.exit(1);
}

for (const output of result.outputs) {
  console.log(`${output.path} ${output.size} bytes`);
}
