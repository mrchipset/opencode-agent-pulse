/**
 * Post-build sourcemap fixer.
 *
 * bun build emits `sources` entries relative to the build cwd (e.g. `src\tui.ts`
 * with Windows backslashes). The bun debugger resolves sourcemap `sources`
 * against the script's own directory (dist/), so those paths point nowhere and
 * breakpoints in `src/*.ts` cannot bind.
 *
 * This script rewrites every inline sourcemap in dist/*.js to use absolute,
 * forward-slash source paths, so the debugger (and VS Code) resolve them to the
 * real files on disk.
 *
 * Usage: after `bun run build`, run `bun run scripts/fix-sourcemaps.ts`.
 * Wired in as the `build:fixmaps` step of the `build` script.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const files = (await readdir(dist)).filter((f) => f.endsWith(".js"));

let fixed = 0;
for (const file of files) {
  const filePath = path.join(dist, file);
  const content = await readFile(filePath, "utf8");
  const marker = "sourceMappingURL=data:application/json;base64,";
  const match = content.match(/sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)/);
  if (!match) continue;

  const map = JSON.parse(Buffer.from(match[1], "base64").toString("utf8"));
  map.sources = map.sources.map((source: string) => {
    // bun emits sources relative to the build cwd (project root). Resolve against
    // the project root so the absolute path points at the real file.
    const absolute = path.resolve(root, source).replace(/\\/g, "/");
    return "file:///" + absolute.replace(/^\//, "");
  });

  const encoded = Buffer.from(JSON.stringify(map), "utf8").toString("base64");
  const patched = content.replace(marker + match[1], marker + encoded);
  await writeFile(filePath, patched, "utf8");
  fixed++;
  console.log(`fixed sourcemaps: ${file}`);
}

console.log(`done. ${fixed} bundle(s) patched with absolute source paths.`);
