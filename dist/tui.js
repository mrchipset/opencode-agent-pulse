var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/tui.ts
import { createElement, insert, setProp } from "@opentui/solid";
import { createSignal } from "solid-js";

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
    subagents: "子 agent",
    subagentsDone: (count) => count > 1 ? `全部 ${count} 个子 agent 已完成` : "子 agent 已完成",
    turnDone: "本轮对话已完成",
    permissionRequired: (detail) => detail ? `需要权限确认: ${detail}` : "主会话需要权限确认",
    questionRequired: (detail) => detail ? `需要回答: ${detail}` : "主会话需要回答询问"
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
async function windowsNotify(payload) {
  import("node-notifier").then(async (mod) => {
    let iconPath;
    try {
      const { writeFile } = await import("node:fs/promises");
      const os = await import("node:os");
      const path = await import("node:path");
      iconPath = path.join(os.tmpdir(), `opencode-pulse-${process.pid}-${Date.now()}.png`);
      await writeFile(iconPath, Buffer.from(OPENCODE_ICON_PNG_B64, "base64"));
    } catch {
      iconPath = undefined;
    }
    const notifier = mod.default ?? mod;
    notifier.notify({
      title: payload.title,
      message: payload.message,
      appID: WINDOWS_APP_ID,
      ...iconPath ? { icon: iconPath } : {},
      sound: true
    }, () => {
      if (iconPath) {
        import("node:fs/promises").then(({ unlink }) => unlink(iconPath)).catch(() => {});
      }
    });
  }).catch(() => {});
}
async function builtinNotify(api, payload) {
  try {
    await api.attention.notify({
      title: payload.title,
      message: payload.message,
      notification: { when: "always" },
      sound: payload.sound
    });
  } catch {}
}
async function dispatch(api, payload, gate) {
  if (gate?.onlyWhenUnfocused && await gate.focused() === true) {
    return;
  }
  if (IS_WINDOWS) {
    await windowsNotify(payload);
  } else {
    await builtinNotify(api, payload);
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
import { spawn } from "node:child_process";
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

// src/tui.ts
function element(tag, props = {}, children = []) {
  const node = createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined)
      setProp(node, key, value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false)
      continue;
    insert(node, child);
  }
  return node;
}
function text(props, children = []) {
  return element("text", props, children);
}
function box(props, children = []) {
  return element("box", props, children);
}
function formatDuration(elapsedMs) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds.toString().padStart(2, "0")}s` : `${seconds}s`;
}
function entryElapsed(info) {
  return info.status === "busy" || info.status === "retry" ? info.frozen + (Date.now() - info.since) : info.frozen;
}
function toolMetadata(part, key) {
  return ("metadata" in part.state ? part.state.metadata?.[key] : undefined) ?? part.metadata?.[key];
}
function upsertSession(running, info) {
  if (!info.parentID)
    return false;
  const existing = running.get(info.id);
  if (existing) {
    let changed = false;
    if (info.agent && info.agent !== existing.agent) {
      existing.agent = info.agent;
      changed = true;
    }
    if (info.title && info.title !== existing.title) {
      existing.title = info.title;
      changed = true;
    }
    return changed;
  }
  return true;
}
var plugin = {
  id: "opencode-agent-pulse:tui",
  tui: async (api, options, _meta) => {
    const notifCfg = options?.notifications;
    const notifySubagents = notifCfg?.subagents ?? true;
    const notifyMainSession = notifCfg?.mainSession ?? true;
    const notifyInterview = notifCfg?.interview ?? true;
    const notifyOnlyWhenUnfocused = notifCfg?.onlyWhenUnfocused ?? false;
    const locale = resolveLocale(options?.locale);
    const showFocus = options?.sidebar?.showFocus ?? false;
    const running = new Map;
    const [runningEntries, setRunningEntries] = createSignal([]);
    const [collapsed, setCollapsed] = createSignal(false);
    const taskParts = new Map;
    let activeTaskCount = 0;
    let roundNotified = false;
    const mainArmed = new Set;
    const pendingQuestions = new Set;
    const pendingPermissions = new Map;
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
    api.renderer.on("focus", onFocus);
    api.renderer.on("blur", onBlur);
    const notifyGate = {
      onlyWhenUnfocused: notifyOnlyWhenUnfocused,
      focused: async () => {
        const win = await isTerminalFocused();
        refreshFocusDiag();
        return win ?? focused;
      }
    };
    const syncEntries = () => setRunningEntries([...running.entries()]);
    const unsubs = [];
    api.client.session.list().then((result) => {
      const sessions = result.data ?? [];
      let changed = false;
      for (const session of sessions) {
        if (upsertSession(running, session))
          changed = true;
      }
      if (changed)
        syncEntries();
    }).catch(() => {});
    unsubs.push(api.event.on("session.created", (event) => {
      const parentID = event.properties?.info?.parentID;
      if (!parentID)
        return;
      running.set(event.properties.sessionID, {
        agent: event.properties.info.agent ?? "?",
        status: "idle",
        since: Date.now(),
        frozen: 0,
        title: event.properties.info.title || undefined
      });
      syncEntries();
    }));
    unsubs.push(api.event.on("session.updated", (event) => {
      if (upsertSession(running, event.properties.info)) {
        syncEntries();
      }
    }));
    unsubs.push(api.event.on("session.status", (event) => {
      const sessionID = event.properties.sessionID;
      const type = event.properties.status.type;
      if (!running.has(sessionID)) {
        if (type === "busy" || type === "retry") {
          mainArmed.add(sessionID);
        } else if (type === "idle") {
          if (mainArmed.has(sessionID)) {
            mainArmed.delete(sessionID);
            if (notifyMainSession) {
              notifyTurnDone(api, notifyGate, locale).catch(() => {});
            }
          }
        }
      }
      const info = running.get(sessionID);
      if (!info)
        return;
      if (type === "busy" || type === "retry") {
        if (info.status !== "busy" && info.status !== "retry") {
          info.since = Date.now();
        }
        info.status = type;
      } else if (type === "idle") {
        if (info.status === "busy" || info.status === "retry") {
          info.frozen += Date.now() - info.since;
        }
        if (info.status !== "done") {
          info.status = "idle";
        }
      }
      syncEntries();
    }));
    unsubs.push(api.event.on("message.part.updated", (event) => {
      const part = event.properties.part;
      if (part.type !== "tool" || part.tool !== "task")
        return;
      const status2 = part.state.status;
      const prevStatus = taskParts.get(part.callID);
      taskParts.set(part.callID, status2);
      const wasActive = prevStatus === "pending" || prevStatus === "running";
      const nowActive = status2 === "pending" || status2 === "running";
      if (wasActive && !nowActive) {
        activeTaskCount--;
        if (activeTaskCount === 0) {
          if (!roundNotified) {
            roundNotified = true;
            if (notifySubagents) {
              notifySubagentsDone(api, taskParts.size, notifyGate, locale).catch(() => {});
            }
          }
        }
      } else if (!wasActive && nowActive) {
        if (activeTaskCount === 0)
          roundNotified = false;
        activeTaskCount++;
      }
      const childID = (typeof toolMetadata(part, "sessionId") === "string" ? toolMetadata(part, "sessionId") : undefined) ?? (typeof toolMetadata(part, "sessionID") === "string" ? toolMetadata(part, "sessionID") : undefined);
      if (typeof childID !== "string")
        return;
      const info = running.get(childID);
      if (!info)
        return;
      const input = part.state.input;
      if (typeof input.description === "string" && input.description.trim()) {
        info.title = input.description.trim();
      }
      if (typeof input.subagent_type === "string" && input.subagent_type.trim()) {
        info.agent = input.subagent_type.trim();
      }
      if (part.state.status === "running") {
        if (info.status !== "busy" && info.status !== "retry") {
          info.since = Date.now();
        }
        info.status = "busy";
      } else if (part.state.status === "completed" || part.state.status === "error") {
        if (info.status === "busy" || info.status === "retry") {
          info.frozen += Date.now() - info.since;
        }
        info.status = "done";
      }
      syncEntries();
    }));
    unsubs.push(api.event.on("session.deleted", (event) => {
      mainArmed.delete(event.properties.sessionID);
      if (running.delete(event.properties.sessionID)) {
        syncEntries();
      }
    }));
    unsubs.push(api.event.on("session.error", (event) => {
      const sessionID = event.properties.sessionID;
      if (!sessionID)
        return;
      const info = running.get(sessionID);
      if (info) {
        if (info.status === "busy" || info.status === "retry") {
          info.frozen += Date.now() - info.since;
        }
        info.status = "done";
        syncEntries();
      }
    }));
    unsubs.push(api.event.on("question.asked", (event) => {
      const { id, sessionID, questions } = event.properties;
      if (!notifyInterview || running.has(sessionID) || pendingQuestions.has(id))
        return;
      pendingQuestions.add(id);
      const first = questions?.[0];
      notifyInterviewInput(api, "question", first?.question || first?.header, notifyGate, locale).catch(() => {});
    }));
    unsubs.push(api.event.on("question.replied", (event) => {
      pendingQuestions.delete(event.properties.requestID);
    }));
    unsubs.push(api.event.on("question.rejected", (event) => {
      pendingQuestions.delete(event.properties.requestID);
    }));
    const PERMISSION_NOTIFY_DELAY_MS = 500;
    unsubs.push(api.event.on("permission.asked", (event) => {
      const { id, sessionID, permission } = event.properties;
      if (!notifyInterview || running.has(sessionID) || pendingPermissions.has(id))
        return;
      const timer = setTimeout(() => {
        if (pendingPermissions.delete(id)) {
          notifyInterviewInput(api, "permission", permission, notifyGate, locale).catch(() => {});
        }
      }, PERMISSION_NOTIFY_DELAY_MS);
      pendingPermissions.set(id, timer);
    }));
    unsubs.push(api.event.on("permission.replied", (event) => {
      const { requestID } = event.properties;
      const timer = pendingPermissions.get(requestID);
      if (timer) {
        clearTimeout(timer);
        pendingPermissions.delete(requestID);
      }
    }));
    const ticker = setInterval(() => {
      let active = false;
      for (const info of running.values()) {
        if (info.status === "busy" || info.status === "retry") {
          active = true;
          break;
        }
      }
      if (active)
        syncEntries();
    }, 1000);
    api.lifecycle.onDispose(() => {
      clearInterval(ticker);
      api.renderer.off("focus", onFocus);
      api.renderer.off("blur", onBlur);
      for (const timer of pendingPermissions.values()) {
        clearTimeout(timer);
      }
      pendingPermissions.clear();
      unsubs.forEach((unsub) => unsub());
    });
    api.slots.register({
      order: 950,
      slots: {
        sidebar_content(_ctx, _props) {
          const isCollapsed = collapsed();
          const entries = runningEntries();
          const theme = api.theme.current;
          const header = box({
            width: "100%",
            flexDirection: "row",
            onMouseDown: () => setCollapsed((value) => !value)
          }, [
            text({ fg: theme.accent }, [`${isCollapsed ? "▸" : "▾"} ${t(locale).subagents}`]),
            text({ fg: theme.textMuted }, entries.length > 0 ? [` (${entries.length})`] : [])
          ]);
          if (isCollapsed) {
            return box({ width: "100%", flexDirection: "column" }, [header]);
          }
          const focusLine = (() => {
            if (!showFocus)
              return [];
            const diag = focusDiag();
            const flag = diag.lastResult === true ? "●focused" : diag.lastResult === false ? "○blurred" : "?unknown";
            const src = diag.lastForegroundPid !== undefined ? ` fg=${diag.lastForegroundPid}` : "";
            const err = diag.lastError ? ` err=${diag.lastError}` : "";
            return [
              text({ fg: theme.textMuted }, [
                `  focus[${diag.backend}${diag.ancestorCount ? `:${diag.ancestorCount}` : ""}] ${flag}${src}${err}`
              ])
            ];
          })();
          const rows = entries.map(([sessionID, info]) => {
            const isActive = info.status === "busy";
            const statusColor = isActive ? theme.success : info.status === "retry" ? theme.warning : theme.textMuted;
            return box({
              width: "100%",
              flexDirection: "row",
              paddingLeft: 1,
              onMouseDown: (event) => {
                if (event.button !== undefined && event.button !== 0)
                  return;
                api.route.navigate("session", { sessionID });
              }
            }, [
              text({ fg: statusColor }, [`●`]),
              text({ fg: theme.text }, [` ${info.agent}`]),
              text({ fg: statusColor }, [` ${info.status}`]),
              text({ fg: theme.textMuted }, [` ${formatDuration(entryElapsed(info))}`])
            ]);
          });
          return box({ width: "100%", flexDirection: "column" }, [header, ...focusLine, ...rows]);
        }
      }
    });
  }
};
var tui_default = plugin;
export {
  tui_default as default
};

//# debugId=371C9A92EE23DC7264756E2164756E21
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL3R1aS50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL2kxOG4udHMiLCJmaWxlOi8vL0M6L1VzZXJzL1pvdXl1L3JlcG9zL29wZW5jb2RlLWFnZW50LXB1bHNlL3NyYy9ub3RpZmljYXRpb24udHMiLCJmaWxlOi8vL0M6L1VzZXJzL1pvdXl1L3JlcG9zL29wZW5jb2RlLWFnZW50LXB1bHNlL3NyYy93aW5kb3dzLWZvY3VzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVHVpUGx1Z2luTW9kdWxlIH0gZnJvbSBcIkBvcGVuY29kZS1haS9wbHVnaW4vdHVpXCI7XG5pbXBvcnQgdHlwZSB7IFNlc3Npb24sIFRvb2xQYXJ0IH0gZnJvbSBcIkBvcGVuY29kZS1haS9zZGsvdjJcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIGluc2VydCwgc2V0UHJvcCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHR5cGUgeyBKU1ggfSBmcm9tIFwiQG9wZW50dWkvc29saWRcIjtcbmltcG9ydCB7IGNyZWF0ZVNpZ25hbCB9IGZyb20gXCJzb2xpZC1qc1wiO1xuaW1wb3J0IHR5cGUgeyBOb3RpZnlHYXRlIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uXCI7XG5pbXBvcnQgeyBub3RpZnlJbnRlcnZpZXdJbnB1dCwgbm90aWZ5U3ViYWdlbnRzRG9uZSwgbm90aWZ5VHVybkRvbmUgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25cIjtcbmltcG9ydCB7IHJlc29sdmVMb2NhbGUsIHQgfSBmcm9tIFwiLi9pMThuXCI7XG5pbXBvcnQgeyBlbnN1cmVXaW5kb3dzRm9jdXNJbml0LCBnZXRGb2N1c1N0YXR1cywgaXNUZXJtaW5hbEZvY3VzZWQgfSBmcm9tIFwiLi93aW5kb3dzLWZvY3VzXCI7XG5cbi8qKlxuICogU2lkZWJhciB3aWRnZXQgdGhhdCBsaXZlLXRyYWNrcyBydW5uaW5nIHN1YmFnZW50cyAoc3ViLXNlc3Npb25zKS5cbiAqXG4gKiBEYXRhIHNvdXJjZSAoc2Vzc2lvbiBldmVudHMgKyB0YXNrIHRvb2wgcGFydHMpOlxuICogICAtIGBzZXNzaW9uLmNyZWF0ZWRgICAgICAgICAgLT4gaWRlbnRpZnkgc3ViLXNlc3Npb25zIHZpYSBgcHJvcGVydGllcy5pbmZvLnBhcmVudElEYFxuICogICAtIGBzZXNzaW9uLnVwZGF0ZWRgICAgICAgICAgLT4gYmFja2ZpbGw6IHJlc3VtZWQvZXhpc3Rpbmcgc3ViLXNlc3Npb25zIG5ldmVyIGVtaXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgc2Vzc2lvbi5jcmVhdGVkYCwgYnV0IGBTZXNzaW9uLnBhdGNoYCBwdWJsaXNoZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgc2Vzc2lvbi51cGRhdGVkYCB3aXRoIHRoZSBmdWxsIFNlc3Npb24gKHBhcmVudElEICtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZ2VudCArIHRpdGxlKSB3aGVuZXZlciB0aGUgc2Vzc2lvbiBpcyB0b3VjaGVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGUuZy4gb24gbWVzc2FnZSBhY3Rpdml0eSkuIFVzZWQgdG8gYWRkIG1pc3NpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyaWVzIGFuZCByZWZyZXNoIGFnZW50L3RpdGxlIHdpdGhvdXQgcmVzZXR0aW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzIG9yIHRpbWVycy5cbiAqICAgLSBgc2Vzc2lvbi5zdGF0dXNgICAgICAgICAgIC0+IGBwcm9wZXJ0aWVzLnN0YXR1cy50eXBlYCAoXCJidXN5XCIgfCBcImlkbGVcIiB8IFwicmV0cnlcIilcbiAqICAgLSBgbWVzc2FnZS5wYXJ0LnVwZGF0ZWRgICAgIC0+IHRhc2sgdG9vbCBwYXJ0IChgcGFydC50b29sID09PSBcInRhc2tcImApIHJlcG9ydHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWItc2Vzc2lvbiBsaWZlY3ljbGU6IGBwYXJ0LnN0YXRlLnN0YXR1c2AgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJ1bm5pbmdcIiAobWFyayBidXN5KSBvciBcImNvbXBsZXRlZFwiL1wiZXJyb3JcIlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYXJrIGRvbmUpLiBDaGlsZCBzZXNzaW9uIGlzIGxpbmtlZCB2aWEgbWV0YWRhdGFcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgc2Vzc2lvbklkYC9gc2Vzc2lvbklEYCAoc3RhdGUubWV0YWRhdGEgZmlyc3QsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiBwYXJ0Lm1ldGFkYXRhKS4gVGhpcyBtaXJyb3JzIHRoZSBidWlsdC1pblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmFnZW50IHBhbmVsIChzdWJhZ2VudC1kYXRhLnRzKTsgYHNlc3Npb24uaWRsZWBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBkZXByZWNhdGVkIGFuZCBub3QgYSBjb21wbGV0aW9uIHNpZ25hbC5cbiAqICAgLSBgc2Vzc2lvbi5kZWxldGVkYCAvIGBzZXNzaW9uLmVycm9yYCAtPiByZW1vdmUgLyBtYXJrIGRvbmVcbiAqXG4gKiBCb290c3RyYXA6IG9uIHN0YXJ0dXAsIGBhcGkuY2xpZW50LnNlc3Npb24ubGlzdCgpYCBiYWNrZmlsbHMgc3ViLXNlc3Npb25zIHRoYXRcbiAqIGFscmVhZHkgZXhpc3QgKGUuZy4gYSByZXN1bWVkIHBhcmVudCBzZXNzaW9uJ3MgY2hpbGRyZW4pIHNvIHRoZSBzaWRlYmFyIHNob3dzIHRoZW1cbiAqIGV2ZW4gdGhvdWdoIGBzZXNzaW9uLmNyZWF0ZWRgIHdhcyBuZXZlciBlbWl0dGVkIGZvciB0aGVtLlxuICpcbiAqIFJlbmRlcmluZyBmb2xsb3dzIHRoZSBwcm9kdWN0aW9uIHBhdHRlcm4gb2Ygb2gtbXktb3BlbmNvZGUtc2xpbTogcGxhaW4gZnVuY3Rpb24tY2FsbFxuICogaGVscGVycyAoYGJveGAvYHRleHRgKSBidWlsdCBvbiBgQG9wZW50dWkvc29saWRgJ3MgYGNyZWF0ZUVsZW1lbnRgL2BpbnNlcnRgL2BzZXRQcm9wYCxcbiAqIHNvIG5vIEpTWC9iYWJlbCB0cmFuc2Zvcm0gaXMgcmVxdWlyZWQuXG4gKlxuICogSU1QT1JUQU5UOiBpbnRlcmFjdGl2ZSBzdGF0ZSBpcyBoZWxkIGluIHNvbGlkIHNpZ25hbHMgKGBjcmVhdGVTaWduYWxgKSwgcmVhZCBkaXJlY3RseVxuICogaW5zaWRlIHRoZSBzbG90IHJlbmRlcmVyLiBUaGlzIGlzIHRoZSBzYW1lIG1lY2hhbmlzbSB0aGUgYnVpbHQtaW4gTUNQIGJsb2NrIHVzZXNcbiAqIChgY3JlYXRlU2lnbmFsYCArIHJlYWN0aXZlIHJlLXJlbmRlcikuIGBhcGkucmVuZGVyZXIucmVxdWVzdFJlbmRlcigpYCBkb2VzIE5PVCByZS1pbnZva2VcbiAqIHRoZSBgc2lkZWJhcl9jb250ZW50YCBzbG90IHJlbmRlcmVyICh2ZXJpZmllZCBhZ2FpbnN0IEBvcGVudHVpL3NvbGlkIDAuNC4zLzAuNS4xIFNsb3QpLFxuICogc28gYSBwbGFpbiBtZW1vcnkgdmFyaWFibGUgKyByZXF1ZXN0UmVuZGVyIHdvdWxkIG5ldmVyIHVwZGF0ZSB0aGUgVUkuXG4gKi9cblxudHlwZSBTdWJhZ2VudFN0YXR1cyA9IFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCIgfCBcImRvbmVcIjtcblxudHlwZSBTdWJhZ2VudEluZm8gPSB7XG4gIGFnZW50OiBzdHJpbmc7XG4gIHN0YXR1czogU3ViYWdlbnRTdGF0dXM7XG4gIHNpbmNlOiBudW1iZXI7IC8vIGVwb2NoIG1zIHdoZW4gdGhlIGN1cnJlbnQgYnVzeSBydW4gc3RhcnRlZCAodGlja3Mgd2hpbGUgYnVzeS9yZXRyeSlcbiAgZnJvemVuOiBudW1iZXI7IC8vIGFjY3VtdWxhdGVkIGVsYXBzZWQgbXMgZnJvbSBwcmV2aW91cyBidXN5IHJ1bnMgKGZyb3plbiB3aGlsZSBpZGxlL2RvbmUpXG4gIHRpdGxlPzogc3RyaW5nOyAvLyBjdXN0b20gbmFtZTogdGFzayB0b29sIGlucHV0LmRlc2NyaXB0aW9uLCBvciBzZXNzaW9uIHRpdGxlIGFzIGZhbGxiYWNrXG59O1xuXG50eXBlIFJ1bm5pbmdFbnRyeSA9IFtzZXNzaW9uSUQ6IHN0cmluZywgaW5mbzogU3ViYWdlbnRJbmZvXTtcblxuZnVuY3Rpb24gZWxlbWVudCh0YWc6IHN0cmluZywgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge30sIGNoaWxkcmVuOiB1bmtub3duW10gPSBbXSk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3Qgbm9kZSA9IGNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMpKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHNldFByb3Aobm9kZSwga2V5LCB2YWx1ZSk7XG4gIH1cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChjaGlsZCA9PT0gbnVsbCB8fCBjaGlsZCA9PT0gdW5kZWZpbmVkIHx8IGNoaWxkID09PSBmYWxzZSkgY29udGludWU7XG4gICAgaW5zZXJ0KG5vZGUsIGNoaWxkKTtcbiAgfVxuICByZXR1cm4gbm9kZSBhcyB1bmtub3duIGFzIEpTWC5FbGVtZW50O1xufVxuXG5mdW5jdGlvbiB0ZXh0KHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgY2hpbGRyZW46IHVua25vd25bXSA9IFtdKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gZWxlbWVudChcInRleHRcIiwgcHJvcHMsIGNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gYm94KHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgY2hpbGRyZW46IHVua25vd25bXSA9IFtdKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gZWxlbWVudChcImJveFwiLCBwcm9wcywgY2hpbGRyZW4pO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREdXJhdGlvbihlbGFwc2VkTXM6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IHRvdGFsU2Vjb25kcyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3IoZWxhcHNlZE1zIC8gMTAwMCkpO1xuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyA2MCk7XG4gIGNvbnN0IHNlY29uZHMgPSB0b3RhbFNlY29uZHMgJSA2MDtcbiAgcmV0dXJuIG1pbnV0ZXMgPiAwID8gYCR7bWludXRlc31tJHtzZWNvbmRzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfXNgIDogYCR7c2Vjb25kc31zYDtcbn1cblxuLy8gU2hvd24gZWxhcHNlZCB0aW1lOiB0aWNrcyBvbmx5IHdoaWxlIGJ1c3kvcmV0cnk7IGZyb3plbiB3aGlsZSBpZGxlL2RvbmUuXG5mdW5jdGlvbiBlbnRyeUVsYXBzZWQoaW5mbzogU3ViYWdlbnRJbmZvKTogbnVtYmVyIHtcbiAgcmV0dXJuIGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiXG4gICAgPyBpbmZvLmZyb3plbiArIChEYXRlLm5vdygpIC0gaW5mby5zaW5jZSlcbiAgICA6IGluZm8uZnJvemVuO1xufVxuXG4vLyBSZWFkIGEgdGFzayB0b29sIHBhcnQncyBtZXRhZGF0YSB2YWx1ZS4gTWlycm9ycyBzdWJhZ2VudC1kYXRhLnRzIGBtZXRhZGF0YSgpYDpcbi8vIHByZWZlciBgc3RhdGUubWV0YWRhdGFgLCBmYWxsIGJhY2sgdG8gYHBhcnQubWV0YWRhdGFgLiBPbmx5IHNvbWUgVG9vbFN0YXRlIHZhcmlhbnRzXG4vLyBjYXJyeSBtZXRhZGF0YSwgc28gbmFycm93IHZpYSBgXCJtZXRhZGF0YVwiIGluIHN0YXRlYCBleGFjdGx5IGxpa2UgdGhlIGJ1aWx0LWluIHBhbmVsLlxuZnVuY3Rpb24gdG9vbE1ldGFkYXRhKHBhcnQ6IFRvb2xQYXJ0LCBrZXk6IHN0cmluZyk6IHVua25vd24ge1xuICByZXR1cm4gKFwibWV0YWRhdGFcIiBpbiBwYXJ0LnN0YXRlID8gcGFydC5zdGF0ZS5tZXRhZGF0YT8uW2tleV0gOiB1bmRlZmluZWQpID8/IHBhcnQubWV0YWRhdGE/LltrZXldO1xufVxuXG4vLyBBZGQgYSBzdWItc2Vzc2lvbiB0byB0aGUgcnVubmluZyBtYXAgZnJvbSBhIGZ1bGwgU0RLIFNlc3Npb24gKHNlc3Npb24uY3JlYXRlZCAvXG4vLyBzZXNzaW9uLnVwZGF0ZWQgLyBib290c3RyYXApLiBLZWVwcyBhbnkgZXhpc3RpbmcgZW50cnkncyBzdGF0dXMgYW5kIHRpbWVycyBpbnRhY3QuXG4vLyBSZXR1cm5zIHRydWUgaWYgdGhlIG1hcCBjaGFuZ2VkIChuZXcgZW50cnksIG9yIHJlZnJlc2hlZCBhZ2VudC90aXRsZSkuXG5mdW5jdGlvbiB1cHNlcnRTZXNzaW9uKHJ1bm5pbmc6IE1hcDxzdHJpbmcsIFN1YmFnZW50SW5mbz4sIGluZm86IFNlc3Npb24pOiBib29sZWFuIHtcbiAgaWYgKCFpbmZvLnBhcmVudElEKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IGV4aXN0aW5nID0gcnVubmluZy5nZXQoaW5mby5pZCk7XG4gIGlmIChleGlzdGluZykge1xuICAgIC8vIE9ubHkgcmVmcmVzaCBtZXRhZGF0YTsgbmV2ZXIgcmVzZXQgc3RhdHVzL2Nsb2NrIG9mIGEgdHJhY2tlZCBlbnRyeS5cbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIGlmIChpbmZvLmFnZW50ICYmIGluZm8uYWdlbnQgIT09IGV4aXN0aW5nLmFnZW50KSB7XG4gICAgICBleGlzdGluZy5hZ2VudCA9IGluZm8uYWdlbnQ7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGluZm8udGl0bGUgJiYgaW5mby50aXRsZSAhPT0gZXhpc3RpbmcudGl0bGUpIHtcbiAgICAgIGV4aXN0aW5nLnRpdGxlID0gaW5mby50aXRsZTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlZDtcbiAgfVxuICAvLyBVbmNvbW1lbnQgdGhpcyB0byBzaG93IGFsbCBpZGxlIHN1YmFnZW50c1xuICAvLyBydW5uaW5nLnNldChpbmZvLmlkLCB7XG4gIC8vICAgYWdlbnQ6IGluZm8uYWdlbnQgPz8gXCI/XCIsXG4gIC8vICAgc3RhdHVzOiBcImlkbGVcIixcbiAgLy8gICBzaW5jZTogRGF0ZS5ub3coKSxcbiAgLy8gICBmcm96ZW46IDAsXG4gIC8vICAgdGl0bGU6IGluZm8udGl0bGUgfHwgdW5kZWZpbmVkLFxuICAvLyB9KTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IHBsdWdpbjogVHVpUGx1Z2luTW9kdWxlID0ge1xuICBpZDogXCJvcGVuY29kZS1hZ2VudC1wdWxzZTp0dWlcIixcbiAgdHVpOiBhc3luYyAoYXBpLCBvcHRpb25zLCBfbWV0YSkgPT4ge1xuICAgIC8vIE5vdGlmaWNhdGlvbiB0b2dnbGVzIGZyb20gcGx1Z2luIG9wdGlvbnMgKHJlZ2lzdGVyZWQgdmlhIHRoZSB0dXBsZSBmb3JtOlxuICAgIC8vIFtcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsIHsgXCJub3RpZmljYXRpb25zXCI6IHsgLi4uIH0gfV0pLlxuICAgIGNvbnN0IG5vdGlmQ2ZnID0gKG9wdGlvbnMgYXNcbiAgICAgIHwgeyBub3RpZmljYXRpb25zPzogeyBzdWJhZ2VudHM/OiBib29sZWFuOyBtYWluU2Vzc2lvbj86IGJvb2xlYW47IGludGVydmlldz86IGJvb2xlYW47IG9ubHlXaGVuVW5mb2N1c2VkPzogYm9vbGVhbiB9IH1cbiAgICAgIHwgdW5kZWZpbmVkKT8ubm90aWZpY2F0aW9ucztcbiAgICBjb25zdCBub3RpZnlTdWJhZ2VudHMgPSBub3RpZkNmZz8uc3ViYWdlbnRzID8/IHRydWU7XG4gICAgY29uc3Qgbm90aWZ5TWFpblNlc3Npb24gPSBub3RpZkNmZz8ubWFpblNlc3Npb24gPz8gdHJ1ZTtcbiAgICBjb25zdCBub3RpZnlJbnRlcnZpZXcgPSBub3RpZkNmZz8uaW50ZXJ2aWV3ID8/IHRydWU7XG4gICAgLy8gT3B0LWluIFwibm90aWZ5IG9ubHkgd2hlbiB0aGUgdGVybWluYWwgaXMgdW5mb2N1c2VkXCIuIFRoZSBob3N0IHRyYWNrcyBmb2N1cyB2aWFcbiAgICAvLyByZW5kZXJlciBcImZvY3VzXCIvXCJibHVyXCIgZXZlbnRzIChERUMgMTAwNCBmb2N1cyByZXBvcnRpbmcpOyB3ZSBtaXJyb3IgdGhlIHNhbWVcbiAgICAvLyBzb3VyY2UgdGhyb3VnaCBgYXBpLnJlbmRlcmVyYC4gRGVmYXVsdHMgdG8gZmFsc2U6IG5vdGlmaWNhdGlvbnMgZmlyZSByZWdhcmRsZXNzXG4gICAgLy8gb2YgZm9jdXMsIHByZXNlcnZpbmcgdGhlIGN1cnJlbnQgYmVoYXZpb3IuXG4gICAgY29uc3Qgbm90aWZ5T25seVdoZW5VbmZvY3VzZWQgPSBub3RpZkNmZz8ub25seVdoZW5VbmZvY3VzZWQgPz8gZmFsc2U7XG4gICAgLy8gTG9jYWxlIGZvciB1c2VyLWZhY2luZyBzdHJpbmdzIChub3RpZmljYXRpb24gbWVzc2FnZXMgKyBzaWRlYmFyIHNlY3Rpb24gdGl0bGUpLlxuICAgIC8vIFN1cHBvcnRlZDogXCJlblwiIChkZWZhdWx0KSBhbmQgXCJ6aFwiIChTaW1wbGlmaWVkIENoaW5lc2UpLlxuICAgIGNvbnN0IGxvY2FsZSA9IHJlc29sdmVMb2NhbGUoKG9wdGlvbnMgYXMgeyBsb2NhbGU/OiB1bmtub3duIH0gfCB1bmRlZmluZWQpPy5sb2NhbGUpO1xuICAgIC8vIE9wdC1pbiBkZWJ1ZyBkaXNwbGF5OiBzaG93IHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIChmb2N1c2VkL2JsdXJyZWQgKyBiYWNrZW5kKSBhc1xuICAgIC8vIGEgc21hbGwgbGluZSBpbiB0aGUgc2lkZWJhci4gRGVmYXVsdHMgdG8gZmFsc2U6IGhpZGRlbiB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLlxuICAgIGNvbnN0IHNob3dGb2N1cyA9IChvcHRpb25zIGFzIHsgc2lkZWJhcj86IHsgc2hvd0ZvY3VzPzogYm9vbGVhbiB9IH0gfCB1bmRlZmluZWQpPy5zaWRlYmFyPy5zaG93Rm9jdXMgPz8gZmFsc2U7XG4gICAgLy8gU291cmNlIG9mIHRydXRoIGZvciBsb29rdXBzIChzZXNzaW9uSUQgLT4gaW5mbykuIFJlbmRlcmVkIHZpYSBgcnVubmluZ0VudHJpZXNgXG4gICAgLy8gc2lnbmFsIGJlbG93IHNvIHNvbGlkIHJlYWN0aXZpdHkgcmUtcmVuZGVycyB0aGUgc2xvdCBvbiBldmVyeSBjaGFuZ2UuXG4gICAgY29uc3QgcnVubmluZyA9IG5ldyBNYXA8c3RyaW5nLCBTdWJhZ2VudEluZm8+KCk7XG4gICAgY29uc3QgW3J1bm5pbmdFbnRyaWVzLCBzZXRSdW5uaW5nRW50cmllc10gPSBjcmVhdGVTaWduYWw8UnVubmluZ0VudHJ5W10+KFtdKTtcbiAgICAvLyBDb2xsYXBzZSBzdGF0ZSwgbWF0Y2hlcyBNQ1AvVE9ETyBzZWN0aW9uIGludGVyYWN0aW9uIChidWlsdC1pbiB1c2VzIGNyZWF0ZVNpZ25hbCB0b28pLlxuICAgIGNvbnN0IFtjb2xsYXBzZWQsIHNldENvbGxhcHNlZF0gPSBjcmVhdGVTaWduYWwoZmFsc2UpO1xuXG4gICAgLy8gLS0tIE5vdGlmaWNhdGlvbiBzdGF0ZSAtLS1cbiAgICAvLyBcIkFsbCBzdWJhZ2VudHMgZG9uZVwiIGRldGVjdGlvbjogdHJhY2sgZXZlcnkgdGFzayB0b29sIHBhcnQncyBsaWZlY3ljbGUgc28gd2UgY2FuXG4gICAgLy8gbm90aWZ5IG9uY2Ugd2hlbiBhIHdob2xlIGRlbGVnYXRpb24gcm91bmQgZHJhaW5zIHRvIHplcm8gYWN0aXZlIHBhcnRzLlxuICAgIGNvbnN0IHRhc2tQYXJ0cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IC8vIGNhbGxJRCAtPiBjdXJyZW50IHN0YXR1c1xuICAgIGxldCBhY3RpdmVUYXNrQ291bnQgPSAwOyAvLyAjIHRhc2sgcGFydHMgY3VycmVudGx5IFwicGVuZGluZ1wiIG9yIFwicnVubmluZ1wiXG4gICAgbGV0IHJvdW5kTm90aWZpZWQgPSBmYWxzZTsgLy8gZGVkdXA6IGhhcyB0aGUgY3VycmVudCBiYXRjaCBhbHJlYWR5IGJlZW4gYW5ub3VuY2VkP1xuICAgIC8vIFwiVHVybiBkb25lXCIgZGV0ZWN0aW9uOiBtYWluIChub24tc3ViKSBzZXNzaW9ucyBvbmx5LiBXZSBub3RpZnkgb24gdGhlIGJ1c3ktPmlkbGVcbiAgICAvLyB0cmFuc2l0aW9uIG9mIGEgbWFpbiBzZXNzaW9uLCB3aGljaCBmaXJlcyBvbmNlIHBlciByb3VuZC4gQXJtZWQgc2V0IGtleWVkIGJ5XG4gICAgLy8gc2Vzc2lvbklEIHNvIG11bHRpcGxlIHRvcC1sZXZlbCBzZXNzaW9ucyBkb24ndCBpbnRlcmZlcmU7IG1pcnJvcnMgdGhlIGJ1aWx0LWluXG4gICAgLy8gbm90aWZpY2F0aW9ucyBwbHVnaW4gYmVoYXZpb3IuXG4gICAgY29uc3QgbWFpbkFybWVkID0gbmV3IFNldDxzdHJpbmc+KCk7IC8vIHNlc3Npb25JRHMgYXJtZWQgb24gYnVzeS9yZXRyeSwgZmlyZWQgb24gaWRsZVxuICAgIC8vIFwiSW50ZXJ2aWV3IGJsb2NrZWRcIiBkZXRlY3Rpb246IHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBpcyBzdXNwZW5kZWQgd2FpdGluZyBmb3IgdXNlclxuICAgIC8vIGlucHV0IChgcXVlc3Rpb25gIHRvb2wgb3IgcGVybWlzc2lvbiBhcHByb3ZhbCksIG5vdGlmeSBvbmNlIHBlciBwZW5kaW5nIHJlcXVlc3QuXG4gICAgLy8gcXVlc3Rpb24uYXNrZWQgLyBwZXJtaXNzaW9uLmFza2VkIGFyZSB0aGUgYXV0aG9yaXRhdGl2ZSBzaWduYWxzIOKAlCB0aGUgYWdlbnQgaXNcbiAgICAvLyBwYXJrZWQgb24gYSBEZWZlcnJlZCwgc28gbm8gc2Vzc2lvbi5zdGF0dXMgY2hhbmdlIGlzIGVtaXR0ZWQuIERlZHVwIGJ5IHJlcXVlc3QgaWRcbiAgICAvLyBhbmQgY2xlYXIgb24gcmVwbGllZC9yZWplY3RlZCAobWlycm9ycyB0aGUgYnVpbHQtaW4gbm90aWZpY2F0aW9ucyBwbHVnaW4pLlxuICAgIGNvbnN0IHBlbmRpbmdRdWVzdGlvbnMgPSBuZXcgU2V0PHN0cmluZz4oKTsgLy8gcXVlc3Rpb24gcmVxdWVzdCBpZHMgYXdhaXRpbmcgYW4gYW5zd2VyXG4gICAgLy8gUGVybWlzc2lvbiByZXF1ZXN0cyBhd2FpdGluZyBhIHJlcGx5LiBWYWx1ZXMgaG9sZCB0aGUgZGVmZXJyZWQtbm90aWZpY2F0aW9uIHRpbWVyXG4gICAgLy8gc28gaXQgY2FuIGJlIGNhbmNlbGxlZCB3aGVuIGEgcmVwbHkgYXJyaXZlcyAoc2VlIHRoZSBwZXJtaXNzaW9uLmFza2VkIGhhbmRsZXIpLlxuICAgIGNvbnN0IHBlbmRpbmdQZXJtaXNzaW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0Pj4oKTtcblxuICAgIC8vIC0tLSBUZXJtaW5hbCBmb2N1cyB0cmFja2luZyAtLS1cbiAgICAvLyBgdW5kZWZpbmVkYCA9IHVua25vd24gKGUuZy4gV2luZG93cyBUZXJtaW5hbCBuZXZlciByZXBvcnRzIERFQyAxMDA0IGZvY3VzIGV2ZW50cyxcbiAgICAvLyBzbyBubyBcImZvY3VzXCIvXCJibHVyXCIgd2lsbCBldmVyIGZpcmUgYW5kIG5vdGlmaWNhdGlvbnMgc3RheSBlbmFibGVkIHRoZXJlKS4gT25seSBhXG4gICAgLy8gZGVmaW5pdGl2ZSBcImZvY3VzZWRcIiBzdGF0ZSBzdXBwcmVzc2VzIG5vdGlmaWNhdGlvbnMgd2hlbiB0aGUgb3B0aW9uIGlzIGVuYWJsZWQuXG4gICAgLy9cbiAgICAvLyBPbiBXaW5kb3dzIHRoZSByZW5kZXJlcidzIERFQyAxMDA0IGJsdXIgZXZlbnQgb2Z0ZW4gbmV2ZXIgYXJyaXZlcyAoZm9jdXMtaW4gZmlyZXNcbiAgICAvLyBhdCBzdGFydHVwLCBmb2N1cy1vdXQgaXMgZHJvcHBlZCksIHdoaWNoIHdvdWxkIHBlcm1hbmVudGx5IHNldCBgZm9jdXNlZCA9IHRydWVgLlxuICAgIC8vIEFzIGEgcmVsaWFibGUgZmFsbGJhY2sgd2UgcXVlcnkgdGhlIFdpbjMyIGZvcmVncm91bmQgd2luZG93IHZpYSBgYnVuOmZmaWAgaW5zdGVhZDpcbiAgICAvLyB0aGUgdGVybWluYWwgaG9zdGluZyB1cyBpcyBhbiBhbmNlc3RvciBwcm9jZXNzLCBzbyBcImZvcmVncm91bmQgd2luZG93IFBJRCBpcyBpbiBvdXJcbiAgICAvLyBhbmNlc3RvciBjaGFpblwiIG1lYW5zIHRoZSB0ZXJtaW5hbCBoYXMgZm9jdXMuIFJlbmRlcmVyIGV2ZW50cyByZW1haW4gdGhlIHNvdXJjZSBvblxuICAgIC8vIG5vbi1XaW5kb3dzIGFuZCBhcyBhIHNlY29uZGFyeSBzaWduYWwgZXZlcnl3aGVyZSBlbHNlLlxuICAgIGVuc3VyZVdpbmRvd3NGb2N1c0luaXQoKTtcbiAgICBsZXQgZm9jdXNlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvLyBEZWJ1ZyBzdXJmYWNlOiBleHBvc2UgdGhlIGZvY3VzIGJhY2tlbmQgKyBsYXN0IHJlc3VsdCBpbiB0aGUgc2lkZWJhciBzbyB3ZSBjYW5cbiAgICAvLyB2ZXJpZnkgdGhlIGdhdGUgd2l0aG91dCByZWx5aW5nIG9uIGZpbGUgbG9ncyAod2hpY2ggbWF5IGJlIGJsb2NrZWQgaW4gdGhlIHJ1bnRpbWUpLlxuICAgIGNvbnN0IFtmb2N1c0RpYWcsIHNldEZvY3VzRGlhZ10gPSBjcmVhdGVTaWduYWwoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3QgcmVmcmVzaEZvY3VzRGlhZyA9ICgpID0+IHNldEZvY3VzRGlhZyhnZXRGb2N1c1N0YXR1cygpKTtcbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IHRydWU7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgICBmb2N1c2VkID0gZmFsc2U7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJmb2N1c1wiLCBvbkZvY3VzKTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJibHVyXCIsIG9uQmx1cik7XG4gICAgY29uc3Qgbm90aWZ5R2F0ZTogTm90aWZ5R2F0ZSA9IHtcbiAgICAgIG9ubHlXaGVuVW5mb2N1c2VkOiBub3RpZnlPbmx5V2hlblVuZm9jdXNlZCxcbiAgICAgIGZvY3VzZWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gYXdhaXQgaXNUZXJtaW5hbEZvY3VzZWQoKTtcbiAgICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgICAgICByZXR1cm4gd2luID8/IGZvY3VzZWQ7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBzeW5jRW50cmllcyA9ICgpID0+IHNldFJ1bm5pbmdFbnRyaWVzKFsuLi5ydW5uaW5nLmVudHJpZXMoKV0pO1xuXG4gICAgY29uc3QgdW5zdWJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgLy8gQm9vdHN0cmFwOiBiYWNrZmlsbCBzdWItc2Vzc2lvbnMgdGhhdCBhbHJlYWR5IGV4aXN0IChlLmcuIGEgcmVzdW1lZCBwYXJlbnRcbiAgICAvLyBzZXNzaW9uJ3MgY2hpbGRyZW4pLiBSZXN1bWVkIHNlc3Npb25zIG5ldmVyIGVtaXQgc2Vzc2lvbi5jcmVhdGVkLCBzbyB3aXRob3V0XG4gICAgLy8gdGhpcyB0aGUgc2lkZWJhciB3b3VsZCBiZSBibGluZCB0byB0aGVtIHVudGlsIGEgYnJhbmQtbmV3IHN1YmFnZW50IHN0YXJ0cy5cbiAgICBhcGkuY2xpZW50LnNlc3Npb25cbiAgICAgIC5saXN0KClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbnMgPSByZXN1bHQuZGF0YSA/PyBbXTtcbiAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBzZXNzaW9uIG9mIHNlc3Npb25zKSB7XG4gICAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgc2Vzc2lvbikpIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VkKSBzeW5jRW50cmllcygpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIEJlc3QtZWZmb3J0IGJvb3RzdHJhcDsgbGl2ZSBldmVudHMgc3RpbGwgZHJpdmUgdGhlIGxpc3QgYWZ0ZXJ3YXJkcy5cbiAgICAgIH0pO1xuXG4gICAgLy8gc2Vzc2lvbi5jcmVhdGVkOiBvbmx5IHN1Yi1zZXNzaW9ucyBjYXJyeSBhIHBhcmVudElELlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5jcmVhdGVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJlbnRJRCA9IGV2ZW50LnByb3BlcnRpZXM/LmluZm8/LnBhcmVudElEO1xuICAgICAgICBpZiAoIXBhcmVudElEKSByZXR1cm47XG4gICAgICAgIHJ1bm5pbmcuc2V0KGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklELCB7XG4gICAgICAgICAgYWdlbnQ6IGV2ZW50LnByb3BlcnRpZXMuaW5mby5hZ2VudCA/PyBcIj9cIixcbiAgICAgICAgICBzdGF0dXM6IFwiaWRsZVwiLFxuICAgICAgICAgIHNpbmNlOiBEYXRlLm5vdygpLFxuICAgICAgICAgIGZyb3plbjogMCxcbiAgICAgICAgICB0aXRsZTogZXZlbnQucHJvcGVydGllcy5pbmZvLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi51cGRhdGVkOiBmaXJlZCBieSBTZXNzaW9uLnBhdGNoIChlLmcuIHNlc3Npb24gdG91Y2ggb24gbWVzc2FnZSBhY3Rpdml0eSlcbiAgICAvLyB3aXRoIHRoZSBmdWxsIFNlc3Npb24uIEZvciByZXN1bWVkL2V4aXN0aW5nIHN1Yi1zZXNzaW9ucyB0aGlzIGlzIHRoZSBvbmx5IGV2ZW50XG4gICAgLy8gdGhhdCBjYXJyaWVzIHRoZWlyIGlkZW50aXR5LCBzbyB1c2UgaXQgdG8gYmFja2ZpbGwgbWlzc2luZyBlbnRyaWVzIGFuZCByZWZyZXNoXG4gICAgLy8gYWdlbnQvdGl0bGUgd2l0aG91dCBkaXN0dXJiaW5nIHN0YXR1cyBvciB0aGUgZWxhcHNlZCBjbG9jay5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24udXBkYXRlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgZXZlbnQucHJvcGVydGllcy5pbmZvKSkge1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBzZXNzaW9uLnN0YXR1czogYnVzeSAvIGlkbGUgLyByZXRyeS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24uc3RhdHVzXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5wcm9wZXJ0aWVzLnNlc3Npb25JRDtcbiAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50LnByb3BlcnRpZXMuc3RhdHVzLnR5cGU7IC8vIFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCJcblxuICAgICAgICAvLyAtLS0gXCJUdXJuIGRvbmVcIiBub3RpZmljYXRpb24gZm9yIHRoZSBtYWluIChub24tc3ViKSBzZXNzaW9uIC0tLVxuICAgICAgICAvLyBNaXJyb3JzIHRoZSBidWlsdC1pbiBub3RpZmljYXRpb25zIHBsdWdpbjogYXJtIG9uIGJ1c3kvcmV0cnksIGZpcmUgb25jZSBvbiB0aGVcbiAgICAgICAgLy8gZm9sbG93aW5nIGlkbGUsIHRoZW4gZGlzYXJtLiBPbmx5IGZpcmVzIGZvciBzZXNzaW9ucyB0aGF0IGFyZSBub3QgdHJhY2tlZFxuICAgICAgICAvLyBzdWJhZ2VudHMgKHRvcC1sZXZlbC9tYWluIHNlc3Npb25zKS5cbiAgICAgICAgaWYgKCFydW5uaW5nLmhhcyhzZXNzaW9uSUQpKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT09IFwiYnVzeVwiIHx8IHR5cGUgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgbWFpbkFybWVkLmFkZChzZXNzaW9uSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJpZGxlXCIpIHtcbiAgICAgICAgICAgIGlmIChtYWluQXJtZWQuaGFzKHNlc3Npb25JRCkpIHtcbiAgICAgICAgICAgICAgbWFpbkFybWVkLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgICAgICAgICBpZiAobm90aWZ5TWFpblNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBub3RpZnlUdXJuRG9uZShhcGksIG5vdGlmeUdhdGUsIGxvY2FsZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5mbyA9IHJ1bm5pbmcuZ2V0KHNlc3Npb25JRCk7XG4gICAgICAgIGlmICghaW5mbykgcmV0dXJuO1xuICAgICAgICBpZiAodHlwZSA9PT0gXCJidXN5XCIgfHwgdHlwZSA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgLy8gU3RhcnQgYSBuZXcgY291bnRpbmcgcnVuIG9uIGJ1c3kvcmV0cnk7IGtlZXAgYWNjdW11bGF0ZWQgZnJvemVuIHRpbWUuXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSBcImJ1c3lcIiAmJiBpbmZvLnN0YXR1cyAhPT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLnNpbmNlID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5mby5zdGF0dXMgPSB0eXBlO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiaWRsZVwiKSB7XG4gICAgICAgICAgLy8gRnJlZXplIHRoZSBjbG9jayB3aGlsZSBpZGxlOyBrZWVwIFwiZG9uZVwiIGFzIHRoZSB0ZXJtaW5hbCBzdGF0ZS5cbiAgICAgICAgICBpZiAoaW5mby5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGluZm8uc3RhdHVzID09PSBcInJldHJ5XCIpIHtcbiAgICAgICAgICAgIGluZm8uZnJvemVuICs9IERhdGUubm93KCkgLSBpbmZvLnNpbmNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaW5mby5zdGF0dXMgIT09IFwiZG9uZVwiKSB7XG4gICAgICAgICAgICBpbmZvLnN0YXR1cyA9IFwiaWRsZVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW5jRW50cmllcygpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIG1lc3NhZ2UucGFydC51cGRhdGVkOiB0YXNrIHRvb2wgcGFydHMgcmVwb3J0IHRoZSBzdWItc2Vzc2lvbiBsaWZlY3ljbGUuIFRoaXMgaXNcbiAgICAvLyB0aGUgc2FtZSBzb3VyY2UgdGhlIGJ1aWx0LWluIHN1YmFnZW50IHBhbmVsIHVzZXM7IGBzZXNzaW9uLmlkbGVgIGlzIGRlcHJlY2F0ZWQuXG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJtZXNzYWdlLnBhcnQudXBkYXRlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgcGFydCA9IGV2ZW50LnByb3BlcnRpZXMucGFydDtcbiAgICAgICAgaWYgKHBhcnQudHlwZSAhPT0gXCJ0b29sXCIgfHwgcGFydC50b29sICE9PSBcInRhc2tcIikgcmV0dXJuO1xuXG4gICAgICAgIC8vIC0tLSBcIkFsbCBzdWJhZ2VudHMgZG9uZVwiIGRldGVjdGlvbiAoYmF0Y2gtd2lkZSwgaW5kZXBlbmRlbnQgb2YgY2hpbGRJRCkgLS0tXG4gICAgICAgIC8vIFRyYWNrIGV2ZXJ5IHRhc2sgdG9vbCBwYXJ0J3MgbGlmZWN5Y2xlIGtleWVkIGJ5IGNhbGxJRCBzbyB3ZSBjYW4gdGVsbCB3aGVuIGFcbiAgICAgICAgLy8gd2hvbGUgZGVsZWdhdGlvbiBiYXRjaCBkcmFpbnMgdG8gemVybyBhY3RpdmUgcGFydHMuIE5vdGlmeSBvbmNlIHBlciBiYXRjaC5cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gcGFydC5zdGF0ZS5zdGF0dXM7XG4gICAgICAgIGNvbnN0IHByZXZTdGF0dXMgPSB0YXNrUGFydHMuZ2V0KHBhcnQuY2FsbElEKTtcbiAgICAgICAgdGFza1BhcnRzLnNldChwYXJ0LmNhbGxJRCwgc3RhdHVzKTtcblxuICAgICAgICBjb25zdCB3YXNBY3RpdmUgPSBwcmV2U3RhdHVzID09PSBcInBlbmRpbmdcIiB8fCBwcmV2U3RhdHVzID09PSBcInJ1bm5pbmdcIjtcbiAgICAgICAgY29uc3Qgbm93QWN0aXZlID0gc3RhdHVzID09PSBcInBlbmRpbmdcIiB8fCBzdGF0dXMgPT09IFwicnVubmluZ1wiO1xuICAgICAgICBpZiAod2FzQWN0aXZlICYmICFub3dBY3RpdmUpIHtcbiAgICAgICAgICAvLyBBIHByZXZpb3VzbHktYWN0aXZlIHRhc2sganVzdCByZWFjaGVkIGEgdGVybWluYWwgc3RhdGUuXG4gICAgICAgICAgYWN0aXZlVGFza0NvdW50LS07XG4gICAgICAgICAgaWYgKGFjdGl2ZVRhc2tDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gQmF0Y2ggZHJhaW5lZCB0byB6ZXJvIC0+IGFsbCBkZWxlZ2F0ZWQgc3ViYWdlbnRzIGZpbmlzaGVkLlxuICAgICAgICAgICAgaWYgKCFyb3VuZE5vdGlmaWVkKSB7XG4gICAgICAgICAgICAgIHJvdW5kTm90aWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBpZiAobm90aWZ5U3ViYWdlbnRzKSB7XG4gICAgICAgICAgICAgICAgbm90aWZ5U3ViYWdlbnRzRG9uZShhcGksIHRhc2tQYXJ0cy5zaXplLCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghd2FzQWN0aXZlICYmIG5vd0FjdGl2ZSkge1xuICAgICAgICAgIC8vIEEgYnJhbmQtbmV3IGFjdGl2ZSB0YXNrIGFwcGVhcnMgKHN0YXJ0IG9mIGEgbmV3IGRlbGVnYXRpb24gYmF0Y2gpLlxuICAgICAgICAgIGlmIChhY3RpdmVUYXNrQ291bnQgPT09IDApIHJvdW5kTm90aWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICBhY3RpdmVUYXNrQ291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoaWxkIHNlc3Npb24gaXMgaWRlbnRpZmllZCBieSBtZXRhZGF0YSBzZXNzaW9uSWQvc2Vzc2lvbklEIChzdGF0ZSBmaXJzdCkuXG4gICAgICAgIGNvbnN0IGNoaWxkSUQgPVxuICAgICAgICAgICh0eXBlb2YgdG9vbE1ldGFkYXRhKHBhcnQsIFwic2Vzc2lvbklkXCIpID09PSBcInN0cmluZ1wiID8gdG9vbE1ldGFkYXRhKHBhcnQsIFwic2Vzc2lvbklkXCIpIDogdW5kZWZpbmVkKSA/P1xuICAgICAgICAgICh0eXBlb2YgdG9vbE1ldGFkYXRhKHBhcnQsIFwic2Vzc2lvbklEXCIpID09PSBcInN0cmluZ1wiID8gdG9vbE1ldGFkYXRhKHBhcnQsIFwic2Vzc2lvbklEXCIpIDogdW5kZWZpbmVkKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZElEICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICAgICAgLy8gT25seSB1cGRhdGUgZW50cmllcyB3ZSBhbHJlYWR5IHRyYWNrOyBuZXZlciBjcmVhdGUgbmV3IG9uZXMgZnJvbSBwYXJ0cy5cbiAgICAgICAgY29uc3QgaW5mbyA9IHJ1bm5pbmcuZ2V0KGNoaWxkSUQpO1xuICAgICAgICBpZiAoIWluZm8pIHJldHVybjtcblxuICAgICAgICAvLyBDdXN0b20gbmFtZTogdGhlIGRlc2NyaXB0aW9uIGdpdmVuIHdoZW4gZGVsZWdhdGluZyAobWlycm9ycyB0aGUgYnVpbHQtaW5cbiAgICAgICAgLy8gc3ViYWdlbnQgcGFuZWwsIHdoaWNoIHByZWZlcnMgaW5wdXQuZGVzY3JpcHRpb24sIHRoZW4gaW5wdXQuc3ViYWdlbnRfdHlwZSkuXG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGFydC5zdGF0ZS5pbnB1dDtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5kZXNjcmlwdGlvbiA9PT0gXCJzdHJpbmdcIiAmJiBpbnB1dC5kZXNjcmlwdGlvbi50cmltKCkpIHtcbiAgICAgICAgICBpbmZvLnRpdGxlID0gaW5wdXQuZGVzY3JpcHRpb24udHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQuc3ViYWdlbnRfdHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBpbnB1dC5zdWJhZ2VudF90eXBlLnRyaW0oKSkge1xuICAgICAgICAgIGluZm8uYWdlbnQgPSBpbnB1dC5zdWJhZ2VudF90eXBlLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJ0LnN0YXRlLnN0YXR1cyA9PT0gXCJydW5uaW5nXCIpIHtcbiAgICAgICAgICAvLyBBIHJlc3VtZWQgc3ViYWdlbnQgcmUtcnVucyBpdHMgdGFzayB0b29sIHBhcnQ7IHN1cmZhY2UgaXQgYXMgYnVzeSBhZ2Fpbi5cbiAgICAgICAgICAvLyAoVGhlIHBhcnQgY2FycmllcyBpbnB1dCwgc28gdGhpcyBhbHNvIHJlZnJlc2hlcyB0aGUgY3VzdG9tIG5hbWUgYWJvdmUuKVxuICAgICAgICAgIGlmIChpbmZvLnN0YXR1cyAhPT0gXCJidXN5XCIgJiYgaW5mby5zdGF0dXMgIT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgaW5mby5zaW5jZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZm8uc3RhdHVzID0gXCJidXN5XCI7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydC5zdGF0ZS5zdGF0dXMgPT09IFwiY29tcGxldGVkXCIgfHwgcGFydC5zdGF0ZS5zdGF0dXMgPT09IFwiZXJyb3JcIikge1xuICAgICAgICAgIC8vIEZyZWV6ZSB0aGUgY2xvY2sgYXQgY29tcGxldGlvbiAobm8tb3AgaWYgYWxyZWFkeSBmcm96ZW4gd2hpbGUgaWRsZSkuXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLmZyb3plbiArPSBEYXRlLm5vdygpIC0gaW5mby5zaW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5mby5zdGF0dXMgPSBcImRvbmVcIjtcbiAgICAgICAgfVxuICAgICAgICBzeW5jRW50cmllcygpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIHNlc3Npb24uZGVsZXRlZDogc3ViLXNlc3Npb24gaXMgZ29uZS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24uZGVsZXRlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgbWFpbkFybWVkLmRlbGV0ZShldmVudC5wcm9wZXJ0aWVzLnNlc3Npb25JRCk7XG4gICAgICAgIGlmIChydW5uaW5nLmRlbGV0ZShldmVudC5wcm9wZXJ0aWVzLnNlc3Npb25JRCkpIHtcbiAgICAgICAgICBzeW5jRW50cmllcygpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi5lcnJvcjogbWFyayBkb25lIChrZXB0IHZpc2libGUgdW50aWwgZGVsZXRlZCkgaW5zdGVhZCBvZiBkcm9wcGluZyBpdC5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24uZXJyb3JcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHNlc3Npb25JRCA9IGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklEO1xuICAgICAgICBpZiAoIXNlc3Npb25JRCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpbmZvID0gcnVubmluZy5nZXQoc2Vzc2lvbklEKTtcbiAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICBpZiAoaW5mby5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGluZm8uc3RhdHVzID09PSBcInJldHJ5XCIpIHtcbiAgICAgICAgICAgIGluZm8uZnJvemVuICs9IERhdGUubm93KCkgLSBpbmZvLnNpbmNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbmZvLnN0YXR1cyA9IFwiZG9uZVwiO1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcIkludGVydmlldyBibG9ja2VkXCIgbm90aWZpY2F0aW9uczogdGhlIG1haW4gc2Vzc2lvbiBpcyBzdXNwZW5kZWQgd2FpdGluZyBmb3IgdXNlclxuICAgIC8vIGlucHV0LiBgcXVlc3Rpb24uYXNrZWRgIGZpcmVzIHdoZW4gdGhlIGFnZW50IGFza3MgdGhlIHVzZXIgc29tZXRoaW5nIChwbGFuXG4gICAgLy8gY29uZmlybWF0aW9uLCBjaG9pY2VzLCBldGMuKTsgYHBlcm1pc3Npb24uYXNrZWRgIGZpcmVzIHdoZW4gdGhlIGFnZW50IG5lZWRzIGFuXG4gICAgLy8gYXBwcm92YWwgKGUuZy4gdG8gd3JpdGUgYSBmaWxlIG9yIHJ1biBhIGNvbW1hbmQpLiBObyBzZXNzaW9uLnN0YXR1cyBjaGFuZ2UgaXNcbiAgICAvLyBlbWl0dGVkIGR1cmluZyB0aGUgd2FpdCAodGhlIGFnZW50IGlzIHBhcmtlZCBvbiBhIERlZmVycmVkKSwgc28gdGhlc2UgZXZlbnRzIGFyZVxuICAgIC8vIHRoZSBvbmx5IHJlbGlhYmxlIHNpZ25hbC4gTWFpbiBzZXNzaW9ucyBvbmx5OiBzdWJhZ2VudCByZXF1ZXN0cyBhcmUgZmlsdGVyZWQgb3V0XG4gICAgLy8gKGEgc3ViYWdlbnQncyBvd24gaW50ZXJ2aWV3IGJlbG9uZ3MgdG8gaXRzIGRlbGVnYXRpb24gZmxvdywgbm90IHRoZSBtYWluIHR1cm4pLlxuICAgIC8vIERlZHVwIGJ5IHJlcXVlc3QgaWQgYW5kIGNsZWFyIG9uIHJlcGxpZWQvcmVqZWN0ZWQsIG1pcnJvcmluZyB0aGUgYnVpbHQtaW5cbiAgICAvLyBub3RpZmljYXRpb25zIHBsdWdpbiAobm90aWZpY2F0aW9ucy50cykuXG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJxdWVzdGlvbi5hc2tlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgeyBpZCwgc2Vzc2lvbklELCBxdWVzdGlvbnMgfSA9IGV2ZW50LnByb3BlcnRpZXM7XG4gICAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IHJ1bm5pbmcuaGFzKHNlc3Npb25JRCkgfHwgcGVuZGluZ1F1ZXN0aW9ucy5oYXMoaWQpKSByZXR1cm47XG4gICAgICAgIHBlbmRpbmdRdWVzdGlvbnMuYWRkKGlkKTtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBxdWVzdGlvbnM/LlswXTtcbiAgICAgICAgbm90aWZ5SW50ZXJ2aWV3SW5wdXQoYXBpLCBcInF1ZXN0aW9uXCIsIGZpcnN0Py5xdWVzdGlvbiB8fCBmaXJzdD8uaGVhZGVyLCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJxdWVzdGlvbi5yZXBsaWVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBwZW5kaW5nUXVlc3Rpb25zLmRlbGV0ZShldmVudC5wcm9wZXJ0aWVzLnJlcXVlc3RJRCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwicXVlc3Rpb24ucmVqZWN0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIHBlbmRpbmdRdWVzdGlvbnMuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMucmVxdWVzdElEKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgLy8gUGVybWlzc2lvbiBhcHByb3ZhbCByZXF1ZXN0cy4gVW5saWtlIGBxdWVzdGlvbmAsIHBlcm1pc3Npb24gYXBwcm92YWxzIGNhbiBiZVxuICAgIC8vIGF1dG8tYXBwcm92ZWQgYnkgdGhlIGNsaWVudDogd2l0aCBhdXRvLWFwcHJvdmFsIGVuYWJsZWQgKGAtLWF1dG9gIC8gVFVJXG4gICAgLy8gYHBlcm1pc3Npb24ubW9kZWApLCB0aGUgc2VydmVyIHN0aWxsIGVtaXRzIGBwZXJtaXNzaW9uLmFza2VkYCBhbmQgdGhlIFRVSSByZXBsaWVzXG4gICAgLy8gYFwib25jZVwiYCB3aXRoaW4gdGhlIHNhbWUgZXZlbnQgbG9vcCAoc3luYy50c3g6MTkwLTIwMCkg4oCUIHNvIGEgbm90aWZpY2F0aW9uIGZpcmVkXG4gICAgLy8gaW1tZWRpYXRlbHkgaXMgc3BhbSBldmVuIHRob3VnaCB0aGUgdXNlciBuZXZlciBuZWVkcyB0byBhY3QuIEZpeDogZGVmZXIgdGhlXG4gICAgLy8gbm90aWZpY2F0aW9uIGJ5IGEgc2hvcnQgd2luZG93IGFuZCBjYW5jZWwgaXQgaWYgYSByZXBseSBhcnJpdmVzIGluIHRpbWUuIE1hbnVhbFxuICAgIC8vIGFwcHJvdmFscyB0YWtlIGZhciBsb25nZXIgdGhhbiB0aGUgd2luZG93ICh0aGUgdXNlciBtdXN0IHJlYWQgYW5kIGNsaWNrKSwgc28gdGhleVxuICAgIC8vIGFyZSB1bmFmZmVjdGVkLiBUaGlzIGlzIHRoZSBvbmx5IHJlbGlhYmxlIHNpZ25hbDogYHBlcm1pc3Npb24uYXNrZWRgIGNhcnJpZXMgbm9cbiAgICAvLyBtb2RlIGZpZWxkIGFuZCB0aGUgYXV0byBtb2RlIGlzIGNsaWVudC1zaWRlIFVJIHN0YXRlIHRoZSBwbHVnaW4gY2Fubm90IHJlYWQuXG4gICAgY29uc3QgUEVSTUlTU0lPTl9OT1RJRllfREVMQVlfTVMgPSA1MDA7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJwZXJtaXNzaW9uLmFza2VkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBzZXNzaW9uSUQsIHBlcm1pc3Npb24gfSA9IGV2ZW50LnByb3BlcnRpZXM7XG4gICAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IHJ1bm5pbmcuaGFzKHNlc3Npb25JRCkgfHwgcGVuZGluZ1Blcm1pc3Npb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBTdGlsbCBwZW5kaW5nIGFmdGVyIHRoZSB3aW5kb3cgLT4gdGhlIHVzZXIgaGFzIHRvIGFwcHJvdmUgaXQgbWFudWFsbHkuXG4gICAgICAgICAgaWYgKHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUoaWQpKSB7XG4gICAgICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChhcGksIFwicGVybWlzc2lvblwiLCBwZXJtaXNzaW9uLCBub3RpZnlHYXRlLCBsb2NhbGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFBFUk1JU1NJT05fTk9USUZZX0RFTEFZX01TKTtcbiAgICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLnNldChpZCwgdGltZXIpO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInBlcm1pc3Npb24ucmVwbGllZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgLy8gRmlyZWQgZm9yIGJvdGggbWFudWFsIGFuZCBhdXRvIGFwcHJvdmFsIChyZXBseSBcIm9uY2VcIiB8IFwiYWx3YXlzXCIgfCBcInJlamVjdFwiKTtcbiAgICAgICAgLy8gZWl0aGVyIHdheSB0aGUgdXNlciBubyBsb25nZXIgbmVlZHMgdG8gYWN0LCBzbyBjYW5jZWwgdGhlIGRlZmVycmVkIG5vdGlmaWNhdGlvbi5cbiAgICAgICAgY29uc3QgeyByZXF1ZXN0SUQgfSA9IGV2ZW50LnByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IHRpbWVyID0gcGVuZGluZ1Blcm1pc3Npb25zLmdldChyZXF1ZXN0SUQpO1xuICAgICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUocmVxdWVzdElEKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIEtlZXAgdGhlIGVsYXBzZWQtdGltZSBjb2x1bW4gbGl2ZSBvbmx5IHdoaWxlIHNvbWUgc3ViYWdlbnQncyBjbG9jayBpcyBydW5uaW5nIChidXN5L3JldHJ5KS5cbiAgICBjb25zdCB0aWNrZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBsZXQgYWN0aXZlID0gZmFsc2U7XG4gICAgICBmb3IgKGNvbnN0IGluZm8gb2YgcnVubmluZy52YWx1ZXMoKSkge1xuICAgICAgICBpZiAoaW5mby5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGluZm8uc3RhdHVzID09PSBcInJldHJ5XCIpIHtcbiAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYWN0aXZlKSBzeW5jRW50cmllcygpO1xuICAgIH0sIDEwMDApO1xuXG4gICAgYXBpLmxpZmVjeWNsZS5vbkRpc3Bvc2UoKCkgPT4ge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aWNrZXIpO1xuICAgICAgYXBpLnJlbmRlcmVyLm9mZihcImZvY3VzXCIsIG9uRm9jdXMpO1xuICAgICAgYXBpLnJlbmRlcmVyLm9mZihcImJsdXJcIiwgb25CbHVyKTtcbiAgICAgIC8vIENhbmNlbCBhbnkgcGVuZGluZyBkZWZlcnJlZCBwZXJtaXNzaW9uIG5vdGlmaWNhdGlvbnMuXG4gICAgICBmb3IgKGNvbnN0IHRpbWVyIG9mIHBlbmRpbmdQZXJtaXNzaW9ucy52YWx1ZXMoKSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgfVxuICAgICAgcGVuZGluZ1Blcm1pc3Npb25zLmNsZWFyKCk7XG4gICAgICB1bnN1YnMuZm9yRWFjaCgodW5zdWIpID0+IHVuc3ViKCkpO1xuICAgIH0pO1xuXG4gICAgYXBpLnNsb3RzLnJlZ2lzdGVyKHtcbiAgICAgIG9yZGVyOiA5NTAsXG4gICAgICBzbG90czoge1xuICAgICAgICBzaWRlYmFyX2NvbnRlbnQoX2N0eCwgX3Byb3BzKSB7XG4gICAgICAgICAgLy8gUmVhZGluZyBzaWduYWxzIGluc2lkZSB0aGUgcmVuZGVyZXIgbWFrZXMgc29saWQgcmUtcmVuZGVyIHRoaXMgc2xvdFxuICAgICAgICAgIC8vIHJlYWN0aXZlbHkgb24gZXZlcnkgc3RhdGUgY2hhbmdlIChubyByZXF1ZXN0UmVuZGVyIG5lZWRlZCkuXG4gICAgICAgICAgY29uc3QgaXNDb2xsYXBzZWQgPSBjb2xsYXBzZWQoKTtcbiAgICAgICAgICBjb25zdCBlbnRyaWVzID0gcnVubmluZ0VudHJpZXMoKTtcbiAgICAgICAgICBjb25zdCB0aGVtZSA9IGFwaS50aGVtZS5jdXJyZW50O1xuXG4gICAgICAgICAgY29uc3QgaGVhZGVyID0gYm94KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgIC8vIE1vdXNlIFwiY2xpY2tcIiBvbiB0aGUgaGVhZGVyIHRvZ2dsZXMgY29sbGFwc2UgKGhvc3QgZGlzcGF0Y2hlcyBtb3VzZVxuICAgICAgICAgICAgICAvLyBldmVudHMgdG8gc2lkZWJhciByZW5kZXJhYmxlczsgbWF0Y2hlcyB0aGUgYnVpbHQtaW4gTUNQIGJsb2NrKS5cbiAgICAgICAgICAgICAgb25Nb3VzZURvd246ICgpID0+IHNldENvbGxhcHNlZCgodmFsdWUpID0+ICF2YWx1ZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB0ZXh0KHsgZmc6IHRoZW1lLmFjY2VudCB9LCBbYCR7aXNDb2xsYXBzZWQgPyBcIuKWuFwiIDogXCLilr5cIn0gJHt0KGxvY2FsZSkuc3ViYWdlbnRzfWBdKSxcbiAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0TXV0ZWQgfSwgZW50cmllcy5sZW5ndGggPiAwID8gW2AgKCR7ZW50cmllcy5sZW5ndGh9KWBdIDogW10pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gYm94KHsgd2lkdGg6IFwiMTAwJVwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiIH0sIFtoZWFkZXJdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb2N1cyBzdGF0ZSBkaXNwbGF5OiBvbmx5IHJlbmRlcmVkIHdoZW4gdGhlIGBzaWRlYmFyLnNob3dGb2N1c2Agb3B0aW9uIGlzXG4gICAgICAgICAgLy8gZW5hYmxlZCAoZGVmYXVsdCBoaWRkZW4pLiBTaG93cyB0aGUgY3VycmVudCBmb2N1cyBiYWNrZW5kICsgbGFzdCByZXN1bHQuXG4gICAgICAgICAgY29uc3QgZm9jdXNMaW5lID0gKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvd0ZvY3VzKSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBkaWFnID0gZm9jdXNEaWFnKCk7XG4gICAgICAgICAgICBjb25zdCBmbGFnID0gZGlhZy5sYXN0UmVzdWx0ID09PSB0cnVlID8gXCLil49mb2N1c2VkXCIgOiBkaWFnLmxhc3RSZXN1bHQgPT09IGZhbHNlID8gXCLil4tibHVycmVkXCIgOiBcIj91bmtub3duXCI7XG4gICAgICAgICAgICBjb25zdCBzcmMgPSBkaWFnLmxhc3RGb3JlZ3JvdW5kUGlkICE9PSB1bmRlZmluZWQgPyBgIGZnPSR7ZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZH1gIDogXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGRpYWcubGFzdEVycm9yID8gYCBlcnI9JHtkaWFnLmxhc3RFcnJvcn1gIDogXCJcIjtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHRleHQoeyBmZzogdGhlbWUudGV4dE11dGVkIH0sIFtcbiAgICAgICAgICAgICAgICBgICBmb2N1c1ske2RpYWcuYmFja2VuZH0ke2RpYWcuYW5jZXN0b3JDb3VudCA/IGA6JHtkaWFnLmFuY2VzdG9yQ291bnR9YCA6IFwiXCJ9XSAke2ZsYWd9JHtzcmN9JHtlcnJ9YCxcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICBjb25zdCByb3dzID0gZW50cmllcy5tYXAoKFtzZXNzaW9uSUQsIGluZm9dKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZm8uc3RhdHVzID09PSBcImJ1c3lcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1c0NvbG9yID0gaXNBY3RpdmUgPyB0aGVtZS5zdWNjZXNzIDogaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIiA/IHRoZW1lLndhcm5pbmcgOiB0aGVtZS50ZXh0TXV0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gYm94KFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDEsXG4gICAgICAgICAgICAgICAgLy8gTGVmdC1jbGljayBhIHJvdyB0byBqdW1wIGludG8gdGhhdCBzdWItc2Vzc2lvbidzIGNvbnRleHQgdmlld1xuICAgICAgICAgICAgICAgIC8vIChob3N0IHBsdWdpbiBBUEk6IGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSkpLlxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duOiAoZXZlbnQ6IHsgYnV0dG9uPzogbnVtYmVyIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gIT09IHVuZGVmaW5lZCAmJiBldmVudC5idXR0b24gIT09IDApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHRleHQoeyBmZzogc3RhdHVzQ29sb3IgfSwgW2Dil49gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0IH0sIFtgICR7aW5mby5hZ2VudH1gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiBzdGF0dXNDb2xvciB9LCBbYCAke2luZm8uc3RhdHVzfWBdKSxcbiAgICAgICAgICAgICAgICB0ZXh0KHsgZmc6IHRoZW1lLnRleHRNdXRlZCB9LCBbYCAke2Zvcm1hdER1cmF0aW9uKGVudHJ5RWxhcHNlZChpbmZvKSl9YF0pLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBib3goeyB3aWR0aDogXCIxMDAlXCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIgfSwgW2hlYWRlciwgLi4uZm9jdXNMaW5lLCAuLi5yb3dzXSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcGx1Z2luO1xuIiwiLyoqXHJcbiAqIEludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBmb3Igb3BlbmNvZGUtYWdlbnQtcHVsc2UuXHJcbiAqXHJcbiAqIFN1cHBvcnRlZCBsb2NhbGVzOiBFbmdsaXNoIChcImVuXCIsIGRlZmF1bHQpIGFuZCBTaW1wbGlmaWVkIENoaW5lc2UgKFwiemhcIikuXHJcbiAqIFRoZSBsb2NhbGUgaXMgc2VsZWN0ZWQgdmlhIHRoZSBwbHVnaW4gYGxvY2FsZWAgb3B0aW9uICh0dXBsZSBmb3JtKTpcclxuICpcclxuICogICBbXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCB7IFwibG9jYWxlXCI6IFwiemhcIiB9XVxyXG4gKlxyXG4gKiBPbmx5IHVzZXItZmFjaW5nIHN0cmluZ3MgKG5vdGlmaWNhdGlvbiBtZXNzYWdlcyBhbmQgdGhlIHNpZGViYXIgc2VjdGlvbiB0aXRsZSlcclxuICogYXJlIGxvY2FsaXplZDsgaW50ZXJuYWwgc3RhdHVzIGxhYmVscyAoXCJidXN5XCIvXCJpZGxlXCIvXCJyZXRyeVwiL1wiZG9uZVwiKSByZW1haW5cclxuICogRW5nbGlzaCBhcyBzdGFibGUgaWRlbnRpZmllcnMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgTG9jYWxlID0gXCJlblwiIHwgXCJ6aFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlcyB7XHJcbiAgLyoqIFNpZGViYXIgc2VjdGlvbiB0aXRsZS4gKi9cclxuICBzdWJhZ2VudHM6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gYSBiYXRjaCBvZiBzdWJhZ2VudHMgZmluaXNoZXMuICovXHJcbiAgc3ViYWdlbnRzRG9uZTogKGNvdW50OiBudW1iZXIpID0+IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBmaW5pc2hlcyBhIHR1cm4uICovXHJcbiAgdHVybkRvbmU6IHN0cmluZztcclxuICAvKiogTm90aWZpY2F0aW9uIHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBuZWVkcyBhIHBlcm1pc3Npb24gYXBwcm92YWwuICovXHJcbiAgcGVybWlzc2lvblJlcXVpcmVkOiAoZGV0YWlsPzogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgLyoqIE5vdGlmaWNhdGlvbiB3aGVuIHRoZSBtYWluIHNlc3Npb24gbmVlZHMgYW4gYW5zd2VyIHRvIGEgcXVlc3Rpb24uICovXHJcbiAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbD86IHN0cmluZykgPT4gc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBkaWN0aW9uYXJpZXM6IFJlY29yZDxMb2NhbGUsIE1lc3NhZ2VzPiA9IHtcclxuICBlbjoge1xyXG4gICAgc3ViYWdlbnRzOiBcIlN1YmFnZW50c1wiLFxyXG4gICAgc3ViYWdlbnRzRG9uZTogKGNvdW50KSA9PlxyXG4gICAgICBjb3VudCA+IDEgPyBgQWxsICR7Y291bnR9IHN1YmFnZW50cyBjb21wbGV0ZWRgIDogXCJTdWJhZ2VudCBjb21wbGV0ZWRcIixcclxuICAgIHR1cm5Eb25lOiBcIlR1cm4gY29tcGxldGVkXCIsXHJcbiAgICBwZXJtaXNzaW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGBQZXJtaXNzaW9uIHJlcXVpcmVkOiAke2RldGFpbH1gIDogXCJNYWluIHNlc3Npb24gcmVxdWlyZXMgcGVybWlzc2lvblwiLFxyXG4gICAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYEFuc3dlciByZXF1aXJlZDogJHtkZXRhaWx9YCA6IFwiTWFpbiBzZXNzaW9uIHJlcXVpcmVzIGFuIGFuc3dlclwiLFxyXG4gIH0sXHJcbiAgemg6IHtcclxuICAgIHN1YmFnZW50czogXCLlrZAgYWdlbnRcIixcclxuICAgIHN1YmFnZW50c0RvbmU6IChjb3VudCkgPT5cclxuICAgICAgY291bnQgPiAxID8gYOWFqOmDqCAke2NvdW50fSDkuKrlrZAgYWdlbnQg5bey5a6M5oiQYCA6IFwi5a2QIGFnZW50IOW3suWujOaIkFwiLFxyXG4gICAgdHVybkRvbmU6IFwi5pys6L2u5a+56K+d5bey5a6M5oiQXCIsXHJcbiAgICBwZXJtaXNzaW9uUmVxdWlyZWQ6IChkZXRhaWwpID0+XHJcbiAgICAgIGRldGFpbCA/IGDpnIDopoHmnYPpmZDnoa7orqQ6ICR7ZGV0YWlsfWAgOiBcIuS4u+S8muivnemcgOimgeadg+mZkOehruiupFwiLFxyXG4gICAgcXVlc3Rpb25SZXF1aXJlZDogKGRldGFpbCkgPT5cclxuICAgICAgZGV0YWlsID8gYOmcgOimgeWbnuetlDogJHtkZXRhaWx9YCA6IFwi5Li75Lya6K+d6ZyA6KaB5Zue562U6K+i6ZeuXCIsXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKiBOb3JtYWxpemUgYW4gYXJiaXRyYXJ5IG9wdGlvbiB2YWx1ZSBpbnRvIGEgc3VwcG9ydGVkIGxvY2FsZSAoZGVmYXVsdHMgdG8gXCJlblwiKS4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVMb2NhbGUoaW5wdXQ6IHVua25vd24pOiBMb2NhbGUge1xyXG4gIGlmIChpbnB1dCA9PT0gXCJ6aFwiIHx8IGlucHV0ID09PSBcInpoLUNOXCIgfHwgaW5wdXQgPT09IFwiemhfQ05cIiB8fCBpbnB1dCA9PT0gXCJ6aC1IYW5zXCIpIHtcclxuICAgIHJldHVybiBcInpoXCI7XHJcbiAgfVxyXG4gIHJldHVybiBcImVuXCI7XHJcbn1cclxuXHJcbi8qKiBHZXQgdGhlIG1lc3NhZ2UgZGljdGlvbmFyeSBmb3IgYSBsb2NhbGUgKGZhbGxzIGJhY2sgdG8gRW5nbGlzaCkuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0KGxvY2FsZTogTG9jYWxlKTogTWVzc2FnZXMge1xyXG4gIHJldHVybiBkaWN0aW9uYXJpZXNbbG9jYWxlXSA/PyBkaWN0aW9uYXJpZXMuZW47XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBUdWlBdHRlbnRpb25Tb3VuZCwgVHVpUGx1Z2luQXBpIH0gZnJvbSBcIkBvcGVuY29kZS1haS9wbHVnaW4vdHVpXCI7XG5pbXBvcnQgdHlwZSB7IExvY2FsZSB9IGZyb20gXCIuL2kxOG5cIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi9pMThuXCI7XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGRpc3BhdGNoIGZvciBvcGVuY29kZS1hZ2VudC1wdWxzZS5cbiAqXG4gKiBUd28gZGVsaXZlcnkgY2hhbm5lbHMsIHNlbGVjdGVkIGJ5IHBsYXRmb3JtOlxuICpcbiAqICAgLSBOb24tV2luZG93czogdXNlIHRoZSBidWlsdC1pbiBgYXBpLmF0dGVudGlvbi5ub3RpZnkoKWAgKG1hY09TIGlUZXJtMi9HaG9zdHR5IGFuZFxuICogICAgIExpbnV4IGtpdHR5L2Zvb3QgaW1wbGVtZW50IHRoZSBPU0MgOS85OSBwcm90b2NvbCB0aGlzIHJlbGllcyBvbikuIFN1cHBvcnRzIGJvdGhcbiAqICAgICBhIHN5c3RlbSBub3RpZmljYXRpb24gYW5kIGEgc291bmQuXG4gKiAgIC0gV2luZG93czogV2luZG93cyBUZXJtaW5hbCBkb2VzIE5PVCBpbXBsZW1lbnQgdGhlIE9TQyA5OSBwcm90b2NvbCArIERFQyAxMDA0IGZvY3VzXG4gKiAgICAgdHJhY2tpbmcgdGhhdCBgYXBpLmF0dGVudGlvbi5ub3RpZnlgJ3Mgbm90aWZpY2F0aW9uIHBhdGggZGVwZW5kcyBvbiAoa25vd24gaXNzdWVcbiAqICAgICAjMzUwNTUpLCBzbyB0aGUgc3lzdGVtIG5vdGlmaWNhdGlvbiBpcyBzaWxlbnRseSBkcm9wcGVkLiBBcyBhIHdvcmthcm91bmQgd2Ugcm91dGVcbiAqICAgICB0aHJvdWdoIGBub2RlLW5vdGlmaWVyYCwgd2hpY2ggb24gV2luZG93cyBzaGVsbHMgb3V0IHRvIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlXG4gKiAgICAgdG8gcG9zdCBhIHJlYWwgQWN0aW9uIENlbnRlciB0b2FzdC4gKFRoZSBidWlsdC1pbiBzb3VuZCBpcyB1bmFmZmVjdGVkLCBidXQgb25cbiAqICAgICBXaW5kb3dzIHRoZSBUVUkgc291bmQgYW5kIHRoZSB0b2FzdCBhcmUgZGVsaXZlcmVkIGluZGVwZW5kZW50bHkuKVxuICpcbiAqIEFsbCBmdW5jdGlvbnMgYXJlIGJlc3QtZWZmb3J0OiBmYWlsdXJlcyBhcmUgc3dhbGxvd2VkIHNvIGEgbm90aWZpY2F0aW9uIHByb2JsZW0gbmV2ZXJcbiAqIGJyZWFrcyB0aGUgcGx1Z2luLlxuICovXG5cbnR5cGUgQXBpID0gUGljazxUdWlQbHVnaW5BcGksIFwiYXR0ZW50aW9uXCIgfCBcInVpXCI+O1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyBBcHBVc2VyTW9kZWxJRCB1c2VkIGZvciB0aGUgV2luZG93cyB0b2FzdC4gbm9kZS1ub3RpZmllciByZXF1aXJlcyBhbiBBVU1JRCBmb3Jcbi8vIEFjdGlvbiBDZW50ZXIgdG9hc3RzIHRvIGdyb3VwIHByb3Blcmx5IGFuZCBzaG93IGEgZnJpZW5kbHkgYXBwIG5hbWUuXG5jb25zdCBXSU5ET1dTX0FQUF9JRCA9IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIjtcblxuLy8gT3BlbkNvZGUgbG9nbyBhcyBhIFBORyAocHJlLXJlbmRlcmVkIGZyb20gdGhlIFNWRyBpbiBzY3JpcHRzL2dlbi1pY29uLnRzIGF0IDI1NngzMjApLFxuLy8gZW5jb2RlZCBhcyBiYXNlNjQuIFBhc3NlZCB0byBub2RlLW5vdGlmaWVyJ3MgYGljb25gIGZpZWxkIHNvIHRoZSBXaW5kb3dzIEFjdGlvbiBDZW50ZXJcbi8vIHRvYXN0IHNob3dzIHRoZSBPcGVuQ29kZSBsb2dvIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgaWNvbi4gQmVjYXVzZSBub2RlLW5vdGlmaWVyJ3Ncbi8vIFdpbmRvd3MgYnJhbmNoIGV4cGVjdHMgYSBmaWxlIHBhdGggKG5vdCBhIGRhdGEgVVJMKSwgd2UgZGVjb2RlIHRoaXMgdG8gYSB0ZW1wIGZpbGUgYXRcbi8vIGRpc3BhdGNoIHRpbWUgKHNlZSB3aW5kb3dzTm90aWZ5KS5cbmNvbnN0IE9QRU5DT0RFX0lDT05fUE5HX0I2NCA9XG4gIFwiaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVFBQUFBRkFDQVlBQUFCVEtxSUtBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBS1owbEVcIiArXG4gIFwiUVZSNG5PM2RNVzRrUVF4RDBUbEpBYnovRWV5N3laRmpPNU1BUGdIS0YyM3liMDkxaWZya3ZkR2VBUTI4eW1mdzJmNEhhTStBQmg0QUVBRVFcIiArXG4gIFwiME1EekJrQUVRRUFEejA4QUlnQUNHbmpPQUlnQUNHamdPUVFrQWlDZ2dlY3JBQkVBQVEwOG53R0pBQWhvNExrSFFBUkFRQVBQUlNBaUFBSWFcIiArXG4gIFwiZUc0Q0VnRVEwTUJ6RlpnSWdJQUdubGtBSWdBQ0duaUdnWWdBQ0dqZ21RWWtBaUNnZ1djY21BaUFJSjZCUEFBaUFJSVVQd09CSUFmK0NOb3pcIiArXG4gIFwiQ0FBUUFSRFFRTHdCRUFFUTBFRDhCQ0FDSUtDQk9BTWdBaUNnZ1RnRUpBSWdvSUg0Q2tBRVFFQUQ4Um1RQ0lDQUJ1SWVBQkVBQVEzRVJTQWlcIiArXG4gIFwiQUFJYWlKdUFSQUFFTkJCWGdZa0FDR2dnWmdHSUFBaG9JSWFCaUFBSWFDQ21BWWtBQ0dnZ3hvR0pBQWhlL1RPUUIwQUU5U1pJc1FZQTRNQWZcIiArXG4gIFwiUVhzR0FRQWlBQUlhaURjQUlnQUNHb2lmQUVRQUJEUVFad0JFQUFRMEVJZUFSQUFFTkJCZkFZZ0FDR2dnUGdNU0FSRFFRTndESUFJZ29JRzRcIiArXG4gIFwiQ0VRRVFFQURjUk9RQ0lDQUJ1SXFNQkVBQVEzRUxBQVJBQUVOeERBUUVRQUJEY1EwSUJFQUFRM0VPREFSQU1HcmZ3YnlBSWlnM2dRcDFnQUFcIiArXG4gIFwiSFBnamFNOGdBRUFFUUVBRDhRWkFCRUJBQS9FVGdBaUFnQWJpRElBSWdJQUc0aENRQ0lDQUJ1SXJBQkVBQVEzRVowQWlBQUlhaUhzQVJBQUVcIiArXG4gIFwiTkJBWGdZZ0FDR2dnYmdJU0FSRFFRRndGSmdJZ29JR1lCZmhqR0VKVlY4b2g0UUdvNnNvQkV3TEFKZ0ZWZGVXQUNRRUFBQlFBek1wL2dOc0VcIiArXG4gIFwiMm03TzY2NGMwS0EzQUFCUUFERGVBTHdCS0c4QTR5ZUFud0RLVDRCeEJ1QU1RRGtER0llQURnR1ZROER4RmNCWEFPVXJ3UGdNNkRPZzhobHdcIiArXG4gIFwiM0FOd0QwQzVCekF1QXJrSXBGd0VHamNCM1FSVWJnS09xOEN1QWl0WGdjY3NnRmtBWlJaZ0RBTVpCbEtHZ2NZMG9HbEFaUnB3akFNYkIxYkdcIiArXG4gIFwiZ1VjZWdEeUErc3FCbVh4NUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dENkMrY21BbVh4NkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEcUs4Y21NbVhCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JcIiArXG4gIFwiQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQS93REI5OWVYTG40R09YQWYzeXpBNGtQWUZxQUdcIiArXG4gIFwiZ0d6T3dtd1RhTHNac0J0Q09hQkJBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBcIiArXG4gIFwiZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5cIiArXG4gIFwiZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllcIiArXG4gIFwiRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JcIiArXG4gIFwiQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wOXJZQnQ5dDJcIiArXG4gIFwiNEFNaTFBQVFBTmdoSVBOMUF5Z0gvaGYyQnVBbndMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUFcIiArXG4gIFwid0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NcIiArXG4gIFwiRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JcIiArXG4gIFwiV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFcIiArXG4gIFwiYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hcIiArXG4gIFwiVEFnQUFMQnVoTmJlTnVCMmY3Yi9BZHU5TFVBTkFBRUFBQUFDYndEeEJ1QU5BQWo4QklpZkFINENBSUV6Z0RnRGNBWUFCQTRCNHhEUUlTQVFcIiArXG4gIFwiK0FvUVh3RjhCUUFDbndIak02RFBnRURnSGtEY0EzQVBBQWhjQklxTFFDNENBWUdiZ0hFVDBFMUFJSEFWT0s0Q3V3b01CR1lCWWhiQUxBQVFcIiArXG4gIFwiR0FhS1lTRERRRUJnR2pDbUFVMERBb0Z4NEJnSE5nNE1CUElBNUFISUE2Z0hRUTVrVXNnRGtBZFFiMFNKUUU4ZWdFUWdJQkFKOXVRQmlBUURcIiArXG4gIFwiQXBtQVR4NkFURUFnRUFyNjVBRUlCUVVDcWNCUEhvQlVZQ0FRQy83a0FZZ0ZCd0o3QVo0OEFIc0JnTUJpa0NjUHdHSVFJTEFaNk1rRHNCa0lcIiArXG4gIFwiQ0t3R2UvSUFyQVlEQXJzQm56d0F1d0dCd0hMUUp3L0FjbEFnc0IzNHlRT3dIUmdJckFkLzhnQ3NCd2VDWHhEa3dFaXVjV0Rqd01hQnJRY2ZcIiArXG4gIFwiNjhHdEJ3Y0M2OEhIZW5EcndZSEFldkN4SHR4NmNDQ3dIbnlzQjdjZUhBaXNCeC9yd2EwSEJ3THJ3Y2Q2Y092QmdjQjY4TEVlM0hwd0lMQWVcIiArXG4gIFwiZkt3SHR4NGNDS3dISCt2QnJRY0hBdXZCeDNwdzY4R0J3SHJ3c1I3Y2VuQWdzQjU4ckFlM0hod0lyQWNmNjhHdEJ3Y0M2OEhIZW5EcndZSEFcIiArXG4gIFwiT1BCWUQyNDllRDBJY21BbVh4NkFQSUI2SThvRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJcIiArXG4gIFwiQUlFOGdDY1BRQjRBRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJBSUU4Z0NjUFFCNEFcIiArXG4gIFwiRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUJCRHN6a3l3TTQ4Q0MwWjVEQ1ovRFovZ2RvejRBR0hnQVFBUkRRd1BNR1FBUkFcIiArXG4gIFwiUUFQUFR3QWlBQUlhZU00QWlBQUlhT0E1QkNRQ0lLQ0I1eXNBRVFBQkRUeWZBWWtBQ0dqZ3VRZEFCRUJBQTg5RklDSUFBaHA0YmdJU0FSRFFcIiArXG4gIFwid0hNVm1BaUFnQWFlV1FBaUFBSWFlSWFCaUFBSWFPQ1pCaVFDSUtDQlp4eVlDSUFnbm9FOEFDSUFnaFEvQTRFZ0IvNEkyak1JQUJBQkVOQkFcIiArXG4gIFwidkFFUUFSRFFRUHdFSUFJZ29JRTRBeUFDSUtDQk9BUWtBaUNnZ2ZnS1FBUkFRQVB4R1pBSWdJQUc0aDRBRVFBQkRjUkZJQ0lBQWhxSW00QkVcIiArXG4gIFwiQUFRMEVGZUJpUUFJYUNCbUFZZ0FDR2dnaG9HSUFBaG9JS1lCaVFBSWFDREdnWWtBQ0Y3OU01QUhRQVQxSmtpeEJnRGd3QjlCZXdZQkFDSUFcIiArXG4gIFwiQWhxSU53QWlBQUlhaUo4QVJBQUVOQkJuQUVRQUJEUVFoNEJFQUFRMEVGOEJpQUFJYUNBK0F4SUJFTkJBM0FNZ0FpQ2dnYmdJUkFSQVFBTnhcIiArXG4gIFwiRTVBSWdJQUc0aW93RVFBQkRjUXNBQkVBQVEzRU1CQVJBQUVOeERRZ0VRQUJEY1E0TUJFQXdhdC9CdklBaUtEZUJDbldBQUFjK0NOb3p5QUFcIiArXG4gIFwiUUFSQVFBUHhCa0FFUUVBRDhST0FDSUNBQnVJTWdBaUFnQWJpRUpBSWdJQUc0aXNBRVFBQkRjUm5RQ0lBQWhxSWV3QkVBQVEwRUJlQmlBQUlcIiArXG4gIFwiYUNCdUFoSUJFTkJBWEFVbUFpQ2dnZnp4REg0QTF0bmR4Ykx5d2QwQUFBQUFTVVZPUks1Q1lJST1cIjtcblxuaW50ZXJmYWNlIE5vdGlmeVBheWxvYWQge1xuICB0aXRsZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIC8qKiBTb3VuZCB1c2VkIG9uIHRoZSBub24tV2luZG93cyBwYXRoIChgYXBpLmF0dGVudGlvbi5ub3RpZnlgKS4gKi9cbiAgc291bmQ6IFR1aUF0dGVudGlvblNvdW5kO1xufVxuXG4vKipcbiAqIE9wdGlvbmFsIGZvY3VzIGdhdGUgYXBwbGllZCBiZWZvcmUgZGlzcGF0Y2hpbmcgYSBub3RpZmljYXRpb24uIExldHMgdGhlIHVzZXIgb3B0IGludG9cbiAqIFwibm90aWZ5IG9ubHkgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGlzIHVuZm9jdXNlZFwiIHNvIG5vdGlmaWNhdGlvbnMgZG9uJ3QgZmlyZSB3aGlsZVxuICogdGhleSBhcmUgYWN0aXZlbHkgd2F0Y2hpbmcgdGhlIFRVSS5cbiAqXG4gKiBUaGUgZ2F0ZSBpcyBldmFsdWF0ZWQgb24gZXZlcnkgZGlzcGF0Y2ggKG5vdCBvbmNlIGF0IHNldHVwKSBiZWNhdXNlIHRoZSBkZWZlcnJlZFxuICogcGVybWlzc2lvbiBub3RpZmljYXRpb24gaXMgc2VudCBmcm9tIGEgdGltZXIgYW5kIHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIG11c3QgYmUgcmVhZFxuICogYXQgdGhhdCBtb21lbnQuXG4gKi9cbmV4cG9ydCB0eXBlIE5vdGlmeUdhdGUgPSB7XG4gIC8qKiBXaGVuIHRydWUsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24gd2hpbGUgdGhlIHRlcm1pbmFsIGlzIGZvY3VzZWQuICovXG4gIG9ubHlXaGVuVW5mb2N1c2VkOiBib29sZWFuO1xuICAvKiogQ3VycmVudCB0ZXJtaW5hbCBmb2N1cyBzdGF0ZTsgYHVuZGVmaW5lZGAgd2hlbiB1bmtub3duIChlLmcuIHRoZSB0ZXJtaW5hbCBkb2VzIG5vdFxuICAgKiAgcmVwb3J0IGZvY3VzIGV2ZW50cyDigJQgV2luZG93cyBUZXJtaW5hbCBpcyBhIGtub3duIGNhc2UpLiBVbmtub3duIGZvY3VzIGRlZ3JhZGVzIHRvXG4gICAqICBkaXNwYXRjaGluZyBzbyBhbiBvcHRlZC1pbiBub3RpZmljYXRpb24gaXMgbmV2ZXIgc2lsZW50bHkgbG9zdC4gUmVhZCBsYXppbHkgb24gZWFjaFxuICAgKiAgZGlzcGF0Y2ggYmVjYXVzZSB0aGUgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb24gZmlyZXMgZnJvbSBhIHRpbWVyLiBNYXkgYmVcbiAgICogIGFzeW5jICh0aGUgV2luZG93cyBmYWxsYmFjayBxdWVyaWVzIHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyB2aWEgUG93ZXJTaGVsbCkuICovXG4gIGZvY3VzZWQ6ICgpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+O1xufTtcblxuYXN5bmMgZnVuY3Rpb24gd2luZG93c05vdGlmeShwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIG5vZGUtbm90aWZpZXIgaXMgbWFya2VkIGV4dGVybmFsIGluIHRoZSBidWlsZCAocGFja2FnZS5qc29uKSBzbyBpdCByZXNvbHZlcyBmcm9tXG4gIC8vIG5vZGVfbW9kdWxlcyBhdCBydW50aW1lIHJhdGhlciB0aGFuIGJlaW5nIGJ1bmRsZWQuIE9uIFdpbmRvd3MgaXQgcG9zdHMgYSByZWFsXG4gIC8vIEFjdGlvbiBDZW50ZXIgdG9hc3QgdmlhIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlLiBEeW5hbWljIGltcG9ydCBrZWVwcyB0aGVcbiAgLy8gbW9kdWxlIGxvYWQgZnJvbSBmYWlsaW5nIHRoZSB3aG9sZSBwbHVnaW4gaWYgbm9kZS1ub3RpZmllciBpcyB1bmF2YWlsYWJsZS5cbiAgaW1wb3J0KFwibm9kZS1ub3RpZmllclwiKVxuICAgIC50aGVuKGFzeW5jIChtb2QpID0+IHtcbiAgICAgIC8vIG5vZGUtbm90aWZpZXIncyBXaW5kb3dzIGJyYW5jaCBleHBlY3RzIGEgZmlsZSBwYXRoIChub3QgYSBkYXRhIFVSTCkgZm9yIGBpY29uYCxcbiAgICAgIC8vIHNvIGRlY29kZSB0aGUgZW1iZWRkZWQgUE5HIHRvIGEgdGVtcCBmaWxlIGZpcnN0LlxuICAgICAgbGV0IGljb25QYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHdyaXRlRmlsZSB9ID0gYXdhaXQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKTtcbiAgICAgICAgY29uc3Qgb3MgPSBhd2FpdCBpbXBvcnQoXCJub2RlOm9zXCIpO1xuICAgICAgICBjb25zdCBwYXRoID0gYXdhaXQgaW1wb3J0KFwibm9kZTpwYXRoXCIpO1xuICAgICAgICBpY29uUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYG9wZW5jb2RlLXB1bHNlLSR7cHJvY2Vzcy5waWR9LSR7RGF0ZS5ub3coKX0ucG5nYCk7XG4gICAgICAgIGF3YWl0IHdyaXRlRmlsZShpY29uUGF0aCwgQnVmZmVyLmZyb20oT1BFTkNPREVfSUNPTl9QTkdfQjY0LCBcImJhc2U2NFwiKSk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gYmVzdC1lZmZvcnQ7IGZhbGwgYmFjayB0byBubyBpY29uIGlmIHRoZSB0ZW1wIGZpbGUgY291bGQgbm90IGJlIHdyaXR0ZW5cbiAgICAgICAgaWNvblBhdGggPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vdGlmaWVyID0gKG1vZCBhcyB7IGRlZmF1bHQ/OiB1bmtub3duIH0pLmRlZmF1bHQgPz8gbW9kO1xuICAgICAgKG5vdGlmaWVyIGFzIHsgbm90aWZ5OiAob3B0czogdW5rbm93biwgY2I6IChlcnI6IEVycm9yIHwgbnVsbCwgcmVzcG9uc2U6IHN0cmluZykgPT4gdm9pZCkgPT4gdm9pZCB9KS5ub3RpZnkoXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgICAgICBtZXNzYWdlOiBwYXlsb2FkLm1lc3NhZ2UsXG4gICAgICAgICAgYXBwSUQ6IFdJTkRPV1NfQVBQX0lELFxuICAgICAgICAgIC4uLihpY29uUGF0aCA/IHsgaWNvbjogaWNvblBhdGggfSA6IHt9KSxcbiAgICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIGJlc3QtZWZmb3J0OyByZW1vdmUgdGhlIHRlbXAgaWNvbiBmaWxlIG9uY2UgdGhlIHRvYXN0IGlzIGRpc3BhdGNoZWRcbiAgICAgICAgICBpZiAoaWNvblBhdGgpIHtcbiAgICAgICAgICAgIHZvaWQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKVxuICAgICAgICAgICAgICAudGhlbigoeyB1bmxpbmsgfSkgPT4gdW5saW5rKGljb25QYXRoKSlcbiAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pXG4gICAgLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIGJlc3QtZWZmb3J0XG4gICAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWx0aW5Ob3RpZnkoYXBpOiBBcGksIHBheWxvYWQ6IE5vdGlmeVBheWxvYWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcGkuYXR0ZW50aW9uLm5vdGlmeSh7XG4gICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgIG1lc3NhZ2U6IHBheWxvYWQubWVzc2FnZSxcbiAgICAgIG5vdGlmaWNhdGlvbjogeyB3aGVuOiBcImFsd2F5c1wiIH0sXG4gICAgICBzb3VuZDogcGF5bG9hZC5zb3VuZCxcbiAgICB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gYmVzdC1lZmZvcnQ7IGEgZmFpbGVkIG5vdGlmaWNhdGlvbiBtdXN0IG5ldmVyIGJyZWFrIHRoZSBwbHVnaW5cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBkaXNwYXRjaChhcGk6IEFwaSwgcGF5bG9hZDogTm90aWZ5UGF5bG9hZCwgZ2F0ZT86IE5vdGlmeUdhdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGdhdGU/Lm9ubHlXaGVuVW5mb2N1c2VkICYmIChhd2FpdCBnYXRlLmZvY3VzZWQoKSkgPT09IHRydWUpIHtcbiAgICAvLyBUZXJtaW5hbCBpcyBmb2N1c2VkIC0+IHRoZSB1c2VyIGlzIHdhdGNoaW5nLCBzdXBwcmVzcyB0aGUgbm90aWZpY2F0aW9uLlxuICAgIC8vIFVua25vd24gZm9jdXMgKG5vIGZvY3VzIGV2ZW50cywgZS5nLiBXaW5kb3dzIFRlcm1pbmFsKSBzdGlsbCBkaXNwYXRjaGVzLlxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoSVNfV0lORE9XUykge1xuICAgIGF3YWl0IHdpbmRvd3NOb3RpZnkocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgYnVpbHRpbk5vdGlmeShhcGksIHBheWxvYWQpO1xuICB9XG59XG5cbi8qKiBOb3RpZnkgdGhhdCBhIGJhdGNoIG9mIHN1YmFnZW50cyBmaW5pc2hlZC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlTdWJhZ2VudHNEb25lKFxuICBhcGk6IEFwaSxcbiAgY291bnQ6IG51bWJlcixcbiAgZ2F0ZT86IE5vdGlmeUdhdGUsXG4gIGxvY2FsZTogTG9jYWxlID0gXCJlblwiLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTogdChsb2NhbGUpLnN1YmFnZW50c0RvbmUoY291bnQpLFxuICAgICAgc291bmQ6IHsgbmFtZTogXCJzdWJhZ2VudF9kb25lXCIgfSxcbiAgICB9LFxuICAgIGdhdGUsXG4gICk7XG59XG5cbi8qKiBOb3RpZnkgdGhhdCB0aGUgY3VycmVudCB0dXJuIChtYWluLWFnZW50IHJvdW5kKSBoYXMgZmluaXNoZWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5VHVybkRvbmUoYXBpOiBBcGksIGdhdGU/OiBOb3RpZnlHYXRlLCBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIik6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6IHQobG9jYWxlKS50dXJuRG9uZSxcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwiZG9uZVwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogV2hhdCBraW5kIG9mIHVzZXIgaW50ZXJhY3Rpb24gaXMgYmxvY2tpbmcgdGhlIG1haW4gc2Vzc2lvbi4gKi9cbmV4cG9ydCB0eXBlIEludGVydmlld0tpbmQgPSBcInF1ZXN0aW9uXCIgfCBcInBlcm1pc3Npb25cIjtcblxuLyoqXG4gKiBOb3RpZnkgdGhhdCB0aGUgbWFpbiBzZXNzaW9uIGlzIGJsb2NrZWQgd2FpdGluZyBmb3IgdXNlciBpbnB1dCAoYW4gaW50ZXJ2aWV3OlxuICogdGhlIGBxdWVzdGlvbmAgdG9vbCBhc2tpbmcgdGhlIHVzZXIgc29tZXRoaW5nLCBvciBhIHBlcm1pc3Npb24vYXBwcm92YWwgcHJvbXB0KS5cbiAqIFRoZXNlIGFyZSB0aGUgdHdvIHdheXMgYW4gYWdlbnQgdHVybiBpcyBzdXNwZW5kZWQgbWlkLXJ1biBvbiB1c2VyIGludGVyYWN0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5SW50ZXJ2aWV3SW5wdXQoXG4gIGFwaTogQXBpLFxuICBraW5kOiBJbnRlcnZpZXdLaW5kLFxuICBkZXRhaWw/OiBzdHJpbmcsXG4gIGdhdGU/OiBOb3RpZnlHYXRlLFxuICBsb2NhbGU6IExvY2FsZSA9IFwiZW5cIixcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtZXNzYWdlcyA9IHQobG9jYWxlKTtcbiAgYXdhaXQgZGlzcGF0Y2goXG4gICAgYXBpLFxuICAgIHtcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXG4gICAgICBtZXNzYWdlOlxuICAgICAgICBraW5kID09PSBcInBlcm1pc3Npb25cIlxuICAgICAgICAgID8gbWVzc2FnZXMucGVybWlzc2lvblJlcXVpcmVkKGRldGFpbClcbiAgICAgICAgICA6IG1lc3NhZ2VzLnF1ZXN0aW9uUmVxdWlyZWQoZGV0YWlsKSxcbiAgICAgIHNvdW5kOiBraW5kID09PSBcInBlcm1pc3Npb25cIiA/IHsgbmFtZTogXCJwZXJtaXNzaW9uXCIgfSA6IHsgbmFtZTogXCJxdWVzdGlvblwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogSW4tYXBwIHRvYXN0IGZhbGxiYWNrICh3b3JrcyBvbiBldmVyeSBwbGF0Zm9ybSkuICovXG5leHBvcnQgZnVuY3Rpb24gdG9hc3QoYXBpOiBBcGksIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICB0cnkge1xuICAgIGFwaS51aS50b2FzdCh7IHZhcmlhbnQ6IFwiaW5mb1wiLCB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCBtZXNzYWdlIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBiZXN0LWVmZm9ydFxuICB9XG59XG5cbi8qKiBUcnVlIHdoZW4gcnVubmluZyBvbiBXaW5kb3dzICh1c2VkIHRvIGRlY2lkZSB0aGUgZGVsaXZlcnkgcGF0aCkuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaW5kb3dzKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gSVNfV0lORE9XUztcbn1cbiIsIi8qKlxuICogV2luZG93cy1vbmx5IGxpdmUgdGVybWluYWwgZm9jdXMgZGV0ZWN0aW9uLlxuICpcbiAqIEJhY2tncm91bmQ6IG9uIFdpbmRvd3MgdGhlIHJlbmRlcmVyJ3MgZm9jdXMvYmx1ciBldmVudHMgKERFQyAxMDA0IGZvY3VzIHJlcG9ydGluZyB2aWFcbiAqIENvblBUWSkgYXJlIHVucmVsaWFibGUg4oCUIHRoZSBmb2N1cy1pbiBzZXF1ZW5jZSBtYXkgYXJyaXZlIGF0IHN0YXJ0dXAgd2hpbGUgdGhlXG4gKiBmb2N1cy1vdXQgbmV2ZXIgZG9lcywgd2hpY2ggbGVhdmVzIHRoZSBwbHVnaW4gc3R1Y2sgYmVsaWV2aW5nIHRoZSB0ZXJtaW5hbCBpcyBmb2N1c2VkXG4gKiBhbmQgc3VwcHJlc3NpbmcgZXZlcnkgbm90aWZpY2F0aW9uLiBXZSB0aGVyZWZvcmUgYnlwYXNzIHRoZSBldmVudCBzdHJlYW0gb24gV2luZG93c1xuICogYW5kIHF1ZXJ5IHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyBkaXJlY3RseTpcbiAqXG4gKiAgIC0gVGhlIHdpbmRvdyBvZiB0aGUgdGVybWluYWwgaG9zdGluZyB0aGlzIHBsdWdpbiBiZWxvbmdzIHRvIGEgcHJvY2VzcyB0aGF0IGlzIGFuXG4gKiAgICAgYW5jZXN0b3Igb2Ygb3VyIG93biBwcm9jZXNzIChlLmcuIFdpbmRvd3MgVGVybWluYWwgLT4gc2hlbGwgLT4gb3BlbmNvZGUpLlxuICogICAtIFdoZW4gdGhhdCB0ZXJtaW5hbCBpcyBmb2N1c2VkLCB0aGUgZm9yZWdyb3VuZCB3aW5kb3cncyBvd25pbmcgUElEIGlzIGluIG91clxuICogICAgIGFuY2VzdG9yIGNoYWluLlxuICogICAtIFdoZW4gdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBhcHAsIHRoZSBmb3JlZ3JvdW5kIFBJRCBpcyBub3QgYW4gYW5jZXN0b3IuXG4gKlxuICogVHdvIGJhY2tlbmRzIGFyZSB1c2VkOlxuICogICAtIGBidW46ZmZpYCAoZmFzdCwgc3luY2hyb25vdXMpIHdoZW4gdGhlIHJ1bnRpbWUgc3VwcG9ydHMgaXQg4oCUIHZlcmlmaWVkIHdvcmtpbmcgaW5cbiAqICAgICBzdGFuZGFsb25lIEJ1bi1jb21waWxlZCBiaW5hcmllcy5cbiAqICAgLSBQb3dlclNoZWxsIChgR2V0Rm9yZWdyb3VuZFdpbmRvd2AgLyBgV2luMzJfUHJvY2Vzc2ApIGFzIGEgcG9ydGFibGUgZmFsbGJhY2sgdGhhdFxuICogICAgIHdvcmtzIGluIGFueSBydW50aW1lIChOb2RlIG9yIEJ1bikgc2luY2UgaXQgb25seSBuZWVkcyBgbm9kZTpjaGlsZF9wcm9jZXNzYC5cbiAqXG4gKiBJZiBuZWl0aGVyIGJhY2tlbmQgaXMgYXZhaWxhYmxlIHRoZSBtb2R1bGUgZGVncmFkZXMgdG8gXCJ1bmtub3duXCIgYW5kIHRoZSBjYWxsZXIgZmFsbHNcbiAqIGJhY2sgdG8gdGhlIHJlbmRlcmVyIGV2ZW50IHN0YXRlLlxuICovXG5cbmltcG9ydCB7IHNwYXduIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyA1NjggYnl0ZXMgPSBzaXplb2YoUFJPQ0VTU0VOVFJZMzJXKSBvbiB4NjQgKFVMT05HX1BUUiBmaWVsZCBmb3JjZXMgOC1ieXRlIGFsaWdubWVudCkuXG4vLyBXcm9uZyBkd1NpemUgbWFrZXMgUHJvY2VzczMyRmlyc3RXIGZhaWwgd2l0aCBFUlJPUl9CQURfTEVOR1RILCB3aGljaCB3ZSB0cmVhdCBhc1xuLy8gXCJ1bmtub3duXCIgYW5kIGZhbGwgYmFjayBncmFjZWZ1bGx5LlxuY29uc3QgUFJPQ0VTU0VOVFJZMzJXX1NJWkUgPSA1Njg7XG5jb25zdCBPRkZTRVRfVEgzMl9QUk9DRVNTX0lEID0gODtcbmNvbnN0IE9GRlNFVF9USDMyX1BBUkVOVF9QUk9DRVNTX0lEID0gMzI7XG5cbnR5cGUgQmFja2VuZCA9IFwiZmZpXCIgfCBcInBvd2Vyc2hlbGxcIiB8IFwibm9uZVwiO1xuXG5sZXQgYmFja2VuZDogQmFja2VuZCA9IFwibm9uZVwiO1xubGV0IGFuY2VzdG9ycyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xubGV0IGZmaUZvcmVncm91bmRQaWQ6ICgoKSA9PiBudW1iZXIgfCB1bmRlZmluZWQpIHwgdW5kZWZpbmVkO1xuXG4vLyBMaXZlIHN0YXR1cyBzdXJmYWNlLCByZW5kZXJlZCBpbnRvIHRoZSBzaWRlYmFyIGZvciBkZWJ1Z2dpbmcgdGhlIGZvY3VzIGdhdGUuXG5leHBvcnQgdHlwZSBGb2N1c1N0YXR1cyA9IHtcbiAgYmFja2VuZDogQmFja2VuZDtcbiAgYW5jZXN0b3JDb3VudDogbnVtYmVyO1xuICBsYXN0Rm9yZWdyb3VuZFBpZD86IG51bWJlcjtcbiAgbGFzdFJlc3VsdD86IGJvb2xlYW47XG4gIGxhc3RFcnJvcj86IHN0cmluZztcbn07XG5sZXQgc3RhdHVzOiBGb2N1c1N0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAgfTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGb2N1c1N0YXR1cygpOiBGb2N1c1N0YXR1cyB7XG4gIHJldHVybiBzdGF0dXM7XG59XG5cbmZ1bmN0aW9uIHJ1blBvd2VyU2hlbGwoc2NyaXB0OiBzdHJpbmcsIHRpbWVvdXRNcyA9IDgwMDApOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgb3V0ID0gXCJcIjtcbiAgICBsZXQgY2hpbGQ7XG4gICAgdHJ5IHtcbiAgICAgIGNoaWxkID0gc3Bhd24oXCJwb3dlcnNoZWxsLmV4ZVwiLCBbXCItTm9Qcm9maWxlXCIsIFwiLU5vbkludGVyYWN0aXZlXCIsIFwiLUNvbW1hbmRcIiwgc2NyaXB0XSwge1xuICAgICAgICB3aW5kb3dzSGlkZTogdHJ1ZSxcbiAgICAgICAgc3RkaW86IFtcImlnbm9yZVwiLCBcInBpcGVcIiwgXCJwaXBlXCJdLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2hpbGQua2lsbCgpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICB9LCB0aW1lb3V0TXMpO1xuICAgIGNoaWxkLnN0ZG91dD8ub24oXCJkYXRhXCIsIChjaHVuazogQnVmZmVyKSA9PiB7XG4gICAgICBvdXQgKz0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICB9KTtcbiAgICBjaGlsZC5vbihcImVycm9yXCIsICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgIH0pO1xuICAgIGNoaWxkLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHJlc29sdmUob3V0LnRyaW0oKSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKiogQ29tcHV0ZSBvdXIgYW5jZXN0b3IgUElEIGNoYWluIHZpYSBQb3dlclNoZWxsIChXaW4zMl9Qcm9jZXNzIHBhcmVudCB3YWxrKS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTogUHJvbWlzZTxTZXQ8bnVtYmVyPj4ge1xuICBjb25zdCBzZWxmUGlkID0gcHJvY2Vzcy5waWQ7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAnU2lsZW50bHlDb250aW51ZSdcbiRwaWRDaGFpbiA9IEAoJHtzZWxmUGlkfSlcbiRjdXIgPSAke3NlbGZQaWR9XG5mb3IgKCRpID0gMDsgJGkgLWx0IDMyIC1hbmQgJGN1ciAtZ3QgMDsgJGkrKykge1xuICAkcCA9IEdldC1DaW1JbnN0YW5jZSBXaW4zMl9Qcm9jZXNzIC1GaWx0ZXIgXCJQcm9jZXNzSWQ9JGN1clwiXG4gIGlmICgtbm90ICRwKSB7IGJyZWFrIH1cbiAgJG5leHQgPSAkcC5QYXJlbnRQcm9jZXNzSWRcbiAgaWYgKCRuZXh0IC1lcSAkY3VyIC1vciAkbmV4dCAtbGUgMCkgeyBicmVhayB9XG4gICRjdXIgPSAkbmV4dFxuICAkcGlkQ2hhaW4gKz0gJGN1clxufVxuJHBpZENoYWluIC1qb2luICcsJ1xuYDtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcnVuUG93ZXJTaGVsbChzY3JpcHQpO1xuICBjb25zdCBwaWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gIGZvciAoY29uc3QgcGFydCBvZiByZXN1bHQuc3BsaXQoXCIsXCIpKSB7XG4gICAgY29uc3QgbiA9IHBhcnNlSW50KHBhcnQsIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSBwaWRzLmFkZChuKTtcbiAgfVxuICByZXR1cm4gcGlkcztcbn1cblxuLyoqIEZvcmVncm91bmQgd2luZG93IG93bmluZyBQSUQgdmlhIFBvd2VyU2hlbGwgKHVzZXIzMiBHZXRGb3JlZ3JvdW5kV2luZG93KS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZvcmVncm91bmRQaWRWaWFQb3dlclNoZWxsKCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbkFkZC1UeXBlIC1UeXBlRGVmaW5pdGlvbiBAJ1xudXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLlJ1bnRpbWUuSW50ZXJvcFNlcnZpY2VzO1xucHVibGljIHN0YXRpYyBjbGFzcyBQdWxzZUZvY3VzIHtcbiAgW0RsbEltcG9ydChcInVzZXIzMi5kbGxcIildXG4gIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEludFB0ciBHZXRGb3JlZ3JvdW5kV2luZG93KCk7XG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxuICBwdWJsaWMgc3RhdGljIGV4dGVybiB1aW50IEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChJbnRQdHIgaFduZCwgb3V0IHVpbnQgbHBkd1Byb2Nlc3NJZCk7XG59XG4nQFxuJGggPSBbUHVsc2VGb2N1c106OkdldEZvcmVncm91bmRXaW5kb3coKVxuJHAgPSBbdWludDMyXTBcblt2b2lkXVtQdWxzZUZvY3VzXTo6R2V0V2luZG93VGhyZWFkUHJvY2Vzc0lkKCRoLCBbcmVmXSRwKVxuJHBcbmA7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJ1blBvd2VyU2hlbGwoc2NyaXB0KTtcbiAgY29uc3QgbiA9IHBhcnNlSW50KHJlc3VsdCwgMTApO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gbiA6IHVuZGVmaW5lZDtcbn1cblxuLyoqIFRyeSB0aGUgZmFzdCBidW46ZmZpIGJhY2tlbmQuIFJldHVybnMgdHJ1ZSB3aGVuIGZ1bGx5IGluaXRpYWxpemVkLiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdEZmaUJhY2tlbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBkbG9wZW4sIHB0ciB9ID0gYXdhaXQgaW1wb3J0KFwiYnVuOmZmaVwiKTtcbiAgICBjb25zdCB1c2VyMzIgPSBkbG9wZW4oXCJ1c2VyMzIuZGxsXCIsIHtcbiAgICAgIEdldEZvcmVncm91bmRXaW5kb3c6IHsgYXJnczogW10sIHJldHVybnM6IFwicHRyXCIgfSxcbiAgICAgIEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZDogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwidTMyXCIgfSxcbiAgICB9KTtcbiAgICBjb25zdCBrZXJuZWwzMiA9IGRsb3BlbihcImtlcm5lbDMyLmRsbFwiLCB7XG4gICAgICBHZXRDdXJyZW50UHJvY2Vzc0lkOiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInUzMlwiIH0sXG4gICAgICBDcmVhdGVUb29saGVscDMyU25hcHNob3Q6IHsgYXJnczogW1widTMyXCIsIFwidTMyXCJdLCByZXR1cm5zOiBcInB0clwiIH0sXG4gICAgICBQcm9jZXNzMzJGaXJzdFc6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXG4gICAgICBQcm9jZXNzMzJOZXh0VzogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcbiAgICAgIENsb3NlSGFuZGxlOiB7IGFyZ3M6IFtcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgVEgzMkNTX1NOQVBQUk9DRVNTID0gMHgyO1xuICAgIGNvbnN0IHNuYXBzaG90ID0ga2VybmVsMzIuc3ltYm9scy5DcmVhdGVUb29saGVscDMyU25hcHNob3QoVEgzMkNTX1NOQVBQUk9DRVNTLCAwKTtcbiAgICBpZiAoIXNuYXBzaG90KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbnRyeSA9IG5ldyBVaW50OEFycmF5KFBST0NFU1NFTlRSWTMyV19TSVpFKTtcbiAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoZW50cnkuYnVmZmVyKTtcbiAgICAgIHZpZXcuc2V0VWludDMyKDAsIFBST0NFU1NFTlRSWTMyV19TSVpFLCB0cnVlKTsgLy8gZHdTaXplXG5cbiAgICAgIGNvbnN0IHBhcmVudCA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgICBsZXQgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMkZpcnN0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XG4gICAgICB3aGlsZSAob2spIHtcbiAgICAgICAgY29uc3QgcGlkID0gdmlldy5nZXRVaW50MzIoT0ZGU0VUX1RIMzJfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IHBwaWQgPSB2aWV3LmdldFVpbnQzMihPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGlmIChwaWQgIT09IDApIHBhcmVudC5zZXQocGlkLCBwcGlkKTtcbiAgICAgICAgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMk5leHRXKHNuYXBzaG90LCBwdHIoZW50cnkpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IGtlcm5lbDMyLnN5bWJvbHMuR2V0Q3VycmVudFByb2Nlc3NJZCgpO1xuICAgICAgbGV0IGN1cnJlbnQgPSBzZWxmO1xuICAgICAgZm9yIChsZXQgZGVwdGggPSAwOyBkZXB0aCA8IDMyICYmIGN1cnJlbnQ7IGRlcHRoKyspIHtcbiAgICAgICAgYW5jZXN0b3JzLmFkZChjdXJyZW50KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXQoY3VycmVudCk7XG4gICAgICAgIGlmIChuZXh0ID09PSB1bmRlZmluZWQgfHwgbmV4dCA9PT0gY3VycmVudCkgYnJlYWs7XG4gICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBrZXJuZWwzMi5zeW1ib2xzLkNsb3NlSGFuZGxlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICBmZmlGb3JlZ3JvdW5kUGlkID0gKCkgPT4ge1xuICAgICAgY29uc3QgaHduZCA9IHVzZXIzMi5zeW1ib2xzLkdldEZvcmVncm91bmRXaW5kb3coKTtcbiAgICAgIGlmICghaHduZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHBpZEJ1ZiA9IG5ldyBVaW50MzJBcnJheSgxKTtcbiAgICAgIHVzZXIzMi5zeW1ib2xzLkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChod25kLCBwdHIocGlkQnVmKSk7XG4gICAgICByZXR1cm4gcGlkQnVmWzBdO1xuICAgIH07XG5cbiAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwiZmZpXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgcmV0dXJuIGFuY2VzdG9ycy5zaXplID4gMDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEVycm9yOiBTdHJpbmcoZXJyb3IpIH07XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmxldCBpbml0UHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVXaW5kb3dzRm9jdXNJbml0KCk6IHZvaWQge1xuICBpZiAoIUlTX1dJTkRPV1MpIHJldHVybjtcbiAgaW5pdFByb21pc2UgPz89IChhc3luYyAoKSA9PiB7XG4gICAgaWYgKGF3YWl0IGluaXRGZmlCYWNrZW5kKCkpIHtcbiAgICAgIGJhY2tlbmQgPSBcImZmaVwiO1xuICAgICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGJhY2tlbmQ6IFwiZmZpXCIgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYW5jZXN0b3JzID0gYXdhaXQgYW5jZXN0b3JzVmlhUG93ZXJTaGVsbCgpO1xuICAgIGlmIChhbmNlc3RvcnMuc2l6ZSA+IDApIHtcbiAgICAgIGJhY2tlbmQgPSBcInBvd2Vyc2hlbGxcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJwb3dlcnNoZWxsXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tlbmQgPSBcIm5vbmVcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAsIGxhc3RFcnJvcjogXCJubyBhbmNlc3RvciBjaGFpblwiIH07XG4gICAgfVxuICB9KSgpO1xuICB2b2lkIGluaXRQcm9taXNlO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGN1cnJlbnRseSBoYXMgZm9jdXMsIGZhbHNlIHdoZW4gdGhlIGZvcmVncm91bmQgd2luZG93XG4gKiBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IHByb2Nlc3MsIHVuZGVmaW5lZCB3aGVuIHRoZSBjaGVjayBpcyB1bmF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzVGVybWluYWxGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbiB8IHVuZGVmaW5lZD4ge1xuICBpZiAoIUlTX1dJTkRPV1MgfHwgYmFja2VuZCA9PT0gXCJub25lXCIpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChiYWNrZW5kID09PSBcImZmaVwiICYmIGZmaUZvcmVncm91bmRQaWQpIHtcbiAgICBjb25zdCBmb3JlZ3JvdW5kID0gZmZpRm9yZWdyb3VuZFBpZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGZvcmVncm91bmQgIT09IHVuZGVmaW5lZCA/IGFuY2VzdG9ycy5oYXMoZm9yZWdyb3VuZCkgOiB1bmRlZmluZWQ7XG4gICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RGb3JlZ3JvdW5kUGlkOiBmb3JlZ3JvdW5kLCBsYXN0UmVzdWx0OiByZXN1bHQgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGNvbnN0IGZvcmVncm91bmQgPSBhd2FpdCBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpO1xuICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xuICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEZvcmVncm91bmRQaWQ6IGZvcmVncm91bmQsIGxhc3RSZXN1bHQ6IHJlc3VsdCB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTtBQUVBOzs7QUN3QkEsSUFBTSxlQUF5QztBQUFBLEVBQzdDLElBQUk7QUFBQSxJQUNGLFdBQVc7QUFBQSxJQUNYLGVBQWUsQ0FBQyxVQUNkLFFBQVEsSUFBSSxPQUFPLDhCQUE4QjtBQUFBLElBQ25ELFVBQVU7QUFBQSxJQUNWLG9CQUFvQixDQUFDLFdBQ25CLFNBQVMsd0JBQXdCLFdBQVc7QUFBQSxJQUM5QyxrQkFBa0IsQ0FBQyxXQUNqQixTQUFTLG9CQUFvQixXQUFXO0FBQUEsRUFDNUM7QUFBQSxFQUNB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QUFLLFdBQVcsVUFBVSxNQUFNLFVBQVUsTUFBTTtBQUFBLFlBQy9GLE9BQU8sSUFDTDtBQUFBLGNBQ0UsT0FBTztBQUFBLGNBQ1AsZUFBZTtBQUFBLGNBQ2YsYUFBYTtBQUFBLGNBR2IsYUFBYSxDQUFDLFVBQStCO0FBQUEsZ0JBQzNDLElBQUksTUFBTSxXQUFXLGFBQWEsTUFBTSxXQUFXO0FBQUEsa0JBQUc7QUFBQSxnQkFDdEQsSUFBSSxNQUFNLFNBQVMsV0FBVyxFQUFFLFVBQVUsQ0FBQztBQUFBO0FBQUEsWUFFL0MsR0FDQTtBQUFBLGNBQ0UsS0FBSyxFQUFFLElBQUksWUFBWSxHQUFHLENBQUMsR0FBRSxDQUFDO0FBQUEsY0FDOUIsS0FBSyxFQUFFLElBQUksTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO0FBQUEsY0FDM0MsS0FBSyxFQUFFLElBQUksWUFBWSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUFBLGNBQzdDLEtBQUssRUFBRSxJQUFJLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxlQUFlLGFBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUFBLFlBQzFFLENBQ0Y7QUFBQSxXQUNEO0FBQUEsVUFFRCxPQUFPLElBQUksRUFBRSxPQUFPLFFBQVEsZUFBZSxTQUFTLEdBQUcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQztBQUFBO0FBQUEsTUFFMUY7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUVMO0FBRUEsSUFBZTsiLCJkZWJ1Z0lkIjoiMzcxQzlBOTJFRTIzREM3MjY0NzU2RTIxNjQ3NTZFMjEiLCJuYW1lcyI6W119
