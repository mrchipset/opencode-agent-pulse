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
    questionRequired: (detail) => detail ? `Answer required: ${detail}` : "Main session requires an answer"
  },
  zh: {
    subagents: "\u5B50 agent",
    subagentsDone: (count) => count > 1 ? `\u5168\u90E8 ${count} \u4E2A\u5B50 agent \u5DF2\u5B8C\u6210` : "\u5B50 agent \u5DF2\u5B8C\u6210",
    turnDone: "\u672C\u8F6E\u5BF9\u8BDD\u5DF2\u5B8C\u6210",
    permissionRequired: (detail) => detail ? `\u9700\u8981\u6743\u9650\u786E\u8BA4: ${detail}` : "\u4E3B\u4F1A\u8BDD\u9700\u8981\u6743\u9650\u786E\u8BA4",
    questionRequired: (detail) => detail ? `\u9700\u8981\u56DE\u7B54: ${detail}` : "\u4E3B\u4F1A\u8BDD\u9700\u8981\u56DE\u7B54\u8BE2\u95EE"
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
    }, () => {});
  } catch {}
}
async function builtinNotify(api, payload) {
  try {
    return await api.attention.notify({
      title: payload.title,
      message: payload.message,
      notification: { when: "always" },
      sound: payload.sound
    });
  } catch {
    return;
  }
}
async function dispatch(api, payload, gate) {
  if (gate?.onlyWhenUnfocused && await gate.focused() === true) {
    return;
  }
  const result = await builtinNotify(api, payload);
  if (IS_WINDOWS && result && result.notification === false && result.skipped !== "attention_disabled") {
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
  if (!IS_WINDOWS2 || backend === "none") {
    return;
  }
  if (backend === "ffi" && ffiForegroundPid) {
    const foreground2 = ffiForegroundPid();
    const result2 = foreground2 !== undefined ? ancestors.has(foreground2) : undefined;
    status = { ...status, lastForegroundPid: foreground2, lastResult: result2 };
    return result2;
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
              const diag = props.focusDiag();
              const flag = diag.lastResult === true ? "\u25CFfocused" : diag.lastResult === false ? "\u25CBblurred" : "?unknown";
              const src = diag.lastForegroundPid !== undefined ? ` fg=${diag.lastForegroundPid}` : "";
              const err = diag.lastError ? ` err=${diag.lastError}` : "";
              return `  focus[${diag.backend}${diag.ancestorCount ? `:${diag.ancestorCount}` : ""}] ${flag}${src}${err}`;
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
    const notifCfg = options.notifications;
    const notifySubagents = notifCfg?.subagents ?? false;
    const notifyMainSession = notifCfg?.mainSession ?? false;
    const notifyInterview = notifCfg?.interview ?? false;
    const notifyOnlyWhenUnfocused = notifCfg?.onlyWhenUnfocused ?? false;
    const locale = resolveLocale(options.locale);
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
    const atThisLocation = (event) => {
      const here = context.location?.directory;
      const there = event.location?.directory;
      return !here || !there || here === there;
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
      if (!tracked || activeSubagents.size > 0 || roundNotified)
        return;
      roundNotified = true;
      if (notifySubagents) {
        notifySubagentsDone(context, roundCount, notifyGate, locale).catch(() => {});
      }
    };
    unsubs.push(context.data.on("session.retry.scheduled", (event) => {
      if (!atThisLocation(event))
        return;
      markRetrying(event.data.sessionID, true);
    }));
    unsubs.push(context.data.on("session.execution.started", (event) => {
      if (!atThisLocation(event))
        return;
      const sessionID = event.data.sessionID;
      started(sessionID);
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
      if (!atThisLocation(event))
        return;
      const sessionID = event.data.sessionID;
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
      if (!atThisLocation(event))
        return;
      const sessionID = event.data.sessionID;
      markRetrying(sessionID, false);
      errored.add(sessionID);
      if (isSubagent(sessionID)) {
        endedSubagent(sessionID);
        return;
      }
      ended(sessionID);
    }));
    unsubs.push(context.data.on("session.execution.interrupted", (event) => {
      if (!atThisLocation(event))
        return;
      const sessionID = event.data.sessionID;
      markRetrying(sessionID, false);
      if (isSubagent(sessionID)) {
        endedSubagent(sessionID);
        return;
      }
      ended(sessionID);
    }));
    unsubs.push(context.data.on("session.deleted", (event) => {
      if (!atThisLocation(event))
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
      if (!atThisLocation(event))
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
      if (!atThisLocation(event))
        return;
      const {
        id,
        sessionID,
        action
      } = event.data;
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

//# debugId=76F12BD4178D6E0E64756E2164756E21
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvc3JjL3R1aS50c3giLCJmaWxlOi8vL0M6L1VzZXJzL1pvdXl1L3JlcG9zL3NyYy9pMThuLnRzIiwiZmlsZTovLy9DOi9Vc2Vycy9ab3V5dS9yZXBvcy9zcmMvbm90aWZpY2F0aW9uLnRzIiwiZmlsZTovLy9DOi9Vc2Vycy9ab3V5dS9yZXBvcy9zcmMvd2luZG93cy1mb2N1cy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgYXMgXyRjcmVhdGVDb21wb25lbnQgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGVmZmVjdCBhcyBfJGVmZmVjdCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgY3JlYXRlVGV4dE5vZGUgYXMgXyRjcmVhdGVUZXh0Tm9kZSB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgaW5zZXJ0Tm9kZSBhcyBfJGluc2VydE5vZGUgfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGluc2VydCBhcyBfJGluc2VydCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgbWVtbyBhcyBfJG1lbW8gfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IHNldFByb3AgYXMgXyRzZXRQcm9wIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50IGFzIF8kY3JlYXRlRWxlbWVudCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSBcIkBvcGVuY29kZS9wbHVnaW4vdHVpXCI7XG5pbXBvcnQgeyBjcmVhdGVFZmZlY3QsIGNyZWF0ZU1lbW8sIGNyZWF0ZVNpZ25hbCwgRm9yLCBvbkNsZWFudXAsIFNob3cgfSBmcm9tIFwic29saWQtanNcIjtcbmltcG9ydCB7IG5vdGlmeUludGVydmlld0lucHV0LCBub3RpZnlTdWJhZ2VudHNEb25lLCBub3RpZnlUdXJuRG9uZSB9IGZyb20gXCIuL25vdGlmaWNhdGlvblwiO1xuaW1wb3J0IHsgcmVzb2x2ZUxvY2FsZSwgdCB9IGZyb20gXCIuL2kxOG5cIjtcbmltcG9ydCB7IGVuc3VyZVdpbmRvd3NGb2N1c0luaXQsIGdldEZvY3VzU3RhdHVzLCBpc1Rlcm1pbmFsRm9jdXNlZCB9IGZyb20gXCIuL3dpbmRvd3MtZm9jdXNcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHdpZGdldCB0aGF0IGxpdmUtdHJhY2tzIHJ1bm5pbmcgc3ViYWdlbnRzIChzdWItc2Vzc2lvbnMpLlxuICpcbiAqIE9wZW5Db2RlIDIueCBkYXRhIHNvdXJjZSAoYFBsdWdpbi5Db250ZXh0LmRhdGFgKTpcbiAqICAgLSBgZGF0YS5zZXNzaW9uLmxpc3QoKWAgICAgICAgICAgLT4gZXZlcnkgc2Vzc2lvbiB0aGUgVFVJIGhhcyBsb2FkZWQuIFN1Yi1zZXNzaW9uc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcnJ5IGBwYXJlbnRJRGA7IGBkYXRhLnNlc3Npb24ucm9vdCgpYCBncm91cHMgYVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb24gd2l0aCBpdHMgd2hvbGUgc3ViYWdlbnQgZmFtaWx5LlxuICogICAtIGBkYXRhLnNlc3Npb24uc3RhdHVzKGlkKWAgICAgICAtPiBcInJ1bm5pbmdcIiB8IFwiaWRsZVwiIChkZXJpdmVkIGZyb20gZXhlY3V0aW9uIGV2ZW50cylcbiAqICAgLSBgZGF0YS5zZXNzaW9uLmdldChpZClgICAgICAgICAgLT4gZnVsbCBgU2Vzc2lvbkluZm9gIChhZ2VudCwgdGl0bGUsIG91dGNvbWUsIHRpbWVzKVxuICpcbiAqIFRoZSBob3N0IGFscmVhZHkgcHJvamVjdHMgbGl2ZSBldmVudHMgaW50byB0aGlzIHJlYWN0aXZlIHN0b3JlLCBzbyB0aGUgcGx1Z2luIG5vXG4gKiBsb25nZXIgbWFpbnRhaW5zIGl0cyBvd24gZXZlbnQtZHJpdmVuIG1hcCAodGhlIFYxIGBzZXNzaW9uLmNyZWF0ZWRgIC8gYHNlc3Npb24uc3RhdHVzYFxuICogLyBgbWVzc2FnZS5wYXJ0LnVwZGF0ZWRgIHBsdW1iaW5nIGlzIGdvbmUpLiBgc2Vzc2lvbi5zdWJhZ2VudC4qYCBhY3Rpdml0eSBpcyBmb2xkZWQgaW50b1xuICogYGV4ZWN1dGlvbi5zdGFydGVkYCAvIGBleGVjdXRpb24uc3VjY2VlZGVkfGZhaWxlZHxpbnRlcnJ1cHRlZGAsIHdoaWNoIHRoZSBob3N0IGRhdGFcbiAqIGxheWVyIHR1cm5zIGludG8gdGhlIHJ1bm5pbmcvaWRsZSBzdGF0dXMgd2UgcmVhZCBoZXJlLlxuICpcbiAqIEVsYXBzZWQgdGltZSB1c2VzIHRoZSBzZXNzaW9uJ3Mgb3duIHRpbWVzdGFtcHM6XG4gKiAgIC0gYHRpbWUuYnVzeWAgIHN0YXJ0IG9mIHRoZSBtb3N0IHJlY2VudCBleGVjdXRpb25cbiAqICAgLSBgdGltZS5pZGxlYCAgZW5kIG9mIHRoZSBtb3N0IHJlY2VudCBjb21wbGV0ZWQgZXhlY3V0aW9uXG4gKlxuICogTm90aWZpY2F0aW9ucyBrZWVwIHRoZSBWMSBvcHRpb24gc3VyZmFjZSAoYG5vdGlmaWNhdGlvbnMuc3ViYWdlbnRzYCxcbiAqIGBub3RpZmljYXRpb25zLm1haW5TZXNzaW9uYCwgYG5vdGlmaWNhdGlvbnMuaW50ZXJ2aWV3YCwgYG5vdGlmaWNhdGlvbnMub25seVdoZW5VbmZvY3VzZWRgKVxuICogYnV0IHN1YnNjcmliZSB0byBWMiBldmVudHM6IGBzZXNzaW9uLmV4ZWN1dGlvbi4qYCwgYGZvcm0uKmAsIGBwZXJtaXNzaW9uLipgLlxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdER1cmF0aW9uKGVsYXBzZWRNcykge1xuICBjb25zdCB0b3RhbFNlY29uZHMgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKGVsYXBzZWRNcyAvIDEwMDApKTtcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICBjb25zdCBzZWNvbmRzID0gdG90YWxTZWNvbmRzICUgNjA7XG4gIHJldHVybiBtaW51dGVzID4gMCA/IGAke21pbnV0ZXN9bSR7c2Vjb25kcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1zYCA6IGAke3NlY29uZHN9c2A7XG59XG5mdW5jdGlvbiBzdGF0dXNPZihzZXNzaW9uLCBydW5uaW5nLCByZXRyeWluZykge1xuICBpZiAocnVubmluZykgcmV0dXJuIHJldHJ5aW5nID8gXCJyZXRyeVwiIDogXCJidXN5XCI7XG4gIGlmIChzZXNzaW9uLm91dGNvbWUgPT09IFwiZmFpbGVkXCIpIHJldHVybiBcImVycm9yXCI7XG4gIGlmIChzZXNzaW9uLm91dGNvbWUgPT09IFwiaW50ZXJydXB0ZWRcIikgcmV0dXJuIFwic3RvcHBlZFwiO1xuICBpZiAoc2Vzc2lvbi5vdXRjb21lID09PSBcInN1Y2NlZWRlZFwiKSByZXR1cm4gXCJkb25lXCI7XG4gIHJldHVybiBcImlkbGVcIjtcbn1cbmZ1bmN0aW9uIGVsYXBzZWRPZihzZXNzaW9uLCBzdGF0dXMsIG5vdykge1xuICBjb25zdCBzdGFydCA9IHNlc3Npb24udGltZS5idXN5ID8/IHNlc3Npb24udGltZS5jcmVhdGVkO1xuICBjb25zdCBlbmQgPSBzdGF0dXMgPT09IFwiYnVzeVwiIHx8IHN0YXR1cyA9PT0gXCJyZXRyeVwiID8gbm93IDogc2Vzc2lvbi50aW1lLmlkbGUgPz8gc2Vzc2lvbi50aW1lLnVwZGF0ZWQgPz8gbm93O1xuICByZXR1cm4gTWF0aC5tYXgoMCwgZW5kIC0gc3RhcnQpO1xufVxuZnVuY3Rpb24gU2lkZWJhcihwcm9wcykge1xuICBjb25zdCBkYXRhID0gcHJvcHMuY29udGV4dC5kYXRhO1xuICBjb25zdCB0aGVtZSA9IHByb3BzLmNvbnRleHQudGhlbWU7XG4gIGNvbnN0IGxhYmVscyA9IHQocHJvcHMubG9jYWxlKTtcbiAgLy8gUGVyc2lzdGVkIGxpa2UgdGhlIGJ1aWx0LWluIE1DUC9UT0RPIHNlY3Rpb25zOiB0aGUgYXJyb3cgdG9nZ2xlcyB0aGUgc2VjdGlvbiBhbmRcbiAgLy8gdGhlIGNob2ljZSBzdXJ2aXZlcyBUVUkgcmVzdGFydHMgYW5kIHBsdWdpbiBob3QgcmVsb2Fkcy5cbiAgY29uc3QgW3ZpZXcsIHVwZGF0ZVZpZXddID0gcHJvcHMuY29udGV4dC5zdG9yYWdlLnN0b3JlKFwidmlld1wiLCB7XG4gICAgaW5pdGlhbDoge1xuICAgICAgb3BlbjogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIC8vIFJlLXJlbmRlciBvbmNlIGEgc2Vjb25kIHNvIGVsYXBzZWQgdGltZXMgdGljayB3aGlsZSBhbiBleGVjdXRpb24gaXMgcnVubmluZy5cbiAgY29uc3QgW25vdywgc2V0Tm93XSA9IGNyZWF0ZVNpZ25hbChEYXRlLm5vdygpKTtcblxuICAvLyBgUGx1Z2luLkNvbnRleHRbXCJkYXRhXCJdLnNlc3Npb25gIGV4cG9zZXMgYHN0YXR1cygpYCBidXQgbm90IHRoZSBzb2xpZCBzdG9yZSdzXG4gIC8vIGBhY3RpdmUoKWAgaGVscGVyLCBzbyBkZXJpdmUgdGhlIHJ1bm5pbmcgc2V0IGZyb20gdGhlIHB1YmxpYyBzdXJmYWNlLlxuICBjb25zdCBydW5uaW5nSURzID0gKCkgPT4gbmV3IFNldChkYXRhLnNlc3Npb24ubGlzdCgpLmZpbHRlcihzZXNzaW9uID0+IGRhdGEuc2Vzc2lvbi5zdGF0dXMoc2Vzc2lvbi5pZCkgPT09IFwicnVubmluZ1wiKS5tYXAoc2Vzc2lvbiA9PiBzZXNzaW9uLmlkKSk7XG5cbiAgLy8gU2VlZCB0aGUgdmlzaWJsZSBzZXQgZm9yIHN1YmFnZW50cyB0aGF0IHdlcmUgYWxyZWFkeSBydW5uaW5nIHdoZW4gdGhlIHBsdWdpblxuICAvLyBhY3RpdmF0ZWQgKGhvdCByZWxvYWQgLyBUVUkgcmVzdW1lKS4gTGl2ZSBzdGFydHMgYXJlIHJlY29yZGVkIGJ5IHRoZSBzZXR1cFxuICAvLyBldmVudCBoYW5kbGVyLCBzbyBhIGZhc3Qgc3RhcnQvZmluaXNoIGNhbm5vdCBmYWxsIHRocm91Z2ggdGhpcyBib290c3RyYXAuXG4gIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IGRhdGEuc2Vzc2lvbi5yb290KHByb3BzLnNlc3Npb25JRCk7XG4gICAgZm9yIChjb25zdCBpZCBvZiBydW5uaW5nSURzKCkpIHtcbiAgICAgIGNvbnN0IHNlc3Npb24gPSBkYXRhLnNlc3Npb24uZ2V0KGlkKTtcbiAgICAgIGlmIChzZXNzaW9uPy5wYXJlbnRJRCAhPT0gdW5kZWZpbmVkICYmIGRhdGEuc2Vzc2lvbi5yb290KGlkKSA9PT0gcm9vdCkge1xuICAgICAgICBwcm9wcy5tYXJrU2VlbihpZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZW50cmllcyA9IGNyZWF0ZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBkYXRhLnNlc3Npb24ucm9vdChwcm9wcy5zZXNzaW9uSUQpO1xuICAgIGNvbnN0IGFjdGl2ZSA9IHJ1bm5pbmdJRHMoKTtcbiAgICBjb25zdCByZXRyeWluZyA9IHByb3BzLnJldHJ5aW5nKCk7XG4gICAgY29uc3Qgc2VlbklEcyA9IHByb3BzLnNlZW4oKTtcbiAgICBjb25zdCBjbG9jayA9IG5vdygpO1xuICAgIHJldHVybiBkYXRhLnNlc3Npb24ubGlzdCgpLmZpbHRlcihzZXNzaW9uID0+IHtcbiAgICAgIGlmIChzZXNzaW9uLnBhcmVudElEID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmIChkYXRhLnNlc3Npb24ucm9vdChzZXNzaW9uLmlkKSAhPT0gcm9vdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIGFjdGl2ZS5oYXMoc2Vzc2lvbi5pZCkgfHwgc2VlbklEcy5oYXMoc2Vzc2lvbi5pZCk7XG4gICAgfSkubWFwKHNlc3Npb24gPT4ge1xuICAgICAgY29uc3QgcnVubmluZyA9IGFjdGl2ZS5oYXMoc2Vzc2lvbi5pZCk7XG4gICAgICBjb25zdCBzdGF0dXMgPSBzdGF0dXNPZihzZXNzaW9uLCBydW5uaW5nLCByZXRyeWluZy5oYXMoc2Vzc2lvbi5pZCkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHNlc3Npb24uaWQsXG4gICAgICAgIGFnZW50OiBzZXNzaW9uLmFnZW50ID8/IFwiP1wiLFxuICAgICAgICB0aXRsZTogc2Vzc2lvbi50aXRsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgZWxhcHNlZDogZWxhcHNlZE9mKHNlc3Npb24sIHN0YXR1cywgY2xvY2spLFxuICAgICAgICBjcmVhdGVkOiBzZXNzaW9uLnRpbWUuY3JlYXRlZFxuICAgICAgfTtcbiAgICB9KS5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYi5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGIuc3RhdHVzID09PSBcInJldHJ5XCIpIC0gTnVtYmVyKGEuc3RhdHVzID09PSBcImJ1c3lcIiB8fCBhLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB8fCBhLmNyZWF0ZWQgLSBiLmNyZWF0ZWQpO1xuICB9KTtcblxuICAvLyBUaWNrIG9ubHkgd2hpbGUgdGhlIHNlY3Rpb24gaXMgb3BlbiBhbmQgc29tZXRoaW5nIGhhcyBhIGxpdmUgY2xvY2suXG4gIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGlmICghdmlldy5vcGVuKSByZXR1cm47XG4gICAgaWYgKGVudHJpZXMoKS5zb21lKGVudHJ5ID0+IGVudHJ5LnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgZW50cnkuc3RhdHVzID09PSBcInJldHJ5XCIpKSB7XG4gICAgICBzZXROb3coRGF0ZS5ub3coKSk7XG4gICAgfVxuICB9LCAxMDAwKTtcbiAgb25DbGVhbnVwKCgpID0+IGNsZWFySW50ZXJ2YWwodGltZXIpKTtcbiAgY29uc3QgdG9uZSA9IHN0YXR1cyA9PiB7XG4gICAgaWYgKHN0YXR1cyA9PT0gXCJidXN5XCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLnN1Y2Nlc3MuYmFzZTtcbiAgICBpZiAoc3RhdHVzID09PSBcInJldHJ5XCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLndhcm5pbmcuYmFzZTtcbiAgICBpZiAoc3RhdHVzID09PSBcImVycm9yXCIpIHJldHVybiB0aGVtZS50ZXh0LmZlZWRiYWNrLmVycm9yLmJhc2U7XG4gICAgcmV0dXJuIHRoZW1lLnRleHQubXV0ZWQ7XG4gIH07XG4gIGNvbnN0IHN0YXR1c0xhYmVsID0gc3RhdHVzID0+IHtcbiAgICBpZiAoc3RhdHVzID09PSBcImJ1c3lcIikgcmV0dXJuIFwiYnVzeVwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwicmV0cnlcIikgcmV0dXJuIFwicmV0cnlcIjtcbiAgICBpZiAoc3RhdHVzID09PSBcImRvbmVcIikgcmV0dXJuIFwiZG9uZVwiO1xuICAgIGlmIChzdGF0dXMgPT09IFwiZXJyb3JcIikgcmV0dXJuIFwiZXJyb3JcIjtcbiAgICBpZiAoc3RhdHVzID09PSBcInN0b3BwZWRcIikgcmV0dXJuIFwic3RvcHBlZFwiO1xuICAgIHJldHVybiBcImlkbGVcIjtcbiAgfTtcbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgdmFyIF9lbCQgPSBfJGNyZWF0ZUVsZW1lbnQoXCJib3hcIiksXG4gICAgICBfZWwkMiA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKSxcbiAgICAgIF9lbCQzID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgIF9lbCQ0ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgIF9lbCQ1ID0gXyRjcmVhdGVFbGVtZW50KFwiYlwiKTtcbiAgICBfJGluc2VydE5vZGUoX2VsJCwgX2VsJDIpO1xuICAgIF8kc2V0UHJvcChfZWwkLCBcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICBfJHNldFByb3AoX2VsJCwgXCJmbGV4RGlyZWN0aW9uXCIsIFwiY29sdW1uXCIpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkMiwgX2VsJDMpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkMiwgX2VsJDQpO1xuICAgIF8kc2V0UHJvcChfZWwkMiwgXCJ3aWR0aFwiLCBcIjEwMCVcIik7XG4gICAgXyRzZXRQcm9wKF9lbCQyLCBcImZsZXhEaXJlY3Rpb25cIiwgXCJyb3dcIik7XG4gICAgXyRzZXRQcm9wKF9lbCQyLCBcImdhcFwiLCAxKTtcbiAgICBfJHNldFByb3AoX2VsJDIsIFwib25Nb3VzZURvd25cIiwgKCkgPT4ge1xuICAgICAgdm9pZCB1cGRhdGVWaWV3KGRyYWZ0ID0+IHtcbiAgICAgICAgZHJhZnQub3BlbiA9ICFkcmFmdC5vcGVuO1xuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwZXJzaXN0IHN1YmFnZW50IHNpZGViYXIgc3RhdGVcIiwgZXJyb3IpKTtcbiAgICB9KTtcbiAgICBfJGluc2VydChfZWwkMywgKCkgPT4gdmlldy5vcGVuID8gXCLilrxcIiA6IFwi4pa2XCIpO1xuICAgIF8kaW5zZXJ0Tm9kZShfZWwkNCwgX2VsJDUpO1xuICAgIF8kaW5zZXJ0KF9lbCQ1LCAoKSA9PiBsYWJlbHMuc3ViYWdlbnRzKTtcbiAgICBfJGluc2VydChfZWwkNCwgXyRjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBlbnRyaWVzKCkubGVuZ3RoID4gMDtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHZhciBfZWwkNiA9IF8kY3JlYXRlRWxlbWVudChcInNwYW5cIiksXG4gICAgICAgICAgX2VsJDcgPSBfJGNyZWF0ZVRleHROb2RlKGAgKGApLFxuICAgICAgICAgIF9lbCQ4ID0gXyRjcmVhdGVUZXh0Tm9kZShgKWApO1xuICAgICAgICBfJGluc2VydE5vZGUoX2VsJDYsIF9lbCQ3KTtcbiAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQ2LCBfZWwkOCk7XG4gICAgICAgIF8kaW5zZXJ0KF9lbCQ2LCAoKSA9PiBlbnRyaWVzKCkubGVuZ3RoLCBfZWwkOCk7XG4gICAgICAgIF8kZWZmZWN0KF8kcCA9PiBfJHNldFByb3AoX2VsJDYsIFwic3R5bGVcIiwge1xuICAgICAgICAgIGZnOiB0aGVtZS50ZXh0Lm11dGVkXG4gICAgICAgIH0sIF8kcCkpO1xuICAgICAgICByZXR1cm4gX2VsJDY7XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIF8kaW5zZXJ0KF9lbCQsIF8kY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gdmlldy5vcGVuO1xuICAgICAgfSxcbiAgICAgIGdldCBmYWxsYmFjaygpIHtcbiAgICAgICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICAgICAgdmFyIF9lbCQwID0gXyRjcmVhdGVFbGVtZW50KFwiYm94XCIpO1xuICAgICAgICAgIF8kc2V0UHJvcChfZWwkMCwgXCJoZWlnaHRcIiwgMCk7XG4gICAgICAgICAgcmV0dXJuIF9lbCQwO1xuICAgICAgICB9KSgpO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIFtfJGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcHMuc2hvd0ZvY3VzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGZhbGxiYWNrKCkge1xuICAgICAgICAgICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICAgICAgICAgIHZhciBfZWwkMSA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKTtcbiAgICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxLCBcImhlaWdodFwiLCAwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9lbCQxO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHZhciBfZWwkOSA9IF8kY3JlYXRlRWxlbWVudChcInRleHRcIik7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkOSwgKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBkaWFnID0gcHJvcHMuZm9jdXNEaWFnKCk7XG4gICAgICAgICAgICAgIGNvbnN0IGZsYWcgPSBkaWFnLmxhc3RSZXN1bHQgPT09IHRydWUgPyBcIuKXj2ZvY3VzZWRcIiA6IGRpYWcubGFzdFJlc3VsdCA9PT0gZmFsc2UgPyBcIuKXi2JsdXJyZWRcIiA6IFwiP3Vua25vd25cIjtcbiAgICAgICAgICAgICAgY29uc3Qgc3JjID0gZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZCAhPT0gdW5kZWZpbmVkID8gYCBmZz0ke2RpYWcubGFzdEZvcmVncm91bmRQaWR9YCA6IFwiXCI7XG4gICAgICAgICAgICAgIGNvbnN0IGVyciA9IGRpYWcubGFzdEVycm9yID8gYCBlcnI9JHtkaWFnLmxhc3RFcnJvcn1gIDogXCJcIjtcbiAgICAgICAgICAgICAgcmV0dXJuIGAgIGZvY3VzWyR7ZGlhZy5iYWNrZW5kfSR7ZGlhZy5hbmNlc3RvckNvdW50ID8gYDoke2RpYWcuYW5jZXN0b3JDb3VudH1gIDogXCJcIn1dICR7ZmxhZ30ke3NyY30ke2Vycn1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfJGVmZmVjdChfJHAgPT4gXyRzZXRQcm9wKF9lbCQ5LCBcImZnXCIsIHRoZW1lLnRleHQubXV0ZWQsIF8kcCkpO1xuICAgICAgICAgICAgcmV0dXJuIF9lbCQ5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSksIF8kY3JlYXRlQ29tcG9uZW50KEZvciwge1xuICAgICAgICAgIGdldCBlYWNoKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJpZXMoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoaWxkcmVuOiBlbnRyeSA9PiAoKCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9lbCQxMCA9IF8kY3JlYXRlRWxlbWVudChcImJveFwiKSxcbiAgICAgICAgICAgICAgX2VsJDExID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDEzID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDE2ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKSxcbiAgICAgICAgICAgICAgX2VsJDE3ID0gXyRjcmVhdGVFbGVtZW50KFwidGV4dFwiKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTAsIF9lbCQxMSk7XG4gICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDEwLCBfZWwkMTMpO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMCwgX2VsJDE2KTtcbiAgICAgICAgICAgIF8kaW5zZXJ0Tm9kZShfZWwkMTAsIF9lbCQxNyk7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEwLCBcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwiZmxleERpcmVjdGlvblwiLCBcInJvd1wiKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwiZ2FwXCIsIDEpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMCwgXCJwYWRkaW5nTGVmdFwiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTAsIFwib25Nb3VzZURvd25cIiwgKCkgPT4ge1xuICAgICAgICAgICAgICBwcm9wcy5jb250ZXh0LnVpLnJvdXRlci5uYXZpZ2F0ZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzZXNzaW9uXCIsXG4gICAgICAgICAgICAgICAgc2Vzc2lvbklEOiBlbnRyeS5pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXyRpbnNlcnROb2RlKF9lbCQxMSwgXyRjcmVhdGVUZXh0Tm9kZShg4pePYCkpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMSwgXCJmbGV4U2hyaW5rXCIsIDApO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDEzLCBcInRydW5jYXRlXCIsIHRydWUpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxMywgXCJmbGV4R3Jvd1wiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTMsIFwiZmxleFNocmlua1wiLCAxKTtcbiAgICAgICAgICAgIF8kc2V0UHJvcChfZWwkMTMsIFwibWluV2lkdGhcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTMsICgpID0+IGVudHJ5LnRpdGxlID8/IGVudHJ5LmFnZW50LCBudWxsKTtcbiAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxMywgXyRjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cnkudGl0bGU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2VsJDE0ID0gXyRjcmVhdGVFbGVtZW50KFwic3BhblwiKSxcbiAgICAgICAgICAgICAgICAgIF9lbCQxNSA9IF8kY3JlYXRlVGV4dE5vZGUoYCBgKTtcbiAgICAgICAgICAgICAgICBfJGluc2VydE5vZGUoX2VsJDE0LCBfZWwkMTUpO1xuICAgICAgICAgICAgICAgIF8kaW5zZXJ0KF9lbCQxNCwgKCkgPT4gZW50cnkuYWdlbnQsIG51bGwpO1xuICAgICAgICAgICAgICAgIF8kZWZmZWN0KF8kcCA9PiBfJHNldFByb3AoX2VsJDE0LCBcInN0eWxlXCIsIHtcbiAgICAgICAgICAgICAgICAgIGZnOiB0aGVtZS50ZXh0Lm11dGVkXG4gICAgICAgICAgICAgICAgfSwgXyRwKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9lbCQxNDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIG51bGwpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxNiwgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE2LCBcImZsZXhTaHJpbmtcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTYsICgpID0+IHN0YXR1c0xhYmVsKGVudHJ5LnN0YXR1cykpO1xuICAgICAgICAgICAgXyRzZXRQcm9wKF9lbCQxNywgXCJ3cmFwTW9kZVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBfJHNldFByb3AoX2VsJDE3LCBcImZsZXhTaHJpbmtcIiwgMCk7XG4gICAgICAgICAgICBfJGluc2VydChfZWwkMTcsICgpID0+IGZvcm1hdER1cmF0aW9uKGVudHJ5LmVsYXBzZWQpKTtcbiAgICAgICAgICAgIF8kZWZmZWN0KF9wJCA9PiB7XG4gICAgICAgICAgICAgIHZhciBfdiQzID0gdG9uZShlbnRyeS5zdGF0dXMpLFxuICAgICAgICAgICAgICAgIF92JDQgPSB0aGVtZS50ZXh0LmJhc2UsXG4gICAgICAgICAgICAgICAgX3YkNSA9IHRvbmUoZW50cnkuc3RhdHVzKSxcbiAgICAgICAgICAgICAgICBfdiQ2ID0gdGhlbWUudGV4dC5tdXRlZDtcbiAgICAgICAgICAgICAgX3YkMyAhPT0gX3AkLmUgJiYgKF9wJC5lID0gXyRzZXRQcm9wKF9lbCQxMSwgXCJmZ1wiLCBfdiQzLCBfcCQuZSkpO1xuICAgICAgICAgICAgICBfdiQ0ICE9PSBfcCQudCAmJiAoX3AkLnQgPSBfJHNldFByb3AoX2VsJDEzLCBcImZnXCIsIF92JDQsIF9wJC50KSk7XG4gICAgICAgICAgICAgIF92JDUgIT09IF9wJC5hICYmIChfcCQuYSA9IF8kc2V0UHJvcChfZWwkMTYsIFwiZmdcIiwgX3YkNSwgX3AkLmEpKTtcbiAgICAgICAgICAgICAgX3YkNiAhPT0gX3AkLm8gJiYgKF9wJC5vID0gXyRzZXRQcm9wKF9lbCQxNywgXCJmZ1wiLCBfdiQ2LCBfcCQubykpO1xuICAgICAgICAgICAgICByZXR1cm4gX3AkO1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgYTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBvOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIF9lbCQxMDtcbiAgICAgICAgICB9KSgpXG4gICAgICAgIH0pXTtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgXyRlZmZlY3QoX3AkID0+IHtcbiAgICAgIHZhciBfdiQgPSB0aGVtZS50ZXh0LmJhc2UsXG4gICAgICAgIF92JDIgPSB0aGVtZS50ZXh0LmJhc2U7XG4gICAgICBfdiQgIT09IF9wJC5lICYmIChfcCQuZSA9IF8kc2V0UHJvcChfZWwkMywgXCJmZ1wiLCBfdiQsIF9wJC5lKSk7XG4gICAgICBfdiQyICE9PSBfcCQudCAmJiAoX3AkLnQgPSBfJHNldFByb3AoX2VsJDQsIFwiZmdcIiwgX3YkMiwgX3AkLnQpKTtcbiAgICAgIHJldHVybiBfcCQ7XG4gICAgfSwge1xuICAgICAgZTogdW5kZWZpbmVkLFxuICAgICAgdDogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgcmV0dXJuIF9lbCQ7XG4gIH0pKCk7XG59XG5jb25zdCBwbHVnaW4gPSBQbHVnaW4uZGVmaW5lKHtcbiAgaWQ6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgc2V0dXAoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnMgPz8ge307XG4gICAgY29uc3Qgbm90aWZDZmcgPSBvcHRpb25zLm5vdGlmaWNhdGlvbnM7XG4gICAgLy8gT3B0LWluOiBPcGVuQ29kZSAyLnggc2hpcHMgYG9wZW5jb2RlLm5vdGlmaWNhdGlvbnNgLCB3aGljaCBjb3ZlcnMgdGhlIHNhbWVcbiAgICAvLyBldmVudHMuIERlZmF1bHRpbmcgdG8gb2ZmIGF2b2lkcyBkdXBsaWNhdGUgc291bmRzL3RvYXN0cy5cbiAgICBjb25zdCBub3RpZnlTdWJhZ2VudHMgPSBub3RpZkNmZz8uc3ViYWdlbnRzID8/IGZhbHNlO1xuICAgIGNvbnN0IG5vdGlmeU1haW5TZXNzaW9uID0gbm90aWZDZmc/Lm1haW5TZXNzaW9uID8/IGZhbHNlO1xuICAgIGNvbnN0IG5vdGlmeUludGVydmlldyA9IG5vdGlmQ2ZnPy5pbnRlcnZpZXcgPz8gZmFsc2U7XG4gICAgY29uc3Qgbm90aWZ5T25seVdoZW5VbmZvY3VzZWQgPSBub3RpZkNmZz8ub25seVdoZW5VbmZvY3VzZWQgPz8gZmFsc2U7XG4gICAgY29uc3QgbG9jYWxlID0gcmVzb2x2ZUxvY2FsZShvcHRpb25zLmxvY2FsZSk7XG4gICAgY29uc3Qgc2hvd0ZvY3VzID0gb3B0aW9ucy5zaWRlYmFyPy5zaG93Rm9jdXMgPz8gZmFsc2U7XG5cbiAgICAvLyBTdWJhZ2VudHMgb2JzZXJ2ZWQgcnVubmluZyBkdXJpbmcgdGhpcyBhY3RpdmF0aW9uLiBSZWNvcmRlZCBmcm9tIHRoZSBsaXZlXG4gICAgLy8gZXhlY3V0aW9uIGV2ZW50IChub3QgYnkgcG9sbGluZykgc28gYSBmYXN0IHN0YXJ0L2ZpbmlzaCBzdGlsbCBnZXRzIGEgcm93LlxuICAgIGNvbnN0IFtzZWVuLCBzZXRTZWVuXSA9IGNyZWF0ZVNpZ25hbChuZXcgU2V0KCkpO1xuICAgIGNvbnN0IG1hcmtTZWVuID0gc2Vzc2lvbklEID0+IHtcbiAgICAgIHNldFNlZW4ocHJldmlvdXMgPT4ge1xuICAgICAgICBpZiAocHJldmlvdXMuaGFzKHNlc3Npb25JRCkpIHJldHVybiBwcmV2aW91cztcbiAgICAgICAgY29uc3QgbmV4dCA9IG5ldyBTZXQocHJldmlvdXMpO1xuICAgICAgICBuZXh0LmFkZChzZXNzaW9uSUQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyAtLS0gVGVybWluYWwgZm9jdXMgdHJhY2tpbmcgKFdpbmRvd3MgZmFsbGJhY2spIC0tLVxuICAgIGlmIChub3RpZnlPbmx5V2hlblVuZm9jdXNlZCkgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCgpO1xuICAgIGxldCBmb2N1c2VkO1xuICAgIGNvbnN0IFtmb2N1c0RpYWcsIHNldEZvY3VzRGlhZ10gPSBjcmVhdGVTaWduYWwoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3QgcmVmcmVzaEZvY3VzRGlhZyA9ICgpID0+IHNldEZvY3VzRGlhZyhnZXRGb2N1c1N0YXR1cygpKTtcbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IHRydWU7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgICBmb2N1c2VkID0gZmFsc2U7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb250ZXh0LnJlbmRlcmVyLm9uKFwiZm9jdXNcIiwgb25Gb2N1cyk7XG4gICAgY29udGV4dC5yZW5kZXJlci5vbihcImJsdXJcIiwgb25CbHVyKTtcbiAgICBjb25zdCBub3RpZnlHYXRlID0ge1xuICAgICAgb25seVdoZW5VbmZvY3VzZWQ6IG5vdGlmeU9ubHlXaGVuVW5mb2N1c2VkLFxuICAgICAgZm9jdXNlZDogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB3aW4gPSBhd2FpdCBpc1Rlcm1pbmFsRm9jdXNlZCgpO1xuICAgICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgICAgIHJldHVybiB3aW4gPz8gZm9jdXNlZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gU2Vzc2lvbiBJRHMgY3VycmVudGx5IGluIGEgcmV0cnkgYmFja29mZi4gVjIgZXhwb3NlcyBvbmx5IHJ1bm5pbmcvaWRsZSBpblxuICAgIC8vIGBkYXRhLnNlc3Npb24uc3RhdHVzKClgLCBzbyB0aGlzIGlzIHRoZSBvbmx5IHdheSB0byBrZWVwIHRoZSBWMSBcInJldHJ5XCIgc3RhdGUuXG4gICAgY29uc3QgW3JldHJ5aW5nLCBzZXRSZXRyeWluZ10gPSBjcmVhdGVTaWduYWwobmV3IFNldCgpKTtcbiAgICBjb25zdCBtYXJrUmV0cnlpbmcgPSAoc2Vzc2lvbklELCB2YWx1ZSkgPT4ge1xuICAgICAgc2V0UmV0cnlpbmcocHJldmlvdXMgPT4ge1xuICAgICAgICBpZiAocHJldmlvdXMuaGFzKHNlc3Npb25JRCkgPT09IHZhbHVlKSByZXR1cm4gcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXcgU2V0KHByZXZpb3VzKTtcbiAgICAgICAgaWYgKHZhbHVlKSBuZXh0LmFkZChzZXNzaW9uSUQpO2Vsc2UgbmV4dC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGlzU3ViYWdlbnQgPSBzZXNzaW9uSUQgPT4gY29udGV4dC5kYXRhLnNlc3Npb24uZ2V0KHNlc3Npb25JRCk/LnBhcmVudElEICE9PSB1bmRlZmluZWQ7XG5cbiAgICAvLyBBIFRVSSBjYW4gYmUgYXR0YWNoZWQgdG8gb25lIGxvY2F0aW9uOyBpZ25vcmUgZXZlbnRzIGZvciBvdGhlciB3b3JrdHJlZXMuXG4gICAgY29uc3QgYXRUaGlzTG9jYXRpb24gPSBldmVudCA9PiB7XG4gICAgICBjb25zdCBoZXJlID0gY29udGV4dC5sb2NhdGlvbj8uZGlyZWN0b3J5O1xuICAgICAgY29uc3QgdGhlcmUgPSBldmVudC5sb2NhdGlvbj8uZGlyZWN0b3J5O1xuICAgICAgcmV0dXJuICFoZXJlIHx8ICF0aGVyZSB8fCBoZXJlID09PSB0aGVyZTtcbiAgICB9O1xuXG4gICAgLy8gT25seSBkaXJlY3QgY2hpbGRyZW4gY291bnQ6IGEgZ3JhbmRjaGlsZCByZXBvcnRzIHRvIGl0cyBvd24gcGFyZW50LCBhbmQgcnVubmluZ1xuICAgIC8vIHNoZWxscyBhcmUgYSBkaWZmZXJlbnQgY29uY2Vybi4gTWlycm9ycyB0aGUgYnVpbHQtaW4gbm90aWZpY2F0aW9ucyBwbHVnaW4uXG4gICAgY29uc3QgaGFzUnVubmluZ0NoaWxkID0gc2Vzc2lvbklEID0+IGNvbnRleHQuZGF0YS5zZXNzaW9uLmZhbWlseShzZXNzaW9uSUQpLnNvbWUoY2hpbGQgPT4gY2hpbGQgIT09IHNlc3Npb25JRCAmJiBjb250ZXh0LmRhdGEuc2Vzc2lvbi5nZXQoY2hpbGQpPy5wYXJlbnRJRCA9PT0gc2Vzc2lvbklEICYmIGNvbnRleHQuZGF0YS5zZXNzaW9uLnN0YXR1cyhjaGlsZCkgPT09IFwicnVubmluZ1wiKTtcblxuICAgIC8vIC0tLSBOb3RpZmljYXRpb24gc3RhdGUgLS0tXG4gICAgY29uc3QgYWN0aXZlU3ViYWdlbnRzID0gbmV3IFNldCgpO1xuICAgIGxldCByb3VuZENvdW50ID0gMDtcbiAgICBsZXQgcm91bmROb3RpZmllZCA9IGZhbHNlO1xuICAgIGNvbnN0IHRlcm1pbmFsID0gbmV3IFNldCgpOyAvLyBzZXNzaW9uSURzIHdob3NlIGN1cnJlbnQgcnVuIHdhcyBhbm5vdW5jZWRcbiAgICBjb25zdCBlcnJvcmVkID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IHBlbmRpbmdGb3JtcyA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBwZW5kaW5nUGVybWlzc2lvbnMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgUEVSTUlTU0lPTl9OT1RJRllfREVMQVlfTVMgPSA1MDA7XG4gICAgY29uc3Qgc3RhcnRlZCA9IHNlc3Npb25JRCA9PiB7XG4gICAgICB0ZXJtaW5hbC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGVycm9yZWQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgfTtcbiAgICBjb25zdCBlbmRlZCA9IHNlc3Npb25JRCA9PiB7XG4gICAgICBpZiAodGVybWluYWwuaGFzKHNlc3Npb25JRCkpIHJldHVybjtcbiAgICAgIHRlcm1pbmFsLmFkZChzZXNzaW9uSUQpO1xuICAgICAgaWYgKGVycm9yZWQuaGFzKHNlc3Npb25JRCkpIHtcbiAgICAgICAgZXJyb3JlZC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGlzU3ViYWdlbnQoc2Vzc2lvbklEKSkgcmV0dXJuOyAvLyBjb3ZlcmVkIGJ5IHRoZSBiYXRjaCBub3RpZmljYXRpb24gYmVsb3dcbiAgICAgIGlmIChub3RpZnlNYWluU2Vzc2lvbikge1xuICAgICAgICBub3RpZnlUdXJuRG9uZShjb250ZXh0LCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHVuc3VicyA9IFtdO1xuICAgIGNvbnN0IGVuZGVkU3ViYWdlbnQgPSBzZXNzaW9uSUQgPT4ge1xuICAgICAgY29uc3QgdHJhY2tlZCA9IGFjdGl2ZVN1YmFnZW50cy5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGlmICghdHJhY2tlZCB8fCBhY3RpdmVTdWJhZ2VudHMuc2l6ZSA+IDAgfHwgcm91bmROb3RpZmllZCkgcmV0dXJuO1xuICAgICAgcm91bmROb3RpZmllZCA9IHRydWU7XG4gICAgICBpZiAobm90aWZ5U3ViYWdlbnRzKSB7XG4gICAgICAgIG5vdGlmeVN1YmFnZW50c0RvbmUoY29udGV4dCwgcm91bmRDb3VudCwgbm90aWZ5R2F0ZSwgbG9jYWxlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFJldHJ5IHN0YXRlOiB0aGUgaG9zdCBvbmx5IHByb2plY3RzIHJ1bm5pbmcvaWRsZSwgc28gdHJhY2sgdGhlIHRyYW5zaWVudCBiYWNrb2ZmLlxuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24ucmV0cnkuc2NoZWR1bGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgICBtYXJrUmV0cnlpbmcoZXZlbnQuZGF0YS5zZXNzaW9uSUQsIHRydWUpO1xuICAgIH0pKTtcblxuICAgIC8vIEV4ZWN1dGlvbiBsaWZlY3ljbGUuIFRoaXMgaXMgdGhlIFYyIHJlcGxhY2VtZW50IGZvciB0aGUgVjFcbiAgICAvLyBzZXNzaW9uLnN0YXR1cyAvIG1lc3NhZ2UucGFydC51cGRhdGVkIGNvbXBsZXRpb24gc2lnbmFscy5cbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJzZXNzaW9uLmV4ZWN1dGlvbi5zdGFydGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5kYXRhLnNlc3Npb25JRDtcbiAgICAgIHN0YXJ0ZWQoc2Vzc2lvbklEKTtcbiAgICAgIC8vIFJlY29yZCBldmVyeSBzdGFydDsgdGhlIHJlbmRlcmVyIG9ubHkga2VlcHMgZW50cmllcyB3aXRoIGEgcGFyZW50SUQuXG4gICAgICAvLyBUaGlzIHN0aWxsIGNhdGNoZXMgYSBzdWJhZ2VudCB3aG9zZSBzZXNzaW9uIGluZm8gaGFzIG5vdCBsYW5kZWQgeWV0LlxuICAgICAgbWFya1NlZW4oc2Vzc2lvbklEKTtcbiAgICAgIGlmICghaXNTdWJhZ2VudChzZXNzaW9uSUQpKSByZXR1cm47XG4gICAgICBpZiAoYWN0aXZlU3ViYWdlbnRzLnNpemUgPT09IDApIHtcbiAgICAgICAgcm91bmRDb3VudCA9IDA7XG4gICAgICAgIHJvdW5kTm90aWZpZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZVN1YmFnZW50cy5hZGQoc2Vzc2lvbklEKTtcbiAgICAgIHJvdW5kQ291bnQrKztcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5leGVjdXRpb24uc3VjY2VlZGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5kYXRhLnNlc3Npb25JRDtcbiAgICAgIG1hcmtSZXRyeWluZyhzZXNzaW9uSUQsIGZhbHNlKTtcbiAgICAgIGlmIChpc1N1YmFnZW50KHNlc3Npb25JRCkpIHtcbiAgICAgICAgZW5kZWRTdWJhZ2VudChzZXNzaW9uSUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBBIHJ1bm5pbmcgc3ViYWdlbnQncyByZXBvcnQgd2FrZXMgdGhlIHBhcmVudCBzZXNzaW9uIGFnYWluOyB3YWl0IGZvciBpdC5cbiAgICAgIGlmIChoYXNSdW5uaW5nQ2hpbGQoc2Vzc2lvbklEKSkgcmV0dXJuO1xuICAgICAgZW5kZWQoc2Vzc2lvbklEKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5leGVjdXRpb24uZmFpbGVkXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmICghYXRUaGlzTG9jYXRpb24oZXZlbnQpKSByZXR1cm47XG4gICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5kYXRhLnNlc3Npb25JRDtcbiAgICAgIG1hcmtSZXRyeWluZyhzZXNzaW9uSUQsIGZhbHNlKTtcbiAgICAgIGVycm9yZWQuYWRkKHNlc3Npb25JRCk7XG4gICAgICBpZiAoaXNTdWJhZ2VudChzZXNzaW9uSUQpKSB7XG4gICAgICAgIGVuZGVkU3ViYWdlbnQoc2Vzc2lvbklEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZW5kZWQoc2Vzc2lvbklEKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwic2Vzc2lvbi5leGVjdXRpb24uaW50ZXJydXB0ZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgaWYgKCFhdFRoaXNMb2NhdGlvbihldmVudCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LmRhdGEuc2Vzc2lvbklEO1xuICAgICAgbWFya1JldHJ5aW5nKHNlc3Npb25JRCwgZmFsc2UpO1xuICAgICAgaWYgKGlzU3ViYWdlbnQoc2Vzc2lvbklEKSkge1xuICAgICAgICBlbmRlZFN1YmFnZW50KHNlc3Npb25JRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVuZGVkKHNlc3Npb25JRCk7XG4gICAgfSkpO1xuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcInNlc3Npb24uZGVsZXRlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQuZGF0YS5zZXNzaW9uSUQ7XG4gICAgICB0ZXJtaW5hbC5kZWxldGUoc2Vzc2lvbklEKTtcbiAgICAgIGVycm9yZWQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBhY3RpdmVTdWJhZ2VudHMuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICBtYXJrUmV0cnlpbmcoc2Vzc2lvbklELCBmYWxzZSk7XG4gICAgICBzZXRTZWVuKHByZXZpb3VzID0+IHtcbiAgICAgICAgaWYgKCFwcmV2aW91cy5oYXMoc2Vzc2lvbklEKSkgcmV0dXJuIHByZXZpb3VzO1xuICAgICAgICBjb25zdCBuZXh0ID0gbmV3IFNldChwcmV2aW91cyk7XG4gICAgICAgIG5leHQuZGVsZXRlKHNlc3Npb25JRCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgLy8gSW50ZXJ2aWV3IGJsb2NrZWQ6IFYyIGZvcm1zIHJlcGxhY2UgdGhlIFYxIGBxdWVzdGlvbmAgdG9vbCBldmVudHMsIGFuZFxuICAgIC8vIHBlcm1pc3Npb25zIHN0aWxsIGFycml2ZSBhcyB0aGVpciBvd24gcmVxdWVzdC9yZXNwb25zZSBwYWlyLlxuICAgIHVuc3Vicy5wdXNoKGNvbnRleHQuZGF0YS5vbihcImZvcm0uY3JlYXRlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgICAgY29uc3QgZm9ybSA9IGV2ZW50LmRhdGEuZm9ybTtcbiAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IGlzU3ViYWdlbnQoZm9ybS5zZXNzaW9uSUQpIHx8IHBlbmRpbmdGb3Jtcy5oYXMoZm9ybS5pZCkpIHJldHVybjtcbiAgICAgIHBlbmRpbmdGb3Jtcy5hZGQoZm9ybS5pZCk7XG4gICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChjb250ZXh0LCBcInF1ZXN0aW9uXCIsIGZvcm0udGl0bGUsIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJmb3JtLnJlcGxpZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgcGVuZGluZ0Zvcm1zLmRlbGV0ZShldmVudC5kYXRhLmlkKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwiZm9ybS5jYW5jZWxsZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgcGVuZGluZ0Zvcm1zLmRlbGV0ZShldmVudC5kYXRhLmlkKTtcbiAgICB9KSk7XG4gICAgdW5zdWJzLnB1c2goY29udGV4dC5kYXRhLm9uKFwicGVybWlzc2lvbi5hc2tlZFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoIWF0VGhpc0xvY2F0aW9uKGV2ZW50KSkgcmV0dXJuO1xuICAgICAgY29uc3Qge1xuICAgICAgICBpZCxcbiAgICAgICAgc2Vzc2lvbklELFxuICAgICAgICBhY3Rpb25cbiAgICAgIH0gPSBldmVudC5kYXRhO1xuICAgICAgaWYgKCFub3RpZnlJbnRlcnZpZXcgfHwgaXNTdWJhZ2VudChzZXNzaW9uSUQpIHx8IHBlbmRpbmdQZXJtaXNzaW9ucy5oYXMoaWQpKSByZXR1cm47XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAocGVuZGluZ1Blcm1pc3Npb25zLmRlbGV0ZShpZCkpIHtcbiAgICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChjb250ZXh0LCBcInBlcm1pc3Npb25cIiwgYWN0aW9uLCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgUEVSTUlTU0lPTl9OT1RJRllfREVMQVlfTVMpO1xuICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLnNldChpZCwgdGltZXIpO1xuICAgIH0pKTtcbiAgICB1bnN1YnMucHVzaChjb250ZXh0LmRhdGEub24oXCJwZXJtaXNzaW9uLnJlcGxpZWRcIiwgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSBwZW5kaW5nUGVybWlzc2lvbnMuZ2V0KGV2ZW50LmRhdGEucmVxdWVzdElEKTtcbiAgICAgIGlmICghdGltZXIpIHJldHVybjtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICBwZW5kaW5nUGVybWlzc2lvbnMuZGVsZXRlKGV2ZW50LmRhdGEucmVxdWVzdElEKTtcbiAgICB9KSk7XG4gICAgY29udGV4dC51aS5zbG90KHtcbiAgICAgIC8vIEZpcnN0IGluIHRoZSBzaWRlYmFyOiBhIGxpdmUgc3RhdHVzIHNlY3Rpb24gbXVzdCBzdGF5IHZpc2libGUgd2hlbiB0aGVcbiAgICAgIC8vIGJ1aWx0LWluIENvbnRleHQvTUNQL1RvZG8gYmxvY2tzIGZpbGwgdGhlIGNvbHVtbi5cbiAgICAgIHByZXBlbmQ6IFwic2lkZWJhci5jb250ZW50XCIsXG4gICAgICByZW5kZXI6IHNsb3QgPT4gXyRjcmVhdGVDb21wb25lbnQoU2lkZWJhciwge1xuICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICBnZXQgc2Vzc2lvbklEKCkge1xuICAgICAgICAgIHJldHVybiBzbG90LnNlc3Npb25JRDtcbiAgICAgICAgfSxcbiAgICAgICAgcmV0cnlpbmc6IHJldHJ5aW5nLFxuICAgICAgICBzZWVuOiBzZWVuLFxuICAgICAgICBtYXJrU2VlbjogbWFya1NlZW4sXG4gICAgICAgIGZvY3VzRGlhZzogZm9jdXNEaWFnLFxuICAgICAgICBzaG93Rm9jdXM6IHNob3dGb2N1cyxcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRleHQucmVuZGVyZXIub2ZmKFwiZm9jdXNcIiwgb25Gb2N1cyk7XG4gICAgICBjb250ZXh0LnJlbmRlcmVyLm9mZihcImJsdXJcIiwgb25CbHVyKTtcbiAgICAgIGZvciAoY29uc3QgdGltZXIgb2YgcGVuZGluZ1Blcm1pc3Npb25zLnZhbHVlcygpKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLmNsZWFyKCk7XG4gICAgICB1bnN1YnMucmV2ZXJzZSgpLmZvckVhY2godW5zdWJzY3JpYmUgPT4gdW5zdWJzY3JpYmUoKSk7XG4gICAgfTtcbiAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBwbHVnaW47IiwiLyoqXHJcbiAqIEludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBmb3Igb3BlbmNvZGUtYWdlbnQtcHVsc2UuXHJcbiAqXHJcbiAqIFN1cHBvcnRlZCBsb2NhbGVzOiBFbmdsaXNoIChcImVuXCIsIGRlZmF1bHQpIGFuZCBTaW1wbGlmaWVkIENoaW5lc2UgKFwiemhcIikuXHJcbiAqIFRoZSBsb2NhbGUgaXMgc2VsZWN0ZWQgdmlhIHRoZSBwbHVnaW4gYGxvY2FsZWAgb3B0aW9uICh0dXBsZSBmb3JtKTpcclxuICpcclxuICogICBbXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCB7IFwibG9jYWxlXCI6IFwiemhcIiB9XVxyXG4gKlxyXG4gKiBPbmx5IHVzZXItZmFjaW5nIHN0cmluZ3MgKG5vdGlmaWNhdGlvbiBtZXNzYWdlcyBhbmQgdGhlIHNpZGViYXIgc2VjdGlvbiB0aXRsZSlcclxuICogYXJlIGxvY2FsaXplZDsgaW50ZXJuYWwgc3RhdHVzIGxhYmVscyAoXCJidXN5XCIvXCJpZGxlXCIvXCJyZXRyeVwiL1wiZG9uZVwiKSByZW1haW5cclxuICogRW5nbGlzaCBhcyBzdGFibGUgaWRlbnRpZmllcnMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgTG9jYWxlID0gXCJlblwiIHwgXCJ6aFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlcyB7XHJcbiAgLyoqIFNpZGViYXIgc2VjdGlvbiB0aXRsZS4gKi9cclxuICBzdWJhZ2VudHM6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gYSBiYXRjaCBvZiBzdWJhZ2VudHMgZmluaXNoZXMuICovXHJcbiAgc3ViYWdlbnRzRG9uZTogKGNvdW50OiBudW1iZXIpID0+IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBmaW5pc2hlcyBhIHR1cm4uICovXHJcbiAgdHVybkRvbmU6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBuZWVkcyBhIHBlcm1pc3Npb24gYXBwcm92YWwuICovXHJcbiAgcGVybWlzc2lvblJlcXVpcmVkOiAoZGV0YWlsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIHRoZSBtYWluIHNlc3Npb24gbmVlZHMgYW4gYW5zd2VyIHRvIGEgcXVlc3Rpb24uICovXHJcbiAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBkaWN0aW9uYXJpZXM6IFJlY29yZDxMb2NhbGUsIE1lc3NhZ2VzPiA9IHtcclxuICBlbjoge1xyXG4gICAgc3ViYWdlbnRzOiBcIlN1YmFnZW50c1wiLFxyXG4gICAgc3ViYWdlbnRzRG9uZTogKGNvdW50KSA9PlxyXG4gICAgICBjb3VudCA+IDEgPyBgQWxsICR7Y291bnR9IHN1YmFnZW50cyBjb21wbGV0ZWRgIDogXCJTdWJhZ2VudCBjb21wbGV0ZWRcIixcclxuICAgIHR1cm5Eb25lOiBcIlR1cm4gY29tcGxldGVkXCIsXHJcbiAgICBwZXJtaXNzaW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGBQZXJtaXNzaW9uIHJlcXVpcmVkOiAke2RldGFpbH1gIDogXCJNYWluIHNlc3Npb24gcmVxdWlyZXMgcGVybWlzc2lvblwiLFxyXG4gICAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYEFuc3dlciByZXF1aXJlZDogJHtkZXRhaWx9YCA6IFwiTWFpbiBzZXNzaW9uIHJlcXVpcmVzIGFuIGFuc3dlclwiLFxyXG4gIH0sXHJcbiAgemg6IHtcclxuICAgIHN1YmFnZW50czogXCLlrZAgYWdlbnRcIixcclxuICAgIHN1YmFnZW50c0RvbmU6IChjb3VudCkgPT5cclxuICAgICAgY291bnQgPiAxID8gYOWFqOmDqCAke2NvdW50fSDkuKrlrZAgYWdlbnQg5bey5a6M5oiQYCA6IFwi5a2QIGFnZW50IOW3suWujOaIkFwiLFxyXG4gICAgdHVybkRvbmU6IFwi5pys6L2u5a+56K+d5bey5a6M5oiQXCIsXHJcbiAgICBwZXJtaXNzaW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGDpnIDopoHmnYPpmZDnoa7orqQ6ICR7ZGV0YWlsfWAgOiBcIuS4u+S8muivnemcgOimgeadg+mZkOehruiupFwiLFxyXG4gICAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYOmcgOimgeWbnuetlDogJHtkZXRhaWx9YCA6IFwi5Li75Lya6K+d6ZyA6KaB5Zue562U6K+i6ZeuXCIsXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKiBOb3JtYWxpemUgYW4gYXJiaXRyYXJ5IG9wdGlvbiB2YWx1ZSBpbnRvIGEgc3VwcG9ydGVkIGxvY2FsZSAoZGVmYXVsdHMgdG8gXCJlblwiKS4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVMb2NhbGUoaW5wdXQ6IHVua25vd24pOiBMb2NhbGUge1xyXG4gIGlmIChpbnB1dCA9PT0gXCJ6aFwiIHx8IGlucHV0ID09PSBcInpoLUNOXCIgfHwgaW5wdXQgPT09IFwiemhfQ05cIiB8fCBpbnB1dCA9PT0gXCJ6aC1IYW5zXCIpIHtcclxuICAgIHJldHVybiBcInpoXCI7XHJcbiAgfVxyXG4gIHJldHVybiBcImVuXCI7XHJcbn1cclxuXHJcbi8qKiBHZXQgdGhlIG1lc3NhZ2UgZGljdGlvbmFyeSBmb3IgYSBsb2NhbGUgKGZhbGxzIGJhY2sgdG8gRW5nbGlzaCkuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0KGxvY2FsZTogTG9jYWxlKTogTWVzc2FnZXMge1xyXG4gIHJldHVybiBkaWN0aW9uYXJpZXNbbG9jYWxlXSA/PyBkaWN0aW9uYXJpZXMuZW47XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBBdHRlbnRpb25Tb3VuZCwgQ29udGV4dCB9IGZyb20gXCJAb3BlbmNvZGUvcGx1Z2luL3R1aS9jb250ZXh0XCI7XG5pbXBvcnQgdHlwZSB7IExvY2FsZSB9IGZyb20gXCIuL2kxOG5cIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi9pMThuXCI7XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGRpc3BhdGNoIGZvciBvcGVuY29kZS1hZ2VudC1wdWxzZS5cbiAqXG4gKiBPbmUgaG9zdCBjaGFubmVsIHBsdXMgYSBXaW5kb3dzIGZhbGxiYWNrOlxuICpcbiAqICAgLSBFdmVyeSBwbGF0Zm9ybSBjYWxscyBgY29udGV4dC5hdHRlbnRpb24ubm90aWZ5KClgIGZpcnN0LCBzbyB0aGUgaG9zdCdzIGF0dGVudGlvblxuICogICAgIGVuYWJsZS9kaXNhYmxlIHBvbGljeSBhbmQgc291bmQgY29uZmlndXJhdGlvbiBhcHBseS4gbWFjT1MgaVRlcm0yL0dob3N0dHkgYW5kXG4gKiAgICAgTGludXgga2l0dHkvZm9vdCBpbXBsZW1lbnQgdGhlIE9TQyA5Lzk5IHByb3RvY29sIHVzZWQgZm9yIHN5c3RlbSBub3RpZmljYXRpb25zLlxuICogICAtIFdpbmRvd3MgVGVybWluYWwgZG9lcyBOT1QgaW1wbGVtZW50IE9TQyA5OSArIERFQyAxMDA0IChrbm93biBpc3N1ZSAjMzUwNTUpLCBzbyB0aGVcbiAqICAgICBob3N0IHJlcG9ydHMgYG5vdGlmaWNhdGlvbjogZmFsc2VgIHdoaWxlIHN0aWxsIHBsYXlpbmcgdGhlIHNvdW5kLiBJbiB0aGF0IGNhc2Ugd2VcbiAqICAgICBwb3N0IGEgcmVhbCBBY3Rpb24gQ2VudGVyIHRvYXN0IHRocm91Z2ggYG5vZGUtbm90aWZpZXJgIChidW5kbGVkIFNub3JlVG9hc3QuZXhlKS5cbiAqICAgICBJZiBhdHRlbnRpb24gaXMgZ2xvYmFsbHkgZGlzYWJsZWQgd2Ugc2tpcCB0aGUgZmFsbGJhY2sgdG9vLlxuICpcbiAqIEFsbCBmdW5jdGlvbnMgYXJlIGJlc3QtZWZmb3J0OiBmYWlsdXJlcyBhcmUgc3dhbGxvd2VkIHNvIGEgbm90aWZpY2F0aW9uIHByb2JsZW0gbmV2ZXJcbiAqIGJyZWFrcyB0aGUgcGx1Z2luLlxuICovXG5cbnR5cGUgQXBpID0gUGljazxDb250ZXh0LCBcImF0dGVudGlvblwiIHwgXCJ1aVwiPjtcblxuY29uc3QgSVNfV0lORE9XUyA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuLy8gQXBwVXNlck1vZGVsSUQgdXNlZCBmb3IgdGhlIFdpbmRvd3MgdG9hc3QuIG5vZGUtbm90aWZpZXIgcmVxdWlyZXMgYW4gQVVNSUQgZm9yXG4vLyBBY3Rpb24gQ2VudGVyIHRvYXN0cyB0byBncm91cCBwcm9wZXJseSBhbmQgc2hvdyBhIGZyaWVuZGx5IGFwcCBuYW1lLlxuY29uc3QgV0lORE9XU19BUFBfSUQgPSBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCI7XG5cbi8vIE9wZW5Db2RlIGxvZ28gYXMgYSBQTkcgKHByZS1yZW5kZXJlZCBmcm9tIHRoZSBTVkcgaW4gc2NyaXB0cy9nZW4taWNvbi50cyBhdCAyNTZ4MzIwKSxcbi8vIGVuY29kZWQgYXMgYmFzZTY0LiBQYXNzZWQgdG8gbm9kZS1ub3RpZmllcidzIGBpY29uYCBmaWVsZCBzbyB0aGUgV2luZG93cyBBY3Rpb24gQ2VudGVyXG4vLyB0b2FzdCBzaG93cyB0aGUgT3BlbkNvZGUgbG9nbyBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IGljb24uIEJlY2F1c2Ugbm9kZS1ub3RpZmllcidzXG4vLyBXaW5kb3dzIGJyYW5jaCBleHBlY3RzIGEgZmlsZSBwYXRoIChub3QgYSBkYXRhIFVSTCksIHdlIGRlY29kZSB0aGlzIHRvIGEgdGVtcCBmaWxlIGF0XG4vLyBkaXNwYXRjaCB0aW1lIChzZWUgd2luZG93c05vdGlmeSkuXG5jb25zdCBPUEVOQ09ERV9JQ09OX1BOR19CNjQgPVxuICBcImlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFRQUFBQUZBQ0FZQUFBQlRLcUlLQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUtaMGxFXCIgK1xuICBcIlFWUjRuTzNkTVc0a1FReEQwVGxKQWJ6L0VleTd5WkZqTzVNQVBnSEtGMjN5YjA5MWlmcmt2ZEdlQVEyOHltZncyZjRIYU0rQUJoNEFFQUVRXCIgK1xuICBcIjBNRHpCa0FFUUVBRHowOEFJZ0FDR25qT0FJZ0FDR2pnT1FRa0FpQ2dnZWNyQUJFQUFRMDhud0dKQUFobzRMa0hRQVJBUUFQUFJTQWlBQUlhXCIgK1xuICBcImVHNENFZ0VRME1CekZaZ0lnSUFHbmxrQUlnQUNHbmlHZ1lnQUNHamdtUVlrQWlDZ2dXY2NtQWlBSUo2QlBBQWlBSUlVUHdPQklBZitDTm96XCIgK1xuICBcIkNBQVFBUkRRUUx3QkVBRVEwRUQ4QkNBQ0lLQ0JPQU1nQWlDZ2dUZ0VKQUlnb0lINENrQUVRRUFEOFJtUUNJQ0FCdUllQUJFQUFRM0VSU0FpXCIgK1xuICBcIkFBSWFpSnVBUkFBRU5CQlhnWWtBQ0dnZ1pnR0lBQWhvSUlhQmlBQUlhQ0NtQVlrQUNHZ2d4b0dKQUFoZS9UT1FCMEFFOVNaSXNRWUE0TUFmXCIgK1xuICBcIlFYc0dBUUFpQUFJYWlEY0FJZ0FDR29pZkFFUUFCRFFRWndCRUFBUTBFSWVBUkFBRU5CQmZBWWdBQ0dnZ1BnTVNBUkRRUU53RElBSWdvSUc0XCIgK1xuICBcIkNFUUVRRUFEY1JPUUNJQ0FCdUlxTUJFQUFRM0VMQUFSQUFFTnhEQVFFUUFCRGNRMElCRUFBUTNFT0RBUkFNR3Jmd2J5QUlpZzNnUXAxZ0FBXCIgK1xuICBcIkhQZ2phTThnQUVBRVFFQUQ4UVpBQkVCQUEvRVRnQWlBZ0FiaURJQUlnSUFHNGhDUUNJQ0FCdUlyQUJFQUFRM0VaMEFpQUFJYWlIc0FSQUFFXCIgK1xuICBcIk5CQVhnWWdBQ0dnZ2JnSVNBUkRRUUZ3RkpnSWdvSUdZQmZoakdFSlZWOG9oNFFHbzZzb0JFd0xBSmdGVmRlV0FDUUVBQUJRQXpNcC9nTnNFXCIgK1xuICBcIjJtN082NjRjMEtBM0FBQlFBRERlQUx3QktHOEE0eWVBbndES1Q0QnhCdUFNUURrREdJZUFEZ0dWUThEeEZjQlhBT1Vyd1BnTTZET2c4aGx3XCIgK1xuICBcIjNBTndEMEM1QnpBdUFya0lwRndFR2pjQjNRUlViZ0tPcThDdUFpdFhnY2NzZ0ZrQVpSWmdEQU1aQmxLR2djWTBvR2xBWlJwd2pBTWJCMWJHXCIgK1xuICBcImdVY2VnRHlBK3NxQm1YeDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBXCIgK1xuICBcImxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBXCIgK1xuICBcImxEeUFrUWNnRDZDK2NtQW1YeDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBXCIgK1xuICBcIlBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBXCIgK1xuICBcIlBBQWxEMkRrQWNnRHFLOGNtTW1YQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQThnQ1VQSUNSXCIgK1xuICBcIkJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0Evd0RCOTllWExuNEdPWEFmM3l6QTRrUFlGcUFHXCIgK1xuICBcImdHek93bXdUYUxzWnNCdENPYUJCQUFDQWRTTzBkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wXCIgK1xuICBcImRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuXCIgK1xuICBcImdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZXCIgK1xuICBcIkVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCXCIgK1xuICBcIkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMDlyWUJ0OXQyXCIgK1xuICBcIjRBTWkxQUFRQU5naElQTjFBeWdIL2hmMkJ1QW53TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBXCIgK1xuICBcIndMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzXCIgK1xuICBcIkc2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SXCIgK1xuICBcIldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxXCIgK1xuICBcImM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIXCIgK1xuICBcIlRBZ0FBTEJ1aE5iZU51QjJmN2IvQWR1OUxVQU5BQUVBQUFBQ2J3RHhCdUFOQUFqOEJJaWZBSDRDQUlFemdEZ0RjQVlBQkE0QjR4RFFJU0FRXCIgK1xuICBcIitBb1FYd0Y4QlFBQ253SGpNNkRQZ0VEZ0hrRGNBM0FQQUFoY0JJcUxRQzRDQVlHYmdIRVQwRTFBSUhBVk9LNEN1d29NQkdZQlloYkFMQUFRXCIgK1xuICBcIkdBYUtZU0REUUVCZ0dqQ21BVTBEQW9GeDRCZ0hOZzRNQlBJQTVBSElBNmdIUVE1a1VzZ0RrQWRRYjBTSlFFOGVnRVFnSUJBSjl1UUJpQVFEXCIgK1xuICBcIkFwbUFUeDZBVEVBZ0VBcjY1QUVJQlFVQ3FjQlBIb0JVWUNBUUMvN2tBWWdGQndKN0FaNDhBSHNCZ01CaWtDY1B3R0lRSUxBWjZNa0RzQmtJXCIgK1xuICBcIkNLd0dlL0lBckFZREFyc0JuendBdXdHQndITFFKdy9BY2xBZ3NCMzR5UU93SFJnSXJBZC84Z0NzQndlQ1h4RGt3RWl1Y1dEandNYUJyUWNmXCIgK1xuICBcIjY4R3RCd2NDNjhISGVuRHJ3WUhBZXZDeEh0eDZjQ0N3SG55c0I3Y2VIQWlzQngvcndhMEhCd0xyd2NkNmNPdkJnY0I2OExFZTNIcHdJTEFlXCIgK1xuICBcImZLd0h0eDRjQ0t3SEgrdkJyUWNIQXV2QngzcHc2OEdCd0hyd3NSN2NlbkFnc0I1OHJBZTNIaHdJckFjZjY4R3RCd2NDNjhISGVuRHJ3WUhBXCIgK1xuICBcIk9QQllEMjQ5ZUQwSWNtQW1YeDZBUElCNkk4b0RlUElBNUFFQWdUeUFKdzlBSGdBUXlBTjQ4Z0RrQVFDQlBJQW5EMEFlQUJESUEzanlBT1FCXCIgK1xuICBcIkFJRThnQ2NQUUI0QUVNZ0RlUElBNUFFQWdUeUFKdzlBSGdBUXlBTjQ4Z0RrQVFDQlBJQW5EMEFlQUJESUEzanlBT1FCQUlFOGdDY1BRQjRBXCIgK1xuICBcIkVNZ0RlUElBNUFFQWdUeUFKdzlBSGdBUXlBTjQ4Z0RrQVFCQkRzemt5d000OENDMFo1RENaL0RaL2dkb3o0QUdIZ0FRQVJEUXdQTUdRQVJBXCIgK1xuICBcIlFBUFBUd0FpQUFJYWVNNEFpQUFJYU9BNUJDUUNJS0NCNXlzQUVRQUJEVHlmQVlrQUNHamd1UWRBQkVCQUE4OUZJQ0lBQWhwNGJnSVNBUkRRXCIgK1xuICBcIndITVZtQWlBZ0FhZVdRQWlBQUlhZUlhQmlBQUlhT0NaQmlRQ0lLQ0JaeHlZQ0lBZ25vRThBQ0lBZ2hRL0E0RWdCLzRJMmpNSUFCQUJFTkJBXCIgK1xuICBcInZBRVFBUkRRUVB3RUlBSWdvSUU0QXlBQ0lLQ0JPQVFrQWlDZ2dmZ0tRQVJBUUFQeEdaQUlnSUFHNGg0QUVRQUJEY1JGSUNJQUFocUltNEJFXCIgK1xuICBcIkFBUTBFRmVCaVFBSWFDQm1BWWdBQ0dnZ2hvR0lBQWhvSUtZQmlRQUlhQ0RHZ1lrQUNGNzlNNUFIUUFUMUpraXhCZ0Rnd0I5QmV3WUJBQ0lBXCIgK1xuICBcIkFocUlOd0FpQUFJYWlKOEFSQUFFTkJCbkFFUUFCRFFRaDRCRUFBUTBFRjhCaUFBSWFDQStBeElCRU5CQTNBTWdBaUNnZ2JnSVJBUkFRQU54XCIgK1xuICBcIkU1QUlnSUFHNGlvd0VRQUJEY1FzQUJFQUFRM0VNQkFSQUFFTnhEUWdFUUFCRGNRNE1CRUF3YXQvQnZJQWlLRGVCQ25XQUFBYytDTm96eUFBXCIgK1xuICBcIlFBUkFRQVB4QmtBRVFFQUQ4Uk9BQ0lDQUJ1SU1nQWlBZ0FiaUVKQUlnSUFHNGlzQUVRQUJEY1JuUUNJQUFocUlld0JFQUFRMEVCZUJpQUFJXCIgK1xuICBcImFDQnVBaElCRU5CQVhBVW1BaUNnZ2Z6eERINEExdG5keGJMeXdkMEFBQUFBU1VWT1JLNUNZSUk9XCI7XG5cbmludGVyZmFjZSBOb3RpZnlQYXlsb2FkIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xuICAvKiogU291bmQgdXNlZCBvbiB0aGUgbm9uLVdpbmRvd3MgcGF0aCAoYGFwaS5hdHRlbnRpb24ubm90aWZ5YCkuICovXG4gIHNvdW5kOiBBdHRlbnRpb25Tb3VuZDtcbn1cblxuLyoqXG4gKiBPcHRpb25hbCBmb2N1cyBnYXRlIGFwcGxpZWQgYmVmb3JlIGRpc3BhdGNoaW5nIGEgbm90aWZpY2F0aW9uLiBMZXRzIHRoZSB1c2VyIG9wdCBpbnRvXG4gKiBcIm5vdGlmeSBvbmx5IHdoZW4gdGhlIHRlcm1pbmFsIHdpbmRvdyBpcyB1bmZvY3VzZWRcIiBzbyBub3RpZmljYXRpb25zIGRvbid0IGZpcmUgd2hpbGVcbiAqIHRoZXkgYXJlIGFjdGl2ZWx5IHdhdGNoaW5nIHRoZSBUVUkuXG4gKlxuICogVGhlIGdhdGUgaXMgZXZhbHVhdGVkIG9uIGV2ZXJ5IGRpc3BhdGNoIChub3Qgb25jZSBhdCBzZXR1cCkgYmVjYXVzZSB0aGUgZGVmZXJyZWRcbiAqIHBlcm1pc3Npb24gbm90aWZpY2F0aW9uIGlzIHNlbnQgZnJvbSBhIHRpbWVyIGFuZCB0aGUgY3VycmVudCBmb2N1cyBzdGF0ZSBtdXN0IGJlIHJlYWRcbiAqIGF0IHRoYXQgbW9tZW50LlxuICovXG5leHBvcnQgdHlwZSBOb3RpZnlHYXRlID0ge1xuICAvKiogV2hlbiB0cnVlLCBzdXBwcmVzcyB0aGUgbm90aWZpY2F0aW9uIHdoaWxlIHRoZSB0ZXJtaW5hbCBpcyBmb2N1c2VkLiAqL1xuICBvbmx5V2hlblVuZm9jdXNlZDogYm9vbGVhbjtcbiAgLyoqIEN1cnJlbnQgdGVybWluYWwgZm9jdXMgc3RhdGU7IGB1bmRlZmluZWRgIHdoZW4gdW5rbm93biAoZS5nLiB0aGUgdGVybWluYWwgZG9lcyBub3RcbiAgICogIHJlcG9ydCBmb2N1cyBldmVudHMg4oCUIFdpbmRvd3MgVGVybWluYWwgaXMgYSBrbm93biBjYXNlKS4gVW5rbm93biBmb2N1cyBkZWdyYWRlcyB0b1xuICAgKiAgZGlzcGF0Y2hpbmcgc28gYW4gb3B0ZWQtaW4gbm90aWZpY2F0aW9uIGlzIG5ldmVyIHNpbGVudGx5IGxvc3QuIFJlYWQgbGF6aWx5IG9uIGVhY2hcbiAgICogIGRpc3BhdGNoIGJlY2F1c2UgdGhlIGRlZmVycmVkIHBlcm1pc3Npb24gbm90aWZpY2F0aW9uIGZpcmVzIGZyb20gYSB0aW1lci4gTWF5IGJlXG4gICAqICBhc3luYyAodGhlIFdpbmRvd3MgZmFsbGJhY2sgcXVlcmllcyB0aGUgZm9yZWdyb3VuZCB3aW5kb3cgdmlhIFBvd2VyU2hlbGwpLiAqL1xuICBmb2N1c2VkOiAoKSA9PiBib29sZWFuIHwgdW5kZWZpbmVkIHwgUHJvbWlzZTxib29sZWFuIHwgdW5kZWZpbmVkPjtcbn07XG5cbi8vIERlY29kZSB0aGUgZW1iZWRkZWQgT3BlbkNvZGUgUE5HIG9uY2UgcGVyIHByb2Nlc3MgYW5kIHJldXNlIGl0IGZvciBldmVyeSB0b2FzdC5cbi8vIEEgc3RhYmxlIHBhdGggYWxzbyBhdm9pZHMgbGVha2luZyBvbmUgdGVtcCBmaWxlIHBlciBub3RpZmljYXRpb24gaWYgdGhlXG4vLyBub2RlLW5vdGlmaWVyIGNhbGxiYWNrIG5ldmVyIGZpcmVzLlxubGV0IHdpbmRvd3NJY29uOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQ7XG5mdW5jdGlvbiBlbnN1cmVXaW5kb3dzSWNvbigpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICB3aW5kb3dzSWNvbiA/Pz0gKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyB3cml0ZUZpbGUgfSA9IGF3YWl0IGltcG9ydChcIm5vZGU6ZnMvcHJvbWlzZXNcIik7XG4gICAgICBjb25zdCBvcyA9IGF3YWl0IGltcG9ydChcIm5vZGU6b3NcIik7XG4gICAgICBjb25zdCBwYXRoID0gYXdhaXQgaW1wb3J0KFwibm9kZTpwYXRoXCIpO1xuICAgICAgY29uc3QgaWNvblBhdGggPSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIGBvcGVuY29kZS1wdWxzZS0ke3Byb2Nlc3MucGlkfS5wbmdgKTtcbiAgICAgIGF3YWl0IHdyaXRlRmlsZShpY29uUGF0aCwgQnVmZmVyLmZyb20oT1BFTkNPREVfSUNPTl9QTkdfQjY0LCBcImJhc2U2NFwiKSk7XG4gICAgICByZXR1cm4gaWNvblBhdGg7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBiZXN0LWVmZm9ydDsgZmFsbCBiYWNrIHRvIG5vIGljb24gaWYgdGhlIHRlbXAgZmlsZSBjb3VsZCBub3QgYmUgd3JpdHRlblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0pKCk7XG4gIHJldHVybiB3aW5kb3dzSWNvbjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gd2luZG93c05vdGlmeShwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIG5vZGUtbm90aWZpZXIgaXMgbWFya2VkIGV4dGVybmFsIGluIHRoZSBidWlsZCBzbyBpdCByZXNvbHZlcyBmcm9tXG4gIC8vIG5vZGVfbW9kdWxlcyBhdCBydW50aW1lIHJhdGhlciB0aGFuIGJlaW5nIGJ1bmRsZWQuIE9uIFdpbmRvd3MgaXQgcG9zdHMgYSByZWFsXG4gIC8vIEFjdGlvbiBDZW50ZXIgdG9hc3QgdmlhIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlLiBEeW5hbWljIGltcG9ydCBrZWVwcyB0aGVcbiAgLy8gbW9kdWxlIGxvYWQgZnJvbSBmYWlsaW5nIHRoZSB3aG9sZSBwbHVnaW4gaWYgbm9kZS1ub3RpZmllciBpcyB1bmF2YWlsYWJsZS5cbiAgdHJ5IHtcbiAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoXCJub2RlLW5vdGlmaWVyXCIpO1xuICAgIGNvbnN0IGljb25QYXRoID0gYXdhaXQgZW5zdXJlV2luZG93c0ljb24oKTtcbiAgICBjb25zdCBub3RpZmllciA9IChtb2QgYXMgeyBkZWZhdWx0PzogdW5rbm93biB9KS5kZWZhdWx0ID8/IG1vZDtcbiAgICAobm90aWZpZXIgYXMgeyBub3RpZnk6IChvcHRzOiB1bmtub3duLCBjYjogKGVycjogRXJyb3IgfCBudWxsLCByZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkKSA9PiB2b2lkIH0pLm5vdGlmeShcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICAgIG1lc3NhZ2U6IHBheWxvYWQubWVzc2FnZSxcbiAgICAgICAgYXBwSUQ6IFdJTkRPV1NfQVBQX0lELFxuICAgICAgICAuLi4oaWNvblBhdGggPyB7IGljb246IGljb25QYXRoIH0gOiB7fSksXG4gICAgICAgIC8vIFRoZSBob3N0IGF0dGVudGlvbiBjaGFubmVsIGFscmVhZHkgcGxheXMgdGhlIGNvbmZpZ3VyZWQgc291bmQ7IHRoZVxuICAgICAgICAvLyBXaW5kb3dzIGZhbGxiYWNrIG9ubHkgbmVlZHMgdG8gc3VwcGx5IHRoZSBtaXNzaW5nIHN5c3RlbSB0b2FzdC5cbiAgICAgICAgc291bmQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgICgpID0+IHt9LFxuICAgICk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIGJlc3QtZWZmb3J0OyBhIGZhaWxlZCB0b2FzdCBtdXN0IG5ldmVyIGJyZWFrIHRoZSBwbHVnaW5cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBidWlsdGluTm90aWZ5KGFwaTogQXBpLCBwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGFwaS5hdHRlbnRpb24ubm90aWZ5KHtcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgbWVzc2FnZTogcGF5bG9hZC5tZXNzYWdlLFxuICAgICAgbm90aWZpY2F0aW9uOiB7IHdoZW46IFwiYWx3YXlzXCIgfSxcbiAgICAgIHNvdW5kOiBwYXlsb2FkLnNvdW5kLFxuICAgIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBiZXN0LWVmZm9ydDsgYSBmYWlsZWQgbm90aWZpY2F0aW9uIG11c3QgbmV2ZXIgYnJlYWsgdGhlIHBsdWdpblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2goYXBpOiBBcGksIHBheWxvYWQ6IE5vdGlmeVBheWxvYWQsIGdhdGU/OiBOb3RpZnlHYXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChnYXRlPy5vbmx5V2hlblVuZm9jdXNlZCAmJiAoYXdhaXQgZ2F0ZS5mb2N1c2VkKCkpID09PSB0cnVlKSB7XG4gICAgLy8gVGVybWluYWwgaXMgZm9jdXNlZCAtPiB0aGUgdXNlciBpcyB3YXRjaGluZywgc3VwcHJlc3MgdGhlIG5vdGlmaWNhdGlvbi5cbiAgICAvLyBVbmtub3duIGZvY3VzIChubyBmb2N1cyBldmVudHMsIGUuZy4gV2luZG93cyBUZXJtaW5hbCkgc3RpbGwgZGlzcGF0Y2hlcy5cbiAgICByZXR1cm47XG4gIH1cbiAgLy8gTGV0IHRoZSBob3N0IGFwcGx5IGl0cyBhdHRlbnRpb24gcG9saWN5IChlbmFibGVkL2Rpc2FibGVkLCBzb3VuZCwgZm9jdXMpXG4gIC8vIGV2ZXJ5d2hlcmUsIGluY2x1ZGluZyBXaW5kb3dzLiBPbiBXaW5kb3dzIHRoZSBub3RpZmljYXRpb24gY2hhbm5lbCBpc1xuICAvLyBzaWxlbnRseSBkcm9wcGVkIGJ5IHVuc3VwcG9ydGVkIHRlcm1pbmFscywgc28gZmFsbCBiYWNrIHRvIGEgcmVhbCB0b2FzdC5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYnVpbHRpbk5vdGlmeShhcGksIHBheWxvYWQpO1xuICBpZiAoXG4gICAgSVNfV0lORE9XUyAmJlxuICAgIHJlc3VsdCAmJlxuICAgIHJlc3VsdC5ub3RpZmljYXRpb24gPT09IGZhbHNlICYmXG4gICAgcmVzdWx0LnNraXBwZWQgIT09IFwiYXR0ZW50aW9uX2Rpc2FibGVkXCJcbiAgKSB7XG4gICAgYXdhaXQgd2luZG93c05vdGlmeShwYXlsb2FkKTtcbiAgfVxufVxuXG4vKiogTm90aWZ5IHRoYXQgYSBiYXRjaCBvZiBzdWJhZ2VudHMgZmluaXNoZWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5U3ViYWdlbnRzRG9uZShcbiAgYXBpOiBBcGksXG4gIGNvdW50OiBudW1iZXIsXG4gIGdhdGU/OiBOb3RpZnlHYXRlLFxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcbik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6IHQobG9jYWxlKS5zdWJhZ2VudHNEb25lKGNvdW50KSxcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwic3ViYWdlbnRfZG9uZVwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogTm90aWZ5IHRoYXQgdGhlIGN1cnJlbnQgdHVybiAobWFpbi1hZ2VudCByb3VuZCkgaGFzIGZpbmlzaGVkLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeVR1cm5Eb25lKGFwaTogQXBpLCBnYXRlPzogTm90aWZ5R2F0ZSwgbG9jYWxlOiBMb2NhbGUgPSBcImVuXCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgZGlzcGF0Y2goXG4gICAgYXBpLFxuICAgIHtcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXG4gICAgICBtZXNzYWdlOiB0KGxvY2FsZSkudHVybkRvbmUsXG4gICAgICBzb3VuZDogeyBuYW1lOiBcImRvbmVcIiB9LFxuICAgIH0sXG4gICAgZ2F0ZSxcbiAgKTtcbn1cblxuLyoqIFdoYXQga2luZCBvZiB1c2VyIGludGVyYWN0aW9uIGlzIGJsb2NraW5nIHRoZSBtYWluIHNlc3Npb24uICovXG5leHBvcnQgdHlwZSBJbnRlcnZpZXdLaW5kID0gXCJxdWVzdGlvblwiIHwgXCJwZXJtaXNzaW9uXCI7XG5cbi8qKlxuICogTm90aWZ5IHRoYXQgdGhlIG1haW4gc2Vzc2lvbiBpcyBibG9ja2VkIHdhaXRpbmcgZm9yIHVzZXIgaW5wdXQgKGFuIGludGVydmlldzpcbiAqIHRoZSBgcXVlc3Rpb25gIHRvb2wgYXNraW5nIHRoZSB1c2VyIHNvbWV0aGluZywgb3IgYSBwZXJtaXNzaW9uL2FwcHJvdmFsIHByb21wdCkuXG4gKiBUaGVzZSBhcmUgdGhlIHR3byB3YXlzIGFuIGFnZW50IHR1cm4gaXMgc3VzcGVuZGVkIG1pZC1ydW4gb24gdXNlciBpbnRlcmFjdGlvbi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeUludGVydmlld0lucHV0KFxuICBhcGk6IEFwaSxcbiAga2luZDogSW50ZXJ2aWV3S2luZCxcbiAgZGV0YWlsPzogc3RyaW5nLFxuICBnYXRlPzogTm90aWZ5R2F0ZSxcbiAgbG9jYWxlOiBMb2NhbGUgPSBcImVuXCIsXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWVzc2FnZXMgPSB0KGxvY2FsZSk7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTpcbiAgICAgICAga2luZCA9PT0gXCJwZXJtaXNzaW9uXCJcbiAgICAgICAgICA/IG1lc3NhZ2VzLnBlcm1pc3Npb25SZXF1aXJlZChkZXRhaWwpXG4gICAgICAgICAgOiBtZXNzYWdlcy5xdWVzdGlvblJlcXVpcmVkKGRldGFpbCksXG4gICAgICBzb3VuZDoga2luZCA9PT0gXCJwZXJtaXNzaW9uXCIgPyB7IG5hbWU6IFwicGVybWlzc2lvblwiIH0gOiB7IG5hbWU6IFwicXVlc3Rpb25cIiB9LFxuICAgIH0sXG4gICAgZ2F0ZSxcbiAgKTtcbn1cblxuLyoqIEluLWFwcCB0b2FzdCBmYWxsYmFjayAod29ya3Mgb24gZXZlcnkgcGxhdGZvcm0pLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvYXN0KGFwaTogQXBpLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgdHJ5IHtcbiAgICBhcGkudWkudG9hc3Quc2hvdyh7IHZhcmlhbnQ6IFwiaW5mb1wiLCB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCBtZXNzYWdlIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBiZXN0LWVmZm9ydFxuICB9XG59XG5cbi8qKiBUcnVlIHdoZW4gcnVubmluZyBvbiBXaW5kb3dzICh1c2VkIHRvIGRlY2lkZSB0aGUgZGVsaXZlcnkgcGF0aCkuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaW5kb3dzKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gSVNfV0lORE9XUztcbn1cbiIsIi8qKlxuICogV2luZG93cy1vbmx5IGxpdmUgdGVybWluYWwgZm9jdXMgZGV0ZWN0aW9uLlxuICpcbiAqIEJhY2tncm91bmQ6IG9uIFdpbmRvd3MgdGhlIHJlbmRlcmVyJ3MgZm9jdXMvYmx1ciBldmVudHMgKERFQyAxMDA0IGZvY3VzIHJlcG9ydGluZyB2aWFcbiAqIENvblBUWSkgYXJlIHVucmVsaWFibGUg4oCUIHRoZSBmb2N1cy1pbiBzZXF1ZW5jZSBtYXkgYXJyaXZlIGF0IHN0YXJ0dXAgd2hpbGUgdGhlXG4gKiBmb2N1cy1vdXQgbmV2ZXIgZG9lcywgd2hpY2ggbGVhdmVzIHRoZSBwbHVnaW4gc3R1Y2sgYmVsaWV2aW5nIHRoZSB0ZXJtaW5hbCBpcyBmb2N1c2VkXG4gKiBhbmQgc3VwcHJlc3NpbmcgZXZlcnkgbm90aWZpY2F0aW9uLiBXZSB0aGVyZWZvcmUgYnlwYXNzIHRoZSBldmVudCBzdHJlYW0gb24gV2luZG93c1xuICogYW5kIHF1ZXJ5IHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyBkaXJlY3RseTpcbiAqXG4gKiAgIC0gVGhlIHdpbmRvdyBvZiB0aGUgdGVybWluYWwgaG9zdGluZyB0aGlzIHBsdWdpbiBiZWxvbmdzIHRvIGEgcHJvY2VzcyB0aGF0IGlzIGFuXG4gKiAgICAgYW5jZXN0b3Igb2Ygb3VyIG93biBwcm9jZXNzIChlLmcuIFdpbmRvd3MgVGVybWluYWwgLT4gc2hlbGwgLT4gb3BlbmNvZGUpLlxuICogICAtIFdoZW4gdGhhdCB0ZXJtaW5hbCBpcyBmb2N1c2VkLCB0aGUgZm9yZWdyb3VuZCB3aW5kb3cncyBvd25pbmcgUElEIGlzIGluIG91clxuICogICAgIGFuY2VzdG9yIGNoYWluLlxuICogICAtIFdoZW4gdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBhcHAsIHRoZSBmb3JlZ3JvdW5kIFBJRCBpcyBub3QgYW4gYW5jZXN0b3IuXG4gKlxuICogVHdvIGJhY2tlbmRzIGFyZSB1c2VkOlxuICogICAtIGBidW46ZmZpYCAoZmFzdCwgc3luY2hyb25vdXMpIHdoZW4gdGhlIHJ1bnRpbWUgc3VwcG9ydHMgaXQg4oCUIHZlcmlmaWVkIHdvcmtpbmcgaW5cbiAqICAgICBzdGFuZGFsb25lIEJ1bi1jb21waWxlZCBiaW5hcmllcy5cbiAqICAgLSBQb3dlclNoZWxsIChgR2V0Rm9yZWdyb3VuZFdpbmRvd2AgLyBgV2luMzJfUHJvY2Vzc2ApIGFzIGEgcG9ydGFibGUgZmFsbGJhY2sgdGhhdFxuICogICAgIHdvcmtzIGluIGFueSBydW50aW1lIChOb2RlIG9yIEJ1bikgc2luY2UgaXQgb25seSBuZWVkcyBgbm9kZTpjaGlsZF9wcm9jZXNzYC5cbiAqXG4gKiBJZiBuZWl0aGVyIGJhY2tlbmQgaXMgYXZhaWxhYmxlIHRoZSBtb2R1bGUgZGVncmFkZXMgdG8gXCJ1bmtub3duXCIgYW5kIHRoZSBjYWxsZXIgZmFsbHNcbiAqIGJhY2sgdG8gdGhlIHJlbmRlcmVyIGV2ZW50IHN0YXRlLlxuICovXG5cbmltcG9ydCB7IHNwYXduIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyA1NjggYnl0ZXMgPSBzaXplb2YoUFJPQ0VTU0VOVFJZMzJXKSBvbiB4NjQgKFVMT05HX1BUUiBmaWVsZCBmb3JjZXMgOC1ieXRlIGFsaWdubWVudCkuXG4vLyBXcm9uZyBkd1NpemUgbWFrZXMgUHJvY2VzczMyRmlyc3RXIGZhaWwgd2l0aCBFUlJPUl9CQURfTEVOR1RILCB3aGljaCB3ZSB0cmVhdCBhc1xuLy8gXCJ1bmtub3duXCIgYW5kIGZhbGwgYmFjayBncmFjZWZ1bGx5LlxuY29uc3QgUFJPQ0VTU0VOVFJZMzJXX1NJWkUgPSA1Njg7XG5jb25zdCBPRkZTRVRfVEgzMl9QUk9DRVNTX0lEID0gODtcbmNvbnN0IE9GRlNFVF9USDMyX1BBUkVOVF9QUk9DRVNTX0lEID0gMzI7XG5cbnR5cGUgQmFja2VuZCA9IFwiZmZpXCIgfCBcInBvd2Vyc2hlbGxcIiB8IFwibm9uZVwiO1xuXG5sZXQgYmFja2VuZDogQmFja2VuZCA9IFwibm9uZVwiO1xubGV0IGFuY2VzdG9ycyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xubGV0IGZmaUZvcmVncm91bmRQaWQ6ICgoKSA9PiBudW1iZXIgfCB1bmRlZmluZWQpIHwgdW5kZWZpbmVkO1xuXG4vLyBMaXZlIHN0YXR1cyBzdXJmYWNlLCByZW5kZXJlZCBpbnRvIHRoZSBzaWRlYmFyIGZvciBkZWJ1Z2dpbmcgdGhlIGZvY3VzIGdhdGUuXG5leHBvcnQgdHlwZSBGb2N1c1N0YXR1cyA9IHtcbiAgYmFja2VuZDogQmFja2VuZDtcbiAgYW5jZXN0b3JDb3VudDogbnVtYmVyO1xuICBsYXN0Rm9yZWdyb3VuZFBpZD86IG51bWJlcjtcbiAgbGFzdFJlc3VsdD86IGJvb2xlYW47XG4gIGxhc3RFcnJvcj86IHN0cmluZztcbn07XG5sZXQgc3RhdHVzOiBGb2N1c1N0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAgfTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGb2N1c1N0YXR1cygpOiBGb2N1c1N0YXR1cyB7XG4gIHJldHVybiBzdGF0dXM7XG59XG5cbmZ1bmN0aW9uIHJ1blBvd2VyU2hlbGwoc2NyaXB0OiBzdHJpbmcsIHRpbWVvdXRNcyA9IDgwMDApOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgb3V0ID0gXCJcIjtcbiAgICBsZXQgY2hpbGQ7XG4gICAgdHJ5IHtcbiAgICAgIGNoaWxkID0gc3Bhd24oXCJwb3dlcnNoZWxsLmV4ZVwiLCBbXCItTm9Qcm9maWxlXCIsIFwiLU5vbkludGVyYWN0aXZlXCIsIFwiLUNvbW1hbmRcIiwgc2NyaXB0XSwge1xuICAgICAgICB3aW5kb3dzSGlkZTogdHJ1ZSxcbiAgICAgICAgc3RkaW86IFtcImlnbm9yZVwiLCBcInBpcGVcIiwgXCJwaXBlXCJdLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2hpbGQua2lsbCgpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICB9LCB0aW1lb3V0TXMpO1xuICAgIGNoaWxkLnN0ZG91dD8ub24oXCJkYXRhXCIsIChjaHVuazogQnVmZmVyKSA9PiB7XG4gICAgICBvdXQgKz0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICB9KTtcbiAgICBjaGlsZC5vbihcImVycm9yXCIsICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgIH0pO1xuICAgIGNoaWxkLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHJlc29sdmUob3V0LnRyaW0oKSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKiogQ29tcHV0ZSBvdXIgYW5jZXN0b3IgUElEIGNoYWluIHZpYSBQb3dlclNoZWxsIChXaW4zMl9Qcm9jZXNzIHBhcmVudCB3YWxrKS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTogUHJvbWlzZTxTZXQ8bnVtYmVyPj4ge1xuICBjb25zdCBzZWxmUGlkID0gcHJvY2Vzcy5waWQ7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAnU2lsZW50bHlDb250aW51ZSdcbiRwaWRDaGFpbiA9IEAoJHtzZWxmUGlkfSlcbiRjdXIgPSAke3NlbGZQaWR9XG5mb3IgKCRpID0gMDsgJGkgLWx0IDMyIC1hbmQgJGN1ciAtZ3QgMDsgJGkrKykge1xuICAkcCA9IEdldC1DaW1JbnN0YW5jZSBXaW4zMl9Qcm9jZXNzIC1GaWx0ZXIgXCJQcm9jZXNzSWQ9JGN1clwiXG4gIGlmICgtbm90ICRwKSB7IGJyZWFrIH1cbiAgJG5leHQgPSAkcC5QYXJlbnRQcm9jZXNzSWRcbiAgaWYgKCRuZXh0IC1lcSAkY3VyIC1vciAkbmV4dCAtbGUgMCkgeyBicmVhayB9XG4gICRjdXIgPSAkbmV4dFxuICAkcGlkQ2hhaW4gKz0gJGN1clxufVxuJHBpZENoYWluIC1qb2luICcsJ1xuYDtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcnVuUG93ZXJTaGVsbChzY3JpcHQpO1xuICBjb25zdCBwaWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gIGZvciAoY29uc3QgcGFydCBvZiByZXN1bHQuc3BsaXQoXCIsXCIpKSB7XG4gICAgY29uc3QgbiA9IHBhcnNlSW50KHBhcnQsIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSBwaWRzLmFkZChuKTtcbiAgfVxuICByZXR1cm4gcGlkcztcbn1cblxuLyoqIEZvcmVncm91bmQgd2luZG93IG93bmluZyBQSUQgdmlhIFBvd2VyU2hlbGwgKHVzZXIzMiBHZXRGb3JlZ3JvdW5kV2luZG93KS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZvcmVncm91bmRQaWRWaWFQb3dlclNoZWxsKCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbkFkZC1UeXBlIC1UeXBlRGVmaW5pdGlvbiBAJ1xudXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLlJ1bnRpbWUuSW50ZXJvcFNlcnZpY2VzO1xucHVibGljIHN0YXRpYyBjbGFzcyBQdWxzZUZvY3VzIHtcbiAgW0RsbEltcG9ydChcInVzZXIzMi5kbGxcIildXG4gIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEludFB0ciBHZXRGb3JlZ3JvdW5kV2luZG93KCk7XG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxuICBwdWJsaWMgc3RhdGljIGV4dGVybiB1aW50IEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChJbnRQdHIgaFduZCwgb3V0IHVpbnQgbHBkd1Byb2Nlc3NJZCk7XG59XG4nQFxuJGggPSBbUHVsc2VGb2N1c106OkdldEZvcmVncm91bmRXaW5kb3coKVxuJHAgPSBbdWludDMyXTBcblt2b2lkXVtQdWxzZUZvY3VzXTo6R2V0V2luZG93VGhyZWFkUHJvY2Vzc0lkKCRoLCBbcmVmXSRwKVxuJHBcbmA7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJ1blBvd2VyU2hlbGwoc2NyaXB0KTtcbiAgY29uc3QgbiA9IHBhcnNlSW50KHJlc3VsdCwgMTApO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gbiA6IHVuZGVmaW5lZDtcbn1cblxuLyoqIFRyeSB0aGUgZmFzdCBidW46ZmZpIGJhY2tlbmQuIFJldHVybnMgdHJ1ZSB3aGVuIGZ1bGx5IGluaXRpYWxpemVkLiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdEZmaUJhY2tlbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBkbG9wZW4sIHB0ciB9ID0gYXdhaXQgaW1wb3J0KFwiYnVuOmZmaVwiKTtcbiAgICBjb25zdCB1c2VyMzIgPSBkbG9wZW4oXCJ1c2VyMzIuZGxsXCIsIHtcbiAgICAgIEdldEZvcmVncm91bmRXaW5kb3c6IHsgYXJnczogW10sIHJldHVybnM6IFwicHRyXCIgfSxcbiAgICAgIEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZDogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwidTMyXCIgfSxcbiAgICB9KTtcbiAgICBjb25zdCBrZXJuZWwzMiA9IGRsb3BlbihcImtlcm5lbDMyLmRsbFwiLCB7XG4gICAgICBHZXRDdXJyZW50UHJvY2Vzc0lkOiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInUzMlwiIH0sXG4gICAgICBDcmVhdGVUb29saGVscDMyU25hcHNob3Q6IHsgYXJnczogW1widTMyXCIsIFwidTMyXCJdLCByZXR1cm5zOiBcInB0clwiIH0sXG4gICAgICBQcm9jZXNzMzJGaXJzdFc6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXG4gICAgICBQcm9jZXNzMzJOZXh0VzogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcbiAgICAgIENsb3NlSGFuZGxlOiB7IGFyZ3M6IFtcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgVEgzMkNTX1NOQVBQUk9DRVNTID0gMHgyO1xuICAgIGNvbnN0IHNuYXBzaG90ID0ga2VybmVsMzIuc3ltYm9scy5DcmVhdGVUb29saGVscDMyU25hcHNob3QoVEgzMkNTX1NOQVBQUk9DRVNTLCAwKTtcbiAgICBpZiAoIXNuYXBzaG90KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbnRyeSA9IG5ldyBVaW50OEFycmF5KFBST0NFU1NFTlRSWTMyV19TSVpFKTtcbiAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoZW50cnkuYnVmZmVyKTtcbiAgICAgIHZpZXcuc2V0VWludDMyKDAsIFBST0NFU1NFTlRSWTMyV19TSVpFLCB0cnVlKTsgLy8gZHdTaXplXG5cbiAgICAgIGNvbnN0IHBhcmVudCA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgICBsZXQgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMkZpcnN0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XG4gICAgICB3aGlsZSAob2spIHtcbiAgICAgICAgY29uc3QgcGlkID0gdmlldy5nZXRVaW50MzIoT0ZGU0VUX1RIMzJfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IHBwaWQgPSB2aWV3LmdldFVpbnQzMihPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGlmIChwaWQgIT09IDApIHBhcmVudC5zZXQocGlkLCBwcGlkKTtcbiAgICAgICAgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMk5leHRXKHNuYXBzaG90LCBwdHIoZW50cnkpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IGtlcm5lbDMyLnN5bWJvbHMuR2V0Q3VycmVudFByb2Nlc3NJZCgpO1xuICAgICAgbGV0IGN1cnJlbnQgPSBzZWxmO1xuICAgICAgZm9yIChsZXQgZGVwdGggPSAwOyBkZXB0aCA8IDMyICYmIGN1cnJlbnQ7IGRlcHRoKyspIHtcbiAgICAgICAgYW5jZXN0b3JzLmFkZChjdXJyZW50KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXQoY3VycmVudCk7XG4gICAgICAgIGlmIChuZXh0ID09PSB1bmRlZmluZWQgfHwgbmV4dCA9PT0gY3VycmVudCkgYnJlYWs7XG4gICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBrZXJuZWwzMi5zeW1ib2xzLkNsb3NlSGFuZGxlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICBmZmlGb3JlZ3JvdW5kUGlkID0gKCkgPT4ge1xuICAgICAgY29uc3QgaHduZCA9IHVzZXIzMi5zeW1ib2xzLkdldEZvcmVncm91bmRXaW5kb3coKTtcbiAgICAgIGlmICghaHduZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHBpZEJ1ZiA9IG5ldyBVaW50MzJBcnJheSgxKTtcbiAgICAgIHVzZXIzMi5zeW1ib2xzLkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChod25kLCBwdHIocGlkQnVmKSk7XG4gICAgICByZXR1cm4gcGlkQnVmWzBdO1xuICAgIH07XG5cbiAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwiZmZpXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgcmV0dXJuIGFuY2VzdG9ycy5zaXplID4gMDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEVycm9yOiBTdHJpbmcoZXJyb3IpIH07XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmxldCBpbml0UHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVXaW5kb3dzRm9jdXNJbml0KCk6IHZvaWQge1xuICBpZiAoIUlTX1dJTkRPV1MpIHJldHVybjtcbiAgaW5pdFByb21pc2UgPz89IChhc3luYyAoKSA9PiB7XG4gICAgaWYgKGF3YWl0IGluaXRGZmlCYWNrZW5kKCkpIHtcbiAgICAgIGJhY2tlbmQgPSBcImZmaVwiO1xuICAgICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGJhY2tlbmQ6IFwiZmZpXCIgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYW5jZXN0b3JzID0gYXdhaXQgYW5jZXN0b3JzVmlhUG93ZXJTaGVsbCgpO1xuICAgIGlmIChhbmNlc3RvcnMuc2l6ZSA+IDApIHtcbiAgICAgIGJhY2tlbmQgPSBcInBvd2Vyc2hlbGxcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJwb3dlcnNoZWxsXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tlbmQgPSBcIm5vbmVcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAsIGxhc3RFcnJvcjogXCJubyBhbmNlc3RvciBjaGFpblwiIH07XG4gICAgfVxuICB9KSgpO1xuICB2b2lkIGluaXRQcm9taXNlO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGN1cnJlbnRseSBoYXMgZm9jdXMsIGZhbHNlIHdoZW4gdGhlIGZvcmVncm91bmQgd2luZG93XG4gKiBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IHByb2Nlc3MsIHVuZGVmaW5lZCB3aGVuIHRoZSBjaGVjayBpcyB1bmF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzVGVybWluYWxGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbiB8IHVuZGVmaW5lZD4ge1xuICBpZiAoIUlTX1dJTkRPV1MgfHwgYmFja2VuZCA9PT0gXCJub25lXCIpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChiYWNrZW5kID09PSBcImZmaVwiICYmIGZmaUZvcmVncm91bmRQaWQpIHtcbiAgICBjb25zdCBmb3JlZ3JvdW5kID0gZmZpRm9yZWdyb3VuZFBpZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGZvcmVncm91bmQgIT09IHVuZGVmaW5lZCA/IGFuY2VzdG9ycy5oYXMoZm9yZWdyb3VuZCkgOiB1bmRlZmluZWQ7XG4gICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RGb3JlZ3JvdW5kUGlkOiBmb3JlZ3JvdW5kLCBsYXN0UmVzdWx0OiByZXN1bHQgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGNvbnN0IGZvcmVncm91bmQgPSBhd2FpdCBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpO1xuICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xuICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEZvcmVncm91bmRQaWQ6IGZvcmVncm91bmQsIGxhc3RSZXN1bHQ6IHJlc3VsdCB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNEJBQVM7QUFDVCxtQkFBUztBQUNULDJCQUFTO0FBQ1QsdUJBQVM7QUFDVCxtQkFBUztBQUNULGlCQUFTO0FBQ1Qsb0JBQVM7QUFDVCwwQkFBUztBQUNUO0FBQ0E7OztBQ21CQSxJQUFNLGVBQXlDO0FBQUEsRUFDN0MsSUFBSTtBQUFBLElBQ0YsV0FBVztBQUFBLElBQ1gsZUFBZSxDQUFDLFVBQ2QsUUFBUSxJQUFJLE9BQU8sOEJBQThCO0FBQUEsSUFDbkQsVUFBVTtBQUFBLElBQ1Ysb0JBQW9CLENBQUMsV0FDbkIsU0FBUyx3QkFBd0IsV0FBVztBQUFBLElBQzlDLGtCQUFrQixDQUFDLFdBQ2pCLFNBQVMsb0JBQW9CLFdBQVc7QUFBQSxFQUM1QztBQUFBLEVBQ0EsSUFBSTtBQUFBLElBQ0YsV0FBVztBQUFBLElBQ1gsZUFBZSxDQUFDLFVBQ2QsUUFBUSxJQUFJLGdCQUFLLGdEQUF1QjtBQUFBLElBQzFDLFVBQVU7QUFBQSxJQUNWLG9CQUFvQixDQUFDLFdBQ25CLFNBQVMseUNBQVUsV0FBVztBQUFBLElBQ2hDLGtCQUFrQixDQUFDLFdBQ2pCLFNBQVMsNkJBQVEsV0FBVztBQUFBLEVBQ2hDO0FBQ0Y7QUFHTyxTQUFTLGFBQWEsQ0FBQyxPQUF3QjtBQUFBLEVBQ3BELElBQUksVUFBVSxRQUFRLFVBQVUsV0FBVyxVQUFVLFdBQVcsVUFBVSxXQUFXO0FBQUEsSUFDbkYsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUlGLFNBQVMsQ0FBQyxDQUFDLFFBQTBCO0FBQUEsRUFDMUMsT0FBTyxhQUFhLFdBQVcsYUFBYTtBQUFBOzs7QUN0QzlDLElBQU0sYUFBYSxRQUFRLGFBQWE7QUFJeEMsSUFBTSxpQkFBaUI7QUFPdkIsSUFBTSx3QkFDSixxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQTtBQWdDRixJQUFJO0FBQ0osU0FBUyxpQkFBaUIsR0FBZ0M7QUFBQSxFQUN4RCxpQkFBaUIsWUFBWTtBQUFBLElBQzNCLElBQUk7QUFBQSxNQUNGLFFBQVEsY0FBYyxNQUFhO0FBQUEsTUFDbkMsTUFBTSxLQUFLLE1BQWE7QUFBQSxNQUN4QixNQUFNLE9BQU8sTUFBYTtBQUFBLE1BQzFCLE1BQU0sV0FBVyxLQUFLLEtBQUssR0FBRyxPQUFPLEdBQUcsa0JBQWtCLFFBQVEsU0FBUztBQUFBLE1BQzNFLE1BQU0sVUFBVSxVQUFVLE9BQU8sS0FBSyx1QkFBdUIsUUFBUSxDQUFDO0FBQUEsTUFDdEUsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BRU47QUFBQTtBQUFBLEtBRUQ7QUFBQSxFQUNILE9BQU87QUFBQTtBQUdULGVBQWUsYUFBYSxDQUFDLFNBQXVDO0FBQUEsRUFLbEUsSUFBSTtBQUFBLElBQ0YsTUFBTSxNQUFNLE1BQWE7QUFBQSxJQUN6QixNQUFNLFdBQVcsTUFBTSxrQkFBa0I7QUFBQSxJQUN6QyxNQUFNLFdBQVksSUFBOEIsV0FBVztBQUFBLElBQzFELFNBQW9HLE9BQ25HO0FBQUEsTUFDRSxPQUFPLFFBQVE7QUFBQSxNQUNmLFNBQVMsUUFBUTtBQUFBLE1BQ2pCLE9BQU87QUFBQSxTQUNILFdBQVcsRUFBRSxNQUFNLFNBQVMsSUFBSSxDQUFDO0FBQUEsTUFHckMsT0FBTztBQUFBLElBQ1QsR0FDQSxNQUFNLEVBQ1I7QUFBQSxJQUNBLE1BQU07QUFBQTtBQUtWLGVBQWUsYUFBYSxDQUFDLEtBQVUsU0FBd0I7QUFBQSxFQUM3RCxJQUFJO0FBQUEsSUFDRixPQUFPLE1BQU0sSUFBSSxVQUFVLE9BQU87QUFBQSxNQUNoQyxPQUFPLFFBQVE7QUFBQSxNQUNmLFNBQVMsUUFBUTtBQUFBLE1BQ2pCLGNBQWMsRUFBRSxNQUFNLFNBQVM7QUFBQSxNQUMvQixPQUFPLFFBQVE7QUFBQSxJQUNqQixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsSUFFTjtBQUFBO0FBQUE7QUFJSixlQUFlLFFBQVEsQ0FBQyxLQUFVLFNBQXdCLE1BQWtDO0FBQUEsRUFDMUYsSUFBSSxNQUFNLHFCQUFzQixNQUFNLEtBQUssUUFBUSxNQUFPLE1BQU07QUFBQSxJQUc5RDtBQUFBLEVBQ0Y7QUFBQSxFQUlBLE1BQU0sU0FBUyxNQUFNLGNBQWMsS0FBSyxPQUFPO0FBQUEsRUFDL0MsSUFDRSxjQUNBLFVBQ0EsT0FBTyxpQkFBaUIsU0FDeEIsT0FBTyxZQUFZLHNCQUNuQjtBQUFBLElBQ0EsTUFBTSxjQUFjLE9BQU87QUFBQSxFQUM3QjtBQUFBO0FBSUYsZUFBc0IsbUJBQW1CLENBQ3ZDLEtBQ0EsT0FDQSxNQUNBLFNBQWlCLE1BQ0Y7QUFBQSxFQUNmLE1BQU0sU0FDSixLQUNBO0FBQUEsSUFDRSxPQUFPO0FBQUEsSUFDUCxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsS0FBSztBQUFBLElBQ3RDLE9BQU8sRUFBRSxNQUFNLGdCQUFnQjtBQUFBLEVBQ2pDLEdBQ0EsSUFDRjtBQUFBO0FBSUYsZUFBc0IsY0FBYyxDQUFDLEtBQVUsTUFBbUIsU0FBaUIsTUFBcUI7QUFBQSxFQUN0RyxNQUFNLFNBQ0osS0FDQTtBQUFBLElBQ0UsT0FBTztBQUFBLElBQ1AsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUFBLElBQ25CLE9BQU8sRUFBRSxNQUFNLE9BQU87QUFBQSxFQUN4QixHQUNBLElBQ0Y7QUFBQTtBQVdGLGVBQXNCLG9CQUFvQixDQUN4QyxLQUNBLE1BQ0EsUUFDQSxNQUNBLFNBQWlCLE1BQ0Y7QUFBQSxFQUNmLE1BQU0sV0FBVyxFQUFFLE1BQU07QUFBQSxFQUN6QixNQUFNLFNBQ0osS0FDQTtBQUFBLElBQ0UsT0FBTztBQUFBLElBQ1AsU0FDRSxTQUFTLGVBQ0wsU0FBUyxtQkFBbUIsTUFBTSxJQUNsQyxTQUFTLGlCQUFpQixNQUFNO0FBQUEsSUFDdEMsT0FBTyxTQUFTLGVBQWUsRUFBRSxNQUFNLGFBQWEsSUFBSSxFQUFFLE1BQU0sV0FBVztBQUFBLEVBQzdFLEdBQ0EsSUFDRjtBQUFBOzs7QUMvTkY7QUFFQSxJQUFNLGNBQWEsUUFBUSxhQUFhO0FBS3hDLElBQU0sdUJBQXVCO0FBQzdCLElBQU0seUJBQXlCO0FBQy9CLElBQU0sZ0NBQWdDO0FBSXRDLElBQUksVUFBbUI7QUFDdkIsSUFBSSxZQUFZLElBQUk7QUFDcEIsSUFBSTtBQVVKLElBQUksU0FBc0IsRUFBRSxTQUFTLFFBQVEsZUFBZSxFQUFFO0FBQ3ZELFNBQVMsY0FBYyxHQUFnQjtBQUFBLEVBQzVDLE9BQU87QUFBQTtBQUdULFNBQVMsYUFBYSxDQUFDLFFBQWdCLFlBQVksTUFBdUI7QUFBQSxFQUN4RSxPQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFBQSxJQUM5QixJQUFJLE1BQU07QUFBQSxJQUNWLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNGLFFBQVEsTUFBTSxrQkFBa0IsQ0FBQyxjQUFjLG1CQUFtQixZQUFZLE1BQU0sR0FBRztBQUFBLFFBQ3JGLGFBQWE7QUFBQSxRQUNiLE9BQU8sQ0FBQyxVQUFVLFFBQVEsTUFBTTtBQUFBLE1BQ2xDLENBQUM7QUFBQSxNQUNELE1BQU07QUFBQSxNQUNOLFFBQVEsRUFBRTtBQUFBLE1BQ1Y7QUFBQTtBQUFBLElBRUYsTUFBTSxRQUFRLFdBQVcsTUFBTTtBQUFBLE1BQzdCLElBQUk7QUFBQSxRQUNGLE1BQU0sS0FBSztBQUFBLFFBQ1gsTUFBTTtBQUFBLE1BQ1IsUUFBUSxFQUFFO0FBQUEsT0FDVCxTQUFTO0FBQUEsSUFDWixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBa0I7QUFBQSxNQUMxQyxPQUFPLE1BQU0sU0FBUztBQUFBLEtBQ3ZCO0FBQUEsSUFDRCxNQUFNLEdBQUcsU0FBUyxNQUFNO0FBQUEsTUFDdEIsYUFBYSxLQUFLO0FBQUEsTUFDbEIsUUFBUSxFQUFFO0FBQUEsS0FDWDtBQUFBLElBQ0QsTUFBTSxHQUFHLFNBQVMsTUFBTTtBQUFBLE1BQ3RCLGFBQWEsS0FBSztBQUFBLE1BQ2xCLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFBQSxLQUNuQjtBQUFBLEdBQ0Y7QUFBQTtBQUlILGVBQWUsc0JBQXNCLEdBQXlCO0FBQUEsRUFDNUQsTUFBTSxVQUFVLFFBQVE7QUFBQSxFQUN4QixNQUFNLFNBQVM7QUFBQTtBQUFBLGdCQUVEO0FBQUEsU0FDUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFXUCxNQUFNLFNBQVMsTUFBTSxjQUFjLE1BQU07QUFBQSxFQUN6QyxNQUFNLE9BQU8sSUFBSTtBQUFBLEVBQ2pCLFdBQVcsUUFBUSxPQUFPLE1BQU0sR0FBRyxHQUFHO0FBQUEsSUFDcEMsTUFBTSxJQUFJLFNBQVMsTUFBTSxFQUFFO0FBQUEsSUFDM0IsSUFBSSxPQUFPLFNBQVMsQ0FBQyxLQUFLLElBQUk7QUFBQSxNQUFHLEtBQUssSUFBSSxDQUFDO0FBQUEsRUFDN0M7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUlULGVBQWUsMEJBQTBCLEdBQWdDO0FBQUEsRUFDdkUsTUFBTSxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFnQmYsTUFBTSxTQUFTLE1BQU0sY0FBYyxNQUFNO0FBQUEsRUFDekMsTUFBTSxJQUFJLFNBQVMsUUFBUSxFQUFFO0FBQUEsRUFDN0IsT0FBTyxPQUFPLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJO0FBQUE7QUFJM0MsZUFBZSxjQUFjLEdBQXFCO0FBQUEsRUFDaEQsSUFBSTtBQUFBLElBQ0YsUUFBUSxRQUFRLFFBQVEsTUFBYTtBQUFBLElBQ3JDLE1BQU0sU0FBUyxPQUFPLGNBQWM7QUFBQSxNQUNsQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsR0FBRyxTQUFTLE1BQU07QUFBQSxNQUNoRCwwQkFBMEIsRUFBRSxNQUFNLENBQUMsT0FBTyxLQUFLLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDbkUsQ0FBQztBQUFBLElBQ0QsTUFBTSxXQUFXLE9BQU8sZ0JBQWdCO0FBQUEsTUFDdEMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLEdBQUcsU0FBUyxNQUFNO0FBQUEsTUFDaEQsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLE9BQU8sS0FBSyxHQUFHLFNBQVMsTUFBTTtBQUFBLE1BQ2pFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxPQUFPLEtBQUssR0FBRyxTQUFTLE1BQU07QUFBQSxNQUN4RCxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsT0FBTyxLQUFLLEdBQUcsU0FBUyxNQUFNO0FBQUEsTUFDdkQsYUFBYSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDL0MsQ0FBQztBQUFBLElBRUQsTUFBTSxxQkFBcUI7QUFBQSxJQUMzQixNQUFNLFdBQVcsU0FBUyxRQUFRLHlCQUF5QixvQkFBb0IsQ0FBQztBQUFBLElBQ2hGLElBQUksQ0FBQyxVQUFVO0FBQUEsTUFDYixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsTUFBTSxRQUFRLElBQUksV0FBVyxvQkFBb0I7QUFBQSxNQUNqRCxNQUFNLE9BQU8sSUFBSSxTQUFTLE1BQU0sTUFBTTtBQUFBLE1BQ3RDLEtBQUssVUFBVSxHQUFHLHNCQUFzQixJQUFJO0FBQUEsTUFFNUMsTUFBTSxTQUFTLElBQUk7QUFBQSxNQUNuQixJQUFJLEtBQUssU0FBUyxRQUFRLGdCQUFnQixVQUFVLElBQUksS0FBSyxDQUFDO0FBQUEsTUFDOUQsT0FBTyxJQUFJO0FBQUEsUUFDVCxNQUFNLE1BQU0sS0FBSyxVQUFVLHdCQUF3QixJQUFJO0FBQUEsUUFDdkQsTUFBTSxPQUFPLEtBQUssVUFBVSwrQkFBK0IsSUFBSTtBQUFBLFFBQy9ELElBQUksUUFBUTtBQUFBLFVBQUcsT0FBTyxJQUFJLEtBQUssSUFBSTtBQUFBLFFBQ25DLEtBQUssU0FBUyxRQUFRLGVBQWUsVUFBVSxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQzNEO0FBQUEsTUFFQSxNQUFNLE9BQU8sU0FBUyxRQUFRLG9CQUFvQjtBQUFBLE1BQ2xELElBQUksVUFBVTtBQUFBLE1BQ2QsU0FBUyxRQUFRLEVBQUcsUUFBUSxNQUFNLFNBQVMsU0FBUztBQUFBLFFBQ2xELFVBQVUsSUFBSSxPQUFPO0FBQUEsUUFDckIsTUFBTSxPQUFPLE9BQU8sSUFBSSxPQUFPO0FBQUEsUUFDL0IsSUFBSSxTQUFTLGFBQWEsU0FBUztBQUFBLFVBQVM7QUFBQSxRQUM1QyxVQUFVO0FBQUEsTUFDWjtBQUFBLGNBQ0E7QUFBQSxNQUNBLFNBQVMsUUFBUSxZQUFZLFFBQVE7QUFBQTtBQUFBLElBR3ZDLG1CQUFtQixNQUFNO0FBQUEsTUFDdkIsTUFBTSxPQUFPLE9BQU8sUUFBUSxvQkFBb0I7QUFBQSxNQUNoRCxJQUFJLENBQUM7QUFBQSxRQUFNO0FBQUEsTUFDWCxNQUFNLFNBQVMsSUFBSSxZQUFZLENBQUM7QUFBQSxNQUNoQyxPQUFPLFFBQVEseUJBQXlCLE1BQU0sSUFBSSxNQUFNLENBQUM7QUFBQSxNQUN6RCxPQUFPLE9BQU87QUFBQTtBQUFBLElBR2hCLFNBQVMsRUFBRSxTQUFTLE9BQU8sZUFBZSxVQUFVLEtBQUs7QUFBQSxJQUN6RCxPQUFPLFVBQVUsT0FBTztBQUFBLElBQ3hCLE9BQU8sT0FBTztBQUFBLElBQ2QsU0FBUyxLQUFLLFFBQVEsV0FBVyxPQUFPLEtBQUssRUFBRTtBQUFBLElBQy9DLE9BQU87QUFBQTtBQUFBO0FBSVgsSUFBSTtBQUNHLFNBQVMsc0JBQXNCLEdBQVM7QUFBQSxFQUM3QyxJQUFJLENBQUM7QUFBQSxJQUFZO0FBQUEsRUFDakIsaUJBQWlCLFlBQVk7QUFBQSxJQUMzQixJQUFJLE1BQU0sZUFBZSxHQUFHO0FBQUEsTUFDMUIsVUFBVTtBQUFBLE1BQ1YsU0FBUyxLQUFLLFFBQVEsU0FBUyxNQUFNO0FBQUEsTUFDckM7QUFBQSxJQUNGO0FBQUEsSUFDQSxZQUFZLE1BQU0sdUJBQXVCO0FBQUEsSUFDekMsSUFBSSxVQUFVLE9BQU8sR0FBRztBQUFBLE1BQ3RCLFVBQVU7QUFBQSxNQUNWLFNBQVMsRUFBRSxTQUFTLGNBQWMsZUFBZSxVQUFVLEtBQUs7QUFBQSxJQUNsRSxFQUFPO0FBQUEsTUFDTCxVQUFVO0FBQUEsTUFDVixTQUFTLEVBQUUsU0FBUyxRQUFRLGVBQWUsR0FBRyxXQUFXLG9CQUFvQjtBQUFBO0FBQUEsS0FFOUU7QUFBQTtBQVFMLGVBQXNCLGlCQUFpQixHQUFpQztBQUFBLEVBQ3RFLElBQUksQ0FBQyxlQUFjLFlBQVksUUFBUTtBQUFBLElBQ3JDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsSUFBSSxZQUFZLFNBQVMsa0JBQWtCO0FBQUEsSUFDekMsTUFBTSxjQUFhLGlCQUFpQjtBQUFBLElBQ3BDLE1BQU0sVUFBUyxnQkFBZSxZQUFZLFVBQVUsSUFBSSxXQUFVLElBQUk7QUFBQSxJQUN0RSxTQUFTLEtBQUssUUFBUSxtQkFBbUIsYUFBWSxZQUFZLFFBQU87QUFBQSxJQUN4RSxPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsTUFBTSxhQUFhLE1BQU0sMkJBQTJCO0FBQUEsRUFDcEQsTUFBTSxTQUFTLGVBQWUsWUFBWSxVQUFVLElBQUksVUFBVSxJQUFJO0FBQUEsRUFDdEUsU0FBUyxLQUFLLFFBQVEsbUJBQW1CLFlBQVksWUFBWSxPQUFPO0FBQUEsRUFDeEUsT0FBTztBQUFBOzs7QUh2TVQsU0FBUyxjQUFjLENBQUMsV0FBVztBQUFBLEVBQ2pDLE1BQU0sZUFBZSxLQUFLLElBQUksR0FBRyxLQUFLLE1BQU0sWUFBWSxJQUFJLENBQUM7QUFBQSxFQUM3RCxNQUFNLFVBQVUsS0FBSyxNQUFNLGVBQWUsRUFBRTtBQUFBLEVBQzVDLE1BQU0sVUFBVSxlQUFlO0FBQUEsRUFDL0IsT0FBTyxVQUFVLElBQUksR0FBRyxXQUFXLFFBQVEsU0FBUyxFQUFFLFNBQVMsR0FBRyxHQUFHLE9BQU8sR0FBRztBQUFBO0FBRWpGLFNBQVMsUUFBUSxDQUFDLFNBQVMsU0FBUyxVQUFVO0FBQUEsRUFDNUMsSUFBSTtBQUFBLElBQVMsT0FBTyxXQUFXLFVBQVU7QUFBQSxFQUN6QyxJQUFJLFFBQVEsWUFBWTtBQUFBLElBQVUsT0FBTztBQUFBLEVBQ3pDLElBQUksUUFBUSxZQUFZO0FBQUEsSUFBZSxPQUFPO0FBQUEsRUFDOUMsSUFBSSxRQUFRLFlBQVk7QUFBQSxJQUFhLE9BQU87QUFBQSxFQUM1QyxPQUFPO0FBQUE7QUFFVCxTQUFTLFNBQVMsQ0FBQyxTQUFTLFNBQVEsS0FBSztBQUFBLEVBQ3ZDLE1BQU0sUUFBUSxRQUFRLEtBQUssUUFBUSxRQUFRLEtBQUs7QUFBQSxFQUNoRCxNQUFNLE1BQU0sWUFBVyxVQUFVLFlBQVcsVUFBVSxNQUFNLFFBQVEsS0FBSyxRQUFRLFFBQVEsS0FBSyxXQUFXO0FBQUEsRUFDekcsT0FBTyxLQUFLLElBQUksR0FBRyxNQUFNLEtBQUs7QUFBQTtBQUVoQyxTQUFTLE9BQU8sQ0FBQyxPQUFPO0FBQUEsRUFDdEIsTUFBTSxPQUFPLE1BQU0sUUFBUTtBQUFBLEVBQzNCLE1BQU0sUUFBUSxNQUFNLFFBQVE7QUFBQSxFQUM1QixNQUFNLFNBQVMsRUFBRSxNQUFNLE1BQU07QUFBQSxFQUc3QixPQUFPLE1BQU0sY0FBYyxNQUFNLFFBQVEsUUFBUSxNQUFNLFFBQVE7QUFBQSxJQUM3RCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0YsQ0FBQztBQUFBLEVBRUQsT0FBTyxLQUFLLFVBQVUsYUFBYSxLQUFLLElBQUksQ0FBQztBQUFBLEVBSTdDLE1BQU0sYUFBYSxNQUFNLElBQUksSUFBSSxLQUFLLFFBQVEsS0FBSyxFQUFFLE9BQU8sYUFBVyxLQUFLLFFBQVEsT0FBTyxRQUFRLEVBQUUsTUFBTSxTQUFTLEVBQUUsSUFBSSxhQUFXLFFBQVEsRUFBRSxDQUFDO0FBQUEsRUFLaEosYUFBYSxNQUFNO0FBQUEsSUFDakIsTUFBTSxPQUFPLEtBQUssUUFBUSxLQUFLLE1BQU0sU0FBUztBQUFBLElBQzlDLFdBQVcsTUFBTSxXQUFXLEdBQUc7QUFBQSxNQUM3QixNQUFNLFVBQVUsS0FBSyxRQUFRLElBQUksRUFBRTtBQUFBLE1BQ25DLElBQUksU0FBUyxhQUFhLGFBQWEsS0FBSyxRQUFRLEtBQUssRUFBRSxNQUFNLE1BQU07QUFBQSxRQUNyRSxNQUFNLFNBQVMsRUFBRTtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLEdBQ0Q7QUFBQSxFQUNELE1BQU0sVUFBVSxXQUFXLE1BQU07QUFBQSxJQUMvQixNQUFNLE9BQU8sS0FBSyxRQUFRLEtBQUssTUFBTSxTQUFTO0FBQUEsSUFDOUMsTUFBTSxTQUFTLFdBQVc7QUFBQSxJQUMxQixNQUFNLFdBQVcsTUFBTSxTQUFTO0FBQUEsSUFDaEMsTUFBTSxVQUFVLE1BQU0sS0FBSztBQUFBLElBQzNCLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsT0FBTyxLQUFLLFFBQVEsS0FBSyxFQUFFLE9BQU8sYUFBVztBQUFBLE1BQzNDLElBQUksUUFBUSxhQUFhO0FBQUEsUUFBVyxPQUFPO0FBQUEsTUFDM0MsSUFBSSxLQUFLLFFBQVEsS0FBSyxRQUFRLEVBQUUsTUFBTTtBQUFBLFFBQU0sT0FBTztBQUFBLE1BQ25ELE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRSxLQUFLLFFBQVEsSUFBSSxRQUFRLEVBQUU7QUFBQSxLQUN4RCxFQUFFLElBQUksYUFBVztBQUFBLE1BQ2hCLE1BQU0sVUFBVSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQUEsTUFDckMsTUFBTSxVQUFTLFNBQVMsU0FBUyxTQUFTLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUFBLE1BQ2xFLE9BQU87QUFBQSxRQUNMLElBQUksUUFBUTtBQUFBLFFBQ1osT0FBTyxRQUFRLFNBQVM7QUFBQSxRQUN4QixPQUFPLFFBQVEsU0FBUztBQUFBLFFBQ3hCO0FBQUEsUUFDQSxTQUFTLFVBQVUsU0FBUyxTQUFRLEtBQUs7QUFBQSxRQUN6QyxTQUFTLFFBQVEsS0FBSztBQUFBLE1BQ3hCO0FBQUEsS0FDRCxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sT0FBTyxFQUFFLFdBQVcsVUFBVSxFQUFFLFdBQVcsT0FBTyxJQUFJLE9BQU8sRUFBRSxXQUFXLFVBQVUsRUFBRSxXQUFXLE9BQU8sS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO0FBQUEsR0FDcko7QUFBQSxFQUdELE1BQU0sUUFBUSxZQUFZLE1BQU07QUFBQSxJQUM5QixJQUFJLENBQUMsS0FBSztBQUFBLE1BQU07QUFBQSxJQUNoQixJQUFJLFFBQVEsRUFBRSxLQUFLLFdBQVMsTUFBTSxXQUFXLFVBQVUsTUFBTSxXQUFXLE9BQU8sR0FBRztBQUFBLE1BQ2hGLE9BQU8sS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNuQjtBQUFBLEtBQ0MsSUFBSTtBQUFBLEVBQ1AsVUFBVSxNQUFNLGNBQWMsS0FBSyxDQUFDO0FBQUEsRUFDcEMsTUFBTSxPQUFPLGFBQVU7QUFBQSxJQUNyQixJQUFJLFlBQVc7QUFBQSxNQUFRLE9BQU8sTUFBTSxLQUFLLFNBQVMsUUFBUTtBQUFBLElBQzFELElBQUksWUFBVztBQUFBLE1BQVMsT0FBTyxNQUFNLEtBQUssU0FBUyxRQUFRO0FBQUEsSUFDM0QsSUFBSSxZQUFXO0FBQUEsTUFBUyxPQUFPLE1BQU0sS0FBSyxTQUFTLE1BQU07QUFBQSxJQUN6RCxPQUFPLE1BQU0sS0FBSztBQUFBO0FBQUEsRUFFcEIsTUFBTSxjQUFjLGFBQVU7QUFBQSxJQUM1QixJQUFJLFlBQVc7QUFBQSxNQUFRLE9BQU87QUFBQSxJQUM5QixJQUFJLFlBQVc7QUFBQSxNQUFTLE9BQU87QUFBQSxJQUMvQixJQUFJLFlBQVc7QUFBQSxNQUFRLE9BQU87QUFBQSxJQUM5QixJQUFJLFlBQVc7QUFBQSxNQUFTLE9BQU87QUFBQSxJQUMvQixJQUFJLFlBQVc7QUFBQSxNQUFXLE9BQU87QUFBQSxJQUNqQyxPQUFPO0FBQUE7QUFBQSxFQUVULFFBQVEsTUFBTTtBQUFBLElBQ1osSUFBSSxPQUFPLGdCQUFnQixLQUFLLEdBQzlCLFFBQVEsZ0JBQWdCLEtBQUssR0FDN0IsUUFBUSxnQkFBZ0IsTUFBTSxHQUM5QixRQUFRLGdCQUFnQixNQUFNLEdBQzlCLFFBQVEsZ0JBQWdCLEdBQUc7QUFBQSxJQUM3QixhQUFhLE1BQU0sS0FBSztBQUFBLElBQ3hCLFVBQVUsTUFBTSxTQUFTLE1BQU07QUFBQSxJQUMvQixVQUFVLE1BQU0saUJBQWlCLFFBQVE7QUFBQSxJQUN6QyxhQUFhLE9BQU8sS0FBSztBQUFBLElBQ3pCLGFBQWEsT0FBTyxLQUFLO0FBQUEsSUFDekIsVUFBVSxPQUFPLFNBQVMsTUFBTTtBQUFBLElBQ2hDLFVBQVUsT0FBTyxpQkFBaUIsS0FBSztBQUFBLElBQ3ZDLFVBQVUsT0FBTyxPQUFPLENBQUM7QUFBQSxJQUN6QixVQUFVLE9BQU8sZUFBZSxNQUFNO0FBQUEsTUFDL0IsV0FBVyxXQUFTO0FBQUEsUUFDdkIsTUFBTSxPQUFPLENBQUMsTUFBTTtBQUFBLE9BQ3JCLEVBQUUsTUFBTSxXQUFTLFFBQVEsTUFBTSw0Q0FBNEMsS0FBSyxDQUFDO0FBQUEsS0FDbkY7QUFBQSxJQUNELFNBQVMsT0FBTyxNQUFNLEtBQUssT0FBTyxXQUFLLFFBQUc7QUFBQSxJQUMxQyxhQUFhLE9BQU8sS0FBSztBQUFBLElBQ3pCLFNBQVMsT0FBTyxNQUFNLE9BQU8sU0FBUztBQUFBLElBQ3RDLFNBQVMsT0FBTyxrQkFBa0IsTUFBTTtBQUFBLFVBQ2xDLElBQUksR0FBRztBQUFBLFFBQ1QsT0FBTyxRQUFRLEVBQUUsU0FBUztBQUFBO0FBQUEsVUFFeEIsUUFBUSxHQUFHO0FBQUEsUUFDYixJQUFJLFFBQVEsZ0JBQWdCLE1BQU0sR0FDaEMsUUFBUSxpQkFBaUIsSUFBSSxHQUM3QixRQUFRLGlCQUFpQixHQUFHO0FBQUEsUUFDOUIsYUFBYSxPQUFPLEtBQUs7QUFBQSxRQUN6QixhQUFhLE9BQU8sS0FBSztBQUFBLFFBQ3pCLFNBQVMsT0FBTyxNQUFNLFFBQVEsRUFBRSxRQUFRLEtBQUs7QUFBQSxRQUM3QyxTQUFTLFNBQU8sVUFBVSxPQUFPLFNBQVM7QUFBQSxVQUN4QyxJQUFJLE1BQU0sS0FBSztBQUFBLFFBQ2pCLEdBQUcsR0FBRyxDQUFDO0FBQUEsUUFDUCxPQUFPO0FBQUE7QUFBQSxJQUVYLENBQUMsR0FBRyxJQUFJO0FBQUEsSUFDUixTQUFTLE1BQU0sa0JBQWtCLE1BQU07QUFBQSxVQUNqQyxJQUFJLEdBQUc7QUFBQSxRQUNULE9BQU8sS0FBSztBQUFBO0FBQUEsVUFFVixRQUFRLEdBQUc7QUFBQSxRQUNiLFFBQVEsTUFBTTtBQUFBLFVBQ1osSUFBSSxRQUFRLGdCQUFnQixLQUFLO0FBQUEsVUFDakMsVUFBVSxPQUFPLFVBQVUsQ0FBQztBQUFBLFVBQzVCLE9BQU87QUFBQSxXQUNOO0FBQUE7QUFBQSxVQUVELFFBQVEsR0FBRztBQUFBLFFBQ2IsT0FBTyxDQUFDLGtCQUFrQixNQUFNO0FBQUEsY0FDMUIsSUFBSSxHQUFHO0FBQUEsWUFDVCxPQUFPLE1BQU07QUFBQTtBQUFBLGNBRVgsUUFBUSxHQUFHO0FBQUEsWUFDYixRQUFRLE1BQU07QUFBQSxjQUNaLElBQUksUUFBUSxnQkFBZ0IsS0FBSztBQUFBLGNBQ2pDLFVBQVUsT0FBTyxVQUFVLENBQUM7QUFBQSxjQUM1QixPQUFPO0FBQUEsZUFDTjtBQUFBO0FBQUEsY0FFRCxRQUFRLEdBQUc7QUFBQSxZQUNiLElBQUksUUFBUSxnQkFBZ0IsTUFBTTtBQUFBLFlBQ2xDLFNBQVMsT0FBTyxNQUFNO0FBQUEsY0FDcEIsTUFBTSxPQUFPLE1BQU0sVUFBVTtBQUFBLGNBQzdCLE1BQU0sT0FBTyxLQUFLLGVBQWUsT0FBTyxrQkFBWSxLQUFLLGVBQWUsUUFBUSxrQkFBYTtBQUFBLGNBQzdGLE1BQU0sTUFBTSxLQUFLLHNCQUFzQixZQUFZLE9BQU8sS0FBSyxzQkFBc0I7QUFBQSxjQUNyRixNQUFNLE1BQU0sS0FBSyxZQUFZLFFBQVEsS0FBSyxjQUFjO0FBQUEsY0FDeEQsT0FBTyxXQUFXLEtBQUssVUFBVSxLQUFLLGdCQUFnQixJQUFJLEtBQUssa0JBQWtCLE9BQU8sT0FBTyxNQUFNO0FBQUEsYUFDdEc7QUFBQSxZQUNELFNBQVMsU0FBTyxVQUFVLE9BQU8sTUFBTSxNQUFNLEtBQUssT0FBTyxHQUFHLENBQUM7QUFBQSxZQUM3RCxPQUFPO0FBQUE7QUFBQSxRQUVYLENBQUMsR0FBRyxrQkFBa0IsS0FBSztBQUFBLGNBQ3JCLElBQUksR0FBRztBQUFBLFlBQ1QsT0FBTyxRQUFRO0FBQUE7QUFBQSxVQUVqQixVQUFVLFlBQVUsTUFBTTtBQUFBLFlBQ3hCLElBQUksU0FBUyxnQkFBZ0IsS0FBSyxHQUNoQyxTQUFTLGdCQUFnQixNQUFNLEdBQy9CLFNBQVMsZ0JBQWdCLE1BQU0sR0FDL0IsU0FBUyxnQkFBZ0IsTUFBTSxHQUMvQixTQUFTLGdCQUFnQixNQUFNO0FBQUEsWUFDakMsYUFBYSxRQUFRLE1BQU07QUFBQSxZQUMzQixhQUFhLFFBQVEsTUFBTTtBQUFBLFlBQzNCLGFBQWEsUUFBUSxNQUFNO0FBQUEsWUFDM0IsYUFBYSxRQUFRLE1BQU07QUFBQSxZQUMzQixVQUFVLFFBQVEsU0FBUyxNQUFNO0FBQUEsWUFDakMsVUFBVSxRQUFRLGlCQUFpQixLQUFLO0FBQUEsWUFDeEMsVUFBVSxRQUFRLE9BQU8sQ0FBQztBQUFBLFlBQzFCLFVBQVUsUUFBUSxlQUFlLENBQUM7QUFBQSxZQUNsQyxVQUFVLFFBQVEsZUFBZSxNQUFNO0FBQUEsY0FDckMsTUFBTSxRQUFRLEdBQUcsT0FBTyxTQUFTO0FBQUEsZ0JBQy9CLE1BQU07QUFBQSxnQkFDTixXQUFXLE1BQU07QUFBQSxjQUNuQixDQUFDO0FBQUEsYUFDRjtBQUFBLFlBQ0QsYUFBYSxRQUFRLGlCQUFpQixRQUFFLENBQUM7QUFBQSxZQUN6QyxVQUFVLFFBQVEsY0FBYyxDQUFDO0FBQUEsWUFDakMsVUFBVSxRQUFRLFlBQVksTUFBTTtBQUFBLFlBQ3BDLFVBQVUsUUFBUSxZQUFZLElBQUk7QUFBQSxZQUNsQyxVQUFVLFFBQVEsWUFBWSxDQUFDO0FBQUEsWUFDL0IsVUFBVSxRQUFRLGNBQWMsQ0FBQztBQUFBLFlBQ2pDLFVBQVUsUUFBUSxZQUFZLENBQUM7QUFBQSxZQUMvQixTQUFTLFFBQVEsTUFBTSxNQUFNLFNBQVMsTUFBTSxPQUFPLElBQUk7QUFBQSxZQUN2RCxTQUFTLFFBQVEsa0JBQWtCLE1BQU07QUFBQSxrQkFDbkMsSUFBSSxHQUFHO0FBQUEsZ0JBQ1QsT0FBTyxNQUFNO0FBQUE7QUFBQSxrQkFFWCxRQUFRLEdBQUc7QUFBQSxnQkFDYixJQUFJLFNBQVMsZ0JBQWdCLE1BQU0sR0FDakMsU0FBUyxpQkFBaUIsR0FBRztBQUFBLGdCQUMvQixhQUFhLFFBQVEsTUFBTTtBQUFBLGdCQUMzQixTQUFTLFFBQVEsTUFBTSxNQUFNLE9BQU8sSUFBSTtBQUFBLGdCQUN4QyxTQUFTLFNBQU8sVUFBVSxRQUFRLFNBQVM7QUFBQSxrQkFDekMsSUFBSSxNQUFNLEtBQUs7QUFBQSxnQkFDakIsR0FBRyxHQUFHLENBQUM7QUFBQSxnQkFDUCxPQUFPO0FBQUE7QUFBQSxZQUVYLENBQUMsR0FBRyxJQUFJO0FBQUEsWUFDUixVQUFVLFFBQVEsWUFBWSxNQUFNO0FBQUEsWUFDcEMsVUFBVSxRQUFRLGNBQWMsQ0FBQztBQUFBLFlBQ2pDLFNBQVMsUUFBUSxNQUFNLFlBQVksTUFBTSxNQUFNLENBQUM7QUFBQSxZQUNoRCxVQUFVLFFBQVEsWUFBWSxNQUFNO0FBQUEsWUFDcEMsVUFBVSxRQUFRLGNBQWMsQ0FBQztBQUFBLFlBQ2pDLFNBQVMsUUFBUSxNQUFNLGVBQWUsTUFBTSxPQUFPLENBQUM7QUFBQSxZQUNwRCxTQUFTLFNBQU87QUFBQSxjQUNkLElBQUksT0FBTyxLQUFLLE1BQU0sTUFBTSxHQUMxQixPQUFPLE1BQU0sS0FBSyxNQUNsQixPQUFPLEtBQUssTUFBTSxNQUFNLEdBQ3hCLE9BQU8sTUFBTSxLQUFLO0FBQUEsY0FDcEIsU0FBUyxJQUFJLE1BQU0sSUFBSSxJQUFJLFVBQVUsUUFBUSxNQUFNLE1BQU0sSUFBSSxDQUFDO0FBQUEsY0FDOUQsU0FBUyxJQUFJLE1BQU0sSUFBSSxJQUFJLFVBQVUsUUFBUSxNQUFNLE1BQU0sSUFBSSxDQUFDO0FBQUEsY0FDOUQsU0FBUyxJQUFJLE1BQU0sSUFBSSxJQUFJLFVBQVUsUUFBUSxNQUFNLE1BQU0sSUFBSSxDQUFDO0FBQUEsY0FDOUQsU0FBUyxJQUFJLE1BQU0sSUFBSSxJQUFJLFVBQVUsUUFBUSxNQUFNLE1BQU0sSUFBSSxDQUFDO0FBQUEsY0FDOUQsT0FBTztBQUFBLGVBQ047QUFBQSxjQUNELEdBQUc7QUFBQSxjQUNILEdBQUc7QUFBQSxjQUNILEdBQUc7QUFBQSxjQUNILEdBQUc7QUFBQSxZQUNMLENBQUM7QUFBQSxZQUNELE9BQU87QUFBQSxhQUNOO0FBQUEsUUFDTCxDQUFDLENBQUM7QUFBQTtBQUFBLElBRU4sQ0FBQyxHQUFHLElBQUk7QUFBQSxJQUNSLFNBQVMsU0FBTztBQUFBLE1BQ2QsSUFBSSxNQUFNLE1BQU0sS0FBSyxNQUNuQixPQUFPLE1BQU0sS0FBSztBQUFBLE1BQ3BCLFFBQVEsSUFBSSxNQUFNLElBQUksSUFBSSxVQUFVLE9BQU8sTUFBTSxLQUFLLElBQUksQ0FBQztBQUFBLE1BQzNELFNBQVMsSUFBSSxNQUFNLElBQUksSUFBSSxVQUFVLE9BQU8sTUFBTSxNQUFNLElBQUksQ0FBQztBQUFBLE1BQzdELE9BQU87QUFBQSxPQUNOO0FBQUEsTUFDRCxHQUFHO0FBQUEsTUFDSCxHQUFHO0FBQUEsSUFDTCxDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsS0FDTjtBQUFBO0FBRUwsSUFBTSxTQUFTLE9BQU8sT0FBTztBQUFBLEVBQzNCLElBQUk7QUFBQSxFQUNKLEtBQUssQ0FBQyxTQUFTO0FBQUEsSUFDYixNQUFNLFVBQVUsUUFBUSxXQUFXLENBQUM7QUFBQSxJQUNwQyxNQUFNLFdBQVcsUUFBUTtBQUFBLElBR3pCLE1BQU0sa0JBQWtCLFVBQVUsYUFBYTtBQUFBLElBQy9DLE1BQU0sb0JBQW9CLFVBQVUsZUFBZTtBQUFBLElBQ25ELE1BQU0sa0JBQWtCLFVBQVUsYUFBYTtBQUFBLElBQy9DLE1BQU0sMEJBQTBCLFVBQVUscUJBQXFCO0FBQUEsSUFDL0QsTUFBTSxTQUFTLGNBQWMsUUFBUSxNQUFNO0FBQUEsSUFDM0MsTUFBTSxZQUFZLFFBQVEsU0FBUyxhQUFhO0FBQUEsSUFJaEQsT0FBTyxNQUFNLFdBQVcsYUFBYSxJQUFJLEdBQUs7QUFBQSxJQUM5QyxNQUFNLFdBQVcsZUFBYTtBQUFBLE1BQzVCLFFBQVEsY0FBWTtBQUFBLFFBQ2xCLElBQUksU0FBUyxJQUFJLFNBQVM7QUFBQSxVQUFHLE9BQU87QUFBQSxRQUNwQyxNQUFNLE9BQU8sSUFBSSxJQUFJLFFBQVE7QUFBQSxRQUM3QixLQUFLLElBQUksU0FBUztBQUFBLFFBQ2xCLE9BQU87QUFBQSxPQUNSO0FBQUE7QUFBQSxJQUlILElBQUk7QUFBQSxNQUF5Qix1QkFBdUI7QUFBQSxJQUNwRCxJQUFJO0FBQUEsSUFDSixPQUFPLFdBQVcsZ0JBQWdCLGFBQWEsZUFBZSxDQUFDO0FBQUEsSUFDL0QsTUFBTSxtQkFBbUIsTUFBTSxhQUFhLGVBQWUsQ0FBQztBQUFBLElBQzVELE1BQU0sVUFBVSxNQUFNO0FBQUEsTUFDcEIsVUFBVTtBQUFBLE1BQ1YsaUJBQWlCO0FBQUE7QUFBQSxJQUVuQixNQUFNLFNBQVMsTUFBTTtBQUFBLE1BQ25CLFVBQVU7QUFBQSxNQUNWLGlCQUFpQjtBQUFBO0FBQUEsSUFFbkIsUUFBUSxTQUFTLEdBQUcsU0FBUyxPQUFPO0FBQUEsSUFDcEMsUUFBUSxTQUFTLEdBQUcsUUFBUSxNQUFNO0FBQUEsSUFDbEMsTUFBTSxhQUFhO0FBQUEsTUFDakIsbUJBQW1CO0FBQUEsTUFDbkIsU0FBUyxZQUFZO0FBQUEsUUFDbkIsTUFBTSxNQUFNLE1BQU0sa0JBQWtCO0FBQUEsUUFDcEMsaUJBQWlCO0FBQUEsUUFDakIsT0FBTyxPQUFPO0FBQUE7QUFBQSxJQUVsQjtBQUFBLElBSUEsT0FBTyxVQUFVLGVBQWUsYUFBYSxJQUFJLEdBQUs7QUFBQSxJQUN0RCxNQUFNLGVBQWUsQ0FBQyxXQUFXLFVBQVU7QUFBQSxNQUN6QyxZQUFZLGNBQVk7QUFBQSxRQUN0QixJQUFJLFNBQVMsSUFBSSxTQUFTLE1BQU07QUFBQSxVQUFPLE9BQU87QUFBQSxRQUM5QyxNQUFNLE9BQU8sSUFBSSxJQUFJLFFBQVE7QUFBQSxRQUM3QixJQUFJO0FBQUEsVUFBTyxLQUFLLElBQUksU0FBUztBQUFBLFFBQU87QUFBQSxlQUFLLE9BQU8sU0FBUztBQUFBLFFBQ3pELE9BQU87QUFBQSxPQUNSO0FBQUE7QUFBQSxJQUVILE1BQU0sYUFBYSxlQUFhLFFBQVEsS0FBSyxRQUFRLElBQUksU0FBUyxHQUFHLGFBQWE7QUFBQSxJQUdsRixNQUFNLGlCQUFpQixXQUFTO0FBQUEsTUFDOUIsTUFBTSxPQUFPLFFBQVEsVUFBVTtBQUFBLE1BQy9CLE1BQU0sUUFBUSxNQUFNLFVBQVU7QUFBQSxNQUM5QixPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsU0FBUztBQUFBO0FBQUEsSUFLckMsTUFBTSxrQkFBa0IsZUFBYSxRQUFRLEtBQUssUUFBUSxPQUFPLFNBQVMsRUFBRSxLQUFLLFdBQVMsVUFBVSxhQUFhLFFBQVEsS0FBSyxRQUFRLElBQUksS0FBSyxHQUFHLGFBQWEsYUFBYSxRQUFRLEtBQUssUUFBUSxPQUFPLEtBQUssTUFBTSxTQUFTO0FBQUEsSUFHNU4sTUFBTSxrQkFBa0IsSUFBSTtBQUFBLElBQzVCLElBQUksYUFBYTtBQUFBLElBQ2pCLElBQUksZ0JBQWdCO0FBQUEsSUFDcEIsTUFBTSxXQUFXLElBQUk7QUFBQSxJQUNyQixNQUFNLFVBQVUsSUFBSTtBQUFBLElBQ3BCLE1BQU0sZUFBZSxJQUFJO0FBQUEsSUFDekIsTUFBTSxxQkFBcUIsSUFBSTtBQUFBLElBQy9CLE1BQU0sNkJBQTZCO0FBQUEsSUFDbkMsTUFBTSxVQUFVLGVBQWE7QUFBQSxNQUMzQixTQUFTLE9BQU8sU0FBUztBQUFBLE1BQ3pCLFFBQVEsT0FBTyxTQUFTO0FBQUEsTUFDeEIsYUFBYSxXQUFXLEtBQUs7QUFBQTtBQUFBLElBRS9CLE1BQU0sUUFBUSxlQUFhO0FBQUEsTUFDekIsSUFBSSxTQUFTLElBQUksU0FBUztBQUFBLFFBQUc7QUFBQSxNQUM3QixTQUFTLElBQUksU0FBUztBQUFBLE1BQ3RCLElBQUksUUFBUSxJQUFJLFNBQVMsR0FBRztBQUFBLFFBQzFCLFFBQVEsT0FBTyxTQUFTO0FBQUEsUUFDeEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxJQUFJLFdBQVcsU0FBUztBQUFBLFFBQUc7QUFBQSxNQUMzQixJQUFJLG1CQUFtQjtBQUFBLFFBQ3JCLGVBQWUsU0FBUyxZQUFZLE1BQU0sRUFBRSxNQUFNLE1BQU0sRUFBRTtBQUFBLE1BQzVEO0FBQUE7QUFBQSxJQUVGLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDaEIsTUFBTSxnQkFBZ0IsZUFBYTtBQUFBLE1BQ2pDLE1BQU0sVUFBVSxnQkFBZ0IsT0FBTyxTQUFTO0FBQUEsTUFDaEQsSUFBSSxDQUFDLFdBQVcsZ0JBQWdCLE9BQU8sS0FBSztBQUFBLFFBQWU7QUFBQSxNQUMzRCxnQkFBZ0I7QUFBQSxNQUNoQixJQUFJLGlCQUFpQjtBQUFBLFFBQ25CLG9CQUFvQixTQUFTLFlBQVksWUFBWSxNQUFNLEVBQUUsTUFBTSxNQUFNLEVBQUU7QUFBQSxNQUM3RTtBQUFBO0FBQUEsSUFJRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsMkJBQTJCLFdBQVM7QUFBQSxNQUM5RCxJQUFJLENBQUMsZUFBZSxLQUFLO0FBQUEsUUFBRztBQUFBLE1BQzVCLGFBQWEsTUFBTSxLQUFLLFdBQVcsSUFBSTtBQUFBLEtBQ3hDLENBQUM7QUFBQSxJQUlGLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyw2QkFBNkIsV0FBUztBQUFBLE1BQ2hFLElBQUksQ0FBQyxlQUFlLEtBQUs7QUFBQSxRQUFHO0FBQUEsTUFDNUIsTUFBTSxZQUFZLE1BQU0sS0FBSztBQUFBLE1BQzdCLFFBQVEsU0FBUztBQUFBLE1BR2pCLFNBQVMsU0FBUztBQUFBLE1BQ2xCLElBQUksQ0FBQyxXQUFXLFNBQVM7QUFBQSxRQUFHO0FBQUEsTUFDNUIsSUFBSSxnQkFBZ0IsU0FBUyxHQUFHO0FBQUEsUUFDOUIsYUFBYTtBQUFBLFFBQ2IsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLGdCQUFnQixJQUFJLFNBQVM7QUFBQSxNQUM3QjtBQUFBLEtBQ0QsQ0FBQztBQUFBLElBQ0YsT0FBTyxLQUFLLFFBQVEsS0FBSyxHQUFHLCtCQUErQixXQUFTO0FBQUEsTUFDbEUsSUFBSSxDQUFDLGVBQWUsS0FBSztBQUFBLFFBQUc7QUFBQSxNQUM1QixNQUFNLFlBQVksTUFBTSxLQUFLO0FBQUEsTUFDN0IsYUFBYSxXQUFXLEtBQUs7QUFBQSxNQUM3QixJQUFJLFdBQVcsU0FBUyxHQUFHO0FBQUEsUUFDekIsY0FBYyxTQUFTO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQUEsTUFFQSxJQUFJLGdCQUFnQixTQUFTO0FBQUEsUUFBRztBQUFBLE1BQ2hDLE1BQU0sU0FBUztBQUFBLEtBQ2hCLENBQUM7QUFBQSxJQUNGLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyw0QkFBNEIsV0FBUztBQUFBLE1BQy9ELElBQUksQ0FBQyxlQUFlLEtBQUs7QUFBQSxRQUFHO0FBQUEsTUFDNUIsTUFBTSxZQUFZLE1BQU0sS0FBSztBQUFBLE1BQzdCLGFBQWEsV0FBVyxLQUFLO0FBQUEsTUFDN0IsUUFBUSxJQUFJLFNBQVM7QUFBQSxNQUNyQixJQUFJLFdBQVcsU0FBUyxHQUFHO0FBQUEsUUFDekIsY0FBYyxTQUFTO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLFNBQVM7QUFBQSxLQUNoQixDQUFDO0FBQUEsSUFDRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsaUNBQWlDLFdBQVM7QUFBQSxNQUNwRSxJQUFJLENBQUMsZUFBZSxLQUFLO0FBQUEsUUFBRztBQUFBLE1BQzVCLE1BQU0sWUFBWSxNQUFNLEtBQUs7QUFBQSxNQUM3QixhQUFhLFdBQVcsS0FBSztBQUFBLE1BQzdCLElBQUksV0FBVyxTQUFTLEdBQUc7QUFBQSxRQUN6QixjQUFjLFNBQVM7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU0sU0FBUztBQUFBLEtBQ2hCLENBQUM7QUFBQSxJQUNGLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxtQkFBbUIsV0FBUztBQUFBLE1BQ3RELElBQUksQ0FBQyxlQUFlLEtBQUs7QUFBQSxRQUFHO0FBQUEsTUFDNUIsTUFBTSxZQUFZLE1BQU0sS0FBSztBQUFBLE1BQzdCLFNBQVMsT0FBTyxTQUFTO0FBQUEsTUFDekIsUUFBUSxPQUFPLFNBQVM7QUFBQSxNQUN4QixnQkFBZ0IsT0FBTyxTQUFTO0FBQUEsTUFDaEMsYUFBYSxXQUFXLEtBQUs7QUFBQSxNQUM3QixRQUFRLGNBQVk7QUFBQSxRQUNsQixJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVM7QUFBQSxVQUFHLE9BQU87QUFBQSxRQUNyQyxNQUFNLE9BQU8sSUFBSSxJQUFJLFFBQVE7QUFBQSxRQUM3QixLQUFLLE9BQU8sU0FBUztBQUFBLFFBQ3JCLE9BQU87QUFBQSxPQUNSO0FBQUEsS0FDRixDQUFDO0FBQUEsSUFJRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsZ0JBQWdCLFdBQVM7QUFBQSxNQUNuRCxJQUFJLENBQUMsZUFBZSxLQUFLO0FBQUEsUUFBRztBQUFBLE1BQzVCLE1BQU0sT0FBTyxNQUFNLEtBQUs7QUFBQSxNQUN4QixJQUFJLENBQUMsbUJBQW1CLFdBQVcsS0FBSyxTQUFTLEtBQUssYUFBYSxJQUFJLEtBQUssRUFBRTtBQUFBLFFBQUc7QUFBQSxNQUNqRixhQUFhLElBQUksS0FBSyxFQUFFO0FBQUEsTUFDeEIscUJBQXFCLFNBQVMsWUFBWSxLQUFLLE9BQU8sWUFBWSxNQUFNLEVBQUUsTUFBTSxNQUFNLEVBQUU7QUFBQSxLQUN6RixDQUFDO0FBQUEsSUFDRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsZ0JBQWdCLFdBQVM7QUFBQSxNQUNuRCxhQUFhLE9BQU8sTUFBTSxLQUFLLEVBQUU7QUFBQSxLQUNsQyxDQUFDO0FBQUEsSUFDRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsa0JBQWtCLFdBQVM7QUFBQSxNQUNyRCxhQUFhLE9BQU8sTUFBTSxLQUFLLEVBQUU7QUFBQSxLQUNsQyxDQUFDO0FBQUEsSUFDRixPQUFPLEtBQUssUUFBUSxLQUFLLEdBQUcsb0JBQW9CLFdBQVM7QUFBQSxNQUN2RCxJQUFJLENBQUMsZUFBZSxLQUFLO0FBQUEsUUFBRztBQUFBLE1BQzVCO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsTUFDVixJQUFJLENBQUMsbUJBQW1CLFdBQVcsU0FBUyxLQUFLLG1CQUFtQixJQUFJLEVBQUU7QUFBQSxRQUFHO0FBQUEsTUFDN0UsTUFBTSxRQUFRLFdBQVcsTUFBTTtBQUFBLFFBQzdCLElBQUksbUJBQW1CLE9BQU8sRUFBRSxHQUFHO0FBQUEsVUFDakMscUJBQXFCLFNBQVMsY0FBYyxRQUFRLFlBQVksTUFBTSxFQUFFLE1BQU0sTUFBTSxFQUFFO0FBQUEsUUFDeEY7QUFBQSxTQUNDLDBCQUEwQjtBQUFBLE1BQzdCLG1CQUFtQixJQUFJLElBQUksS0FBSztBQUFBLEtBQ2pDLENBQUM7QUFBQSxJQUNGLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxzQkFBc0IsV0FBUztBQUFBLE1BQ3pELE1BQU0sUUFBUSxtQkFBbUIsSUFBSSxNQUFNLEtBQUssU0FBUztBQUFBLE1BQ3pELElBQUksQ0FBQztBQUFBLFFBQU87QUFBQSxNQUNaLGFBQWEsS0FBSztBQUFBLE1BQ2xCLG1CQUFtQixPQUFPLE1BQU0sS0FBSyxTQUFTO0FBQUEsS0FDL0MsQ0FBQztBQUFBLElBQ0YsUUFBUSxHQUFHLEtBQUs7QUFBQSxNQUdkLFNBQVM7QUFBQSxNQUNULFFBQVEsVUFBUSxrQkFBa0IsU0FBUztBQUFBLFFBQ3pDO0FBQUEsWUFDSSxTQUFTLEdBQUc7QUFBQSxVQUNkLE9BQU8sS0FBSztBQUFBO0FBQUEsUUFFZDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBQUEsSUFDRCxPQUFPLE1BQU07QUFBQSxNQUNYLFFBQVEsU0FBUyxJQUFJLFNBQVMsT0FBTztBQUFBLE1BQ3JDLFFBQVEsU0FBUyxJQUFJLFFBQVEsTUFBTTtBQUFBLE1BQ25DLFdBQVcsU0FBUyxtQkFBbUIsT0FBTztBQUFBLFFBQUcsYUFBYSxLQUFLO0FBQUEsTUFDbkUsbUJBQW1CLE1BQU07QUFBQSxNQUN6QixPQUFPLFFBQVEsRUFBRSxRQUFRLGlCQUFlLFlBQVksQ0FBQztBQUFBO0FBQUE7QUFHM0QsQ0FBQztBQUNELElBQWU7IiwiZGVidWdJZCI6Ijc2RjEyQkQ0MTc4RDZFMEU2NDc1NkUyMTY0NzU2RTIxIiwibmFtZXMiOltdfQ==
