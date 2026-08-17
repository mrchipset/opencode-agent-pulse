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

//# debugId=07BE1E7A20101DD764756E2164756E21
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL3R1aS50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL25vdGlmaWNhdGlvbi50cyIsImZpbGU6Ly8vQzovVXNlcnMvWm91eXUvcmVwb3Mvb3BlbmNvZGUtYWdlbnQtcHVsc2Uvc3JjL3dpbmRvd3MtZm9jdXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBUdWlQbHVnaW5Nb2R1bGUgfSBmcm9tIFwiQG9wZW5jb2RlLWFpL3BsdWdpbi90dWlcIjtcbmltcG9ydCB0eXBlIHsgU2Vzc2lvbiwgVG9vbFBhcnQgfSBmcm9tIFwiQG9wZW5jb2RlLWFpL3Nkay92MlwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgaW5zZXJ0LCBzZXRQcm9wIH0gZnJvbSBcIkBvcGVudHVpL3NvbGlkXCI7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gXCJAb3BlbnR1aS9zb2xpZFwiO1xuaW1wb3J0IHsgY3JlYXRlU2lnbmFsIH0gZnJvbSBcInNvbGlkLWpzXCI7XG5pbXBvcnQgdHlwZSB7IE5vdGlmeUdhdGUgfSBmcm9tIFwiLi9ub3RpZmljYXRpb25cIjtcbmltcG9ydCB7IG5vdGlmeUludGVydmlld0lucHV0LCBub3RpZnlTdWJhZ2VudHNEb25lLCBub3RpZnlUdXJuRG9uZSB9IGZyb20gXCIuL25vdGlmaWNhdGlvblwiO1xuaW1wb3J0IHsgZW5zdXJlV2luZG93c0ZvY3VzSW5pdCwgZ2V0Rm9jdXNTdGF0dXMsIGlzVGVybWluYWxGb2N1c2VkIH0gZnJvbSBcIi4vd2luZG93cy1mb2N1c1wiO1xuXG4vKipcbiAqIFNpZGViYXIgd2lkZ2V0IHRoYXQgbGl2ZS10cmFja3MgcnVubmluZyBzdWJhZ2VudHMgKHN1Yi1zZXNzaW9ucykuXG4gKlxuICogRGF0YSBzb3VyY2UgKHNlc3Npb24gZXZlbnRzICsgdGFzayB0b29sIHBhcnRzKTpcbiAqICAgLSBgc2Vzc2lvbi5jcmVhdGVkYCAgICAgICAgIC0+IGlkZW50aWZ5IHN1Yi1zZXNzaW9ucyB2aWEgYHByb3BlcnRpZXMuaW5mby5wYXJlbnRJRGBcbiAqICAgLSBgc2Vzc2lvbi51cGRhdGVkYCAgICAgICAgIC0+IGJhY2tmaWxsOiByZXN1bWVkL2V4aXN0aW5nIHN1Yi1zZXNzaW9ucyBuZXZlciBlbWl0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb24uY3JlYXRlZGAsIGJ1dCBgU2Vzc2lvbi5wYXRjaGAgcHVibGlzaGVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb24udXBkYXRlZGAgd2l0aCB0aGUgZnVsbCBTZXNzaW9uIChwYXJlbnRJRCArXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWdlbnQgKyB0aXRsZSkgd2hlbmV2ZXIgdGhlIHNlc3Npb24gaXMgdG91Y2hlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlLmcuIG9uIG1lc3NhZ2UgYWN0aXZpdHkpLiBVc2VkIHRvIGFkZCBtaXNzaW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cmllcyBhbmQgcmVmcmVzaCBhZ2VudC90aXRsZSB3aXRob3V0IHJlc2V0dGluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyBvciB0aW1lcnMuXG4gKiAgIC0gYHNlc3Npb24uc3RhdHVzYCAgICAgICAgICAtPiBgcHJvcGVydGllcy5zdGF0dXMudHlwZWAgKFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCIpXG4gKiAgIC0gYG1lc3NhZ2UucGFydC51cGRhdGVkYCAgICAtPiB0YXNrIHRvb2wgcGFydCAoYHBhcnQudG9vbCA9PT0gXCJ0YXNrXCJgKSByZXBvcnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViLXNlc3Npb24gbGlmZWN5Y2xlOiBgcGFydC5zdGF0ZS5zdGF0dXNgIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJydW5uaW5nXCIgKG1hcmsgYnVzeSkgb3IgXCJjb21wbGV0ZWRcIi9cImVycm9yXCJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWFyayBkb25lKS4gQ2hpbGQgc2Vzc2lvbiBpcyBsaW5rZWQgdmlhIG1ldGFkYXRhXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHNlc3Npb25JZGAvYHNlc3Npb25JRGAgKHN0YXRlLm1ldGFkYXRhIGZpcnN0LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcGFydC5tZXRhZGF0YSkuIFRoaXMgbWlycm9ycyB0aGUgYnVpbHQtaW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJhZ2VudCBwYW5lbCAoc3ViYWdlbnQtZGF0YS50cyk7IGBzZXNzaW9uLmlkbGVgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgZGVwcmVjYXRlZCBhbmQgbm90IGEgY29tcGxldGlvbiBzaWduYWwuXG4gKiAgIC0gYHNlc3Npb24uZGVsZXRlZGAgLyBgc2Vzc2lvbi5lcnJvcmAgLT4gcmVtb3ZlIC8gbWFyayBkb25lXG4gKlxuICogQm9vdHN0cmFwOiBvbiBzdGFydHVwLCBgYXBpLmNsaWVudC5zZXNzaW9uLmxpc3QoKWAgYmFja2ZpbGxzIHN1Yi1zZXNzaW9ucyB0aGF0XG4gKiBhbHJlYWR5IGV4aXN0IChlLmcuIGEgcmVzdW1lZCBwYXJlbnQgc2Vzc2lvbidzIGNoaWxkcmVuKSBzbyB0aGUgc2lkZWJhciBzaG93cyB0aGVtXG4gKiBldmVuIHRob3VnaCBgc2Vzc2lvbi5jcmVhdGVkYCB3YXMgbmV2ZXIgZW1pdHRlZCBmb3IgdGhlbS5cbiAqXG4gKiBSZW5kZXJpbmcgZm9sbG93cyB0aGUgcHJvZHVjdGlvbiBwYXR0ZXJuIG9mIG9oLW15LW9wZW5jb2RlLXNsaW06IHBsYWluIGZ1bmN0aW9uLWNhbGxcbiAqIGhlbHBlcnMgKGBib3hgL2B0ZXh0YCkgYnVpbHQgb24gYEBvcGVudHVpL3NvbGlkYCdzIGBjcmVhdGVFbGVtZW50YC9gaW5zZXJ0YC9gc2V0UHJvcGAsXG4gKiBzbyBubyBKU1gvYmFiZWwgdHJhbnNmb3JtIGlzIHJlcXVpcmVkLlxuICpcbiAqIElNUE9SVEFOVDogaW50ZXJhY3RpdmUgc3RhdGUgaXMgaGVsZCBpbiBzb2xpZCBzaWduYWxzIChgY3JlYXRlU2lnbmFsYCksIHJlYWQgZGlyZWN0bHlcbiAqIGluc2lkZSB0aGUgc2xvdCByZW5kZXJlci4gVGhpcyBpcyB0aGUgc2FtZSBtZWNoYW5pc20gdGhlIGJ1aWx0LWluIE1DUCBibG9jayB1c2VzXG4gKiAoYGNyZWF0ZVNpZ25hbGAgKyByZWFjdGl2ZSByZS1yZW5kZXIpLiBgYXBpLnJlbmRlcmVyLnJlcXVlc3RSZW5kZXIoKWAgZG9lcyBOT1QgcmUtaW52b2tlXG4gKiB0aGUgYHNpZGViYXJfY29udGVudGAgc2xvdCByZW5kZXJlciAodmVyaWZpZWQgYWdhaW5zdCBAb3BlbnR1aS9zb2xpZCAwLjQuMy8wLjUuMSBTbG90KSxcbiAqIHNvIGEgcGxhaW4gbWVtb3J5IHZhcmlhYmxlICsgcmVxdWVzdFJlbmRlciB3b3VsZCBuZXZlciB1cGRhdGUgdGhlIFVJLlxuICovXG5cbnR5cGUgU3ViYWdlbnRTdGF0dXMgPSBcImJ1c3lcIiB8IFwiaWRsZVwiIHwgXCJyZXRyeVwiIHwgXCJkb25lXCI7XG5cbnR5cGUgU3ViYWdlbnRJbmZvID0ge1xuICBhZ2VudDogc3RyaW5nO1xuICBzdGF0dXM6IFN1YmFnZW50U3RhdHVzO1xuICBzaW5jZTogbnVtYmVyOyAvLyBlcG9jaCBtcyB3aGVuIHRoZSBjdXJyZW50IGJ1c3kgcnVuIHN0YXJ0ZWQgKHRpY2tzIHdoaWxlIGJ1c3kvcmV0cnkpXG4gIGZyb3plbjogbnVtYmVyOyAvLyBhY2N1bXVsYXRlZCBlbGFwc2VkIG1zIGZyb20gcHJldmlvdXMgYnVzeSBydW5zIChmcm96ZW4gd2hpbGUgaWRsZS9kb25lKVxuICB0aXRsZT86IHN0cmluZzsgLy8gY3VzdG9tIG5hbWU6IHRhc2sgdG9vbCBpbnB1dC5kZXNjcmlwdGlvbiwgb3Igc2Vzc2lvbiB0aXRsZSBhcyBmYWxsYmFja1xufTtcblxudHlwZSBSdW5uaW5nRW50cnkgPSBbc2Vzc2lvbklEOiBzdHJpbmcsIGluZm86IFN1YmFnZW50SW5mb107XG5cbmZ1bmN0aW9uIGVsZW1lbnQodGFnOiBzdHJpbmcsIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9LCBjaGlsZHJlbjogdW5rbm93bltdID0gW10pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVFbGVtZW50KHRhZyk7XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzKSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBzZXRQcm9wKG5vZGUsIGtleSwgdmFsdWUpO1xuICB9XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICBpZiAoY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gZmFsc2UpIGNvbnRpbnVlO1xuICAgIGluc2VydChub2RlLCBjaGlsZCk7XG4gIH1cbiAgcmV0dXJuIG5vZGUgYXMgdW5rbm93biBhcyBKU1guRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gdGV4dChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGNoaWxkcmVuOiB1bmtub3duW10gPSBbXSk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIGVsZW1lbnQoXCJ0ZXh0XCIsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGJveChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGNoaWxkcmVuOiB1bmtub3duW10gPSBbXSk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIGVsZW1lbnQoXCJib3hcIiwgcHJvcHMsIGNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RHVyYXRpb24oZWxhcHNlZE1zOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCB0b3RhbFNlY29uZHMgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKGVsYXBzZWRNcyAvIDEwMDApKTtcbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICBjb25zdCBzZWNvbmRzID0gdG90YWxTZWNvbmRzICUgNjA7XG4gIHJldHVybiBtaW51dGVzID4gMCA/IGAke21pbnV0ZXN9bSR7c2Vjb25kcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1zYCA6IGAke3NlY29uZHN9c2A7XG59XG5cbi8vIFNob3duIGVsYXBzZWQgdGltZTogdGlja3Mgb25seSB3aGlsZSBidXN5L3JldHJ5OyBmcm96ZW4gd2hpbGUgaWRsZS9kb25lLlxuZnVuY3Rpb24gZW50cnlFbGFwc2VkKGluZm86IFN1YmFnZW50SW5mbyk6IG51bWJlciB7XG4gIHJldHVybiBpbmZvLnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIlxuICAgID8gaW5mby5mcm96ZW4gKyAoRGF0ZS5ub3coKSAtIGluZm8uc2luY2UpXG4gICAgOiBpbmZvLmZyb3plbjtcbn1cblxuLy8gUmVhZCBhIHRhc2sgdG9vbCBwYXJ0J3MgbWV0YWRhdGEgdmFsdWUuIE1pcnJvcnMgc3ViYWdlbnQtZGF0YS50cyBgbWV0YWRhdGEoKWA6XG4vLyBwcmVmZXIgYHN0YXRlLm1ldGFkYXRhYCwgZmFsbCBiYWNrIHRvIGBwYXJ0Lm1ldGFkYXRhYC4gT25seSBzb21lIFRvb2xTdGF0ZSB2YXJpYW50c1xuLy8gY2FycnkgbWV0YWRhdGEsIHNvIG5hcnJvdyB2aWEgYFwibWV0YWRhdGFcIiBpbiBzdGF0ZWAgZXhhY3RseSBsaWtlIHRoZSBidWlsdC1pbiBwYW5lbC5cbmZ1bmN0aW9uIHRvb2xNZXRhZGF0YShwYXJ0OiBUb29sUGFydCwga2V5OiBzdHJpbmcpOiB1bmtub3duIHtcbiAgcmV0dXJuIChcIm1ldGFkYXRhXCIgaW4gcGFydC5zdGF0ZSA/IHBhcnQuc3RhdGUubWV0YWRhdGE/LltrZXldIDogdW5kZWZpbmVkKSA/PyBwYXJ0Lm1ldGFkYXRhPy5ba2V5XTtcbn1cblxuLy8gQWRkIGEgc3ViLXNlc3Npb24gdG8gdGhlIHJ1bm5pbmcgbWFwIGZyb20gYSBmdWxsIFNESyBTZXNzaW9uIChzZXNzaW9uLmNyZWF0ZWQgL1xuLy8gc2Vzc2lvbi51cGRhdGVkIC8gYm9vdHN0cmFwKS4gS2VlcHMgYW55IGV4aXN0aW5nIGVudHJ5J3Mgc3RhdHVzIGFuZCB0aW1lcnMgaW50YWN0LlxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBtYXAgY2hhbmdlZCAobmV3IGVudHJ5LCBvciByZWZyZXNoZWQgYWdlbnQvdGl0bGUpLlxuZnVuY3Rpb24gdXBzZXJ0U2Vzc2lvbihydW5uaW5nOiBNYXA8c3RyaW5nLCBTdWJhZ2VudEluZm8+LCBpbmZvOiBTZXNzaW9uKTogYm9vbGVhbiB7XG4gIGlmICghaW5mby5wYXJlbnRJRCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBleGlzdGluZyA9IHJ1bm5pbmcuZ2V0KGluZm8uaWQpO1xuICBpZiAoZXhpc3RpbmcpIHtcbiAgICAvLyBPbmx5IHJlZnJlc2ggbWV0YWRhdGE7IG5ldmVyIHJlc2V0IHN0YXR1cy9jbG9jayBvZiBhIHRyYWNrZWQgZW50cnkuXG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICBpZiAoaW5mby5hZ2VudCAmJiBpbmZvLmFnZW50ICE9PSBleGlzdGluZy5hZ2VudCkge1xuICAgICAgZXhpc3RpbmcuYWdlbnQgPSBpbmZvLmFnZW50O1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChpbmZvLnRpdGxlICYmIGluZm8udGl0bGUgIT09IGV4aXN0aW5nLnRpdGxlKSB7XG4gICAgICBleGlzdGluZy50aXRsZSA9IGluZm8udGl0bGU7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZWQ7XG4gIH1cbiAgLy8gVW5jb21tZW50IHRoaXMgdG8gc2hvdyBhbGwgaWRsZSBzdWJhZ2VudHNcbiAgLy8gcnVubmluZy5zZXQoaW5mby5pZCwge1xuICAvLyAgIGFnZW50OiBpbmZvLmFnZW50ID8/IFwiP1wiLFxuICAvLyAgIHN0YXR1czogXCJpZGxlXCIsXG4gIC8vICAgc2luY2U6IERhdGUubm93KCksXG4gIC8vICAgZnJvemVuOiAwLFxuICAvLyAgIHRpdGxlOiBpbmZvLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgLy8gfSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5jb25zdCBwbHVnaW46IFR1aVBsdWdpbk1vZHVsZSA9IHtcbiAgaWQ6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2U6dHVpXCIsXG4gIHR1aTogYXN5bmMgKGFwaSwgb3B0aW9ucywgX21ldGEpID0+IHtcbiAgICAvLyBOb3RpZmljYXRpb24gdG9nZ2xlcyBmcm9tIHBsdWdpbiBvcHRpb25zIChyZWdpc3RlcmVkIHZpYSB0aGUgdHVwbGUgZm9ybTpcbiAgICAvLyBbXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLCB7IFwibm90aWZpY2F0aW9uc1wiOiB7IC4uLiB9IH1dKS5cbiAgICBjb25zdCBub3RpZkNmZyA9IChvcHRpb25zIGFzXG4gICAgICB8IHsgbm90aWZpY2F0aW9ucz86IHsgc3ViYWdlbnRzPzogYm9vbGVhbjsgbWFpblNlc3Npb24/OiBib29sZWFuOyBpbnRlcnZpZXc/OiBib29sZWFuOyBvbmx5V2hlblVuZm9jdXNlZD86IGJvb2xlYW4gfSB9XG4gICAgICB8IHVuZGVmaW5lZCk/Lm5vdGlmaWNhdGlvbnM7XG4gICAgY29uc3Qgbm90aWZ5U3ViYWdlbnRzID0gbm90aWZDZmc/LnN1YmFnZW50cyA/PyB0cnVlO1xuICAgIGNvbnN0IG5vdGlmeU1haW5TZXNzaW9uID0gbm90aWZDZmc/Lm1haW5TZXNzaW9uID8/IHRydWU7XG4gICAgY29uc3Qgbm90aWZ5SW50ZXJ2aWV3ID0gbm90aWZDZmc/LmludGVydmlldyA/PyB0cnVlO1xuICAgIC8vIE9wdC1pbiBcIm5vdGlmeSBvbmx5IHdoZW4gdGhlIHRlcm1pbmFsIGlzIHVuZm9jdXNlZFwiLiBUaGUgaG9zdCB0cmFja3MgZm9jdXMgdmlhXG4gICAgLy8gcmVuZGVyZXIgXCJmb2N1c1wiL1wiYmx1clwiIGV2ZW50cyAoREVDIDEwMDQgZm9jdXMgcmVwb3J0aW5nKTsgd2UgbWlycm9yIHRoZSBzYW1lXG4gICAgLy8gc291cmNlIHRocm91Z2ggYGFwaS5yZW5kZXJlcmAuIERlZmF1bHRzIHRvIGZhbHNlOiBub3RpZmljYXRpb25zIGZpcmUgcmVnYXJkbGVzc1xuICAgIC8vIG9mIGZvY3VzLCBwcmVzZXJ2aW5nIHRoZSBjdXJyZW50IGJlaGF2aW9yLlxuICAgIGNvbnN0IG5vdGlmeU9ubHlXaGVuVW5mb2N1c2VkID0gbm90aWZDZmc/Lm9ubHlXaGVuVW5mb2N1c2VkID8/IGZhbHNlO1xuICAgIC8vIE9wdC1pbiBkZWJ1ZyBkaXNwbGF5OiBzaG93IHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIChmb2N1c2VkL2JsdXJyZWQgKyBiYWNrZW5kKSBhc1xuICAgIC8vIGEgc21hbGwgbGluZSBpbiB0aGUgc2lkZWJhci4gRGVmYXVsdHMgdG8gZmFsc2U6IGhpZGRlbiB1bmxlc3MgZXhwbGljaXRseSBlbmFibGVkLlxuICAgIGNvbnN0IHNob3dGb2N1cyA9IChvcHRpb25zIGFzIHsgc2lkZWJhcj86IHsgc2hvd0ZvY3VzPzogYm9vbGVhbiB9IH0gfCB1bmRlZmluZWQpPy5zaWRlYmFyPy5zaG93Rm9jdXMgPz8gZmFsc2U7XG4gICAgLy8gU291cmNlIG9mIHRydXRoIGZvciBsb29rdXBzIChzZXNzaW9uSUQgLT4gaW5mbykuIFJlbmRlcmVkIHZpYSBgcnVubmluZ0VudHJpZXNgXG4gICAgLy8gc2lnbmFsIGJlbG93IHNvIHNvbGlkIHJlYWN0aXZpdHkgcmUtcmVuZGVycyB0aGUgc2xvdCBvbiBldmVyeSBjaGFuZ2UuXG4gICAgY29uc3QgcnVubmluZyA9IG5ldyBNYXA8c3RyaW5nLCBTdWJhZ2VudEluZm8+KCk7XG4gICAgY29uc3QgW3J1bm5pbmdFbnRyaWVzLCBzZXRSdW5uaW5nRW50cmllc10gPSBjcmVhdGVTaWduYWw8UnVubmluZ0VudHJ5W10+KFtdKTtcbiAgICAvLyBDb2xsYXBzZSBzdGF0ZSwgbWF0Y2hlcyBNQ1AvVE9ETyBzZWN0aW9uIGludGVyYWN0aW9uIChidWlsdC1pbiB1c2VzIGNyZWF0ZVNpZ25hbCB0b28pLlxuICAgIGNvbnN0IFtjb2xsYXBzZWQsIHNldENvbGxhcHNlZF0gPSBjcmVhdGVTaWduYWwoZmFsc2UpO1xuXG4gICAgLy8gLS0tIE5vdGlmaWNhdGlvbiBzdGF0ZSAtLS1cbiAgICAvLyBcIkFsbCBzdWJhZ2VudHMgZG9uZVwiIGRldGVjdGlvbjogdHJhY2sgZXZlcnkgdGFzayB0b29sIHBhcnQncyBsaWZlY3ljbGUgc28gd2UgY2FuXG4gICAgLy8gbm90aWZ5IG9uY2Ugd2hlbiBhIHdob2xlIGRlbGVnYXRpb24gcm91bmQgZHJhaW5zIHRvIHplcm8gYWN0aXZlIHBhcnRzLlxuICAgIGNvbnN0IHRhc2tQYXJ0cyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IC8vIGNhbGxJRCAtPiBjdXJyZW50IHN0YXR1c1xuICAgIGxldCBhY3RpdmVUYXNrQ291bnQgPSAwOyAvLyAjIHRhc2sgcGFydHMgY3VycmVudGx5IFwicGVuZGluZ1wiIG9yIFwicnVubmluZ1wiXG4gICAgbGV0IHJvdW5kTm90aWZpZWQgPSBmYWxzZTsgLy8gZGVkdXA6IGhhcyB0aGUgY3VycmVudCBiYXRjaCBhbHJlYWR5IGJlZW4gYW5ub3VuY2VkP1xuICAgIC8vIFwiVHVybiBkb25lXCIgZGV0ZWN0aW9uOiBtYWluIChub24tc3ViKSBzZXNzaW9ucyBvbmx5LiBXZSBub3RpZnkgb24gdGhlIGJ1c3ktPmlkbGVcbiAgICAvLyB0cmFuc2l0aW9uIG9mIGEgbWFpbiBzZXNzaW9uLCB3aGljaCBmaXJlcyBvbmNlIHBlciByb3VuZC4gQXJtZWQgc2V0IGtleWVkIGJ5XG4gICAgLy8gc2Vzc2lvbklEIHNvIG11bHRpcGxlIHRvcC1sZXZlbCBzZXNzaW9ucyBkb24ndCBpbnRlcmZlcmU7IG1pcnJvcnMgdGhlIGJ1aWx0LWluXG4gICAgLy8gbm90aWZpY2F0aW9ucyBwbHVnaW4gYmVoYXZpb3IuXG4gICAgY29uc3QgbWFpbkFybWVkID0gbmV3IFNldDxzdHJpbmc+KCk7IC8vIHNlc3Npb25JRHMgYXJtZWQgb24gYnVzeS9yZXRyeSwgZmlyZWQgb24gaWRsZVxuICAgIC8vIFwiSW50ZXJ2aWV3IGJsb2NrZWRcIiBkZXRlY3Rpb246IHdoZW4gdGhlIG1haW4gc2Vzc2lvbiBpcyBzdXNwZW5kZWQgd2FpdGluZyBmb3IgdXNlclxuICAgIC8vIGlucHV0IChgcXVlc3Rpb25gIHRvb2wgb3IgcGVybWlzc2lvbiBhcHByb3ZhbCksIG5vdGlmeSBvbmNlIHBlciBwZW5kaW5nIHJlcXVlc3QuXG4gICAgLy8gcXVlc3Rpb24uYXNrZWQgLyBwZXJtaXNzaW9uLmFza2VkIGFyZSB0aGUgYXV0aG9yaXRhdGl2ZSBzaWduYWxzIOKAlCB0aGUgYWdlbnQgaXNcbiAgICAvLyBwYXJrZWQgb24gYSBEZWZlcnJlZCwgc28gbm8gc2Vzc2lvbi5zdGF0dXMgY2hhbmdlIGlzIGVtaXR0ZWQuIERlZHVwIGJ5IHJlcXVlc3QgaWRcbiAgICAvLyBhbmQgY2xlYXIgb24gcmVwbGllZC9yZWplY3RlZCAobWlycm9ycyB0aGUgYnVpbHQtaW4gbm90aWZpY2F0aW9ucyBwbHVnaW4pLlxuICAgIGNvbnN0IHBlbmRpbmdRdWVzdGlvbnMgPSBuZXcgU2V0PHN0cmluZz4oKTsgLy8gcXVlc3Rpb24gcmVxdWVzdCBpZHMgYXdhaXRpbmcgYW4gYW5zd2VyXG4gICAgLy8gUGVybWlzc2lvbiByZXF1ZXN0cyBhd2FpdGluZyBhIHJlcGx5LiBWYWx1ZXMgaG9sZCB0aGUgZGVmZXJyZWQtbm90aWZpY2F0aW9uIHRpbWVyXG4gICAgLy8gc28gaXQgY2FuIGJlIGNhbmNlbGxlZCB3aGVuIGEgcmVwbHkgYXJyaXZlcyAoc2VlIHRoZSBwZXJtaXNzaW9uLmFza2VkIGhhbmRsZXIpLlxuICAgIGNvbnN0IHBlbmRpbmdQZXJtaXNzaW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0Pj4oKTtcblxuICAgIC8vIC0tLSBUZXJtaW5hbCBmb2N1cyB0cmFja2luZyAtLS1cbiAgICAvLyBgdW5kZWZpbmVkYCA9IHVua25vd24gKGUuZy4gV2luZG93cyBUZXJtaW5hbCBuZXZlciByZXBvcnRzIERFQyAxMDA0IGZvY3VzIGV2ZW50cyxcbiAgICAvLyBzbyBubyBcImZvY3VzXCIvXCJibHVyXCIgd2lsbCBldmVyIGZpcmUgYW5kIG5vdGlmaWNhdGlvbnMgc3RheSBlbmFibGVkIHRoZXJlKS4gT25seSBhXG4gICAgLy8gZGVmaW5pdGl2ZSBcImZvY3VzZWRcIiBzdGF0ZSBzdXBwcmVzc2VzIG5vdGlmaWNhdGlvbnMgd2hlbiB0aGUgb3B0aW9uIGlzIGVuYWJsZWQuXG4gICAgLy9cbiAgICAvLyBPbiBXaW5kb3dzIHRoZSByZW5kZXJlcidzIERFQyAxMDA0IGJsdXIgZXZlbnQgb2Z0ZW4gbmV2ZXIgYXJyaXZlcyAoZm9jdXMtaW4gZmlyZXNcbiAgICAvLyBhdCBzdGFydHVwLCBmb2N1cy1vdXQgaXMgZHJvcHBlZCksIHdoaWNoIHdvdWxkIHBlcm1hbmVudGx5IHNldCBgZm9jdXNlZCA9IHRydWVgLlxuICAgIC8vIEFzIGEgcmVsaWFibGUgZmFsbGJhY2sgd2UgcXVlcnkgdGhlIFdpbjMyIGZvcmVncm91bmQgd2luZG93IHZpYSBgYnVuOmZmaWAgaW5zdGVhZDpcbiAgICAvLyB0aGUgdGVybWluYWwgaG9zdGluZyB1cyBpcyBhbiBhbmNlc3RvciBwcm9jZXNzLCBzbyBcImZvcmVncm91bmQgd2luZG93IFBJRCBpcyBpbiBvdXJcbiAgICAvLyBhbmNlc3RvciBjaGFpblwiIG1lYW5zIHRoZSB0ZXJtaW5hbCBoYXMgZm9jdXMuIFJlbmRlcmVyIGV2ZW50cyByZW1haW4gdGhlIHNvdXJjZSBvblxuICAgIC8vIG5vbi1XaW5kb3dzIGFuZCBhcyBhIHNlY29uZGFyeSBzaWduYWwgZXZlcnl3aGVyZSBlbHNlLlxuICAgIGVuc3VyZVdpbmRvd3NGb2N1c0luaXQoKTtcbiAgICBsZXQgZm9jdXNlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvLyBEZWJ1ZyBzdXJmYWNlOiBleHBvc2UgdGhlIGZvY3VzIGJhY2tlbmQgKyBsYXN0IHJlc3VsdCBpbiB0aGUgc2lkZWJhciBzbyB3ZSBjYW5cbiAgICAvLyB2ZXJpZnkgdGhlIGdhdGUgd2l0aG91dCByZWx5aW5nIG9uIGZpbGUgbG9ncyAod2hpY2ggbWF5IGJlIGJsb2NrZWQgaW4gdGhlIHJ1bnRpbWUpLlxuICAgIGNvbnN0IFtmb2N1c0RpYWcsIHNldEZvY3VzRGlhZ10gPSBjcmVhdGVTaWduYWwoZ2V0Rm9jdXNTdGF0dXMoKSk7XG4gICAgY29uc3QgcmVmcmVzaEZvY3VzRGlhZyA9ICgpID0+IHNldEZvY3VzRGlhZyhnZXRGb2N1c1N0YXR1cygpKTtcbiAgICBjb25zdCBvbkZvY3VzID0gKCkgPT4ge1xuICAgICAgZm9jdXNlZCA9IHRydWU7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBjb25zdCBvbkJsdXIgPSAoKSA9PiB7XG4gICAgICBmb2N1c2VkID0gZmFsc2U7XG4gICAgICByZWZyZXNoRm9jdXNEaWFnKCk7XG4gICAgfTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJmb2N1c1wiLCBvbkZvY3VzKTtcbiAgICBhcGkucmVuZGVyZXIub24oXCJibHVyXCIsIG9uQmx1cik7XG4gICAgY29uc3Qgbm90aWZ5R2F0ZTogTm90aWZ5R2F0ZSA9IHtcbiAgICAgIG9ubHlXaGVuVW5mb2N1c2VkOiBub3RpZnlPbmx5V2hlblVuZm9jdXNlZCxcbiAgICAgIGZvY3VzZWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gYXdhaXQgaXNUZXJtaW5hbEZvY3VzZWQoKTtcbiAgICAgICAgcmVmcmVzaEZvY3VzRGlhZygpO1xuICAgICAgICByZXR1cm4gd2luID8/IGZvY3VzZWQ7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBzeW5jRW50cmllcyA9ICgpID0+IHNldFJ1bm5pbmdFbnRyaWVzKFsuLi5ydW5uaW5nLmVudHJpZXMoKV0pO1xuXG4gICAgY29uc3QgdW5zdWJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgLy8gQm9vdHN0cmFwOiBiYWNrZmlsbCBzdWItc2Vzc2lvbnMgdGhhdCBhbHJlYWR5IGV4aXN0IChlLmcuIGEgcmVzdW1lZCBwYXJlbnRcbiAgICAvLyBzZXNzaW9uJ3MgY2hpbGRyZW4pLiBSZXN1bWVkIHNlc3Npb25zIG5ldmVyIGVtaXQgc2Vzc2lvbi5jcmVhdGVkLCBzbyB3aXRob3V0XG4gICAgLy8gdGhpcyB0aGUgc2lkZWJhciB3b3VsZCBiZSBibGluZCB0byB0aGVtIHVudGlsIGEgYnJhbmQtbmV3IHN1YmFnZW50IHN0YXJ0cy5cbiAgICBhcGkuY2xpZW50LnNlc3Npb25cbiAgICAgIC5saXN0KClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbnMgPSByZXN1bHQuZGF0YSA/PyBbXTtcbiAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBzZXNzaW9uIG9mIHNlc3Npb25zKSB7XG4gICAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgc2Vzc2lvbikpIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VkKSBzeW5jRW50cmllcygpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIC8vIEJlc3QtZWZmb3J0IGJvb3RzdHJhcDsgbGl2ZSBldmVudHMgc3RpbGwgZHJpdmUgdGhlIGxpc3QgYWZ0ZXJ3YXJkcy5cbiAgICAgIH0pO1xuXG4gICAgLy8gc2Vzc2lvbi5jcmVhdGVkOiBvbmx5IHN1Yi1zZXNzaW9ucyBjYXJyeSBhIHBhcmVudElELlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5jcmVhdGVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJlbnRJRCA9IGV2ZW50LnByb3BlcnRpZXM/LmluZm8/LnBhcmVudElEO1xuICAgICAgICBpZiAoIXBhcmVudElEKSByZXR1cm47XG4gICAgICAgIHJ1bm5pbmcuc2V0KGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklELCB7XG4gICAgICAgICAgYWdlbnQ6IGV2ZW50LnByb3BlcnRpZXMuaW5mby5hZ2VudCA/PyBcIj9cIixcbiAgICAgICAgICBzdGF0dXM6IFwiaWRsZVwiLFxuICAgICAgICAgIHNpbmNlOiBEYXRlLm5vdygpLFxuICAgICAgICAgIGZyb3plbjogMCxcbiAgICAgICAgICB0aXRsZTogZXZlbnQucHJvcGVydGllcy5pbmZvLnRpdGxlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi51cGRhdGVkOiBmaXJlZCBieSBTZXNzaW9uLnBhdGNoIChlLmcuIHNlc3Npb24gdG91Y2ggb24gbWVzc2FnZSBhY3Rpdml0eSlcbiAgICAvLyB3aXRoIHRoZSBmdWxsIFNlc3Npb24uIEZvciByZXN1bWVkL2V4aXN0aW5nIHN1Yi1zZXNzaW9ucyB0aGlzIGlzIHRoZSBvbmx5IGV2ZW50XG4gICAgLy8gdGhhdCBjYXJyaWVzIHRoZWlyIGlkZW50aXR5LCBzbyB1c2UgaXQgdG8gYmFja2ZpbGwgbWlzc2luZyBlbnRyaWVzIGFuZCByZWZyZXNoXG4gICAgLy8gYWdlbnQvdGl0bGUgd2l0aG91dCBkaXN0dXJiaW5nIHN0YXR1cyBvciB0aGUgZWxhcHNlZCBjbG9jay5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24udXBkYXRlZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHVwc2VydFNlc3Npb24ocnVubmluZywgZXZlbnQucHJvcGVydGllcy5pbmZvKSkge1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBzZXNzaW9uLnN0YXR1czogYnVzeSAvIGlkbGUgLyByZXRyeS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInNlc3Npb24uc3RhdHVzXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzZXNzaW9uSUQgPSBldmVudC5wcm9wZXJ0aWVzLnNlc3Npb25JRDtcbiAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50LnByb3BlcnRpZXMuc3RhdHVzLnR5cGU7IC8vIFwiYnVzeVwiIHwgXCJpZGxlXCIgfCBcInJldHJ5XCJcblxuICAgICAgICAvLyAtLS0gXCJUdXJuIGRvbmVcIiBub3RpZmljYXRpb24gZm9yIHRoZSBtYWluIChub24tc3ViKSBzZXNzaW9uIC0tLVxuICAgICAgICAvLyBNaXJyb3JzIHRoZSBidWlsdC1pbiBub3RpZmljYXRpb25zIHBsdWdpbjogYXJtIG9uIGJ1c3kvcmV0cnksIGZpcmUgb25jZSBvbiB0aGVcbiAgICAgICAgLy8gZm9sbG93aW5nIGlkbGUsIHRoZW4gZGlzYXJtLiBPbmx5IGZpcmVzIGZvciBzZXNzaW9ucyB0aGF0IGFyZSBub3QgdHJhY2tlZFxuICAgICAgICAvLyBzdWJhZ2VudHMgKHRvcC1sZXZlbC9tYWluIHNlc3Npb25zKS5cbiAgICAgICAgaWYgKCFydW5uaW5nLmhhcyhzZXNzaW9uSUQpKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT09IFwiYnVzeVwiIHx8IHR5cGUgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgbWFpbkFybWVkLmFkZChzZXNzaW9uSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJpZGxlXCIpIHtcbiAgICAgICAgICAgIGlmIChtYWluQXJtZWQuaGFzKHNlc3Npb25JRCkpIHtcbiAgICAgICAgICAgICAgbWFpbkFybWVkLmRlbGV0ZShzZXNzaW9uSUQpO1xuICAgICAgICAgICAgICBpZiAobm90aWZ5TWFpblNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBub3RpZnlUdXJuRG9uZShhcGksIG5vdGlmeUdhdGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZm8gPSBydW5uaW5nLmdldChzZXNzaW9uSUQpO1xuICAgICAgICBpZiAoIWluZm8pIHJldHVybjtcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYnVzeVwiIHx8IHR5cGUgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgIC8vIFN0YXJ0IGEgbmV3IGNvdW50aW5nIHJ1biBvbiBidXN5L3JldHJ5OyBrZWVwIGFjY3VtdWxhdGVkIGZyb3plbiB0aW1lLlxuICAgICAgICAgIGlmIChpbmZvLnN0YXR1cyAhPT0gXCJidXN5XCIgJiYgaW5mby5zdGF0dXMgIT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgaW5mby5zaW5jZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZm8uc3RhdHVzID0gdHlwZTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcImlkbGVcIikge1xuICAgICAgICAgIC8vIEZyZWV6ZSB0aGUgY2xvY2sgd2hpbGUgaWRsZTsga2VlcCBcImRvbmVcIiBhcyB0aGUgdGVybWluYWwgc3RhdGUuXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLmZyb3plbiArPSBEYXRlLm5vdygpIC0gaW5mby5zaW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSBcImRvbmVcIikge1xuICAgICAgICAgICAgaW5mby5zdGF0dXMgPSBcImlkbGVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0VudHJpZXMoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBtZXNzYWdlLnBhcnQudXBkYXRlZDogdGFzayB0b29sIHBhcnRzIHJlcG9ydCB0aGUgc3ViLXNlc3Npb24gbGlmZWN5Y2xlLiBUaGlzIGlzXG4gICAgLy8gdGhlIHNhbWUgc291cmNlIHRoZSBidWlsdC1pbiBzdWJhZ2VudCBwYW5lbCB1c2VzOyBgc2Vzc2lvbi5pZGxlYCBpcyBkZXByZWNhdGVkLlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwibWVzc2FnZS5wYXJ0LnVwZGF0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnQgPSBldmVudC5wcm9wZXJ0aWVzLnBhcnQ7XG4gICAgICAgIGlmIChwYXJ0LnR5cGUgIT09IFwidG9vbFwiIHx8IHBhcnQudG9vbCAhPT0gXCJ0YXNrXCIpIHJldHVybjtcblxuICAgICAgICAvLyAtLS0gXCJBbGwgc3ViYWdlbnRzIGRvbmVcIiBkZXRlY3Rpb24gKGJhdGNoLXdpZGUsIGluZGVwZW5kZW50IG9mIGNoaWxkSUQpIC0tLVxuICAgICAgICAvLyBUcmFjayBldmVyeSB0YXNrIHRvb2wgcGFydCdzIGxpZmVjeWNsZSBrZXllZCBieSBjYWxsSUQgc28gd2UgY2FuIHRlbGwgd2hlbiBhXG4gICAgICAgIC8vIHdob2xlIGRlbGVnYXRpb24gYmF0Y2ggZHJhaW5zIHRvIHplcm8gYWN0aXZlIHBhcnRzLiBOb3RpZnkgb25jZSBwZXIgYmF0Y2guXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHBhcnQuc3RhdGUuc3RhdHVzO1xuICAgICAgICBjb25zdCBwcmV2U3RhdHVzID0gdGFza1BhcnRzLmdldChwYXJ0LmNhbGxJRCk7XG4gICAgICAgIHRhc2tQYXJ0cy5zZXQocGFydC5jYWxsSUQsIHN0YXR1cyk7XG5cbiAgICAgICAgY29uc3Qgd2FzQWN0aXZlID0gcHJldlN0YXR1cyA9PT0gXCJwZW5kaW5nXCIgfHwgcHJldlN0YXR1cyA9PT0gXCJydW5uaW5nXCI7XG4gICAgICAgIGNvbnN0IG5vd0FjdGl2ZSA9IHN0YXR1cyA9PT0gXCJwZW5kaW5nXCIgfHwgc3RhdHVzID09PSBcInJ1bm5pbmdcIjtcbiAgICAgICAgaWYgKHdhc0FjdGl2ZSAmJiAhbm93QWN0aXZlKSB7XG4gICAgICAgICAgLy8gQSBwcmV2aW91c2x5LWFjdGl2ZSB0YXNrIGp1c3QgcmVhY2hlZCBhIHRlcm1pbmFsIHN0YXRlLlxuICAgICAgICAgIGFjdGl2ZVRhc2tDb3VudC0tO1xuICAgICAgICAgIGlmIChhY3RpdmVUYXNrQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIC8vIEJhdGNoIGRyYWluZWQgdG8gemVybyAtPiBhbGwgZGVsZWdhdGVkIHN1YmFnZW50cyBmaW5pc2hlZC5cbiAgICAgICAgICAgIGlmICghcm91bmROb3RpZmllZCkge1xuICAgICAgICAgICAgICByb3VuZE5vdGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKG5vdGlmeVN1YmFnZW50cykge1xuICAgICAgICAgICAgICAgIG5vdGlmeVN1YmFnZW50c0RvbmUoYXBpLCB0YXNrUGFydHMuc2l6ZSwgbm90aWZ5R2F0ZSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF3YXNBY3RpdmUgJiYgbm93QWN0aXZlKSB7XG4gICAgICAgICAgLy8gQSBicmFuZC1uZXcgYWN0aXZlIHRhc2sgYXBwZWFycyAoc3RhcnQgb2YgYSBuZXcgZGVsZWdhdGlvbiBiYXRjaCkuXG4gICAgICAgICAgaWYgKGFjdGl2ZVRhc2tDb3VudCA9PT0gMCkgcm91bmROb3RpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIGFjdGl2ZVRhc2tDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hpbGQgc2Vzc2lvbiBpcyBpZGVudGlmaWVkIGJ5IG1ldGFkYXRhIHNlc3Npb25JZC9zZXNzaW9uSUQgKHN0YXRlIGZpcnN0KS5cbiAgICAgICAgY29uc3QgY2hpbGRJRCA9XG4gICAgICAgICAgKHR5cGVvZiB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSWRcIikgPT09IFwic3RyaW5nXCIgPyB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSWRcIikgOiB1bmRlZmluZWQpID8/XG4gICAgICAgICAgKHR5cGVvZiB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSURcIikgPT09IFwic3RyaW5nXCIgPyB0b29sTWV0YWRhdGEocGFydCwgXCJzZXNzaW9uSURcIikgOiB1bmRlZmluZWQpO1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkSUQgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAvLyBPbmx5IHVwZGF0ZSBlbnRyaWVzIHdlIGFscmVhZHkgdHJhY2s7IG5ldmVyIGNyZWF0ZSBuZXcgb25lcyBmcm9tIHBhcnRzLlxuICAgICAgICBjb25zdCBpbmZvID0gcnVubmluZy5nZXQoY2hpbGRJRCk7XG4gICAgICAgIGlmICghaW5mbykgcmV0dXJuO1xuXG4gICAgICAgIC8vIEN1c3RvbSBuYW1lOiB0aGUgZGVzY3JpcHRpb24gZ2l2ZW4gd2hlbiBkZWxlZ2F0aW5nIChtaXJyb3JzIHRoZSBidWlsdC1pblxuICAgICAgICAvLyBzdWJhZ2VudCBwYW5lbCwgd2hpY2ggcHJlZmVycyBpbnB1dC5kZXNjcmlwdGlvbiwgdGhlbiBpbnB1dC5zdWJhZ2VudF90eXBlKS5cbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXJ0LnN0YXRlLmlucHV0O1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0LmRlc2NyaXB0aW9uID09PSBcInN0cmluZ1wiICYmIGlucHV0LmRlc2NyaXB0aW9uLnRyaW0oKSkge1xuICAgICAgICAgIGluZm8udGl0bGUgPSBpbnB1dC5kZXNjcmlwdGlvbi50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5zdWJhZ2VudF90eXBlID09PSBcInN0cmluZ1wiICYmIGlucHV0LnN1YmFnZW50X3R5cGUudHJpbSgpKSB7XG4gICAgICAgICAgaW5mby5hZ2VudCA9IGlucHV0LnN1YmFnZW50X3R5cGUudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnQuc3RhdGUuc3RhdHVzID09PSBcInJ1bm5pbmdcIikge1xuICAgICAgICAgIC8vIEEgcmVzdW1lZCBzdWJhZ2VudCByZS1ydW5zIGl0cyB0YXNrIHRvb2wgcGFydDsgc3VyZmFjZSBpdCBhcyBidXN5IGFnYWluLlxuICAgICAgICAgIC8vIChUaGUgcGFydCBjYXJyaWVzIGlucHV0LCBzbyB0aGlzIGFsc28gcmVmcmVzaGVzIHRoZSBjdXN0b20gbmFtZSBhYm92ZS4pXG4gICAgICAgICAgaWYgKGluZm8uc3RhdHVzICE9PSBcImJ1c3lcIiAmJiBpbmZvLnN0YXR1cyAhPT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgICBpbmZvLnNpbmNlID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5mby5zdGF0dXMgPSBcImJ1c3lcIjtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJ0LnN0YXRlLnN0YXR1cyA9PT0gXCJjb21wbGV0ZWRcIiB8fCBwYXJ0LnN0YXRlLnN0YXR1cyA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgICAgLy8gRnJlZXplIHRoZSBjbG9jayBhdCBjb21wbGV0aW9uIChuby1vcCBpZiBhbHJlYWR5IGZyb3plbiB3aGlsZSBpZGxlKS5cbiAgICAgICAgICBpZiAoaW5mby5zdGF0dXMgPT09IFwiYnVzeVwiIHx8IGluZm8uc3RhdHVzID09PSBcInJldHJ5XCIpIHtcbiAgICAgICAgICAgIGluZm8uZnJvemVuICs9IERhdGUubm93KCkgLSBpbmZvLnNpbmNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbmZvLnN0YXR1cyA9IFwiZG9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2Vzc2lvbi5kZWxldGVkOiBzdWItc2Vzc2lvbiBpcyBnb25lLlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5kZWxldGVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBtYWluQXJtZWQuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklEKTtcbiAgICAgICAgaWYgKHJ1bm5pbmcuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMuc2Vzc2lvbklEKSkge1xuICAgICAgICAgIHN5bmNFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBzZXNzaW9uLmVycm9yOiBtYXJrIGRvbmUgKGtlcHQgdmlzaWJsZSB1bnRpbCBkZWxldGVkKSBpbnN0ZWFkIG9mIGRyb3BwaW5nIGl0LlxuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwic2Vzc2lvbi5lcnJvclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklEID0gZXZlbnQucHJvcGVydGllcy5zZXNzaW9uSUQ7XG4gICAgICAgIGlmICghc2Vzc2lvbklEKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGluZm8gPSBydW5uaW5nLmdldChzZXNzaW9uSUQpO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgIGlmIChpbmZvLnN0YXR1cyA9PT0gXCJidXN5XCIgfHwgaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIikge1xuICAgICAgICAgICAgaW5mby5mcm96ZW4gKz0gRGF0ZS5ub3coKSAtIGluZm8uc2luY2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGluZm8uc3RhdHVzID0gXCJkb25lXCI7XG4gICAgICAgICAgc3luY0VudHJpZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFwiSW50ZXJ2aWV3IGJsb2NrZWRcIiBub3RpZmljYXRpb25zOiB0aGUgbWFpbiBzZXNzaW9uIGlzIHN1c3BlbmRlZCB3YWl0aW5nIGZvciB1c2VyXG4gICAgLy8gaW5wdXQuIGBxdWVzdGlvbi5hc2tlZGAgZmlyZXMgd2hlbiB0aGUgYWdlbnQgYXNrcyB0aGUgdXNlciBzb21ldGhpbmcgKHBsYW5cbiAgICAvLyBjb25maXJtYXRpb24sIGNob2ljZXMsIGV0Yy4pOyBgcGVybWlzc2lvbi5hc2tlZGAgZmlyZXMgd2hlbiB0aGUgYWdlbnQgbmVlZHMgYW5cbiAgICAvLyBhcHByb3ZhbCAoZS5nLiB0byB3cml0ZSBhIGZpbGUgb3IgcnVuIGEgY29tbWFuZCkuIE5vIHNlc3Npb24uc3RhdHVzIGNoYW5nZSBpc1xuICAgIC8vIGVtaXR0ZWQgZHVyaW5nIHRoZSB3YWl0ICh0aGUgYWdlbnQgaXMgcGFya2VkIG9uIGEgRGVmZXJyZWQpLCBzbyB0aGVzZSBldmVudHMgYXJlXG4gICAgLy8gdGhlIG9ubHkgcmVsaWFibGUgc2lnbmFsLiBNYWluIHNlc3Npb25zIG9ubHk6IHN1YmFnZW50IHJlcXVlc3RzIGFyZSBmaWx0ZXJlZCBvdXRcbiAgICAvLyAoYSBzdWJhZ2VudCdzIG93biBpbnRlcnZpZXcgYmVsb25ncyB0byBpdHMgZGVsZWdhdGlvbiBmbG93LCBub3QgdGhlIG1haW4gdHVybikuXG4gICAgLy8gRGVkdXAgYnkgcmVxdWVzdCBpZCBhbmQgY2xlYXIgb24gcmVwbGllZC9yZWplY3RlZCwgbWlycm9yaW5nIHRoZSBidWlsdC1pblxuICAgIC8vIG5vdGlmaWNhdGlvbnMgcGx1Z2luIChub3RpZmljYXRpb25zLnRzKS5cbiAgICB1bnN1YnMucHVzaChcbiAgICAgIGFwaS5ldmVudC5vbihcInF1ZXN0aW9uLmFza2VkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBzZXNzaW9uSUQsIHF1ZXN0aW9ucyB9ID0gZXZlbnQucHJvcGVydGllcztcbiAgICAgICAgaWYgKCFub3RpZnlJbnRlcnZpZXcgfHwgcnVubmluZy5oYXMoc2Vzc2lvbklEKSB8fCBwZW5kaW5nUXVlc3Rpb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgICAgcGVuZGluZ1F1ZXN0aW9ucy5hZGQoaWQpO1xuICAgICAgICBjb25zdCBmaXJzdCA9IHF1ZXN0aW9ucz8uWzBdO1xuICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChhcGksIFwicXVlc3Rpb25cIiwgZmlyc3Q/LnF1ZXN0aW9uIHx8IGZpcnN0Py5oZWFkZXIsIG5vdGlmeUdhdGUpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJxdWVzdGlvbi5yZXBsaWVkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBwZW5kaW5nUXVlc3Rpb25zLmRlbGV0ZShldmVudC5wcm9wZXJ0aWVzLnJlcXVlc3RJRCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHVuc3Vicy5wdXNoKFxuICAgICAgYXBpLmV2ZW50Lm9uKFwicXVlc3Rpb24ucmVqZWN0ZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIHBlbmRpbmdRdWVzdGlvbnMuZGVsZXRlKGV2ZW50LnByb3BlcnRpZXMucmVxdWVzdElEKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgLy8gUGVybWlzc2lvbiBhcHByb3ZhbCByZXF1ZXN0cy4gVW5saWtlIGBxdWVzdGlvbmAsIHBlcm1pc3Npb24gYXBwcm92YWxzIGNhbiBiZVxuICAgIC8vIGF1dG8tYXBwcm92ZWQgYnkgdGhlIGNsaWVudDogd2l0aCBhdXRvLWFwcHJvdmFsIGVuYWJsZWQgKGAtLWF1dG9gIC8gVFVJXG4gICAgLy8gYHBlcm1pc3Npb24ubW9kZWApLCB0aGUgc2VydmVyIHN0aWxsIGVtaXRzIGBwZXJtaXNzaW9uLmFza2VkYCBhbmQgdGhlIFRVSSByZXBsaWVzXG4gICAgLy8gYFwib25jZVwiYCB3aXRoaW4gdGhlIHNhbWUgZXZlbnQgbG9vcCAoc3luYy50c3g6MTkwLTIwMCkg4oCUIHNvIGEgbm90aWZpY2F0aW9uIGZpcmVkXG4gICAgLy8gaW1tZWRpYXRlbHkgaXMgc3BhbSBldmVuIHRob3VnaCB0aGUgdXNlciBuZXZlciBuZWVkcyB0byBhY3QuIEZpeDogZGVmZXIgdGhlXG4gICAgLy8gbm90aWZpY2F0aW9uIGJ5IGEgc2hvcnQgd2luZG93IGFuZCBjYW5jZWwgaXQgaWYgYSByZXBseSBhcnJpdmVzIGluIHRpbWUuIE1hbnVhbFxuICAgIC8vIGFwcHJvdmFscyB0YWtlIGZhciBsb25nZXIgdGhhbiB0aGUgd2luZG93ICh0aGUgdXNlciBtdXN0IHJlYWQgYW5kIGNsaWNrKSwgc28gdGhleVxuICAgIC8vIGFyZSB1bmFmZmVjdGVkLiBUaGlzIGlzIHRoZSBvbmx5IHJlbGlhYmxlIHNpZ25hbDogYHBlcm1pc3Npb24uYXNrZWRgIGNhcnJpZXMgbm9cbiAgICAvLyBtb2RlIGZpZWxkIGFuZCB0aGUgYXV0byBtb2RlIGlzIGNsaWVudC1zaWRlIFVJIHN0YXRlIHRoZSBwbHVnaW4gY2Fubm90IHJlYWQuXG4gICAgY29uc3QgUEVSTUlTU0lPTl9OT1RJRllfREVMQVlfTVMgPSA1MDA7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJwZXJtaXNzaW9uLmFza2VkXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBzZXNzaW9uSUQsIHBlcm1pc3Npb24gfSA9IGV2ZW50LnByb3BlcnRpZXM7XG4gICAgICAgIGlmICghbm90aWZ5SW50ZXJ2aWV3IHx8IHJ1bm5pbmcuaGFzKHNlc3Npb25JRCkgfHwgcGVuZGluZ1Blcm1pc3Npb25zLmhhcyhpZCkpIHJldHVybjtcbiAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBTdGlsbCBwZW5kaW5nIGFmdGVyIHRoZSB3aW5kb3cgLT4gdGhlIHVzZXIgaGFzIHRvIGFwcHJvdmUgaXQgbWFudWFsbHkuXG4gICAgICAgICAgaWYgKHBlbmRpbmdQZXJtaXNzaW9ucy5kZWxldGUoaWQpKSB7XG4gICAgICAgICAgICBub3RpZnlJbnRlcnZpZXdJbnB1dChhcGksIFwicGVybWlzc2lvblwiLCBwZXJtaXNzaW9uLCBub3RpZnlHYXRlKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBQRVJNSVNTSU9OX05PVElGWV9ERUxBWV9NUyk7XG4gICAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5zZXQoaWQsIHRpbWVyKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdW5zdWJzLnB1c2goXG4gICAgICBhcGkuZXZlbnQub24oXCJwZXJtaXNzaW9uLnJlcGxpZWRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIEZpcmVkIGZvciBib3RoIG1hbnVhbCBhbmQgYXV0byBhcHByb3ZhbCAocmVwbHkgXCJvbmNlXCIgfCBcImFsd2F5c1wiIHwgXCJyZWplY3RcIik7XG4gICAgICAgIC8vIGVpdGhlciB3YXkgdGhlIHVzZXIgbm8gbG9uZ2VyIG5lZWRzIHRvIGFjdCwgc28gY2FuY2VsIHRoZSBkZWZlcnJlZCBub3RpZmljYXRpb24uXG4gICAgICAgIGNvbnN0IHsgcmVxdWVzdElEIH0gPSBldmVudC5wcm9wZXJ0aWVzO1xuICAgICAgICBjb25zdCB0aW1lciA9IHBlbmRpbmdQZXJtaXNzaW9ucy5nZXQocmVxdWVzdElEKTtcbiAgICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICBwZW5kaW5nUGVybWlzc2lvbnMuZGVsZXRlKHJlcXVlc3RJRCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBLZWVwIHRoZSBlbGFwc2VkLXRpbWUgY29sdW1uIGxpdmUgb25seSB3aGlsZSBzb21lIHN1YmFnZW50J3MgY2xvY2sgaXMgcnVubmluZyAoYnVzeS9yZXRyeSkuXG4gICAgY29uc3QgdGlja2VyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgZm9yIChjb25zdCBpbmZvIG9mIHJ1bm5pbmcudmFsdWVzKCkpIHtcbiAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSBcImJ1c3lcIiB8fCBpbmZvLnN0YXR1cyA9PT0gXCJyZXRyeVwiKSB7XG4gICAgICAgICAgYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFjdGl2ZSkgc3luY0VudHJpZXMoKTtcbiAgICB9LCAxMDAwKTtcblxuICAgIGFwaS5saWZlY3ljbGUub25EaXNwb3NlKCgpID0+IHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGlja2VyKTtcbiAgICAgIGFwaS5yZW5kZXJlci5vZmYoXCJmb2N1c1wiLCBvbkZvY3VzKTtcbiAgICAgIGFwaS5yZW5kZXJlci5vZmYoXCJibHVyXCIsIG9uQmx1cik7XG4gICAgICAvLyBDYW5jZWwgYW55IHBlbmRpbmcgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb25zLlxuICAgICAgZm9yIChjb25zdCB0aW1lciBvZiBwZW5kaW5nUGVybWlzc2lvbnMudmFsdWVzKCkpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIH1cbiAgICAgIHBlbmRpbmdQZXJtaXNzaW9ucy5jbGVhcigpO1xuICAgICAgdW5zdWJzLmZvckVhY2goKHVuc3ViKSA9PiB1bnN1YigpKTtcbiAgICB9KTtcblxuICAgIGFwaS5zbG90cy5yZWdpc3Rlcih7XG4gICAgICBvcmRlcjogOTUwLFxuICAgICAgc2xvdHM6IHtcbiAgICAgICAgc2lkZWJhcl9jb250ZW50KF9jdHgsIF9wcm9wcykge1xuICAgICAgICAgIC8vIFJlYWRpbmcgc2lnbmFscyBpbnNpZGUgdGhlIHJlbmRlcmVyIG1ha2VzIHNvbGlkIHJlLXJlbmRlciB0aGlzIHNsb3RcbiAgICAgICAgICAvLyByZWFjdGl2ZWx5IG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZSAobm8gcmVxdWVzdFJlbmRlciBuZWVkZWQpLlxuICAgICAgICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gY29sbGFwc2VkKCk7XG4gICAgICAgICAgY29uc3QgZW50cmllcyA9IHJ1bm5pbmdFbnRyaWVzKCk7XG4gICAgICAgICAgY29uc3QgdGhlbWUgPSBhcGkudGhlbWUuY3VycmVudDtcblxuICAgICAgICAgIGNvbnN0IGhlYWRlciA9IGJveChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICAvLyBNb3VzZSBcImNsaWNrXCIgb24gdGhlIGhlYWRlciB0b2dnbGVzIGNvbGxhcHNlIChob3N0IGRpc3BhdGNoZXMgbW91c2VcbiAgICAgICAgICAgICAgLy8gZXZlbnRzIHRvIHNpZGViYXIgcmVuZGVyYWJsZXM7IG1hdGNoZXMgdGhlIGJ1aWx0LWluIE1DUCBibG9jaykuXG4gICAgICAgICAgICAgIG9uTW91c2VEb3duOiAoKSA9PiBzZXRDb2xsYXBzZWQoKHZhbHVlKSA9PiAhdmFsdWUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS5hY2NlbnQgfSwgW2Ake2lzQ29sbGFwc2VkID8gXCLilrhcIiA6IFwi4pa+XCJ9IFN1YmFnZW50c2BdKSxcbiAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0TXV0ZWQgfSwgZW50cmllcy5sZW5ndGggPiAwID8gW2AgKCR7ZW50cmllcy5sZW5ndGh9KWBdIDogW10pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gYm94KHsgd2lkdGg6IFwiMTAwJVwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiIH0sIFtoZWFkZXJdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb2N1cyBzdGF0ZSBkaXNwbGF5OiBvbmx5IHJlbmRlcmVkIHdoZW4gdGhlIGBzaWRlYmFyLnNob3dGb2N1c2Agb3B0aW9uIGlzXG4gICAgICAgICAgLy8gZW5hYmxlZCAoZGVmYXVsdCBoaWRkZW4pLiBTaG93cyB0aGUgY3VycmVudCBmb2N1cyBiYWNrZW5kICsgbGFzdCByZXN1bHQuXG4gICAgICAgICAgY29uc3QgZm9jdXNMaW5lID0gKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvd0ZvY3VzKSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBkaWFnID0gZm9jdXNEaWFnKCk7XG4gICAgICAgICAgICBjb25zdCBmbGFnID0gZGlhZy5sYXN0UmVzdWx0ID09PSB0cnVlID8gXCLil49mb2N1c2VkXCIgOiBkaWFnLmxhc3RSZXN1bHQgPT09IGZhbHNlID8gXCLil4tibHVycmVkXCIgOiBcIj91bmtub3duXCI7XG4gICAgICAgICAgICBjb25zdCBzcmMgPSBkaWFnLmxhc3RGb3JlZ3JvdW5kUGlkICE9PSB1bmRlZmluZWQgPyBgIGZnPSR7ZGlhZy5sYXN0Rm9yZWdyb3VuZFBpZH1gIDogXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGRpYWcubGFzdEVycm9yID8gYCBlcnI9JHtkaWFnLmxhc3RFcnJvcn1gIDogXCJcIjtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHRleHQoeyBmZzogdGhlbWUudGV4dE11dGVkIH0sIFtcbiAgICAgICAgICAgICAgICBgICBmb2N1c1ske2RpYWcuYmFja2VuZH0ke2RpYWcuYW5jZXN0b3JDb3VudCA/IGA6JHtkaWFnLmFuY2VzdG9yQ291bnR9YCA6IFwiXCJ9XSAke2ZsYWd9JHtzcmN9JHtlcnJ9YCxcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICBjb25zdCByb3dzID0gZW50cmllcy5tYXAoKFtzZXNzaW9uSUQsIGluZm9dKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZm8uc3RhdHVzID09PSBcImJ1c3lcIjtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1c0NvbG9yID0gaXNBY3RpdmUgPyB0aGVtZS5zdWNjZXNzIDogaW5mby5zdGF0dXMgPT09IFwicmV0cnlcIiA/IHRoZW1lLndhcm5pbmcgOiB0aGVtZS50ZXh0TXV0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gYm94KFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDEsXG4gICAgICAgICAgICAgICAgLy8gTGVmdC1jbGljayBhIHJvdyB0byBqdW1wIGludG8gdGhhdCBzdWItc2Vzc2lvbidzIGNvbnRleHQgdmlld1xuICAgICAgICAgICAgICAgIC8vIChob3N0IHBsdWdpbiBBUEk6IGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSkpLlxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duOiAoZXZlbnQ6IHsgYnV0dG9uPzogbnVtYmVyIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gIT09IHVuZGVmaW5lZCAmJiBldmVudC5idXR0b24gIT09IDApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIGFwaS5yb3V0ZS5uYXZpZ2F0ZShcInNlc3Npb25cIiwgeyBzZXNzaW9uSUQgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHRleHQoeyBmZzogc3RhdHVzQ29sb3IgfSwgW2Dil49gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiB0aGVtZS50ZXh0IH0sIFtgICR7aW5mby5hZ2VudH1gXSksXG4gICAgICAgICAgICAgICAgdGV4dCh7IGZnOiBzdGF0dXNDb2xvciB9LCBbYCAke2luZm8uc3RhdHVzfWBdKSxcbiAgICAgICAgICAgICAgICB0ZXh0KHsgZmc6IHRoZW1lLnRleHRNdXRlZCB9LCBbYCAke2Zvcm1hdER1cmF0aW9uKGVudHJ5RWxhcHNlZChpbmZvKSl9YF0pLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBib3goeyB3aWR0aDogXCIxMDAlXCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIgfSwgW2hlYWRlciwgLi4uZm9jdXNMaW5lLCAuLi5yb3dzXSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgcGx1Z2luO1xuIiwiaW1wb3J0IHR5cGUgeyBUdWlBdHRlbnRpb25Tb3VuZCwgVHVpUGx1Z2luQXBpIH0gZnJvbSBcIkBvcGVuY29kZS1haS9wbHVnaW4vdHVpXCI7XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGRpc3BhdGNoIGZvciBvcGVuY29kZS1hZ2VudC1wdWxzZS5cbiAqXG4gKiBUd28gZGVsaXZlcnkgY2hhbm5lbHMsIHNlbGVjdGVkIGJ5IHBsYXRmb3JtOlxuICpcbiAqICAgLSBOb24tV2luZG93czogdXNlIHRoZSBidWlsdC1pbiBgYXBpLmF0dGVudGlvbi5ub3RpZnkoKWAgKG1hY09TIGlUZXJtMi9HaG9zdHR5IGFuZFxuICogICAgIExpbnV4IGtpdHR5L2Zvb3QgaW1wbGVtZW50IHRoZSBPU0MgOS85OSBwcm90b2NvbCB0aGlzIHJlbGllcyBvbikuIFN1cHBvcnRzIGJvdGhcbiAqICAgICBhIHN5c3RlbSBub3RpZmljYXRpb24gYW5kIGEgc291bmQuXG4gKiAgIC0gV2luZG93czogV2luZG93cyBUZXJtaW5hbCBkb2VzIE5PVCBpbXBsZW1lbnQgdGhlIE9TQyA5OSBwcm90b2NvbCArIERFQyAxMDA0IGZvY3VzXG4gKiAgICAgdHJhY2tpbmcgdGhhdCBgYXBpLmF0dGVudGlvbi5ub3RpZnlgJ3Mgbm90aWZpY2F0aW9uIHBhdGggZGVwZW5kcyBvbiAoa25vd24gaXNzdWVcbiAqICAgICAjMzUwNTUpLCBzbyB0aGUgc3lzdGVtIG5vdGlmaWNhdGlvbiBpcyBzaWxlbnRseSBkcm9wcGVkLiBBcyBhIHdvcmthcm91bmQgd2Ugcm91dGVcbiAqICAgICB0aHJvdWdoIGBub2RlLW5vdGlmaWVyYCwgd2hpY2ggb24gV2luZG93cyBzaGVsbHMgb3V0IHRvIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlXG4gKiAgICAgdG8gcG9zdCBhIHJlYWwgQWN0aW9uIENlbnRlciB0b2FzdC4gKFRoZSBidWlsdC1pbiBzb3VuZCBpcyB1bmFmZmVjdGVkLCBidXQgb25cbiAqICAgICBXaW5kb3dzIHRoZSBUVUkgc291bmQgYW5kIHRoZSB0b2FzdCBhcmUgZGVsaXZlcmVkIGluZGVwZW5kZW50bHkuKVxuICpcbiAqIEFsbCBmdW5jdGlvbnMgYXJlIGJlc3QtZWZmb3J0OiBmYWlsdXJlcyBhcmUgc3dhbGxvd2VkIHNvIGEgbm90aWZpY2F0aW9uIHByb2JsZW0gbmV2ZXJcbiAqIGJyZWFrcyB0aGUgcGx1Z2luLlxuICovXG5cbnR5cGUgQXBpID0gUGljazxUdWlQbHVnaW5BcGksIFwiYXR0ZW50aW9uXCIgfCBcInVpXCI+O1xuXG5jb25zdCBJU19XSU5ET1dTID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiO1xuXG4vLyBBcHBVc2VyTW9kZWxJRCB1c2VkIGZvciB0aGUgV2luZG93cyB0b2FzdC4gbm9kZS1ub3RpZmllciByZXF1aXJlcyBhbiBBVU1JRCBmb3Jcbi8vIEFjdGlvbiBDZW50ZXIgdG9hc3RzIHRvIGdyb3VwIHByb3Blcmx5IGFuZCBzaG93IGEgZnJpZW5kbHkgYXBwIG5hbWUuXG5jb25zdCBXSU5ET1dTX0FQUF9JRCA9IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIjtcblxuLy8gT3BlbkNvZGUgbG9nbyBhcyBhIFBORyAocHJlLXJlbmRlcmVkIGZyb20gdGhlIFNWRyBpbiBzY3JpcHRzL2dlbi1pY29uLnRzIGF0IDI1NngzMjApLFxuLy8gZW5jb2RlZCBhcyBiYXNlNjQuIFBhc3NlZCB0byBub2RlLW5vdGlmaWVyJ3MgYGljb25gIGZpZWxkIHNvIHRoZSBXaW5kb3dzIEFjdGlvbiBDZW50ZXJcbi8vIHRvYXN0IHNob3dzIHRoZSBPcGVuQ29kZSBsb2dvIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgaWNvbi4gQmVjYXVzZSBub2RlLW5vdGlmaWVyJ3Ncbi8vIFdpbmRvd3MgYnJhbmNoIGV4cGVjdHMgYSBmaWxlIHBhdGggKG5vdCBhIGRhdGEgVVJMKSwgd2UgZGVjb2RlIHRoaXMgdG8gYSB0ZW1wIGZpbGUgYXRcbi8vIGRpc3BhdGNoIHRpbWUgKHNlZSB3aW5kb3dzTm90aWZ5KS5cbmNvbnN0IE9QRU5DT0RFX0lDT05fUE5HX0I2NCA9XG4gIFwiaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVFBQUFBRkFDQVlBQUFCVEtxSUtBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBS1owbEVcIiArXG4gIFwiUVZSNG5PM2RNVzRrUVF4RDBUbEpBYnovRWV5N3laRmpPNU1BUGdIS0YyM3liMDkxaWZya3ZkR2VBUTI4eW1mdzJmNEhhTStBQmg0QUVBRVFcIiArXG4gIFwiME1EekJrQUVRRUFEejA4QUlnQUNHbmpPQUlnQUNHamdPUVFrQWlDZ2dlY3JBQkVBQVEwOG53R0pBQWhvNExrSFFBUkFRQVBQUlNBaUFBSWFcIiArXG4gIFwiZUc0Q0VnRVEwTUJ6RlpnSWdJQUdubGtBSWdBQ0duaUdnWWdBQ0dqZ21RWWtBaUNnZ1djY21BaUFJSjZCUEFBaUFJSVVQd09CSUFmK0NOb3pcIiArXG4gIFwiQ0FBUUFSRFFRTHdCRUFFUTBFRDhCQ0FDSUtDQk9BTWdBaUNnZ1RnRUpBSWdvSUg0Q2tBRVFFQUQ4Um1RQ0lDQUJ1SWVBQkVBQVEzRVJTQWlcIiArXG4gIFwiQUFJYWlKdUFSQUFFTkJCWGdZa0FDR2dnWmdHSUFBaG9JSWFCaUFBSWFDQ21BWWtBQ0dnZ3hvR0pBQWhlL1RPUUIwQUU5U1pJc1FZQTRNQWZcIiArXG4gIFwiUVhzR0FRQWlBQUlhaURjQUlnQUNHb2lmQUVRQUJEUVFad0JFQUFRMEVJZUFSQUFFTkJCZkFZZ0FDR2dnUGdNU0FSRFFRTndESUFJZ29JRzRcIiArXG4gIFwiQ0VRRVFFQURjUk9RQ0lDQUJ1SXFNQkVBQVEzRUxBQVJBQUVOeERBUUVRQUJEY1EwSUJFQUFRM0VPREFSQU1HcmZ3YnlBSWlnM2dRcDFnQUFcIiArXG4gIFwiSFBnamFNOGdBRUFFUUVBRDhRWkFCRUJBQS9FVGdBaUFnQWJpRElBSWdJQUc0aENRQ0lDQUJ1SXJBQkVBQVEzRVowQWlBQUlhaUhzQVJBQUVcIiArXG4gIFwiTkJBWGdZZ0FDR2dnYmdJU0FSRFFRRndGSmdJZ29JR1lCZmhqR0VKVlY4b2g0UUdvNnNvQkV3TEFKZ0ZWZGVXQUNRRUFBQlFBek1wL2dOc0VcIiArXG4gIFwiMm03TzY2NGMwS0EzQUFCUUFERGVBTHdCS0c4QTR5ZUFud0RLVDRCeEJ1QU1RRGtER0llQURnR1ZROER4RmNCWEFPVXJ3UGdNNkRPZzhobHdcIiArXG4gIFwiM0FOd0QwQzVCekF1QXJrSXBGd0VHamNCM1FSVWJnS09xOEN1QWl0WGdjY3NnRmtBWlJaZ0RBTVpCbEtHZ2NZMG9HbEFaUnB3akFNYkIxYkdcIiArXG4gIFwiZ1VjZWdEeUErc3FCbVh4NUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dEMERKQXhoNUFQSUFsRHlBa1FjZ0QwREpBeGg1QVBJQWxEeUFrUWNnRDBESkF4aDVBUElBbER5QWtRY2dEMERKQXhoNUFQSUFcIiArXG4gIFwibER5QWtRY2dENkMrY21BbVh4NkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEVVBJQVJoNkFQQUFsRDJEa0FjZ0RVUElBUmg2QVBBQWxEMkRrQWNnRFVQSUFSaDZBUEFBbEQyRGtBY2dEVVBJQVJoNkFcIiArXG4gIFwiUEFBbEQyRGtBY2dEcUs4Y21NbVhCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQThnQ1VQSUNSQnlBUFFNa0RHSGtBOGdDVVBJQ1JcIiArXG4gIFwiQnlBUFFNa0RHSGtBOGdDVVBJQ1JCeUFQUU1rREdIa0E4Z0NVUElDUkJ5QVBRTWtER0hrQS93REI5OWVYTG40R09YQWYzeXpBNGtQWUZxQUdcIiArXG4gIFwiZ0d6T3dtd1RhTHNac0J0Q09hQkJBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5nQWtCQUFEV2pkRGFPV0JDQUFDQWRTTzBcIiArXG4gIFwiZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllFQUFBWU4wSXJaMERKZ1FBQUZnM1Ftdm5cIiArXG4gIFwiZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JBQURXamREYU9XQkNBQUNBZFNPMGRnNllcIiArXG4gIFwiRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wZGc2WUVBQUFZTjBJclowREpnUUFBRmczUW12bmdBa0JcIiArXG4gIFwiQUFEV2pkRGFPV0JDQUFDQWRTTzBkZzZZRUFBQVlOMElyWjBESmdRQUFGZzNRbXZuZ0FrQkFBRFdqZERhT1dCQ0FBQ0FkU08wOXJZQnQ5dDJcIiArXG4gIFwiNEFNaTFBQVFBTmdoSVBOMUF5Z0gvaGYyQnVBbndMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NHNkcxYzhDRUFBQUE2MFpvN1J3d0lRQUFcIiArXG4gIFwid0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JXanNIVEFnQUFMQnVoTmJPQVJNQ0FBQ3NcIiArXG4gIFwiRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFjOENFQUFBQTYwWm83Und3SVFBQXdMb1JcIiArXG4gIFwiV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hUQWdBQUxCdWhOYk9BUk1DQUFDc0c2RzFcIiArXG4gIFwiYzhDRUFBQUE2MFpvN1J3d0lRQUF3TG9SV2pzSFRBZ0FBTEJ1aE5iT0FSTUNBQUNzRzZHMWM4Q0VBQUFBNjBabzdSd3dJUUFBd0xvUldqc0hcIiArXG4gIFwiVEFnQUFMQnVoTmJlTnVCMmY3Yi9BZHU5TFVBTkFBRUFBQUFDYndEeEJ1QU5BQWo4QklpZkFINENBSUV6Z0RnRGNBWUFCQTRCNHhEUUlTQVFcIiArXG4gIFwiK0FvUVh3RjhCUUFDbndIak02RFBnRURnSGtEY0EzQVBBQWhjQklxTFFDNENBWUdiZ0hFVDBFMUFJSEFWT0s0Q3V3b01CR1lCWWhiQUxBQVFcIiArXG4gIFwiR0FhS1lTRERRRUJnR2pDbUFVMERBb0Z4NEJnSE5nNE1CUElBNUFISUE2Z0hRUTVrVXNnRGtBZFFiMFNKUUU4ZWdFUWdJQkFKOXVRQmlBUURcIiArXG4gIFwiQXBtQVR4NkFURUFnRUFyNjVBRUlCUVVDcWNCUEhvQlVZQ0FRQy83a0FZZ0ZCd0o3QVo0OEFIc0JnTUJpa0NjUHdHSVFJTEFaNk1rRHNCa0lcIiArXG4gIFwiQ0t3R2UvSUFyQVlEQXJzQm56d0F1d0dCd0hMUUp3L0FjbEFnc0IzNHlRT3dIUmdJckFkLzhnQ3NCd2VDWHhEa3dFaXVjV0Rqd01hQnJRY2ZcIiArXG4gIFwiNjhHdEJ3Y0M2OEhIZW5EcndZSEFldkN4SHR4NmNDQ3dIbnlzQjdjZUhBaXNCeC9yd2EwSEJ3THJ3Y2Q2Y092QmdjQjY4TEVlM0hwd0lMQWVcIiArXG4gIFwiZkt3SHR4NGNDS3dISCt2QnJRY0hBdXZCeDNwdzY4R0J3SHJ3c1I3Y2VuQWdzQjU4ckFlM0hod0lyQWNmNjhHdEJ3Y0M2OEhIZW5EcndZSEFcIiArXG4gIFwiT1BCWUQyNDllRDBJY21BbVh4NkFQSUI2SThvRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJcIiArXG4gIFwiQUlFOGdDY1BRQjRBRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUNCUElBbkQwQWVBQkRJQTNqeUFPUUJBSUU4Z0NjUFFCNEFcIiArXG4gIFwiRU1nRGVQSUE1QUVBZ1R5QUp3OUFIZ0FReUFONDhnRGtBUUJCRHN6a3l3TTQ4Q0MwWjVEQ1ovRFovZ2RvejRBR0hnQVFBUkRRd1BNR1FBUkFcIiArXG4gIFwiUUFQUFR3QWlBQUlhZU00QWlBQUlhT0E1QkNRQ0lLQ0I1eXNBRVFBQkRUeWZBWWtBQ0dqZ3VRZEFCRUJBQTg5RklDSUFBaHA0YmdJU0FSRFFcIiArXG4gIFwid0hNVm1BaUFnQWFlV1FBaUFBSWFlSWFCaUFBSWFPQ1pCaVFDSUtDQlp4eVlDSUFnbm9FOEFDSUFnaFEvQTRFZ0IvNEkyak1JQUJBQkVOQkFcIiArXG4gIFwidkFFUUFSRFFRUHdFSUFJZ29JRTRBeUFDSUtDQk9BUWtBaUNnZ2ZnS1FBUkFRQVB4R1pBSWdJQUc0aDRBRVFBQkRjUkZJQ0lBQWhxSW00QkVcIiArXG4gIFwiQUFRMEVGZUJpUUFJYUNCbUFZZ0FDR2dnaG9HSUFBaG9JS1lCaVFBSWFDREdnWWtBQ0Y3OU01QUhRQVQxSmtpeEJnRGd3QjlCZXdZQkFDSUFcIiArXG4gIFwiQWhxSU53QWlBQUlhaUo4QVJBQUVOQkJuQUVRQUJEUVFoNEJFQUFRMEVGOEJpQUFJYUNBK0F4SUJFTkJBM0FNZ0FpQ2dnYmdJUkFSQVFBTnhcIiArXG4gIFwiRTVBSWdJQUc0aW93RVFBQkRjUXNBQkVBQVEzRU1CQVJBQUVOeERRZ0VRQUJEY1E0TUJFQXdhdC9CdklBaUtEZUJDbldBQUFjK0NOb3p5QUFcIiArXG4gIFwiUUFSQVFBUHhCa0FFUUVBRDhST0FDSUNBQnVJTWdBaUFnQWJpRUpBSWdJQUc0aXNBRVFBQkRjUm5RQ0lBQWhxSWV3QkVBQVEwRUJlQmlBQUlcIiArXG4gIFwiYUNCdUFoSUJFTkJBWEFVbUFpQ2dnZnp4REg0QTF0bmR4Ykx5d2QwQUFBQUFTVVZPUks1Q1lJST1cIjtcblxuaW50ZXJmYWNlIE5vdGlmeVBheWxvYWQge1xuICB0aXRsZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIC8qKiBTb3VuZCB1c2VkIG9uIHRoZSBub24tV2luZG93cyBwYXRoIChgYXBpLmF0dGVudGlvbi5ub3RpZnlgKS4gKi9cbiAgc291bmQ6IFR1aUF0dGVudGlvblNvdW5kO1xufVxuXG4vKipcbiAqIE9wdGlvbmFsIGZvY3VzIGdhdGUgYXBwbGllZCBiZWZvcmUgZGlzcGF0Y2hpbmcgYSBub3RpZmljYXRpb24uIExldHMgdGhlIHVzZXIgb3B0IGludG9cbiAqIFwibm90aWZ5IG9ubHkgd2hlbiB0aGUgdGVybWluYWwgd2luZG93IGlzIHVuZm9jdXNlZFwiIHNvIG5vdGlmaWNhdGlvbnMgZG9uJ3QgZmlyZSB3aGlsZVxuICogdGhleSBhcmUgYWN0aXZlbHkgd2F0Y2hpbmcgdGhlIFRVSS5cbiAqXG4gKiBUaGUgZ2F0ZSBpcyBldmFsdWF0ZWQgb24gZXZlcnkgZGlzcGF0Y2ggKG5vdCBvbmNlIGF0IHNldHVwKSBiZWNhdXNlIHRoZSBkZWZlcnJlZFxuICogcGVybWlzc2lvbiBub3RpZmljYXRpb24gaXMgc2VudCBmcm9tIGEgdGltZXIgYW5kIHRoZSBjdXJyZW50IGZvY3VzIHN0YXRlIG11c3QgYmUgcmVhZFxuICogYXQgdGhhdCBtb21lbnQuXG4gKi9cbmV4cG9ydCB0eXBlIE5vdGlmeUdhdGUgPSB7XG4gIC8qKiBXaGVuIHRydWUsIHN1cHByZXNzIHRoZSBub3RpZmljYXRpb24gd2hpbGUgdGhlIHRlcm1pbmFsIGlzIGZvY3VzZWQuICovXG4gIG9ubHlXaGVuVW5mb2N1c2VkOiBib29sZWFuO1xuICAvKiogQ3VycmVudCB0ZXJtaW5hbCBmb2N1cyBzdGF0ZTsgYHVuZGVmaW5lZGAgd2hlbiB1bmtub3duIChlLmcuIHRoZSB0ZXJtaW5hbCBkb2VzIG5vdFxuICAgKiAgcmVwb3J0IGZvY3VzIGV2ZW50cyDigJQgV2luZG93cyBUZXJtaW5hbCBpcyBhIGtub3duIGNhc2UpLiBVbmtub3duIGZvY3VzIGRlZ3JhZGVzIHRvXG4gICAqICBkaXNwYXRjaGluZyBzbyBhbiBvcHRlZC1pbiBub3RpZmljYXRpb24gaXMgbmV2ZXIgc2lsZW50bHkgbG9zdC4gUmVhZCBsYXppbHkgb24gZWFjaFxuICAgKiAgZGlzcGF0Y2ggYmVjYXVzZSB0aGUgZGVmZXJyZWQgcGVybWlzc2lvbiBub3RpZmljYXRpb24gZmlyZXMgZnJvbSBhIHRpbWVyLiBNYXkgYmVcbiAgICogIGFzeW5jICh0aGUgV2luZG93cyBmYWxsYmFjayBxdWVyaWVzIHRoZSBmb3JlZ3JvdW5kIHdpbmRvdyB2aWEgUG93ZXJTaGVsbCkuICovXG4gIGZvY3VzZWQ6ICgpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+O1xufTtcblxuYXN5bmMgZnVuY3Rpb24gd2luZG93c05vdGlmeShwYXlsb2FkOiBOb3RpZnlQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIG5vZGUtbm90aWZpZXIgaXMgbWFya2VkIGV4dGVybmFsIGluIHRoZSBidWlsZCAocGFja2FnZS5qc29uKSBzbyBpdCByZXNvbHZlcyBmcm9tXG4gIC8vIG5vZGVfbW9kdWxlcyBhdCBydW50aW1lIHJhdGhlciB0aGFuIGJlaW5nIGJ1bmRsZWQuIE9uIFdpbmRvd3MgaXQgcG9zdHMgYSByZWFsXG4gIC8vIEFjdGlvbiBDZW50ZXIgdG9hc3QgdmlhIHRoZSBidW5kbGVkIFNub3JlVG9hc3QuZXhlLiBEeW5hbWljIGltcG9ydCBrZWVwcyB0aGVcbiAgLy8gbW9kdWxlIGxvYWQgZnJvbSBmYWlsaW5nIHRoZSB3aG9sZSBwbHVnaW4gaWYgbm9kZS1ub3RpZmllciBpcyB1bmF2YWlsYWJsZS5cbiAgaW1wb3J0KFwibm9kZS1ub3RpZmllclwiKVxuICAgIC50aGVuKGFzeW5jIChtb2QpID0+IHtcbiAgICAgIC8vIG5vZGUtbm90aWZpZXIncyBXaW5kb3dzIGJyYW5jaCBleHBlY3RzIGEgZmlsZSBwYXRoIChub3QgYSBkYXRhIFVSTCkgZm9yIGBpY29uYCxcbiAgICAgIC8vIHNvIGRlY29kZSB0aGUgZW1iZWRkZWQgUE5HIHRvIGEgdGVtcCBmaWxlIGZpcnN0LlxuICAgICAgbGV0IGljb25QYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHdyaXRlRmlsZSB9ID0gYXdhaXQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKTtcbiAgICAgICAgY29uc3Qgb3MgPSBhd2FpdCBpbXBvcnQoXCJub2RlOm9zXCIpO1xuICAgICAgICBjb25zdCBwYXRoID0gYXdhaXQgaW1wb3J0KFwibm9kZTpwYXRoXCIpO1xuICAgICAgICBpY29uUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYG9wZW5jb2RlLXB1bHNlLSR7cHJvY2Vzcy5waWR9LSR7RGF0ZS5ub3coKX0ucG5nYCk7XG4gICAgICAgIGF3YWl0IHdyaXRlRmlsZShpY29uUGF0aCwgQnVmZmVyLmZyb20oT1BFTkNPREVfSUNPTl9QTkdfQjY0LCBcImJhc2U2NFwiKSk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gYmVzdC1lZmZvcnQ7IGZhbGwgYmFjayB0byBubyBpY29uIGlmIHRoZSB0ZW1wIGZpbGUgY291bGQgbm90IGJlIHdyaXR0ZW5cbiAgICAgICAgaWNvblBhdGggPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vdGlmaWVyID0gKG1vZCBhcyB7IGRlZmF1bHQ/OiB1bmtub3duIH0pLmRlZmF1bHQgPz8gbW9kO1xuICAgICAgKG5vdGlmaWVyIGFzIHsgbm90aWZ5OiAob3B0czogdW5rbm93biwgY2I6IChlcnI6IEVycm9yIHwgbnVsbCwgcmVzcG9uc2U6IHN0cmluZykgPT4gdm9pZCkgPT4gdm9pZCB9KS5ub3RpZnkoXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgICAgICBtZXNzYWdlOiBwYXlsb2FkLm1lc3NhZ2UsXG4gICAgICAgICAgYXBwSUQ6IFdJTkRPV1NfQVBQX0lELFxuICAgICAgICAgIC4uLihpY29uUGF0aCA/IHsgaWNvbjogaWNvblBhdGggfSA6IHt9KSxcbiAgICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIGJlc3QtZWZmb3J0OyByZW1vdmUgdGhlIHRlbXAgaWNvbiBmaWxlIG9uY2UgdGhlIHRvYXN0IGlzIGRpc3BhdGNoZWRcbiAgICAgICAgICBpZiAoaWNvblBhdGgpIHtcbiAgICAgICAgICAgIHZvaWQgaW1wb3J0KFwibm9kZTpmcy9wcm9taXNlc1wiKVxuICAgICAgICAgICAgICAudGhlbigoeyB1bmxpbmsgfSkgPT4gdW5saW5rKGljb25QYXRoKSlcbiAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pXG4gICAgLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIGJlc3QtZWZmb3J0XG4gICAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWx0aW5Ob3RpZnkoYXBpOiBBcGksIHBheWxvYWQ6IE5vdGlmeVBheWxvYWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcGkuYXR0ZW50aW9uLm5vdGlmeSh7XG4gICAgICB0aXRsZTogcGF5bG9hZC50aXRsZSxcbiAgICAgIG1lc3NhZ2U6IHBheWxvYWQubWVzc2FnZSxcbiAgICAgIG5vdGlmaWNhdGlvbjogeyB3aGVuOiBcImFsd2F5c1wiIH0sXG4gICAgICBzb3VuZDogcGF5bG9hZC5zb3VuZCxcbiAgICB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gYmVzdC1lZmZvcnQ7IGEgZmFpbGVkIG5vdGlmaWNhdGlvbiBtdXN0IG5ldmVyIGJyZWFrIHRoZSBwbHVnaW5cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBkaXNwYXRjaChhcGk6IEFwaSwgcGF5bG9hZDogTm90aWZ5UGF5bG9hZCwgZ2F0ZT86IE5vdGlmeUdhdGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGdhdGU/Lm9ubHlXaGVuVW5mb2N1c2VkICYmIChhd2FpdCBnYXRlLmZvY3VzZWQoKSkgPT09IHRydWUpIHtcbiAgICAvLyBUZXJtaW5hbCBpcyBmb2N1c2VkIC0+IHRoZSB1c2VyIGlzIHdhdGNoaW5nLCBzdXBwcmVzcyB0aGUgbm90aWZpY2F0aW9uLlxuICAgIC8vIFVua25vd24gZm9jdXMgKG5vIGZvY3VzIGV2ZW50cywgZS5nLiBXaW5kb3dzIFRlcm1pbmFsKSBzdGlsbCBkaXNwYXRjaGVzLlxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoSVNfV0lORE9XUykge1xuICAgIGF3YWl0IHdpbmRvd3NOb3RpZnkocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgYnVpbHRpbk5vdGlmeShhcGksIHBheWxvYWQpO1xuICB9XG59XG5cbi8qKiBOb3RpZnkgdGhhdCBhIGJhdGNoIG9mIHN1YmFnZW50cyBmaW5pc2hlZC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3RpZnlTdWJhZ2VudHNEb25lKGFwaTogQXBpLCBjb3VudDogbnVtYmVyLCBnYXRlPzogTm90aWZ5R2F0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6IGNvdW50ID4gMSA/IGDlhajpg6ggJHtjb3VudH0g5Liq5a2QIGFnZW50IOW3suWujOaIkGAgOiBcIuWtkCBhZ2VudCDlt7LlrozmiJBcIixcbiAgICAgIHNvdW5kOiB7IG5hbWU6IFwic3ViYWdlbnRfZG9uZVwiIH0sXG4gICAgfSxcbiAgICBnYXRlLFxuICApO1xufVxuXG4vKiogTm90aWZ5IHRoYXQgdGhlIGN1cnJlbnQgdHVybiAobWFpbi1hZ2VudCByb3VuZCkgaGFzIGZpbmlzaGVkLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeVR1cm5Eb25lKGFwaTogQXBpLCBnYXRlPzogTm90aWZ5R2F0ZSk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBkaXNwYXRjaChcbiAgICBhcGksXG4gICAge1xuICAgICAgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIixcbiAgICAgIG1lc3NhZ2U6IFwi5pys6L2u5a+56K+d5bey5a6M5oiQXCIsXG4gICAgICBzb3VuZDogeyBuYW1lOiBcImRvbmVcIiB9LFxuICAgIH0sXG4gICAgZ2F0ZSxcbiAgKTtcbn1cblxuLyoqIFdoYXQga2luZCBvZiB1c2VyIGludGVyYWN0aW9uIGlzIGJsb2NraW5nIHRoZSBtYWluIHNlc3Npb24uICovXG5leHBvcnQgdHlwZSBJbnRlcnZpZXdLaW5kID0gXCJxdWVzdGlvblwiIHwgXCJwZXJtaXNzaW9uXCI7XG5cbi8qKlxuICogTm90aWZ5IHRoYXQgdGhlIG1haW4gc2Vzc2lvbiBpcyBibG9ja2VkIHdhaXRpbmcgZm9yIHVzZXIgaW5wdXQgKGFuIGludGVydmlldzpcbiAqIHRoZSBgcXVlc3Rpb25gIHRvb2wgYXNraW5nIHRoZSB1c2VyIHNvbWV0aGluZywgb3IgYSBwZXJtaXNzaW9uL2FwcHJvdmFsIHByb21wdCkuXG4gKiBUaGVzZSBhcmUgdGhlIHR3byB3YXlzIGFuIGFnZW50IHR1cm4gaXMgc3VzcGVuZGVkIG1pZC1ydW4gb24gdXNlciBpbnRlcmFjdGlvbi5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5vdGlmeUludGVydmlld0lucHV0KGFwaTogQXBpLCBraW5kOiBJbnRlcnZpZXdLaW5kLCBkZXRhaWw/OiBzdHJpbmcsIGdhdGU/OiBOb3RpZnlHYXRlKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGRpc3BhdGNoKFxuICAgIGFwaSxcbiAgICB7XG4gICAgICB0aXRsZTogXCJvcGVuY29kZS1hZ2VudC1wdWxzZVwiLFxuICAgICAgbWVzc2FnZTpcbiAgICAgICAga2luZCA9PT0gXCJwZXJtaXNzaW9uXCJcbiAgICAgICAgICA/IGRldGFpbFxuICAgICAgICAgICAgPyBg6ZyA6KaB5p2D6ZmQ56Gu6K6kOiAke2RldGFpbH1gXG4gICAgICAgICAgICA6IFwi5Li75Lya6K+d6ZyA6KaB5p2D6ZmQ56Gu6K6kXCJcbiAgICAgICAgICA6IGRldGFpbFxuICAgICAgICAgICAgPyBg6ZyA6KaB5Zue562UOiAke2RldGFpbH1gXG4gICAgICAgICAgICA6IFwi5Li75Lya6K+d6ZyA6KaB5Zue562U6K+i6ZeuXCIsXG4gICAgICBzb3VuZDoga2luZCA9PT0gXCJwZXJtaXNzaW9uXCIgPyB7IG5hbWU6IFwicGVybWlzc2lvblwiIH0gOiB7IG5hbWU6IFwicXVlc3Rpb25cIiB9LFxuICAgIH0sXG4gICAgZ2F0ZSxcbiAgKTtcbn1cblxuLyoqIEluLWFwcCB0b2FzdCBmYWxsYmFjayAod29ya3Mgb24gZXZlcnkgcGxhdGZvcm0pLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvYXN0KGFwaTogQXBpLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgdHJ5IHtcbiAgICBhcGkudWkudG9hc3QoeyB2YXJpYW50OiBcImluZm9cIiwgdGl0bGU6IFwib3BlbmNvZGUtYWdlbnQtcHVsc2VcIiwgbWVzc2FnZSB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gYmVzdC1lZmZvcnRcbiAgfVxufVxuXG4vKiogVHJ1ZSB3aGVuIHJ1bm5pbmcgb24gV2luZG93cyAodXNlZCB0byBkZWNpZGUgdGhlIGRlbGl2ZXJ5IHBhdGgpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV2luZG93cygpOiBib29sZWFuIHtcbiAgcmV0dXJuIElTX1dJTkRPV1M7XG59XG4iLCIvKipcbiAqIFdpbmRvd3Mtb25seSBsaXZlIHRlcm1pbmFsIGZvY3VzIGRldGVjdGlvbi5cbiAqXG4gKiBCYWNrZ3JvdW5kOiBvbiBXaW5kb3dzIHRoZSByZW5kZXJlcidzIGZvY3VzL2JsdXIgZXZlbnRzIChERUMgMTAwNCBmb2N1cyByZXBvcnRpbmcgdmlhXG4gKiBDb25QVFkpIGFyZSB1bnJlbGlhYmxlIOKAlCB0aGUgZm9jdXMtaW4gc2VxdWVuY2UgbWF5IGFycml2ZSBhdCBzdGFydHVwIHdoaWxlIHRoZVxuICogZm9jdXMtb3V0IG5ldmVyIGRvZXMsIHdoaWNoIGxlYXZlcyB0aGUgcGx1Z2luIHN0dWNrIGJlbGlldmluZyB0aGUgdGVybWluYWwgaXMgZm9jdXNlZFxuICogYW5kIHN1cHByZXNzaW5nIGV2ZXJ5IG5vdGlmaWNhdGlvbi4gV2UgdGhlcmVmb3JlIGJ5cGFzcyB0aGUgZXZlbnQgc3RyZWFtIG9uIFdpbmRvd3NcbiAqIGFuZCBxdWVyeSB0aGUgZm9yZWdyb3VuZCB3aW5kb3cgZGlyZWN0bHk6XG4gKlxuICogICAtIFRoZSB3aW5kb3cgb2YgdGhlIHRlcm1pbmFsIGhvc3RpbmcgdGhpcyBwbHVnaW4gYmVsb25ncyB0byBhIHByb2Nlc3MgdGhhdCBpcyBhblxuICogICAgIGFuY2VzdG9yIG9mIG91ciBvd24gcHJvY2VzcyAoZS5nLiBXaW5kb3dzIFRlcm1pbmFsIC0+IHNoZWxsIC0+IG9wZW5jb2RlKS5cbiAqICAgLSBXaGVuIHRoYXQgdGVybWluYWwgaXMgZm9jdXNlZCwgdGhlIGZvcmVncm91bmQgd2luZG93J3Mgb3duaW5nIFBJRCBpcyBpbiBvdXJcbiAqICAgICBhbmNlc3RvciBjaGFpbi5cbiAqICAgLSBXaGVuIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYXBwLCB0aGUgZm9yZWdyb3VuZCBQSUQgaXMgbm90IGFuIGFuY2VzdG9yLlxuICpcbiAqIFR3byBiYWNrZW5kcyBhcmUgdXNlZDpcbiAqICAgLSBgYnVuOmZmaWAgKGZhc3QsIHN5bmNocm9ub3VzKSB3aGVuIHRoZSBydW50aW1lIHN1cHBvcnRzIGl0IOKAlCB2ZXJpZmllZCB3b3JraW5nIGluXG4gKiAgICAgc3RhbmRhbG9uZSBCdW4tY29tcGlsZWQgYmluYXJpZXMuXG4gKiAgIC0gUG93ZXJTaGVsbCAoYEdldEZvcmVncm91bmRXaW5kb3dgIC8gYFdpbjMyX1Byb2Nlc3NgKSBhcyBhIHBvcnRhYmxlIGZhbGxiYWNrIHRoYXRcbiAqICAgICB3b3JrcyBpbiBhbnkgcnVudGltZSAoTm9kZSBvciBCdW4pIHNpbmNlIGl0IG9ubHkgbmVlZHMgYG5vZGU6Y2hpbGRfcHJvY2Vzc2AuXG4gKlxuICogSWYgbmVpdGhlciBiYWNrZW5kIGlzIGF2YWlsYWJsZSB0aGUgbW9kdWxlIGRlZ3JhZGVzIHRvIFwidW5rbm93blwiIGFuZCB0aGUgY2FsbGVyIGZhbGxzXG4gKiBiYWNrIHRvIHRoZSByZW5kZXJlciBldmVudCBzdGF0ZS5cbiAqL1xuXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJub2RlOmNoaWxkX3Byb2Nlc3NcIjtcblxuY29uc3QgSVNfV0lORE9XUyA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuLy8gNTY4IGJ5dGVzID0gc2l6ZW9mKFBST0NFU1NFTlRSWTMyVykgb24geDY0IChVTE9OR19QVFIgZmllbGQgZm9yY2VzIDgtYnl0ZSBhbGlnbm1lbnQpLlxuLy8gV3JvbmcgZHdTaXplIG1ha2VzIFByb2Nlc3MzMkZpcnN0VyBmYWlsIHdpdGggRVJST1JfQkFEX0xFTkdUSCwgd2hpY2ggd2UgdHJlYXQgYXNcbi8vIFwidW5rbm93blwiIGFuZCBmYWxsIGJhY2sgZ3JhY2VmdWxseS5cbmNvbnN0IFBST0NFU1NFTlRSWTMyV19TSVpFID0gNTY4O1xuY29uc3QgT0ZGU0VUX1RIMzJfUFJPQ0VTU19JRCA9IDg7XG5jb25zdCBPRkZTRVRfVEgzMl9QQVJFTlRfUFJPQ0VTU19JRCA9IDMyO1xuXG50eXBlIEJhY2tlbmQgPSBcImZmaVwiIHwgXCJwb3dlcnNoZWxsXCIgfCBcIm5vbmVcIjtcblxubGV0IGJhY2tlbmQ6IEJhY2tlbmQgPSBcIm5vbmVcIjtcbmxldCBhbmNlc3RvcnMgPSBuZXcgU2V0PG51bWJlcj4oKTtcbmxldCBmZmlGb3JlZ3JvdW5kUGlkOiAoKCkgPT4gbnVtYmVyIHwgdW5kZWZpbmVkKSB8IHVuZGVmaW5lZDtcblxuLy8gTGl2ZSBzdGF0dXMgc3VyZmFjZSwgcmVuZGVyZWQgaW50byB0aGUgc2lkZWJhciBmb3IgZGVidWdnaW5nIHRoZSBmb2N1cyBnYXRlLlxuZXhwb3J0IHR5cGUgRm9jdXNTdGF0dXMgPSB7XG4gIGJhY2tlbmQ6IEJhY2tlbmQ7XG4gIGFuY2VzdG9yQ291bnQ6IG51bWJlcjtcbiAgbGFzdEZvcmVncm91bmRQaWQ/OiBudW1iZXI7XG4gIGxhc3RSZXN1bHQ/OiBib29sZWFuO1xuICBsYXN0RXJyb3I/OiBzdHJpbmc7XG59O1xubGV0IHN0YXR1czogRm9jdXNTdGF0dXMgPSB7IGJhY2tlbmQ6IFwibm9uZVwiLCBhbmNlc3RvckNvdW50OiAwIH07XG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9jdXNTdGF0dXMoKTogRm9jdXNTdGF0dXMge1xuICByZXR1cm4gc3RhdHVzO1xufVxuXG5mdW5jdGlvbiBydW5Qb3dlclNoZWxsKHNjcmlwdDogc3RyaW5nLCB0aW1lb3V0TXMgPSA4MDAwKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IG91dCA9IFwiXCI7XG4gICAgbGV0IGNoaWxkO1xuICAgIHRyeSB7XG4gICAgICBjaGlsZCA9IHNwYXduKFwicG93ZXJzaGVsbC5leGVcIiwgW1wiLU5vUHJvZmlsZVwiLCBcIi1Ob25JbnRlcmFjdGl2ZVwiLCBcIi1Db21tYW5kXCIsIHNjcmlwdF0sIHtcbiAgICAgICAgd2luZG93c0hpZGU6IHRydWUsXG4gICAgICAgIHN0ZGlvOiBbXCJpZ25vcmVcIiwgXCJwaXBlXCIsIFwicGlwZVwiXSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNoaWxkLmtpbGwoKTtcbiAgICAgIH0gY2F0Y2gge31cbiAgICAgIHJlc29sdmUoXCJcIik7XG4gICAgfSwgdGltZW91dE1zKTtcbiAgICBjaGlsZC5zdGRvdXQ/Lm9uKFwiZGF0YVwiLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xuICAgICAgb3V0ICs9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgfSk7XG4gICAgY2hpbGQub24oXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgcmVzb2x2ZShcIlwiKTtcbiAgICB9KTtcbiAgICBjaGlsZC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICByZXNvbHZlKG91dC50cmltKCkpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqIENvbXB1dGUgb3VyIGFuY2VzdG9yIFBJRCBjaGFpbiB2aWEgUG93ZXJTaGVsbCAoV2luMzJfUHJvY2VzcyBwYXJlbnQgd2FsaykuICovXG5hc3luYyBmdW5jdGlvbiBhbmNlc3RvcnNWaWFQb3dlclNoZWxsKCk6IFByb21pc2U8U2V0PG51bWJlcj4+IHtcbiAgY29uc3Qgc2VsZlBpZCA9IHByb2Nlc3MucGlkO1xuICBjb25zdCBzY3JpcHQgPSBgXG4kRXJyb3JBY3Rpb25QcmVmZXJlbmNlID0gJ1NpbGVudGx5Q29udGludWUnXG4kcGlkQ2hhaW4gPSBAKCR7c2VsZlBpZH0pXG4kY3VyID0gJHtzZWxmUGlkfVxuZm9yICgkaSA9IDA7ICRpIC1sdCAzMiAtYW5kICRjdXIgLWd0IDA7ICRpKyspIHtcbiAgJHAgPSBHZXQtQ2ltSW5zdGFuY2UgV2luMzJfUHJvY2VzcyAtRmlsdGVyIFwiUHJvY2Vzc0lkPSRjdXJcIlxuICBpZiAoLW5vdCAkcCkgeyBicmVhayB9XG4gICRuZXh0ID0gJHAuUGFyZW50UHJvY2Vzc0lkXG4gIGlmICgkbmV4dCAtZXEgJGN1ciAtb3IgJG5leHQgLWxlIDApIHsgYnJlYWsgfVxuICAkY3VyID0gJG5leHRcbiAgJHBpZENoYWluICs9ICRjdXJcbn1cbiRwaWRDaGFpbiAtam9pbiAnLCdcbmA7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJ1blBvd2VyU2hlbGwoc2NyaXB0KTtcbiAgY29uc3QgcGlkcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICBmb3IgKGNvbnN0IHBhcnQgb2YgcmVzdWx0LnNwbGl0KFwiLFwiKSkge1xuICAgIGNvbnN0IG4gPSBwYXJzZUludChwYXJ0LCAxMCk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCkgcGlkcy5hZGQobik7XG4gIH1cbiAgcmV0dXJuIHBpZHM7XG59XG5cbi8qKiBGb3JlZ3JvdW5kIHdpbmRvdyBvd25pbmcgUElEIHZpYSBQb3dlclNoZWxsICh1c2VyMzIgR2V0Rm9yZWdyb3VuZFdpbmRvdykuICovXG5hc3luYyBmdW5jdGlvbiBmb3JlZ3JvdW5kUGlkVmlhUG93ZXJTaGVsbCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCBzY3JpcHQgPSBgXG5BZGQtVHlwZSAtVHlwZURlZmluaXRpb24gQCdcbnVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5SdW50aW1lLkludGVyb3BTZXJ2aWNlcztcbnB1YmxpYyBzdGF0aWMgY2xhc3MgUHVsc2VGb2N1cyB7XG4gIFtEbGxJbXBvcnQoXCJ1c2VyMzIuZGxsXCIpXVxuICBwdWJsaWMgc3RhdGljIGV4dGVybiBJbnRQdHIgR2V0Rm9yZWdyb3VuZFdpbmRvdygpO1xuICBbRGxsSW1wb3J0KFwidXNlcjMyLmRsbFwiKV1cbiAgcHVibGljIHN0YXRpYyBleHRlcm4gdWludCBHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoSW50UHRyIGhXbmQsIG91dCB1aW50IGxwZHdQcm9jZXNzSWQpO1xufVxuJ0BcbiRoID0gW1B1bHNlRm9jdXNdOjpHZXRGb3JlZ3JvdW5kV2luZG93KClcbiRwID0gW3VpbnQzMl0wXG5bdm9pZF1bUHVsc2VGb2N1c106OkdldFdpbmRvd1RocmVhZFByb2Nlc3NJZCgkaCwgW3JlZl0kcClcbiRwXG5gO1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBydW5Qb3dlclNoZWxsKHNjcmlwdCk7XG4gIGNvbnN0IG4gPSBwYXJzZUludChyZXN1bHQsIDEwKTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCA/IG4gOiB1bmRlZmluZWQ7XG59XG5cbi8qKiBUcnkgdGhlIGZhc3QgYnVuOmZmaSBiYWNrZW5kLiBSZXR1cm5zIHRydWUgd2hlbiBmdWxseSBpbml0aWFsaXplZC4gKi9cbmFzeW5jIGZ1bmN0aW9uIGluaXRGZmlCYWNrZW5kKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZGxvcGVuLCBwdHIgfSA9IGF3YWl0IGltcG9ydChcImJ1bjpmZmlcIik7XG4gICAgY29uc3QgdXNlcjMyID0gZGxvcGVuKFwidXNlcjMyLmRsbFwiLCB7XG4gICAgICBHZXRGb3JlZ3JvdW5kV2luZG93OiB7IGFyZ3M6IFtdLCByZXR1cm5zOiBcInB0clwiIH0sXG4gICAgICBHZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQ6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcInUzMlwiIH0sXG4gICAgfSk7XG4gICAgY29uc3Qga2VybmVsMzIgPSBkbG9wZW4oXCJrZXJuZWwzMi5kbGxcIiwge1xuICAgICAgR2V0Q3VycmVudFByb2Nlc3NJZDogeyBhcmdzOiBbXSwgcmV0dXJuczogXCJ1MzJcIiB9LFxuICAgICAgQ3JlYXRlVG9vbGhlbHAzMlNuYXBzaG90OiB7IGFyZ3M6IFtcInUzMlwiLCBcInUzMlwiXSwgcmV0dXJuczogXCJwdHJcIiB9LFxuICAgICAgUHJvY2VzczMyRmlyc3RXOiB7IGFyZ3M6IFtcInB0clwiLCBcInB0clwiXSwgcmV0dXJuczogXCJpMzJcIiB9LFxuICAgICAgUHJvY2VzczMyTmV4dFc6IHsgYXJnczogW1wicHRyXCIsIFwicHRyXCJdLCByZXR1cm5zOiBcImkzMlwiIH0sXG4gICAgICBDbG9zZUhhbmRsZTogeyBhcmdzOiBbXCJwdHJcIl0sIHJldHVybnM6IFwiaTMyXCIgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IFRIMzJDU19TTkFQUFJPQ0VTUyA9IDB4MjtcbiAgICBjb25zdCBzbmFwc2hvdCA9IGtlcm5lbDMyLnN5bWJvbHMuQ3JlYXRlVG9vbGhlbHAzMlNuYXBzaG90KFRIMzJDU19TTkFQUFJPQ0VTUywgMCk7XG4gICAgaWYgKCFzbmFwc2hvdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgZW50cnkgPSBuZXcgVWludDhBcnJheShQUk9DRVNTRU5UUlkzMldfU0laRSk7XG4gICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGVudHJ5LmJ1ZmZlcik7XG4gICAgICB2aWV3LnNldFVpbnQzMigwLCBQUk9DRVNTRU5UUlkzMldfU0laRSwgdHJ1ZSk7IC8vIGR3U2l6ZVxuXG4gICAgICBjb25zdCBwYXJlbnQgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuICAgICAgbGV0IG9rID0ga2VybmVsMzIuc3ltYm9scy5Qcm9jZXNzMzJGaXJzdFcoc25hcHNob3QsIHB0cihlbnRyeSkpO1xuICAgICAgd2hpbGUgKG9rKSB7XG4gICAgICAgIGNvbnN0IHBpZCA9IHZpZXcuZ2V0VWludDMyKE9GRlNFVF9USDMyX1BST0NFU1NfSUQsIHRydWUpO1xuICAgICAgICBjb25zdCBwcGlkID0gdmlldy5nZXRVaW50MzIoT0ZGU0VUX1RIMzJfUEFSRU5UX1BST0NFU1NfSUQsIHRydWUpO1xuICAgICAgICBpZiAocGlkICE9PSAwKSBwYXJlbnQuc2V0KHBpZCwgcHBpZCk7XG4gICAgICAgIG9rID0ga2VybmVsMzIuc3ltYm9scy5Qcm9jZXNzMzJOZXh0VyhzbmFwc2hvdCwgcHRyKGVudHJ5KSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbGYgPSBrZXJuZWwzMi5zeW1ib2xzLkdldEN1cnJlbnRQcm9jZXNzSWQoKTtcbiAgICAgIGxldCBjdXJyZW50ID0gc2VsZjtcbiAgICAgIGZvciAobGV0IGRlcHRoID0gMDsgZGVwdGggPCAzMiAmJiBjdXJyZW50OyBkZXB0aCsrKSB7XG4gICAgICAgIGFuY2VzdG9ycy5hZGQoY3VycmVudCk7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwYXJlbnQuZ2V0KGN1cnJlbnQpO1xuICAgICAgICBpZiAobmV4dCA9PT0gdW5kZWZpbmVkIHx8IG5leHQgPT09IGN1cnJlbnQpIGJyZWFrO1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAga2VybmVsMzIuc3ltYm9scy5DbG9zZUhhbmRsZShzbmFwc2hvdCk7XG4gICAgfVxuXG4gICAgZmZpRm9yZWdyb3VuZFBpZCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGh3bmQgPSB1c2VyMzIuc3ltYm9scy5HZXRGb3JlZ3JvdW5kV2luZG93KCk7XG4gICAgICBpZiAoIWh3bmQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBwaWRCdWYgPSBuZXcgVWludDMyQXJyYXkoMSk7XG4gICAgICB1c2VyMzIuc3ltYm9scy5HZXRXaW5kb3dUaHJlYWRQcm9jZXNzSWQoaHduZCwgcHRyKHBpZEJ1ZikpO1xuICAgICAgcmV0dXJuIHBpZEJ1ZlswXTtcbiAgICB9O1xuXG4gICAgc3RhdHVzID0geyBiYWNrZW5kOiBcImZmaVwiLCBhbmNlc3RvckNvdW50OiBhbmNlc3RvcnMuc2l6ZSB9O1xuICAgIHJldHVybiBhbmNlc3RvcnMuc2l6ZSA+IDA7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RFcnJvcjogU3RyaW5nKGVycm9yKSB9O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5sZXQgaW5pdFByb21pc2U6IFByb21pc2U8dm9pZD4gfCB1bmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlV2luZG93c0ZvY3VzSW5pdCgpOiB2b2lkIHtcbiAgaWYgKCFJU19XSU5ET1dTKSByZXR1cm47XG4gIGluaXRQcm9taXNlID8/PSAoYXN5bmMgKCkgPT4ge1xuICAgIGlmIChhd2FpdCBpbml0RmZpQmFja2VuZCgpKSB7XG4gICAgICBiYWNrZW5kID0gXCJmZmlcIjtcbiAgICAgIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBiYWNrZW5kOiBcImZmaVwiIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGFuY2VzdG9ycyA9IGF3YWl0IGFuY2VzdG9yc1ZpYVBvd2VyU2hlbGwoKTtcbiAgICBpZiAoYW5jZXN0b3JzLnNpemUgPiAwKSB7XG4gICAgICBiYWNrZW5kID0gXCJwb3dlcnNoZWxsXCI7XG4gICAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwicG93ZXJzaGVsbFwiLCBhbmNlc3RvckNvdW50OiBhbmNlc3RvcnMuc2l6ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZW5kID0gXCJub25lXCI7XG4gICAgICBzdGF0dXMgPSB7IGJhY2tlbmQ6IFwibm9uZVwiLCBhbmNlc3RvckNvdW50OiAwLCBsYXN0RXJyb3I6IFwibm8gYW5jZXN0b3IgY2hhaW5cIiB9O1xuICAgIH1cbiAgfSkoKTtcbiAgdm9pZCBpbml0UHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gdGhlIHRlcm1pbmFsIHdpbmRvdyBjdXJyZW50bHkgaGFzIGZvY3VzLCBmYWxzZSB3aGVuIHRoZSBmb3JlZ3JvdW5kIHdpbmRvd1xuICogYmVsb25ncyB0byBhIGRpZmZlcmVudCBwcm9jZXNzLCB1bmRlZmluZWQgd2hlbiB0aGUgY2hlY2sgaXMgdW5hdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc1Rlcm1pbmFsRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4gfCB1bmRlZmluZWQ+IHtcbiAgaWYgKCFJU19XSU5ET1dTIHx8IGJhY2tlbmQgPT09IFwibm9uZVwiKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoYmFja2VuZCA9PT0gXCJmZmlcIiAmJiBmZmlGb3JlZ3JvdW5kUGlkKSB7XG4gICAgY29uc3QgZm9yZWdyb3VuZCA9IGZmaUZvcmVncm91bmRQaWQoKTtcbiAgICBjb25zdCByZXN1bHQgPSBmb3JlZ3JvdW5kICE9PSB1bmRlZmluZWQgPyBhbmNlc3RvcnMuaGFzKGZvcmVncm91bmQpIDogdW5kZWZpbmVkO1xuICAgIHN0YXR1cyA9IHsgLi4uc3RhdHVzLCBsYXN0Rm9yZWdyb3VuZFBpZDogZm9yZWdyb3VuZCwgbGFzdFJlc3VsdDogcmVzdWx0IH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBjb25zdCBmb3JlZ3JvdW5kID0gYXdhaXQgZm9yZWdyb3VuZFBpZFZpYVBvd2VyU2hlbGwoKTtcbiAgY29uc3QgcmVzdWx0ID0gZm9yZWdyb3VuZCAhPT0gdW5kZWZpbmVkID8gYW5jZXN0b3JzLmhhcyhmb3JlZ3JvdW5kKSA6IHVuZGVmaW5lZDtcbiAgc3RhdHVzID0geyAuLi5zdGF0dXMsIGxhc3RGb3JlZ3JvdW5kUGlkOiBmb3JlZ3JvdW5kLCBsYXN0UmVzdWx0OiByZXN1bHQgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7QUFFQTs7O0FDbUJBLElBQU0sYUFBYSxRQUFRLGFBQWE7QUFJeEMsSUFBTSxpQkFBaUI7QUFPdkIsSUFBTSx3QkFDSixxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQSxxRkFDQTtBQTZCRixlQUFlLGFBQWEsQ0FBQyxTQUF1QztBQUFBLEVBSzNELHdCQUNKLEtBQUssT0FBTyxRQUFRO0FBQUEsSUFHbkIsSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLE1BQ0YsUUFBUSxjQUFjLE1BQWE7QUFBQSxNQUNuQyxNQUFNLEtBQUssTUFBYTtBQUFBLE1BQ3hCLE1BQU0sT0FBTyxNQUFhO0FBQUEsTUFDMUIsV0FBVyxLQUFLLEtBQUssR0FBRyxPQUFPLEdBQUcsa0JBQWtCLFFBQVEs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TSxTQUFTLFdBQVcsRUFBRSxVQUFVLENBQUM7QUFBQTtBQUFBLFlBRS9DLEdBQ0E7QUFBQSxjQUNFLEtBQUssRUFBRSxJQUFJLFlBQVksR0FBRyxDQUFDLEdBQUUsQ0FBQztBQUFBLGNBQzlCLEtBQUssRUFBRSxJQUFJLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQztBQUFBLGNBQzNDLEtBQUssRUFBRSxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7QUFBQSxjQUM3QyxLQUFLLEVBQUUsSUFBSSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksZUFBZSxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUM7QUFBQSxZQUMxRSxDQUNGO0FBQUEsV0FDRDtBQUFBLFVBRUQsT0FBTyxJQUFJLEVBQUUsT0FBTyxRQUFRLGVBQWUsU0FBUyxHQUFHLENBQUMsUUFBUSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFBQTtBQUFBLE1BRTFGO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFFTDtBQUVBLElBQWU7IiwiZGVidWdJZCI6IjA3QkUxRTdBMjAxMDFERDc2NDc1NkUyMTY0NzU2RTIxIiwibmFtZXMiOltdfQ==
