/**
 * Windows-only live terminal focus detection.
 *
 * Background: on Windows the renderer's focus/blur events (DEC 1004 focus reporting via
 * ConPTY) are unreliable — the focus-in sequence may arrive at startup while the
 * focus-out never does, which leaves the plugin stuck believing the terminal is focused
 * and suppressing every notification. We therefore bypass the event stream on Windows
 * and query the foreground window directly:
 *
 *   - The window of the terminal hosting this plugin belongs to a process that is an
 *     ancestor of our own process (e.g. Windows Terminal -> shell -> opencode).
 *   - When that terminal is focused, the foreground window's owning PID is in our
 *     ancestor chain.
 *   - When the user switches to another app, the foreground PID is not an ancestor.
 *
 * Two backends are used:
 *   - `bun:ffi` (fast, synchronous) when the runtime supports it — verified working in
 *     standalone Bun-compiled binaries.
 *   - PowerShell (`GetForegroundWindow` / `Win32_Process`) as a portable fallback that
 *     works in any runtime (Node or Bun) since it only needs `node:child_process`.
 *
 * If neither backend is available the module degrades to "unknown" and the caller falls
 * back to the renderer event state.
 */

import { spawn } from "node:child_process";

const IS_WINDOWS = process.platform === "win32";

// 568 bytes = sizeof(PROCESSENTRY32W) on x64 (ULONG_PTR field forces 8-byte alignment).
// Wrong dwSize makes Process32FirstW fail with ERROR_BAD_LENGTH, which we treat as
// "unknown" and fall back gracefully.
const PROCESSENTRY32W_SIZE = 568;
const OFFSET_TH32_PROCESS_ID = 8;
const OFFSET_TH32_PARENT_PROCESS_ID = 32;

type Backend = "ffi" | "powershell" | "none";

let backend: Backend = "none";
let ancestors = new Set<number>();
let ffiForegroundPid: (() => number | undefined) | undefined;

// Live status surface, rendered into the sidebar for debugging the focus gate.
export type FocusStatus = {
  backend: Backend;
  ancestorCount: number;
  lastForegroundPid?: number;
  lastResult?: boolean;
  lastError?: string;
};
let status: FocusStatus = { backend: "none", ancestorCount: 0 };
export function getFocusStatus(): FocusStatus {
  return status;
}

function runPowerShell(script: string, timeoutMs = 8000): Promise<string> {
  return new Promise((resolve) => {
    let out = "";
    let child;
    try {
      child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch {
      resolve("");
      return;
    }
    const timer = setTimeout(() => {
      try {
        child.kill();
      } catch {}
      resolve("");
    }, timeoutMs);
    child.stdout?.on("data", (chunk: Buffer) => {
      out += chunk.toString();
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve("");
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(out.trim());
    });
  });
}

/** Compute our ancestor PID chain via PowerShell (Win32_Process parent walk). */
async function ancestorsViaPowerShell(): Promise<Set<number>> {
  const selfPid = process.pid;
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
$pidChain = @(${selfPid})
$cur = ${selfPid}
for ($i = 0; $i -lt 32 -and $cur -gt 0; $i++) {
  $p = Get-CimInstance Win32_Process -Filter "ProcessId=$cur"
  if (-not $p) { break }
  $next = $p.ParentProcessId
  if ($next -eq $cur -or $next -le 0) { break }
  $cur = $next
  $pidChain += $cur
}
$pidChain -join ','
`;
  const result = await runPowerShell(script);
  const pids = new Set<number>();
  for (const part of result.split(",")) {
    const n = parseInt(part, 10);
    if (Number.isFinite(n) && n > 0) pids.add(n);
  }
  return pids;
}

/** Foreground window owning PID via PowerShell (user32 GetForegroundWindow). */
async function foregroundPidViaPowerShell(): Promise<number | undefined> {
  const script = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class PulseFocus {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")]
  public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
}
'@
$h = [PulseFocus]::GetForegroundWindow()
$p = [uint32]0
[void][PulseFocus]::GetWindowThreadProcessId($h, [ref]$p)
$p
`;
  const result = await runPowerShell(script);
  const n = parseInt(result, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Try the fast bun:ffi backend. Returns true when fully initialized. */
async function initFfiBackend(): Promise<boolean> {
  try {
    const { dlopen, ptr } = await import("bun:ffi");
    const user32 = dlopen("user32.dll", {
      GetForegroundWindow: { args: [], returns: "ptr" },
      GetWindowThreadProcessId: { args: ["ptr", "ptr"], returns: "u32" },
    });
    const kernel32 = dlopen("kernel32.dll", {
      GetCurrentProcessId: { args: [], returns: "u32" },
      CreateToolhelp32Snapshot: { args: ["u32", "u32"], returns: "ptr" },
      Process32FirstW: { args: ["ptr", "ptr"], returns: "i32" },
      Process32NextW: { args: ["ptr", "ptr"], returns: "i32" },
      CloseHandle: { args: ["ptr"], returns: "i32" },
    });

    const TH32CS_SNAPPROCESS = 0x2;
    const snapshot = kernel32.symbols.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (!snapshot) {
      return false;
    }
    try {
      const entry = new Uint8Array(PROCESSENTRY32W_SIZE);
      const view = new DataView(entry.buffer);
      view.setUint32(0, PROCESSENTRY32W_SIZE, true); // dwSize

      const parent = new Map<number, number>();
      let ok = kernel32.symbols.Process32FirstW(snapshot, ptr(entry));
      while (ok) {
        const pid = view.getUint32(OFFSET_TH32_PROCESS_ID, true);
        const ppid = view.getUint32(OFFSET_TH32_PARENT_PROCESS_ID, true);
        if (pid !== 0) parent.set(pid, ppid);
        ok = kernel32.symbols.Process32NextW(snapshot, ptr(entry));
      }

      const self = kernel32.symbols.GetCurrentProcessId();
      let current = self;
      for (let depth = 0; depth < 32 && current; depth++) {
        ancestors.add(current);
        const next = parent.get(current);
        if (next === undefined || next === current) break;
        current = next;
      }
    } finally {
      kernel32.symbols.CloseHandle(snapshot);
    }

    ffiForegroundPid = () => {
      const hwnd = user32.symbols.GetForegroundWindow();
      if (!hwnd) return undefined;
      const pidBuf = new Uint32Array(1);
      user32.symbols.GetWindowThreadProcessId(hwnd, ptr(pidBuf));
      return pidBuf[0];
    };

    status = { backend: "ffi", ancestorCount: ancestors.size };
    return ancestors.size > 0;
  } catch (error) {
    status = { ...status, lastError: String(error) };
    return false;
  }
}

let initPromise: Promise<void> | undefined;
export function ensureWindowsFocusInit(): void {
  if (!IS_WINDOWS) return;
  initPromise ??= (async () => {
    if (await initFfiBackend()) {
      backend = "ffi";
      status = { ...status, backend: "ffi" };
      return;
    }
    ancestors = await ancestorsViaPowerShell();
    if (ancestors.size > 0) {
      backend = "powershell";
      status = { backend: "powershell", ancestorCount: ancestors.size };
    } else {
      backend = "none";
      status = { backend: "none", ancestorCount: 0, lastError: "no ancestor chain" };
    }
  })();
  void initPromise;
}

/**
 * True when the terminal window currently has focus, false when the foreground window
 * belongs to a different process, undefined when the check is unavailable.
 */
export async function isTerminalFocused(): Promise<boolean | undefined> {
  if (!IS_WINDOWS || backend === "none") {
    return undefined;
  }
  if (backend === "ffi" && ffiForegroundPid) {
    const foreground = ffiForegroundPid();
    const result = foreground !== undefined ? ancestors.has(foreground) : undefined;
    status = { ...status, lastForegroundPid: foreground, lastResult: result };
    return result;
  }
  const foreground = await foregroundPidViaPowerShell();
  const result = foreground !== undefined ? ancestors.has(foreground) : undefined;
  status = { ...status, lastForegroundPid: foreground, lastResult: result };
  return result;
}
