// @bun
var __require = import.meta.require;

// src/tui.tsx
import { createComponent as _$createComponent } from "@opentui/solid";
import { effect as _$effect } from "@opentui/solid";
import { createTextNode as _$createTextNode } from "@opentui/solid";
import { insertNode as _$insertNode } from "@opentui/solid";
import { insert as _$insert } from "@opentui/solid";
import { memo as _$memo } from "@opentui/solid";
import { setProp as _$setProp } from "@opentui/solid";
import { createElement as _$createElement } from "@opentui/solid";
import { Plugin } from "@opencode/plugin/tui";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";

// src/i18n.ts
var dictionaries = {
  en: {
    subagents: "Subagents",
    subagentsDone: (count) => count > 1 ? `All ${count} subagents completed` : "Subagent completed",
    turnDone: "Turn completed",
    permissionRequired: (detail) => detail ? `Permission required: ${detail}` : "Main session requires permission",
    questionRequired: (detail) => detail ? `Answer required: ${detail}` : "Main session requires an answer",
    sessionError: (detail) => detail ? `Session failed: ${detail}` : "Session failed",
    subagentError: (detail) => detail ? `Subagent failed: ${detail}` : "Subagent failed"
  },
  zh: {
    subagents: "\u5B50 agent",
    subagentsDone: (count) => count > 1 ? `\u5168\u90E8 ${count} \u4E2A\u5B50 agent \u5DF2\u5B8C\u6210` : "\u5B50 agent \u5DF2\u5B8C\u6210",
    turnDone: "\u672C\u8F6E\u5BF9\u8BDD\u5DF2\u5B8C\u6210",
    permissionRequired: (detail) => detail ? `\u9700\u8981\u6743\u9650\u786E\u8BA4: ${detail}` : "\u4E3B\u4F1A\u8BDD\u9700\u8981\u6743\u9650\u786E\u8BA4",
    questionRequired: (detail) => detail ? `\u9700\u8981\u56DE\u7B54: ${detail}` : "\u4E3B\u4F1A\u8BDD\u9700\u8981\u56DE\u7B54\u8BE2\u95EE",
    sessionError: (detail) => detail ? `\u4F1A\u8BDD\u6267\u884C\u5931\u8D25: ${detail}` : "\u4F1A\u8BDD\u6267\u884C\u5931\u8D25",
    subagentError: (detail) => detail ? `\u5B50 agent \u6267\u884C\u5931\u8D25: ${detail}` : "\u5B50 agent \u6267\u884C\u5931\u8D25"
  }
};
function resolveLocale(input) {
  if (input === "zh" || input === "zh-CN" || input === "zh_CN" || input === "zh-Hans") {
    return "zh";
  }
  return "en";
}
function t(locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

// src/diag.ts
import { appendFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
var MARKER = join(tmpdir(), "opencode-agent-pulse-debug.on");
var DIAG_FILE = join(tmpdir(), "opencode-agent-pulse-diag.log");
var enabled = false;
function initDiag(option) {
  enabled = option === true || existsSync(MARKER);
  if (enabled)
    diag("diag enabled", { pid: process.pid, option: option === true, marker: existsSync(MARKER) });
}
function diag(event, data) {
  if (!enabled)
    return;
  try {
    appendFileSync(DIAG_FILE, `${new Date().toISOString()} pid=${process.pid} ${event}${data ? " " + JSON.stringify(data) : ""}
`);
  } catch {}
}

// src/notification.ts
var IS_WINDOWS = process.platform === "win32";
var WINDOWS_APP_ID = "opencode-agent-pulse";
var OPENCODE_ICON_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAFACAYAAABTKqIKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKZ0lE" + "QVR4nO3dMW4kQQxD0TlJAbz/Eey7yZFjO5MAPgHKF23yb091ifrkvdGeAQ28ymfw2f4HaM+ABh4AEAEQ" + "0MDzBkAEQEADz08AIgACGnjOAIgACGjgOQQkAiCggecrABEAAQ08nwGJAAho4LkHQARAQAPPRSAiAAIa" + "eG4CEgEQ0MBzFZgIgIAGnlkAIgACGniGgYgACGjgmQYkAiCggWccmAiAIJ6BPAAiAIIUPwOBIAf+CNoz" + "CAAQARDQQLwBEAEQ0ED8BCACIKCBOAMgAiCggTgEJAIgoIH4CkAEQEAD8RmQCICABuIeABEAAQ3ERSAi" + "AAIaiJuARAAENBBXgYkACGggZgGIAAhoIIaBiAAIaCCmAYkACGggxoGJAAhe/TOQB0AE9SZIsQYA4MAf" + "QXsGAQAiAAIaiDcAIgACGoifAEQABDQQZwBEAAQ0EIeARAAENBBfAYgACGggPgMSARDQQNwDIAIgoIG4" + "CEQEQEADcROQCICABuIqMBEAAQ3ELAARAAENxDAQEQABDcQ0IBEAAQ3EODARAMGrfwbyAIig3gQp1gAA" + "HPgjaM8gAEAEQEAD8QZABEBAA/ETgAiAgAbiDIAIgIAG4hCQCICABuIrABEAAQ3EZ0AiAAIaiHsARAAE" + "NBAXgYgACGggbgISARDQQFwFJgIgoIGYBfhjGEJVV8oh4QGo6soBEwLAJgFVdeWACQEAABQAzMp/gNsE" + "2m7O664c0KA3AABQADDeALwBKG8A4yeAnwDKT4BxBuAMQDkDGIeADgGVQ8DxFcBXAOUrwPgM6DOg8hlw" + "3ANwD0C5BzAuArkIpFwEGjcB3QRUbgKOq8CuAitXgccsgFkAZRZgDAMZBlKGgcY0oGlAZRpwjAMbB1bG" + "gUcegDyA+sqBmXx5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIA" + "lDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIA" + "lDyAkQcgD6C+cmAmXx6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6A" + "PAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6A" + "PAAlD2DkAcgDqK8cmMmXByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICR" + "ByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICRByAPQMkDGHkA/wDB99eXLn4GOXAf3yzA4kPYFqAG" + "gGzOwmwTaLsZsBtCOaBBAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0" + "dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3Qmvn" + "gAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6Y" + "EAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkB" + "AADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO09rYBt9t2" + "4AMi1AAQANghIPN1AygH/hf2BuAnwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAA" + "wLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACs" + "G6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoR" + "WjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1" + "c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsH" + "TAgAALBuhNbeNuB2f7b/Adu9LUANAAEAAAACbwDxBuANAAj8BIifAH4CAIEzgDgDcAYABA4B4xDQISAQ" + "+AoQXwF8BQACnwHjM6DPgEDgHkDcA3APAAhcBIqLQC4CAYGbgHET0E1AIHAVOK4CuwoMBGYBYhbALAAQ" + "GAaKYSDDQEBgGjCmAU0DAoFx4BgHNg4MBPIA5AHIA6gHQQ5kUsgDkAdQb0SJQE8egEQgIBAJ9uQBiAQD" + "ApmATx6ATEAgEAr65AEIBQUCqcBPHoBUYCAQC/7kAYgFBwJ7AZ48AHsBgMBikCcPwGIQILAZ6MkDsBkI" + "CKwGe/IArAYDArsBnzwAuwGBwHLQJw/AclAgsB34yQOwHRgIrAd/8gCsBweCXxDkwEiucWDjwMaBrQcf" + "68GtBwcC68HHenDrwYHAevCxHtx6cCCwHnysB7ceHAisBx/rwa0HBwLrwcd6cOvBgcB68LEe3HpwILAe" + "fKwHtx4cCKwHH+vBrQcHAuvBx3pw68GBwHrwsR7cenAgsB58rAe3HhwIrAcf68GtBwcC68HHenDrwYHA" + "OPBYD249eD0IcmAmXx6APIB6I8oDePIA5AEAgTyAJw9AHgAQyAN48gDkAQCBPIAnD0AeABDIA3jyAOQB" + "AIE8gCcPQB4AEMgDePIA5AEAgTyAJw9AHgAQyAN48gDkAQCBPIAnD0AeABDIA3jyAOQBAIE8gCcPQB4A" + "EMgDePIA5AEAgTyAJw9AHgAQyAN48gDkAQBBDszkywM48CC0Z5DCZ/DZ/gdoz4AGHgAQARDQwPMGQARA" + "QAPPTwAiAAIaeM4AiAAIaOA5BCQCIKCB5ysAEQABDTyfAYkACGjguQdABEBAA89FICIAAhp4bgISARDQ" + "wHMVmAiAgAaeWQAiAAIaeIaBiAAIaOCZBiQCIKCBZxyYCIAgnoE8ACIAghQ/A4EgB/4I2jMIABABENBA" + "vAEQARDQQPwEIAIgoIE4AyACIKCBOAQkAiCggfgKQARAQAPxGZAIgIAG4h4AEQABDcRFICIAAhqIm4BE" + "AAQ0EFeBiQAIaCBmAYgACGgghoGIAAhoIKYBiQAIaCDGgYkACF79M5AHQAT1JkixBgDgwB9BewYBACIA" + "AhqINwAiAAIaiJ8ARAAENBBnAEQABDQQh4BEAAQ0EF8BiAAIaCA+AxIBENBA3AMgAiCggbgIRARAQANx" + "E5AIgIAG4iowEQABDcQsABEAAQ3EMBARAAENxDQgEQABDcQ4MBEAwat/BvIAiKDeBCnWAAAc+CNozyAA" + "QARAQAPxBkAEQEAD8ROACICABuIMgAiAgAbiEJAIgIAG4isAEQABDcRnQCIAAhqIewBEAAQ0EBeBiAAI" + "aCBuAhIBENBAXAUmAiCggfzxDH4A1tndxbLywd0AAAAASUVORK5CYII=";
var windowsIcon;
function ensureWindowsIcon() {
  windowsIcon ??= (async () => {
    try {
      const { writeFile } = await import("fs/promises");
      const os = await import("os");
      const path = await import("path");
      const iconPath = path.join(os.tmpdir(), `opencode-pulse-${process.pid}.png`);
      await writeFile(iconPath, Buffer.from(OPENCODE_ICON_PNG_B64, "base64"));
      return iconPath;
    } catch {
      return;
    }
  })();
  return windowsIcon;
}
async function windowsNotify(payload) {
  try {
    const mod = await import("node-notifier");
    const iconPath = await ensureWindowsIcon();
    const notifier = mod.default ?? mod;
    notifier.notify({
      title: payload.title,
      message: payload.message,
      appID: WINDOWS_APP_ID,
      ...iconPath ? { icon: iconPath } : {},
      sound: false
    }, (error, response) => diag("windowsNotify:callback", { error: error ? String(error) : null, response }));
  } catch (error) {
    diag("windowsNotify:error", { error: String(error) });
  }
}
async function builtinNotify(api, payload) {
  try {
    return await api.attention.notify({
      title: payload.title,
      message: payload.message,
      notification: { when: "always" },
      sound: payload.sound
    });
  } catch (error) {
    diag("builtinNotify:error", { error: String(error) });
    return;
  }
}
async function dispatch(api, payload, gate) {
  const focused = gate?.onlyWhenUnfocused ? await gate.focused() : undefined;
  diag("dispatch", {
    title: payload.title,
    message: payload.message,
    onlyWhenUnfocused: gate?.onlyWhenUnfocused,
    focused
  });
  if (gate?.onlyWhenUnfocused && focused === true) {
    diag("dispatch:suppressed-focused");
    return;
  }
  const result = await builtinNotify(api, payload);
  diag("dispatch:builtin-result", result ? { ok: result.ok, notification: result.notification, sound: result.sound, skipped: result.skipped } : { result: "undefined" });
  if (IS_WINDOWS && result?.skipped !== "attention_disabled") {
    diag("dispatch:windows-fallback", {
      hostNotification: result?.notification ?? null,
      hostSkipped: result?.skipped ?? null
    });
    await windowsNotify(payload);
  }
}
async function notifySubagentsDone(api, count, gate, locale = "en") {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: t(locale).subagentsDone(count),
    sound: { name: "subagent_done" }
  }, gate);
}
async function notifyTurnDone(api, gate, locale = "en") {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: t(locale).turnDone,
    sound: { name: "done" }
  }, gate);
}
async function notifySessionError(api, kind, detail, gate, locale = "en") {
  const messages = t(locale);
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: kind === "subagent" ? messages.subagentError(detail) : messages.sessionError(detail),
    sound: { name: "error" }
  }, gate);
}
async function notifyInterviewInput(api, kind, detail, gate, locale = "en") {
  const messages = t(locale);
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: kind === "permission" ? messages.permissionRequired(detail) : messages.questionRequired(detail),
    sound: kind === "permission" ? { name: "permission" } : { name: "question" }
  }, gate);
}

// src/windows-focus.ts
import { spawn } from "child_process";
var IS_WINDOWS2 = process.platform === "win32";
var PROCESSENTRY32W_SIZE = 568;
var OFFSET_TH32_PROCESS_ID = 8;
var OFFSET_TH32_PARENT_PROCESS_ID = 32;
var backend = "none";
var ancestors = new Set;
var ffiForegroundPid;
var status = { backend: "none", ancestorCount: 0 };
function getFocusStatus() {
  return status;
}
function runPowerShell(script, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let out = "";
    let child;
    try {
      child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"]
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
    child.stdout?.on("data", (chunk) => {
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
async function ancestorsViaPowerShell() {
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
  const pids = new Set;
  for (const part of result.split(",")) {
    const n = parseInt(part, 10);
    if (Number.isFinite(n) && n > 0)
      pids.add(n);
  }
  return pids;
}
async function foregroundPidViaPowerShell() {
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
async function initFfiBackend() {
  try {
    const { dlopen, ptr } = await import("bun:ffi");
    const user32 = dlopen("user32.dll", {
      GetForegroundWindow: { args: [], returns: "ptr" },
      GetWindowThreadProcessId: { args: ["ptr", "ptr"], returns: "u32" }
    });
    const kernel32 = dlopen("kernel32.dll", {
      GetCurrentProcessId: { args: [], returns: "u32" },
      CreateToolhelp32Snapshot: { args: ["u32", "u32"], returns: "ptr" },
      Process32FirstW: { args: ["ptr", "ptr"], returns: "i32" },
      Process32NextW: { args: ["ptr", "ptr"], returns: "i32" },
      CloseHandle: { args: ["ptr"], returns: "i32" }
    });
    const TH32CS_SNAPPROCESS = 2;
    const snapshot = kernel32.symbols.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (!snapshot) {
      return false;
    }
    try {
      const entry = new Uint8Array(PROCESSENTRY32W_SIZE);
      const view = new DataView(entry.buffer);
      view.setUint32(0, PROCESSENTRY32W_SIZE, true);
      const parent = new Map;
      let ok = kernel32.symbols.Process32FirstW(snapshot, ptr(entry));
      while (ok) {
        const pid = view.getUint32(OFFSET_TH32_PROCESS_ID, true);
        const ppid = view.getUint32(OFFSET_TH32_PARENT_PROCESS_ID, true);
        if (pid !== 0)
          parent.set(pid, ppid);
        ok = kernel32.symbols.Process32NextW(snapshot, ptr(entry));
      }
      const self = kernel32.symbols.GetCurrentProcessId();
      let current = self;
      for (let depth = 0;depth < 32 && current; depth++) {
        ancestors.add(current);
        const next = parent.get(current);
        if (next === undefined || next === current)
          break;
        current = next;
      }
    } finally {
      kernel32.symbols.CloseHandle(snapshot);
    }
    ffiForegroundPid = () => {
      const hwnd = user32.symbols.GetForegroundWindow();
      if (!hwnd)
        return;
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
var initPromise;
function ensureWindowsFocusInit() {
  if (!IS_WINDOWS2)
    return;
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
}
async function isTerminalFocused() {
  if (!IS_WINDOWS2) {
    return;
  }
  if (initPromise)
    await initPromise;
  if (backend === "none") {
    return;
  }
  if (backend === "ffi" && ffiForegroundPid) {
    const foreground2 = ffiForegroundPid();
    if (foreground2 !== undefined) {
      const result2 = ancestors.has(foreground2);
      status = { ...status, lastForegroundPid: foreground2, lastResult: result2 };
      return result2;
    }
  }
  const foreground = await foregroundPidViaPowerShell();
  const result = foreground !== undefined ? ancestors.has(foreground) : undefined;
  status = { ...status, lastForegroundPid: foreground, lastResult: result };
  return result;
}

// src/tui.tsx
function formatDuration(elapsedMs) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds.toString().padStart(2, "0")}s` : `${seconds}s`;
}
function statusOf(session, running, retrying) {
  if (running)
    return retrying ? "retry" : "busy";
  if (session.outcome === "failed")
    return "error";
  if (session.outcome === "interrupted")
    return "stopped";
  if (session.outcome === "succeeded")
    return "done";
  return "idle";
}
function elapsedOf(session, status2, now) {
  const start = session.time.busy ?? session.time.created;
  const end = status2 === "busy" || status2 === "retry" ? now : session.time.idle ?? session.time.updated ?? now;
  return Math.max(0, end - start);
}
function Sidebar(props) {
  const data = props.context.data;
  const theme = props.context.theme;
  const labels = t(props.locale);
  const [view, updateView] = props.context.storage.store("view", {
    initial: {
      open: true
    }
  });
  const [now, setNow] = createSignal(Date.now());
  const runningIDs = () => new Set(data.session.list().filter((session) => data.session.status(session.id) === "running").map((session) => session.id));
  createEffect(() => {
    const root = data.session.root(props.sessionID);
    for (const id of runningIDs()) {
      const session = data.session.get(id);
      if (session?.parentID !== undefined && data.session.root(id) === root) {
        props.markSeen(id);
      }
    }
  });
  const entries = createMemo(() => {
    const root = data.session.root(props.sessionID);
    const active = runningIDs();
    const retrying = props.retrying();
    const seenIDs = props.seen();
    const clock = now();
    return data.session.list().filter((session) => {
      if (session.parentID === undefined)
        return false;
      if (data.session.root(session.id) !== root)
        return false;
      return active.has(session.id) || seenIDs.has(session.id);
    }).map((session) => {
      const running = active.has(session.id);
      const status2 = statusOf(session, running, retrying.has(session.id));
      return {
        id: session.id,
        agent: session.agent ?? "?",
        title: session.title || undefined,
        status: status2,
        elapsed: elapsedOf(session, status2, clock),
        created: session.time.created
      };
    }).sort((a, b) => Number(b.status === "busy" || b.status === "retry") - Number(a.status === "busy" || a.status === "retry") || a.created - b.created);
  });
  const timer = setInterval(() => {
    if (!view.open)
      return;
    if (entries().some((entry) => entry.status === "busy" || entry.status === "retry")) {
      setNow(Date.now());
    }
  }, 1000);
  onCleanup(() => clearInterval(timer));
  const tone = (status2) => {
    if (status2 === "busy")
      return theme.text.feedback.success.base;
    if (status2 === "retry")
      return theme.text.feedback.warning.base;
    if (status2 === "error")
      return theme.text.feedback.error.base;
    return theme.text.muted;
  };
  const statusLabel = (status2) => {
    if (status2 === "busy")
      return "busy";
    if (status2 === "retry")
      return "retry";
    if (status2 === "done")
      return "done";
    if (status2 === "error")
      return "error";
    if (status2 === "stopped")
      return "stopped";
    return "idle";
  };
  return (() => {
    var _el$ = _$createElement("box"), _el$2 = _$createElement("box"), _el$3 = _$createElement("text"), _el$4 = _$createElement("text"), _el$5 = _$createElement("b");
    _$insertNode(_el$, _el$2);
    _$setProp(_el$, "width", "100%");
    _$setProp(_el$, "flexDirection", "column");
    _$insertNode(_el$2, _el$3);
    _$insertNode(_el$2, _el$4);
    _$setProp(_el$2, "width", "100%");
    _$setProp(_el$2, "flexDirection", "row");
    _$setProp(_el$2, "gap", 1);
    _$setProp(_el$2, "onMouseDown", () => {
      updateView((draft) => {
        draft.open = !draft.open;
      }).catch((error) => console.error("Failed to persist subagent sidebar state", error));
    });
    _$insert(_el$3, () => view.open ? "\u25BC" : "\u25B6");
    _$insertNode(_el$4, _el$5);
    _$insert(_el$5, () => labels.subagents);
    _$insert(_el$4, _$createComponent(Show, {
      get when() {
        return entries().length > 0;
      },
      get children() {
        var _el$6 = _$createElement("span"), _el$7 = _$createTextNode(` (`), _el$8 = _$createTextNode(`)`);
        _$insertNode(_el$6, _el$7);
        _$insertNode(_el$6, _el$8);
        _$insert(_el$6, () => entries().length, _el$8);
        _$effect((_$p) => _$setProp(_el$6, "style", {
          fg: theme.text.muted
        }, _$p));
        return _el$6;
      }
    }), null);
    _$insert(_el$, _$createComponent(Show, {
      get when() {
        return view.open;
      },
      get fallback() {
        return (() => {
          var _el$0 = _$createElement("box");
          _$setProp(_el$0, "height", 0);
          return _el$0;
        })();
      },
      get children() {
        return [_$createComponent(Show, {
          get when() {
            return props.showFocus;
          },
          get fallback() {
            return (() => {
              var _el$1 = _$createElement("box");
              _$setProp(_el$1, "height", 0);
              return _el$1;
            })();
          },
          get children() {
            var _el$9 = _$createElement("text");
            _$insert(_el$9, () => {
              const diag2 = props.focusDiag();
              const flag = diag2.lastResult === true ? "\u25CFfocused" : diag2.lastResult === false ? "\u25CBblurred" : "?unknown";
              const src = diag2.lastForegroundPid !== undefined ? ` fg=${diag2.lastForegroundPid}` : "";
              const err = diag2.lastError ? ` err=${diag2.lastError}` : "";
              return `  focus[${diag2.backend}${diag2.ancestorCount ? `:${diag2.ancestorCount}` : ""}] ${flag}${src}${err}`;
            });
            _$effect((_$p) => _$setProp(_el$9, "fg", theme.text.muted, _$p));
            return _el$9;
          }
        }), _$createComponent(For, {
          get each() {
            return entries();
          },
          children: (entry) => (() => {
            var _el$10 = _$createElement("box"), _el$11 = _$createElement("text"), _el$13 = _$createElement("text"), _el$16 = _$createElement("text"), _el$17 = _$createElement("text");
            _$insertNode(_el$10, _el$11);
            _$insertNode(_el$10, _el$13);
            _$insertNode(_el$10, _el$16);
            _$insertNode(_el$10, _el$17);
            _$setProp(_el$10, "width", "100%");
            _$setProp(_el$10, "flexDirection", "row");
            _$setProp(_el$10, "gap", 1);
            _$setProp(_el$10, "paddingLeft", 1);
            _$setProp(_el$10, "onMouseDown", () => {
              props.context.ui.router.navigate({
                type: "session",
                sessionID: entry.id
              });
            });
            _$insertNode(_el$11, _$createTextNode(`\u25CF`));
            _$setProp(_el$11, "flexShrink", 0);
            _$setProp(_el$13, "wrapMode", "none");
            _$setProp(_el$13, "truncate", true);
            _$setProp(_el$13, "flexGrow", 1);
            _$setProp(_el$13, "flexShrink", 1);
            _$setProp(_el$13, "minWidth", 0);
            _$insert(_el$13, () => entry.title ?? entry.agent, null);
            _$insert(_el$13, _$createComponent(Show, {
              get when() {
                return entry.title;
              },
              get children() {
                var _el$14 = _$createElement("span"), _el$15 = _$createTextNode(` `);
                _$insertNode(_el$14, _el$15);
                _$insert(_el$14, () => entry.agent, null);
                _$effect((_$p) => _$setProp(_el$14, "style", {
                  fg: theme.text.muted
                }, _$p));
                return _el$14;
              }
            }), null);
            _$setProp(_el$16, "wrapMode", "none");
            _$setProp(_el$16, "flexShrink", 0);
            _$insert(_el$16, () => statusLabel(entry.status));
            _$setProp(_el$17, "wrapMode", "none");
            _$setProp(_el$17, "flexShrink", 0);
            _$insert(_el$17, () => formatDuration(entry.elapsed));
            _$effect((_p$) => {
              var _v$3 = tone(entry.status), _v$4 = theme.text.base, _v$5 = tone(entry.status), _v$6 = theme.text.muted;
              _v$3 !== _p$.e && (_p$.e = _$setProp(_el$11, "fg", _v$3, _p$.e));
              _v$4 !== _p$.t && (_p$.t = _$setProp(_el$13, "fg", _v$4, _p$.t));
              _v$5 !== _p$.a && (_p$.a = _$setProp(_el$16, "fg", _v$5, _p$.a));
              _v$6 !== _p$.o && (_p$.o = _$setProp(_el$17, "fg", _v$6, _p$.o));
              return _p$;
            }, {
              e: undefined,
              t: undefined,
              a: undefined,
              o: undefined
            });
            return _el$10;
          })()
        })];
      }
    }), null);
    _$effect((_p$) => {
      var _v$ = theme.text.base, _v$2 = theme.text.base;
      _v$ !== _p$.e && (_p$.e = _$setProp(_el$3, "fg", _v$, _p$.e));
      _v$2 !== _p$.t && (_p$.t = _$setProp(_el$4, "fg", _v$2, _p$.t));
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })();
}
var plugin = Plugin.define({
  id: "opencode-agent-pulse",
  setup(context) {
    const options = context.options ?? {};
    initDiag(options.debug === true);
    diag("setup", {
      cwd: process.cwd(),
      location: context.location?.directory,
      options
    });
    const notifCfg = options.notifications;
    const notifySubagents = notifCfg?.subagents ?? false;
    const notifyMainSession = notifCfg?.mainSession ?? false;
    const notifyInterview = notifCfg?.interview ?? false;
    const notifyErrors = notifCfg?.errors ?? false;
    const notifyOnlyWhenUnfocused = notifCfg?.onlyWhenUnfocused ?? true;
    const locale = resolveLocale(options.locale);
    const showSidebar = options.sidebar?.show ?? true;
    const showFocus = options.sidebar?.showFocus ?? false;
    const [seen, setSeen] = createSignal(new Set);
    const markSeen = (sessionID) => {
      setSeen((previous) => {
        if (previous.has(sessionID))
          return previous;
        const next = new Set(previous);
        next.add(sessionID);
        return next;
      });
    };
    if (notifyOnlyWhenUnfocused)
      ensureWindowsFocusInit();
    let focused;
    const [focusDiag, setFocusDiag] = createSignal(getFocusStatus());
    const refreshFocusDiag = () => setFocusDiag(getFocusStatus());
    const onFocus = () => {
      focused = true;
      refreshFocusDiag();
    };
    const onBlur = () => {
      focused = false;
      refreshFocusDiag();
    };
    context.renderer.on("focus", onFocus);
    context.renderer.on("blur", onBlur);
    const notifyGate = {
      onlyWhenUnfocused: notifyOnlyWhenUnfocused,
      focused: async () => {
        const win = await isTerminalFocused();
        refreshFocusDiag();
        diag("focus-check", {
          win: win ?? null,
          renderer: focused ?? null,
          ...getFocusStatus()
        });
        return win ?? focused;
      }
    };
    const [retrying, setRetrying] = createSignal(new Set);
    const markRetrying = (sessionID, value) => {
      setRetrying((previous) => {
        if (previous.has(sessionID) === value)
          return previous;
        const next = new Set(previous);
        if (value)
          next.add(sessionID);
        else
          next.delete(sessionID);
        return next;
      });
    };
    const isSubagent = (sessionID) => context.data.session.get(sessionID)?.parentID !== undefined;
    const normalizePath = (value) => {
      const slashed = value.replace(/\\/g, "/").replace(/\/+$/, "");
      return process.platform === "win32" ? slashed.toLowerCase() : slashed;
    };
    const sameLocation = (a, b) => !a || !b || normalizePath(a) === normalizePath(b);
    const atThisLocation = (event, sessionID) => {
      const here = context.location?.directory;
      const there = event.location?.directory ?? (sessionID ? context.data.session.get(sessionID)?.location?.directory : undefined);
      const ok = sameLocation(here, there);
      if (!ok)
        diag("location-mismatch", {
          event: event.type,
          here,
          there
        });
      return ok;
    };
    const hasRunningChild = (sessionID) => context.data.session.family(sessionID).some((child) => child !== sessionID && context.data.session.get(child)?.parentID === sessionID && context.data.session.status(child) === "running");
    const activeSubagents = new Set;
    let roundCount = 0;
    let roundNotified = false;
    const terminal = new Set;
    const errored = new Set;
    const pendingForms = new Set;
    const pendingPermissions = new Map;
    const PERMISSION_NOTIFY_DELAY_MS = 500;
    const started = (sessionID) => {
      terminal.delete(sessionID);
      errored.delete(sessionID);
      markRetrying(sessionID, false);
    };
    const ended = (sessionID) => {
      diag("ended:enter", {
        sessionID,
        terminal: terminal.has(sessionID),
        errored: errored.has(sessionID),
        subagent: isSubagent(sessionID),
        notifyMainSession
      });
      if (terminal.has(sessionID))
        return;
      terminal.add(sessionID);
      if (errored.has(sessionID)) {
        errored.delete(sessionID);
        return;
      }
      if (isSubagent(sessionID))
        return;
      if (notifyMainSession) {
        notifyTurnDone(context, notifyGate, locale).catch(() => {});
      }
    };
    const unsubs = [];
    const endedSubagent = (sessionID) => {
      const tracked = activeSubagents.delete(sessionID);
      diag("endedSubagent", {
        sessionID,
        tracked,
        remaining: activeSubagents.size,
        roundNotified,
        notifySubagents,
        roundCount
      });
      if (!tracked || activeSubagents.size > 0 || roundNotified)
        return;
      roundNotified = true;
      if (notifySubagents) {
        notifySubagentsDone(context, roundCount, notifyGate, locale).catch(() => {});
      }
    };
    if (showSidebar) {
      unsubs.push(context.data.on("session.retry.scheduled", (event) => {
        if (!atThisLocation(event))
          return;
        markRetrying(event.data.sessionID, true);
      }));
    }
    unsubs.push(context.data.on("session.execution.started", (event) => {
      const here = atThisLocation(event, event.data.sessionID);
      diag("event:execution.started", {
        sessionID: event.data.sessionID,
        location: event.location?.directory,
        atLocation: here
      });
      if (!here)
        return;
      const sessionID = event.data.sessionID;
      started(sessionID);
      if (showSidebar)
        markSeen(sessionID);
      if (!isSubagent(sessionID))
        return;
      if (activeSubagents.size === 0) {
        roundCount = 0;
        roundNotified = false;
      }
      activeSubagents.add(sessionID);
      roundCount++;
    }));
    unsubs.push(context.data.on("session.execution.succeeded", (event) => {
      if (!atThisLocation(event, event.data.sessionID))
        return;
      const sessionID = event.data.sessionID;
      const subagent = isSubagent(sessionID);
      diag("event:execution.succeeded", {
        sessionID,
        subagent,
        runningChild: subagent ? undefined : hasRunningChild(sessionID),
        notifyMainSession
      });
      markRetrying(sessionID, false);
      if (isSubagent(sessionID)) {
        endedSubagent(sessionID);
        return;
      }
      if (hasRunningChild(sessionID))
        return;
      ended(sessionID);
    }));
    unsubs.push(context.data.on("session.execution.failed", (event) => {
      if (!atThisLocation(event, event.data.sessionID))
        return;
      const sessionID = event.data.sessionID;
      diag("event:execution.failed", {
        sessionID,
        subagent: isSubagent(sessionID),
        notifyErrors
      });
      markRetrying(sessionID, false);
      errored.add(sessionID);
      if (isSubagent(sessionID)) {
        endedSubagent(sessionID);
      } else {
        ended(sessionID);
      }
      if (!notifyErrors)
        return;
      const info = context.data.session.get(sessionID);
      const detail = info?.title || info?.agent || undefined;
      notifySessionError(context, isSubagent(sessionID) ? "subagent" : "session", detail, notifyGate, locale).catch(() => {});
    }));
    unsubs.push(context.data.on("session.execution.interrupted", (event) => {
      if (!atThisLocation(event, event.data.sessionID))
        return;
      const sessionID = event.data.sessionID;
      diag("event:execution.interrupted", {
        sessionID,
        subagent: isSubagent(sessionID)
      });
      markRetrying(sessionID, false);
      if (isSubagent(sessionID)) {
        endedSubagent(sessionID);
        return;
      }
      ended(sessionID);
    }));
    unsubs.push(context.data.on("session.deleted", (event) => {
      if (!atThisLocation(event, event.data.sessionID))
        return;
      const sessionID = event.data.sessionID;
      terminal.delete(sessionID);
      errored.delete(sessionID);
      activeSubagents.delete(sessionID);
      markRetrying(sessionID, false);
      setSeen((previous) => {
        if (!previous.has(sessionID))
          return previous;
        const next = new Set(previous);
        next.delete(sessionID);
        return next;
      });
    }));
    unsubs.push(context.data.on("form.created", (event) => {
      if (!atThisLocation(event, event.data.form.sessionID))
        return;
      const form = event.data.form;
      if (!notifyInterview || isSubagent(form.sessionID) || pendingForms.has(form.id))
        return;
      pendingForms.add(form.id);
      notifyInterviewInput(context, "question", form.title, notifyGate, locale).catch(() => {});
    }));
    unsubs.push(context.data.on("form.replied", (event) => {
      pendingForms.delete(event.data.id);
    }));
    unsubs.push(context.data.on("form.cancelled", (event) => {
      pendingForms.delete(event.data.id);
    }));
    unsubs.push(context.data.on("permission.asked", (event) => {
      const {
        id,
        sessionID,
        action
      } = event.data;
      if (!atThisLocation(event, sessionID))
        return;
      if (!notifyInterview || isSubagent(sessionID) || pendingPermissions.has(id))
        return;
      const timer = setTimeout(() => {
        if (pendingPermissions.delete(id)) {
          notifyInterviewInput(context, "permission", action, notifyGate, locale).catch(() => {});
        }
      }, PERMISSION_NOTIFY_DELAY_MS);
      pendingPermissions.set(id, timer);
    }));
    unsubs.push(context.data.on("permission.replied", (event) => {
      const timer = pendingPermissions.get(event.data.requestID);
      if (!timer)
        return;
      clearTimeout(timer);
      pendingPermissions.delete(event.data.requestID);
    }));
    if (showSidebar) {
      context.ui.slot({
        prepend: "sidebar.content",
        render: (slot) => _$createComponent(Sidebar, {
          context,
          get sessionID() {
            return slot.sessionID;
          },
          retrying,
          seen,
          markSeen,
          focusDiag,
          showFocus,
          locale
        })
      });
    }
    return () => {
      context.renderer.off("focus", onFocus);
      context.renderer.off("blur", onBlur);
      for (const timer of pendingPermissions.values())
        clearTimeout(timer);
      pendingPermissions.clear();
      unsubs.reverse().forEach((unsubscribe) => unsubscribe());
    };
  }
});
var tui_default = plugin;
export {
  tui_default as default
};

//# debugId=2C59981AEF64678A64756E2164756E21
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL3R1aS50c3giLCJmaWxlOi8vL0M6L1VzZXJzL1pvdXl1L3JlcG9zL3NyYy9pMThuLnRzIiwiZmlsZTovLy9DOi9Vc2Vycy9ab3V5dS9yZXBvcy9zcmMvZGlhZy50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL25vdGlmaWNhdGlvbi50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL3dpbmRvd3MtZm9jdXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IGFzIF8kY3JlYXRlQ29tcG9uZW50IH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBlZmZlY3QgYXMgXyRlZmZlY3QgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGNyZWF0ZVRleHROb2RlIGFzIF8kY3JlYXRlVGV4dE5vZGUgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGluc2VydE5vZGUgYXMgXyRpbnNlcnROb2RlIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBpbnNlcnQgYXMgXyRpbnNlcnQgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IG1lbW8gYXMgXyRtZW1vIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBzZXRQcm9wIGFzIF8kc2V0UHJvcCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCBhcyBfJGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJAb3BlbmNvZGUvcGx1Z2luL3R1aVwiO1xuaW1wb3J0IHsgY3JlYXRlRWZmZWN0LCBjcmVhdGVNZW1vLCBjcmVhdGVTaWduYWwsIEZvciwgb25DbGVhbnVwLCBTaG93IH0gZnJvbSBcInNvbGlkLWpzXCI7XG5pbXBvcnQgeyBub3RpZnlJbnRlcnZpZXdJbnB1dCwgbm90aWZ5U2Vzc2lvbkVycm9yLCBub3RpZnlTdWJhZ2VudHNEb25lLCBub3RpZnlUdXJuRG9uZSB9IGZyb20gXCIuL25vdGlmaWNhdGlvblwiO1xuaW1wb3J0IHsgcmVzb2x2ZUxvY2FsZSwgdCB9IGZyb20gXCIuL2kxOG5cIjtcbmltcG9ydCB7IGRpYWcsIGluaXREaWFnIH0gZnJvbSBcIi4vZGlhZ1wiO1xuaW1wb3J0IHsgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCwgZ2V0Rm9jdXNTdGF0dXMsIGlzVGVybWluYWxGb2N1c2VkIH0gZnJvbSBcIi4vd2luZG93cy1mb2N1c1wiO1xuXG4vKipcbiAqIFNpZGViYXIgd2lkZ2V0IHRoYXQgbGl2ZS10cmFja3MgcnVubmluZyBzdWJhZ2VudHMgKHN1Yi1zZXNzaW9ucykuXG4gKlxuICogT3BlbkNvZGUgMi54IGRhdGEgc291cmNlIChgUGx1Z2luLkNvbnRleHQuZGF0YWApOlxuICogICAtIGBkYXRhLnNlc3Npb24ubGlzdCgpYCAgICAgICAgICAtPiBldmVyeSBzZXNzaW9uIHRoZSBUVUkgaGFzIGxvYWRlZC4gU3ViLXNlc3Npb25zXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FycnkgYHBhcmVudElEYDsgYGRhdGEuc2Vzc2lvbi5yb290KClgIGdyb3VwcyBhXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiB3aXRoIGl0cyB3aG9sZSBzdWJhZ2VudCBmYW1pbHkuXG4gKiAgIC0gYGRhdGEuc2Vzc2lvbi5zdGF0dXMoaWQpYCAgICAgIC0+IFwicnVubmluZ1wiIHwgXCJpZGxlXCIgKGRlcml2ZWQgZnJvbSBleGVjdXRpb24gZXZlbnRzKVxuICogICAtIGBkYXRhLnNlc3Npb24uZ2V0KGlkKWAgICAgICAgICAtPiBmdWxsIGBTZXNzaW9uSW5mb2AgKGFnZW50LCB0aXRsZSwgb3V0Y29tZSwgdGltZXMpXG4gKlxuICogVGhlIGhvc3QgYWxyZWFkeSBwcm9qZWN0cyBsaXZlIGV2ZW50cyBpbnRvIHRoaXMgcmVhY3RpdmUgc3RvcmUsIHNvIHRoZSBwbHVnaW4gbm9cbiAqIGxvbmdlciBtYWludGFpbnMgaXRzIG93biBldmVudC1kcml2ZW4gbWFwICh0aGUgVjEgYHNlc3Npb24uY3JlYXRlZGAgLyBgc2Vzc2lvbi5zdGF0dXNgXG4gKiAvIGBtZXNzYWdlLnBhcnQudXBkYXRlZGAgcGx1bWJpbmcgaXMgZ29uZSkuIGBzZXNzaW9uLnN1YmFnZW50LipgIGFjdGl2aXR5IGlzIGZvbGRlZCBpbnRvXG4gKiBgZXhlY3V0aW9uLnN0YXJ0ZWRgIC8gYGV4ZWN1dGlvbi5zdWNjZWVkZWR8ZmFpbGVkfGludGVycnVwdGVkYCwgd2hpY2ggdGhlIGhvc3QgZGF0YVxuICogbGF5ZXIgdHVybnMgaW50byB0aGUgcnVubmluZy9pZGxlIHN0YXR1cyB3ZSByZWFkIGhlcmUuXG4gKlxuICogRWxhcHNlZCB0aW1lIHVzZXMgdGhlIHNlc3Npb24ncyBvd24gdGltZXN0YW1wczpcbiAqICAgLSBgdGltZS5idXN5YCAgc3RhcnQgb2YgdGhlIG1vc3QgcmVjZW50IGV4ZWN1dGlvblxuICogICAtIGB0aW1lLmlkbGVgICBlbmQgb2YgdGhlIG1vc3QgcmVjZW50IGNvbXBsZXRlZCBleGVjdXRpb25cbiAqXG4gKiBOb3RpZmljYXRpb25zIGtlZXAgdGhlIFYxIG9wdGlvbiBzdXJmYWNlIChgbm90aWZpY2F0aW9ucy5zdWJhZ2VudHNgLFxuICogYG5vdGlmaWNhdGlvbnMubWFpblNlc3Npb25gLCBgbm90aWZpY2F0aW9ucy5pbnRlcnZpZXdgLCBgbm90aWZpY2F0aW9ucy5vbmx5V2hlblVuZm9jdXNlZGApXG4gKiBidXQgc3Vic2NyaWJlIHRvIFYyIGV2ZW50czogYHNlc3Npb24uZXhlY3V0aW9uLipgLCBgZm9ybS4qYCwgYHBlcm1pc3Npb24uKmAuXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0RHVyYXRpb24oZWxhcHNlZE1zKSB7XG4gIGNvbnN0IHRvdGFsU2Vjb25kcyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3IoZWxhcHNlZE1zIC8gMTAwMCkpO1xuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyA2MCk7XG4gIGNvbnN0IHNlY29uZHMgPSB0b3RhbFNlY29uZHMgJSA2MDtcbiAgcmV0dXJuIG1pbnV0ZXMgPiAwID8gYCR7bWludXRlc31tJHtzZWNvbmRzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfXNgIDogYCR7c2Vjb25kc31zYDtcbn1cbmZ1bmN0aW9uIHN0YXR1c09mKHNlc3Npb24sIHJ1bm5pbmcsIHJldHJ5aW5nKSB7XG4gIGlmIChydW5uaW5nKSByZXR1cm4gcmV0cnlpbmcgPyBcInJldHJ5XCIgOiBcImJ1c3lcIjtcbiAgaWYgKHNlc3Npb24ub3V0Y29tZSA9PT0gXCJmYWlsZWRcIikgcmV0dXJuIFwiZXJyb3JcIjtcbiAgaWYgKHNlc3Npb24ub3V0Y29tZSA9PT0gXCJpbnRlcnJ1cHRlZFwiKSByZXR1cm4gXCJzdG9wcGVkXCI7XG4gIGlmIChzZXNzaW9uLm91dGNvbWUgPT09IFwic3VjY2VlZGVkXCIpIHJldHVybiBcImRvbmVcIjtcbiAgcmV0dXJuIFwiaWRsZVwiO1xufVxuZnVuY3Rpb24gZWxhcHNlZE9mKHNlc3Npb24sIHN0YXR1cywgbm93KSB7XG4gIGNvbnN0IHN0YXJ0ID0gc2Vzc2lvbi50aW1lLmJ1c3kgPz8gc2Vzc2lvbi50aW1lLmNyZWF0ZWQ7XG4gIGNvbnN0IGVuZCA9IHN0YXR1cyA9PT0gXCJidXN5XCIgfHwgc3RhdHVzID09PSBcInJldHJ5XCIgPyBub3cgOiBzZXNzaW9uLnRpbWUuaWRsZSA/PyBzZXNzaW9uLnRpbWUudXBkYXRlZCA/PyBub3c7XG4gIHJldHVybiBNYXRoLm1heCgwLCBlbmQgLSBzdGFydCk7XG59XG5mdW5jdGlvbiBTaWRlYmFyKHByb3BzKSB7XG4gIGNvbnN0IGRhdGEgPSBwcm9wcy5jb250ZXh0LmRhdGE7XG4gIGNvbnN0IHRoZW1lID0gcHJvcHMuY29udGV4dC50aGVtZTtcbiAgY29uc3QgbGFiZWxzID0gdChwcm9wcy5sb2NhbGUpO1xuICAvLyBQZXJzaXN0ZWQgbGlrZSB0aGUgYnVpbHQtaW4gTUNQL1RPRE8gc2VjdGlvbnM6IHRoZSBhcnJvdyB0b2dnbGVzIHRoZSBzZWN0aW9uIGFuZFxuICAvLyB0aGUgY2hvaWNlIHN1cnZpdmVzIFRVSSByZXN0YXJ0cyBhbmQgcGx1Z2luIGhvdCByZWxvYWRzLlxuICBjb25zdCBbdmlldywgdXBkYXRlVmlld10gPSBwcm9wcy5jb250ZXh0LnN0b3JhZ2Uuc3RvcmUoXCJ2aWV3XCIsIHtcbiAgICBpbml0aWFsOiB7XG4gICAgICBvcGVuOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgLy8gUmUtcmVuZGVyIG9uY2UgYSBzZWNvbmQgc28gZWxhcHNlZCB0aW1lcyB0aWNrIHdoaWxlIGFuIGV4ZWN1dGlvbiBpcyBydW5uaW5nLlxuICBjb25zdCBbbm93LCBzZXROb3ddID0gY3JlYXRlU2lnbmFsKERhdGUubm93KCkpO1xuXG4gIC8vIGBQbHVnaW4uQ29udGV4dFtcImRhdGFcIl0uc2Vzc2lvbmAgZXhwb3NlcyBgc3RhdHVzKClgIGJ1dCBub3QgdGhlIHNvbGlkIHN0b3JlJ3NcbiAgLy8gYGFjdGl2ZSgpYCBoZWxwZXIsIHNvIGRlcml2ZSB0aGUgcnVubmluZyBzZXQgZnJvbSB0aGUgcHVibGljIHN1cmZhY2UuXG4gIGNvbnN0IHJ1bm5pbmdJRHMgPSAoKSA9PiBuZXcgU2V0KGRhdGEuc2Vzc2lvbi5saXN0KCkuZmlsdGVyKHNlc3Npb24gPT4gZGF0YS5zZXNzaW9uLnN0YXR1cyhzZXNzaW9uLmlkKSA9PT0gXCJydW5uaW5nXCIpLm1hcChzZXNzaW9uID0+IHNlc3Npb24uaWQpKTtcblxuICAvLyBTZWVkIHRoZSB2aXNpYmxlIHNldCBmb3Igc3ViYWdlbnRzIHRoYXQgd2VyZSBhbHJlYWR5IHJ1bm5pbmcgd2hlbiB0aGUgcGx1Z2luXG4gIC8vIGFjdGl2YXRlZCAoaG90IHJlbG9hZCAvIFRVSSByZXN1bWUpLiBMaXZlIHN0YXJ0cyBhcmUgcmVjb3JkZWQgYnkgdGhlIHNldHVwXG4gIC8vIGV2ZW50IGhhbmRsZXIsIHNvIGEgZmFzdCBzdGFydC9maW5pc2ggY2Fubm90IGZhbGwgdGhyb3VnaCB0aGlzIGJvb3RzdHJhcC5cbiAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByb290ID0gZGF0YS5zZXNzaW9uLnJvb3QocHJvcHMuc2Vzc2lvbklEKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHJ1bm5pbmdJRHMoKSkge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGRhdGEuc2Vzc2lvbi5nZXQoaWQpO1xuICAgICAgaWYgKHNlc3Npb24/LnBhcmVudElEICE9PSB1bmRlZmluZWQgJiYgZGF0YS5zZXNzaW9uLnJvb3QoaWQpID09PSByb290KSB7XG4gICAgICAgIHByb3BzLm1hcmtTZWVuKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBjb25zdCBlbnRyaWVzID0gY3JlYXRlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IGRhdGEuc2Vzc2lvbi5yb290KHByb3BzLnNlc3Npb25JRCk7XG4gICAgY29uc3QgYWN0aXZlID0gcnVubmluZ0lEcygpO1xuICAgIGNvbnN0IHJldHJ5aW5nID0gcHJvcHMucmV0cnlpbmcoKTtcbiAgICBjb25zdCBzZWVuSURzID0gcHJvcHMuc2VlbigpO1xuICAgIGNvbnN0IGNsb2NrID0gbm93KCk7XG4gICAgcmV0dXJuIGRhdGEuc2Vzc2lvbi5saXN0KCkuZmlsdGVyKHNlc3Npb24gPT4ge1xuICAgICAgaWYgKHNlc3Npb24ucGFyZW50SUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGRhdGEuc2Vzc2lvbi5yb290KHNlc3Npb24uaWQpICE9PSByb290KSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gYWN0aXZlLmhhcyhzZXNzaW9uLmlkKSB8fCBzZWVuSURzLmhhcyhzZXNzaW9uLmlkKTtcbiAgICB9KS5tYXAoc2Vzc2lvbiA9PiB7XG4gICAgICBjb25zdCBydW5uaW5nID0gYWN0aXZlLmhhcyhzZXNzaW9uLmlkKTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHN0YXR1c09mKHNlc3Npb24sIHJ1bm5pbmcsIHJldHJ5aW5nLmhhcyhzZXNzaW9uLmlkKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogc2Vzc2lvbi5pZCxcbiAgICAgICAgYWdlbnQ6IHNlc3Npb24uYWdlbnQgPz8gXCI/XCIsXG4gICAgICAgIHRpdGxlOiBzZXNzaW9uLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBlbGFwc2VkOiBlbGFwc2VkT2Yoc2Vzc2lvbiwgc3RhdHVzLCBjbG9jayksXG4gICAgICAgIGNyZWF0ZWQ6IHNlc3Npb24udGltZS5jcmVhdGVkXG4gICAgICB9O1xuICAgIH0pLnNvcnQoKGEsIGIpID0+IE51bWJlcihiLnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgYi5zdGF0dXMgPT09IFwicmV0cnlcIikgLSBOdW1iZXIoYS5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGEuc3RhdHVzID09PSBcInJldHJ5XCIpIHx8IGEuY3JlYXRlZCAtIGIuY3JlYXRlZCk7XG4gIH0pO1xuXG4gIC8vIFRpY2sgb25seSB3aGlsZSB0aGUgc2VjdGlvbiBpcyBvcGVuIGFuZCBzb21ldGhpbmcgaGFzIGEgbGl2ZSBjbG9jay5cbiAgY29uc3QgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgaWYgKCF2aWV3Lm9wZW4pIHJldHVybjtcbiAgICBpZiAoZW50cmllcygpLnNvbWUoZW50cnkgPT4gZW50cnkuc3RhdHVzID09PSBcImJ1c3lcIiB8fCBlbnRyeS5zdGF0dXMgPT09IFwicmV0cnlcIikpIHtcbiAgICAgIHNldE5vdyhEYXRlLm5vdygpKTtcbiAgICB9XG4gIH0sIDEwMDApO1xuICBvbkNsZWFudXAoKCkgPT4gY2xlYXJJbnRlcnZhbCh0aW1lcikpO1xuICBjb25zdCB0b25lID0gc3RhdHVzID0+IHtcbiAgICBpZiAoc3RhdHVzID09PSBcImJ1c3lcIikgcmV0dXJuIHRoZW1lLnRleHQuZmVlZGJhY2suc3VjY2Vzcy5iYXNlO1xuICAgIGlmIChzdGF0dXMgPT09IFwicmV0cnlcIikgcmV0dXJuIHRoZW1lLnRleHQuZmVlZGJhY2sud2FybmluZy5iYXNlO1xuICAgIGlmIChzdGF0dXMgPT09IFwiZXJyb3JcIikgcmV0dXJuIHRoZW1lLnRleHQuZmVlZGJhY2suZXJyb3IuYmFzZTtcbiAgICByZXR1cm4gdGhlbWUudGV4dC5tdXRlZDtcbiAgfTtcbiAgY29uc3Qgc3RhdHVzTGFiZWwgPSBzdGF0dXMgPT4ge1xuICAgIGlmIChzdGF0dXMgPT09IFwiYnVzeVwiKSByZXR1cm4gXCJidXN5XCI7XG4gICAgaWYgKHN0YXR1cyA9PT0gXCJyZXRyeVwiKSByZXR1cm4gXCJyZXRyeVwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwiZG9uZVwiKSByZXR1cm4gXCJkb25lXCI7XG4gICAgaWYgKHN0YXR1cyA9PT0gXCJlcnJvclwiKSByZXR1cm4gXCJlcnJvclwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwic3RvcHBlZFwiKSByZXR1cm4gXCJzdG9wcGVkXCI7XG4gICAgcmV0dXJuIFwiaWRsZVwiO1xuICB9O1xuICByZXR1cm4gKCgpID0+IHtcbiAgICB2YXIgX2VsJCA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKSxcbiAgICAgIF9lbCQyID0gXyRjcmVhdGVFbGVtZW50KFwiYm94XCIpLFxuICAgICAgX2VsJDMgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpLFxuICAgICAgX2VsJDQgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpLFxuICAgICAgX2VsJDUgPSBfJGNyZWF0ZUVsZW1lbnQoXCJiXCIpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkLCBfZWwkMik7XG4gICAgXyRzZXRQcm9wKF9lbCQsIFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIF8kc2V0UHJvcChfZWwkLCBcImZsZXhEaXJlY3Rpb25cIiwgXCJjb2x1bW5cIik7XG4gICAgXyRpbnNlcnROb2RlKF9lbCQyLCBfZWwkMyk7XG4gICAgXyRpbnNlcnROb2RlKF9lbCQyLCBfZWwkNCk7XG4gICAgXyRzZXRQcm9wKF9lbCQyLCBcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICBfJHNldFByb3AoX2VsJDIsIFwiZmxleERpcmVjdGlvblwiLCBcInJvd1wiKTtcbiAgICBfJHNldFByb3AoX2VsJDIsIFwiZ2FwXCIsIDEpO1xuICAgIF8kc2V0UHJvcChfZWwkMiwgXCJvbk1vdXNlRG93blwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHVwZGF0ZVZpZXcoZHJhZnQgPT4ge1xuICAgICAgICBkcmFmdC5vcGVuID0gIWRyYWZ0Lm9wZW47XG4gICAgICB9KS5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHBlcnNpc3Qgc3ViYWdlbnQgc2lkZWJhciBzdGF0ZVwiLCBlcnJvcikpO1xuICAgIH0pO1xuICAgIF8kaW5zZXJ0KF9lbCQzLCAoKSA9PiB2aWV3Lm9wZW4gPyBcIuKWvFwiIDogXCLilrZcIik7XG4gICAgXyRpbnNlcnROb2RlKF9lbCQ0LCBfZWwkNSk7XG4gICAgXyRpbnNlcnQoX2VsJDUsICgpID0+IGxhYmVscy5zdWJhZ2VudHMpO1xuICAgIF8kaW5zZXJ0KF9lbCQ0LCBfJGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIGVudHJpZXMoKS5sZW5ndGggPiAwO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgdmFyIF9lbCQ2ID0gXyRjcmVhdGVFbGVtZW50KFwic3BhblwiKSxcbiAgICAgICAgICBfZWwkNyA9IF8kY3JlYXRlVGV4dE5vZGUoYCAoYCksXG4gICAgICAgICAgX2VsJDggPSBfJGNyZWF0ZVRleHROb2RlKGApYCk7XG4gICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkNiwgX2VsJDcpO1xuICAgICAgICBfJGluc2VydE5vZGUoX2VsJDYsIF9lbCQ4KTtcbiAgICAgICAgXyRpbnNlcnQoX2VsJDYsICgpID0+IGVudHJpZXMoKS5sZW5ndGgsIF9lbCQ4KTtcbiAgICAgICAgXyRlZmZlY3QoXyRwID0+IF8kc2V0UHJvcChfZWwkNiwgXCJzdHlsZVwiLCB7XG4gICAgICAgICAgZmc6IHRoZW1lLnRleHQubXV0ZWRcbiAgICAgICAgfSwgXyRwKSk7XG4gICAgICAgIHJldHVybiBfZWwkNjtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgXyRpbnNlcnQoX2VsJCwgXyRjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiB2aWV3Lm9wZW47XG4gICAgICB9LFxuICAgICAgZ2V0IGZhbGxiYWNrKCkge1xuICAgICAgICByZXR1cm4gKCgpID0+IHtcbiAgICAgICAgICB2YXIgX2VsJDAgPSBfJGNyZWF0ZUVsZW1lbnQoXCJib3hcIik7XG4gICAgICAgICAgXyRzZXRQcm9wKF9lbCQwLCBcImhlaWdodFwiLCAwKTtcbiAgICAgICAgICByZXR1cm4gX2VsJDA7XG4gICAgICAgIH0pKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gW18kY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5zaG93Rm9jdXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgZmFsbGJhY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gKCgpID0+IHtcbiAgICAgICAgICAgICAgdmFyIF9lbCQxID0gXyRjcmVhdGVFbGVtZW50KFwiYm94XCIpO1xuICAgICAgICAgICAgICBfJHNldFByb3AoX2VsJDEsIFwiaGVpZ2h0XCIsIDApO1xuICAgICAgICAgICAgICByZXR1cm4gX2VsJDE7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgdmFyIF9lbCQ5ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQ5LCAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGRpYWcgPSBwcm9wcy5mb2N1c0RpYWcoKTtcbiAgICAgICAgICAgICAgY29uc3QgZmxhZyA9IGRpYWcubGFzdFJlc3VsdCA9PT0gdHJ1ZSA/IFwi4pePZm9jdXNlZFwiIDogZGlhZy5sYXN0UmVzdWx0ID09PSBmYWxzZSA/IFwi4peLYmx1cnJlZFwiIDogXCI/dW5rbm93blwiO1xuICAgICAgICAgICAgICBjb25zdCBzcmMgPSBkaWFnLmxhc3RGb3JlZ3JvdW5kUGlkICE9PSB1bmRlZmluZWQgPyBgIGZnPSR7ZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZH1gIDogXCJcIjtcbiAgICAgICAgICAgICAgY29uc3QgZXJyID0gZGlhZy5sYXN0RXJyb3IgPyBgIGVycj0ke2RpYWcubGFzdEVycm9yfWAgOiBcIlwiO1xuICAgICAgICAgICAgICByZXR1cm4gYCAgZm9jdXNbJHtkaWFnLmJhY2tlbmR9JHtkaWFnLmFuY2VzdG9yQ291bnQgPyBgOiR7ZGlhZy5hbmNlc3RvckNvdW50fWAgOiBcIlwifV0gJHtmbGFnfSR7c3JjfSR7ZXJyfWA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF8kZWZmZWN0KF8kcCA9PiBfJHNldFByb3AoX2VsJDksIFwiZmdcIiwgdGhlbWUudGV4dC5tdXRlZCwgXyRwKSk7XG4gICAgICAgICAgICByZXR1cm4gX2VsJDk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSwgXyRjcmVhdGVDb21wb25lbnQoRm9yLCB7XG4gICAgICAgICAgZ2V0IGVhY2goKSB7XG4gICAgICAgICAgICByZXR1cm4gZW50cmllcygpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hpbGRyZW46IGVudHJ5ID0+ICgoKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2VsJDEwID0gXyRjcmVhdGVFbGVtZW50KFwiYm94XCIpLFxuICAgICAgICAgICAgICBfZWwkMTEgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpLFxuICAgICAgICAgICAgICBfZWwkMTMgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpLFxuICAgICAgICAgICAgICBfZWwkMTYgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpLFxuICAgICAgICAgICAgICBfZWwkMTcgPSBfJGNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIpO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMCwgX2VsJDExKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTAsIF9lbCQxMyk7XG4gICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDEwLCBfZWwkMTYpO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMCwgX2VsJDE3KTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMCwgXCJmbGV4RGlyZWN0aW9uXCIsIFwicm93XCIpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMCwgXCJnYXBcIiwgMSk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEwLCBcInBhZGRpbmdMZWZ0XCIsIDEpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMCwgXCJvbk1vdXNlRG93blwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHByb3BzLmNvbnRleHQudWkucm91dGVyLm5hdmlnYXRlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNlc3Npb25cIixcbiAgICAgICAgICAgICAgICBzZXNzaW9uSUQ6IGVudHJ5LmlkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDExLCBfJGNyZWF0ZVRleHROb2RlKGDil49gKSk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDExLCBcImZsZXhTaHJpbmtcIiwgMCk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEzLCBcIndyYXBNb2RlXCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTMsIFwidHJ1bmNhdGVcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEzLCBcImZsZXhHcm93XCIsIDEpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJmbGV4U2hyaW5rXCIsIDEpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJtaW5XaWR0aFwiLCAwKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxMywgKCkgPT4gZW50cnkudGl0bGUgPz8gZW50cnkuYWdlbnQsIG51bGwpO1xuICAgICAgICAgICAgXyRpbnNlcnQoX2VsJDEzLCBfJGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS50aXRsZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgICAgIHZhciBfZWwkMTQgPSBfJGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLFxuICAgICAgICAgICAgICAgICAgX2VsJDE1ID0gXyRjcmVhdGVUZXh0Tm9kZShgIGApO1xuICAgICAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTQsIF9lbCQxNSk7XG4gICAgICAgICAgICAgICAgXyRpbnNlcnQoX2VsJDE0LCAoKSA9PiBlbnRyeS5hZ2VudCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgXyRlZmZlY3QoXyRwID0+IF8kc2V0UHJvcChfZWwkMTQsIFwic3R5bGVcIiwge1xuICAgICAgICAgICAgICAgICAgZmc6IHRoZW1lLnRleHQubXV0ZWRcbiAgICAgICAgICAgICAgICB9LCBfJHApKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2VsJDE0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgbnVsbCk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE2LCBcIndyYXBNb2RlXCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTYsIFwiZmxleFNocmlua1wiLCAwKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxNiwgKCkgPT4gc3RhdHVzTGFiZWwoZW50cnkuc3RhdHVzKSk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE3LCBcIndyYXBNb2RlXCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTcsIFwiZmxleFNocmlua1wiLCAwKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxNywgKCkgPT4gZm9ybWF0RHVyYXRpb24oZW50cnkuZWxhcHNlZCkpO1xuICAgICAgICAgICAgXyRlZmZlY3QoX3AkID0+IHtcbiAgICAgICAgICAgICAgdmFyIF92JDMgPSB0b25lKGVudHJ5LnN0YXR1cyksXG4gICAgICAgICAgICAgICAgX3YkNCA9IHRoZW1lLnRleHQuYmFzZSxcbiAgICAgICAgICAgICAgICBfdiQ1ID0gdG9uZShlbnRyeS5zdGF0dXMpLFxuICAgICAgICAgICAgICAgIF92JDYgPSB0aGVtZS50ZXh0Lm11dGVkO1xuICAgICAgICAgICAgICBfdiQzICE9PSBfcCQuZSAmJiAoX3AkLmUgPSBfJHNldFByb3AoX2VsJDExLCBcImZnXCIsIF92JDMsIF9wJC5lKSk7XG4gICAgICAgICAgICAgIF92JDQgIT09IF9wJC50ICYmIChfcCQudCA9IF8kc2V0UHJvcChfZWwkMTMsIFwiZmdcIiwgX3YkNCwgX3AkLnQpKTtcbiAgICAgICAgICAgICAgX3YkNSAhPT0gX3AkLmEgJiYgKF9wJC5hID0gXyRzZXRQcm9wKF9lbCQxNiwgXCJmZ1wiLCBfdiQ1LCBfcCQuYSkpO1xuICAgICAgICAgICAgICBfdiQ2ICE9PSBfcCQubyAmJiAoX3AkLm8gPSBfJHNldFByb3AoX2VsJDE3LCBcImZnXCIsIF92JDYsIF9wJC5vKSk7XG4gICAgICAgICAgICAgIHJldHVybiBfcCQ7XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIG86IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gX2VsJDEwO1xuICAgICAgICAgIH0pKClcbiAgICAgICAgfSldO1xuICAgICAgfVxuICAgIH0pLCBudWxsKTtcbiAgICBfJGVmZmVjdChfcCQgPT4ge1xuICAgICAgdmFyIF92JCA9IHRoZW1lLnRleHQuYmFzZSxcbiAgICAgICAgX3YkMiA9IHRoZW1lLnRleHQuYmFzZTtcbiAgICAgIF92JCAhPT0gX3AkLmUgJiYgKF9wJC5lID0gXyRzZXRQcm9wKF9lbCQzLCBcImZnXCIsIF92JCwgX3AkLmUpKTtcbiAgICAgIF92JDIgIT09IF9wJC50ICYmIChfcCQudCA9IF8kc2V0UHJvcChfZWwkNCwgXCJmZ1wiLCBfdiQyLCBfcCQudCkpO1xuICAgICAgcmV0dXJuIF9wJDtcbiAgICB9LCB7XG4gICAgICBlOiB1bmRlZmluZWQsXG4gICAgICB0OiB1bmRlZmluZWRcbiAgICB9KTtcbiAgICByZXR1cm4gX2VsJDtcbiAgfSkoKTtcbn1cbmNvbnN0IHBsdWdpbiA9IFBsdWdpbi5kZWZpbmUoe1xuICBpZDogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICBzZXR1cChjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9ucyA/PyB7fTtcbiAgICBpbml0RGlhZyhvcHRpb25zLmRlYnVnID09PSB0cnVlKTtcbiAgICBkaWFnKFwic2V0dXBcIiwge1xuICAgICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgICAgbG9jYXRpb246IGNvbnRleHQubG9jYXRpb24/LmRpcmVjdG9yeSxcbiAgICAgIG9wdGlvbnNcbiAgICB9KTtcbiAgICBjb25zdCBub3RpZkNmZyA9IG9wdGlvbnMubm90aWZpY2F0aW9ucztcbiAgICAvLyBPcHQtaW46IE9wZW5Db2RlIDIueCBzaGlwcyBgb3BlbmNvZGUubm90aWZpY2F0aW9uc2AsIHdoaWNoIGNvdmVycyB0aGUgc2FtZVxuICAgIC8vIGV2ZW50cy4gRGVmYXVsdGluZyB0byBvZmYgYXZvaWRzIGR1cGxpY2F0ZSBzb3VuZHMvdG9hc3RzLlxuICAgIGNvbnN0IG5vdGlmeVN1YmFnZW50cyA9IG5vdGlmQ2ZnPy5zdWJhZ2VudHMgPz8gZmFsc2U7XG4gICAgY29uc3Qgbm90aWZ5TWFpblNlc3Npb24gPSBub3RpZkNmZz8ubWFpblNlc3Npb24gPz8gZmFsc2U7XG4gICAgY29uc3Qgbm90aWZ5SW50ZXJ2aWV3ID0gbm90aWZDZmc/LmludGVydmlldyA/PyBmYWxzZTtcbiAgICBjb25zdCBub3RpZnlFcnJvcnMgPSBub3RpZkNmZz8uZXJyb3JzID8/IGZhbHNlO1xuICAgIC8vIERlZmF1bHQgdG8gXCJkb24ndCBkaXN0dXJiIHdoaWxlIHRoZSB1c2VyIGlzIHdhdGNoaW5nXCIsIG1hdGNoaW5nIHRoZSBob3N0J3NcbiAgICAvLyBidWlsdC1pbiBub3RpZmljYXRpb25zIHBsdWdpbiAoYG5vdGlmaWNhdGlvbi53aGVuOiBcImJsdXJyZWRcImApLiBUaGUgV2luZG93c1xuICAgIC8vIGZhbGxiYWNrIGNoZWNrcyB0aGUgZm9yZWdyb3VuZCB3aW5kb3cgYmVjYXVzZSBXaW5kb3dzIFRlcm1pbmFsIHJlcG9ydHMgbm9cbiAgICAvLyBmb2N1cyBldmVudHMgYXQgYWxsLlxuICAgIGNvbnN0IG5vdGlmeU9ubHlXaGVuVW5mb2N1c2VkID0gbm90aWZDZmc/Lm9ubHlXaGVuVW5mb2N1c2VkID8/IHRydWU7XG4gICAgY29uc3QgbG9jYWxlID0gcmVzb2x2ZUxvY2FsZShvcHRpb25zLmxvY2FsZSk7XG4gICAgLy8gYHNpZGViYXIuc2hvdzogZmFsc2VgIGtlZXBzIHRoZSBub3RpZmljYXRpb24gaGFsZiBhbGl2ZSB3aGlsZSBjbGFpbWluZyBub1xuICAgIC8vIGBzaWRlYmFyLmNvbnRlbnRgIHNsb3QgYXQgYWxsIOKAlCBubyBjb21wb25lbnQgdHJlZSwgbm8gMXMgdGlja2VyLlxuICAgIGNvbnN0IHNob3dTaWRlYmFyID0gb3B0aW9ucy5zaWRlYmFyPy5zaG93ID8/IHRydWU7XG4gICAgY29uc3Qgc2hvd0ZvY3VzID0gb3B0aW9ucy5zaWRlYmFyPy5zaG93Rm9jdXMgPz8gZmFsc2U7XG5cbiAgICAvLyBTdWJhZ2VudHMgb2JzZXJ2ZWQgcnVubmluZyBkdXJpbmcgdGhpcyBhY3RpdmF0aW9uLiBSZWNvcmRlZCBmcm9tIHRoZSBsaXZlXG4gICAgLy8gZXhlY3V0aW9uIGV2ZW50IChub3QgYnkgcG9sbGluZykgc28gYSBmYXN0IHN0YXJ0L2ZpbmlzaCBzdGlsbCBnZXRzIGEgcm93LlxuICAgIGNvbnN0IFtzZWVuLCBzZXRTZWVuXSA9IGNyZWF0ZVNpZ25hbChuZXcgU2V0KCkpO1xuICAgIGNvbnN0IG1hcmtTZWVuID0gc2Vzc2lvbklEID0+IHtcbiAgICAgIHNldFNlZW4ocHJldmlvdXMgPT4ge1xuICAgICAgICBpZiAocHJldmlvdXMuaGFzKHNlc3Npb25JRCkpIHJldHVybiBwcmV2aW91cztcbiAgICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldmlvdXMpO1xuICAgICAgICBuZXh0LmFkZChzZXNzaW9uSUQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyAtLS0gVGVybWluYWwgZm9jdXMgdHJhY2tpbmcgKFdpbmRvd3MgZmFsbGJhY2spIC0tLVxuICAgIGlmIChub3RpZnlPbmx5V2hlblVuZm9jdXNlZCkgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCgpO1xuICAgIGxldCBmb2N1c2VkO1xuICAgIGNvbnN0IFtmb2N1c0RpYWcsIHNldEZvY3VzRGlhZ10gPSBjcmVhdGVTaWduYWwoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3QgcmVmcmVzaEZvY3VzRGlhZyA9ICgpID0+IHNldEZvY3VzRGlhZyhnZXRGb2N1c1N0YXR1cygpKTtcbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IHRydWU7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgICBmb2N1c2VkID0gZmFsc2U7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb250ZXh0LnJlbmRlcmVyLm9uKFwiZm9jdXNcIiwgb25Gb2N1cyk7XG4gICAgY29udGV4dC5yZW5kZXJlci5vbihcImJsdXJcIiwgb25CbHVyKTtcbiAgICBjb25zdCBub3RpZnlHYXRlID0ge1xuICAgICAgb25seVdoZW5VbmZvY3VzZWQ6IG5vdGlmeU9ubHlXaGVuVW5mb2N1c2VkLFxuICAgICAgZm9jdXNlZDogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB3aW4gPSBhd2FpdCBpc1Rlcm1pbmFsRm9jdXNlZCgpO1xuICAgICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgICAgIGRpYWcoXCJmb2N1cy1jaGVja1wiLCB7XG4gICAgICAgICAgd2luOiB3aW4gPz8gbnVsbCxcbiAgICAgICAgICByZW5kZXJlcjogZm9jdXNlZCA/PyBudWxsLFxuICAgICAgICAgIC4uLmdldEZvY3VzU3RhdHVzKClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB3aW4gPz8gZm9jdXNlZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gU2Vzc2lvbiBJRHMgY3VycmVudGx5IGluIGEgcmV0cnkgYmFja29mZi4gVjIgZXhwb3NlcyBvbmx5IHJ1bm5pbmcvaWRsZSBpblxuICAgIC8vIGBkYXRhLnNlc3Npb24uc3RhdHVzKClgLCBzbyB0aGlzIGlzIHRoZSBvbmx5IHdheSB0byBrZWVwIHRoZSBWMSBcInJldHJ5XCIgc3RhdGUuXG4gICAgY29uc3QgW3JldHJ5aW5nLCBzZXRSZXRyeWluZ10gPSBjcmVhdGVTaWduYWwobmV3IFNldCgpKTtcbiAgICBjb25zdCBtYXJrUmV0cnlpbmcgPSAoc2Vzc2lvbklELCB2YWx1ZSkgPT4ge1xuICAgICAgc2V0UmV0cnlpbmcocHJldmlvdXMgPT4ge1xuICAgICAgICBpZiAocHJldmlvdXMuaGFzKHNlc3Npb25JRCkgPT09IHZhbHVlKSByZXR1cm4gcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KHByZXZpb3VzKTtcbiAgICAgICAgaWYgKHZhbHVlKSBuZXh0LmFkZChzZXNzaW9uSUQpO2Vsc2UgbmV4dC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGlzU3ViYWdlbnQgPSBzZXNzaW9uSUQgPT4gY29udGV4dC5kYXRhLnNlc3Npb24uZ2V0KHNlc3Npb25JRCk/LnBhcmVudElEICE9PSB1bmRlZmluZWQ7XG5cbiAgICAvLyBXaW5kb3dzIHBhdGhzIHJlYWNoIHVzIGFzIGVpdGhlciBgQzpcXGFcXGJgIChUVUkgY3dkKSBvciBgQzovYS9iYCAoc2Vzc2lvblxuICAgIC8vIHJlY29yZHMpLCBzbyBjb21wYXJlIHNsYXNoIHN0eWxlIGFuZCwgb24gV2luZG93cywgY2FzZS1pbnNlbnNpdGl2ZWx5LlxuICAgIGNvbnN0IG5vcm1hbGl6ZVBhdGggPSB2YWx1ZSA9PiB7XG4gICAgICBjb25zdCBzbGFzaGVkID0gdmFsdWUucmVwbGFjZSgvXFxcXC9nLCBcIi9cIikucmVwbGFjZSgvXFwvKyQvLCBcIlwiKTtcbiAgICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBzbGFzaGVkLnRvTG93ZXJDYXNlKCkgOiBzbGFzaGVkO1xuICAgIH07XG4gICAgY29uc3Qgc2FtZUxvY2F0aW9uID0gKGEsIGIpID0+ICFhIHx8ICFiIHx8IG5vcm1hbGl6ZVBhdGgoYSkgPT09IG5vcm1hbGl6ZVBhdGgoYik7XG5cbiAgICAvLyBBIFRVSSBjYW4gYmUgYXR0YWNoZWQgdG8gb25lIGxvY2F0aW9uOyBpZ25vcmUgZXZlbnRzIGZvciBvdGhlciB3b3JrdHJlZXMuXG4gICAgLy8gRXhlY3V0aW9uIGV2ZW50cyBjYXJyeSBubyBgbG9jYXRpb25gLCBzbyBmYWxsIGJhY2sgdG8gdGhlIHNlc3Npb24gcmVjb3JkLlxuICAgIGNvbnN0IGF0VGhpc0xvY2F0aW9uID0gKGV2ZW50LCBzZXNzaW9uSUQpID0+IHtcbiAgICAgIGNvbnN0IGhlcmUgPSBjb250ZXh0LmxvY2F0aW9uPy5kaXJlY3Rvcnk7XG4gICAgICBjb25zdCB0aGVyZSA9IGV2ZW50LmxvY2F0aW9uPy5kaXJlY3RvcnkgPz8gKHNlc3Npb25JRCA/IGNvbnRleHQuZGF0YS5zZXNzaW9uLmdldChzZXNzaW9uSUQpPy5sb2NhdGlvbj8uZGlyZWN0b3J5IDogdW5kZWZpbmVkKTtcbiAgICAgIGNvbnN0IG9rID0gc2FtZUxvY2F0aW9uKGhlcmUsIHRoZXJlKTtcbiAgICAgIGlmICghb2spIGRpYWcoXCJsb2NhdGlvbi1taXNtYXRjaFwiLCB7XG4gICAgICAgIGV2ZW50OiBldmVudC50eXBlLFxuICAgICAgICBoZXJlLFxuICAgICAgICB0aGVyZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2s7XG4gICAgfTtcblxuICAgIC8vIE9ubHkgZGlyZWN0IGNoaWxkcmVuIGNvdW50OiBhIGdyYW5kY2hpbGQgcmVwb3J0cyB0byBpdHMgb3duIHBhcmVudCwgYW5kIHJ1bm5pbmdcbiAgICAvLyBzaGVsbHMgYXJlIGEgZGlmZmVyZW50IGNvbmNlcm4uIE1pcnJvcnMgdGhlIGJ1aWx0LWluIG5vdGlmaWNhdGlvbnMgcGx1Z2luLlxuICAgIGNvbnN0IGhhc1J1bm5pbmdDaGlsZCA9IHNlc3Npb25JRCA9PiBjb250ZXh0LmRhdGEuc2Vzc2lvbi5mYW1pbHkoc2Vzc2lvbklEKS5zb21lKGNoaWxkID0+IGNoaWxkICE9PSBzZXNzaW9uSUQgJiYgY29udGV4dC5kYXRhLnNlc3Npb24uZ2V0KGNoaWxkKT8ucGFyZW50SUQgPT09IHNlc3Npb25JRCAmJiBjb250ZXh0LmRhdGEuc2Vzc2lvbi5zdGF0dXMoY2hpbGQpID09PSBcInJ1bm5pbmdcIik7XG5cbiAgICAvLyAtLS0gTm90aWZpY2F0aW9uIHN0YXRlIC0tLVxuICAgIGNvbnN0IGFjdGl2ZVN1YmFnZW50cyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgcm91bmRDb3VudCA9IDA7XG4gICAgbGV0IHJvdW5kTm90aWZpZWQgPSBmYWxzZTtcbiAgICBjb25zdCB0ZXJtaW5hbCA9IG5ldyBTZXQoKTsgLy8gc2Vzc2lvbklEcyB3aG9zZSBjdXJyZW50IHJ1biB3YXMgYW5ub3VuY2VkXG4gICAgY29uc3QgZXJyb3JlZCA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBwZW5kaW5nRm9ybXMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgcGVuZGluZ1Blcm1pc3Npb25zID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IFBFUk1JU1NJT05fTk9USUZZX0RFTEFZX01TID0gNTAwO1xuICAgIGNvbnN0IHN0YXJ0ZWQgPSBzZXNzaW9uSUQgPT4ge1xuICAgICAgdGVybWluYWwuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBlcnJvcmVkLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgbWFya1JldHJ5aW5nKHNlc3Npb25JRCwgZmFsc2UpO1xuICAgIH07XG4gICAgY29uc3QgZW5kZWQgPSBzZXNzaW9uSUQgPT4ge1xuICAgICAgZGlhZyhcImVuZGVkOmVudGVyXCIsIHtcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICB0ZXJtaW5hbDogdGVybWluYWwuaGFzKHNlc3Npb25JRCksXG4gICAgICAgIGVycm9yZWQ6IGVycm9yZWQuaGFzKHNlc3Npb25JRCksXG4gICAgICAgIHN1YmFnZW50OiBpc1N1YmFnZW50KHNlc3Npb25JRCksXG4gICAgICAgIG5vdGlmeU1haW5TZXNzaW9uXG4gICAgICB9KTtcbiAgICAgIGlmICh0ZXJtaW5hbC5oYXMoc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgdGVybWluYWwuYWRkKHNlc3Npb25JRCk7XG4gICAgICBpZiAoZXJyb3JlZC5oYXMoc2Vzc2lvbklEKSkge1xuICAgICAgICBlcnJvcmVkLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaXNTdWJhZ2VudChzZXNzaW9uSUQpKSByZXR1cm47IC8vIGNvdmVyZWQgYnkgdGhlIGJhdGNoIG5vdGlmaWNhdGlvbiBiZWxvd1xuICAgICAgaWYgKG5vdGlmeU1haW5TZXNzaW9uKSB7XG4gICAgICAgIG5vdGlmeVR1cm5Eb25lKGNvbnRleHQsIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgdW5zdWJzID0gW107XG4gICAgY29uc3QgZW5kZWRTdWJhZ2VudCA9IHNlc3Npb25JRCA9PiB7XG4gICAgICBjb25zdCB0cmFja2VkID0gYWN0aXZlU3ViYWdlbnRzLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgZGlhZyhcImVuZGVkU3ViYWdlbnRcIiwge1xuICAgICAgICBzZXNzaW9uSUQsXG4gICAgICAgIHRyYWNrZWQsXG4gICAgICAgIHJlbWFpbmluZzogYWN0aXZlU3ViYWdlbnRzLnNpemUsXG4gICAgICAgIHJvdW5kTm90aWZpZWQsXG4gICAgICAgIG5vdGlmeVN1YmFnZW50cyxcbiAgICAgICAgcm91bmRDb3VudFxuICAgICAgfSk7XG4gICAgICBpZiAoIXRyYWNrZWQgfHwgYWN0aXZlU3ViYWdlbnRzLnNpemUgPiAwIHx8IHJvdW5kTm90aWZpZWQpIHJldHVybjtcbiAgICAgIHJvdW5kTm90aWZpZWQgPSB0cnVlO1xuICAgICAgaWYgKG5vdGlmeVN1YmFnZW50cykge1xuICAgICAgICBub3RpZnlTdWJhZ2VudHNEb25lKGNvbnRleHQsIHJvdW5kQ291bnQsIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZXRyeSBzdGF0ZTogdGhlIGhvc3Qgb25seSBwcm9qZWN0cyBydW5uaW5nL2lkbGUsIHNvIHRyYWNrIHRoZSB0cmFuc2llbnQgYmFja29mZi5cbiAgICAvLyBPbmx5IHRoZSBzaWRlYmFyIHJlbmRlcnMgaXQsIHNvIHNraXAgdGhlIHN1YnNjcmlwdGlvbiB3aGVuIHRoZSBzZWN0aW9uIGlzIGhpZGRlbi5cbiAgICBpZiAoc2hvd1NpZGViYXIpIHtcbiAgICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24ucmV0cnkuc2NoZWR1bGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKCFhdFRoaXNMb2NhdGlvbihldmVudCkpIHJldHVybjtcbiAgICAgICAgbWFya1JldHJ5aW5nKGV2ZW50LmRhdGEuc2Vzc2lvbklELCB0cnVlKTtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvLyBFeGVjdXRpb24gbGlmZWN5Y2xlLiBUaGlzIGlzIHRoZSBWMiByZXBsYWNlbWVudCBmb3IgdGhlIFYxXG4gICAgLy8gc2Vzc2lvbi5zdGF0dXMgLyBtZXNzYWdlLnBhcnQudXBkYXRlZCBjb21wbGV0aW9uIHNpZ25hbHMuXG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5leGVjdXRpb24uc3RhcnRlZFwiLCBldmVudCA9PiB7XG4gICAgICBjb25zdCBoZXJlID0gYXRUaGlzTG9jYXRpb24oZXZlbnQsIGV2ZW50LmRhdGEuc2Vzc2lvbklEKTtcbiAgICAgIGRpYWcoXCJldmVudDpleGVjdXRpb24uc3RhcnRlZFwiLCB7XG4gICAgICAgIHNlc3Npb25JRDogZXZlbnQuZGF0YS5zZXNzaW9uSUQsXG4gICAgICAgIGxvY2F0aW9uOiBldmVudC5sb2NhdGlvbj8uZGlyZWN0b3J5LFxuICAgICAgICBhdExvY2F0aW9uOiBoZXJlXG4gICAgICB9KTtcbiAgICAgIGlmICghaGVyZSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQuZGF0YS5zZXNzaW9uSUQ7XG4gICAgICBzdGFydGVkKHNlc3Npb25JRCk7XG4gICAgICAvLyBSZWNvcmQgZXZlcnkgc3RhcnQ7IHRoZSByZW5kZXJlciBvbmx5IGtlZXBzIGVudHJpZXMgd2l0aCBhIHBhcmVudElELlxuICAgICAgLy8gVGhpcyBzdGlsbCBjYXRjaGVzIGEgc3ViYWdlbnQgd2hvc2Ugc2Vzc2lvbiBpbmZvIGhhcyBub3QgbGFuZGVkIHlldC5cbiAgICAgIGlmIChzaG93U2lkZWJhcikgbWFya1NlZW4oc2Vzc2lvbklEKTtcbiAgICAgIGlmICghaXNTdWJhZ2VudChzZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBpZiAoYWN0aXZlU3ViYWdlbnRzLnNpemUgPT09IDApIHtcbiAgICAgICAgcm91bmRDb3VudCA9IDA7XG4gICAgICAgIHJvdW5kTm90aWZpZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZVN1YmFnZW50cy5hZGQoc2Vzc2lvbklEKTtcbiAgICAgIHJvdW5kQ291bnQrKztcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5leGVjdXRpb24uc3VjY2VlZGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQsIGV2ZW50LmRhdGEuc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQuZGF0YS5zZXNzaW9uSUQ7XG4gICAgICBjb25zdCBzdWJhZ2VudCA9IGlzU3ViYWdlbnQoc2Vzc2lvbklEKTtcbiAgICAgIGRpYWcoXCJldmVudDpleGVjdXRpb24uc3VjY2VlZGVkXCIsIHtcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICBzdWJhZ2VudCxcbiAgICAgICAgcnVubmluZ0NoaWxkOiBzdWJhZ2VudCA/IHVuZGVmaW5lZCA6IGhhc1J1bm5pbmdDaGlsZChzZXNzaW9uSUQpLFxuICAgICAgICBub3RpZnlNYWluU2Vzc2lvblxuICAgICAgfSk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgICBpZiAoaXNTdWJhZ2VudChzZXNzaW9uSUQpKSB7XG4gICAgICAgIGVuZGVkU3ViYWdlbnQoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gQSBydW5uaW5nIHN1YmFnZW50J3MgcmVwb3J0IHdha2VzIHRoZSBwYXJlbnQgc2Vzc2lvbiBhZ2Fpbjsgd2FpdCBmb3IgaXQuXG4gICAgICBpZiAoaGFzUnVubmluZ0NoaWxkKHNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIGVuZGVkKHNlc3Npb25JRCk7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24uZXhlY3V0aW9uLmZhaWxlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50LCBldmVudC5kYXRhLnNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LmRhdGEuc2Vzc2lvbklEO1xuICAgICAgZGlhZyhcImV2ZW50OmV4ZWN1dGlvbi5mYWlsZWRcIiwge1xuICAgICAgICBzZXNzaW9uSUQsXG4gICAgICAgIHN1YmFnZW50OiBpc1N1YmFnZW50KHNlc3Npb25JRCksXG4gICAgICAgIG5vdGlmeUVycm9yc1xuICAgICAgfSk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgICBlcnJvcmVkLmFkZChzZXNzaW9uSUQpO1xuICAgICAgaWYgKGlzU3ViYWdlbnQoc2Vzc2lvbklEKSkge1xuICAgICAgICBlbmRlZFN1YmFnZW50KHNlc3Npb25JRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmRlZChzZXNzaW9uSUQpO1xuICAgICAgfVxuICAgICAgaWYgKCFub3RpZnlFcnJvcnMpIHJldHVybjtcbiAgICAgIC8vIEEgZmFpbGVkIHJ1biBuZXZlciByZWFjaGVzIHRoZSBcImRvbmVcIiBub3RpZmljYXRpb246IGBlbmRlZGAgYmFpbHMgb3V0IG9uXG4gICAgICAvLyBgZXJyb3JlZGAsIHNvIHRoaXMgaXMgdGhlIG9ubHkgc2lnbmFsIHRoZSB1c2VyIGdldHMgZm9yIGEgYnJva2VuIHR1cm4uXG4gICAgICBjb25zdCBpbmZvID0gY29udGV4dC5kYXRhLnNlc3Npb24uZ2V0KHNlc3Npb25JRCk7XG4gICAgICBjb25zdCBkZXRhaWwgPSBpbmZvPy50aXRsZSB8fCBpbmZvPy5hZ2VudCB8fCB1bmRlZmluZWQ7XG4gICAgICBub3RpZnlTZXNzaW9uRXJyb3IoY29udGV4dCwgaXNTdWJhZ2VudChzZXNzaW9uSUQpID8gXCJzdWJhZ2VudFwiIDogXCJzZXNzaW9uXCIsIGRldGFpbCwgbm90aWZ5R2F0ZSwgbG9jYWxlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24uZXhlY3V0aW9uLmludGVycnVwdGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQsIGV2ZW50LmRhdGEuc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQuZGF0YS5zZXNzaW9uSUQ7XG4gICAgICBkaWFnKFwiZXZlbnQ6ZXhlY3V0aW9uLmludGVycnVwdGVkXCIsIHtcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICBzdWJhZ2VudDogaXNTdWJhZ2VudChzZXNzaW9uSUQpXG4gICAgICB9KTtcbiAgICAgIG1hcmtSZXRyeWluZyhzZXNzaW9uSUQsIGZhbHNlKTtcbiAgICAgIGlmIChpc1N1YmFnZW50KHNlc3Npb25JRCkpIHtcbiAgICAgICAgZW5kZWRTdWJhZ2VudChzZXNzaW9uSUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbmRlZChzZXNzaW9uSUQpO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJzZXNzaW9uLmRlbGV0ZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYgKCFhdFRoaXNMb2NhdGlvbihldmVudCwgZXZlbnQuZGF0YS5zZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5kYXRhLnNlc3Npb25JRDtcbiAgICAgIHRlcm1pbmFsLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgZXJyb3JlZC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGFjdGl2ZVN1YmFnZW50cy5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIG1hcmtSZXRyeWluZyhzZXNzaW9uSUQsIGZhbHNlKTtcbiAgICAgIHNldFNlZW4ocHJldmlvdXMgPT4ge1xuICAgICAgICBpZiAoIXByZXZpb3VzLmhhcyhzZXNzaW9uSUQpKSByZXR1cm4gcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KHByZXZpb3VzKTtcbiAgICAgICAgbmV4dC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICAvLyBJbnRlcnZpZXcgYmxvY2tlZDogVjIgZm9ybXMgcmVwbGFjZSB0aGUgVjEgYHF1ZXN0aW9uYCB0b29sIGV2ZW50cywgYW5kXG4gICAgLy8gcGVybWlzc2lvbnMgc3RpbGwgYXJyaXZlIGFzIHRoZWlyIG93biByZXF1ZXN0L3Jlc3BvbnNlIHBhaXIuXG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwiZm9ybS5jcmVhdGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQsIGV2ZW50LmRhdGEuZm9ybS5zZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBjb25zdCBmb3JtID0gZXZlbnQuZGF0YS5mb3JtO1xuICAgICAgaWYgKCFub3RpZnlJbnRlcnZpZXcgfHwgaXNTdWJhZ2VudChmb3JtLnNlc3Npb25JRCkgfHwgcGVuZGluZ0Zvcm1zLmhhcyhmb3JtLmlkKSkgcmV0dXJuO1xuICAgICAgcGVuZGluZ0Zvcm1zLmFkZChmb3JtLmlkKTtcbiAgICAgIG5vdGlmeUludGVydmlld0lucHV0KGNvbnRleHQsIFwicXVlc3Rpb25cIiwgZm9ybS50aXRsZSwgbm90aWZ5R2F0ZSwgbG9jYWxlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcImZvcm0ucmVwbGllZFwiLCBldmVudCA9PiB7XG4gICAgICBwZW5kaW5nRm9ybXMuZGVsZXRlKGV2ZW50LmRhdGEuaWQpO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJmb3JtLmNhbmNlbGxlZFwiLCBldmVudCA9PiB7XG4gICAgICBwZW5kaW5nRm9ybXMuZGVsZXRlKGV2ZW50LmRhdGEuaWQpO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJwZXJtaXNzaW9uLmFza2VkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHNlc3Npb25JRCxcbiAgICAgICAgYWN0aW9uXG4gICAgICB9ID0gZXZlbnQuZGF0YTtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQsIHNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IGlzU3ViYWdlbnQoc2Vzc2lvbklEKSB8fCBwZW5kaW5nUGVybWlzc2lvbnMuaGFzKGlkKSkgcmV0dXJuO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUoaWQpKSB7XG4gICAgICAgICAgbm90aWZ5SW50ZXJ2aWV3SW5wdXQoY29udGV4dCwgXCJwZXJtaXNzaW9uXCIsIGFjdGlvbiwgbm90aWZ5R2F0ZSwgbG9jYWxlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIFBFUk1JU1NJT05fTk9USUZZX0RFTEFZX01TKTtcbiAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5zZXQoaWQsIHRpbWVyKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwicGVybWlzc2lvbi5yZXBsaWVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gcGVuZGluZ1Blcm1pc3Npb25zLmdldChldmVudC5kYXRhLnJlcXVlc3RJRCk7XG4gICAgICBpZiAoIXRpbWVyKSByZXR1cm47XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLmRlbGV0ZShldmVudC5kYXRhLnJlcXVlc3RJRCk7XG4gICAgfSkpO1xuXG4gICAgLy8gYHNpZGViYXIuc2hvdzogZmFsc2VgIHN0aWxsIHJlZ2lzdGVycyB0aGUgZXZlbnQgcGx1bWJpbmcgYWJvdmUgKG5vdGlmaWNhdGlvbnMga2VlcFxuICAgIC8vIHdvcmtpbmcpIGJ1dCBjb250cmlidXRlcyBub3RoaW5nIHRvIHRoZSBzaWRlYmFyLiBUaGUgb3B0aW9uIGlzIHJlYWQgb25jZSBhdCBzZXR1cCxcbiAgICAvLyBzbyB0aGlzIGlzIGEgc3RhcnR1cC1sZXZlbCBzd2l0Y2gsIG5vdCBhIHJ1bnRpbWUgdG9nZ2xlLlxuICAgIGlmIChzaG93U2lkZWJhcikge1xuICAgICAgY29udGV4dC51aS5zbG90KHtcbiAgICAgICAgLy8gRmlyc3QgaW4gdGhlIHNpZGViYXI6IGEgbGl2ZSBzdGF0dXMgc2VjdGlvbiBtdXN0IHN0YXkgdmlzaWJsZSB3aGVuIHRoZVxuICAgICAgICAvLyBidWlsdC1pbiBDb250ZXh0L01DUC9Ub2RvIGJsb2NrcyBmaWxsIHRoZSBjb2x1bW4uXG4gICAgICAgIHByZXBlbmQ6IFwic2lkZWJhci5jb250ZW50XCIsXG4gICAgICAgIHJlbmRlcjogc2xvdCA9PiBfJGNyZWF0ZUNvbXBvbmVudChTaWRlYmFyLCB7XG4gICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICBnZXQgc2Vzc2lvbklEKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNsb3Quc2Vzc2lvbklEO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmV0cnlpbmc6IHJldHJ5aW5nLFxuICAgICAgICAgIHNlZW46IHNlZW4sXG4gICAgICAgICAgbWFya1NlZW46IG1hcmtTZWVuLFxuICAgICAgICAgIGZvY3VzRGlhZzogZm9jdXNEaWFnLFxuICAgICAgICAgIHNob3dGb2N1czogc2hvd0ZvY3VzLFxuICAgICAgICAgIGxvY2FsZTogbG9jYWxlXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRleHQucmVuZGVyZXIub2ZmKFwiZm9jdXNcIiwgb25Gb2N1cyk7XG4gICAgICBjb250ZXh0LnJlbmRlcmVyLm9mZihcImJsdXJcIiwgb25CbHVyKTtcbiAgICAgIGZvciAoY29uc3QgdGltZXIgb2YgcGVuZGluZ1Blcm1pc3Npb25zLnZhbHVlcygpKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLmNsZWFyKCk7XG4gICAgICB1bnN1YnMucmV2ZXJzZSgpLmZvckVhY2godW5zdWJzY3JpYmUgPT4gdW5zdWJzY3JpYmUoKSk7XG4gICAgfTtcbiAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBwbHVnaW47IiwiLyoqXHJcbiAqIEludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBmb3Igb3BlbmNvZGUtYWdlbnQtcHVsc2UuXHJcbiAqXHJcbiAqIFN1cHBvcnRlZCBsb2NhbGVzOiBFbmdsaXNoIChcImVuXCIsIGRlZmF1bHQpIGFuZCBTaW1wbGlmaWVkIENoaW5lc2UgKFwiemhcIikuXHJcbiAqIFRoZSBsb2NhbGUgaXMgc2VsZWN0ZWQgdmlhIHRoZSBwbHVnaW4gYGxvY2FsZWAgb3B0aW9uICh0dXBsZSBmb3JtKTpcclxuICpcclxuICogICBbXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCB7IFwibG9jYWxlXCI6IFwiemhcIiB9XVxyXG4gKlxyXG4gKiBPbmx5IHVzZXItZmFjaW5nIHN0cmluZ3MgKG5vdGlmaWNhdGlvbiBtZXNzYWdlcyBhbmQgdGhlIHNpZGViYXIgc2VjdGlvbiB0aXRsZSlcclxuICogYXJlIGxvY2FsaXplZDsgaW50ZXJuYWwgc3RhdHVzIGxhYmVscyAoXCJidXN5XCIvXCJpZGxlXCIvXCJyZXRyeVwiL1wiZG9uZVwiKSByZW1haW5cclxuICogRW5nbGlzaCBhcyBzdGFibGUgaWRlbnRpZmllcnMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgTG9jYWxlID0gXCJlblwiIHwgXCJ6aFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlcyB7XHJcbiAgLyoqIFNpZGViYXIgc2VjdGlvbiB0aXRsZS4gKi9cclxuICBzdWJhZ2VudHM6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gYSBiYXRjaCBvZiBzdWJhZ2VudHMgZmluaXNoZXMuICovXHJcbiAgc3ViYWdlbnRzRG9uZTogKGNvdW50OiBudW1iZXIpID0+IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBmaW5pc2hlcyBhIHR1cm4uICovXHJcbiAgdHVybkRvbmU6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBuZWVkcyBhIHBlcm1pc3Npb24gYXBwcm92YWwuICovXHJcbiAgcGVybWlzc2lvblJlcXVpcmVkOiAoZGV0YWlsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIHRoZSBtYWluIHNlc3Npb24gbmVlZHMgYW4gYW5zd2VyIHRvIGEgcXVlc3Rpb24uICovXHJcbiAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIC8qKiBOb3RpZmljYXRpb24gd2hlbiBhIG1haW4tc2Vzc2lvbiBleGVjdXRpb24gZmFpbHMuICovXHJcbiAgc2Vzc2lvbkVycm9yOiAoZGV0YWlsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIGEgc3ViYWdlbnQgZXhlY3V0aW9uIGZhaWxzLiAqL1xyXG4gIHN1YmFnZW50RXJyb3I6IChkZXRhaWw/OiBzdHJpbmcpID0+IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgZGljdGlvbmFyaWVzOiBSZWNvcmQ8TG9jYWxlLCBNZXNzYWdlcz4gPSB7XHJcbiAgZW46IHtcclxuICAgIHN1YmFnZW50czogXCJTdWJhZ2VudHNcIixcclxuICAgIHN1YmFnZW50c0RvbmU6IChjb3VudCkgPT5cclxuICAgICAgY291bnQgPiAxID8gYEFsbCAke2NvdW50fSBzdWJhZ2VudHMgY29tcGxldGVkYCA6IFwiU3ViYWdlbnQgY29tcGxldGVkXCIsXHJcbiAgICB0dXJuRG9uZTogXCJUdXJuIGNvbXBsZXRlZFwiLFxyXG4gICAgcGVybWlzc2lvblJlcXVpcmVkOiAoZGV0YWlsKSA9PlxyXG4gICAgICBkZXRhaWwgPyBgUGVybWlzc2lvbiByZXF1aXJlZDogJHtkZXRhaWx9YCA6IFwiTWFpbiBzZXNzaW9uIHJlcXVpcmVzIHBlcm1pc3Npb25cIixcclxuICAgIHF1ZXN0aW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGBBbnN3ZXIgcmVxdWlyZWQ6ICR7ZGV0YWlsfWAgOiBcIk1haW4gc2Vzc2lvbiByZXF1aXJlcyBhbiBhbnN3ZXJcIixcclxuICAgIHNlc3Npb25FcnJvcjogKGRldGFpbCkgPT4gKGRldGFpbCA/IGBTZXNzaW9uIGZhaWxlZDogJHtkZXRhaWx9YCA6IFwiU2Vzc2lvbiBmYWlsZWRcIiksXHJcbiAgICBzdWJhZ2VudEVycm9yOiAoZGV0YWlsKSA9PiAoZGV0YWlsID8gYFN1YmFnZW50IGZhaWxlZDogJHtkZXRhaWx9YCA6IFwiU3ViYWdlbnQgZmFpbGVkXCIpLFxyXG4gIH0sXHJcbiAgemg6IHtcclxuICAgIHN1YmFnZW50czogXCLlrZAgYWdlbnRcIixcclxuICAgIHN1YmFnZW50c0RvbmU6IChjb3VudCkgPT5cclxuICAgICAgY291bnQgPiAxID8gYOWFqOmDqCAke2NvdW50fSDkuKrlrZAgYWdlbnQg5bey5a6M5oiQYCA6IFwi5a2QIGFnZW50IOW3suWujOaIkFwiLFxyXG4gICAgdHVybkRvbmU6IFwi5pys6L2u5a+56K+d5bey5a6M5oiQXCIsXHJcbiAgICBwZXJtaXNzaW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGDpnIDopoHmnYPpmZDnoa7orqQ6ICR7ZGV0YWlsfWAgOiBcIuS4u+S8muivnemcgOimgeadg+mZkOehruiupFwiLFxyXG4gICAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYOmcgOimgeWbnuetlDogJHtkZXRhaWx9YCA6IFwi5Li75Lya6K+d6ZyA6KaB5Zue562U6K+i6ZeuXCIsXHJcbiAgICBzZXNzaW9uRXJyb3I6IChkZXRhaWwpID0+IChkZXRhaWwgPyBg5Lya6K+d5omn6KGM5aSx6LSlOiAke2RldGFpbH1gIDogXCLkvJror53miafooYzlpLHotKVcIiksXHJcbiAgICBzdWJhZ2VudEVycm9yOiAoZGV0YWlsKSA9PiAoZGV0YWlsID8gYOWtkCBhZ2VudCDmiafooYzlpLHotKU6ICR7ZGV0YWlsfWAgOiBcIuWtkCBhZ2VudCDmiafooYzlpLHotKVcIiksXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKiBOb3JtYWxpemUgYW4gYXJiaXRyYXJ5IG9wdGlvbiB2YWx1ZSBpbnRvIGEgc3VwcG9ydGVkIGxvY2FsZSAoZGVmYXVsdHMgdG8gXCJlblwiKS4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVMb2NhbGUoaW5wdXQ6IHVua25vd24pOiBMb2NhbGUge1xyXG4gIGlmIChpbnB1dCA9PT0gXCJ6aFwiIHx8IGlucHV0ID09PSBcInpoLUNOXCIgfHwgaW5wdXQgPT09IFwiemhfQ05cIiB8fCBpbnB1dCA9PT0gXCJ6aC1IYW5zXCIpIHtcclxuICAgIHJldHVybiBcInpoXCI7XHJcbiAgfVxyXG4gIHJldHVybiBcImVuXCI7XHJcbn1cclxuXHJcbi8qKiBHZXQgdGhlIG1lc3NhZ2UgZGljdGlvbmFyeSBmb3IgYSBsb2NhbGUgKGZhbGxzIGJhY2sgdG8gRW5nbGlzaCkuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0KGxvY2FsZTogTG9jYWxlKTogTWVzc2FnZXMge1xyXG4gIHJldHVybiBkaWN0aW9uYXJpZXNbbG9jYWxlXSA/PyBkaWN0aW9uYXJpZXMuZW47XHJcbn1cclxuIiwiaW1wb3J0IHsgYXBwZW5kRmlsZVN5bmMsIGV4aXN0c1N5bmMgfSBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHsgdG1wZGlyIH0gZnJvbSBcIm5vZGU6b3NcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwibm9kZTpwYXRoXCI7XG5cbi8qKlxuICogVEVNUE9SQVJZIGRpYWdub3N0aWMgY2hhbm5lbCAoZGVidWcgYnVpbGRzIG9ubHkpLlxuICpcbiAqIEVuYWJsZWQgYnkgdGhlIGBkZWJ1ZzogdHJ1ZWAgcGx1Z2luIG9wdGlvbiwgb3Ig4oCUIGZvciBmaWVsZCBkZWJ1Z2dpbmcgd2l0aG91dFxuICogdG91Y2hpbmcgdGhlIHVzZXIncyBjb25maWcg4oCUIGJ5IGNyZWF0aW5nIHRoZSBtYXJrZXIgZmlsZVxuICogYDx0bXA+L29wZW5jb2RlLWFnZW50LXB1bHNlLWRlYnVnLm9uYCBiZWZvcmUgdGhlIHBsdWdpbiAocmUpbG9hZHMuXG4gKlxuICogQXBwZW5kcyBvbmUgbGluZSBwZXIgaW50ZXJlc3Rpbmcgc3RlcCB0byBgPHRtcD4vb3BlbmNvZGUtYWdlbnQtcHVsc2UtZGlhZy5sb2dgXG4gKiBzbyBhIGJ1ZyByZXBvcnQgY2FuIHNob3cgd2hldGhlciBzZXR1cCByYW4sIHdoaWNoIGV2ZW50cyBhcnJpdmVkLCBhbmQgaG93IHRoZVxuICogbm90aWZpY2F0aW9uIGRpc3BhdGNoIHJlc29sdmVkLlxuICovXG5jb25zdCBNQVJLRVIgPSBqb2luKHRtcGRpcigpLCBcIm9wZW5jb2RlLWFnZW50LXB1bHNlLWRlYnVnLm9uXCIpO1xuZXhwb3J0IGNvbnN0IERJQUdfRklMRSA9IGpvaW4odG1wZGlyKCksIFwib3BlbmNvZGUtYWdlbnQtcHVsc2UtZGlhZy5sb2dcIik7XG5cbmxldCBlbmFibGVkID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0RGlhZyhvcHRpb24/OiBib29sZWFuKTogdm9pZCB7XG4gIGVuYWJsZWQgPSBvcHRpb24gPT09IHRydWUgfHwgZXhpc3RzU3luYyhNQVJLRVIpO1xuICBpZiAoZW5hYmxlZCkgZGlhZyhcImRpYWcgZW5hYmxlZFwiLCB7IHBpZDogcHJvY2Vzcy5waWQsIG9wdGlvbjogb3B0aW9uID09PSB0cnVlLCBtYXJrZXI6IGV4aXN0c1N5bmMoTUFSS0VSKSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpYWdFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZW5hYmxlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpYWcoZXZlbnQ6IHN0cmluZywgZGF0YT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gIGlmICghZW5hYmxlZCkgcmV0dXJuO1xuICB0cnkge1xuICAgIGFwcGVuZEZpbGVTeW5jKERJQUdfRklMRSwgYCR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfSBwaWQ9JHtwcm9jZXNzLnBpZH0gJHtldmVudH0ke2RhdGEgPyBcIiBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpIDogXCJcIn1cXG5gKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gZGlhZ25vc3RpY3MgbXVzdCBuZXZlciBicmVhayB0aGUgcGx1Z2luXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXR0ZW50aW9uU291bmQsIENvbnRleHQgfSBmcm9tIFwiQG9wZW5jb2RlL3BsdWdpbi90dWkvY29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBMb2NhbGUgfSBmcm9tIFwiLi9pMThuXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcIi4vaTE4blwiO1xuaW1wb3J0IHsgZGlhZyB9IGZyb20gXCIuL2RpYWdcIjtcblxuLyoqXG4gKiBOb3RpZmljYXRpb24gZGlzcGF0Y2ggZm9yIG9wZW5jb2RlLWFnZW50LXB1bHNlLlxuICpcbiAqIE9uZSBob3N0IGNoYW5uZWwgcGx1cyBhIFdpbmRvd3MgZmFsbGJhY2s6XG4gKlxuICogICAtIEV2ZXJ5IHBsYXRmb3JtIGNhbGxzIGBjb250ZXh0LmF0dGVudGlvbi5ub3RpZnkoKWAgZmlyc3QsIHNvIHRoZSBob3N0J3MgYXR0ZW50aW9uXG4gKiAgICAgZW5hYmxlL2Rpc2FibGUgcG9saWN5IGFuZCBzb3VuZCBjb25maWd1cmF0aW9uIGFwcGx5LiBtYWNPUyBpVGVybTIvR2hvc3R0eSBhbmRcbiAqICAgICBMaW51eCBraXR0eS9mb290IGltcGxlbWVudCB0aGUgT1NDIDkvOTkgcHJvdG9jb2wgdXNlZCBmb3Igc3lzdGVtIG5vdGlmaWNhdGlvbnMuXG4gKiAgIC0gV2luZG93cyBUZXJtaW5hbCBkb2VzIE5PVCBpbXBsZW1lbnQgT1NDIDk5ICsgREVDIDEwMDQgKGtub3duIGlzc3VlICMzNTA1NSksIHNvIHRoZVxuICogICAgIGhvc3QgcmVwb3J0cyBgbm90aWZpY2F0aW9uOiBmYWxzZWAgd2hpbGUgc3RpbGwgcGxheWluZyB0aGUgc291bmQuIEluIHRoYXQgY2FzZSB3ZVxuICogICAgIHBvc3QgYSByZWFsIEFjdGlvbiBDZW50ZXIgdG9hc3QgdGhyb3VnaCBgbm9kZS1ub3RpZmllcmAgKGJ1bmRsZWQgU25vcmVUb2FzdC5leGUpLlxuICogICAgIElmIGF0dGVudGlvbiBpcyBnbG9iYWxseSBkaXNhYmxlZCB3ZSBza2lwIHRoZSBmYWxsYmFjayB0b28uXG4gKlxuICogQWxsIGZ1bmN0aW9ucyBhcmUgYmVzdC1lZmZvcnQ6IGZhaWx1cmVzIGFyZSBzd2FsbG93ZWQgc28gYSBub3RpZmljYXRpb24gcHJvYmxlbSBuZXZlclxuICogYnJlYWtzIHRoZSBwbHVnaW4uXG4gKi9cblxudHlwZSBBcGkgPSBQaWNrPENvbnRleHQsIFwiYXR0ZW50aW9uXCIgfCBcInVpXCI+O1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyBBcHBVc2VyTW9kZWxJRCB1c2VkIGZvciB0aGUgV2luZG93cyB0b2FzdC4gbm9kZS1ub3RpZmllciByZXF1aXJlcyBhbiBBVU1JRCBmb3Jcbi8vIEFjdGlvbiBDZW50ZXIgdG9hc3RzIHRvIGdyb3VwIHByb3Blcmx5IGFuZCBzaG93IGEgZnJpZW5kbHkgYXBwIG5hbWUuXG5jb25zdCBXSU5ET1dTX0FQUF9JRCA9IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIjtcblxuLy8gT3BlbkNvZGUgbG9nbyBhcyBhIFBORyAocHJlLXJlbmRlcmVkIGZyb20gdGhlIFNWRyBpbiBzY3JpcHRzL2dlbi1pY29uLnRzIGF0IDI1NngzMjApLFxuLy8gZW5jb2RlZCBhcyBiYXNlNjQuIFBhc3NlZCB0byBub2RlLW5vdGlmaWVyJ3MgYGljb25gIGZpZWxkIHNvIHRoZSBXaW5kb3dzIEFjdGlvbiBDZW50ZXJcbi8vIHRvYXN0IHNob3dzIHRoZSBPcGVuQ29kZSBsb2dvIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgaWNvbi4gQmVjYXVzZSBub2RlLW5vdGlmaWVyJ3Ncbi8vIFdpbmRvd3MgYnJhbmNoIGV4cGVjdHMgYSBmaWxlIHBhdGggKG5vdCBhIGRhdGEgVVJMKSwgd2UgZGVjb2RlIHRoaXMgdG8gYSB0ZW1wIGZpbGUgYXRcbi8vIGRpc3BhdGNoIHRpbWUgKHNlZSB3aW5kb3dzTm90aWZ5KS5cbmNvbnN0IE9QRU5DT0RFX0lDT05fUE5HX0I2NCA9XG4gIFwiaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVFBQUFBRkFDQVlBQUFCVEtxSUtBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBS1owbEVcIiArXG4gIFwiUVZSNG5PM2RNVzRrUVF4RDBUbEpBYnovRWV5N3laRmpPNU1BUGdIS0YyM3liMDkxaWZya3ZkR2VBUTI4eW1mdzJmNEhhTStBQmg0QUVBRVFcIiArXG4gIFwiME1EekJrQUVRRUFEejA4QUlnQUNHbmpPQUlnQUNHamdPUVFrQWlDZ2dlY3JBQkVBQVEwOG53R0pBQWhvNExrSFFBUkFRQVBQUlNBaUFBSWFcIiArXG4gIFwiZUc0Q0VnRVEwTUJ6RlpnSWdJQUdubGtBSWdBQ0duaUdnWWdBQ0dqZ21RWWtBaUNnZ1djY21BaUFJSjZCUEFBaUFJSVVQd09CSUFmK0NOb3pcIiArXG4gIFwiQ0FBUUFSRFFRTHdCRUFFUTBFRDhCQ0FDSUtDQk9BTWdBaUNnZ1RnRUpBSWdvSUg0Q2tBRVFFQUQ4Um1RQ0lDQUJ1SWVBQkVBQVEzRVJTQWlcIiArXG4gIFwiQUFJYWlKdUFSQUFFTkJCWGdZa0FDR2dnWmdHSUFBaG9JSWFCaUFBSWFDQ21BWWtBQ0dnZ3hvR0pBQWhlL1RPUUIwQUU5U1pJc1FZQTRNQWZcIiArXG4gIFwiUVhzR0FRQWlBQUlhaURjQUlnQUNHb2lmQUVRQUJEUVFad0JFQUFRMEVJZUFSQUFFTkJCZkFZZ0FDR2dnUGdNU0FSRFFRTndESUFJZ29JRzRcIiArXG4gIFwiQ0VRRVFFQURjUk9RQ0lDQUJ1SXFNQkVBQVEzRUxBQVJBQUVOeERBUUVRQUJEY1EwSUJFQUFRM0VPREFSQU1HcmZ3YnlBSWlnM2dRcDFnQUFcIiArXG4gIFwiSFBnamFNOGdBRUFFUUVBRDhRWkFCRUJBQS9FVGdBaUFnQWJpRElBSWdJQUc0aENRQ0lDQUJ1SXJBQkVBQVEzRVowQWlBQUlhaUhzQVJBQUVcIiArXG4gIFwiTkJBWGdZZ0FDR2dnYmdJU0FSRFFRRndGSmdJZ29JR1lCZmhqR0VKVlY4b2g0UUdvNnNvQkV3TEFKZ0ZWZGVXQUNRRUFBQlFBek1wL2dOc0VcIiArXG4gIFwiMm03TzY2NGMwS0EzQUFCUUFERGVBTHdCS0c4QTR5ZUFud0RLVDRCeEJ1QU1RRGtER0llQURnR1ZROER4RmNCWEFPVXJ3UGdNNkRPZzhobHdcIiArXG4gIFwiM0FOd0QwQzVCekF1QXJrSXBGd0VHamNCM1FSVWJnS09xOEN1QWl0WGdjY3NnRmtBWlJaZ0RBTVpCbEtHZ2NZMG9HbEFaUnB3akFNYkIxYkdcIiArXG4gIFwiZ1VjZWdEeUErc3FCbVh4NUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dENkMrY21BbVh4NkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEcUs4Y21NbVhCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JcIiArXG4gIFwiQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQS93REI5OWVYTG40R09YQWYzeXpBNGtQWUZxQUdcIiArXG4gIFwiZ0d6T3dtd1RhTHNac0J0Q09hQkJBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBcIiArXG4gIFwiZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5cIiArXG4gIFwiZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllcIiArXG4gIFwiRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JcIiArXG4gIFwiQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wOXJZQnQ5dDJcIiArXG4gIFwiNEFNaTFBQVFBTmdoSVBOMUF5Z0gvaGYyQnVBbndMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUFcIiArXG4gIFwid0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NcIiArXG4gIFwiRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JcIiArXG4gIFwiV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFcIiArXG4gIFwiYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hcIiArXG4gIFwiVEFnQUFMQnVoTmJlTnVCMmY3Yi9BZHU5TFVBTkFBRUFBQUFDYndEeEJ1QU5BQWo4QklpZkFINENBSUV6Z0RnRGNBWUFCQTRCNHhEUUlTQVFcIiArXG4gIFwiK0FvUVh3RjhCUUFDbndIak02RFBnRURnSGtEY0EzQVBBQWhjQklxTFFDNENBWUdiZ0hFVDBFMUFJSEFWT0s0Q3V3b01CR1lCWWhiQUxBQVFcIiArXG4gIFwiR0FhS1lTRERRRUJnR2pDbUFVMERBb0Z4NEJnSE5nNE1CUElBNUFISUE2Z0hRUTVrVXNnRGtBZFFiMFNKUUU4ZWdFUWdJQkFKOXVRQmlBUURcIiArXG4gIFwiQXBtQVR4NkFURUFnRUFyNjVBRUlCUVVDcWNCUEhvQlVZQ0FRQy83a0FZZ0ZCd0o3QVo0OEFIc0JnTUJpa0NjUHdHSVFJTEFaNk1rRHNCa0lcIiArXG4gIFwiQ0t3R2UvSUFyQVlEQXJzQm56d0F1d0dCd0hMUUp3L0FjbEFnc0IzNHlRT3dIUmdJckFkLzhnQ3NCd2VDWHhEa3dFaXVjV0Rqd01hQnJRY2ZcIiArXG4gIFwiNjhHdEJ3Y0M2OEhIZW5EcndZSEFldkN4SHR4NmNDQ3dIbnlzQjdjZUhBaXNCeC9yd2EwSEJ3THJ3Y2Q2Y092QmdjQjY4TEVlM0hwd0lMQWVcIiArXG4gIFwiZkt3SHR4NGNDS3dISCt2QnJRY0hBdXZCeDNwdzY4R0J3SHJ3c1I3Y2VuQWdzQjU4ckFlM0hod0lyQWNmNjhHdEJ3Y0M2OEhIZW5EcndZSEFcIiArXG4gIFwiT1BCWUQyNDllRDBJY21BbVh4NkFQSUI2SThvRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJcIiArXG4gIFwiQUlFOGdDY1BRQjRBRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJBSUU4Z0NjUFFCNEFcIiArXG4gIFwiRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUJCRHN6a3l3TTQ4Q0MwWjVEQ1ovRFovZ2RvejRBR0hnQVFBUkRRd1BNR1FBUkFcIiArXG4gIFwiUUFQUFR3QWlBQUlhZU00QWlBQUlhT0E1QkNRQ0lLQ0I1eXNBRVFBQkRUeWZBWWtBQ0dqZ3VRZEFCRUJBQTg5RklDSUFBaHA0YmdJU0FSRFFcIiArXG4gIFwid0hNVm1BaUFnQWFlV1FBaUFBSWFlSWFCaUFBSWFPQ1pCaVFDSUtDQlp4eVlDSUFnbm9FOEFDSUFnaFEvQTRFZ0IvNEkyak1JQUJBQkVOQkFcIiArXG4gIFwidkFFUUFSRFFRUHdFSUFJZ29JRTRBeUFDSUtDQk9BUWtBaUNnZ2ZnS1FBUkFRQVB4R1pBSWdJQUc0aDRBRVFBQkRjUkZJQ0lBQWhxSW00QkVcIiArXG4gIFwiQUFRMEVGZUJpUUFJYUNCbUFZZ0FDR2dnaG9HSUFBaG9JS1lCaVFBSWFDREdnWWtBQ0Y3OU01QUhRQVQxSmtpeEJnRGd3QjlCZXdZQkFDSUFcIiArXG4gIFwiQWhxSU53QWlBQUlhaUo4QVJBQUVOQkJuQUVRQUJEUVFoNEJFQUFRMEVGOEJpQUFJYUNBK0F4SUJFTkJBM0FNZ0FpQ2dnYmdJUkFSQVFBTnhcIiArXG4gIFwiRTVBSWdJQUc0aW93RVFBQkRjUXNBQkVBQVEzRU1CQVJBQUVOeERRZ0VRQUJEY1E0TUJFQXdhdC9CdklBaUtEZUJDbldBQUFjK0NOb3p5QUFcIiArXG4gIFwiUUFSQVFBUHhCa0FFUUVBRDhST0FDSUNBQnVJTWdBaUFnQWJpRUpBSWdJQUc0aXNBRVFBQkRjUm5RQ0lBQWhxSWV3QkVBQVEwRUJlQmlBQUlcIiArXG4gIFwiYUNCdUFoSUJFTkJBWEFVbUFpQ2dnZnp4REg0QTF0bmR4Ykx5d2QwQUFBQUFTVVZPUks1Q1lJST1cIjtcblxuaW50ZXJmYWNlIE5vdGlmeVBheWxvYWQge1xuICB0aXRsZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIC8qKiBTb3VuZCB1c2VkIG9uIHRoZSBub24tV2luZG93cyBwYXRoIChgYXBpLmF0dGVudGlvbi5ub3RpZnlgKS4gKi9cbiAgc291bmQ6IEF0dGVudGlvblNvdW5kO1xufVxuXG4vKipcbiAqIE9wdGlvbmFsIGZvY3VzIGdhdGUgYXBwbGllZCBiZWZvcmUgZGlzcGF0Y2hpbmcgYSBub3RpZmljYXRpb24uIExldHMgdGhlIHVzZXIgb3B0IGludG9cbiAqIFwibm90aWZ5IG9ubHkgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGlzIHVuZm9jdXNlZFwiIHNvIG5vdGlmaWNhdGlvbnMgZG9uJ3QgZmlyZSB3aGlsZVxuICogdGhleSBhcmUgYWN0aXZlbHkgd2F0Y2hpbmcgdGhlIFRVSS5cbiAqXG4gKiBUaGUgZ2F0ZSBpcyBldmFsdWF0ZWQgb24gZXZlcnkgZGlzcGF0Y2ggKG5vdCBvbmNlIGF0IHNldHVwKSBiZWNhdXNlIHRoZSBkZWZlcnJlZFxuICogcGVybWlzc2lvbiBub3RpZmljYXRpb24gaXMgc2VudCBmcm9tIGEgdGltZXIgYW5kIHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIG11c3QgYmUgcmVhZFxuICogYXQgdGhhdCBtb21lbnQuXG4gKi9cbmV4cG9ydCB0eXBlIE5vdGlmeUdhdGUgPSB7XG4gIC8qKiBXaGVuIHRydWUsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24gd2hpbGUgdGhlIHRlcm1pbmFsIGlzIGZvY3VzZWQuICovXG4gIG9ubHlXaGVuVW5mb2N1c2VkOiBib29sZWFuO1xuICAvKiogQ3VycmVudCB0ZXJtaW5hbCBmb2N1cyBzdGF0ZTsgYHVuZGVmaW5lZGAgd2hlbiB1bmtub3duIChlLmcuIHRoZSB0ZXJtaW5hbCBkb2VzIG5vdFxuICAgKiAgcmVwb3J0IGZvY3VzIGV2ZW50cyDigJQgV2luZG93cyBUZXJtaW5hbCBpcyBhIGtub3duIGNhc2UpLiBVbmtub3duIGZvY3VzIGRlZ3JhZGVzIHRvXG4gICAqICBkaXNwYXRjaGluZyBzbyBhbiBvcHRlZC1pbiBub3RpZmljYXRpb24gaXMgbmV2ZXIgc2lsZW50bHkgbG9zdC4gUmVhZCBsYXppbHkgb24gZWFjaFxuICAgKiAgZGlzcGF0Y2ggYmVjYXVzZSB0aGUgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb24gZmlyZXMgZnJvbSBhIHRpbWVyLiBNYXkgYmVcbiAgICogIGFzeW5jICh0aGUgV2luZG93cyBmYWxsYmFjayBxdWVyaWVzIHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyB2aWEgUG93ZXJTaGVsbCkuICovXG4gIGZvY3VzZWQ6ICgpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+O1xufTtcblxuLy8gRGVjb2RlIHRoZSBlbWJlZGRlZCBPcGVuQ29kZSBQTkcgb25jZSBwZXIgcHJvY2VzcyBhbmQgcmV1c2UgaXQgZm9yIGV2ZXJ5IHRvYXN0LlxuLy8gQSBzdGFibGUgcGF0aCBhbHNvIGF2b2lkcyBsZWFraW5nIG9uZSB0ZW1wIGZpbGUgcGVyIG5vdGlmaWNhdGlvbiBpZiB0aGVcbi8vIG5vZGUtbm90aWZpZXIgY2FsbGJhY2sgbmV2ZXIgZmlyZXMuXG5sZXQgd2luZG93c0ljb246IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB8IHVuZGVmaW5lZDtcbmZ1bmN0aW9uIGVuc3VyZVdpbmRvd3NJY29uKCk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gIHdpbmRvd3NJY29uID8/PSAoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHdyaXRlRmlsZSB9ID0gYXdhaXQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKTtcbiAgICAgIGNvbnN0IG9zID0gYXdhaXQgaW1wb3J0KFwibm9kZTpvc1wiKTtcbiAgICAgIGNvbnN0IHBhdGggPSBhd2FpdCBpbXBvcnQoXCJub2RlOnBhdGhcIik7XG4gICAgICBjb25zdCBpY29uUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYG9wZW5jb2RlLXB1bHNlLSR7cHJvY2Vzcy5waWR9LnBuZ2ApO1xuICAgICAgYXdhaXQgd3JpdGVGaWxlKGljb25QYXRoLCBCdWZmZXIuZnJvbShPUEVOQ09ERV9JQ09OX1BOR19CNjQsIFwiYmFzZTY0XCIpKTtcbiAgICAgIHJldHVybiBpY29uUGF0aDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGJlc3QtZWZmb3J0OyBmYWxsIGJhY2sgdG8gbm8gaWNvbiBpZiB0aGUgdGVtcCBmaWxlIGNvdWxkIG5vdCBiZSB3cml0dGVuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSkoKTtcbiAgcmV0dXJuIHdpbmRvd3NJY29uO1xufVxuXG5hc3luYyBmdW5jdGlvbiB3aW5kb3dzTm90aWZ5KHBheWxvYWQ6IE5vdGlmeVBheWxvYWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gbm9kZS1ub3RpZmllciBpcyBtYXJrZWQgZXh0ZXJuYWwgaW4gdGhlIGJ1aWxkIHNvIGl0IHJlc29sdmVzIGZyb21cbiAgLy8gbm9kZV9tb2R1bGVzIGF0IHJ1bnRpbWUgcmF0aGVyIHRoYW4gYmVpbmcgYnVuZGxlZC4gT24gV2luZG93cyBpdCBwb3N0cyBhIHJlYWxcbiAgLy8gQWN0aW9uIENlbnRlciB0b2FzdCB2aWEgdGhlIGJ1bmRsZWQgU25vcmVUb2FzdC5leGUuIER5bmFtaWMgaW1wb3J0IGtlZXBzIHRoZVxuICAvLyBtb2R1bGUgbG9hZCBmcm9tIGZhaWxpbmcgdGhlIHdob2xlIHBsdWdpbiBpZiBub2RlLW5vdGlmaWVyIGlzIHVuYXZhaWxhYmxlLlxuICB0cnkge1xuICAgIGNvbnN0IG1vZCA9IGF3YWl0IGltcG9ydChcIm5vZGUtbm90aWZpZXJcIik7XG4gICAgY29uc3QgaWNvblBhdGggPSBhd2FpdCBlbnN1cmVXaW5kb3dzSWNvbigpO1xuICAgIGNvbnN0IG5vdGlmaWVyID0gKG1vZCBhcyB7IGRlZmF1bHQ/OiB1bmtub3duIH0pLmRlZmF1bHQgPz8gbW9kO1xuICAgIChub3RpZmllciBhcyB7IG5vdGlmeTogKG9wdHM6IHVua25vd24sIGNiOiAoZXJyOiBFcnJvciB8IG51bGwsIHJlc3BvbnNlOiBzdHJpbmcpID0+IHZvaWQpID0+IHZvaWQgfSkubm90aWZ5KFxuICAgICAge1xuICAgICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgICAgbWVzc2FnZTogcGF5bG9hZC5tZXNzYWdlLFxuICAgICAgICBhcHBJRDogV0lORE9XU19BUFBfSUQsXG4gICAgICAgIC4uLihpY29uUGF0aCA/IHsgaWNvbjogaWNvblBhdGggfSA6IHt9KSxcbiAgICAgICAgLy8gVGhlIGhvc3QgYXR0ZW50aW9uIGNoYW5uZWwgYWxyZWFkeSBwbGF5cyB0aGUgY29uZmlndXJlZCBzb3VuZDsgdGhlXG4gICAgICAgIC8vIFdpbmRvd3MgZmFsbGJhY2sgb25seSBuZWVkcyB0byBzdXBwbHkgdGhlIG1pc3Npbmcgc3lzdGVtIHRvYXN0LlxuICAgICAgICBzb3VuZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgKGVycm9yLCByZXNwb25zZSkgPT4gZGlhZyhcIndpbmRvd3NOb3RpZnk6Y2FsbGJhY2tcIiwgeyBlcnJvcjogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbnVsbCwgcmVzcG9uc2UgfSksXG4gICAgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBiZXN0LWVmZm9ydDsgYSBmYWlsZWQgdG9hc3QgbXVzdCBuZXZlciBicmVhayB0aGUgcGx1Z2luXG4gICAgZGlhZyhcIndpbmRvd3NOb3RpZnk6ZXJyb3JcIiwgeyBlcnJvcjogU3RyaW5nKGVycm9yKSB9KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBidWlsdGluTm90aWZ5KGFwaTogQXBpLCBwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaS5hdHRlbnRpb24ubm90aWZ5KHtcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgbWVzc2FnZTogcGF5bG9hZC5tZXNzYWdlLFxuICAgICAgbm90aWZpY2F0aW9uOiB7IHdoZW46IFwiYWx3YXlzXCIgfSxcbiAgICAgIHNvdW5kOiBwYXlsb2FkLnNvdW5kLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGJlc3QtZWZmb3J0OyBhIGZhaWxlZCBub3RpZmljYXRpb24gbXVzdCBuZXZlciBicmVhayB0aGUgcGx1Z2luXG4gICAgZGlhZyhcImJ1aWx0aW5Ob3RpZnk6ZXJyb3JcIiwgeyBlcnJvcjogU3RyaW5nKGVycm9yKSB9KTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRpc3BhdGNoKGFwaTogQXBpLCBwYXlsb2FkOiBOb3RpZnlQYXlsb2FkLCBnYXRlPzogTm90aWZ5R2F0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBmb2N1c2VkID0gZ2F0ZT8ub25seVdoZW5VbmZvY3VzZWQgPyBhd2FpdCBnYXRlLmZvY3VzZWQoKSA6IHVuZGVmaW5lZDtcbiAgZGlhZyhcImRpc3BhdGNoXCIsIHtcbiAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICBtZXNzYWdlOiBwYXlsb2FkLm1lc3NhZ2UsXG4gICAgb25seVdoZW5VbmZvY3VzZWQ6IGdhdGU/Lm9ubHlXaGVuVW5mb2N1c2VkLFxuICAgIGZvY3VzZWQsXG4gIH0pO1xuICBpZiAoZ2F0ZT8ub25seVdoZW5VbmZvY3VzZWQgJiYgZm9jdXNlZCA9PT0gdHJ1ZSkge1xuICAgIC8vIFRlcm1pbmFsIGlzIGZvY3VzZWQgLT4gdGhlIHVzZXIgaXMgd2F0Y2hpbmcsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24uXG4gICAgLy8gVW5rbm93biBmb2N1cyAobm8gZm9jdXMgZXZlbnRzLCBlLmcuIFdpbmRvd3MgVGVybWluYWwpIHN0aWxsIGRpc3BhdGNoZXMuXG4gICAgZGlhZyhcImRpc3BhdGNoOnN1cHByZXNzZWQtZm9jdXNlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gTGV0IHRoZSBob3N0IGFwcGx5IGl0cyBhdHRlbnRpb24gcG9saWN5IChlbmFibGVkL2Rpc2FibGVkLCBzb3VuZCwgZm9jdXMpXG4gIC8vIGV2ZXJ5d2hlcmUsIGluY2x1ZGluZyBXaW5kb3dzLiBPbiBXaW5kb3dzIHRoZSBub3RpZmljYXRpb24gY2hhbm5lbCBpc1xuICAvLyBzaWxlbnRseSBkcm9wcGVkIGJ5IHVuc3VwcG9ydGVkIHRlcm1pbmFscywgc28gZmFsbCBiYWNrIHRvIGEgcmVhbCB0b2FzdC5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYnVpbHRpbk5vdGlmeShhcGksIHBheWxvYWQpO1xuICBkaWFnKFxuICAgIFwiZGlzcGF0Y2g6YnVpbHRpbi1yZXN1bHRcIixcbiAgICByZXN1bHRcbiAgICAgID8geyBvazogcmVzdWx0Lm9rLCBub3RpZmljYXRpb246IHJlc3VsdC5ub3RpZmljYXRpb24sIHNvdW5kOiByZXN1bHQuc291bmQsIHNraXBwZWQ6IHJlc3VsdC5za2lwcGVkIH1cbiAgICAgIDogeyByZXN1bHQ6IFwidW5kZWZpbmVkXCIgfSxcbiAgKTtcbiAgLy8gT24gV2luZG93cyB0aGUgaG9zdCBjaGFubmVsIG9ubHkgcXVldWVzIGFuIE9TQyBzZXF1ZW5jZTogYHRyaWdnZXJOb3RpZmljYXRpb25gXG4gIC8vIHJlcG9ydHMgc3VjY2VzcyBhcyBzb29uIGFzIHRoZSBieXRlcyBhcmUgd3JpdHRlbiwgZXZlbiBpbiBXaW5kb3dzIFRlcm1pbmFsLFxuICAvLyB3aGljaCBjYW5ub3QgZGlzcGxheSBPU0MgOS85OS4gTmV2ZXIgdHJ1c3QgYHJlc3VsdC5ub3RpZmljYXRpb25gIHRoZXJlIOKAlFxuICAvLyB1bmxlc3MgYXR0ZW50aW9uIGlzIGdsb2JhbGx5IGRpc2FibGVkLCBhbHdheXMgcG9zdCBhIHJlYWwgQWN0aW9uIENlbnRlciB0b2FzdC5cbiAgaWYgKElTX1dJTkRPV1MgJiYgcmVzdWx0Py5za2lwcGVkICE9PSBcImF0dGVudGlvbl9kaXNhYmxlZFwiKSB7XG4gICAgZGlhZyhcImRpc3BhdGNoOndpbmRvd3MtZmFsbGJhY2tcIiwge1xuICAgICAgaG9zdE5vdGlmaWNhdGlvbjogcmVzdWx0Py5ub3RpZmljYXRpb24gPz8gbnVsbCxcbiAgICAgIGhvc3RTa2lwcGVkOiByZXN1bHQ/LnNraXBwZWQgPz8gbnVsbCxcbiAgICB9KTtcbiAgICBhd2FpdCB3aW5kb3dzTm90aWZ5KHBheWxvYWQpO1xuICB9XG59XG5cbi8qKiBOb3RpZnkgdGhhdCBhIGJhdGNoIG9mIHN1YmFnZW50cyBmaW5pc2hlZC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlTdWJhZ2VudHNEb25lKFxuICBhcGk6IEFwaSxcbiAgY291bnQ6IG51bWJlcixcbiAgZ2F0ZT86IE5vdGlmeUdhdGUsXG4gIGxvY2FsZTogTG9jYWxlID0gXCJlblwiLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTogdChsb2NhbGUpLnN1YmFnZW50c0RvbmUoY291bnQpLFxuICAgICAgc291bmQ6IHsgbmFtZTogXCJzdWJhZ2VudF9kb25lXCIgfSxcbiAgICB9LFxuICAgIGdhdGUsXG4gICk7XG59XG5cbi8qKiBOb3RpZnkgdGhhdCB0aGUgY3VycmVudCB0dXJuIChtYWluLWFnZW50IHJvdW5kKSBoYXMgZmluaXNoZWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5VHVybkRvbmUoYXBpOiBBcGksIGdhdGU/OiBOb3RpZnlHYXRlLCBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6IHQobG9jYWxlKS50dXJuRG9uZSxcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwiZG9uZVwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKipcbiAqIE5vdGlmeSB0aGF0IGEgc2Vzc2lvbiBydW4gZW5kZWQgaW4gZmFpbHVyZS5cbiAqXG4gKiBVbmxpa2UgdGhlIFwiZG9uZVwiIG5vdGlmaWNhdGlvbnMgdGhpcyBpcyBub3QgYW4gb3B0LWluIGR1cGxpY2F0ZSBvZiB0aGUgaG9zdCdzXG4gKiBidWlsdC1pbiBub3RpZmllcjogT3BlbkNvZGUgMi54J3MgYG9wZW5jb2RlLm5vdGlmaWNhdGlvbnNgIHBsdWdpbiBpcyB0eXBpY2FsbHlcbiAqIGRpc2FibGVkIHNvIHRoaXMgcGx1Z2luIG93bnMgdGhlIHdob2xlIG5vdGlmaWNhdGlvbiBzdXJmYWNlLCBhbmQgaXQgaGFzIHRvXG4gKiBjb3ZlciBlcnJvcnMgaXRzZWxmLiBTdWJhZ2VudCBmYWlsdXJlcyBhcmUgc3VyZmFjZWQgc2VwYXJhdGVseSBiZWNhdXNlIHRoZVxuICogcGFyZW50IHR1cm4gbWF5IHN0aWxsIGZpbmlzaCBzdWNjZXNzZnVsbHkgYWZ0ZXJ3YXJkcy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeVNlc3Npb25FcnJvcihcbiAgYXBpOiBBcGksXG4gIGtpbmQ6IFwic2Vzc2lvblwiIHwgXCJzdWJhZ2VudFwiLFxuICBkZXRhaWw/OiBzdHJpbmcsXG4gIGdhdGU/OiBOb3RpZnlHYXRlLFxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtZXNzYWdlcyA9IHQobG9jYWxlKTtcbiAgYXdhaXQgZGlzcGF0Y2goXG4gICAgYXBpLFxuICAgIHtcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXG4gICAgICBtZXNzYWdlOiBraW5kID09PSBcInN1YmFnZW50XCIgPyBtZXNzYWdlcy5zdWJhZ2VudEVycm9yKGRldGFpbCkgOiBtZXNzYWdlcy5zZXNzaW9uRXJyb3IoZGV0YWlsKSxcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwiZXJyb3JcIiB9LFxuICAgIH0sXG4gICAgZ2F0ZSxcbiAgKTtcbn1cblxuLyoqIFdoYXQga2luZCBvZiB1c2VyIGludGVyYWN0aW9uIGlzIGJsb2NraW5nIHRoZSBtYWluIHNlc3Npb24uICovXG5leHBvcnQgdHlwZSBJbnRlcnZpZXdLaW5kID0gXCJxdWVzdGlvblwiIHwgXCJwZXJtaXNzaW9uXCI7XG4vKipcbiAqIE5vdGlmeSB0aGF0IHRoZSBtYWluIHNlc3Npb24gaXMgYmxvY2tlZCB3YWl0aW5nIGZvciB1c2VyIGlucHV0IChhbiBpbnRlcnZpZXc6XG4gKiB0aGUgYHF1ZXN0aW9uYCB0b29sIGFza2luZyB0aGUgdXNlciBzb21ldGhpbmcsIG9yIGEgcGVybWlzc2lvbi9hcHByb3ZhbCBwcm9tcHQpLlxuICogVGhlc2UgYXJlIHRoZSB0d28gd2F5cyBhbiBhZ2VudCB0dXJuIGlzIHN1c3BlbmRlZCBtaWQtcnVuIG9uIHVzZXIgaW50ZXJhY3Rpb24uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlJbnRlcnZpZXdJbnB1dChcbiAgYXBpOiBBcGksXG4gIGtpbmQ6IEludGVydmlld0tpbmQsXG4gIGRldGFpbD86IHN0cmluZyxcbiAgZ2F0ZT86IE5vdGlmeUdhdGUsXG4gIGxvY2FsZTogTG9jYWxlID0gXCJlblwiLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gdChsb2NhbGUpO1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6XG4gICAgICAgIGtpbmQgPT09IFwicGVybWlzc2lvblwiXG4gICAgICAgICAgPyBtZXNzYWdlcy5wZXJtaXNzaW9uUmVxdWlyZWQoZGV0YWlsKVxuICAgICAgICAgIDogbWVzc2FnZXMucXVlc3Rpb25SZXF1aXJlZChkZXRhaWwpLFxuICAgICAgc291bmQ6IGtpbmQgPT09IFwicGVybWlzc2lvblwiID8geyBuYW1lOiBcInBlcm1pc3Npb25cIiB9IDogeyBuYW1lOiBcInF1ZXN0aW9uXCIgfSxcbiAgICB9LFxuICAgIGdhdGUsXG4gICk7XG59XG5cbi8qKiBJbi1hcHAgdG9hc3QgZmFsbGJhY2sgKHdvcmtzIG9uIGV2ZXJ5IHBsYXRmb3JtKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2FzdChhcGk6IEFwaSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgYXBpLnVpLnRvYXN0LnNob3coeyB2YXJpYW50OiBcImluZm9cIiwgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIiwgbWVzc2FnZSB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gYmVzdC1lZmZvcnRcbiAgfVxufVxuXG4vKiogVHJ1ZSB3aGVuIHJ1bm5pbmcgb24gV2luZG93cyAodXNlZCB0byBkZWNpZGUgdGhlIGRlbGl2ZXJ5IHBhdGgpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV2luZG93cygpOiBib29sZWFuIHtcbiAgcmV0dXJuIElTX1dJTkRPV1M7XG59XG4iLCIvKipcbiAqIFdpbmRvd3Mtb25seSBsaXZlIHRlcm1pbmFsIGZvY3VzIGRldGVjdGlvbi5cbiAqXG4gKiBCYWNrZ3JvdW5kOiBvbiBXaW5kb3dzIHRoZSByZW5kZXJlcidzIGZvY3VzL2JsdXIgZXZlbnRzIChERUMgMTAwNCBmb2N1cyByZXBvcnRpbmcgdmlhXG4gKiBDb25QVFkpIGFyZSB1bnJlbGlhYmxlIOKAlCB0aGUgZm9jdXMtaW4gc2VxdWVuY2UgbWF5IGFycml2ZSBhdCBzdGFydHVwIHdoaWxlIHRoZVxuICogZm9jdXMtb3V0IG5ldmVyIGRvZXMsIHdoaWNoIGxlYXZlcyB0aGUgcGx1Z2luIHN0dWNrIGJlbGlldmluZyB0aGUgdGVybWluYWwgaXMgZm9jdXNlZFxuICogYW5kIHN1cHByZXNzaW5nIGV2ZXJ5IG5vdGlmaWNhdGlvbi4gV2UgdGhlcmVmb3JlIGJ5cGFzcyB0aGUgZXZlbnQgc3RyZWFtIG9uIFdpbmRvd3NcbiAqIGFuZCBxdWVyeSB0aGUgZm9yZWdyb3VuZCB3aW5kb3cgZGlyZWN0bHk6XG4gKlxuICogICAtIFRoZSB3aW5kb3cgb2YgdGhlIHRlcm1pbmFsIGhvc3RpbmcgdGhpcyBwbHVnaW4gYmVsb25ncyB0byBhIHByb2Nlc3MgdGhhdCBpcyBhblxuICogICAgIGFuY2VzdG9yIG9mIG91ciBvd24gcHJvY2VzcyAoZS5nLiBXaW5kb3dzIFRlcm1pbmFsIC0+IHNoZWxsIC0+IG9wZW5jb2RlKS5cbiAqICAgLSBXaGVuIHRoYXQgdGVybWluYWwgaXMgZm9jdXNlZCwgdGhlIGZvcmVncm91bmQgd2luZG93J3Mgb3duaW5nIFBJRCBpcyBpbiBvdXJcbiAqICAgICBhbmNlc3RvciBjaGFpbi5cbiAqICAgLSBXaGVuIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYXBwLCB0aGUgZm9yZWdyb3VuZCBQSUQgaXMgbm90IGFuIGFuY2VzdG9yLlxuICpcbiAqIFR3byBiYWNrZW5kcyBhcmUgdXNlZDpcbiAqICAgLSBgYnVuOmZmaWAgKGZhc3QsIHN5bmNocm9ub3VzKSB3aGVuIHRoZSBydW50aW1lIHN1cHBvcnRzIGl0IOKAlCB2ZXJpZmllZCB3b3JraW5nIGluXG4gKiAgICAgc3RhbmRhbG9uZSBCdW4tY29tcGlsZWQgYmluYXJpZXMuXG4gKiAgIC0gUG93ZXJTaGVsbCAoYEdldEZvcmVncm91bmRXaW5kb3dgIC8gYFdpbjMyX1Byb2Nlc3NgKSBhcyBhIHBvcnRhYmxlIGZhbGxiYWNrIHRoYXRcbiAqICAgICB3b3JrcyBpbiBhbnkgcnVudGltZSAoTm9kZSBvciBCdW4pIHNpbmNlIGl0IG9ubHkgbmVlZHMgYG5vZGU6Y2hpbGRfcHJvY2Vzc2AuXG4gKlxuICogSWYgbmVpdGhlciBiYWNrZW5kIGlzIGF2YWlsYWJsZSB0aGUgbW9kdWxlIGRlZ3JhZGVzIHRvIFwidW5rbm93blwiIGFuZCB0aGUgY2FsbGVyIGZhbGxzXG4gKiBiYWNrIHRvIHRoZSByZW5kZXJlciBldmVudCBzdGF0ZS5cbiAqL1xuXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJub2RlOmNoaWxkX3Byb2Nlc3NcIjtcblxuY29uc3QgSVNfV0lORE9XUyA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuLy8gNTY4IGJ5dGVzID0gc2l6ZW9mKFBST0NFU1NFTlRSWTMyVykgb24geDY0IChVTE9OR19QVFIgZmllbGQgZm9yY2VzIDgtYnl0ZSBhbGlnbm1lbnQpLlxuLy8gV3JvbmcgZHdTaXplIG1ha2VzIFByb2Nlc3MzMkZpcnN0VyBmYWlsIHdpdGggRVJST1JfQkFEX0xFTkdUSCwgd2hpY2ggd2UgdHJlYXQgYXNcbi8vIFwidW5rbm93blwiIGFuZCBmYWxsIGJhY2sgZ3JhY2VmdWxseS5cbmNvbnN0IFBST0NFU1NFTlRSWTMyV19TSVpFID0gNTY4O1xuY29uc3QgT0ZGU0VUX1RIMzJfUFJPQ0VTU19JRCA9IDg7XG5jb25zdCBPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCA9IDMyO1xuXG50eXBlIEJhY2tlbmQgPSBcImZmaVwiIHwgXCJwb3dlcnNoZWxsXCIgfCBcIm5vbmVcIjtcblxubGV0IGJhY2tlbmQ6IEJhY2tlbmQgPSBcIm5vbmVcIjtcbmxldCBhbmNlc3RvcnMgPSBuZXcgU2V0PG51bWJlcj4oKTtcbmxldCBmZmlGb3JlZ3JvdW5kUGlkOiAoKCkgPT4gbnVtYmVyIHwgdW5kZWZpbmVkKSB8IHVuZGVmaW5lZDtcblxuLy8gTGl2ZSBzdGF0dXMgc3VyZmFjZSwgcmVuZGVyZWQgaW50byB0aGUgc2lkZWJhciBmb3IgZGVidWdnaW5nIHRoZSBmb2N1cyBnYXRlLlxuZXhwb3J0IHR5cGUgRm9jdXNTdGF0dXMgPSB7XG4gIGJhY2tlbmQ6IEJhY2tlbmQ7XG4gIGFuY2VzdG9yQ291bnQ6IG51bWJlcjtcbiAgbGFzdEZvcmVncm91bmRQaWQ/OiBudW1iZXI7XG4gIGxhc3RSZXN1bHQ/OiBib29sZWFuO1xuICBsYXN0RXJyb3I/OiBzdHJpbmc7XG59O1xubGV0IHN0YXR1czogRm9jdXNTdGF0dXMgPSB7IGJhY2tlbmQ6IFwibm9uZVwiLCBhbmNlc3RvckNvdW50OiAwIH07XG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9jdXNTdGF0dXMoKTogRm9jdXNTdGF0dXMge1xuICByZXR1cm4gc3RhdHVzO1xufVxuXG5mdW5jdGlvbiBydW5Qb3dlclNoZWxsKHNjcmlwdDogc3RyaW5nLCB0aW1lb3V0TXMgPSA4MDAwKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgbGV0IGNoaWxkO1xuICAgIHRyeSB7XG4gICAgICBjaGlsZCA9IHNwYXduKFwicG93ZXJzaGVsbC5leGVcIiwgW1wiLU5vUHJvZmlsZVwiLCBcIi1Ob25JbnRlcmFjdGl2ZVwiLCBcIi1Db21tYW5kXCIsIHNjcmlwdF0sIHtcbiAgICAgICAgd2luZG93c0hpZGU6IHRydWUsXG4gICAgICAgIHN0ZGlvOiBbXCJpZ25vcmVcIiwgXCJwaXBlXCIsIFwicGlwZVwiXSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNoaWxkLmtpbGwoKTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICAgIHJlc29sdmUoXCJcIik7XG4gICAgfSwgdGltZW91dE1zKTtcbiAgICBjaGlsZC5zdGRvdXQ/Lm9uKFwiZGF0YVwiLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xuICAgICAgb3V0ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgY2hpbGQub24oXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICB9KTtcbiAgICBjaGlsZC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXNvbHZlKG91dC50cmltKCkpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqIENvbXB1dGUgb3VyIGFuY2VzdG9yIFBJRCBjaGFpbiB2aWEgUG93ZXJTaGVsbCAoV2luMzJfUHJvY2VzcyBwYXJlbnQgd2FsaykuICovXG5hc3luYyBmdW5jdGlvbiBhbmNlc3RvcnNWaWFQb3dlclNoZWxsKCk6IFByb21pc2U8U2V0PG51bWJlcj4+IHtcbiAgY29uc3Qgc2VsZlBpZCA9IHByb2Nlc3MucGlkO1xuICBjb25zdCBzY3JpcHQgPSBgXG4kRXJyb3JBY3Rpb25QcmVmZXJlbmNlID0gJ1NpbGVudGx5Q29udGludWUnXG4kcGlkQ2hhaW4gPSBAKCR7c2VsZlBpZH0pXG4kY3VyID0gJHtzZWxmUGlkfVxuZm9yICgkaSA9IDA7ICRpIC1sdCAzMiAtYW5kICRjdXIgLWd0IDA7ICRpKyspIHtcbiAgJHAgPSBHZXQtQ2ltSW5zdGFuY2UgV2luMzJfUHJvY2VzcyAtRmlsdGVyIFwiUHJvY2Vzc0lkPSRjdXJcIlxuICBpZiAoLW5vdCAkcCkgeyBicmVhayB9XG4gICRuZXh0ID0gJHAuUGFyZW50UHJvY2Vzc0lkXG4gIGlmICgkbmV4dCAtZXEgJGN1ciAtb3IgJG5leHQgLWxlIDApIHsgYnJlYWsgfVxuICAkY3VyID0gJG5leHRcbiAgJHBpZENoYWluICs9ICRjdXJcbn1cbiRwaWRDaGFpbiAtam9pbiAnLCdcbmA7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJ1blBvd2VyU2hlbGwoc2NyaXB0KTtcbiAgY29uc3QgcGlkcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICBmb3IgKGNvbnN0IHBhcnQgb2YgcmVzdWx0LnNwbGl0KFwiLFwiKSkge1xuICAgIGNvbnN0IG4gPSBwYXJzZUludChwYXJ0LCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCkgcGlkcy5hZGQobik7XG4gIH1cbiAgcmV0dXJuIHBpZHM7XG59XG5cbi8qKiBGb3JlZ3JvdW5kIHdpbmRvdyBvd25pbmcgUElEIHZpYSBQb3dlclNoZWxsICh1c2VyMzIgR2V0Rm9yZWdyb3VuZFdpbmRvdykuICovXG5hc3luYyBmdW5jdGlvbiBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCBzY3JpcHQgPSBgXG5BZGQtVHlwZSAtVHlwZURlZmluaXRpb24gQCdcbnVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5SdW50aW1lLkludGVyb3BTZXJ2aWNlcztcbnB1YmxpYyBzdGF0aWMgY2xhc3MgUHVsc2VGb2N1cyB7XG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxuICBwdWJsaWMgc3RhdGljIGV4dGVybiBJbnRQdHIgR2V0Rm9yZWdyb3VuZFdpbmRvdygpO1xuICBbRGxsSW1wb3J0KFwidXNlcjMyLmRsbFwiKV1cbiAgcHVibGljIHN0YXRpYyBleHRlcm4gdWludCBHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoSW50UHRyIGhXbmQsIG91dCB1aW50IGxwZHdQcm9jZXNzSWQpO1xufVxuJ0BcbiRoID0gW1B1bHNlRm9jdXNdOjpHZXRGb3JlZ3JvdW5kV2luZG93KClcbiRwID0gW3VpbnQzMl0wXG5bdm9pZF1bUHVsc2VGb2N1c106OkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZCgkaCwgW3JlZl0kcClcbiRwXG5gO1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBydW5Qb3dlclNoZWxsKHNjcmlwdCk7XG4gIGNvbnN0IG4gPSBwYXJzZUludChyZXN1bHQsIDEwKTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCA/IG4gOiB1bmRlZmluZWQ7XG59XG5cbi8qKiBUcnkgdGhlIGZhc3QgYnVuOmZmaSBiYWNrZW5kLiBSZXR1cm5zIHRydWUgd2hlbiBmdWxseSBpbml0aWFsaXplZC4gKi9cbmFzeW5jIGZ1bmN0aW9uIGluaXRGZmlCYWNrZW5kKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZGxvcGVuLCBwdHIgfSA9IGF3YWl0IGltcG9ydChcImJ1bjpmZmlcIik7XG4gICAgY29uc3QgdXNlcjMyID0gZGxvcGVuKFwidXNlcjMyLmRsbFwiLCB7XG4gICAgICBHZXRGb3JlZ3JvdW5kV2luZG93OiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInB0clwiIH0sXG4gICAgICBHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQ6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcInUzMlwiIH0sXG4gICAgfSk7XG4gICAgY29uc3Qga2VybmVsMzIgPSBkbG9wZW4oXCJrZXJuZWwzMi5kbGxcIiwge1xuICAgICAgR2V0Q3VycmVudFByb2Nlc3NJZDogeyBhcmdzOiBbXSwgcmV0dXJuczogXCJ1MzJcIiB9LFxuICAgICAgQ3JlYXRlVG9vbGhlbHAzMlNuYXBzaG90OiB7IGFyZ3M6IFtcInUzMlwiLCBcInUzMlwiXSwgcmV0dXJuczogXCJwdHJcIiB9LFxuICAgICAgUHJvY2VzczMyRmlyc3RXOiB7IGFyZ3M6IFtcInB0clwiLCBcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxuICAgICAgUHJvY2VzczMyTmV4dFc6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXG4gICAgICBDbG9zZUhhbmRsZTogeyBhcmdzOiBbXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IFRIMzJDU19TTkFQUFJPQ0VTUyA9IDB4MjtcbiAgICBjb25zdCBzbmFwc2hvdCA9IGtlcm5lbDMyLnN5bWJvbHMuQ3JlYXRlVG9vbGhlbHAzMlNuYXBzaG90KFRIMzJDU19TTkFQUFJPQ0VTUywgMCk7XG4gICAgaWYgKCFzbmFwc2hvdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgZW50cnkgPSBuZXcgVWludDhBcnJheShQUk9DRVNTRU5UUlkzMldfU0laRSk7XG4gICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGVudHJ5LmJ1ZmZlcik7XG4gICAgICB2aWV3LnNldFVpbnQzMigwLCBQUk9DRVNTRU5UUlkzMldfU0laRSwgdHJ1ZSk7IC8vIGR3U2l6ZVxuXG4gICAgICBjb25zdCBwYXJlbnQgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuICAgICAgbGV0IG9rID0ga2VybmVsMzIuc3ltYm9scy5Qcm9jZXNzMzJGaXJzdFcoc25hcHNob3QsIHB0cihlbnRyeSkpO1xuICAgICAgd2hpbGUgKG9rKSB7XG4gICAgICAgIGNvbnN0IHBpZCA9IHZpZXcuZ2V0VWludDMyKE9GRlNFVF9USDMyX1BST0NFU1NfSUQsIHRydWUpO1xuICAgICAgICBjb25zdCBwcGlkID0gdmlldy5nZXRVaW50MzIoT0ZGU0VUX1RIMzJfUEFSRU5UX1BST0NFU1NfSUQsIHRydWUpO1xuICAgICAgICBpZiAocGlkICE9PSAwKSBwYXJlbnQuc2V0KHBpZCwgcHBpZCk7XG4gICAgICAgIG9rID0ga2VybmVsMzIuc3ltYm9scy5Qcm9jZXNzMzJOZXh0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbGYgPSBrZXJuZWwzMi5zeW1ib2xzLkdldEN1cnJlbnRQcm9jZXNzSWQoKTtcbiAgICAgIGxldCBjdXJyZW50ID0gc2VsZjtcbiAgICAgIGZvciAobGV0IGRlcHRoID0gMDsgZGVwdGggPCAzMiAmJiBjdXJyZW50OyBkZXB0aCsrKSB7XG4gICAgICAgIGFuY2VzdG9ycy5hZGQoY3VycmVudCk7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwYXJlbnQuZ2V0KGN1cnJlbnQpO1xuICAgICAgICBpZiAobmV4dCA9PT0gdW5kZWZpbmVkIHx8IG5leHQgPT09IGN1cnJlbnQpIGJyZWFrO1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAga2VybmVsMzIuc3ltYm9scy5DbG9zZUhhbmRsZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgZmZpRm9yZWdyb3VuZFBpZCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGh3bmQgPSB1c2VyMzIuc3ltYm9scy5HZXRGb3JlZ3JvdW5kV2luZG93KCk7XG4gICAgICBpZiAoIWh3bmQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBwaWRCdWYgPSBuZXcgVWludDMyQXJyYXkoMSk7XG4gICAgICB1c2VyMzIuc3ltYm9scy5HZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoaHduZCwgcHRyKHBpZEJ1ZikpO1xuICAgICAgcmV0dXJuIHBpZEJ1ZlswXTtcbiAgICB9O1xuXG4gICAgc3RhdHVzID0geyBiYWNrZW5kOiBcImZmaVwiLCBhbmNlc3RvckNvdW50OiBhbmNlc3RvcnMuc2l6ZSB9O1xuICAgIHJldHVybiBhbmNlc3RvcnMuc2l6ZSA+IDA7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RFcnJvcjogU3RyaW5nKGVycm9yKSB9O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5sZXQgaW5pdFByb21pc2U6IFByb21pc2U8dm9pZD4gfCB1bmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlV2luZG93c0ZvY3VzSW5pdCgpOiB2b2lkIHtcbiAgaWYgKCFJU19XSU5ET1dTKSByZXR1cm47XG4gIGluaXRQcm9taXNlID8/PSAoYXN5bmMgKCkgPT4ge1xuICAgIGlmIChhd2FpdCBpbml0RmZpQmFja2VuZCgpKSB7XG4gICAgICBiYWNrZW5kID0gXCJmZmlcIjtcbiAgICAgIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBiYWNrZW5kOiBcImZmaVwiIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGFuY2VzdG9ycyA9IGF3YWl0IGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTtcbiAgICBpZiAoYW5jZXN0b3JzLnNpemUgPiAwKSB7XG4gICAgICBiYWNrZW5kID0gXCJwb3dlcnNoZWxsXCI7XG4gICAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwicG93ZXJzaGVsbFwiLCBhbmNlc3RvckNvdW50OiBhbmNlc3RvcnMuc2l6ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZW5kID0gXCJub25lXCI7XG4gICAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwibm9uZVwiLCBhbmNlc3RvckNvdW50OiAwLCBsYXN0RXJyb3I6IFwibm8gYW5jZXN0b3IgY2hhaW5cIiB9O1xuICAgIH1cbiAgfSkoKTtcbiAgdm9pZCBpbml0UHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gdGhlIHRlcm1pbmFsIHdpbmRvdyBjdXJyZW50bHkgaGFzIGZvY3VzLCBmYWxzZSB3aGVuIHRoZSBmb3JlZ3JvdW5kIHdpbmRvd1xuICogYmVsb25ncyB0byBhIGRpZmZlcmVudCBwcm9jZXNzLCB1bmRlZmluZWQgd2hlbiB0aGUgY2hlY2sgaXMgdW5hdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc1Rlcm1pbmFsRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+IHtcbiAgaWYgKCFJU19XSU5ET1dTKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICAvLyBUaGUgZmlyc3QgZGlzcGF0Y2ggY2FuIHJhY2UgdGhlIGFzeW5jIGluaXQgKGR5bmFtaWMgaW1wb3J0IC8gUG93ZXJTaGVsbCB3YWxrKTtcbiAgLy8gd2FpdCBmb3IgaXQgc28gdGhlIHZlcnkgZmlyc3Qgbm90aWZpY2F0aW9uIGlzIGdhdGVkIGFzIHdlbGwuXG4gIGlmIChpbml0UHJvbWlzZSkgYXdhaXQgaW5pdFByb21pc2U7XG4gIGlmIChiYWNrZW5kID09PSBcIm5vbmVcIikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGJhY2tlbmQgPT09IFwiZmZpXCIgJiYgZmZpRm9yZWdyb3VuZFBpZCkge1xuICAgIGNvbnN0IGZvcmVncm91bmQgPSBmZmlGb3JlZ3JvdW5kUGlkKCk7XG4gICAgaWYgKGZvcmVncm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYW5jZXN0b3JzLmhhcyhmb3JlZ3JvdW5kKTtcbiAgICAgIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBsYXN0Rm9yZWdyb3VuZFBpZDogZm9yZWdyb3VuZCwgbGFzdFJlc3VsdDogcmVzdWx0IH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBPYnNlcnZlZCBpbiBCdW4gb24gV2luZG93czogR2V0Rm9yZWdyb3VuZFdpbmRvdyByZXR1cm5zIE5VTEwgdGhyb3VnaCBidW46ZmZpXG4gICAgLy8gZXZlbiB3aGlsZSBhIHRlcm1pbmFsIHdpbmRvdyBpcyBpbiB0aGUgZm9yZWdyb3VuZC4gRmFsbCB0aHJvdWdoIHRvIHRoZVxuICAgIC8vIFBvd2VyU2hlbGwgcHJvYmUgaW5zdGVhZCBvZiByZXBvcnRpbmcgXCJ1bmtub3duXCIgKHdoaWNoIGZhaWxzIG9wZW4pLlxuICB9XG4gIGNvbnN0IGZvcmVncm91bmQgPSBhd2FpdCBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpO1xuICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xuICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEZvcmVncm91bmRQaWQ6IGZvcmVncm91bmQsIGxhc3RSZXN1bHQ6IHJlc3VsdCB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl0s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
