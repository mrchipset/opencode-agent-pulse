// One-off script: pre-render the OpenCode logo SVG into a PNG asset.
// Run with: bun run scripts/gen-icon.ts
// The resulting PNG is embedded as base64 in src/notification.ts (build-time, not runtime).
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `<svg width='32' height='40' viewBox='0 0 32 40' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_1311_94969)'><path d='M24 32H8V16H24V32Z' fill='#BCBBBB'/><path d='M24 8H8V32H24V8ZM32 40H0V0H32V40Z' fill='#211E1E'/></g><defs><clipPath id='clip0_1311_94969'><rect width='32' height='40' fill='white'/></clipPath></defs></svg>`;

// Render at 256x320 (keeping the 32:40 aspect ratio) for a crisp toast icon.
const png = await sharp(Buffer.from(svg)).resize(256, 320).png().toBuffer();

const out = join(__dirname, "..", "assets", "opencode.png");
writeFileSync(out, png);
console.log("wrote", out, png.length, "bytes");
console.log("base64 length:", png.toString("base64").length);
