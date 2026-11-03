import { appendFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * TEMPORARY diagnostic channel (debug builds only).
 *
 * Enabled by the `debug: true` plugin option, or — for field debugging without
 * touching the user's config — by creating the marker file
 * `<tmp>/opencode-agent-pulse-debug.on` before the plugin (re)loads.
 *
 * Appends one line per interesting step to `<tmp>/opencode-agent-pulse-diag.log`
 * so a bug report can show whether setup ran, which events arrived, and how the
 * notification dispatch resolved.
 */
const MARKER = join(tmpdir(), "opencode-agent-pulse-debug.on");
export const DIAG_FILE = join(tmpdir(), "opencode-agent-pulse-diag.log");

let enabled = false;

export function initDiag(option?: boolean): void {
  enabled = option === true || existsSync(MARKER);
  if (enabled) diag("diag enabled", { pid: process.pid, option: option === true, marker: existsSync(MARKER) });
}

export function diagEnabled(): boolean {
  return enabled;
}

export function diag(event: string, data?: Record<string, unknown>): void {
  if (!enabled) return;
  try {
    appendFileSync(DIAG_FILE, `${new Date().toISOString()} pid=${process.pid} ${event}${data ? " " + JSON.stringify(data) : ""}\n`);
  } catch {
    // diagnostics must never break the plugin
  }
}
