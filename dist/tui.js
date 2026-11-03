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
var OPENCODE_ICON_PNG_B64 = "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";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL3R1aS50c3giLCJmaWxlOi8vL0M6L1VzZXJzL1pvdXl1L3JlcG9zL3NyYy9pMThuLnRzIiwiZmlsZTovLy9DOi9Vc2Vycy9ab3V5dS9yZXBvcy9zcmMvZGlhZy50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL25vdGlmaWNhdGlvbi50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL3dpbmRvd3MtZm9jdXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IGFzIF8kY3JlYXRlQ29tcG9uZW50IH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBlZmZlY3QgYXMgXyRlZmZlY3QgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGNyZWF0ZVRleHROb2RlIGFzIF8kY3JlYXRlVGV4dE5vZGUgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGluc2VydE5vZGUgYXMgXyRpbnNlcnROb2RlIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBpbnNlcnQgYXMgXyRpbnNlcnQgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IG1lbW8gYXMgXyRtZW1vIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBzZXRQcm9wIGFzIF8kc2V0UHJvcCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCBhcyBfJGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJAb3BlbmNvZGUvcGx1Z2luL3R1aVwiO1xuaW1wb3J0IHsgY3JlYXRlRWZmZWN0LCBjcmVhdGVNZW1vLCBjcmVhdGVTaWduYWwsIEZvciwgb25DbGVhbnVwLCBTaG93IH0gZnJvbSBcInNvbGlkLWpzXCI7XG5pbXBvcnQgeyBub3RpZnlJbnRlcnZpZXdJbnB1dCwgbm90aWZ5U2Vzc2lvbkVycm9yLCBub3RpZnlTdWJhZ2VudHNEb25lLCBub3RpZnlUdXJuRG9uZSB9IGZyb20gXCIuL25vdGlmaWNhdGlvblwiO1xuaW1wb3J0IHsgcmVzb2x2ZUxvY2FsZSwgdCB9IGZyb20gXCIuL2kxOG5cIjtcbmltcG9ydCB7IGRpYWcsIGluaXREaWFnIH0gZnJvbSBcIi4vZGlhZ1wiO1xuaW1wb3J0IHsgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCwgZ2V0Rm9jdXNTdGF0dXMsIGlzVGVybWluYWxGb2N1c2VkIH0gZnJvbSBcIi4vd2luZG93cy1mb2N1c1wiO1xuXG4vKipcclxuICogU2lkZWJhciB3aWRnZXQgdGhhdCBsaXZlLXRyYWNrcyBydW5uaW5nIHN1YmFnZW50cyAoc3ViLXNlc3Npb25zKS5cclxuICpcclxuICogT3BlbkNvZGUgMi54IGRhdGEgc291cmNlIChgUGx1Z2luLkNvbnRleHQuZGF0YWApOlxyXG4gKiAgIC0gYGRhdGEuc2Vzc2lvbi5saXN0KClgICAgICAgICAgIC0+IGV2ZXJ5IHNlc3Npb24gdGhlIFRVSSBoYXMgbG9hZGVkLiBTdWItc2Vzc2lvbnNcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcnJ5IGBwYXJlbnRJRGA7IGBkYXRhLnNlc3Npb24ucm9vdCgpYCBncm91cHMgYVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbiB3aXRoIGl0cyB3aG9sZSBzdWJhZ2VudCBmYW1pbHkuXHJcbiAqICAgLSBgZGF0YS5zZXNzaW9uLnN0YXR1cyhpZClgICAgICAgLT4gXCJydW5uaW5nXCIgfCBcImlkbGVcIiAoZGVyaXZlZCBmcm9tIGV4ZWN1dGlvbiBldmVudHMpXHJcbiAqICAgLSBgZGF0YS5zZXNzaW9uLmdldChpZClgICAgICAgICAgLT4gZnVsbCBgU2Vzc2lvbkluZm9gIChhZ2VudCwgdGl0bGUsIG91dGNvbWUsIHRpbWVzKVxyXG4gKlxyXG4gKiBUaGUgaG9zdCBhbHJlYWR5IHByb2plY3RzIGxpdmUgZXZlbnRzIGludG8gdGhpcyByZWFjdGl2ZSBzdG9yZSwgc28gdGhlIHBsdWdpbiBub1xyXG4gKiBsb25nZXIgbWFpbnRhaW5zIGl0cyBvd24gZXZlbnQtZHJpdmVuIG1hcCAodGhlIFYxIGBzZXNzaW9uLmNyZWF0ZWRgIC8gYHNlc3Npb24uc3RhdHVzYFxyXG4gKiAvIGBtZXNzYWdlLnBhcnQudXBkYXRlZGAgcGx1bWJpbmcgaXMgZ29uZSkuIGBzZXNzaW9uLnN1YmFnZW50LipgIGFjdGl2aXR5IGlzIGZvbGRlZCBpbnRvXHJcbiAqIGBleGVjdXRpb24uc3RhcnRlZGAgLyBgZXhlY3V0aW9uLnN1Y2NlZWRlZHxmYWlsZWR8aW50ZXJydXB0ZWRgLCB3aGljaCB0aGUgaG9zdCBkYXRhXHJcbiAqIGxheWVyIHR1cm5zIGludG8gdGhlIHJ1bm5pbmcvaWRsZSBzdGF0dXMgd2UgcmVhZCBoZXJlLlxyXG4gKlxyXG4gKiBFbGFwc2VkIHRpbWUgdXNlcyB0aGUgc2Vzc2lvbidzIG93biB0aW1lc3RhbXBzOlxyXG4gKiAgIC0gYHRpbWUuYnVzeWAgIHN0YXJ0IG9mIHRoZSBtb3N0IHJlY2VudCBleGVjdXRpb25cclxuICogICAtIGB0aW1lLmlkbGVgICBlbmQgb2YgdGhlIG1vc3QgcmVjZW50IGNvbXBsZXRlZCBleGVjdXRpb25cclxuICpcclxuICogTm90aWZpY2F0aW9ucyBrZWVwIHRoZSBWMSBvcHRpb24gc3VyZmFjZSAoYG5vdGlmaWNhdGlvbnMuc3ViYWdlbnRzYCxcclxuICogYG5vdGlmaWNhdGlvbnMubWFpblNlc3Npb25gLCBgbm90aWZpY2F0aW9ucy5pbnRlcnZpZXdgLCBgbm90aWZpY2F0aW9ucy5vbmx5V2hlblVuZm9jdXNlZGApXHJcbiAqIGJ1dCBzdWJzY3JpYmUgdG8gVjIgZXZlbnRzOiBgc2Vzc2lvbi5leGVjdXRpb24uKmAsIGBmb3JtLipgLCBgcGVybWlzc2lvbi4qYC5cclxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdER1cmF0aW9uKGVsYXBzZWRNcykge1xuICBjb25zdCB0b3RhbFNlY29uZHMgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKGVsYXBzZWRNcyAvIDEwMDApKTtcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICBjb25zdCBzZWNvbmRzID0gdG90YWxTZWNvbmRzICUgNjA7XG4gIHJldHVybiBtaW51dGVzID4gMCA/IGAke21pbnV0ZXN9bSR7c2Vjb25kcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1zYCA6IGAke3NlY29uZHN9c2A7XG59XG5mdW5jdGlvbiBzdGF0dXNPZihzZXNzaW9uLCBydW5uaW5nLCByZXRyeWluZykge1xuICBpZiAocnVubmluZykgcmV0dXJuIHJldHJ5aW5nID8gXCJyZXRyeVwiIDogXCJidXN5XCI7XG4gIGlmIChzZXNzaW9uLm91dGNvbWUgPT09IFwiZmFpbGVkXCIpIHJldHVybiBcImVycm9yXCI7XG4gIGlmIChzZXNzaW9uLm91dGNvbWUgPT09IFwiaW50ZXJydXB0ZWRcIikgcmV0dXJuIFwic3RvcHBlZFwiO1xuICBpZiAoc2Vzc2lvbi5vdXRjb21lID09PSBcInN1Y2NlZWRlZFwiKSByZXR1cm4gXCJkb25lXCI7XG4gIHJldHVybiBcImlkbGVcIjtcbn1cbmZ1bmN0aW9uIGVsYXBzZWRPZihzZXNzaW9uLCBzdGF0dXMsIG5vdykge1xuICBjb25zdCBzdGFydCA9IHNlc3Npb24udGltZS5idXN5ID8/IHNlc3Npb24udGltZS5jcmVhdGVkO1xuICBjb25zdCBlbmQgPSBzdGF0dXMgPT09IFwiYnVzeVwiIHx8IHN0YXR1cyA9PT0gXCJyZXRyeVwiID8gbm93IDogc2Vzc2lvbi50aW1lLmlkbGUgPz8gc2Vzc2lvbi50aW1lLnVwZGF0ZWQgPz8gbm93O1xuICByZXR1cm4gTWF0aC5tYXgoMCwgZW5kIC0gc3RhcnQpO1xufVxuZnVuY3Rpb24gU2lkZWJhcihwcm9wcykge1xuICBjb25zdCBkYXRhID0gcHJvcHMuY29udGV4dC5kYXRhO1xuICBjb25zdCB0aGVtZSA9IHByb3BzLmNvbnRleHQudGhlbWU7XG4gIGNvbnN0IGxhYmVscyA9IHQocHJvcHMubG9jYWxlKTtcbiAgLy8gUGVyc2lzdGVkIGxpa2UgdGhlIGJ1aWx0LWluIE1DUC9UT0RPIHNlY3Rpb25zOiB0aGUgYXJyb3cgdG9nZ2xlcyB0aGUgc2VjdGlvbiBhbmRcbiAgLy8gdGhlIGNob2ljZSBzdXJ2aXZlcyBUVUkgcmVzdGFydHMgYW5kIHBsdWdpbiBob3QgcmVsb2Fkcy5cbiAgY29uc3QgW3ZpZXcsIHVwZGF0ZVZpZXddID0gcHJvcHMuY29udGV4dC5zdG9yYWdlLnN0b3JlKFwidmlld1wiLCB7XG4gICAgaW5pdGlhbDoge1xuICAgICAgb3BlbjogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIC8vIFJlLXJlbmRlciBvbmNlIGEgc2Vjb25kIHNvIGVsYXBzZWQgdGltZXMgdGljayB3aGlsZSBhbiBleGVjdXRpb24gaXMgcnVubmluZy5cbiAgY29uc3QgW25vdywgc2V0Tm93XSA9IGNyZWF0ZVNpZ25hbChEYXRlLm5vdygpKTtcblxuICAvLyBgUGx1Z2luLkNvbnRleHRbXCJkYXRhXCJdLnNlc3Npb25gIGV4cG9zZXMgYHN0YXR1cygpYCBidXQgbm90IHRoZSBzb2xpZCBzdG9yZSdzXG4gIC8vIGBhY3RpdmUoKWAgaGVscGVyLCBzbyBkZXJpdmUgdGhlIHJ1bm5pbmcgc2V0IGZyb20gdGhlIHB1YmxpYyBzdXJmYWNlLlxuICBjb25zdCBydW5uaW5nSURzID0gKCkgPT4gbmV3IFNldChkYXRhLnNlc3Npb24ubGlzdCgpLmZpbHRlcihzZXNzaW9uID0+IGRhdGEuc2Vzc2lvbi5zdGF0dXMoc2Vzc2lvbi5pZCkgPT09IFwicnVubmluZ1wiKS5tYXAoc2Vzc2lvbiA9PiBzZXNzaW9uLmlkKSk7XG5cbiAgLy8gU2VlZCB0aGUgdmlzaWJsZSBzZXQgZm9yIHN1YmFnZW50cyB0aGF0IHdlcmUgYWxyZWFkeSBydW5uaW5nIHdoZW4gdGhlIHBsdWdpblxuICAvLyBhY3RpdmF0ZWQgKGhvdCByZWxvYWQgLyBUVUkgcmVzdW1lKS4gTGl2ZSBzdGFydHMgYXJlIHJlY29yZGVkIGJ5IHRoZSBzZXR1cFxuICAvLyBldmVudCBoYW5kbGVyLCBzbyBhIGZhc3Qgc3RhcnQvZmluaXNoIGNhbm5vdCBmYWxsIHRocm91Z2ggdGhpcyBib290c3RyYXAuXG4gIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IGRhdGEuc2Vzc2lvbi5yb290KHByb3BzLnNlc3Npb25JRCk7XG4gICAgZm9yIChjb25zdCBpZCBvZiBydW5uaW5nSURzKCkpIHtcbiAgICAgIGNvbnN0IHNlc3Npb24gPSBkYXRhLnNlc3Npb24uZ2V0KGlkKTtcbiAgICAgIGlmIChzZXNzaW9uPy5wYXJlbnRJRCAhPT0gdW5kZWZpbmVkICYmIGRhdGEuc2Vzc2lvbi5yb290KGlkKSA9PT0gcm9vdCkge1xuICAgICAgICBwcm9wcy5tYXJrU2VlbihpZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW50cmllcyA9IGNyZWF0ZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBkYXRhLnNlc3Npb24ucm9vdChwcm9wcy5zZXNzaW9uSUQpO1xuICAgIGNvbnN0IGFjdGl2ZSA9IHJ1bm5pbmdJRHMoKTtcbiAgICBjb25zdCByZXRyeWluZyA9IHByb3BzLnJldHJ5aW5nKCk7XG4gICAgY29uc3Qgc2VlbklEcyA9IHByb3BzLnNlZW4oKTtcbiAgICBjb25zdCBjbG9jayA9IG5vdygpO1xuICAgIHJldHVybiBkYXRhLnNlc3Npb24ubGlzdCgpLmZpbHRlcihzZXNzaW9uID0+IHtcbiAgICAgIGlmIChzZXNzaW9uLnBhcmVudElEID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChkYXRhLnNlc3Npb24ucm9vdChzZXNzaW9uLmlkKSAhPT0gcm9vdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIGFjdGl2ZS5oYXMoc2Vzc2lvbi5pZCkgfHwgc2VlbklEcy5oYXMoc2Vzc2lvbi5pZCk7XG4gICAgfSkubWFwKHNlc3Npb24gPT4ge1xuICAgICAgY29uc3QgcnVubmluZyA9IGFjdGl2ZS5oYXMoc2Vzc2lvbi5pZCk7XG4gICAgICBjb25zdCBzdGF0dXMgPSBzdGF0dXNPZihzZXNzaW9uLCBydW5uaW5nLCByZXRyeWluZy5oYXMoc2Vzc2lvbi5pZCkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHNlc3Npb24uaWQsXG4gICAgICAgIGFnZW50OiBzZXNzaW9uLmFnZW50ID8/IFwiP1wiLFxuICAgICAgICB0aXRsZTogc2Vzc2lvbi50aXRsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgZWxhcHNlZDogZWxhcHNlZE9mKHNlc3Npb24sIHN0YXR1cywgY2xvY2spLFxuICAgICAgICBjcmVhdGVkOiBzZXNzaW9uLnRpbWUuY3JlYXRlZFxuICAgICAgfTtcbiAgICB9KS5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYi5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGIuc3RhdHVzID09PSBcInJldHJ5XCIpIC0gTnVtYmVyKGEuc3RhdHVzID09PSBcImJ1c3lcIiB8fCBhLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB8fCBhLmNyZWF0ZWQgLSBiLmNyZWF0ZWQpO1xuICB9KTtcblxuICAvLyBUaWNrIG9ubHkgd2hpbGUgdGhlIHNlY3Rpb24gaXMgb3BlbiBhbmQgc29tZXRoaW5nIGhhcyBhIGxpdmUgY2xvY2suXG4gIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICghdmlldy5vcGVuKSByZXR1cm47XG4gICAgaWYgKGVudHJpZXMoKS5zb21lKGVudHJ5ID0+IGVudHJ5LnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgZW50cnkuc3RhdHVzID09PSBcInJldHJ5XCIpKSB7XG4gICAgICBzZXROb3coRGF0ZS5ub3coKSk7XG4gICAgfVxuICB9LCAxMDAwKTtcbiAgb25DbGVhbnVwKCgpID0+IGNsZWFySW50ZXJ2YWwodGltZXIpKTtcbiAgY29uc3QgdG9uZSA9IHN0YXR1cyA9PiB7XG4gICAgaWYgKHN0YXR1cyA9PT0gXCJidXN5XCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLnN1Y2Nlc3MuYmFzZTtcbiAgICBpZiAoc3RhdHVzID09PSBcInJldHJ5XCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLndhcm5pbmcuYmFzZTtcbiAgICBpZiAoc3RhdHVzID09PSBcImVycm9yXCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLmVycm9yLmJhc2U7XG4gICAgcmV0dXJuIHRoZW1lLnRleHQubXV0ZWQ7XG4gIH07XG4gIGNvbnN0IHN0YXR1c0xhYmVsID0gc3RhdHVzID0+IHtcbiAgICBpZiAoc3RhdHVzID09PSBcImJ1c3lcIikgcmV0dXJuIFwiYnVzeVwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwicmV0cnlcIikgcmV0dXJuIFwicmV0cnlcIjtcbiAgICBpZiAoc3RhdHVzID09PSBcImRvbmVcIikgcmV0dXJuIFwiZG9uZVwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwiZXJyb3JcIikgcmV0dXJuIFwiZXJyb3JcIjtcbiAgICBpZiAoc3RhdHVzID09PSBcInN0b3BwZWRcIikgcmV0dXJuIFwic3RvcHBlZFwiO1xuICAgIHJldHVybiBcImlkbGVcIjtcbiAgfTtcbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgdmFyIF9lbCQgPSBfJGNyZWF0ZUVsZW1lbnQoXCJib3hcIiksXG4gICAgICBfZWwkMiA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKSxcbiAgICAgIF9lbCQzID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgIF9lbCQ0ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgIF9lbCQ1ID0gXyRjcmVhdGVFbGVtZW50KFwiYlwiKTtcbiAgICBfJGluc2VydE5vZGUoX2VsJCwgX2VsJDIpO1xuICAgIF8kc2V0UHJvcChfZWwkLCBcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICBfJHNldFByb3AoX2VsJCwgXCJmbGV4RGlyZWN0aW9uXCIsIFwiY29sdW1uXCIpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkMiwgX2VsJDMpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkMiwgX2VsJDQpO1xuICAgIF8kc2V0UHJvcChfZWwkMiwgXCJ3aWR0aFwiLCBcIjEwMCVcIik7XG4gICAgXyRzZXRQcm9wKF9lbCQyLCBcImZsZXhEaXJlY3Rpb25cIiwgXCJyb3dcIik7XG4gICAgXyRzZXRQcm9wKF9lbCQyLCBcImdhcFwiLCAxKTtcbiAgICBfJHNldFByb3AoX2VsJDIsIFwib25Nb3VzZURvd25cIiwgKCkgPT4ge1xuICAgICAgdm9pZCB1cGRhdGVWaWV3KGRyYWZ0ID0+IHtcbiAgICAgICAgZHJhZnQub3BlbiA9ICFkcmFmdC5vcGVuO1xuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwZXJzaXN0IHN1YmFnZW50IHNpZGViYXIgc3RhdGVcIiwgZXJyb3IpKTtcbiAgICB9KTtcbiAgICBfJGluc2VydChfZWwkMywgKCkgPT4gdmlldy5vcGVuID8gXCLilrxcIiA6IFwi4pa2XCIpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkNCwgX2VsJDUpO1xuICAgIF8kaW5zZXJ0KF9lbCQ1LCAoKSA9PiBsYWJlbHMuc3ViYWdlbnRzKTtcbiAgICBfJGluc2VydChfZWwkNCwgXyRjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBlbnRyaWVzKCkubGVuZ3RoID4gMDtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHZhciBfZWwkNiA9IF8kY3JlYXRlRWxlbWVudChcInNwYW5cIiksXG4gICAgICAgICAgX2VsJDcgPSBfJGNyZWF0ZVRleHROb2RlKGAgKGApLFxuICAgICAgICAgIF9lbCQ4ID0gXyRjcmVhdGVUZXh0Tm9kZShgKWApO1xuICAgICAgICBfJGluc2VydE5vZGUoX2VsJDYsIF9lbCQ3KTtcbiAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQ2LCBfZWwkOCk7XG4gICAgICAgIF8kaW5zZXJ0KF9lbCQ2LCAoKSA9PiBlbnRyaWVzKCkubGVuZ3RoLCBfZWwkOCk7XG4gICAgICAgIF8kZWZmZWN0KF8kcCA9PiBfJHNldFByb3AoX2VsJDYsIFwic3R5bGVcIiwge1xuICAgICAgICAgIGZnOiB0aGVtZS50ZXh0Lm11dGVkXG4gICAgICAgIH0sIF8kcCkpO1xuICAgICAgICByZXR1cm4gX2VsJDY7XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIF8kaW5zZXJ0KF9lbCQsIF8kY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gdmlldy5vcGVuO1xuICAgICAgfSxcbiAgICAgIGdldCBmYWxsYmFjaygpIHtcbiAgICAgICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICAgICAgdmFyIF9lbCQwID0gXyRjcmVhdGVFbGVtZW50KFwiYm94XCIpO1xuICAgICAgICAgIF8kc2V0UHJvcChfZWwkMCwgXCJoZWlnaHRcIiwgMCk7XG4gICAgICAgICAgcmV0dXJuIF9lbCQwO1xuICAgICAgICB9KSgpO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIFtfJGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcHMuc2hvd0ZvY3VzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGZhbGxiYWNrKCkge1xuICAgICAgICAgICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICAgICAgICAgIHZhciBfZWwkMSA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKTtcbiAgICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxLCBcImhlaWdodFwiLCAwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9lbCQxO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHZhciBfZWwkOSA9IF8kY3JlYXRlRWxlbWVudChcInRleHRcIik7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkOSwgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBkaWFnID0gcHJvcHMuZm9jdXNEaWFnKCk7XG4gICAgICAgICAgICAgIGNvbnN0IGZsYWcgPSBkaWFnLmxhc3RSZXN1bHQgPT09IHRydWUgPyBcIuKXj2ZvY3VzZWRcIiA6IGRpYWcubGFzdFJlc3VsdCA9PT0gZmFsc2UgPyBcIuKXi2JsdXJyZWRcIiA6IFwiP3Vua25vd25cIjtcbiAgICAgICAgICAgICAgY29uc3Qgc3JjID0gZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZCAhPT0gdW5kZWZpbmVkID8gYCBmZz0ke2RpYWcubGFzdEZvcmVncm91bmRQaWR9YCA6IFwiXCI7XG4gICAgICAgICAgICAgIGNvbnN0IGVyciA9IGRpYWcubGFzdEVycm9yID8gYCBlcnI9JHtkaWFnLmxhc3RFcnJvcn1gIDogXCJcIjtcbiAgICAgICAgICAgICAgcmV0dXJuIGAgIGZvY3VzWyR7ZGlhZy5iYWNrZW5kfSR7ZGlhZy5hbmNlc3RvckNvdW50ID8gYDoke2RpYWcuYW5jZXN0b3JDb3VudH1gIDogXCJcIn1dICR7ZmxhZ30ke3NyY30ke2Vycn1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfJGVmZmVjdChfJHAgPT4gXyRzZXRQcm9wKF9lbCQ5LCBcImZnXCIsIHRoZW1lLnRleHQubXV0ZWQsIF8kcCkpO1xuICAgICAgICAgICAgcmV0dXJuIF9lbCQ5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSksIF8kY3JlYXRlQ29tcG9uZW50KEZvciwge1xuICAgICAgICAgIGdldCBlYWNoKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJpZXMoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoaWxkcmVuOiBlbnRyeSA9PiAoKCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9lbCQxMCA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKSxcbiAgICAgICAgICAgICAgX2VsJDExID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDEzID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDE2ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDE3ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTAsIF9lbCQxMSk7XG4gICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDEwLCBfZWwkMTMpO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMCwgX2VsJDE2KTtcbiAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTAsIF9lbCQxNyk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEwLCBcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwiZmxleERpcmVjdGlvblwiLCBcInJvd1wiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwiZ2FwXCIsIDEpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMCwgXCJwYWRkaW5nTGVmdFwiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwib25Nb3VzZURvd25cIiwgKCkgPT4ge1xuICAgICAgICAgICAgICBwcm9wcy5jb250ZXh0LnVpLnJvdXRlci5uYXZpZ2F0ZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzZXNzaW9uXCIsXG4gICAgICAgICAgICAgICAgc2Vzc2lvbklEOiBlbnRyeS5pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMSwgXyRjcmVhdGVUZXh0Tm9kZShg4pePYCkpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMSwgXCJmbGV4U2hyaW5rXCIsIDApO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEzLCBcInRydW5jYXRlXCIsIHRydWUpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJmbGV4R3Jvd1wiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTMsIFwiZmxleFNocmlua1wiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTMsIFwibWluV2lkdGhcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTMsICgpID0+IGVudHJ5LnRpdGxlID8/IGVudHJ5LmFnZW50LCBudWxsKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxMywgXyRjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cnkudGl0bGU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2VsJDE0ID0gXyRjcmVhdGVFbGVtZW50KFwic3BhblwiKSxcbiAgICAgICAgICAgICAgICAgIF9lbCQxNSA9IF8kY3JlYXRlVGV4dE5vZGUoYCBgKTtcbiAgICAgICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDE0LCBfZWwkMTUpO1xuICAgICAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxNCwgKCkgPT4gZW50cnkuYWdlbnQsIG51bGwpO1xuICAgICAgICAgICAgICAgIF8kZWZmZWN0KF8kcCA9PiBfJHNldFByb3AoX2VsJDE0LCBcInN0eWxlXCIsIHtcbiAgICAgICAgICAgICAgICAgIGZnOiB0aGVtZS50ZXh0Lm11dGVkXG4gICAgICAgICAgICAgICAgfSwgXyRwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9lbCQxNDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIG51bGwpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxNiwgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE2LCBcImZsZXhTaHJpbmtcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTYsICgpID0+IHN0YXR1c0xhYmVsKGVudHJ5LnN0YXR1cykpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxNywgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE3LCBcImZsZXhTaHJpbmtcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTcsICgpID0+IGZvcm1hdER1cmF0aW9uKGVudHJ5LmVsYXBzZWQpKTtcbiAgICAgICAgICAgIF8kZWZmZWN0KF9wJCA9PiB7XG4gICAgICAgICAgICAgIHZhciBfdiQzID0gdG9uZShlbnRyeS5zdGF0dXMpLFxuICAgICAgICAgICAgICAgIF92JDQgPSB0aGVtZS50ZXh0LmJhc2UsXG4gICAgICAgICAgICAgICAgX3YkNSA9IHRvbmUoZW50cnkuc3RhdHVzKSxcbiAgICAgICAgICAgICAgICBfdiQ2ID0gdGhlbWUudGV4dC5tdXRlZDtcbiAgICAgICAgICAgICAgX3YkMyAhPT0gX3AkLmUgJiYgKF9wJC5lID0gXyRzZXRQcm9wKF9lbCQxMSwgXCJmZ1wiLCBfdiQzLCBfcCQuZSkpO1xuICAgICAgICAgICAgICBfdiQ0ICE9PSBfcCQudCAmJiAoX3AkLnQgPSBfJHNldFByb3AoX2VsJDEzLCBcImZnXCIsIF92JDQsIF9wJC50KSk7XG4gICAgICAgICAgICAgIF92JDUgIT09IF9wJC5hICYmIChfcCQuYSA9IF8kc2V0UHJvcChfZWwkMTYsIFwiZmdcIiwgX3YkNSwgX3AkLmEpKTtcbiAgICAgICAgICAgICAgX3YkNiAhPT0gX3AkLm8gJiYgKF9wJC5vID0gXyRzZXRQcm9wKF9lbCQxNywgXCJmZ1wiLCBfdiQ2LCBfcCQubykpO1xuICAgICAgICAgICAgICByZXR1cm4gX3AkO1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgYTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBvOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIF9lbCQxMDtcbiAgICAgICAgICB9KSgpXG4gICAgICAgIH0pXTtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgXyRlZmZlY3QoX3AkID0+IHtcbiAgICAgIHZhciBfdiQgPSB0aGVtZS50ZXh0LmJhc2UsXG4gICAgICAgIF92JDIgPSB0aGVtZS50ZXh0LmJhc2U7XG4gICAgICBfdiQgIT09IF9wJC5lICYmIChfcCQuZSA9IF8kc2V0UHJvcChfZWwkMywgXCJmZ1wiLCBfdiQsIF9wJC5lKSk7XG4gICAgICBfdiQyICE9PSBfcCQudCAmJiAoX3AkLnQgPSBfJHNldFByb3AoX2VsJDQsIFwiZmdcIiwgX3YkMiwgX3AkLnQpKTtcbiAgICAgIHJldHVybiBfcCQ7XG4gICAgfSwge1xuICAgICAgZTogdW5kZWZpbmVkLFxuICAgICAgdDogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgcmV0dXJuIF9lbCQ7XG4gIH0pKCk7XG59XG5jb25zdCBwbHVnaW4gPSBQbHVnaW4uZGVmaW5lKHtcbiAgaWQ6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgc2V0dXAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnMgPz8ge307XG4gICAgaW5pdERpYWcob3B0aW9ucy5kZWJ1ZyA9PT0gdHJ1ZSk7XG4gICAgZGlhZyhcInNldHVwXCIsIHtcbiAgICAgIGN3ZDogcHJvY2Vzcy5jd2QoKSxcbiAgICAgIGxvY2F0aW9uOiBjb250ZXh0LmxvY2F0aW9uPy5kaXJlY3RvcnksXG4gICAgICBvcHRpb25zXG4gICAgfSk7XG4gICAgY29uc3Qgbm90aWZDZmcgPSBvcHRpb25zLm5vdGlmaWNhdGlvbnM7XG4gICAgLy8gT3B0LWluOiBPcGVuQ29kZSAyLnggc2hpcHMgYG9wZW5jb2RlLm5vdGlmaWNhdGlvbnNgLCB3aGljaCBjb3ZlcnMgdGhlIHNhbWVcbiAgICAvLyBldmVudHMuIERlZmF1bHRpbmcgdG8gb2ZmIGF2b2lkcyBkdXBsaWNhdGUgc291bmRzL3RvYXN0cy5cbiAgICBjb25zdCBub3RpZnlTdWJhZ2VudHMgPSBub3RpZkNmZz8uc3ViYWdlbnRzID8/IGZhbHNlO1xuICAgIGNvbnN0IG5vdGlmeU1haW5TZXNzaW9uID0gbm90aWZDZmc/Lm1haW5TZXNzaW9uID8/IGZhbHNlO1xuICAgIGNvbnN0IG5vdGlmeUludGVydmlldyA9IG5vdGlmQ2ZnPy5pbnRlcnZpZXcgPz8gZmFsc2U7XG4gICAgY29uc3Qgbm90aWZ5RXJyb3JzID0gbm90aWZDZmc/LmVycm9ycyA/PyBmYWxzZTtcbiAgICAvLyBEZWZhdWx0IHRvIFwiZG9uJ3QgZGlzdHVyYiB3aGlsZSB0aGUgdXNlciBpcyB3YXRjaGluZ1wiLCBtYXRjaGluZyB0aGUgaG9zdCdzXG4gICAgLy8gYnVpbHQtaW4gbm90aWZpY2F0aW9ucyBwbHVnaW4gKGBub3RpZmljYXRpb24ud2hlbjogXCJibHVycmVkXCJgKS4gVGhlIFdpbmRvd3NcbiAgICAvLyBmYWxsYmFjayBjaGVja3MgdGhlIGZvcmVncm91bmQgd2luZG93IGJlY2F1c2UgV2luZG93cyBUZXJtaW5hbCByZXBvcnRzIG5vXG4gICAgLy8gZm9jdXMgZXZlbnRzIGF0IGFsbC5cbiAgICBjb25zdCBub3RpZnlPbmx5V2hlblVuZm9jdXNlZCA9IG5vdGlmQ2ZnPy5vbmx5V2hlblVuZm9jdXNlZCA/PyB0cnVlO1xuICAgIGNvbnN0IGxvY2FsZSA9IHJlc29sdmVMb2NhbGUob3B0aW9ucy5sb2NhbGUpO1xuICAgIC8vIGBzaWRlYmFyLnNob3c6IGZhbHNlYCBrZWVwcyB0aGUgbm90aWZpY2F0aW9uIGhhbGYgYWxpdmUgd2hpbGUgY2xhaW1pbmcgbm9cbiAgICAvLyBgc2lkZWJhci5jb250ZW50YCBzbG90IGF0IGFsbCDigJQgbm8gY29tcG9uZW50IHRyZWUsIG5vIDFzIHRpY2tlci5cbiAgICBjb25zdCBzaG93U2lkZWJhciA9IG9wdGlvbnMuc2lkZWJhcj8uc2hvdyA/PyB0cnVlO1xuICAgIGNvbnN0IHNob3dGb2N1cyA9IG9wdGlvbnMuc2lkZWJhcj8uc2hvd0ZvY3VzID8/IGZhbHNlO1xuXG4gICAgLy8gU3ViYWdlbnRzIG9ic2VydmVkIHJ1bm5pbmcgZHVyaW5nIHRoaXMgYWN0aXZhdGlvbi4gUmVjb3JkZWQgZnJvbSB0aGUgbGl2ZVxuICAgIC8vIGV4ZWN1dGlvbiBldmVudCAobm90IGJ5IHBvbGxpbmcpIHNvIGEgZmFzdCBzdGFydC9maW5pc2ggc3RpbGwgZ2V0cyBhIHJvdy5cbiAgICBjb25zdCBbc2Vlbiwgc2V0U2Vlbl0gPSBjcmVhdGVTaWduYWwobmV3IFNldCgpKTtcbiAgICBjb25zdCBtYXJrU2VlbiA9IHNlc3Npb25JRCA9PiB7XG4gICAgICBzZXRTZWVuKHByZXZpb3VzID0+IHtcbiAgICAgICAgaWYgKHByZXZpb3VzLmhhcyhzZXNzaW9uSUQpKSByZXR1cm4gcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KHByZXZpb3VzKTtcbiAgICAgICAgbmV4dC5hZGQoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gLS0tIFRlcm1pbmFsIGZvY3VzIHRyYWNraW5nIChXaW5kb3dzIGZhbGxiYWNrKSAtLS1cbiAgICBpZiAobm90aWZ5T25seVdoZW5VbmZvY3VzZWQpIGVuc3VyZVdpbmRvd3NGb2N1c0luaXQoKTtcbiAgICBsZXQgZm9jdXNlZDtcbiAgICBjb25zdCBbZm9jdXNEaWFnLCBzZXRGb2N1c0RpYWddID0gY3JlYXRlU2lnbmFsKGdldEZvY3VzU3RhdHVzKCkpO1xuICAgIGNvbnN0IHJlZnJlc2hGb2N1c0RpYWcgPSAoKSA9PiBzZXRGb2N1c0RpYWcoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3Qgb25Gb2N1cyA9ICgpID0+IHtcbiAgICAgIGZvY3VzZWQgPSB0cnVlO1xuICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgIH07XG4gICAgY29uc3Qgb25CbHVyID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgIH07XG4gICAgY29udGV4dC5yZW5kZXJlci5vbihcImZvY3VzXCIsIG9uRm9jdXMpO1xuICAgIGNvbnRleHQucmVuZGVyZXIub24oXCJibHVyXCIsIG9uQmx1cik7XG4gICAgY29uc3Qgbm90aWZ5R2F0ZSA9IHtcbiAgICAgIG9ubHlXaGVuVW5mb2N1c2VkOiBub3RpZnlPbmx5V2hlblVuZm9jdXNlZCxcbiAgICAgIGZvY3VzZWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gYXdhaXQgaXNUZXJtaW5hbEZvY3VzZWQoKTtcbiAgICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgICAgICBkaWFnKFwiZm9jdXMtY2hlY2tcIiwge1xuICAgICAgICAgIHdpbjogd2luID8/IG51bGwsXG4gICAgICAgICAgcmVuZGVyZXI6IGZvY3VzZWQgPz8gbnVsbCxcbiAgICAgICAgICAuLi5nZXRGb2N1c1N0YXR1cygpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gd2luID8/IGZvY3VzZWQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFNlc3Npb24gSURzIGN1cnJlbnRseSBpbiBhIHJldHJ5IGJhY2tvZmYuIFYyIGV4cG9zZXMgb25seSBydW5uaW5nL2lkbGUgaW5cbiAgICAvLyBgZGF0YS5zZXNzaW9uLnN0YXR1cygpYCwgc28gdGhpcyBpcyB0aGUgb25seSB3YXkgdG8ga2VlcCB0aGUgVjEgXCJyZXRyeVwiIHN0YXRlLlxuICAgIGNvbnN0IFtyZXRyeWluZywgc2V0UmV0cnlpbmddID0gY3JlYXRlU2lnbmFsKG5ldyBTZXQoKSk7XG4gICAgY29uc3QgbWFya1JldHJ5aW5nID0gKHNlc3Npb25JRCwgdmFsdWUpID0+IHtcbiAgICAgIHNldFJldHJ5aW5nKHByZXZpb3VzID0+IHtcbiAgICAgICAgaWYgKHByZXZpb3VzLmhhcyhzZXNzaW9uSUQpID09PSB2YWx1ZSkgcmV0dXJuIHByZXZpb3VzO1xuICAgICAgICBjb25zdCBuZXh0ID0gbmV3IFNldChwcmV2aW91cyk7XG4gICAgICAgIGlmICh2YWx1ZSkgbmV4dC5hZGQoc2Vzc2lvbklEKTtlbHNlIG5leHQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBpc1N1YmFnZW50ID0gc2Vzc2lvbklEID0+IGNvbnRleHQuZGF0YS5zZXNzaW9uLmdldChzZXNzaW9uSUQpPy5wYXJlbnRJRCAhPT0gdW5kZWZpbmVkO1xuXG4gICAgLy8gV2luZG93cyBwYXRocyByZWFjaCB1cyBhcyBlaXRoZXIgYEM6XFxhXFxiYCAoVFVJIGN3ZCkgb3IgYEM6L2EvYmAgKHNlc3Npb25cbiAgICAvLyByZWNvcmRzKSwgc28gY29tcGFyZSBzbGFzaCBzdHlsZSBhbmQsIG9uIFdpbmRvd3MsIGNhc2UtaW5zZW5zaXRpdmVseS5cbiAgICBjb25zdCBub3JtYWxpemVQYXRoID0gdmFsdWUgPT4ge1xuICAgICAgY29uc3Qgc2xhc2hlZCA9IHZhbHVlLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gc2xhc2hlZC50b0xvd2VyQ2FzZSgpIDogc2xhc2hlZDtcbiAgICB9O1xuICAgIGNvbnN0IHNhbWVMb2NhdGlvbiA9IChhLCBiKSA9PiAhYSB8fCAhYiB8fCBub3JtYWxpemVQYXRoKGEpID09PSBub3JtYWxpemVQYXRoKGIpO1xuXG4gICAgLy8gQSBUVUkgY2FuIGJlIGF0dGFjaGVkIHRvIG9uZSBsb2NhdGlvbjsgaWdub3JlIGV2ZW50cyBmb3Igb3RoZXIgd29ya3RyZWVzLlxuICAgIC8vIEV4ZWN1dGlvbiBldmVudHMgY2Fycnkgbm8gYGxvY2F0aW9uYCwgc28gZmFsbCBiYWNrIHRvIHRoZSBzZXNzaW9uIHJlY29yZC5cbiAgICBjb25zdCBhdFRoaXNMb2NhdGlvbiA9IChldmVudCwgc2Vzc2lvbklEKSA9PiB7XG4gICAgICBjb25zdCBoZXJlID0gY29udGV4dC5sb2NhdGlvbj8uZGlyZWN0b3J5O1xuICAgICAgY29uc3QgdGhlcmUgPSBldmVudC5sb2NhdGlvbj8uZGlyZWN0b3J5ID8/IChzZXNzaW9uSUQgPyBjb250ZXh0LmRhdGEuc2Vzc2lvbi5nZXQoc2Vzc2lvbklEKT8ubG9jYXRpb24/LmRpcmVjdG9yeSA6IHVuZGVmaW5lZCk7XG4gICAgICBjb25zdCBvayA9IHNhbWVMb2NhdGlvbihoZXJlLCB0aGVyZSk7XG4gICAgICBpZiAoIW9rKSBkaWFnKFwibG9jYXRpb24tbWlzbWF0Y2hcIiwge1xuICAgICAgICBldmVudDogZXZlbnQudHlwZSxcbiAgICAgICAgaGVyZSxcbiAgICAgICAgdGhlcmVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9rO1xuICAgIH07XG5cbiAgICAvLyBPbmx5IGRpcmVjdCBjaGlsZHJlbiBjb3VudDogYSBncmFuZGNoaWxkIHJlcG9ydHMgdG8gaXRzIG93biBwYXJlbnQsIGFuZCBydW5uaW5nXG4gICAgLy8gc2hlbGxzIGFyZSBhIGRpZmZlcmVudCBjb25jZXJuLiBNaXJyb3JzIHRoZSBidWlsdC1pbiBub3RpZmljYXRpb25zIHBsdWdpbi5cbiAgICBjb25zdCBoYXNSdW5uaW5nQ2hpbGQgPSBzZXNzaW9uSUQgPT4gY29udGV4dC5kYXRhLnNlc3Npb24uZmFtaWx5KHNlc3Npb25JRCkuc29tZShjaGlsZCA9PiBjaGlsZCAhPT0gc2Vzc2lvbklEICYmIGNvbnRleHQuZGF0YS5zZXNzaW9uLmdldChjaGlsZCk/LnBhcmVudElEID09PSBzZXNzaW9uSUQgJiYgY29udGV4dC5kYXRhLnNlc3Npb24uc3RhdHVzKGNoaWxkKSA9PT0gXCJydW5uaW5nXCIpO1xuXG4gICAgLy8gLS0tIE5vdGlmaWNhdGlvbiBzdGF0ZSAtLS1cbiAgICBjb25zdCBhY3RpdmVTdWJhZ2VudHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IHJvdW5kQ291bnQgPSAwO1xuICAgIGxldCByb3VuZE5vdGlmaWVkID0gZmFsc2U7XG4gICAgY29uc3QgdGVybWluYWwgPSBuZXcgU2V0KCk7IC8vIHNlc3Npb25JRHMgd2hvc2UgY3VycmVudCBydW4gd2FzIGFubm91bmNlZFxuICAgIGNvbnN0IGVycm9yZWQgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgcGVuZGluZ0Zvcm1zID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IHBlbmRpbmdQZXJtaXNzaW9ucyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBQRVJNSVNTSU9OX05PVElGWV9ERUxBWV9NUyA9IDUwMDtcbiAgICBjb25zdCBzdGFydGVkID0gc2Vzc2lvbklEID0+IHtcbiAgICAgIHRlcm1pbmFsLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgZXJyb3JlZC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIG1hcmtSZXRyeWluZyhzZXNzaW9uSUQsIGZhbHNlKTtcbiAgICB9O1xuICAgIGNvbnN0IGVuZGVkID0gc2Vzc2lvbklEID0+IHtcbiAgICAgIGRpYWcoXCJlbmRlZDplbnRlclwiLCB7XG4gICAgICAgIHNlc3Npb25JRCxcbiAgICAgICAgdGVybWluYWw6IHRlcm1pbmFsLmhhcyhzZXNzaW9uSUQpLFxuICAgICAgICBlcnJvcmVkOiBlcnJvcmVkLmhhcyhzZXNzaW9uSUQpLFxuICAgICAgICBzdWJhZ2VudDogaXNTdWJhZ2VudChzZXNzaW9uSUQpLFxuICAgICAgICBub3RpZnlNYWluU2Vzc2lvblxuICAgICAgfSk7XG4gICAgICBpZiAodGVybWluYWwuaGFzKHNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIHRlcm1pbmFsLmFkZChzZXNzaW9uSUQpO1xuICAgICAgaWYgKGVycm9yZWQuaGFzKHNlc3Npb25JRCkpIHtcbiAgICAgICAgZXJyb3JlZC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzU3ViYWdlbnQoc2Vzc2lvbklEKSkgcmV0dXJuOyAvLyBjb3ZlcmVkIGJ5IHRoZSBiYXRjaCBub3RpZmljYXRpb24gYmVsb3dcbiAgICAgIGlmIChub3RpZnlNYWluU2Vzc2lvbikge1xuICAgICAgICBub3RpZnlUdXJuRG9uZShjb250ZXh0LCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHVuc3VicyA9IFtdO1xuICAgIGNvbnN0IGVuZGVkU3ViYWdlbnQgPSBzZXNzaW9uSUQgPT4ge1xuICAgICAgY29uc3QgdHJhY2tlZCA9IGFjdGl2ZVN1YmFnZW50cy5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGRpYWcoXCJlbmRlZFN1YmFnZW50XCIsIHtcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICB0cmFja2VkLFxuICAgICAgICByZW1haW5pbmc6IGFjdGl2ZVN1YmFnZW50cy5zaXplLFxuICAgICAgICByb3VuZE5vdGlmaWVkLFxuICAgICAgICBub3RpZnlTdWJhZ2VudHMsXG4gICAgICAgIHJvdW5kQ291bnRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF0cmFja2VkIHx8IGFjdGl2ZVN1YmFnZW50cy5zaXplID4gMCB8fCByb3VuZE5vdGlmaWVkKSByZXR1cm47XG4gICAgICByb3VuZE5vdGlmaWVkID0gdHJ1ZTtcbiAgICAgIGlmIChub3RpZnlTdWJhZ2VudHMpIHtcbiAgICAgICAgbm90aWZ5U3ViYWdlbnRzRG9uZShjb250ZXh0LCByb3VuZENvdW50LCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUmV0cnkgc3RhdGU6IHRoZSBob3N0IG9ubHkgcHJvamVjdHMgcnVubmluZy9pZGxlLCBzbyB0cmFjayB0aGUgdHJhbnNpZW50IGJhY2tvZmYuXG4gICAgLy8gT25seSB0aGUgc2lkZWJhciByZW5kZXJzIGl0LCBzbyBza2lwIHRoZSBzdWJzY3JpcHRpb24gd2hlbiB0aGUgc2VjdGlvbiBpcyBoaWRkZW4uXG4gICAgaWYgKHNob3dTaWRlYmFyKSB7XG4gICAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJzZXNzaW9uLnJldHJ5LnNjaGVkdWxlZFwiLCBldmVudCA9PiB7XG4gICAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgICAgIG1hcmtSZXRyeWluZyhldmVudC5kYXRhLnNlc3Npb25JRCwgdHJ1ZSk7XG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgLy8gRXhlY3V0aW9uIGxpZmVjeWNsZS4gVGhpcyBpcyB0aGUgVjIgcmVwbGFjZW1lbnQgZm9yIHRoZSBWMVxuICAgIC8vIHNlc3Npb24uc3RhdHVzIC8gbWVzc2FnZS5wYXJ0LnVwZGF0ZWQgY29tcGxldGlvbiBzaWduYWxzLlxuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24uZXhlY3V0aW9uLnN0YXJ0ZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgaGVyZSA9IGF0VGhpc0xvY2F0aW9uKGV2ZW50LCBldmVudC5kYXRhLnNlc3Npb25JRCk7XG4gICAgICBkaWFnKFwiZXZlbnQ6ZXhlY3V0aW9uLnN0YXJ0ZWRcIiwge1xuICAgICAgICBzZXNzaW9uSUQ6IGV2ZW50LmRhdGEuc2Vzc2lvbklELFxuICAgICAgICBsb2NhdGlvbjogZXZlbnQubG9jYXRpb24/LmRpcmVjdG9yeSxcbiAgICAgICAgYXRMb2NhdGlvbjogaGVyZVxuICAgICAgfSk7XG4gICAgICBpZiAoIWhlcmUpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LmRhdGEuc2Vzc2lvbklEO1xuICAgICAgc3RhcnRlZChzZXNzaW9uSUQpO1xuICAgICAgLy8gUmVjb3JkIGV2ZXJ5IHN0YXJ0OyB0aGUgcmVuZGVyZXIgb25seSBrZWVwcyBlbnRyaWVzIHdpdGggYSBwYXJlbnRJRC5cbiAgICAgIC8vIFRoaXMgc3RpbGwgY2F0Y2hlcyBhIHN1YmFnZW50IHdob3NlIHNlc3Npb24gaW5mbyBoYXMgbm90IGxhbmRlZCB5ZXQuXG4gICAgICBpZiAoc2hvd1NpZGViYXIpIG1hcmtTZWVuKHNlc3Npb25JRCk7XG4gICAgICBpZiAoIWlzU3ViYWdlbnQoc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgaWYgKGFjdGl2ZVN1YmFnZW50cy5zaXplID09PSAwKSB7XG4gICAgICAgIHJvdW5kQ291bnQgPSAwO1xuICAgICAgICByb3VuZE5vdGlmaWVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBhY3RpdmVTdWJhZ2VudHMuYWRkKHNlc3Npb25JRCk7XG4gICAgICByb3VuZENvdW50Kys7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24uZXhlY3V0aW9uLnN1Y2NlZWRlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50LCBldmVudC5kYXRhLnNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LmRhdGEuc2Vzc2lvbklEO1xuICAgICAgY29uc3Qgc3ViYWdlbnQgPSBpc1N1YmFnZW50KHNlc3Npb25JRCk7XG4gICAgICBkaWFnKFwiZXZlbnQ6ZXhlY3V0aW9uLnN1Y2NlZWRlZFwiLCB7XG4gICAgICAgIHNlc3Npb25JRCxcbiAgICAgICAgc3ViYWdlbnQsXG4gICAgICAgIHJ1bm5pbmdDaGlsZDogc3ViYWdlbnQgPyB1bmRlZmluZWQgOiBoYXNSdW5uaW5nQ2hpbGQoc2Vzc2lvbklEKSxcbiAgICAgICAgbm90aWZ5TWFpblNlc3Npb25cbiAgICAgIH0pO1xuICAgICAgbWFya1JldHJ5aW5nKHNlc3Npb25JRCwgZmFsc2UpO1xuICAgICAgaWYgKGlzU3ViYWdlbnQoc2Vzc2lvbklEKSkge1xuICAgICAgICBlbmRlZFN1YmFnZW50KHNlc3Npb25JRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEEgcnVubmluZyBzdWJhZ2VudCdzIHJlcG9ydCB3YWtlcyB0aGUgcGFyZW50IHNlc3Npb24gYWdhaW47IHdhaXQgZm9yIGl0LlxuICAgICAgaWYgKGhhc1J1bm5pbmdDaGlsZChzZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBlbmRlZChzZXNzaW9uSUQpO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJzZXNzaW9uLmV4ZWN1dGlvbi5mYWlsZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYgKCFhdFRoaXNMb2NhdGlvbihldmVudCwgZXZlbnQuZGF0YS5zZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5kYXRhLnNlc3Npb25JRDtcbiAgICAgIGRpYWcoXCJldmVudDpleGVjdXRpb24uZmFpbGVkXCIsIHtcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICBzdWJhZ2VudDogaXNTdWJhZ2VudChzZXNzaW9uSUQpLFxuICAgICAgICBub3RpZnlFcnJvcnNcbiAgICAgIH0pO1xuICAgICAgbWFya1JldHJ5aW5nKHNlc3Npb25JRCwgZmFsc2UpO1xuICAgICAgZXJyb3JlZC5hZGQoc2Vzc2lvbklEKTtcbiAgICAgIGlmIChpc1N1YmFnZW50KHNlc3Npb25JRCkpIHtcbiAgICAgICAgZW5kZWRTdWJhZ2VudChzZXNzaW9uSUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW5kZWQoc2Vzc2lvbklEKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90aWZ5RXJyb3JzKSByZXR1cm47XG4gICAgICAvLyBBIGZhaWxlZCBydW4gbmV2ZXIgcmVhY2hlcyB0aGUgXCJkb25lXCIgbm90aWZpY2F0aW9uOiBgZW5kZWRgIGJhaWxzIG91dCBvblxuICAgICAgLy8gYGVycm9yZWRgLCBzbyB0aGlzIGlzIHRoZSBvbmx5IHNpZ25hbCB0aGUgdXNlciBnZXRzIGZvciBhIGJyb2tlbiB0dXJuLlxuICAgICAgY29uc3QgaW5mbyA9IGNvbnRleHQuZGF0YS5zZXNzaW9uLmdldChzZXNzaW9uSUQpO1xuICAgICAgY29uc3QgZGV0YWlsID0gaW5mbz8udGl0bGUgfHwgaW5mbz8uYWdlbnQgfHwgdW5kZWZpbmVkO1xuICAgICAgbm90aWZ5U2Vzc2lvbkVycm9yKGNvbnRleHQsIGlzU3ViYWdlbnQoc2Vzc2lvbklEKSA/IFwic3ViYWdlbnRcIiA6IFwic2Vzc2lvblwiLCBkZXRhaWwsIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJzZXNzaW9uLmV4ZWN1dGlvbi5pbnRlcnJ1cHRlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50LCBldmVudC5kYXRhLnNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LmRhdGEuc2Vzc2lvbklEO1xuICAgICAgZGlhZyhcImV2ZW50OmV4ZWN1dGlvbi5pbnRlcnJ1cHRlZFwiLCB7XG4gICAgICAgIHNlc3Npb25JRCxcbiAgICAgICAgc3ViYWdlbnQ6IGlzU3ViYWdlbnQoc2Vzc2lvbklEKVxuICAgICAgfSk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgICBpZiAoaXNTdWJhZ2VudChzZXNzaW9uSUQpKSB7XG4gICAgICAgIGVuZGVkU3ViYWdlbnQoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZW5kZWQoc2Vzc2lvbklEKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5kZWxldGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQsIGV2ZW50LmRhdGEuc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQuZGF0YS5zZXNzaW9uSUQ7XG4gICAgICB0ZXJtaW5hbC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGVycm9yZWQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBhY3RpdmVTdWJhZ2VudHMuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgICBzZXRTZWVuKHByZXZpb3VzID0+IHtcbiAgICAgICAgaWYgKCFwcmV2aW91cy5oYXMoc2Vzc2lvbklEKSkgcmV0dXJuIHByZXZpb3VzO1xuICAgICAgICBjb25zdCBuZXh0ID0gbmV3IFNldChwcmV2aW91cyk7XG4gICAgICAgIG5leHQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgLy8gSW50ZXJ2aWV3IGJsb2NrZWQ6IFYyIGZvcm1zIHJlcGxhY2UgdGhlIFYxIGBxdWVzdGlvbmAgdG9vbCBldmVudHMsIGFuZFxuICAgIC8vIHBlcm1pc3Npb25zIHN0aWxsIGFycml2ZSBhcyB0aGVpciBvd24gcmVxdWVzdC9yZXNwb25zZSBwYWlyLlxuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcImZvcm0uY3JlYXRlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50LCBldmVudC5kYXRhLmZvcm0uc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgY29uc3QgZm9ybSA9IGV2ZW50LmRhdGEuZm9ybTtcbiAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IGlzU3ViYWdlbnQoZm9ybS5zZXNzaW9uSUQpIHx8IHBlbmRpbmdGb3Jtcy5oYXMoZm9ybS5pZCkpIHJldHVybjtcbiAgICAgIHBlbmRpbmdGb3Jtcy5hZGQoZm9ybS5pZCk7XG4gICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChjb250ZXh0LCBcInF1ZXN0aW9uXCIsIGZvcm0udGl0bGUsIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJmb3JtLnJlcGxpZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgcGVuZGluZ0Zvcm1zLmRlbGV0ZShldmVudC5kYXRhLmlkKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwiZm9ybS5jYW5jZWxsZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgcGVuZGluZ0Zvcm1zLmRlbGV0ZShldmVudC5kYXRhLmlkKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwicGVybWlzc2lvbi5hc2tlZFwiLCBldmVudCA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlkLFxuICAgICAgICBzZXNzaW9uSUQsXG4gICAgICAgIGFjdGlvblxuICAgICAgfSA9IGV2ZW50LmRhdGE7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50LCBzZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBpZiAoIW5vdGlmeUludGVydmlldyB8fCBpc1N1YmFnZW50KHNlc3Npb25JRCkgfHwgcGVuZGluZ1Blcm1pc3Npb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChwZW5kaW5nUGVybWlzc2lvbnMuZGVsZXRlKGlkKSkge1xuICAgICAgICAgIG5vdGlmeUludGVydmlld0lucHV0KGNvbnRleHQsIFwicGVybWlzc2lvblwiLCBhY3Rpb24sIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICB9XG4gICAgICB9LCBQRVJNSVNTSU9OX05PVElGWV9ERUxBWV9NUyk7XG4gICAgICBwZW5kaW5nUGVybWlzc2lvbnMuc2V0KGlkLCB0aW1lcik7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInBlcm1pc3Npb24ucmVwbGllZFwiLCBldmVudCA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHBlbmRpbmdQZXJtaXNzaW9ucy5nZXQoZXZlbnQuZGF0YS5yZXF1ZXN0SUQpO1xuICAgICAgaWYgKCF0aW1lcikgcmV0dXJuO1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUoZXZlbnQuZGF0YS5yZXF1ZXN0SUQpO1xuICAgIH0pKTtcblxuICAgIC8vIGBzaWRlYmFyLnNob3c6IGZhbHNlYCBzdGlsbCByZWdpc3RlcnMgdGhlIGV2ZW50IHBsdW1iaW5nIGFib3ZlIChub3RpZmljYXRpb25zIGtlZXBcbiAgICAvLyB3b3JraW5nKSBidXQgY29udHJpYnV0ZXMgbm90aGluZyB0byB0aGUgc2lkZWJhci4gVGhlIG9wdGlvbiBpcyByZWFkIG9uY2UgYXQgc2V0dXAsXG4gICAgLy8gc28gdGhpcyBpcyBhIHN0YXJ0dXAtbGV2ZWwgc3dpdGNoLCBub3QgYSBydW50aW1lIHRvZ2dsZS5cbiAgICBpZiAoc2hvd1NpZGViYXIpIHtcbiAgICAgIGNvbnRleHQudWkuc2xvdCh7XG4gICAgICAgIC8vIEZpcnN0IGluIHRoZSBzaWRlYmFyOiBhIGxpdmUgc3RhdHVzIHNlY3Rpb24gbXVzdCBzdGF5IHZpc2libGUgd2hlbiB0aGVcbiAgICAgICAgLy8gYnVpbHQtaW4gQ29udGV4dC9NQ1AvVG9kbyBibG9ja3MgZmlsbCB0aGUgY29sdW1uLlxuICAgICAgICBwcmVwZW5kOiBcInNpZGViYXIuY29udGVudFwiLFxuICAgICAgICByZW5kZXI6IHNsb3QgPT4gXyRjcmVhdGVDb21wb25lbnQoU2lkZWJhciwge1xuICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgZ2V0IHNlc3Npb25JRCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzbG90LnNlc3Npb25JRDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJldHJ5aW5nOiByZXRyeWluZyxcbiAgICAgICAgICBzZWVuOiBzZWVuLFxuICAgICAgICAgIG1hcmtTZWVuOiBtYXJrU2VlbixcbiAgICAgICAgICBmb2N1c0RpYWc6IGZvY3VzRGlhZyxcbiAgICAgICAgICBzaG93Rm9jdXM6IHNob3dGb2N1cyxcbiAgICAgICAgICBsb2NhbGU6IGxvY2FsZVxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250ZXh0LnJlbmRlcmVyLm9mZihcImZvY3VzXCIsIG9uRm9jdXMpO1xuICAgICAgY29udGV4dC5yZW5kZXJlci5vZmYoXCJibHVyXCIsIG9uQmx1cik7XG4gICAgICBmb3IgKGNvbnN0IHRpbWVyIG9mIHBlbmRpbmdQZXJtaXNzaW9ucy52YWx1ZXMoKSkgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5jbGVhcigpO1xuICAgICAgdW5zdWJzLnJldmVyc2UoKS5mb3JFYWNoKHVuc3Vic2NyaWJlID0+IHVuc3Vic2NyaWJlKCkpO1xuICAgIH07XG4gIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgcGx1Z2luOyIsIi8qKlxyXG4gKiBJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgZm9yIG9wZW5jb2RlLWFnZW50LXB1bHNlLlxyXG4gKlxyXG4gKiBTdXBwb3J0ZWQgbG9jYWxlczogRW5nbGlzaCAoXCJlblwiLCBkZWZhdWx0KSBhbmQgU2ltcGxpZmllZCBDaGluZXNlIChcInpoXCIpLlxyXG4gKiBUaGUgbG9jYWxlIGlzIHNlbGVjdGVkIHZpYSB0aGUgcGx1Z2luIGBsb2NhbGVgIG9wdGlvbiAodHVwbGUgZm9ybSk6XHJcbiAqXHJcbiAqICAgW1wib3BlbmNvZGUtYWdlbnQtcHVsc2VcIiwgeyBcImxvY2FsZVwiOiBcInpoXCIgfV1cclxuICpcclxuICogT25seSB1c2VyLWZhY2luZyBzdHJpbmdzIChub3RpZmljYXRpb24gbWVzc2FnZXMgYW5kIHRoZSBzaWRlYmFyIHNlY3Rpb24gdGl0bGUpXHJcbiAqIGFyZSBsb2NhbGl6ZWQ7IGludGVybmFsIHN0YXR1cyBsYWJlbHMgKFwiYnVzeVwiL1wiaWRsZVwiL1wicmV0cnlcIi9cImRvbmVcIikgcmVtYWluXHJcbiAqIEVuZ2xpc2ggYXMgc3RhYmxlIGlkZW50aWZpZXJzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCB0eXBlIExvY2FsZSA9IFwiZW5cIiB8IFwiemhcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZXMge1xyXG4gIC8qKiBTaWRlYmFyIHNlY3Rpb24gdGl0bGUuICovXHJcbiAgc3ViYWdlbnRzOiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIGEgYmF0Y2ggb2Ygc3ViYWdlbnRzIGZpbmlzaGVzLiAqL1xyXG4gIHN1YmFnZW50c0RvbmU6IChjb3VudDogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIHRoZSBtYWluIHNlc3Npb24gZmluaXNoZXMgYSB0dXJuLiAqL1xyXG4gIHR1cm5Eb25lOiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIHRoZSBtYWluIHNlc3Npb24gbmVlZHMgYSBwZXJtaXNzaW9uIGFwcHJvdmFsLiAqL1xyXG4gIHBlcm1pc3Npb25SZXF1aXJlZDogKGRldGFpbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIC8qKiBOb3RpZmljYXRpb24gd2hlbiB0aGUgbWFpbiBzZXNzaW9uIG5lZWRzIGFuIGFuc3dlciB0byBhIHF1ZXN0aW9uLiAqL1xyXG4gIHF1ZXN0aW9uUmVxdWlyZWQ6IChkZXRhaWw/OiBzdHJpbmcpID0+IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gYSBtYWluLXNlc3Npb24gZXhlY3V0aW9uIGZhaWxzLiAqL1xyXG4gIHNlc3Npb25FcnJvcjogKGRldGFpbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIC8qKiBOb3RpZmljYXRpb24gd2hlbiBhIHN1YmFnZW50IGV4ZWN1dGlvbiBmYWlscy4gKi9cclxuICBzdWJhZ2VudEVycm9yOiAoZGV0YWlsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IGRpY3Rpb25hcmllczogUmVjb3JkPExvY2FsZSwgTWVzc2FnZXM+ID0ge1xyXG4gIGVuOiB7XHJcbiAgICBzdWJhZ2VudHM6IFwiU3ViYWdlbnRzXCIsXHJcbiAgICBzdWJhZ2VudHNEb25lOiAoY291bnQpID0+XHJcbiAgICAgIGNvdW50ID4gMSA/IGBBbGwgJHtjb3VudH0gc3ViYWdlbnRzIGNvbXBsZXRlZGAgOiBcIlN1YmFnZW50IGNvbXBsZXRlZFwiLFxyXG4gICAgdHVybkRvbmU6IFwiVHVybiBjb21wbGV0ZWRcIixcclxuICAgIHBlcm1pc3Npb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYFBlcm1pc3Npb24gcmVxdWlyZWQ6ICR7ZGV0YWlsfWAgOiBcIk1haW4gc2Vzc2lvbiByZXF1aXJlcyBwZXJtaXNzaW9uXCIsXHJcbiAgICBxdWVzdGlvblJlcXVpcmVkOiAoZGV0YWlsKSA9PlxyXG4gICAgICBkZXRhaWwgPyBgQW5zd2VyIHJlcXVpcmVkOiAke2RldGFpbH1gIDogXCJNYWluIHNlc3Npb24gcmVxdWlyZXMgYW4gYW5zd2VyXCIsXHJcbiAgICBzZXNzaW9uRXJyb3I6IChkZXRhaWwpID0+IChkZXRhaWwgPyBgU2Vzc2lvbiBmYWlsZWQ6ICR7ZGV0YWlsfWAgOiBcIlNlc3Npb24gZmFpbGVkXCIpLFxyXG4gICAgc3ViYWdlbnRFcnJvcjogKGRldGFpbCkgPT4gKGRldGFpbCA/IGBTdWJhZ2VudCBmYWlsZWQ6ICR7ZGV0YWlsfWAgOiBcIlN1YmFnZW50IGZhaWxlZFwiKSxcclxuICB9LFxyXG4gIHpoOiB7XHJcbiAgICBzdWJhZ2VudHM6IFwi5a2QIGFnZW50XCIsXHJcbiAgICBzdWJhZ2VudHNEb25lOiAoY291bnQpID0+XHJcbiAgICAgIGNvdW50ID4gMSA/IGDlhajpg6ggJHtjb3VudH0g5Liq5a2QIGFnZW50IOW3suWujOaIkGAgOiBcIuWtkCBhZ2VudCDlt7LlrozmiJBcIixcclxuICAgIHR1cm5Eb25lOiBcIuacrOi9ruWvueivneW3suWujOaIkFwiLFxyXG4gICAgcGVybWlzc2lvblJlcXVpcmVkOiAoZGV0YWlsKSA9PlxyXG4gICAgICBkZXRhaWwgPyBg6ZyA6KaB5p2D6ZmQ56Gu6K6kOiAke2RldGFpbH1gIDogXCLkuLvkvJror53pnIDopoHmnYPpmZDnoa7orqRcIixcclxuICAgIHF1ZXN0aW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGDpnIDopoHlm57nrZQ6ICR7ZGV0YWlsfWAgOiBcIuS4u+S8muivnemcgOimgeWbnuetlOivoumXrlwiLFxyXG4gICAgc2Vzc2lvbkVycm9yOiAoZGV0YWlsKSA9PiAoZGV0YWlsID8gYOS8muivneaJp+ihjOWksei0pTogJHtkZXRhaWx9YCA6IFwi5Lya6K+d5omn6KGM5aSx6LSlXCIpLFxyXG4gICAgc3ViYWdlbnRFcnJvcjogKGRldGFpbCkgPT4gKGRldGFpbCA/IGDlrZAgYWdlbnQg5omn6KGM5aSx6LSlOiAke2RldGFpbH1gIDogXCLlrZAgYWdlbnQg5omn6KGM5aSx6LSlXCIpLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vKiogTm9ybWFsaXplIGFuIGFyYml0cmFyeSBvcHRpb24gdmFsdWUgaW50byBhIHN1cHBvcnRlZCBsb2NhbGUgKGRlZmF1bHRzIHRvIFwiZW5cIikuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlTG9jYWxlKGlucHV0OiB1bmtub3duKTogTG9jYWxlIHtcclxuICBpZiAoaW5wdXQgPT09IFwiemhcIiB8fCBpbnB1dCA9PT0gXCJ6aC1DTlwiIHx8IGlucHV0ID09PSBcInpoX0NOXCIgfHwgaW5wdXQgPT09IFwiemgtSGFuc1wiKSB7XHJcbiAgICByZXR1cm4gXCJ6aFwiO1xyXG4gIH1cclxuICByZXR1cm4gXCJlblwiO1xyXG59XHJcblxyXG4vKiogR2V0IHRoZSBtZXNzYWdlIGRpY3Rpb25hcnkgZm9yIGEgbG9jYWxlIChmYWxscyBiYWNrIHRvIEVuZ2xpc2gpLiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdChsb2NhbGU6IExvY2FsZSk6IE1lc3NhZ2VzIHtcclxuICByZXR1cm4gZGljdGlvbmFyaWVzW2xvY2FsZV0gPz8gZGljdGlvbmFyaWVzLmVuO1xyXG59XHJcbiIsImltcG9ydCB7IGFwcGVuZEZpbGVTeW5jLCBleGlzdHNTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcclxuaW1wb3J0IHsgdG1wZGlyIH0gZnJvbSBcIm5vZGU6b3NcIjtcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuXHJcbi8qKlxyXG4gKiBURU1QT1JBUlkgZGlhZ25vc3RpYyBjaGFubmVsIChkZWJ1ZyBidWlsZHMgb25seSkuXHJcbiAqXHJcbiAqIEVuYWJsZWQgYnkgdGhlIGBkZWJ1ZzogdHJ1ZWAgcGx1Z2luIG9wdGlvbiwgb3Ig4oCUIGZvciBmaWVsZCBkZWJ1Z2dpbmcgd2l0aG91dFxyXG4gKiB0b3VjaGluZyB0aGUgdXNlcidzIGNvbmZpZyDigJQgYnkgY3JlYXRpbmcgdGhlIG1hcmtlciBmaWxlXHJcbiAqIGA8dG1wPi9vcGVuY29kZS1hZ2VudC1wdWxzZS1kZWJ1Zy5vbmAgYmVmb3JlIHRoZSBwbHVnaW4gKHJlKWxvYWRzLlxyXG4gKlxyXG4gKiBBcHBlbmRzIG9uZSBsaW5lIHBlciBpbnRlcmVzdGluZyBzdGVwIHRvIGA8dG1wPi9vcGVuY29kZS1hZ2VudC1wdWxzZS1kaWFnLmxvZ2BcclxuICogc28gYSBidWcgcmVwb3J0IGNhbiBzaG93IHdoZXRoZXIgc2V0dXAgcmFuLCB3aGljaCBldmVudHMgYXJyaXZlZCwgYW5kIGhvdyB0aGVcclxuICogbm90aWZpY2F0aW9uIGRpc3BhdGNoIHJlc29sdmVkLlxyXG4gKi9cclxuY29uc3QgTUFSS0VSID0gam9pbih0bXBkaXIoKSwgXCJvcGVuY29kZS1hZ2VudC1wdWxzZS1kZWJ1Zy5vblwiKTtcclxuZXhwb3J0IGNvbnN0IERJQUdfRklMRSA9IGpvaW4odG1wZGlyKCksIFwib3BlbmNvZGUtYWdlbnQtcHVsc2UtZGlhZy5sb2dcIik7XHJcblxyXG5sZXQgZW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXREaWFnKG9wdGlvbj86IGJvb2xlYW4pOiB2b2lkIHtcclxuICBlbmFibGVkID0gb3B0aW9uID09PSB0cnVlIHx8IGV4aXN0c1N5bmMoTUFSS0VSKTtcclxuICBpZiAoZW5hYmxlZCkgZGlhZyhcImRpYWcgZW5hYmxlZFwiLCB7IHBpZDogcHJvY2Vzcy5waWQsIG9wdGlvbjogb3B0aW9uID09PSB0cnVlLCBtYXJrZXI6IGV4aXN0c1N5bmMoTUFSS0VSKSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpYWdFbmFibGVkKCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBlbmFibGVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlhZyhldmVudDogc3RyaW5nLCBkYXRhPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcclxuICBpZiAoIWVuYWJsZWQpIHJldHVybjtcclxuICB0cnkge1xyXG4gICAgYXBwZW5kRmlsZVN5bmMoRElBR19GSUxFLCBgJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCl9IHBpZD0ke3Byb2Nlc3MucGlkfSAke2V2ZW50fSR7ZGF0YSA/IFwiIFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBcIlwifVxcbmApO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgLy8gZGlhZ25vc3RpY3MgbXVzdCBuZXZlciBicmVhayB0aGUgcGx1Z2luXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgQXR0ZW50aW9uU291bmQsIENvbnRleHQgfSBmcm9tIFwiQG9wZW5jb2RlL3BsdWdpbi90dWkvY29udGV4dFwiO1xyXG5pbXBvcnQgdHlwZSB7IExvY2FsZSB9IGZyb20gXCIuL2kxOG5cIjtcclxuaW1wb3J0IHsgdCB9IGZyb20gXCIuL2kxOG5cIjtcclxuaW1wb3J0IHsgZGlhZyB9IGZyb20gXCIuL2RpYWdcIjtcclxuXHJcbi8qKlxyXG4gKiBOb3RpZmljYXRpb24gZGlzcGF0Y2ggZm9yIG9wZW5jb2RlLWFnZW50LXB1bHNlLlxyXG4gKlxyXG4gKiBPbmUgaG9zdCBjaGFubmVsIHBsdXMgYSBXaW5kb3dzIGZhbGxiYWNrOlxyXG4gKlxyXG4gKiAgIC0gRXZlcnkgcGxhdGZvcm0gY2FsbHMgYGNvbnRleHQuYXR0ZW50aW9uLm5vdGlmeSgpYCBmaXJzdCwgc28gdGhlIGhvc3QncyBhdHRlbnRpb25cclxuICogICAgIGVuYWJsZS9kaXNhYmxlIHBvbGljeSBhbmQgc291bmQgY29uZmlndXJhdGlvbiBhcHBseS4gbWFjT1MgaVRlcm0yL0dob3N0dHkgYW5kXHJcbiAqICAgICBMaW51eCBraXR0eS9mb290IGltcGxlbWVudCB0aGUgT1NDIDkvOTkgcHJvdG9jb2wgdXNlZCBmb3Igc3lzdGVtIG5vdGlmaWNhdGlvbnMuXHJcbiAqICAgLSBXaW5kb3dzIFRlcm1pbmFsIGRvZXMgTk9UIGltcGxlbWVudCBPU0MgOTkgKyBERUMgMTAwNCAoa25vd24gaXNzdWUgIzM1MDU1KSwgc28gdGhlXHJcbiAqICAgICBob3N0IHJlcG9ydHMgYG5vdGlmaWNhdGlvbjogZmFsc2VgIHdoaWxlIHN0aWxsIHBsYXlpbmcgdGhlIHNvdW5kLiBJbiB0aGF0IGNhc2Ugd2VcclxuICogICAgIHBvc3QgYSByZWFsIEFjdGlvbiBDZW50ZXIgdG9hc3QgdGhyb3VnaCBgbm9kZS1ub3RpZmllcmAgKGJ1bmRsZWQgU25vcmVUb2FzdC5leGUpLlxyXG4gKiAgICAgSWYgYXR0ZW50aW9uIGlzIGdsb2JhbGx5IGRpc2FibGVkIHdlIHNraXAgdGhlIGZhbGxiYWNrIHRvby5cclxuICpcclxuICogQWxsIGZ1bmN0aW9ucyBhcmUgYmVzdC1lZmZvcnQ6IGZhaWx1cmVzIGFyZSBzd2FsbG93ZWQgc28gYSBub3RpZmljYXRpb24gcHJvYmxlbSBuZXZlclxyXG4gKiBicmVha3MgdGhlIHBsdWdpbi5cclxuICovXHJcblxyXG50eXBlIEFwaSA9IFBpY2s8Q29udGV4dCwgXCJhdHRlbnRpb25cIiB8IFwidWlcIj47XHJcblxyXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xyXG5cclxuLy8gQXBwVXNlck1vZGVsSUQgdXNlZCBmb3IgdGhlIFdpbmRvd3MgdG9hc3QuIG5vZGUtbm90aWZpZXIgcmVxdWlyZXMgYW4gQVVNSUQgZm9yXHJcbi8vIEFjdGlvbiBDZW50ZXIgdG9hc3RzIHRvIGdyb3VwIHByb3Blcmx5IGFuZCBzaG93IGEgZnJpZW5kbHkgYXBwIG5hbWUuXHJcbmNvbnN0IFdJTkRPV1NfQVBQX0lEID0gXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiO1xyXG5cclxuLy8gT3BlbkNvZGUgbG9nbyBhcyBhIFBORyAocHJlLXJlbmRlcmVkIGZyb20gdGhlIFNWRyBpbiBzY3JpcHRzL2dlbi1pY29uLnRzIGF0IDI1NngzMjApLFxyXG4vLyBlbmNvZGVkIGFzIGJhc2U2NC4gUGFzc2VkIHRvIG5vZGUtbm90aWZpZXIncyBgaWNvbmAgZmllbGQgc28gdGhlIFdpbmRvd3MgQWN0aW9uIENlbnRlclxyXG4vLyB0b2FzdCBzaG93cyB0aGUgT3BlbkNvZGUgbG9nbyBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IGljb24uIEJlY2F1c2Ugbm9kZS1ub3RpZmllcidzXHJcbi8vIFdpbmRvd3MgYnJhbmNoIGV4cGVjdHMgYSBmaWxlIHBhdGggKG5vdCBhIGRhdGEgVVJMKSwgd2UgZGVjb2RlIHRoaXMgdG8gYSB0ZW1wIGZpbGUgYXRcclxuLy8gZGlzcGF0Y2ggdGltZSAoc2VlIHdpbmRvd3NOb3RpZnkpLlxyXG5jb25zdCBPUEVOQ09ERV9JQ09OX1BOR19CNjQgPVxyXG4gIFwiaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVFBQUFBRkFDQVlBQUFCVEtxSUtBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBS1owbEVcIiArXHJcbiAgXCJRVlI0bk8zZE1XNGtRUXhEMFRsSkFiei9FZXk3eVpGak81TUFQZ0hLRjIzeWIwOTFpZnJrdmRHZUFRMjh5bWZ3MmY0SGFNK0FCaDRBRUFFUVwiICtcclxuICBcIjBNRHpCa0FFUUVBRHowOEFJZ0FDR25qT0FJZ0FDR2pnT1FRa0FpQ2dnZWNyQUJFQUFRMDhud0dKQUFobzRMa0hRQVJBUUFQUFJTQWlBQUlhXCIgK1xyXG4gIFwiZUc0Q0VnRVEwTUJ6RlpnSWdJQUdubGtBSWdBQ0duaUdnWWdBQ0dqZ21RWWtBaUNnZ1djY21BaUFJSjZCUEFBaUFJSVVQd09CSUFmK0NOb3pcIiArXHJcbiAgXCJDQUFRQVJEUVFMd0JFQUVRMEVEOEJDQUNJS0NCT0FNZ0FpQ2dnVGdFSkFJZ29JSDRDa0FFUUVBRDhSbVFDSUNBQnVJZUFCRUFBUTNFUlNBaVwiICtcclxuICBcIkFBSWFpSnVBUkFBRU5CQlhnWWtBQ0dnZ1pnR0lBQWhvSUlhQmlBQUlhQ0NtQVlrQUNHZ2d4b0dKQUFoZS9UT1FCMEFFOVNaSXNRWUE0TUFmXCIgK1xyXG4gIFwiUVhzR0FRQWlBQUlhaURjQUlnQUNHb2lmQUVRQUJEUVFad0JFQUFRMEVJZUFSQUFFTkJCZkFZZ0FDR2dnUGdNU0FSRFFRTndESUFJZ29JRzRcIiArXHJcbiAgXCJDRVFFUUVBRGNST1FDSUNBQnVJcU1CRUFBUTNFTEFBUkFBRU54REFRRVFBQkRjUTBJQkVBQVEzRU9EQVJBTUdyZndieUFJaWczZ1FwMWdBQVwiICtcclxuICBcIkhQZ2phTThnQUVBRVFFQUQ4UVpBQkVCQUEvRVRnQWlBZ0FiaURJQUlnSUFHNGhDUUNJQ0FCdUlyQUJFQUFRM0VaMEFpQUFJYWlIc0FSQUFFXCIgK1xyXG4gIFwiTkJBWGdZZ0FDR2dnYmdJU0FSRFFRRndGSmdJZ29JR1lCZmhqR0VKVlY4b2g0UUdvNnNvQkV3TEFKZ0ZWZGVXQUNRRUFBQlFBek1wL2dOc0VcIiArXHJcbiAgXCIybTdPNjY0YzBLQTNBQUJRQUREZUFMd0JLRzhBNHllQW53REtUNEJ4QnVBTVFEa0RHSWVBRGdHVlE4RHhGY0JYQU9VcndQZ002RE9nOGhsd1wiICtcclxuICBcIjNBTndEMEM1QnpBdUFya0lwRndFR2pjQjNRUlViZ0tPcThDdUFpdFhnY2NzZ0ZrQVpSWmdEQU1aQmxLR2djWTBvR2xBWlJwd2pBTWJCMWJHXCIgK1xyXG4gIFwiZ1VjZWdEeUErc3FCbVh4NUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXHJcbiAgXCJsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQVwiICtcclxuICBcImxEeUFrUWNnRDZDK2NtQW1YeDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBXCIgK1xyXG4gIFwiUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXHJcbiAgXCJQQUFsRDJEa0FjZ0RxSzhjbU1tWEJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0E4Z0NVUElDUlwiICtcclxuICBcIkJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0Evd0RCOTllWExuNEdPWEFmM3l6QTRrUFlGcUFHXCIgK1xyXG4gIFwiZ0d6T3dtd1RhTHNac0J0Q09hQkJBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBcIiArXHJcbiAgXCJkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12blwiICtcclxuICBcImdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZXCIgK1xyXG4gIFwiRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JcIiArXHJcbiAgXCJBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzA5cllCdDl0MlwiICtcclxuICBcIjRBTWkxQUFRQU5naElQTjFBeWdIL2hmMkJ1QW53TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBXCIgK1xyXG4gIFwid0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NcIiArXHJcbiAgXCJHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUlwiICtcclxuICBcIldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxXCIgK1xyXG4gIFwiYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hcIiArXHJcbiAgXCJUQWdBQUxCdWhOYmVOdUIyZjdiL0FkdTlMVUFOQUFFQUFBQUNid0R4QnVBTkFBajhCSWlmQUg0Q0FJRXpnRGdEY0FZQUJBNEI0eERRSVNBUVwiICtcclxuICBcIitBb1FYd0Y4QlFBQ253SGpNNkRQZ0VEZ0hrRGNBM0FQQUFoY0JJcUxRQzRDQVlHYmdIRVQwRTFBSUhBVk9LNEN1d29NQkdZQlloYkFMQUFRXCIgK1xyXG4gIFwiR0FhS1lTRERRRUJnR2pDbUFVMERBb0Z4NEJnSE5nNE1CUElBNUFISUE2Z0hRUTVrVXNnRGtBZFFiMFNKUUU4ZWdFUWdJQkFKOXVRQmlBUURcIiArXHJcbiAgXCJBcG1BVHg2QVRFQWdFQXI2NUFFSUJRVUNxY0JQSG9CVVlDQVFDLzdrQVlnRkJ3SjdBWjQ4QUhzQmdNQmlrQ2NQd0dJUUlMQVo2TWtEc0JrSVwiICtcclxuICBcIkNLd0dlL0lBckFZREFyc0JuendBdXdHQndITFFKdy9BY2xBZ3NCMzR5UU93SFJnSXJBZC84Z0NzQndlQ1h4RGt3RWl1Y1dEandNYUJyUWNmXCIgK1xyXG4gIFwiNjhHdEJ3Y0M2OEhIZW5EcndZSEFldkN4SHR4NmNDQ3dIbnlzQjdjZUhBaXNCeC9yd2EwSEJ3THJ3Y2Q2Y092QmdjQjY4TEVlM0hwd0lMQWVcIiArXHJcbiAgXCJmS3dIdHg0Y0NLd0hIK3ZCclFjSEF1dkJ4M3B3NjhHQndIcndzUjdjZW5BZ3NCNThyQWUzSGh3SXJBY2Y2OEd0QndjQzY4SEhlbkRyd1lIQVwiICtcclxuICBcIk9QQllEMjQ5ZUQwSWNtQW1YeDZBUElCNkk4b0RlUElBNUFFQWdUeUFKdzlBSGdBUXlBTjQ4Z0RrQVFDQlBJQW5EMEFlQUJESUEzanlBT1FCXCIgK1xyXG4gIFwiQUlFOGdDY1BRQjRBRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJBSUU4Z0NjUFFCNEFcIiArXHJcbiAgXCJFTWdEZVBJQTVBRUFnVHlBSnc5QUhnQVF5QU40OGdEa0FRQkJEc3preXdNNDhDQzBaNURDWi9EWi9nZG96NEFHSGdBUUFSRFF3UE1HUUFSQVwiICtcclxuICBcIlFBUFBUd0FpQUFJYWVNNEFpQUFJYU9BNUJDUUNJS0NCNXlzQUVRQUJEVHlmQVlrQUNHamd1UWRBQkVCQUE4OUZJQ0lBQWhwNGJnSVNBUkRRXCIgK1xyXG4gIFwid0hNVm1BaUFnQWFlV1FBaUFBSWFlSWFCaUFBSWFPQ1pCaVFDSUtDQlp4eVlDSUFnbm9FOEFDSUFnaFEvQTRFZ0IvNEkyak1JQUJBQkVOQkFcIiArXHJcbiAgXCJ2QUVRQVJEUVFQd0VJQUlnb0lFNEF5QUNJS0NCT0FRa0FpQ2dnZmdLUUFSQVFBUHhHWkFJZ0lBRzRoNEFFUUFCRGNSRklDSUFBaHFJbTRCRVwiICtcclxuICBcIkFBUTBFRmVCaVFBSWFDQm1BWWdBQ0dnZ2hvR0lBQWhvSUtZQmlRQUlhQ0RHZ1lrQUNGNzlNNUFIUUFUMUpraXhCZ0Rnd0I5QmV3WUJBQ0lBXCIgK1xyXG4gIFwiQWhxSU53QWlBQUlhaUo4QVJBQUVOQkJuQUVRQUJEUVFoNEJFQUFRMEVGOEJpQUFJYUNBK0F4SUJFTkJBM0FNZ0FpQ2dnYmdJUkFSQVFBTnhcIiArXHJcbiAgXCJFNUFJZ0lBRzRpb3dFUUFCRGNRc0FCRUFBUTNFTUJBUkFBRU54RFFnRVFBQkRjUTRNQkVBd2F0L0J2SUFpS0RlQkNuV0FBQWMrQ05venlBQVwiICtcclxuICBcIlFBUkFRQVB4QmtBRVFFQUQ4Uk9BQ0lDQUJ1SU1nQWlBZ0FiaUVKQUlnSUFHNGlzQUVRQUJEY1JuUUNJQUFocUlld0JFQUFRMEVCZUJpQUFJXCIgK1xyXG4gIFwiYUNCdUFoSUJFTkJBWEFVbUFpQ2dnZnp4REg0QTF0bmR4Ykx5d2QwQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuXHJcbmludGVyZmFjZSBOb3RpZnlQYXlsb2FkIHtcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIG1lc3NhZ2U6IHN0cmluZztcclxuICAvKiogU291bmQgdXNlZCBvbiB0aGUgbm9uLVdpbmRvd3MgcGF0aCAoYGFwaS5hdHRlbnRpb24ubm90aWZ5YCkuICovXHJcbiAgc291bmQ6IEF0dGVudGlvblNvdW5kO1xyXG59XHJcblxyXG4vKipcclxuICogT3B0aW9uYWwgZm9jdXMgZ2F0ZSBhcHBsaWVkIGJlZm9yZSBkaXNwYXRjaGluZyBhIG5vdGlmaWNhdGlvbi4gTGV0cyB0aGUgdXNlciBvcHQgaW50b1xyXG4gKiBcIm5vdGlmeSBvbmx5IHdoZW4gdGhlIHRlcm1pbmFsIHdpbmRvdyBpcyB1bmZvY3VzZWRcIiBzbyBub3RpZmljYXRpb25zIGRvbid0IGZpcmUgd2hpbGVcclxuICogdGhleSBhcmUgYWN0aXZlbHkgd2F0Y2hpbmcgdGhlIFRVSS5cclxuICpcclxuICogVGhlIGdhdGUgaXMgZXZhbHVhdGVkIG9uIGV2ZXJ5IGRpc3BhdGNoIChub3Qgb25jZSBhdCBzZXR1cCkgYmVjYXVzZSB0aGUgZGVmZXJyZWRcclxuICogcGVybWlzc2lvbiBub3RpZmljYXRpb24gaXMgc2VudCBmcm9tIGEgdGltZXIgYW5kIHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIG11c3QgYmUgcmVhZFxyXG4gKiBhdCB0aGF0IG1vbWVudC5cclxuICovXHJcbmV4cG9ydCB0eXBlIE5vdGlmeUdhdGUgPSB7XHJcbiAgLyoqIFdoZW4gdHJ1ZSwgc3VwcHJlc3MgdGhlIG5vdGlmaWNhdGlvbiB3aGlsZSB0aGUgdGVybWluYWwgaXMgZm9jdXNlZC4gKi9cclxuICBvbmx5V2hlblVuZm9jdXNlZDogYm9vbGVhbjtcclxuICAvKiogQ3VycmVudCB0ZXJtaW5hbCBmb2N1cyBzdGF0ZTsgYHVuZGVmaW5lZGAgd2hlbiB1bmtub3duIChlLmcuIHRoZSB0ZXJtaW5hbCBkb2VzIG5vdFxyXG4gICAqICByZXBvcnQgZm9jdXMgZXZlbnRzIOKAlCBXaW5kb3dzIFRlcm1pbmFsIGlzIGEga25vd24gY2FzZSkuIFVua25vd24gZm9jdXMgZGVncmFkZXMgdG9cclxuICAgKiAgZGlzcGF0Y2hpbmcgc28gYW4gb3B0ZWQtaW4gbm90aWZpY2F0aW9uIGlzIG5ldmVyIHNpbGVudGx5IGxvc3QuIFJlYWQgbGF6aWx5IG9uIGVhY2hcclxuICAgKiAgZGlzcGF0Y2ggYmVjYXVzZSB0aGUgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb24gZmlyZXMgZnJvbSBhIHRpbWVyLiBNYXkgYmVcclxuICAgKiAgYXN5bmMgKHRoZSBXaW5kb3dzIGZhbGxiYWNrIHF1ZXJpZXMgdGhlIGZvcmVncm91bmQgd2luZG93IHZpYSBQb3dlclNoZWxsKS4gKi9cclxuICBmb2N1c2VkOiAoKSA9PiBib29sZWFuIHwgdW5kZWZpbmVkIHwgUHJvbWlzZTxib29sZWFuIHwgdW5kZWZpbmVkPjtcclxufTtcclxuXHJcbi8vIERlY29kZSB0aGUgZW1iZWRkZWQgT3BlbkNvZGUgUE5HIG9uY2UgcGVyIHByb2Nlc3MgYW5kIHJldXNlIGl0IGZvciBldmVyeSB0b2FzdC5cclxuLy8gQSBzdGFibGUgcGF0aCBhbHNvIGF2b2lkcyBsZWFraW5nIG9uZSB0ZW1wIGZpbGUgcGVyIG5vdGlmaWNhdGlvbiBpZiB0aGVcclxuLy8gbm9kZS1ub3RpZmllciBjYWxsYmFjayBuZXZlciBmaXJlcy5cclxubGV0IHdpbmRvd3NJY29uOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQ7XHJcbmZ1bmN0aW9uIGVuc3VyZVdpbmRvd3NJY29uKCk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XHJcbiAgd2luZG93c0ljb24gPz89IChhc3luYyAoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB7IHdyaXRlRmlsZSB9ID0gYXdhaXQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKTtcclxuICAgICAgY29uc3Qgb3MgPSBhd2FpdCBpbXBvcnQoXCJub2RlOm9zXCIpO1xyXG4gICAgICBjb25zdCBwYXRoID0gYXdhaXQgaW1wb3J0KFwibm9kZTpwYXRoXCIpO1xyXG4gICAgICBjb25zdCBpY29uUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYG9wZW5jb2RlLXB1bHNlLSR7cHJvY2Vzcy5waWR9LnBuZ2ApO1xyXG4gICAgICBhd2FpdCB3cml0ZUZpbGUoaWNvblBhdGgsIEJ1ZmZlci5mcm9tKE9QRU5DT0RFX0lDT05fUE5HX0I2NCwgXCJiYXNlNjRcIikpO1xyXG4gICAgICByZXR1cm4gaWNvblBhdGg7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgLy8gYmVzdC1lZmZvcnQ7IGZhbGwgYmFjayB0byBubyBpY29uIGlmIHRoZSB0ZW1wIGZpbGUgY291bGQgbm90IGJlIHdyaXR0ZW5cclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9KSgpO1xyXG4gIHJldHVybiB3aW5kb3dzSWNvbjtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gd2luZG93c05vdGlmeShwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgLy8gbm9kZS1ub3RpZmllciBpcyBtYXJrZWQgZXh0ZXJuYWwgaW4gdGhlIGJ1aWxkIHNvIGl0IHJlc29sdmVzIGZyb21cclxuICAvLyBub2RlX21vZHVsZXMgYXQgcnVudGltZSByYXRoZXIgdGhhbiBiZWluZyBidW5kbGVkLiBPbiBXaW5kb3dzIGl0IHBvc3RzIGEgcmVhbFxyXG4gIC8vIEFjdGlvbiBDZW50ZXIgdG9hc3QgdmlhIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlLiBEeW5hbWljIGltcG9ydCBrZWVwcyB0aGVcclxuICAvLyBtb2R1bGUgbG9hZCBmcm9tIGZhaWxpbmcgdGhlIHdob2xlIHBsdWdpbiBpZiBub2RlLW5vdGlmaWVyIGlzIHVuYXZhaWxhYmxlLlxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoXCJub2RlLW5vdGlmaWVyXCIpO1xyXG4gICAgY29uc3QgaWNvblBhdGggPSBhd2FpdCBlbnN1cmVXaW5kb3dzSWNvbigpO1xyXG4gICAgY29uc3Qgbm90aWZpZXIgPSAobW9kIGFzIHsgZGVmYXVsdD86IHVua25vd24gfSkuZGVmYXVsdCA/PyBtb2Q7XHJcbiAgICAobm90aWZpZXIgYXMgeyBub3RpZnk6IChvcHRzOiB1bmtub3duLCBjYjogKGVycjogRXJyb3IgfCBudWxsLCByZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB2b2lkIH0pLm5vdGlmeShcclxuICAgICAge1xyXG4gICAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxyXG4gICAgICAgIG1lc3NhZ2U6IHBheWxvYWQubWVzc2FnZSxcclxuICAgICAgICBhcHBJRDogV0lORE9XU19BUFBfSUQsXHJcbiAgICAgICAgLi4uKGljb25QYXRoID8geyBpY29uOiBpY29uUGF0aCB9IDoge30pLFxyXG4gICAgICAgIC8vIFRoZSBob3N0IGF0dGVudGlvbiBjaGFubmVsIGFscmVhZHkgcGxheXMgdGhlIGNvbmZpZ3VyZWQgc291bmQ7IHRoZVxyXG4gICAgICAgIC8vIFdpbmRvd3MgZmFsbGJhY2sgb25seSBuZWVkcyB0byBzdXBwbHkgdGhlIG1pc3Npbmcgc3lzdGVtIHRvYXN0LlxyXG4gICAgICAgIHNvdW5kOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgKGVycm9yLCByZXNwb25zZSkgPT4gZGlhZyhcIndpbmRvd3NOb3RpZnk6Y2FsbGJhY2tcIiwgeyBlcnJvcjogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbnVsbCwgcmVzcG9uc2UgfSksXHJcbiAgICApO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyBiZXN0LWVmZm9ydDsgYSBmYWlsZWQgdG9hc3QgbXVzdCBuZXZlciBicmVhayB0aGUgcGx1Z2luXHJcbiAgICBkaWFnKFwid2luZG93c05vdGlmeTplcnJvclwiLCB7IGVycm9yOiBTdHJpbmcoZXJyb3IpIH0pO1xyXG4gIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gYnVpbHRpbk5vdGlmeShhcGk6IEFwaSwgcGF5bG9hZDogTm90aWZ5UGF5bG9hZCkge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgYXBpLmF0dGVudGlvbi5ub3RpZnkoe1xyXG4gICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcclxuICAgICAgbWVzc2FnZTogcGF5bG9hZC5tZXNzYWdlLFxyXG4gICAgICBub3RpZmljYXRpb246IHsgd2hlbjogXCJhbHdheXNcIiB9LFxyXG4gICAgICBzb3VuZDogcGF5bG9hZC5zb3VuZCxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyBiZXN0LWVmZm9ydDsgYSBmYWlsZWQgbm90aWZpY2F0aW9uIG11c3QgbmV2ZXIgYnJlYWsgdGhlIHBsdWdpblxyXG4gICAgZGlhZyhcImJ1aWx0aW5Ob3RpZnk6ZXJyb3JcIiwgeyBlcnJvcjogU3RyaW5nKGVycm9yKSB9KTtcclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBkaXNwYXRjaChhcGk6IEFwaSwgcGF5bG9hZDogTm90aWZ5UGF5bG9hZCwgZ2F0ZT86IE5vdGlmeUdhdGUpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBmb2N1c2VkID0gZ2F0ZT8ub25seVdoZW5VbmZvY3VzZWQgPyBhd2FpdCBnYXRlLmZvY3VzZWQoKSA6IHVuZGVmaW5lZDtcclxuICBkaWFnKFwiZGlzcGF0Y2hcIiwge1xyXG4gICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXHJcbiAgICBtZXNzYWdlOiBwYXlsb2FkLm1lc3NhZ2UsXHJcbiAgICBvbmx5V2hlblVuZm9jdXNlZDogZ2F0ZT8ub25seVdoZW5VbmZvY3VzZWQsXHJcbiAgICBmb2N1c2VkLFxyXG4gIH0pO1xyXG4gIGlmIChnYXRlPy5vbmx5V2hlblVuZm9jdXNlZCAmJiBmb2N1c2VkID09PSB0cnVlKSB7XHJcbiAgICAvLyBUZXJtaW5hbCBpcyBmb2N1c2VkIC0+IHRoZSB1c2VyIGlzIHdhdGNoaW5nLCBzdXBwcmVzcyB0aGUgbm90aWZpY2F0aW9uLlxyXG4gICAgLy8gVW5rbm93biBmb2N1cyAobm8gZm9jdXMgZXZlbnRzLCBlLmcuIFdpbmRvd3MgVGVybWluYWwpIHN0aWxsIGRpc3BhdGNoZXMuXHJcbiAgICBkaWFnKFwiZGlzcGF0Y2g6c3VwcHJlc3NlZC1mb2N1c2VkXCIpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBMZXQgdGhlIGhvc3QgYXBwbHkgaXRzIGF0dGVudGlvbiBwb2xpY3kgKGVuYWJsZWQvZGlzYWJsZWQsIHNvdW5kLCBmb2N1cylcclxuICAvLyBldmVyeXdoZXJlLCBpbmNsdWRpbmcgV2luZG93cy4gT24gV2luZG93cyB0aGUgbm90aWZpY2F0aW9uIGNoYW5uZWwgaXNcclxuICAvLyBzaWxlbnRseSBkcm9wcGVkIGJ5IHVuc3VwcG9ydGVkIHRlcm1pbmFscywgc28gZmFsbCBiYWNrIHRvIGEgcmVhbCB0b2FzdC5cclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBidWlsdGluTm90aWZ5KGFwaSwgcGF5bG9hZCk7XHJcbiAgZGlhZyhcclxuICAgIFwiZGlzcGF0Y2g6YnVpbHRpbi1yZXN1bHRcIixcclxuICAgIHJlc3VsdFxyXG4gICAgICA/IHsgb2s6IHJlc3VsdC5vaywgbm90aWZpY2F0aW9uOiByZXN1bHQubm90aWZpY2F0aW9uLCBzb3VuZDogcmVzdWx0LnNvdW5kLCBza2lwcGVkOiByZXN1bHQuc2tpcHBlZCB9XHJcbiAgICAgIDogeyByZXN1bHQ6IFwidW5kZWZpbmVkXCIgfSxcclxuICApO1xyXG4gIC8vIE9uIFdpbmRvd3MgdGhlIGhvc3QgY2hhbm5lbCBvbmx5IHF1ZXVlcyBhbiBPU0Mgc2VxdWVuY2U6IGB0cmlnZ2VyTm90aWZpY2F0aW9uYFxyXG4gIC8vIHJlcG9ydHMgc3VjY2VzcyBhcyBzb29uIGFzIHRoZSBieXRlcyBhcmUgd3JpdHRlbiwgZXZlbiBpbiBXaW5kb3dzIFRlcm1pbmFsLFxyXG4gIC8vIHdoaWNoIGNhbm5vdCBkaXNwbGF5IE9TQyA5Lzk5LiBOZXZlciB0cnVzdCBgcmVzdWx0Lm5vdGlmaWNhdGlvbmAgdGhlcmUg4oCUXHJcbiAgLy8gdW5sZXNzIGF0dGVudGlvbiBpcyBnbG9iYWxseSBkaXNhYmxlZCwgYWx3YXlzIHBvc3QgYSByZWFsIEFjdGlvbiBDZW50ZXIgdG9hc3QuXHJcbiAgaWYgKElTX1dJTkRPV1MgJiYgcmVzdWx0Py5za2lwcGVkICE9PSBcImF0dGVudGlvbl9kaXNhYmxlZFwiKSB7XHJcbiAgICBkaWFnKFwiZGlzcGF0Y2g6d2luZG93cy1mYWxsYmFja1wiLCB7XHJcbiAgICAgIGhvc3ROb3RpZmljYXRpb246IHJlc3VsdD8ubm90aWZpY2F0aW9uID8/IG51bGwsXHJcbiAgICAgIGhvc3RTa2lwcGVkOiByZXN1bHQ/LnNraXBwZWQgPz8gbnVsbCxcclxuICAgIH0pO1xyXG4gICAgYXdhaXQgd2luZG93c05vdGlmeShwYXlsb2FkKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKiBOb3RpZnkgdGhhdCBhIGJhdGNoIG9mIHN1YmFnZW50cyBmaW5pc2hlZC4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeVN1YmFnZW50c0RvbmUoXHJcbiAgYXBpOiBBcGksXHJcbiAgY291bnQ6IG51bWJlcixcclxuICBnYXRlPzogTm90aWZ5R2F0ZSxcclxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcclxuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgYXdhaXQgZGlzcGF0Y2goXHJcbiAgICBhcGksXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXHJcbiAgICAgIG1lc3NhZ2U6IHQobG9jYWxlKS5zdWJhZ2VudHNEb25lKGNvdW50KSxcclxuICAgICAgc291bmQ6IHsgbmFtZTogXCJzdWJhZ2VudF9kb25lXCIgfSxcclxuICAgIH0sXHJcbiAgICBnYXRlLFxyXG4gICk7XHJcbn1cclxuXHJcbi8qKiBOb3RpZnkgdGhhdCB0aGUgY3VycmVudCB0dXJuIChtYWluLWFnZW50IHJvdW5kKSBoYXMgZmluaXNoZWQuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlUdXJuRG9uZShhcGk6IEFwaSwgZ2F0ZT86IE5vdGlmeUdhdGUsIGxvY2FsZTogTG9jYWxlID0gXCJlblwiKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgYXdhaXQgZGlzcGF0Y2goXHJcbiAgICBhcGksXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXHJcbiAgICAgIG1lc3NhZ2U6IHQobG9jYWxlKS50dXJuRG9uZSxcclxuICAgICAgc291bmQ6IHsgbmFtZTogXCJkb25lXCIgfSxcclxuICAgIH0sXHJcbiAgICBnYXRlLFxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBOb3RpZnkgdGhhdCBhIHNlc3Npb24gcnVuIGVuZGVkIGluIGZhaWx1cmUuXHJcbiAqXHJcbiAqIFVubGlrZSB0aGUgXCJkb25lXCIgbm90aWZpY2F0aW9ucyB0aGlzIGlzIG5vdCBhbiBvcHQtaW4gZHVwbGljYXRlIG9mIHRoZSBob3N0J3NcclxuICogYnVpbHQtaW4gbm90aWZpZXI6IE9wZW5Db2RlIDIueCdzIGBvcGVuY29kZS5ub3RpZmljYXRpb25zYCBwbHVnaW4gaXMgdHlwaWNhbGx5XHJcbiAqIGRpc2FibGVkIHNvIHRoaXMgcGx1Z2luIG93bnMgdGhlIHdob2xlIG5vdGlmaWNhdGlvbiBzdXJmYWNlLCBhbmQgaXQgaGFzIHRvXHJcbiAqIGNvdmVyIGVycm9ycyBpdHNlbGYuIFN1YmFnZW50IGZhaWx1cmVzIGFyZSBzdXJmYWNlZCBzZXBhcmF0ZWx5IGJlY2F1c2UgdGhlXHJcbiAqIHBhcmVudCB0dXJuIG1heSBzdGlsbCBmaW5pc2ggc3VjY2Vzc2Z1bGx5IGFmdGVyd2FyZHMuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5U2Vzc2lvbkVycm9yKFxyXG4gIGFwaTogQXBpLFxyXG4gIGtpbmQ6IFwic2Vzc2lvblwiIHwgXCJzdWJhZ2VudFwiLFxyXG4gIGRldGFpbD86IHN0cmluZyxcclxuICBnYXRlPzogTm90aWZ5R2F0ZSxcclxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcclxuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSB0KGxvY2FsZSk7XHJcbiAgYXdhaXQgZGlzcGF0Y2goXHJcbiAgICBhcGksXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXHJcbiAgICAgIG1lc3NhZ2U6IGtpbmQgPT09IFwic3ViYWdlbnRcIiA/IG1lc3NhZ2VzLnN1YmFnZW50RXJyb3IoZGV0YWlsKSA6IG1lc3NhZ2VzLnNlc3Npb25FcnJvcihkZXRhaWwpLFxyXG4gICAgICBzb3VuZDogeyBuYW1lOiBcImVycm9yXCIgfSxcclxuICAgIH0sXHJcbiAgICBnYXRlLFxyXG4gICk7XHJcbn1cclxuXHJcbi8qKiBXaGF0IGtpbmQgb2YgdXNlciBpbnRlcmFjdGlvbiBpcyBibG9ja2luZyB0aGUgbWFpbiBzZXNzaW9uLiAqL1xyXG5leHBvcnQgdHlwZSBJbnRlcnZpZXdLaW5kID0gXCJxdWVzdGlvblwiIHwgXCJwZXJtaXNzaW9uXCI7XHJcbi8qKlxyXG4gKiBOb3RpZnkgdGhhdCB0aGUgbWFpbiBzZXNzaW9uIGlzIGJsb2NrZWQgd2FpdGluZyBmb3IgdXNlciBpbnB1dCAoYW4gaW50ZXJ2aWV3OlxyXG4gKiB0aGUgYHF1ZXN0aW9uYCB0b29sIGFza2luZyB0aGUgdXNlciBzb21ldGhpbmcsIG9yIGEgcGVybWlzc2lvbi9hcHByb3ZhbCBwcm9tcHQpLlxyXG4gKiBUaGVzZSBhcmUgdGhlIHR3byB3YXlzIGFuIGFnZW50IHR1cm4gaXMgc3VzcGVuZGVkIG1pZC1ydW4gb24gdXNlciBpbnRlcmFjdGlvbi5cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlJbnRlcnZpZXdJbnB1dChcclxuICBhcGk6IEFwaSxcclxuICBraW5kOiBJbnRlcnZpZXdLaW5kLFxyXG4gIGRldGFpbD86IHN0cmluZyxcclxuICBnYXRlPzogTm90aWZ5R2F0ZSxcclxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcclxuKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSB0KGxvY2FsZSk7XHJcbiAgYXdhaXQgZGlzcGF0Y2goXHJcbiAgICBhcGksXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXHJcbiAgICAgIG1lc3NhZ2U6XHJcbiAgICAgICAga2luZCA9PT0gXCJwZXJtaXNzaW9uXCJcclxuICAgICAgICAgID8gbWVzc2FnZXMucGVybWlzc2lvblJlcXVpcmVkKGRldGFpbClcclxuICAgICAgICAgIDogbWVzc2FnZXMucXVlc3Rpb25SZXF1aXJlZChkZXRhaWwpLFxyXG4gICAgICBzb3VuZDoga2luZCA9PT0gXCJwZXJtaXNzaW9uXCIgPyB7IG5hbWU6IFwicGVybWlzc2lvblwiIH0gOiB7IG5hbWU6IFwicXVlc3Rpb25cIiB9LFxyXG4gICAgfSxcclxuICAgIGdhdGUsXHJcbiAgKTtcclxufVxyXG5cclxuLyoqIEluLWFwcCB0b2FzdCBmYWxsYmFjayAod29ya3Mgb24gZXZlcnkgcGxhdGZvcm0pLiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9hc3QoYXBpOiBBcGksIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gIHRyeSB7XHJcbiAgICBhcGkudWkudG9hc3Quc2hvdyh7IHZhcmlhbnQ6IFwiaW5mb1wiLCB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCBtZXNzYWdlIH0pO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgLy8gYmVzdC1lZmZvcnRcclxuICB9XHJcbn1cclxuXHJcbi8qKiBUcnVlIHdoZW4gcnVubmluZyBvbiBXaW5kb3dzICh1c2VkIHRvIGRlY2lkZSB0aGUgZGVsaXZlcnkgcGF0aCkuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1dpbmRvd3MoKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIElTX1dJTkRPV1M7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFdpbmRvd3Mtb25seSBsaXZlIHRlcm1pbmFsIGZvY3VzIGRldGVjdGlvbi5cclxuICpcclxuICogQmFja2dyb3VuZDogb24gV2luZG93cyB0aGUgcmVuZGVyZXIncyBmb2N1cy9ibHVyIGV2ZW50cyAoREVDIDEwMDQgZm9jdXMgcmVwb3J0aW5nIHZpYVxyXG4gKiBDb25QVFkpIGFyZSB1bnJlbGlhYmxlIOKAlCB0aGUgZm9jdXMtaW4gc2VxdWVuY2UgbWF5IGFycml2ZSBhdCBzdGFydHVwIHdoaWxlIHRoZVxyXG4gKiBmb2N1cy1vdXQgbmV2ZXIgZG9lcywgd2hpY2ggbGVhdmVzIHRoZSBwbHVnaW4gc3R1Y2sgYmVsaWV2aW5nIHRoZSB0ZXJtaW5hbCBpcyBmb2N1c2VkXHJcbiAqIGFuZCBzdXBwcmVzc2luZyBldmVyeSBub3RpZmljYXRpb24uIFdlIHRoZXJlZm9yZSBieXBhc3MgdGhlIGV2ZW50IHN0cmVhbSBvbiBXaW5kb3dzXHJcbiAqIGFuZCBxdWVyeSB0aGUgZm9yZWdyb3VuZCB3aW5kb3cgZGlyZWN0bHk6XHJcbiAqXHJcbiAqICAgLSBUaGUgd2luZG93IG9mIHRoZSB0ZXJtaW5hbCBob3N0aW5nIHRoaXMgcGx1Z2luIGJlbG9uZ3MgdG8gYSBwcm9jZXNzIHRoYXQgaXMgYW5cclxuICogICAgIGFuY2VzdG9yIG9mIG91ciBvd24gcHJvY2VzcyAoZS5nLiBXaW5kb3dzIFRlcm1pbmFsIC0+IHNoZWxsIC0+IG9wZW5jb2RlKS5cclxuICogICAtIFdoZW4gdGhhdCB0ZXJtaW5hbCBpcyBmb2N1c2VkLCB0aGUgZm9yZWdyb3VuZCB3aW5kb3cncyBvd25pbmcgUElEIGlzIGluIG91clxyXG4gKiAgICAgYW5jZXN0b3IgY2hhaW4uXHJcbiAqICAgLSBXaGVuIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYXBwLCB0aGUgZm9yZWdyb3VuZCBQSUQgaXMgbm90IGFuIGFuY2VzdG9yLlxyXG4gKlxyXG4gKiBUd28gYmFja2VuZHMgYXJlIHVzZWQ6XHJcbiAqICAgLSBgYnVuOmZmaWAgKGZhc3QsIHN5bmNocm9ub3VzKSB3aGVuIHRoZSBydW50aW1lIHN1cHBvcnRzIGl0IOKAlCB2ZXJpZmllZCB3b3JraW5nIGluXHJcbiAqICAgICBzdGFuZGFsb25lIEJ1bi1jb21waWxlZCBiaW5hcmllcy5cclxuICogICAtIFBvd2VyU2hlbGwgKGBHZXRGb3JlZ3JvdW5kV2luZG93YCAvIGBXaW4zMl9Qcm9jZXNzYCkgYXMgYSBwb3J0YWJsZSBmYWxsYmFjayB0aGF0XHJcbiAqICAgICB3b3JrcyBpbiBhbnkgcnVudGltZSAoTm9kZSBvciBCdW4pIHNpbmNlIGl0IG9ubHkgbmVlZHMgYG5vZGU6Y2hpbGRfcHJvY2Vzc2AuXHJcbiAqXHJcbiAqIElmIG5laXRoZXIgYmFja2VuZCBpcyBhdmFpbGFibGUgdGhlIG1vZHVsZSBkZWdyYWRlcyB0byBcInVua25vd25cIiBhbmQgdGhlIGNhbGxlciBmYWxsc1xyXG4gKiBiYWNrIHRvIHRoZSByZW5kZXJlciBldmVudCBzdGF0ZS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJub2RlOmNoaWxkX3Byb2Nlc3NcIjtcclxuXHJcbmNvbnN0IElTX1dJTkRPV1MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCI7XHJcblxyXG4vLyA1NjggYnl0ZXMgPSBzaXplb2YoUFJPQ0VTU0VOVFJZMzJXKSBvbiB4NjQgKFVMT05HX1BUUiBmaWVsZCBmb3JjZXMgOC1ieXRlIGFsaWdubWVudCkuXHJcbi8vIFdyb25nIGR3U2l6ZSBtYWtlcyBQcm9jZXNzMzJGaXJzdFcgZmFpbCB3aXRoIEVSUk9SX0JBRF9MRU5HVEgsIHdoaWNoIHdlIHRyZWF0IGFzXHJcbi8vIFwidW5rbm93blwiIGFuZCBmYWxsIGJhY2sgZ3JhY2VmdWxseS5cclxuY29uc3QgUFJPQ0VTU0VOVFJZMzJXX1NJWkUgPSA1Njg7XHJcbmNvbnN0IE9GRlNFVF9USDMyX1BST0NFU1NfSUQgPSA4O1xyXG5jb25zdCBPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCA9IDMyO1xyXG5cclxudHlwZSBCYWNrZW5kID0gXCJmZmlcIiB8IFwicG93ZXJzaGVsbFwiIHwgXCJub25lXCI7XHJcblxyXG5sZXQgYmFja2VuZDogQmFja2VuZCA9IFwibm9uZVwiO1xyXG5sZXQgYW5jZXN0b3JzID0gbmV3IFNldDxudW1iZXI+KCk7XHJcbmxldCBmZmlGb3JlZ3JvdW5kUGlkOiAoKCkgPT4gbnVtYmVyIHwgdW5kZWZpbmVkKSB8IHVuZGVmaW5lZDtcclxuXHJcbi8vIExpdmUgc3RhdHVzIHN1cmZhY2UsIHJlbmRlcmVkIGludG8gdGhlIHNpZGViYXIgZm9yIGRlYnVnZ2luZyB0aGUgZm9jdXMgZ2F0ZS5cclxuZXhwb3J0IHR5cGUgRm9jdXNTdGF0dXMgPSB7XHJcbiAgYmFja2VuZDogQmFja2VuZDtcclxuICBhbmNlc3RvckNvdW50OiBudW1iZXI7XHJcbiAgbGFzdEZvcmVncm91bmRQaWQ/OiBudW1iZXI7XHJcbiAgbGFzdFJlc3VsdD86IGJvb2xlYW47XHJcbiAgbGFzdEVycm9yPzogc3RyaW5nO1xyXG59O1xyXG5sZXQgc3RhdHVzOiBGb2N1c1N0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAgfTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvY3VzU3RhdHVzKCk6IEZvY3VzU3RhdHVzIHtcclxuICByZXR1cm4gc3RhdHVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBydW5Qb3dlclNoZWxsKHNjcmlwdDogc3RyaW5nLCB0aW1lb3V0TXMgPSA4MDAwKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIGxldCBvdXQgPSBcIlwiO1xyXG4gICAgbGV0IGNoaWxkO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY2hpbGQgPSBzcGF3bihcInBvd2Vyc2hlbGwuZXhlXCIsIFtcIi1Ob1Byb2ZpbGVcIiwgXCItTm9uSW50ZXJhY3RpdmVcIiwgXCItQ29tbWFuZFwiLCBzY3JpcHRdLCB7XHJcbiAgICAgICAgd2luZG93c0hpZGU6IHRydWUsXHJcbiAgICAgICAgc3RkaW86IFtcImlnbm9yZVwiLCBcInBpcGVcIiwgXCJwaXBlXCJdLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNoaWxkLmtpbGwoKTtcclxuICAgICAgfSBjYXRjaCB7fVxyXG4gICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgfSwgdGltZW91dE1zKTtcclxuICAgIGNoaWxkLnN0ZG91dD8ub24oXCJkYXRhXCIsIChjaHVuazogQnVmZmVyKSA9PiB7XHJcbiAgICAgIG91dCArPSBjaHVuay50b1N0cmluZygpO1xyXG4gICAgfSk7XHJcbiAgICBjaGlsZC5vbihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgICAgcmVzb2x2ZShcIlwiKTtcclxuICAgIH0pO1xyXG4gICAgY2hpbGQub24oXCJjbG9zZVwiLCAoKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgIHJlc29sdmUob3V0LnRyaW0oKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqIENvbXB1dGUgb3VyIGFuY2VzdG9yIFBJRCBjaGFpbiB2aWEgUG93ZXJTaGVsbCAoV2luMzJfUHJvY2VzcyBwYXJlbnQgd2FsaykuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTogUHJvbWlzZTxTZXQ8bnVtYmVyPj4ge1xyXG4gIGNvbnN0IHNlbGZQaWQgPSBwcm9jZXNzLnBpZDtcclxuICBjb25zdCBzY3JpcHQgPSBgXHJcbiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAnU2lsZW50bHlDb250aW51ZSdcclxuJHBpZENoYWluID0gQCgke3NlbGZQaWR9KVxyXG4kY3VyID0gJHtzZWxmUGlkfVxyXG5mb3IgKCRpID0gMDsgJGkgLWx0IDMyIC1hbmQgJGN1ciAtZ3QgMDsgJGkrKykge1xyXG4gICRwID0gR2V0LUNpbUluc3RhbmNlIFdpbjMyX1Byb2Nlc3MgLUZpbHRlciBcIlByb2Nlc3NJZD0kY3VyXCJcclxuICBpZiAoLW5vdCAkcCkgeyBicmVhayB9XHJcbiAgJG5leHQgPSAkcC5QYXJlbnRQcm9jZXNzSWRcclxuICBpZiAoJG5leHQgLWVxICRjdXIgLW9yICRuZXh0IC1sZSAwKSB7IGJyZWFrIH1cclxuICAkY3VyID0gJG5leHRcclxuICAkcGlkQ2hhaW4gKz0gJGN1clxyXG59XHJcbiRwaWRDaGFpbiAtam9pbiAnLCdcclxuYDtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBydW5Qb3dlclNoZWxsKHNjcmlwdCk7XHJcbiAgY29uc3QgcGlkcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xyXG4gIGZvciAoY29uc3QgcGFydCBvZiByZXN1bHQuc3BsaXQoXCIsXCIpKSB7XHJcbiAgICBjb25zdCBuID0gcGFyc2VJbnQocGFydCwgMTApO1xyXG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCkgcGlkcy5hZGQobik7XHJcbiAgfVxyXG4gIHJldHVybiBwaWRzO1xyXG59XHJcblxyXG4vKiogRm9yZWdyb3VuZCB3aW5kb3cgb3duaW5nIFBJRCB2aWEgUG93ZXJTaGVsbCAodXNlcjMyIEdldEZvcmVncm91bmRXaW5kb3cpLiAqL1xyXG5hc3luYyBmdW5jdGlvbiBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xyXG4gIGNvbnN0IHNjcmlwdCA9IGBcclxuQWRkLVR5cGUgLVR5cGVEZWZpbml0aW9uIEAnXHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLlJ1bnRpbWUuSW50ZXJvcFNlcnZpY2VzO1xyXG5wdWJsaWMgc3RhdGljIGNsYXNzIFB1bHNlRm9jdXMge1xyXG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxyXG4gIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEludFB0ciBHZXRGb3JlZ3JvdW5kV2luZG93KCk7XHJcbiAgW0RsbEltcG9ydChcInVzZXIzMi5kbGxcIildXHJcbiAgcHVibGljIHN0YXRpYyBleHRlcm4gdWludCBHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoSW50UHRyIGhXbmQsIG91dCB1aW50IGxwZHdQcm9jZXNzSWQpO1xyXG59XHJcbidAXHJcbiRoID0gW1B1bHNlRm9jdXNdOjpHZXRGb3JlZ3JvdW5kV2luZG93KClcclxuJHAgPSBbdWludDMyXTBcclxuW3ZvaWRdW1B1bHNlRm9jdXNdOjpHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoJGgsIFtyZWZdJHApXHJcbiRwXHJcbmA7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcnVuUG93ZXJTaGVsbChzY3JpcHQpO1xyXG4gIGNvbnN0IG4gPSBwYXJzZUludChyZXN1bHQsIDEwKTtcclxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gbiA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuLyoqIFRyeSB0aGUgZmFzdCBidW46ZmZpIGJhY2tlbmQuIFJldHVybnMgdHJ1ZSB3aGVuIGZ1bGx5IGluaXRpYWxpemVkLiAqL1xyXG5hc3luYyBmdW5jdGlvbiBpbml0RmZpQmFja2VuZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBkbG9wZW4sIHB0ciB9ID0gYXdhaXQgaW1wb3J0KFwiYnVuOmZmaVwiKTtcclxuICAgIGNvbnN0IHVzZXIzMiA9IGRsb3BlbihcInVzZXIzMi5kbGxcIiwge1xyXG4gICAgICBHZXRGb3JlZ3JvdW5kV2luZG93OiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInB0clwiIH0sXHJcbiAgICAgIEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZDogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwidTMyXCIgfSxcclxuICAgIH0pO1xyXG4gICAgY29uc3Qga2VybmVsMzIgPSBkbG9wZW4oXCJrZXJuZWwzMi5kbGxcIiwge1xyXG4gICAgICBHZXRDdXJyZW50UHJvY2Vzc0lkOiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInUzMlwiIH0sXHJcbiAgICAgIENyZWF0ZVRvb2xoZWxwMzJTbmFwc2hvdDogeyBhcmdzOiBbXCJ1MzJcIiwgXCJ1MzJcIl0sIHJldHVybnM6IFwicHRyXCIgfSxcclxuICAgICAgUHJvY2VzczMyRmlyc3RXOiB7IGFyZ3M6IFtcInB0clwiLCBcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxyXG4gICAgICBQcm9jZXNzMzJOZXh0VzogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcclxuICAgICAgQ2xvc2VIYW5kbGU6IHsgYXJnczogW1wicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBUSDMyQ1NfU05BUFBST0NFU1MgPSAweDI7XHJcbiAgICBjb25zdCBzbmFwc2hvdCA9IGtlcm5lbDMyLnN5bWJvbHMuQ3JlYXRlVG9vbGhlbHAzMlNuYXBzaG90KFRIMzJDU19TTkFQUFJPQ0VTUywgMCk7XHJcbiAgICBpZiAoIXNuYXBzaG90KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGVudHJ5ID0gbmV3IFVpbnQ4QXJyYXkoUFJPQ0VTU0VOVFJZMzJXX1NJWkUpO1xyXG4gICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGVudHJ5LmJ1ZmZlcik7XHJcbiAgICAgIHZpZXcuc2V0VWludDMyKDAsIFBST0NFU1NFTlRSWTMyV19TSVpFLCB0cnVlKTsgLy8gZHdTaXplXHJcblxyXG4gICAgICBjb25zdCBwYXJlbnQgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xyXG4gICAgICBsZXQgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMkZpcnN0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XHJcbiAgICAgIHdoaWxlIChvaykge1xyXG4gICAgICAgIGNvbnN0IHBpZCA9IHZpZXcuZ2V0VWludDMyKE9GRlNFVF9USDMyX1BST0NFU1NfSUQsIHRydWUpO1xyXG4gICAgICAgIGNvbnN0IHBwaWQgPSB2aWV3LmdldFVpbnQzMihPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCwgdHJ1ZSk7XHJcbiAgICAgICAgaWYgKHBpZCAhPT0gMCkgcGFyZW50LnNldChwaWQsIHBwaWQpO1xyXG4gICAgICAgIG9rID0ga2VybmVsMzIuc3ltYm9scy5Qcm9jZXNzMzJOZXh0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHNlbGYgPSBrZXJuZWwzMi5zeW1ib2xzLkdldEN1cnJlbnRQcm9jZXNzSWQoKTtcclxuICAgICAgbGV0IGN1cnJlbnQgPSBzZWxmO1xyXG4gICAgICBmb3IgKGxldCBkZXB0aCA9IDA7IGRlcHRoIDwgMzIgJiYgY3VycmVudDsgZGVwdGgrKykge1xyXG4gICAgICAgIGFuY2VzdG9ycy5hZGQoY3VycmVudCk7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXQoY3VycmVudCk7XHJcbiAgICAgICAgaWYgKG5leHQgPT09IHVuZGVmaW5lZCB8fCBuZXh0ID09PSBjdXJyZW50KSBicmVhaztcclxuICAgICAgICBjdXJyZW50ID0gbmV4dDtcclxuICAgICAgfVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAga2VybmVsMzIuc3ltYm9scy5DbG9zZUhhbmRsZShzbmFwc2hvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmZpRm9yZWdyb3VuZFBpZCA9ICgpID0+IHtcclxuICAgICAgY29uc3QgaHduZCA9IHVzZXIzMi5zeW1ib2xzLkdldEZvcmVncm91bmRXaW5kb3coKTtcclxuICAgICAgaWYgKCFod25kKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBjb25zdCBwaWRCdWYgPSBuZXcgVWludDMyQXJyYXkoMSk7XHJcbiAgICAgIHVzZXIzMi5zeW1ib2xzLkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChod25kLCBwdHIocGlkQnVmKSk7XHJcbiAgICAgIHJldHVybiBwaWRCdWZbMF07XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJmZmlcIiwgYW5jZXN0b3JDb3VudDogYW5jZXN0b3JzLnNpemUgfTtcclxuICAgIHJldHVybiBhbmNlc3RvcnMuc2l6ZSA+IDA7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBsYXN0RXJyb3I6IFN0cmluZyhlcnJvcikgfTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBpbml0UHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IHVuZGVmaW5lZDtcclxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZVdpbmRvd3NGb2N1c0luaXQoKTogdm9pZCB7XHJcbiAgaWYgKCFJU19XSU5ET1dTKSByZXR1cm47XHJcbiAgaW5pdFByb21pc2UgPz89IChhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAoYXdhaXQgaW5pdEZmaUJhY2tlbmQoKSkge1xyXG4gICAgICBiYWNrZW5kID0gXCJmZmlcIjtcclxuICAgICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGJhY2tlbmQ6IFwiZmZpXCIgfTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYW5jZXN0b3JzID0gYXdhaXQgYW5jZXN0b3JzVmlhUG93ZXJTaGVsbCgpO1xyXG4gICAgaWYgKGFuY2VzdG9ycy5zaXplID4gMCkge1xyXG4gICAgICBiYWNrZW5kID0gXCJwb3dlcnNoZWxsXCI7XHJcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJwb3dlcnNoZWxsXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYWNrZW5kID0gXCJub25lXCI7XHJcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAsIGxhc3RFcnJvcjogXCJubyBhbmNlc3RvciBjaGFpblwiIH07XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuICB2b2lkIGluaXRQcm9taXNlO1xyXG59XHJcblxyXG4vKipcclxuICogVHJ1ZSB3aGVuIHRoZSB0ZXJtaW5hbCB3aW5kb3cgY3VycmVudGx5IGhhcyBmb2N1cywgZmFsc2Ugd2hlbiB0aGUgZm9yZWdyb3VuZCB3aW5kb3dcclxuICogYmVsb25ncyB0byBhIGRpZmZlcmVudCBwcm9jZXNzLCB1bmRlZmluZWQgd2hlbiB0aGUgY2hlY2sgaXMgdW5hdmFpbGFibGUuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNUZXJtaW5hbEZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuIHwgdW5kZWZpbmVkPiB7XHJcbiAgaWYgKCFJU19XSU5ET1dTKSB7XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuICAvLyBUaGUgZmlyc3QgZGlzcGF0Y2ggY2FuIHJhY2UgdGhlIGFzeW5jIGluaXQgKGR5bmFtaWMgaW1wb3J0IC8gUG93ZXJTaGVsbCB3YWxrKTtcclxuICAvLyB3YWl0IGZvciBpdCBzbyB0aGUgdmVyeSBmaXJzdCBub3RpZmljYXRpb24gaXMgZ2F0ZWQgYXMgd2VsbC5cclxuICBpZiAoaW5pdFByb21pc2UpIGF3YWl0IGluaXRQcm9taXNlO1xyXG4gIGlmIChiYWNrZW5kID09PSBcIm5vbmVcIikge1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcbiAgaWYgKGJhY2tlbmQgPT09IFwiZmZpXCIgJiYgZmZpRm9yZWdyb3VuZFBpZCkge1xyXG4gICAgY29uc3QgZm9yZWdyb3VuZCA9IGZmaUZvcmVncm91bmRQaWQoKTtcclxuICAgIGlmIChmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gYW5jZXN0b3JzLmhhcyhmb3JlZ3JvdW5kKTtcclxuICAgICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RGb3JlZ3JvdW5kUGlkOiBmb3JlZ3JvdW5kLCBsYXN0UmVzdWx0OiByZXN1bHQgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIC8vIE9ic2VydmVkIGluIEJ1biBvbiBXaW5kb3dzOiBHZXRGb3JlZ3JvdW5kV2luZG93IHJldHVybnMgTlVMTCB0aHJvdWdoIGJ1bjpmZmlcclxuICAgIC8vIGV2ZW4gd2hpbGUgYSB0ZXJtaW5hbCB3aW5kb3cgaXMgaW4gdGhlIGZvcmVncm91bmQuIEZhbGwgdGhyb3VnaCB0byB0aGVcclxuICAgIC8vIFBvd2VyU2hlbGwgcHJvYmUgaW5zdGVhZCBvZiByZXBvcnRpbmcgXCJ1bmtub3duXCIgKHdoaWNoIGZhaWxzIG9wZW4pLlxyXG4gIH1cclxuICBjb25zdCBmb3JlZ3JvdW5kID0gYXdhaXQgZm9yZWdyb3VuZFBpZFZpYVBvd2VyU2hlbGwoKTtcclxuICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xyXG4gIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBsYXN0Rm9yZWdyb3VuZFBpZDogZm9yZWdyb3VuZCwgbGFzdFJlc3VsdDogcmVzdWx0IH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw0QkFBUztBQUNULG1CQUFTO0FBQ1QsMkJBQVM7QUFDVCx1QkFBUztBQUNULG1CQUFTO0FBQ1QsaUJBQVM7QUFDVCxvQkFBUztBQUNULDBCQUFTO0FBQ1Q7QUFDQTs7O0FDdUJBLElBQU0sZUFBeUM7QUFBQSxFQUM3QyxJQUFJO0FBQUEsSUFDRixXQUFXO0FBQUEsSUFDWCxlQUFlLENBQUMsVUFDZCxRQUFRLElBQUksT0FBTyw4QkFBOEI7QUFBQSxJQUNuRCxVQUFVO0FBQUEsSUFDVixvQkFBb0IsQ0FBQyxXQUNuQixTQUFTLHdCQUF3QixXQUFXO0FBQUEsSUFDOUMsa0JBQWtCLENBQUMsV0FDakIsU0FBUyxvQkFBb0IsV0FBVztBQUFBLElBQzFDLGNBQWMsQ0FBQyxXQUFZLFNBQVMsbUJBQW1CLFdBQVc7QUFBQSxJQUNsRSxlQUFlLENBQUMsV0FBWSxTQUFTLG9CQUFvQixXQUFXO0FBQUEsRUFDdEU7QUFBQSxFQUNBLElBQUk7QUFBQSxJQUNGLFdBQVc7QUFBQSxJQUNYLGVBQWUsQ0FBQyxVQUNkLFFBQVEsSUFBSSxnQkFBSyxnREFBdUI7QUFBQSxJQUMxQyxVQUFVO0FBQUEsSUFDVixvQkFBb0IsQ0FBQyxXQUNuQixTQUFTLHlDQUFVLFdBQVc7QUFB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
