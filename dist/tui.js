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

// src/notification.ts
var IS_WINDOWS = process.platform === "win32";
var WINDOWS_APP_ID = "opencode-agent-pulse";
function windowsNotify(payload) {
  import("node-notifier").then((mod) => {
    const notifier = mod.default ?? mod;
    notifier.notify({
      title: payload.title,
      message: payload.message,
      appID: WINDOWS_APP_ID,
      sound: true
    }, (err, response) => {});
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
    windowsNotify(payload);
  } else {
    await builtinNotify(api, payload);
  }
}
async function notifySubagentsDone(api, count, gate) {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: count > 1 ? `全部 ${count} 个子 agent 已完成` : "子 agent 已完成",
    sound: { name: "subagent_done" }
  }, gate);
}
async function notifyTurnDone(api, gate) {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: "本轮对话已完成",
    sound: { name: "done" }
  }, gate);
}
async function notifyInterviewInput(api, kind, detail, gate) {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: kind === "permission" ? detail ? `需要权限确认: ${detail}` : "主会话需要权限确认" : detail ? `需要回答: ${detail}` : "主会话需要回答询问",
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
  running.set(info.id, {
    agent: info.agent ?? "?",
    status: "idle",
    since: Date.now(),
    frozen: 0,
    title: info.title || undefined
  });
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
              notifyTurnDone(api, notifyGate).catch(() => {});
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
              notifySubagentsDone(api, taskParts.size, notifyGate).catch(() => {});
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
      notifyInterviewInput(api, "question", first?.question || first?.header, notifyGate).catch(() => {});
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
          notifyInterviewInput(api, "permission", permission, notifyGate).catch(() => {});
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
            text({ fg: theme.accent }, [`${isCollapsed ? "▸" : "▾"} Subagents`]),
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

//# debugId=7DF0CAEB2D9E048C64756E2164756E21
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL3R1aS50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL25vdGlmaWNhdGlvbi50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL3dpbmRvd3MtZm9jdXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBUdWlQbHVnaW5Nb2R1bGUgfSBmcm9tIFwiQG9wZW5jb2RlLWFpL3BsdWdpbi90dWlcIjtcbmltcG9ydCB0eXBlIHsgU2Vzc2lvbiwgVG9vbFBhcnQgfSBmcm9tIFwiQG9wZW5jb2RlLWFpL3Nkay92MlwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgaW5zZXJ0LCBzZXRQcm9wIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsIH0gZnJvbSBcInNvbGlkLWpzXCI7XG5pbXBvcnQgdHlwZSB7IE5vdGlmeUdhdGUgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25cIjtcbmltcG9ydCB7IG5vdGlmeUludGVydmlld0lucHV0LCBub3RpZnlTdWJhZ2VudHNEb25lLCBub3RpZnlUdXJuRG9uZSB9IGZyb20gXCIuL25vdGlmaWNhdGlvblwiO1xuaW1wb3J0IHsgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCwgZ2V0Rm9jdXNTdGF0dXMsIGlzVGVybWluYWxGb2N1c2VkIH0gZnJvbSBcIi4vd2luZG93cy1mb2N1c1wiO1xuXG4vKipcbiAqIFNpZGViYXIgd2lkZ2V0IHRoYXQgbGl2ZS10cmFja3MgcnVubmluZyBzdWJhZ2VudHMgKHN1Yi1zZXNzaW9ucykuXG4gKlxuICogRGF0YSBzb3VyY2UgKHNlc3Npb24gZXZlbnRzICsgdGFzayB0b29sIHBhcnRzKTpcbiAqICAgLSBgc2Vzc2lvbi5jcmVhdGVkYCAgICAgICAgIC0+IGlkZW50aWZ5IHN1Yi1zZXNzaW9ucyB2aWEgYHByb3BlcnRpZXMuaW5mby5wYXJlbnRJRGBcbiAqICAgLSBgc2Vzc2lvbi51cGRhdGVkYCAgICAgICAgIC0+IGJhY2tmaWxsOiByZXN1bWVkL2V4aXN0aW5nIHN1Yi1zZXNzaW9ucyBuZXZlciBlbWl0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb24uY3JlYXRlZGAsIGJ1dCBgU2Vzc2lvbi5wYXRjaGAgcHVibGlzaGVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb24udXBkYXRlZGAgd2l0aCB0aGUgZnVsbCBTZXNzaW9uIChwYXJlbnRJRCArXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWdlbnQgKyB0aXRsZSkgd2hlbmV2ZXIgdGhlIHNlc3Npb24gaXMgdG91Y2hlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlLmcuIG9uIG1lc3NhZ2UgYWN0aXZpdHkpLiBVc2VkIHRvIGFkZCBtaXNzaW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cmllcyBhbmQgcmVmcmVzaCBhZ2VudC90aXRsZSB3aXRob3V0IHJlc2V0dGluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyBvciB0aW1lcnMuXG4gKiAgIC0gYHNlc3Npb24uc3RhdHVzYCAgICAgICAgICAtPiBgcHJvcGVydGllcy5zdGF0dXMudHlwZWAgKFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCIpXG4gKiAgIC0gYG1lc3NhZ2UucGFydC51cGRhdGVkYCAgICAtPiB0YXNrIHRvb2wgcGFydCAoYHBhcnQudG9vbCA9PT0gXCJ0YXNrXCJgKSByZXBvcnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViLXNlc3Npb24gbGlmZWN5Y2xlOiBgcGFydC5zdGF0ZS5zdGF0dXNgIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJydW5uaW5nXCIgKG1hcmsgYnVzeSkgb3IgXCJjb21wbGV0ZWRcIi9cImVycm9yXCJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWFyayBkb25lKS4gQ2hpbGQgc2Vzc2lvbiBpcyBsaW5rZWQgdmlhIG1ldGFkYXRhXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb25JZGAvYHNlc3Npb25JRGAgKHN0YXRlLm1ldGFkYXRhIGZpcnN0LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcGFydC5tZXRhZGF0YSkuIFRoaXMgbWlycm9ycyB0aGUgYnVpbHQtaW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJhZ2VudCBwYW5lbCAoc3ViYWdlbnQtZGF0YS50cyk7IGBzZXNzaW9uLmlkbGVgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgZGVwcmVjYXRlZCBhbmQgbm90IGEgY29tcGxldGlvbiBzaWduYWwuXG4gKiAgIC0gYHNlc3Npb24uZGVsZXRlZGAgLyBgc2Vzc2lvbi5lcnJvcmAgLT4gcmVtb3ZlIC8gbWFyayBkb25lXG4gKlxuICogQm9vdHN0cmFwOiBvbiBzdGFydHVwLCBgYXBpLmNsaWVudC5zZXNzaW9uLmxpc3QoKWAgYmFja2ZpbGxzIHN1Yi1zZXNzaW9ucyB0aGF0XG4gKiBhbHJlYWR5IGV4aXN0IChlLmcuIGEgcmVzdW1lZCBwYXJlbnQgc2Vzc2lvbidzIGNoaWxkcmVuKSBzbyB0aGUgc2lkZWJhciBzaG93cyB0aGVtXG4gKiBldmVuIHRob3VnaCBgc2Vzc2lvbi5jcmVhdGVkYCB3YXMgbmV2ZXIgZW1pdHRlZCBmb3IgdGhlbS5cbiAqXG4gKiBSZW5kZXJpbmcgZm9sbG93cyB0aGUgcHJvZHVjdGlvbiBwYXR0ZXJuIG9mIG9oLW15LW9wZW5jb2RlLXNsaW06IHBsYWluIGZ1bmN0aW9uLWNhbGxcbiAqIGhlbHBlcnMgKGBib3hgL2B0ZXh0YCkgYnVpbHQgb24gYEBvcGVudHVpL3NvbGlkYCdzIGBjcmVhdGVFbGVtZW50YC9gaW5zZXJ0YC9gc2V0UHJvcGAsXG4gKiBzbyBubyBKU1gvYmFiZWwgdHJhbnNmb3JtIGlzIHJlcXVpcmVkLlxuICpcbiAqIElNUE9SVEFOVDogaW50ZXJhY3RpdmUgc3RhdGUgaXMgaGVsZCBpbiBzb2xpZCBzaWduYWxzIChgY3JlYXRlU2lnbmFsYCksIHJlYWQgZGlyZWN0bHlcbiAqIGluc2lkZSB0aGUgc2xvdCByZW5kZXJlci4gVGhpcyBpcyB0aGUgc2FtZSBtZWNoYW5pc20gdGhlIGJ1aWx0LWluIE1DUCBibG9jayB1c2VzXG4gKiAoYGNyZWF0ZVNpZ25hbGAgKyByZWFjdGl2ZSByZS1yZW5kZXIpLiBgYXBpLnJlbmRlcmVyLnJlcXVlc3RSZW5kZXIoKWAgZG9lcyBOT1QgcmUtaW52b2tlXG4gKiB0aGUgYHNpZGViYXJfY29udGVudGAgc2xvdCByZW5kZXJlciAodmVyaWZpZWQgYWdhaW5zdCBAb3BlbnR1aS9zb2xpZCAwLjQuMy8wLjUuMSBTbG90KSxcbiAqIHNvIGEgcGxhaW4gbWVtb3J5IHZhcmlhYmxlICsgcmVxdWVzdFJlbmRlciB3b3VsZCBuZXZlciB1cGRhdGUgdGhlIFVJLlxuICovXG5cbnR5cGUgU3ViYWdlbnRTdGF0dXMgPSBcImJ1c3lcIiB8IFwiaWRsZVwiIHwgXCJyZXRyeVwiIHwgXCJkb25lXCI7XG5cbnR5cGUgU3ViYWdlbnRJbmZvID0ge1xuICBhZ2VudDogc3RyaW5nO1xuICBzdGF0dXM6IFN1YmFnZW50U3RhdHVzO1xuICBzaW5jZTogbnVtYmVyOyAvLyBlcG9jaCBtcyB3aGVuIHRoZSBjdXJyZW50IGJ1c3kgcnVuIHN0YXJ0ZWQgKHRpY2tzIHdoaWxlIGJ1c3kvcmV0cnkpXG4gIGZyb3plbjogbnVtYmVyOyAvLyBhY2N1bXVsYXRlZCBlbGFwc2VkIG1zIGZyb20gcHJldmlvdXMgYnVzeSBydW5zIChmcm96ZW4gd2hpbGUgaWRsZS9kb25lKVxuICB0aXRsZT86IHN0cmluZzsgLy8gY3VzdG9tIG5hbWU6IHRhc2sgdG9vbCBpbnB1dC5kZXNjcmlwdGlvbiwgb3Igc2Vzc2lvbiB0aXRsZSBhcyBmYWxsYmFja1xufTtcblxudHlwZSBSdW5uaW5nRW50cnkgPSBbc2Vzc2lvbklEOiBzdHJpbmcsIGluZm86IFN1YmFnZW50SW5mb107XG5cbmZ1bmN0aW9uIGVsZW1lbnQodGFnOiBzdHJpbmcsIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9LCBjaGlsZHJlbjogdW5rbm93bltdID0gW10pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVFbGVtZW50KHRhZyk7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzKSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBzZXRQcm9wKG5vZGUsIGtleSwgdmFsdWUpO1xuICB9XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICBpZiAoY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gZmFsc2UpIGNvbnRpbnVlO1xuICAgIGluc2VydChub2RlLCBjaGlsZCk7XG4gIH1cbiAgcmV0dXJuIG5vZGUgYXMgdW5rbm93biBhcyBKU1guRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gdGV4dChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGNoaWxkcmVuOiB1bmtub3duW10gPSBbXSk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIGVsZW1lbnQoXCJ0ZXh0XCIsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGJveChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGNoaWxkcmVuOiB1bmtub3duW10gPSBbXSk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIGVsZW1lbnQoXCJib3hcIiwgcHJvcHMsIGNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RHVyYXRpb24oZWxhcHNlZE1zOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCB0b3RhbFNlY29uZHMgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKGVsYXBzZWRNcyAvIDEwMDApKTtcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICBjb25zdCBzZWNvbmRzID0gdG90YWxTZWNvbmRzICUgNjA7XG4gIHJldHVybiBtaW51dGVzID4gMCA/IGAke21pbnV0ZXN9bSR7c2Vjb25kcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1zYCA6IGAke3NlY29uZHN9c2A7XG59XG5cbi8vIFNob3duIGVsYXBzZWQgdGltZTogdGlja3Mgb25seSB3aGlsZSBidXN5L3JldHJ5OyBmcm96ZW4gd2hpbGUgaWRsZS9kb25lLlxuZnVuY3Rpb24gZW50cnlFbGFwc2VkKGluZm86IFN1YmFnZW50SW5mbyk6IG51bWJlciB7XG4gIHJldHVybiBpbmZvLnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIlxuICAgID8gaW5mby5mcm96ZW4gKyAoRGF0ZS5ub3coKSAtIGluZm8uc2luY2UpXG4gICAgOiBpbmZvLmZyb3plbjtcbn1cblxuLy8gUmVhZCBhIHRhc2sgdG9vbCBwYXJ0J3MgbWV0YWRhdGEgdmFsdWUuIE1pcnJvcnMgc3ViYWdlbnQtZGF0YS50cyBgbWV0YWRhdGEoKWA6XG4vLyBwcmVmZXIgYHN0YXRlLm1ldGFkYXRhYCwgZmFsbCBiYWNrIHRvIGBwYXJ0Lm1ldGFkYXRhYC4gT25seSBzb21lIFRvb2xTdGF0ZSB2YXJpYW50c1xuLy8gY2FycnkgbWV0YWRhdGEsIHNvIG5hcnJvdyB2aWEgYFwibWV0YWRhdGFcIiBpbiBzdGF0ZWAgZXhhY3RseSBsaWtlIHRoZSBidWlsdC1pbiBwYW5lbC5cbmZ1bmN0aW9uIHRvb2xNZXRhZGF0YShwYXJ0OiBUb29sUGFydCwga2V5OiBzdHJpbmcpOiB1bmtub3duIHtcbiAgcmV0dXJuIChcIm1ldGFkYXRhXCIgaW4gcGFydC5zdGF0ZSA/IHBhcnQuc3RhdGUubWV0YWRhdGE/LltrZXldIDogdW5kZWZpbmVkKSA/PyBwYXJ0Lm1ldGFkYXRhPy5ba2V5XTtcbn1cblxuLy8gQWRkIGEgc3ViLXNlc3Npb24gdG8gdGhlIHJ1bm5pbmcgbWFwIGZyb20gYSBmdWxsIFNESyBTZXNzaW9uIChzZXNzaW9uLmNyZWF0ZWQgL1xuLy8gc2Vzc2lvbi51cGRhdGVkIC8gYm9vdHN0cmFwKS4gS2VlcHMgYW55IGV4aXN0aW5nIGVudHJ5J3Mgc3RhdHVzIGFuZCB0aW1lcnMgaW50YWN0LlxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBtYXAgY2hhbmdlZCAobmV3IGVudHJ5LCBvciByZWZyZXNoZWQgYWdlbnQvdGl0bGUpLlxuZnVuY3Rpb24gdXBzZXJ0U2Vzc2lvbihydW5uaW5nOiBNYXA8c3RyaW5nLCBTdWJhZ2VudEluZm8+LCBpbmZvOiBTZXNzaW9uKTogYm9vbGVhbiB7XG4gIGlmICghaW5mby5wYXJlbnRJRCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBleGlzdGluZyA9IHJ1bm5pbmcuZ2V0KGluZm8uaWQpO1xuICBpZiAoZXhpc3RpbmcpIHtcbiAgICAvLyBPbmx5IHJlZnJlc2ggbWV0YWRhdGE7IG5ldmVyIHJlc2V0IHN0YXR1cy9jbG9jayBvZiBhIHRyYWNrZWQgZW50cnkuXG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICBpZiAoaW5mby5hZ2VudCAmJiBpbmZvLmFnZW50ICE9PSBleGlzdGluZy5hZ2VudCkge1xuICAgICAgZXhpc3RpbmcuYWdlbnQgPSBpbmZvLmFnZW50O1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpbmZvLnRpdGxlICYmIGluZm8udGl0bGUgIT09IGV4aXN0aW5nLnRpdGxlKSB7XG4gICAgICBleGlzdGluZy50aXRsZSA9IGluZm8udGl0bGU7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZWQ7XG4gIH1cbiAgcnVubmluZy5zZXQoaW5mby5pZCwge1xuICAgIGFnZW50OiBpbmZvLmFnZW50ID8/IFwiP1wiLFxuICAgIHN0YXR1czogXCJpZGxlXCIsXG4gICAgc2luY2U6IERhdGUubm93KCksXG4gICAgZnJvemVuOiAwLFxuICAgIHRpdGxlOiBpbmZvLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgfSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5jb25zdCBwbHVnaW46IFR1aVBsdWdpbk1vZHVsZSA9IHtcbiAgaWQ6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2U6dHVpXCIsXG4gIHR1aTogYXN5bmMgKGFwaSwgb3B0aW9ucywgX21ldGEpID0+IHtcbiAgICAvLyBOb3RpZmljYXRpb24gdG9nZ2xlcyBmcm9tIHBsdWdpbiBvcHRpb25zIChyZWdpc3RlcmVkIHZpYSB0aGUgdHVwbGUgZm9ybTpcbiAgICAvLyBbXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCB7IFwibm90aWZpY2F0aW9uc1wiOiB7IC4uLiB9IH1dKS5cbiAgICBjb25zdCBub3RpZkNmZyA9IChvcHRpb25zIGFzXG4gICAgICB8IHsgbm90aWZpY2F0aW9ucz86IHsgc3ViYWdlbnRzPzogYm9vbGVhbjsgbWFpblNlc3Npb24/OiBib29sZWFuOyBpbnRlcnZpZXc/OiBib29sZWFuOyBvbmx5V2hlblVuZm9jdXNlZD86IGJvb2xlYW4gfSB9XG4gICAgICB8IHVuZGVmaW5lZCk/Lm5vdGlmaWNhdGlvbnM7XG4gICAgY29uc3Qgbm90aWZ5U3ViYWdlbnRzID0gbm90aWZDZmc/LnN1YmFnZW50cyA/PyB0cnVlO1xuICAgIGNvbnN0IG5vdGlmeU1haW5TZXNzaW9uID0gbm90aWZDZmc/Lm1haW5TZXNzaW9uID8/IHRydWU7XG4gICAgY29uc3Qgbm90aWZ5SW50ZXJ2aWV3ID0gbm90aWZDZmc/LmludGVydmlldyA/PyB0cnVlO1xuICAgIC8vIE9wdC1pbiBcIm5vdGlmeSBvbmx5IHdoZW4gdGhlIHRlcm1pbmFsIGlzIHVuZm9jdXNlZFwiLiBUaGUgaG9zdCB0cmFja3MgZm9jdXMgdmlhXG4gICAgLy8gcmVuZGVyZXIgXCJmb2N1c1wiL1wiYmx1clwiIGV2ZW50cyAoREVDIDEwMDQgZm9jdXMgcmVwb3J0aW5nKTsgd2UgbWlycm9yIHRoZSBzYW1lXG4gICAgLy8gc291cmNlIHRocm91Z2ggYGFwaS5yZW5kZXJlcmAuIERlZmF1bHRzIHRvIGZhbHNlOiBub3RpZmljYXRpb25zIGZpcmUgcmVnYXJkbGVzc1xuICAgIC8vIG9mIGZvY3VzLCBwcmVzZXJ2aW5nIHRoZSBjdXJyZW50IGJlaGF2aW9yLlxuICAgIGNvbnN0IG5vdGlmeU9ubHlXaGVuVW5mb2N1c2VkID0gbm90aWZDZmc/Lm9ubHlXaGVuVW5mb2N1c2VkID8/IGZhbHNlO1xuICAgIC8vIE9wdC1pbiBkZWJ1ZyBkaXNwbGF5OiBzaG93IHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIChmb2N1c2VkL2JsdXJyZWQgKyBiYWNrZW5kKSBhc1xuICAgIC8vIGEgc21hbGwgbGluZSBpbiB0aGUgc2lkZWJhci4gRGVmYXVsdHMgdG8gZmFsc2U6IGhpZGRlbiB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLlxuICAgIGNvbnN0IHNob3dGb2N1cyA9IChvcHRpb25zIGFzIHsgc2lkZWJhcj86IHsgc2hvd0ZvY3VzPzogYm9vbGVhbiB9IH0gfCB1bmRlZmluZWQpPy5zaWRlYmFyPy5zaG93Rm9jdXMgPz8gZmFsc2U7XG4gICAgLy8gU291cmNlIG9mIHRydXRoIGZvciBsb29rdXBzIChzZXNzaW9uSUQgLT4gaW5mbykuIFJlbmRlcmVkIHZpYSBgcnVubmluZ0VudHJpZXNgXG4gICAgLy8gc2lnbmFsIGJlbG93IHNvIHNvbGlkIHJlYWN0aXZpdHkgcmUtcmVuZGVycyB0aGUgc2xvdCBvbiBldmVyeSBjaGFuZ2UuXG4gICAgY29uc3QgcnVubmluZyA9IG5ldyBNYXA8c3RyaW5nLCBTdWJhZ2VudEluZm8+KCk7XG4gICAgY29uc3QgW3J1bm5pbmdFbnRyaWVzLCBzZXRSdW5uaW5nRW50cmllc10gPSBjcmVhdGVTaWduYWw8UnVubmluZ0VudHJ5W10+KFtdKTtcbiAgICAvLyBDb2xsYXBzZSBzdGF0ZSwgbWF0Y2hlcyBNQ1AvVE9ETyBzZWN0aW9uIGludGVyYWN0aW9uIChidWlsdC1pbiB1c2VzIGNyZWF0ZVNpZ25hbCB0b28pLlxuICAgIGNvbnN0IFtjb2xsYXBzZWQsIHNldENvbGxhcHNlZF0gPSBjcmVhdGVTaWduYWwoZmFsc2UpO1xuXG4gICAgLy8gLS0tIE5vdGlmaWNhdGlvbiBzdGF0ZSAtLS1cbiAgICAvLyBcIkFsbCBzdWJhZ2VudHMgZG9uZVwiIGRldGVjdGlvbjogdHJhY2sgZXZlcnkgdGFzayB0b29sIHBhcnQncyBsaWZlY3ljbGUgc28gd2UgY2FuXG4gICAgLy8gbm90aWZ5IG9uY2Ugd2hlbiBhIHdob2xlIGRlbGVnYXRpb24gcm91bmQgZHJhaW5zIHRvIHplcm8gYWN0aXZlIHBhcnRzLlxuICAgIGNvbnN0IHRhc2tQYXJ0cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IC8vIGNhbGxJRCAtPiBjdXJyZW50IHN0YXR1c1xuICAgIGxldCBhY3RpdmVUYXNrQ291bnQgPSAwOyAvLyAjIHRhc2sgcGFydHMgY3VycmVudGx5IFwicGVuZGluZ1wiIG9yIFwicnVubmluZ1wiXG4gICAgbGV0IHJvdW5kTm90aWZpZWQgPSBmYWxzZTsgLy8gZGVkdXA6IGhhcyB0aGUgY3VycmVudCBiYXRjaCBhbHJlYWR5IGJlZW4gYW5ub3VuY2VkP1xuICAgIC8vIFwiVHVybiBkb25lXCIgZGV0ZWN0aW9uOiBtYWluIChub24tc3ViKSBzZXNzaW9ucyBvbmx5LiBXZSBub3RpZnkgb24gdGhlIGJ1c3ktPmlkbGVcbiAgICAvLyB0cmFuc2l0aW9uIG9mIGEgbWFpbiBzZXNzaW9uLCB3aGljaCBmaXJlcyBvbmNlIHBlciByb3VuZC4gQXJtZWQgc2V0IGtleWVkIGJ5XG4gICAgLy8gc2Vzc2lvbklEIHNvIG11bHRpcGxlIHRvcC1sZXZlbCBzZXNzaW9ucyBkb24ndCBpbnRlcmZlcmU7IG1pcnJvcnMgdGhlIGJ1aWx0LWluXG4gICAgLy8gbm90aWZpY2F0aW9ucyBwbHVnaW4gYmVoYXZpb3IuXG4gICAgY29uc3QgbWFpbkFybWVkID0gbmV3IFNldDxzdHJpbmc+KCk7IC8vIHNlc3Npb25JRHMgYXJtZWQgb24gYnVzeS9yZXRyeSwgZmlyZWQgb24gaWRsZVxuICAgIC8vIFwiSW50ZXJ2aWV3IGJsb2NrZWRcIiBkZXRlY3Rpb246IHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBpcyBzdXNwZW5kZWQgd2FpdGluZyBmb3IgdXNlclxuICAgIC8vIGlucHV0IChgcXVlc3Rpb25gIHRvb2wgb3IgcGVybWlzc2lvbiBhcHByb3ZhbCksIG5vdGlmeSBvbmNlIHBlciBwZW5kaW5nIHJlcXVlc3QuXG4gICAgLy8gcXVlc3Rpb24uYXNrZWQgLyBwZXJtaXNzaW9uLmFza2VkIGFyZSB0aGUgYXV0aG9yaXRhdGl2ZSBzaWduYWxzIOKAlCB0aGUgYWdlbnQgaXNcbiAgICAvLyBwYXJrZWQgb24gYSBEZWZlcnJlZCwgc28gbm8gc2Vzc2lvbi5zdGF0dXMgY2hhbmdlIGlzIGVtaXR0ZWQuIERlZHVwIGJ5IHJlcXVlc3QgaWRcbiAgICAvLyBhbmQgY2xlYXIgb24gcmVwbGllZC9yZWplY3RlZCAobWlycm9ycyB0aGUgYnVpbHQtaW4gbm90aWZpY2F0aW9ucyBwbHVnaW4pLlxuICAgIGNvbnN0IHBlbmRpbmdRdWVzdGlvbnMgPSBuZXcgU2V0PHN0cmluZz4oKTsgLy8gcXVlc3Rpb24gcmVxdWVzdCBpZHMgYXdhaXRpbmcgYW4gYW5zd2VyXG4gICAgLy8gUGVybWlzc2lvbiByZXF1ZXN0cyBhd2FpdGluZyBhIHJlcGx5LiBWYWx1ZXMgaG9sZCB0aGUgZGVmZXJyZWQtbm90aWZpY2F0aW9uIHRpbWVyXG4gICAgLy8gc28gaXQgY2FuIGJlIGNhbmNlbGxlZCB3aGVuIGEgcmVwbHkgYXJyaXZlcyAoc2VlIHRoZSBwZXJtaXNzaW9uLmFza2VkIGhhbmRsZXIpLlxuICAgIGNvbnN0IHBlbmRpbmdQZXJtaXNzaW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0Pj4oKTtcblxuICAgIC8vIC0tLSBUZXJtaW5hbCBmb2N1cyB0cmFja2luZyAtLS1cbiAgICAvLyBgdW5kZWZpbmVkYCA9IHVua25vd24gKGUuZy4gV2luZG93cyBUZXJtaW5hbCBuZXZlciByZXBvcnRzIERFQyAxMDA0IGZvY3VzIGV2ZW50cyxcbiAgICAvLyBzbyBubyBcImZvY3VzXCIvXCJibHVyXCIgd2lsbCBldmVyIGZpcmUgYW5kIG5vdGlmaWNhdGlvbnMgc3RheSBlbmFibGVkIHRoZXJlKS4gT25seSBhXG4gICAgLy8gZGVmaW5pdGl2ZSBcImZvY3VzZWRcIiBzdGF0ZSBzdXBwcmVzc2VzIG5vdGlmaWNhdGlvbnMgd2hlbiB0aGUgb3B0aW9uIGlzIGVuYWJsZWQuXG4gICAgLy9cbiAgICAvLyBPbiBXaW5kb3dzIHRoZSByZW5kZXJlcidzIERFQyAxMDA0IGJsdXIgZXZlbnQgb2Z0ZW4gbmV2ZXIgYXJyaXZlcyAoZm9jdXMtaW4gZmlyZXNcbiAgICAvLyBhdCBzdGFydHVwLCBmb2N1cy1vdXQgaXMgZHJvcHBlZCksIHdoaWNoIHdvdWxkIHBlcm1hbmVudGx5IHNldCBgZm9jdXNlZCA9IHRydWVgLlxuICAgIC8vIEFzIGEgcmVsaWFibGUgZmFsbGJhY2sgd2UgcXVlcnkgdGhlIFdpbjMyIGZvcmVncm91bmQgd2luZG93IHZpYSBgYnVuOmZmaWAgaW5zdGVhZDpcbiAgICAvLyB0aGUgdGVybWluYWwgaG9zdGluZyB1cyBpcyBhbiBhbmNlc3RvciBwcm9jZXNzLCBzbyBcImZvcmVncm91bmQgd2luZG93IFBJRCBpcyBpbiBvdXJcbiAgICAvLyBhbmNlc3RvciBjaGFpblwiIG1lYW5zIHRoZSB0ZXJtaW5hbCBoYXMgZm9jdXMuIFJlbmRlcmVyIGV2ZW50cyByZW1haW4gdGhlIHNvdXJjZSBvblxuICAgIC8vIG5vbi1XaW5kb3dzIGFuZCBhcyBhIHNlY29uZGFyeSBzaWduYWwgZXZlcnl3aGVyZSBlbHNlLlxuICAgIGVuc3VyZVdpbmRvd3NGb2N1c0luaXQoKTtcbiAgICBsZXQgZm9jdXNlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvLyBEZWJ1ZyBzdXJmYWNlOiBleHBvc2UgdGhlIGZvY3VzIGJhY2tlbmQgKyBsYXN0IHJlc3VsdCBpbiB0aGUgc2lkZWJhciBzbyB3ZSBjYW5cbiAgICAvLyB2ZXJpZnkgdGhlIGdhdGUgd2l0aG91dCByZWx5aW5nIG9uIGZpbGUgbG9ncyAod2hpY2ggbWF5IGJlIGJsb2NrZWQgaW4gdGhlIHJ1bnRpbWUpLlxuICAgIGNvbnN0IFtmb2N1c0RpYWcsIHNldEZvY3VzRGlhZ10gPSBjcmVhdGVTaWduYWwoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3QgcmVmcmVzaEZvY3VzRGlhZyA9ICgpID0+IHNldEZvY3VzRGlhZyhnZXRGb2N1c1N0YXR1cygpKTtcbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IHRydWU7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgICBmb2N1c2VkID0gZmFsc2U7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJmb2N1c1wiLCBvbkZvY3VzKTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJibHVyXCIsIG9uQmx1cik7XG4gICAgY29uc3Qgbm90aWZ5R2F0ZTogTm90aWZ5R2F0ZSA9IHtcbiAgICAgIG9ubHlXaGVuVW5mb2N1c2VkOiBub3RpZnlPbmx5V2hlblVuZm9jdXNlZCxcbiAgICAgIGZvY3VzZWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gYXdhaXQgaXNUZXJtaW5hbEZvY3VzZWQoKTtcbiAgICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgICAgICByZXR1cm4gd2luID8/IGZvY3VzZWQ7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBzeW5jRW50cmllcyA9ICgpID0+IHNldFJ1bm5pbmdFbnRyaWVzKFsuLi5ydW5uaW5nLmVudHJpZXMoKV0pO1xuXG4gICAgY29uc3QgdW5zdWJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgLy8gQm9vdHN0cmFwOiBiYWNrZmlsbCBzdWItc2Vzc2lvbnMgdGhhdCBhbHJlYWR5IGV4aXN0IChlLmcuIGEgcmVzdW1lZCBwYXJlbnRcbiAgICAvLyBzZXNzaW9uJ3MgY2hpbGRyZW4pLiBSZXN1bWVkIHNlc3Npb25zIG5ldmVyIGVtaXQgc2Vzc2lvbi5jcmVhdGVkLCBzbyB3aXRob3V0XG4gICAgLy8gdGhpcyB0aGUgc2lkZWJhciB3b3VsZCBiZSBibGluZCB0byB0aGVtIHVudGlsIGEgYnJhbmQtbmV3IHN1YmFnZW50IHN0YXJ0cy5cbiAgICBhcGkuY2xpZW50LnNlc3Npb25cbiAgICAgIC5saXN0KClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbnMgPSByZXN1bHQuZGF0YSA/PyBbXTtcbiAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBzZXNzaW9uIG9mIHNlc3Npb25zKSB7XG4gICAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgc2Vzc2lvbikpIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VkKSBzeW5jRW50cmllcygpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIEJlc3QtZWZmb3J0IGJvb3RzdHJhcDsgbGl2ZSBldmVudHMgc3RpbGwgZHJpdmUgdGhlIGxpc3QgYWZ0ZXJ3YXJkcy5cbiAgICAgIH0pO1xuXG4gICAgLy8gc2Vzc2lvbi5jcmVhdGVkOiBvbmx5IHN1Yi1zZXNzaW9ucyBjYXJyeSBhIHBhcmVudElELlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5jcmVhdGVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJlbnRJRCA9IGV2ZW50LnByb3BlcnRpZXM/LmluZm8/LnBhcmVudElEO1xuICAgICAgICBpZiAoIXBhcmVudElEKSByZXR1cm47XG4gICAgICAgIHJ1bm5pbmcuc2V0KGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklELCB7XG4gICAgICAgICAgYWdlbnQ6IGV2ZW50LnByb3BlcnRpZXMuaW5mby5hZ2VudCA/PyBcIj9cIixcbiAgICAgICAgICBzdGF0dXM6IFwiaWRsZVwiLFxuICAgICAgICAgIHNpbmNlOiBEYXRlLm5vdygpLFxuICAgICAgICAgIGZyb3plbjogMCxcbiAgICAgICAgICB0aXRsZTogZXZlbnQucHJvcGVydGllcy5pbmZvLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi51cGRhdGVkOiBmaXJlZCBieSBTZXNzaW9uLnBhdGNoIChlLmcuIHNlc3Npb24gdG91Y2ggb24gbWVzc2FnZSBhY3Rpdml0eSlcbiAgICAvLyB3aXRoIHRoZSBmdWxsIFNlc3Npb24uIEZvciByZXN1bWVkL2V4aXN0aW5nIHN1Yi1zZXNzaW9ucyB0aGlzIGlzIHRoZSBvbmx5IGV2ZW50XG4gICAgLy8gdGhhdCBjYXJyaWVzIHRoZWlyIGlkZW50aXR5LCBzbyB1c2UgaXQgdG8gYmFja2ZpbGwgbWlzc2luZyBlbnRyaWVzIGFuZCByZWZyZXNoXG4gICAgLy8gYWdlbnQvdGl0bGUgd2l0aG91dCBkaXN0dXJiaW5nIHN0YXR1cyBvciB0aGUgZWxhcHNlZCBjbG9jay5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24udXBkYXRlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgZXZlbnQucHJvcGVydGllcy5pbmZvKSkge1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBzZXNzaW9uLnN0YXR1czogYnVzeSAvIGlkbGUgLyByZXRyeS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24uc3RhdHVzXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5wcm9wZXJ0aWVzLnNlc3Npb25JRDtcbiAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50LnByb3BlcnRpZXMuc3RhdHVzLnR5cGU7IC8vIFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCJcblxuICAgICAgICAvLyAtLS0gXCJUdXJuIGRvbmVcIiBub3RpZmljYXRpb24gZm9yIHRoZSBtYWluIChub24tc3ViKSBzZXNzaW9uIC0tLVxuICAgICAgICAvLyBNaXJyb3JzIHRoZSBidWlsdC1pbiBub3RpZmljYXRpb25zIHBsdWdpbjogYXJtIG9uIGJ1c3kvcmV0cnksIGZpcmUgb25jZSBvbiB0aGVcbiAgICAgICAgLy8gZm9sbG93aW5nIGlkbGUsIHRoZW4gZGlzYXJtLiBPbmx5IGZpcmVzIGZvciBzZXNzaW9ucyB0aGF0IGFyZSBub3QgdHJhY2tlZFxuICAgICAgICAvLyBzdWJhZ2VudHMgKHRvcC1sZXZlbC9tYWluIHNlc3Npb25zKS5cbiAgICAgICAgaWYgKCFydW5uaW5nLmhhcyhzZXNzaW9uSUQpKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT09IFwiYnVzeVwiIHx8IHR5cGUgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgbWFpbkFybWVkLmFkZChzZXNzaW9uSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJpZGxlXCIpIHtcbiAgICAgICAgICAgIGlmIChtYWluQXJtZWQuaGFzKHNlc3Npb25JRCkpIHtcbiAgICAgICAgICAgICAgbWFpbkFybWVkLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgICAgICAgICBpZiAobm90aWZ5TWFpblNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBub3RpZnlUdXJuRG9uZShhcGksIG5vdGlmeUdhdGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZm8gPSBydW5uaW5nLmdldChzZXNzaW9uSUQpO1xuICAgICAgICBpZiAoIWluZm8pIHJldHVybjtcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYnVzeVwiIHx8IHR5cGUgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgIC8vIFN0YXJ0IGEgbmV3IGNvdW50aW5nIHJ1biBvbiBidXN5L3JldHJ5OyBrZWVwIGFjY3VtdWxhdGVkIGZyb3plbiB0aW1lLlxuICAgICAgICAgIGlmIChpbmZvLnN0YXR1cyAhPT0gXCJidXN5XCIgJiYgaW5mby5zdGF0dXMgIT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgaW5mby5zaW5jZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZm8uc3RhdHVzID0gdHlwZTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImlkbGVcIikge1xuICAgICAgICAgIC8vIEZyZWV6ZSB0aGUgY2xvY2sgd2hpbGUgaWRsZTsga2VlcCBcImRvbmVcIiBhcyB0aGUgdGVybWluYWwgc3RhdGUuXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLmZyb3plbiArPSBEYXRlLm5vdygpIC0gaW5mby5zaW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSBcImRvbmVcIikge1xuICAgICAgICAgICAgaW5mby5zdGF0dXMgPSBcImlkbGVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0VudHJpZXMoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBtZXNzYWdlLnBhcnQudXBkYXRlZDogdGFzayB0b29sIHBhcnRzIHJlcG9ydCB0aGUgc3ViLXNlc3Npb24gbGlmZWN5Y2xlLiBUaGlzIGlzXG4gICAgLy8gdGhlIHNhbWUgc291cmNlIHRoZSBidWlsdC1pbiBzdWJhZ2VudCBwYW5lbCB1c2VzOyBgc2Vzc2lvbi5pZGxlYCBpcyBkZXByZWNhdGVkLlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwibWVzc2FnZS5wYXJ0LnVwZGF0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnQgPSBldmVudC5wcm9wZXJ0aWVzLnBhcnQ7XG4gICAgICAgIGlmIChwYXJ0LnR5cGUgIT09IFwidG9vbFwiIHx8IHBhcnQudG9vbCAhPT0gXCJ0YXNrXCIpIHJldHVybjtcblxuICAgICAgICAvLyAtLS0gXCJBbGwgc3ViYWdlbnRzIGRvbmVcIiBkZXRlY3Rpb24gKGJhdGNoLXdpZGUsIGluZGVwZW5kZW50IG9mIGNoaWxkSUQpIC0tLVxuICAgICAgICAvLyBUcmFjayBldmVyeSB0YXNrIHRvb2wgcGFydCdzIGxpZmVjeWNsZSBrZXllZCBieSBjYWxsSUQgc28gd2UgY2FuIHRlbGwgd2hlbiBhXG4gICAgICAgIC8vIHdob2xlIGRlbGVnYXRpb24gYmF0Y2ggZHJhaW5zIHRvIHplcm8gYWN0aXZlIHBhcnRzLiBOb3RpZnkgb25jZSBwZXIgYmF0Y2guXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHBhcnQuc3RhdGUuc3RhdHVzO1xuICAgICAgICBjb25zdCBwcmV2U3RhdHVzID0gdGFza1BhcnRzLmdldChwYXJ0LmNhbGxJRCk7XG4gICAgICAgIHRhc2tQYXJ0cy5zZXQocGFydC5jYWxsSUQsIHN0YXR1cyk7XG5cbiAgICAgICAgY29uc3Qgd2FzQWN0aXZlID0gcHJldlN0YXR1cyA9PT0gXCJwZW5kaW5nXCIgfHwgcHJldlN0YXR1cyA9PT0gXCJydW5uaW5nXCI7XG4gICAgICAgIGNvbnN0IG5vd0FjdGl2ZSA9IHN0YXR1cyA9PT0gXCJwZW5kaW5nXCIgfHwgc3RhdHVzID09PSBcInJ1bm5pbmdcIjtcbiAgICAgICAgaWYgKHdhc0FjdGl2ZSAmJiAhbm93QWN0aXZlKSB7XG4gICAgICAgICAgLy8gQSBwcmV2aW91c2x5LWFjdGl2ZSB0YXNrIGp1c3QgcmVhY2hlZCBhIHRlcm1pbmFsIHN0YXRlLlxuICAgICAgICAgIGFjdGl2ZVRhc2tDb3VudC0tO1xuICAgICAgICAgIGlmIChhY3RpdmVUYXNrQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIC8vIEJhdGNoIGRyYWluZWQgdG8gemVybyAtPiBhbGwgZGVsZWdhdGVkIHN1YmFnZW50cyBmaW5pc2hlZC5cbiAgICAgICAgICAgIGlmICghcm91bmROb3RpZmllZCkge1xuICAgICAgICAgICAgICByb3VuZE5vdGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKG5vdGlmeVN1YmFnZW50cykge1xuICAgICAgICAgICAgICAgIG5vdGlmeVN1YmFnZW50c0RvbmUoYXBpLCB0YXNrUGFydHMuc2l6ZSwgbm90aWZ5R2F0ZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF3YXNBY3RpdmUgJiYgbm93QWN0aXZlKSB7XG4gICAgICAgICAgLy8gQSBicmFuZC1uZXcgYWN0aXZlIHRhc2sgYXBwZWFycyAoc3RhcnQgb2YgYSBuZXcgZGVsZWdhdGlvbiBiYXRjaCkuXG4gICAgICAgICAgaWYgKGFjdGl2ZVRhc2tDb3VudCA9PT0gMCkgcm91bmROb3RpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIGFjdGl2ZVRhc2tDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hpbGQgc2Vzc2lvbiBpcyBpZGVudGlmaWVkIGJ5IG1ldGFkYXRhIHNlc3Npb25JZC9zZXNzaW9uSUQgKHN0YXRlIGZpcnN0KS5cbiAgICAgICAgY29uc3QgY2hpbGRJRCA9XG4gICAgICAgICAgKHR5cGVvZiB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSWRcIikgPT09IFwic3RyaW5nXCIgPyB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSWRcIikgOiB1bmRlZmluZWQpID8/XG4gICAgICAgICAgKHR5cGVvZiB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSURcIikgPT09IFwic3RyaW5nXCIgPyB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSURcIikgOiB1bmRlZmluZWQpO1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkSUQgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAvLyBPbmx5IHVwZGF0ZSBlbnRyaWVzIHdlIGFscmVhZHkgdHJhY2s7IG5ldmVyIGNyZWF0ZSBuZXcgb25lcyBmcm9tIHBhcnRzLlxuICAgICAgICBjb25zdCBpbmZvID0gcnVubmluZy5nZXQoY2hpbGRJRCk7XG4gICAgICAgIGlmICghaW5mbykgcmV0dXJuO1xuXG4gICAgICAgIC8vIEN1c3RvbSBuYW1lOiB0aGUgZGVzY3JpcHRpb24gZ2l2ZW4gd2hlbiBkZWxlZ2F0aW5nIChtaXJyb3JzIHRoZSBidWlsdC1pblxuICAgICAgICAvLyBzdWJhZ2VudCBwYW5lbCwgd2hpY2ggcHJlZmVycyBpbnB1dC5kZXNjcmlwdGlvbiwgdGhlbiBpbnB1dC5zdWJhZ2VudF90eXBlKS5cbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXJ0LnN0YXRlLmlucHV0O1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0LmRlc2NyaXB0aW9uID09PSBcInN0cmluZ1wiICYmIGlucHV0LmRlc2NyaXB0aW9uLnRyaW0oKSkge1xuICAgICAgICAgIGluZm8udGl0bGUgPSBpbnB1dC5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5zdWJhZ2VudF90eXBlID09PSBcInN0cmluZ1wiICYmIGlucHV0LnN1YmFnZW50X3R5cGUudHJpbSgpKSB7XG4gICAgICAgICAgaW5mby5hZ2VudCA9IGlucHV0LnN1YmFnZW50X3R5cGUudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnQuc3RhdGUuc3RhdHVzID09PSBcInJ1bm5pbmdcIikge1xuICAgICAgICAgIC8vIEEgcmVzdW1lZCBzdWJhZ2VudCByZS1ydW5zIGl0cyB0YXNrIHRvb2wgcGFydDsgc3VyZmFjZSBpdCBhcyBidXN5IGFnYWluLlxuICAgICAgICAgIC8vIChUaGUgcGFydCBjYXJyaWVzIGlucHV0LCBzbyB0aGlzIGFsc28gcmVmcmVzaGVzIHRoZSBjdXN0b20gbmFtZSBhYm92ZS4pXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSBcImJ1c3lcIiAmJiBpbmZvLnN0YXR1cyAhPT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLnNpbmNlID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5mby5zdGF0dXMgPSBcImJ1c3lcIjtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0LnN0YXRlLnN0YXR1cyA9PT0gXCJjb21wbGV0ZWRcIiB8fCBwYXJ0LnN0YXRlLnN0YXR1cyA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgICAgLy8gRnJlZXplIHRoZSBjbG9jayBhdCBjb21wbGV0aW9uIChuby1vcCBpZiBhbHJlYWR5IGZyb3plbiB3aGlsZSBpZGxlKS5cbiAgICAgICAgICBpZiAoaW5mby5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGluZm8uc3RhdHVzID09PSBcInJldHJ5XCIpIHtcbiAgICAgICAgICAgIGluZm8uZnJvemVuICs9IERhdGUubm93KCkgLSBpbmZvLnNpbmNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbmZvLnN0YXR1cyA9IFwiZG9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi5kZWxldGVkOiBzdWItc2Vzc2lvbiBpcyBnb25lLlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5kZWxldGVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBtYWluQXJtZWQuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklEKTtcbiAgICAgICAgaWYgKHJ1bm5pbmcuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklEKSkge1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBzZXNzaW9uLmVycm9yOiBtYXJrIGRvbmUgKGtlcHQgdmlzaWJsZSB1bnRpbCBkZWxldGVkKSBpbnN0ZWFkIG9mIGRyb3BwaW5nIGl0LlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5lcnJvclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQucHJvcGVydGllcy5zZXNzaW9uSUQ7XG4gICAgICAgIGlmICghc2Vzc2lvbklEKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGluZm8gPSBydW5uaW5nLmdldChzZXNzaW9uSUQpO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgIGlmIChpbmZvLnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgaW5mby5mcm96ZW4gKz0gRGF0ZS5ub3coKSAtIGluZm8uc2luY2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZm8uc3RhdHVzID0gXCJkb25lXCI7XG4gICAgICAgICAgc3luY0VudHJpZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFwiSW50ZXJ2aWV3IGJsb2NrZWRcIiBub3RpZmljYXRpb25zOiB0aGUgbWFpbiBzZXNzaW9uIGlzIHN1c3BlbmRlZCB3YWl0aW5nIGZvciB1c2VyXG4gICAgLy8gaW5wdXQuIGBxdWVzdGlvbi5hc2tlZGAgZmlyZXMgd2hlbiB0aGUgYWdlbnQgYXNrcyB0aGUgdXNlciBzb21ldGhpbmcgKHBsYW5cbiAgICAvLyBjb25maXJtYXRpb24sIGNob2ljZXMsIGV0Yy4pOyBgcGVybWlzc2lvbi5hc2tlZGAgZmlyZXMgd2hlbiB0aGUgYWdlbnQgbmVlZHMgYW5cbiAgICAvLyBhcHByb3ZhbCAoZS5nLiB0byB3cml0ZSBhIGZpbGUgb3IgcnVuIGEgY29tbWFuZCkuIE5vIHNlc3Npb24uc3RhdHVzIGNoYW5nZSBpc1xuICAgIC8vIGVtaXR0ZWQgZHVyaW5nIHRoZSB3YWl0ICh0aGUgYWdlbnQgaXMgcGFya2VkIG9uIGEgRGVmZXJyZWQpLCBzbyB0aGVzZSBldmVudHMgYXJlXG4gICAgLy8gdGhlIG9ubHkgcmVsaWFibGUgc2lnbmFsLiBNYWluIHNlc3Npb25zIG9ubHk6IHN1YmFnZW50IHJlcXVlc3RzIGFyZSBmaWx0ZXJlZCBvdXRcbiAgICAvLyAoYSBzdWJhZ2VudCdzIG93biBpbnRlcnZpZXcgYmVsb25ncyB0byBpdHMgZGVsZWdhdGlvbiBmbG93LCBub3QgdGhlIG1haW4gdHVybikuXG4gICAgLy8gRGVkdXAgYnkgcmVxdWVzdCBpZCBhbmQgY2xlYXIgb24gcmVwbGllZC9yZWplY3RlZCwgbWlycm9yaW5nIHRoZSBidWlsdC1pblxuICAgIC8vIG5vdGlmaWNhdGlvbnMgcGx1Z2luIChub3RpZmljYXRpb25zLnRzKS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInF1ZXN0aW9uLmFza2VkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBzZXNzaW9uSUQsIHF1ZXN0aW9ucyB9ID0gZXZlbnQucHJvcGVydGllcztcbiAgICAgICAgaWYgKCFub3RpZnlJbnRlcnZpZXcgfHwgcnVubmluZy5oYXMoc2Vzc2lvbklEKSB8fCBwZW5kaW5nUXVlc3Rpb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgICAgcGVuZGluZ1F1ZXN0aW9ucy5hZGQoaWQpO1xuICAgICAgICBjb25zdCBmaXJzdCA9IHF1ZXN0aW9ucz8uWzBdO1xuICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChhcGksIFwicXVlc3Rpb25cIiwgZmlyc3Q/LnF1ZXN0aW9uIHx8IGZpcnN0Py5oZWFkZXIsIG5vdGlmeUdhdGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJxdWVzdGlvbi5yZXBsaWVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBwZW5kaW5nUXVlc3Rpb25zLmRlbGV0ZShldmVudC5wcm9wZXJ0aWVzLnJlcXVlc3RJRCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwicXVlc3Rpb24ucmVqZWN0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIHBlbmRpbmdRdWVzdGlvbnMuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMucmVxdWVzdElEKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgLy8gUGVybWlzc2lvbiBhcHByb3ZhbCByZXF1ZXN0cy4gVW5saWtlIGBxdWVzdGlvbmAsIHBlcm1pc3Npb24gYXBwcm92YWxzIGNhbiBiZVxuICAgIC8vIGF1dG8tYXBwcm92ZWQgYnkgdGhlIGNsaWVudDogd2l0aCBhdXRvLWFwcHJvdmFsIGVuYWJsZWQgKGAtLWF1dG9gIC8gVFVJXG4gICAgLy8gYHBlcm1pc3Npb24ubW9kZWApLCB0aGUgc2VydmVyIHN0aWxsIGVtaXRzIGBwZXJtaXNzaW9uLmFza2VkYCBhbmQgdGhlIFRVSSByZXBsaWVzXG4gICAgLy8gYFwib25jZVwiYCB3aXRoaW4gdGhlIHNhbWUgZXZlbnQgbG9vcCAoc3luYy50c3g6MTkwLTIwMCkg4oCUIHNvIGEgbm90aWZpY2F0aW9uIGZpcmVkXG4gICAgLy8gaW1tZWRpYXRlbHkgaXMgc3BhbSBldmVuIHRob3VnaCB0aGUgdXNlciBuZXZlciBuZWVkcyB0byBhY3QuIEZpeDogZGVmZXIgdGhlXG4gICAgLy8gbm90aWZpY2F0aW9uIGJ5IGEgc2hvcnQgd2luZG93IGFuZCBjYW5jZWwgaXQgaWYgYSByZXBseSBhcnJpdmVzIGluIHRpbWUuIE1hbnVhbFxuICAgIC8vIGFwcHJvdmFscyB0YWtlIGZhciBsb25nZXIgdGhhbiB0aGUgd2luZG93ICh0aGUgdXNlciBtdXN0IHJlYWQgYW5kIGNsaWNrKSwgc28gdGhleVxuICAgIC8vIGFyZSB1bmFmZmVjdGVkLiBUaGlzIGlzIHRoZSBvbmx5IHJlbGlhYmxlIHNpZ25hbDogYHBlcm1pc3Npb24uYXNrZWRgIGNhcnJpZXMgbm9cbiAgICAvLyBtb2RlIGZpZWxkIGFuZCB0aGUgYXV0byBtb2RlIGlzIGNsaWVudC1zaWRlIFVJIHN0YXRlIHRoZSBwbHVnaW4gY2Fubm90IHJlYWQuXG4gICAgY29uc3QgUEVSTUlTU0lPTl9OT1RJRllfREVMQVlfTVMgPSA1MDA7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJwZXJtaXNzaW9uLmFza2VkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBzZXNzaW9uSUQsIHBlcm1pc3Npb24gfSA9IGV2ZW50LnByb3BlcnRpZXM7XG4gICAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IHJ1bm5pbmcuaGFzKHNlc3Npb25JRCkgfHwgcGVuZGluZ1Blcm1pc3Npb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBTdGlsbCBwZW5kaW5nIGFmdGVyIHRoZSB3aW5kb3cgLT4gdGhlIHVzZXIgaGFzIHRvIGFwcHJvdmUgaXQgbWFudWFsbHkuXG4gICAgICAgICAgaWYgKHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUoaWQpKSB7XG4gICAgICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChhcGksIFwicGVybWlzc2lvblwiLCBwZXJtaXNzaW9uLCBub3RpZnlHYXRlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBQRVJNSVNTSU9OX05PVElGWV9ERUxBWV9NUyk7XG4gICAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5zZXQoaWQsIHRpbWVyKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJwZXJtaXNzaW9uLnJlcGxpZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIEZpcmVkIGZvciBib3RoIG1hbnVhbCBhbmQgYXV0byBhcHByb3ZhbCAocmVwbHkgXCJvbmNlXCIgfCBcImFsd2F5c1wiIHwgXCJyZWplY3RcIik7XG4gICAgICAgIC8vIGVpdGhlciB3YXkgdGhlIHVzZXIgbm8gbG9uZ2VyIG5lZWRzIHRvIGFjdCwgc28gY2FuY2VsIHRoZSBkZWZlcnJlZCBub3RpZmljYXRpb24uXG4gICAgICAgIGNvbnN0IHsgcmVxdWVzdElEIH0gPSBldmVudC5wcm9wZXJ0aWVzO1xuICAgICAgICBjb25zdCB0aW1lciA9IHBlbmRpbmdQZXJtaXNzaW9ucy5nZXQocmVxdWVzdElEKTtcbiAgICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICBwZW5kaW5nUGVybWlzc2lvbnMuZGVsZXRlKHJlcXVlc3RJRCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBLZWVwIHRoZSBlbGFwc2VkLXRpbWUgY29sdW1uIGxpdmUgb25seSB3aGlsZSBzb21lIHN1YmFnZW50J3MgY2xvY2sgaXMgcnVubmluZyAoYnVzeS9yZXRyeSkuXG4gICAgY29uc3QgdGlja2VyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgZm9yIChjb25zdCBpbmZvIG9mIHJ1bm5pbmcudmFsdWVzKCkpIHtcbiAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFjdGl2ZSkgc3luY0VudHJpZXMoKTtcbiAgICB9LCAxMDAwKTtcblxuICAgIGFwaS5saWZlY3ljbGUub25EaXNwb3NlKCgpID0+IHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGlja2VyKTtcbiAgICAgIGFwaS5yZW5kZXJlci5vZmYoXCJmb2N1c1wiLCBvbkZvY3VzKTtcbiAgICAgIGFwaS5yZW5kZXJlci5vZmYoXCJibHVyXCIsIG9uQmx1cik7XG4gICAgICAvLyBDYW5jZWwgYW55IHBlbmRpbmcgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb25zLlxuICAgICAgZm9yIChjb25zdCB0aW1lciBvZiBwZW5kaW5nUGVybWlzc2lvbnMudmFsdWVzKCkpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIH1cbiAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5jbGVhcigpO1xuICAgICAgdW5zdWJzLmZvckVhY2goKHVuc3ViKSA9PiB1bnN1YigpKTtcbiAgICB9KTtcblxuICAgIGFwaS5zbG90cy5yZWdpc3Rlcih7XG4gICAgICBvcmRlcjogOTUwLFxuICAgICAgc2xvdHM6IHtcbiAgICAgICAgc2lkZWJhcl9jb250ZW50KF9jdHgsIF9wcm9wcykge1xuICAgICAgICAgIC8vIFJlYWRpbmcgc2lnbmFscyBpbnNpZGUgdGhlIHJlbmRlcmVyIG1ha2VzIHNvbGlkIHJlLXJlbmRlciB0aGlzIHNsb3RcbiAgICAgICAgICAvLyByZWFjdGl2ZWx5IG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZSAobm8gcmVxdWVzdFJlbmRlciBuZWVkZWQpLlxuICAgICAgICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gY29sbGFwc2VkKCk7XG4gICAgICAgICAgY29uc3QgZW50cmllcyA9IHJ1bm5pbmdFbnRyaWVzKCk7XG4gICAgICAgICAgY29uc3QgdGhlbWUgPSBhcGkudGhlbWUuY3VycmVudDtcblxuICAgICAgICAgIGNvbnN0IGhlYWRlciA9IGJveChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICAvLyBNb3VzZSBcImNsaWNrXCIgb24gdGhlIGhlYWRlciB0b2dnbGVzIGNvbGxhcHNlIChob3N0IGRpc3BhdGNoZXMgbW91c2VcbiAgICAgICAgICAgICAgLy8gZXZlbnRzIHRvIHNpZGViYXIgcmVuZGVyYWJsZXM7IG1hdGNoZXMgdGhlIGJ1aWx0LWluIE1DUCBibG9jaykuXG4gICAgICAgICAgICAgIG9uTW91c2VEb3duOiAoKSA9PiBzZXRDb2xsYXBzZWQoKHZhbHVlKSA9PiAhdmFsdWUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS5hY2NlbnQgfSwgW2Ake2lzQ29sbGFwc2VkID8gXCLilrhcIiA6IFwi4pa+XCJ9IFN1YmFnZW50c2BdKSxcbiAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0TXV0ZWQgfSwgZW50cmllcy5sZW5ndGggPiAwID8gW2AgKCR7ZW50cmllcy5sZW5ndGh9KWBdIDogW10pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gYm94KHsgd2lkdGg6IFwiMTAwJVwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiIH0sIFtoZWFkZXJdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb2N1cyBzdGF0ZSBkaXNwbGF5OiBvbmx5IHJlbmRlcmVkIHdoZW4gdGhlIGBzaWRlYmFyLnNob3dGb2N1c2Agb3B0aW9uIGlzXG4gICAgICAgICAgLy8gZW5hYmxlZCAoZGVmYXVsdCBoaWRkZW4pLiBTaG93cyB0aGUgY3VycmVudCBmb2N1cyBiYWNrZW5kICsgbGFzdCByZXN1bHQuXG4gICAgICAgICAgY29uc3QgZm9jdXNMaW5lID0gKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvd0ZvY3VzKSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBkaWFnID0gZm9jdXNEaWFnKCk7XG4gICAgICAgICAgICBjb25zdCBmbGFnID0gZGlhZy5sYXN0UmVzdWx0ID09PSB0cnVlID8gXCLil49mb2N1c2VkXCIgOiBkaWFnLmxhc3RSZXN1bHQgPT09IGZhbHNlID8gXCLil4tibHVycmVkXCIgOiBcIj91bmtub3duXCI7XG4gICAgICAgICAgICBjb25zdCBzcmMgPSBkaWFnLmxhc3RGb3JlZ3JvdW5kUGlkICE9PSB1bmRlZmluZWQgPyBgIGZnPSR7ZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZH1gIDogXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGRpYWcubGFzdEVycm9yID8gYCBlcnI9JHtkaWFnLmxhc3RFcnJvcn1gIDogXCJcIjtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHRleHQoeyBmZzogdGhlbWUudGV4dE11dGVkIH0sIFtcbiAgICAgICAgICAgICAgICBgICBmb2N1c1ske2RpYWcuYmFja2VuZH0ke2RpYWcuYW5jZXN0b3JDb3VudCA/IGA6JHtkaWFnLmFuY2VzdG9yQ291bnR9YCA6IFwiXCJ9XSAke2ZsYWd9JHtzcmN9JHtlcnJ9YCxcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICBjb25zdCByb3dzID0gZW50cmllcy5tYXAoKFtzZXNzaW9uSUQsIGluZm9dKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZm8uc3RhdHVzID09PSBcImJ1c3lcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1c0NvbG9yID0gaXNBY3RpdmUgPyB0aGVtZS5zdWNjZXNzIDogaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIiA/IHRoZW1lLndhcm5pbmcgOiB0aGVtZS50ZXh0TXV0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gYm94KFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDEsXG4gICAgICAgICAgICAgICAgLy8gTGVmdC1jbGljayBhIHJvdyB0byBqdW1wIGludG8gdGhhdCBzdWItc2Vzc2lvbidzIGNvbnRleHQgdmlld1xuICAgICAgICAgICAgICAgIC8vIChob3N0IHBsdWdpbiBBUEk6IGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSkpLlxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duOiAoZXZlbnQ6IHsgYnV0dG9uPzogbnVtYmVyIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gIT09IHVuZGVmaW5lZCAmJiBldmVudC5idXR0b24gIT09IDApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHRleHQoeyBmZzogc3RhdHVzQ29sb3IgfSwgW2Dil49gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0IH0sIFtgICR7aW5mby5hZ2VudH1gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiBzdGF0dXNDb2xvciB9LCBbYCAke2luZm8uc3RhdHVzfWBdKSxcbiAgICAgICAgICAgICAgICB0ZXh0KHsgZmc6IHRoZW1lLnRleHRNdXRlZCB9LCBbYCAke2Zvcm1hdER1cmF0aW9uKGVudHJ5RWxhcHNlZChpbmZvKSl9YF0pLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBib3goeyB3aWR0aDogXCIxMDAlXCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIgfSwgW2hlYWRlciwgLi4uZm9jdXNMaW5lLCAuLi5yb3dzXSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcGx1Z2luO1xuIiwiaW1wb3J0IHR5cGUgeyBUdWlBdHRlbnRpb25Tb3VuZCwgVHVpUGx1Z2luQXBpIH0gZnJvbSBcIkBvcGVuY29kZS1haS9wbHVnaW4vdHVpXCI7XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGRpc3BhdGNoIGZvciBvcGVuY29kZS1hZ2VudC1wdWxzZS5cbiAqXG4gKiBUd28gZGVsaXZlcnkgY2hhbm5lbHMsIHNlbGVjdGVkIGJ5IHBsYXRmb3JtOlxuICpcbiAqICAgLSBOb24tV2luZG93czogdXNlIHRoZSBidWlsdC1pbiBgYXBpLmF0dGVudGlvbi5ub3RpZnkoKWAgKG1hY09TIGlUZXJtMi9HaG9zdHR5IGFuZFxuICogICAgIExpbnV4IGtpdHR5L2Zvb3QgaW1wbGVtZW50IHRoZSBPU0MgOS85OSBwcm90b2NvbCB0aGlzIHJlbGllcyBvbikuIFN1cHBvcnRzIGJvdGhcbiAqICAgICBhIHN5c3RlbSBub3RpZmljYXRpb24gYW5kIGEgc291bmQuXG4gKiAgIC0gV2luZG93czogV2luZG93cyBUZXJtaW5hbCBkb2VzIE5PVCBpbXBsZW1lbnQgdGhlIE9TQyA5OSBwcm90b2NvbCArIERFQyAxMDA0IGZvY3VzXG4gKiAgICAgdHJhY2tpbmcgdGhhdCBgYXBpLmF0dGVudGlvbi5ub3RpZnlgJ3Mgbm90aWZpY2F0aW9uIHBhdGggZGVwZW5kcyBvbiAoa25vd24gaXNzdWVcbiAqICAgICAjMzUwNTUpLCBzbyB0aGUgc3lzdGVtIG5vdGlmaWNhdGlvbiBpcyBzaWxlbnRseSBkcm9wcGVkLiBBcyBhIHdvcmthcm91bmQgd2Ugcm91dGVcbiAqICAgICB0aHJvdWdoIGBub2RlLW5vdGlmaWVyYCwgd2hpY2ggb24gV2luZG93cyBzaGVsbHMgb3V0IHRvIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlXG4gKiAgICAgdG8gcG9zdCBhIHJlYWwgQWN0aW9uIENlbnRlciB0b2FzdC4gKFRoZSBidWlsdC1pbiBzb3VuZCBpcyB1bmFmZmVjdGVkLCBidXQgb25cbiAqICAgICBXaW5kb3dzIHRoZSBUVUkgc291bmQgYW5kIHRoZSB0b2FzdCBhcmUgZGVsaXZlcmVkIGluZGVwZW5kZW50bHkuKVxuICpcbiAqIEFsbCBmdW5jdGlvbnMgYXJlIGJlc3QtZWZmb3J0OiBmYWlsdXJlcyBhcmUgc3dhbGxvd2VkIHNvIGEgbm90aWZpY2F0aW9uIHByb2JsZW0gbmV2ZXJcbiAqIGJyZWFrcyB0aGUgcGx1Z2luLlxuICovXG5cbnR5cGUgQXBpID0gUGljazxUdWlQbHVnaW5BcGksIFwiYXR0ZW50aW9uXCIgfCBcInVpXCI+O1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyBBcHBVc2VyTW9kZWxJRCB1c2VkIGZvciB0aGUgV2luZG93cyB0b2FzdC4gbm9kZS1ub3RpZmllciByZXF1aXJlcyBhbiBBVU1JRCBmb3Jcbi8vIEFjdGlvbiBDZW50ZXIgdG9hc3RzIHRvIGdyb3VwIHByb3Blcmx5IGFuZCBzaG93IGEgZnJpZW5kbHkgYXBwIG5hbWUuXG5jb25zdCBXSU5ET1dTX0FQUF9JRCA9IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIjtcblxuaW50ZXJmYWNlIE5vdGlmeVBheWxvYWQge1xuICB0aXRsZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIC8qKiBTb3VuZCB1c2VkIG9uIHRoZSBub24tV2luZG93cyBwYXRoIChgYXBpLmF0dGVudGlvbi5ub3RpZnlgKS4gKi9cbiAgc291bmQ6IFR1aUF0dGVudGlvblNvdW5kO1xufVxuXG4vKipcbiAqIE9wdGlvbmFsIGZvY3VzIGdhdGUgYXBwbGllZCBiZWZvcmUgZGlzcGF0Y2hpbmcgYSBub3RpZmljYXRpb24uIExldHMgdGhlIHVzZXIgb3B0IGludG9cbiAqIFwibm90aWZ5IG9ubHkgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGlzIHVuZm9jdXNlZFwiIHNvIG5vdGlmaWNhdGlvbnMgZG9uJ3QgZmlyZSB3aGlsZVxuICogdGhleSBhcmUgYWN0aXZlbHkgd2F0Y2hpbmcgdGhlIFRVSS5cbiAqXG4gKiBUaGUgZ2F0ZSBpcyBldmFsdWF0ZWQgb24gZXZlcnkgZGlzcGF0Y2ggKG5vdCBvbmNlIGF0IHNldHVwKSBiZWNhdXNlIHRoZSBkZWZlcnJlZFxuICogcGVybWlzc2lvbiBub3RpZmljYXRpb24gaXMgc2VudCBmcm9tIGEgdGltZXIgYW5kIHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIG11c3QgYmUgcmVhZFxuICogYXQgdGhhdCBtb21lbnQuXG4gKi9cbmV4cG9ydCB0eXBlIE5vdGlmeUdhdGUgPSB7XG4gIC8qKiBXaGVuIHRydWUsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24gd2hpbGUgdGhlIHRlcm1pbmFsIGlzIGZvY3VzZWQuICovXG4gIG9ubHlXaGVuVW5mb2N1c2VkOiBib29sZWFuO1xuICAvKiogQ3VycmVudCB0ZXJtaW5hbCBmb2N1cyBzdGF0ZTsgYHVuZGVmaW5lZGAgd2hlbiB1bmtub3duIChlLmcuIHRoZSB0ZXJtaW5hbCBkb2VzIG5vdFxuICAgKiAgcmVwb3J0IGZvY3VzIGV2ZW50cyDigJQgV2luZG93cyBUZXJtaW5hbCBpcyBhIGtub3duIGNhc2UpLiBVbmtub3duIGZvY3VzIGRlZ3JhZGVzIHRvXG4gICAqICBkaXNwYXRjaGluZyBzbyBhbiBvcHRlZC1pbiBub3RpZmljYXRpb24gaXMgbmV2ZXIgc2lsZW50bHkgbG9zdC4gUmVhZCBsYXppbHkgb24gZWFjaFxuICAgKiAgZGlzcGF0Y2ggYmVjYXVzZSB0aGUgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb24gZmlyZXMgZnJvbSBhIHRpbWVyLiBNYXkgYmVcbiAgICogIGFzeW5jICh0aGUgV2luZG93cyBmYWxsYmFjayBxdWVyaWVzIHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyB2aWEgUG93ZXJTaGVsbCkuICovXG4gIGZvY3VzZWQ6ICgpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+O1xufTtcblxuZnVuY3Rpb24gd2luZG93c05vdGlmeShwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKTogdm9pZCB7XG4gIC8vIG5vZGUtbm90aWZpZXIgaXMgbWFya2VkIGV4dGVybmFsIGluIHRoZSBidWlsZCAocGFja2FnZS5qc29uKSBzbyBpdCByZXNvbHZlcyBmcm9tXG4gIC8vIG5vZGVfbW9kdWxlcyBhdCBydW50aW1lIHJhdGhlciB0aGFuIGJlaW5nIGJ1bmRsZWQuIE9uIFdpbmRvd3MgaXQgcG9zdHMgYSByZWFsXG4gIC8vIEFjdGlvbiBDZW50ZXIgdG9hc3QgdmlhIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlLiBEeW5hbWljIGltcG9ydCBrZWVwcyB0aGVcbiAgLy8gbW9kdWxlIGxvYWQgZnJvbSBmYWlsaW5nIHRoZSB3aG9sZSBwbHVnaW4gaWYgbm9kZS1ub3RpZmllciBpcyB1bmF2YWlsYWJsZS5cbiAgaW1wb3J0KFwibm9kZS1ub3RpZmllclwiKVxuICAgIC50aGVuKChtb2QpID0+IHtcbiAgICAgIGNvbnN0IG5vdGlmaWVyID0gKG1vZCBhcyB7IGRlZmF1bHQ/OiB1bmtub3duIH0pLmRlZmF1bHQgPz8gbW9kO1xuICAgICAgKG5vdGlmaWVyIGFzIHsgbm90aWZ5OiAob3B0czogdW5rbm93biwgY2I6IChlcnI6IEVycm9yIHwgbnVsbCwgcmVzcG9uc2U6IHN0cmluZykgPT4gdm9pZCkgPT4gdm9pZCB9KS5ub3RpZnkoXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgICAgICBtZXNzYWdlOiBwYXlsb2FkLm1lc3NhZ2UsXG4gICAgICAgICAgYXBwSUQ6IFdJTkRPV1NfQVBQX0lELFxuICAgICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAoZXJyLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgIC8vIGJlc3QtZWZmb3J0OyBpZ25vcmUgZXJyb3JzXG4gICAgICAgICAgdm9pZCBlcnI7XG4gICAgICAgICAgdm9pZCByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8gYmVzdC1lZmZvcnRcbiAgICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYnVpbHRpbk5vdGlmeShhcGk6IEFwaSwgcGF5bG9hZDogTm90aWZ5UGF5bG9hZCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGF3YWl0IGFwaS5hdHRlbnRpb24ubm90aWZ5KHtcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgbWVzc2FnZTogcGF5bG9hZC5tZXNzYWdlLFxuICAgICAgbm90aWZpY2F0aW9uOiB7IHdoZW46IFwiYWx3YXlzXCIgfSxcbiAgICAgIHNvdW5kOiBwYXlsb2FkLnNvdW5kLFxuICAgIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBiZXN0LWVmZm9ydDsgYSBmYWlsZWQgbm90aWZpY2F0aW9uIG11c3QgbmV2ZXIgYnJlYWsgdGhlIHBsdWdpblxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRpc3BhdGNoKGFwaTogQXBpLCBwYXlsb2FkOiBOb3RpZnlQYXlsb2FkLCBnYXRlPzogTm90aWZ5R2F0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoZ2F0ZT8ub25seVdoZW5VbmZvY3VzZWQgJiYgKGF3YWl0IGdhdGUuZm9jdXNlZCgpKSA9PT0gdHJ1ZSkge1xuICAgIC8vIFRlcm1pbmFsIGlzIGZvY3VzZWQgLT4gdGhlIHVzZXIgaXMgd2F0Y2hpbmcsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24uXG4gICAgLy8gVW5rbm93biBmb2N1cyAobm8gZm9jdXMgZXZlbnRzLCBlLmcuIFdpbmRvd3MgVGVybWluYWwpIHN0aWxsIGRpc3BhdGNoZXMuXG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChJU19XSU5ET1dTKSB7XG4gICAgd2luZG93c05vdGlmeShwYXlsb2FkKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBidWlsdGluTm90aWZ5KGFwaSwgcGF5bG9hZCk7XG4gIH1cbn1cblxuLyoqIE5vdGlmeSB0aGF0IGEgYmF0Y2ggb2Ygc3ViYWdlbnRzIGZpbmlzaGVkLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeVN1YmFnZW50c0RvbmUoYXBpOiBBcGksIGNvdW50OiBudW1iZXIsIGdhdGU/OiBOb3RpZnlHYXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTogY291bnQgPiAxID8gYOWFqOmDqCAke2NvdW50fSDkuKrlrZAgYWdlbnQg5bey5a6M5oiQYCA6IFwi5a2QIGFnZW50IOW3suWujOaIkFwiLFxuICAgICAgc291bmQ6IHsgbmFtZTogXCJzdWJhZ2VudF9kb25lXCIgfSxcbiAgICB9LFxuICAgIGdhdGUsXG4gICk7XG59XG5cbi8qKiBOb3RpZnkgdGhhdCB0aGUgY3VycmVudCB0dXJuIChtYWluLWFnZW50IHJvdW5kKSBoYXMgZmluaXNoZWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5VHVybkRvbmUoYXBpOiBBcGksIGdhdGU/OiBOb3RpZnlHYXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTogXCLmnKzova7lr7nor53lt7LlrozmiJBcIixcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwiZG9uZVwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogV2hhdCBraW5kIG9mIHVzZXIgaW50ZXJhY3Rpb24gaXMgYmxvY2tpbmcgdGhlIG1haW4gc2Vzc2lvbi4gKi9cbmV4cG9ydCB0eXBlIEludGVydmlld0tpbmQgPSBcInF1ZXN0aW9uXCIgfCBcInBlcm1pc3Npb25cIjtcblxuLyoqXG4gKiBOb3RpZnkgdGhhdCB0aGUgbWFpbiBzZXNzaW9uIGlzIGJsb2NrZWQgd2FpdGluZyBmb3IgdXNlciBpbnB1dCAoYW4gaW50ZXJ2aWV3OlxuICogdGhlIGBxdWVzdGlvbmAgdG9vbCBhc2tpbmcgdGhlIHVzZXIgc29tZXRoaW5nLCBvciBhIHBlcm1pc3Npb24vYXBwcm92YWwgcHJvbXB0KS5cbiAqIFRoZXNlIGFyZSB0aGUgdHdvIHdheXMgYW4gYWdlbnQgdHVybiBpcyBzdXNwZW5kZWQgbWlkLXJ1biBvbiB1c2VyIGludGVyYWN0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbm90aWZ5SW50ZXJ2aWV3SW5wdXQoYXBpOiBBcGksIGtpbmQ6IEludGVydmlld0tpbmQsIGRldGFpbD86IHN0cmluZywgZ2F0ZT86IE5vdGlmeUdhdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgZGlzcGF0Y2goXG4gICAgYXBpLFxuICAgIHtcbiAgICAgIHRpdGxlOiBcIm9wZW5jb2RlLWFnZW50LXB1bHNlXCIsXG4gICAgICBtZXNzYWdlOlxuICAgICAgICBraW5kID09PSBcInBlcm1pc3Npb25cIlxuICAgICAgICAgID8gZGV0YWlsXG4gICAgICAgICAgICA/IGDpnIDopoHmnYPpmZDnoa7orqQ6ICR7ZGV0YWlsfWBcbiAgICAgICAgICAgIDogXCLkuLvkvJror53pnIDopoHmnYPpmZDnoa7orqRcIlxuICAgICAgICAgIDogZGV0YWlsXG4gICAgICAgICAgICA/IGDpnIDopoHlm57nrZQ6ICR7ZGV0YWlsfWBcbiAgICAgICAgICAgIDogXCLkuLvkvJror53pnIDopoHlm57nrZTor6Lpl65cIixcbiAgICAgIHNvdW5kOiBraW5kID09PSBcInBlcm1pc3Npb25cIiA/IHsgbmFtZTogXCJwZXJtaXNzaW9uXCIgfSA6IHsgbmFtZTogXCJxdWVzdGlvblwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogSW4tYXBwIHRvYXN0IGZhbGxiYWNrICh3b3JrcyBvbiBldmVyeSBwbGF0Zm9ybSkuICovXG5leHBvcnQgZnVuY3Rpb24gdG9hc3QoYXBpOiBBcGksIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICB0cnkge1xuICAgIGFwaS51aS50b2FzdCh7IHZhcmlhbnQ6IFwiaW5mb1wiLCB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCBtZXNzYWdlIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBiZXN0LWVmZm9ydFxuICB9XG59XG5cbi8qKiBUcnVlIHdoZW4gcnVubmluZyBvbiBXaW5kb3dzICh1c2VkIHRvIGRlY2lkZSB0aGUgZGVsaXZlcnkgcGF0aCkuICovXG5leHBvcnQgZnVuY3Rpb24gaXNXaW5kb3dzKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gSVNfV0lORE9XUztcbn1cbiIsIi8qKlxuICogV2luZG93cy1vbmx5IGxpdmUgdGVybWluYWwgZm9jdXMgZGV0ZWN0aW9uLlxuICpcbiAqIEJhY2tncm91bmQ6IG9uIFdpbmRvd3MgdGhlIHJlbmRlcmVyJ3MgZm9jdXMvYmx1ciBldmVudHMgKERFQyAxMDA0IGZvY3VzIHJlcG9ydGluZyB2aWFcbiAqIENvblBUWSkgYXJlIHVucmVsaWFibGUg4oCUIHRoZSBmb2N1cy1pbiBzZXF1ZW5jZSBtYXkgYXJyaXZlIGF0IHN0YXJ0dXAgd2hpbGUgdGhlXG4gKiBmb2N1cy1vdXQgbmV2ZXIgZG9lcywgd2hpY2ggbGVhdmVzIHRoZSBwbHVnaW4gc3R1Y2sgYmVsaWV2aW5nIHRoZSB0ZXJtaW5hbCBpcyBmb2N1c2VkXG4gKiBhbmQgc3VwcHJlc3NpbmcgZXZlcnkgbm90aWZpY2F0aW9uLiBXZSB0aGVyZWZvcmUgYnlwYXNzIHRoZSBldmVudCBzdHJlYW0gb24gV2luZG93c1xuICogYW5kIHF1ZXJ5IHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyBkaXJlY3RseTpcbiAqXG4gKiAgIC0gVGhlIHdpbmRvdyBvZiB0aGUgdGVybWluYWwgaG9zdGluZyB0aGlzIHBsdWdpbiBiZWxvbmdzIHRvIGEgcHJvY2VzcyB0aGF0IGlzIGFuXG4gKiAgICAgYW5jZXN0b3Igb2Ygb3VyIG93biBwcm9jZXNzIChlLmcuIFdpbmRvd3MgVGVybWluYWwgLT4gc2hlbGwgLT4gb3BlbmNvZGUpLlxuICogICAtIFdoZW4gdGhhdCB0ZXJtaW5hbCBpcyBmb2N1c2VkLCB0aGUgZm9yZWdyb3VuZCB3aW5kb3cncyBvd25pbmcgUElEIGlzIGluIG91clxuICogICAgIGFuY2VzdG9yIGNoYWluLlxuICogICAtIFdoZW4gdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBhcHAsIHRoZSBmb3JlZ3JvdW5kIFBJRCBpcyBub3QgYW4gYW5jZXN0b3IuXG4gKlxuICogVHdvIGJhY2tlbmRzIGFyZSB1c2VkOlxuICogICAtIGBidW46ZmZpYCAoZmFzdCwgc3luY2hyb25vdXMpIHdoZW4gdGhlIHJ1bnRpbWUgc3VwcG9ydHMgaXQg4oCUIHZlcmlmaWVkIHdvcmtpbmcgaW5cbiAqICAgICBzdGFuZGFsb25lIEJ1bi1jb21waWxlZCBiaW5hcmllcy5cbiAqICAgLSBQb3dlclNoZWxsIChgR2V0Rm9yZWdyb3VuZFdpbmRvd2AgLyBgV2luMzJfUHJvY2Vzc2ApIGFzIGEgcG9ydGFibGUgZmFsbGJhY2sgdGhhdFxuICogICAgIHdvcmtzIGluIGFueSBydW50aW1lIChOb2RlIG9yIEJ1bikgc2luY2UgaXQgb25seSBuZWVkcyBgbm9kZTpjaGlsZF9wcm9jZXNzYC5cbiAqXG4gKiBJZiBuZWl0aGVyIGJhY2tlbmQgaXMgYXZhaWxhYmxlIHRoZSBtb2R1bGUgZGVncmFkZXMgdG8gXCJ1bmtub3duXCIgYW5kIHRoZSBjYWxsZXIgZmFsbHNcbiAqIGJhY2sgdG8gdGhlIHJlbmRlcmVyIGV2ZW50IHN0YXRlLlxuICovXG5cbmltcG9ydCB7IHNwYXduIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyA1NjggYnl0ZXMgPSBzaXplb2YoUFJPQ0VTU0VOVFJZMzJXKSBvbiB4NjQgKFVMT05HX1BUUiBmaWVsZCBmb3JjZXMgOC1ieXRlIGFsaWdubWVudCkuXG4vLyBXcm9uZyBkd1NpemUgbWFrZXMgUHJvY2VzczMyRmlyc3RXIGZhaWwgd2l0aCBFUlJPUl9CQURfTEVOR1RILCB3aGljaCB3ZSB0cmVhdCBhc1xuLy8gXCJ1bmtub3duXCIgYW5kIGZhbGwgYmFjayBncmFjZWZ1bGx5LlxuY29uc3QgUFJPQ0VTU0VOVFJZMzJXX1NJWkUgPSA1Njg7XG5jb25zdCBPRkZTRVRfVEgzMl9QUk9DRVNTX0lEID0gODtcbmNvbnN0IE9GRlNFVF9USDMyX1BBUkVOVF9QUk9DRVNTX0lEID0gMzI7XG5cbnR5cGUgQmFja2VuZCA9IFwiZmZpXCIgfCBcInBvd2Vyc2hlbGxcIiB8IFwibm9uZVwiO1xuXG5sZXQgYmFja2VuZDogQmFja2VuZCA9IFwibm9uZVwiO1xubGV0IGFuY2VzdG9ycyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xubGV0IGZmaUZvcmVncm91bmRQaWQ6ICgoKSA9PiBudW1iZXIgfCB1bmRlZmluZWQpIHwgdW5kZWZpbmVkO1xuXG4vLyBMaXZlIHN0YXR1cyBzdXJmYWNlLCByZW5kZXJlZCBpbnRvIHRoZSBzaWRlYmFyIGZvciBkZWJ1Z2dpbmcgdGhlIGZvY3VzIGdhdGUuXG5leHBvcnQgdHlwZSBGb2N1c1N0YXR1cyA9IHtcbiAgYmFja2VuZDogQmFja2VuZDtcbiAgYW5jZXN0b3JDb3VudDogbnVtYmVyO1xuICBsYXN0Rm9yZWdyb3VuZFBpZD86IG51bWJlcjtcbiAgbGFzdFJlc3VsdD86IGJvb2xlYW47XG4gIGxhc3RFcnJvcj86IHN0cmluZztcbn07XG5sZXQgc3RhdHVzOiBGb2N1c1N0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAgfTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGb2N1c1N0YXR1cygpOiBGb2N1c1N0YXR1cyB7XG4gIHJldHVybiBzdGF0dXM7XG59XG5cbmZ1bmN0aW9uIHJ1blBvd2VyU2hlbGwoc2NyaXB0OiBzdHJpbmcsIHRpbWVvdXRNcyA9IDgwMDApOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgb3V0ID0gXCJcIjtcbiAgICBsZXQgY2hpbGQ7XG4gICAgdHJ5IHtcbiAgICAgIGNoaWxkID0gc3Bhd24oXCJwb3dlcnNoZWxsLmV4ZVwiLCBbXCItTm9Qcm9maWxlXCIsIFwiLU5vbkludGVyYWN0aXZlXCIsIFwiLUNvbW1hbmRcIiwgc2NyaXB0XSwge1xuICAgICAgICB3aW5kb3dzSGlkZTogdHJ1ZSxcbiAgICAgICAgc3RkaW86IFtcImlnbm9yZVwiLCBcInBpcGVcIiwgXCJwaXBlXCJdLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2hpbGQua2lsbCgpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICB9LCB0aW1lb3V0TXMpO1xuICAgIGNoaWxkLnN0ZG91dD8ub24oXCJkYXRhXCIsIChjaHVuazogQnVmZmVyKSA9PiB7XG4gICAgICBvdXQgKz0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICB9KTtcbiAgICBjaGlsZC5vbihcImVycm9yXCIsICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXNvbHZlKFwiXCIpO1xuICAgIH0pO1xuICAgIGNoaWxkLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHJlc29sdmUob3V0LnRyaW0oKSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKiogQ29tcHV0ZSBvdXIgYW5jZXN0b3IgUElEIGNoYWluIHZpYSBQb3dlclNoZWxsIChXaW4zMl9Qcm9jZXNzIHBhcmVudCB3YWxrKS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTogUHJvbWlzZTxTZXQ8bnVtYmVyPj4ge1xuICBjb25zdCBzZWxmUGlkID0gcHJvY2Vzcy5waWQ7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbiRFcnJvckFjdGlvblByZWZlcmVuY2UgPSAnU2lsZW50bHlDb250aW51ZSdcbiRwaWRDaGFpbiA9IEAoJHtzZWxmUGlkfSlcbiRjdXIgPSAke3NlbGZQaWR9XG5mb3IgKCRpID0gMDsgJGkgLWx0IDMyIC1hbmQgJGN1ciAtZ3QgMDsgJGkrKykge1xuICAkcCA9IEdldC1DaW1JbnN0YW5jZSBXaW4zMl9Qcm9jZXNzIC1GaWx0ZXIgXCJQcm9jZXNzSWQ9JGN1clwiXG4gIGlmICgtbm90ICRwKSB7IGJyZWFrIH1cbiAgJG5leHQgPSAkcC5QYXJlbnRQcm9jZXNzSWRcbiAgaWYgKCRuZXh0IC1lcSAkY3VyIC1vciAkbmV4dCAtbGUgMCkgeyBicmVhayB9XG4gICRjdXIgPSAkbmV4dFxuICAkcGlkQ2hhaW4gKz0gJGN1clxufVxuJHBpZENoYWluIC1qb2luICcsJ1xuYDtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcnVuUG93ZXJTaGVsbChzY3JpcHQpO1xuICBjb25zdCBwaWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gIGZvciAoY29uc3QgcGFydCBvZiByZXN1bHQuc3BsaXQoXCIsXCIpKSB7XG4gICAgY29uc3QgbiA9IHBhcnNlSW50KHBhcnQsIDEwKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwKSBwaWRzLmFkZChuKTtcbiAgfVxuICByZXR1cm4gcGlkcztcbn1cblxuLyoqIEZvcmVncm91bmQgd2luZG93IG93bmluZyBQSUQgdmlhIFBvd2VyU2hlbGwgKHVzZXIzMiBHZXRGb3JlZ3JvdW5kV2luZG93KS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZvcmVncm91bmRQaWRWaWFQb3dlclNoZWxsKCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHNjcmlwdCA9IGBcbkFkZC1UeXBlIC1UeXBlRGVmaW5pdGlvbiBAJ1xudXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLlJ1bnRpbWUuSW50ZXJvcFNlcnZpY2VzO1xucHVibGljIHN0YXRpYyBjbGFzcyBQdWxzZUZvY3VzIHtcbiAgW0RsbEltcG9ydChcInVzZXIzMi5kbGxcIildXG4gIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEludFB0ciBHZXRGb3JlZ3JvdW5kV2luZG93KCk7XG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxuICBwdWJsaWMgc3RhdGljIGV4dGVybiB1aW50IEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChJbnRQdHIgaFduZCwgb3V0IHVpbnQgbHBkd1Byb2Nlc3NJZCk7XG59XG4nQFxuJGggPSBbUHVsc2VGb2N1c106OkdldEZvcmVncm91bmRXaW5kb3coKVxuJHAgPSBbdWludDMyXTBcblt2b2lkXVtQdWxzZUZvY3VzXTo6R2V0V2luZG93VGhyZWFkUHJvY2Vzc0lkKCRoLCBbcmVmXSRwKVxuJHBcbmA7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJ1blBvd2VyU2hlbGwoc2NyaXB0KTtcbiAgY29uc3QgbiA9IHBhcnNlSW50KHJlc3VsdCwgMTApO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pICYmIG4gPiAwID8gbiA6IHVuZGVmaW5lZDtcbn1cblxuLyoqIFRyeSB0aGUgZmFzdCBidW46ZmZpIGJhY2tlbmQuIFJldHVybnMgdHJ1ZSB3aGVuIGZ1bGx5IGluaXRpYWxpemVkLiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdEZmaUJhY2tlbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBkbG9wZW4sIHB0ciB9ID0gYXdhaXQgaW1wb3J0KFwiYnVuOmZmaVwiKTtcbiAgICBjb25zdCB1c2VyMzIgPSBkbG9wZW4oXCJ1c2VyMzIuZGxsXCIsIHtcbiAgICAgIEdldEZvcmVncm91bmRXaW5kb3c6IHsgYXJnczogW10sIHJldHVybnM6IFwicHRyXCIgfSxcbiAgICAgIEdldFdpbmRvd1RocmVhZFByb2Nlc3NJZDogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwidTMyXCIgfSxcbiAgICB9KTtcbiAgICBjb25zdCBrZXJuZWwzMiA9IGRsb3BlbihcImtlcm5lbDMyLmRsbFwiLCB7XG4gICAgICBHZXRDdXJyZW50UHJvY2Vzc0lkOiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInUzMlwiIH0sXG4gICAgICBDcmVhdGVUb29saGVscDMyU25hcHNob3Q6IHsgYXJnczogW1widTMyXCIsIFwidTMyXCJdLCByZXR1cm5zOiBcInB0clwiIH0sXG4gICAgICBQcm9jZXNzMzJGaXJzdFc6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXG4gICAgICBQcm9jZXNzMzJOZXh0VzogeyBhcmdzOiBbXCJwdHJcIiwgXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcbiAgICAgIENsb3NlSGFuZGxlOiB7IGFyZ3M6IFtcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgVEgzMkNTX1NOQVBQUk9DRVNTID0gMHgyO1xuICAgIGNvbnN0IHNuYXBzaG90ID0ga2VybmVsMzIuc3ltYm9scy5DcmVhdGVUb29saGVscDMyU25hcHNob3QoVEgzMkNTX1NOQVBQUk9DRVNTLCAwKTtcbiAgICBpZiAoIXNuYXBzaG90KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbnRyeSA9IG5ldyBVaW50OEFycmF5KFBST0NFU1NFTlRSWTMyV19TSVpFKTtcbiAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoZW50cnkuYnVmZmVyKTtcbiAgICAgIHZpZXcuc2V0VWludDMyKDAsIFBST0NFU1NFTlRSWTMyV19TSVpFLCB0cnVlKTsgLy8gZHdTaXplXG5cbiAgICAgIGNvbnN0IHBhcmVudCA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgICBsZXQgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMkZpcnN0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XG4gICAgICB3aGlsZSAob2spIHtcbiAgICAgICAgY29uc3QgcGlkID0gdmlldy5nZXRVaW50MzIoT0ZGU0VUX1RIMzJfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IHBwaWQgPSB2aWV3LmdldFVpbnQzMihPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCwgdHJ1ZSk7XG4gICAgICAgIGlmIChwaWQgIT09IDApIHBhcmVudC5zZXQocGlkLCBwcGlkKTtcbiAgICAgICAgb2sgPSBrZXJuZWwzMi5zeW1ib2xzLlByb2Nlc3MzMk5leHRXKHNuYXBzaG90LCBwdHIoZW50cnkpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IGtlcm5lbDMyLnN5bWJvbHMuR2V0Q3VycmVudFByb2Nlc3NJZCgpO1xuICAgICAgbGV0IGN1cnJlbnQgPSBzZWxmO1xuICAgICAgZm9yIChsZXQgZGVwdGggPSAwOyBkZXB0aCA8IDMyICYmIGN1cnJlbnQ7IGRlcHRoKyspIHtcbiAgICAgICAgYW5jZXN0b3JzLmFkZChjdXJyZW50KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXQoY3VycmVudCk7XG4gICAgICAgIGlmIChuZXh0ID09PSB1bmRlZmluZWQgfHwgbmV4dCA9PT0gY3VycmVudCkgYnJlYWs7XG4gICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBrZXJuZWwzMi5zeW1ib2xzLkNsb3NlSGFuZGxlKHNuYXBzaG90KTtcbiAgICB9XG5cbiAgICBmZmlGb3JlZ3JvdW5kUGlkID0gKCkgPT4ge1xuICAgICAgY29uc3QgaHduZCA9IHVzZXIzMi5zeW1ib2xzLkdldEZvcmVncm91bmRXaW5kb3coKTtcbiAgICAgIGlmICghaHduZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHBpZEJ1ZiA9IG5ldyBVaW50MzJBcnJheSgxKTtcbiAgICAgIHVzZXIzMi5zeW1ib2xzLkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZChod25kLCBwdHIocGlkQnVmKSk7XG4gICAgICByZXR1cm4gcGlkQnVmWzBdO1xuICAgIH07XG5cbiAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwiZmZpXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgcmV0dXJuIGFuY2VzdG9ycy5zaXplID4gMDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEVycm9yOiBTdHJpbmcoZXJyb3IpIH07XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmxldCBpbml0UHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVXaW5kb3dzRm9jdXNJbml0KCk6IHZvaWQge1xuICBpZiAoIUlTX1dJTkRPV1MpIHJldHVybjtcbiAgaW5pdFByb21pc2UgPz89IChhc3luYyAoKSA9PiB7XG4gICAgaWYgKGF3YWl0IGluaXRGZmlCYWNrZW5kKCkpIHtcbiAgICAgIGJhY2tlbmQgPSBcImZmaVwiO1xuICAgICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGJhY2tlbmQ6IFwiZmZpXCIgfTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYW5jZXN0b3JzID0gYXdhaXQgYW5jZXN0b3JzVmlhUG93ZXJTaGVsbCgpO1xuICAgIGlmIChhbmNlc3RvcnMuc2l6ZSA+IDApIHtcbiAgICAgIGJhY2tlbmQgPSBcInBvd2Vyc2hlbGxcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJwb3dlcnNoZWxsXCIsIGFuY2VzdG9yQ291bnQ6IGFuY2VzdG9ycy5zaXplIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tlbmQgPSBcIm5vbmVcIjtcbiAgICAgIHN0YXR1cyA9IHsgYmFja2VuZDogXCJub25lXCIsIGFuY2VzdG9yQ291bnQ6IDAsIGxhc3RFcnJvcjogXCJubyBhbmNlc3RvciBjaGFpblwiIH07XG4gICAgfVxuICB9KSgpO1xuICB2b2lkIGluaXRQcm9taXNlO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGN1cnJlbnRseSBoYXMgZm9jdXMsIGZhbHNlIHdoZW4gdGhlIGZvcmVncm91bmQgd2luZG93XG4gKiBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IHByb2Nlc3MsIHVuZGVmaW5lZCB3aGVuIHRoZSBjaGVjayBpcyB1bmF2YWlsYWJsZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzVGVybWluYWxGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbiB8IHVuZGVmaW5lZD4ge1xuICBpZiAoIUlTX1dJTkRPV1MgfHwgYmFja2VuZCA9PT0gXCJub25lXCIpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChiYWNrZW5kID09PSBcImZmaVwiICYmIGZmaUZvcmVncm91bmRQaWQpIHtcbiAgICBjb25zdCBmb3JlZ3JvdW5kID0gZmZpRm9yZWdyb3VuZFBpZCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGZvcmVncm91bmQgIT09IHVuZGVmaW5lZCA/IGFuY2VzdG9ycy5oYXMoZm9yZWdyb3VuZCkgOiB1bmRlZmluZWQ7XG4gICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RGb3JlZ3JvdW5kUGlkOiBmb3JlZ3JvdW5kLCBsYXN0UmVzdWx0OiByZXN1bHQgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGNvbnN0IGZvcmVncm91bmQgPSBhd2FpdCBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpO1xuICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xuICBzdGF0dXMgPSB7IC4uLnN0YXR1cywgbGFzdEZvcmVncm91bmRQaWQ6IGZvcmVncm91bmQsIGxhc3RSZXN1bHQ6IHJlc3VsdCB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTtBQUVBOzs7QUNtQkEsSUFBTSxhQUFhLFFBQVEsYUFBYTtBQUl4QyxJQUFNLGlCQUFpQjtBQTZCdkIsU0FBUyxhQUFhLENBQUMsU0FBOEI7QUFBQSxFQUs1Qyx3QkFDSixLQUFLLENBQUMsUUFBUTtBQUFBLElBQ2IsTUFBTSxXQUFZLElBQThCLFdBQVc7QUFBQSxJQUMxRCxTQUFvRyxPQUNuRztBQUFBLE1BQ0UsT0FBTyxRQUFRO0FBQUEsTUFDZixTQUFTLFFBQVE7QUFBQSxNQUNqQixPQUFPO0FBQUEsTUFDUCxPQUFPO0FBQUEsSUFDVCxHQUNBLENBQUMsS0FBSyxhQUFhLEVBS3JCO0FBQUEsR0FDRCxFQUNBLE1BQU0sTUFBTSxFQUVaO0FBQUE7QUFHTCxlQUFlLGFBQWEsQ0FBQyxLQUFVLFNBQXVDO0FBQUEsRUFDNUUsSUFBSTtBQUFBLElBQ0YsTUFBTSxJQUFJLFVBQVUsT0FBTztBQUFBLE1BQ3pCLE9BQU8sUUFBUTtBQUFBLE1BQ2YsU0FBUyxRQUFRO0FBQUEsTUFDakIsY0FBYyxFQUFFLE1BQU0sU0FBUztBQUFBLE1BQy9CLE9BQU8sUUFBUTtBQUFBLElBQ2pCLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQTtBQUtWLGVBQWUsUUFBUSxDQUFDLEtBQVUsU0FBd0IsTUFBa0M7QUFBQSxFQUMxRixJQUFJLE1BQU0scUJBQXNCLE1BQU0sS0FBSyxRQUFRLE1BQU8sTUFBTTtBQUFBLElBRzlEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsSUFBSSxZQUFZO0FBQUEsSUFDZCxjQUFjLE9BQU87QUFBQSxFQUN2QixFQUFPO0FBQUEsSUFDTCxNQUFNLGNB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
