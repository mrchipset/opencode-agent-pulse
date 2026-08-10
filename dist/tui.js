// src/tui.ts
import { createElement, insert, setProp } from "@opentui/solid";
import { createSignal } from "solid-js";
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
  tui: async (api, _options, _meta) => {
    const running = new Map;
    const [runningEntries, setRunningEntries] = createSignal([]);
    const [collapsed, setCollapsed] = createSignal(false);
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
      const info = running.get(event.properties.sessionID);
      if (!info)
        return;
      const type = event.properties.status.type;
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
          return box({ width: "100%", flexDirection: "column" }, [header, ...rows]);
        }
      }
    });
  }
};
var tui_default = plugin;
export {
  tui_default as default
};
