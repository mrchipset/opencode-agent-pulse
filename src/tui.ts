import type { TuiPluginModule } from "@opencode-ai/plugin/tui";
import type { Session, ToolPart } from "@opencode-ai/sdk/v2";
import { createElement, insert, setProp } from "@opentui/solid";
import type { JSX } from "@opentui/solid";
import { createSignal } from "solid-js";
import { notifyInterviewInput, notifySubagentsDone, notifyTurnDone } from "./notification";

/**
 * Sidebar widget that live-tracks running subagents (sub-sessions).
 *
 * Data source (session events + task tool parts):
 *   - `session.created`         -> identify sub-sessions via `properties.info.parentID`
 *   - `session.updated`         -> backfill: resumed/existing sub-sessions never emit
 *                                   `session.created`, but `Session.patch` publishes
 *                                   `session.updated` with the full Session (parentID +
 *                                   agent + title) whenever the session is touched
 *                                   (e.g. on message activity). Used to add missing
 *                                   entries and refresh agent/title without resetting
 *                                   status or timers.
 *   - `session.status`          -> `properties.status.type` ("busy" | "idle" | "retry")
 *   - `message.part.updated`    -> task tool part (`part.tool === "task"`) reports
 *                                   sub-session lifecycle: `part.state.status` is
 *                                   "running" (mark busy) or "completed"/"error"
 *                                   (mark done). Child session is linked via metadata
 *                                   `sessionId`/`sessionID` (state.metadata first,
 *                                   then part.metadata). This mirrors the built-in
 *                                   subagent panel (subagent-data.ts); `session.idle`
 *                                   is deprecated and not a completion signal.
 *   - `session.deleted` / `session.error` -> remove / mark done
 *
 * Bootstrap: on startup, `api.client.session.list()` backfills sub-sessions that
 * already exist (e.g. a resumed parent session's children) so the sidebar shows them
 * even though `session.created` was never emitted for them.
 *
 * Rendering follows the production pattern of oh-my-opencode-slim: plain function-call
 * helpers (`box`/`text`) built on `@opentui/solid`'s `createElement`/`insert`/`setProp`,
 * so no JSX/babel transform is required.
 *
 * IMPORTANT: interactive state is held in solid signals (`createSignal`), read directly
 * inside the slot renderer. This is the same mechanism the built-in MCP block uses
 * (`createSignal` + reactive re-render). `api.renderer.requestRender()` does NOT re-invoke
 * the `sidebar_content` slot renderer (verified against @opentui/solid 0.4.3/0.5.1 Slot),
 * so a plain memory variable + requestRender would never update the UI.
 */

type SubagentStatus = "busy" | "idle" | "retry" | "done";

type SubagentInfo = {
  agent: string;
  status: SubagentStatus;
  since: number; // epoch ms when the current busy run started (ticks while busy/retry)
  frozen: number; // accumulated elapsed ms from previous busy runs (frozen while idle/done)
  title?: string; // custom name: task tool input.description, or session title as fallback
};

type RunningEntry = [sessionID: string, info: SubagentInfo];

function element(tag: string, props: Record<string, unknown> = {}, children: unknown[] = []): JSX.Element {
  const node = createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) setProp(node, key, value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    insert(node, child);
  }
  return node as unknown as JSX.Element;
}

function text(props: Record<string, unknown>, children: unknown[] = []): JSX.Element {
  return element("text", props, children);
}

function box(props: Record<string, unknown>, children: unknown[] = []): JSX.Element {
  return element("box", props, children);
}

function formatDuration(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds.toString().padStart(2, "0")}s` : `${seconds}s`;
}

// Shown elapsed time: ticks only while busy/retry; frozen while idle/done.
function entryElapsed(info: SubagentInfo): number {
  return info.status === "busy" || info.status === "retry"
    ? info.frozen + (Date.now() - info.since)
    : info.frozen;
}

// Read a task tool part's metadata value. Mirrors subagent-data.ts `metadata()`:
// prefer `state.metadata`, fall back to `part.metadata`. Only some ToolState variants
// carry metadata, so narrow via `"metadata" in state` exactly like the built-in panel.
function toolMetadata(part: ToolPart, key: string): unknown {
  return ("metadata" in part.state ? part.state.metadata?.[key] : undefined) ?? part.metadata?.[key];
}

// Add a sub-session to the running map from a full SDK Session (session.created /
// session.updated / bootstrap). Keeps any existing entry's status and timers intact.
// Returns true if the map changed (new entry, or refreshed agent/title).
function upsertSession(running: Map<string, SubagentInfo>, info: Session): boolean {
  if (!info.parentID) return false;
  const existing = running.get(info.id);
  if (existing) {
    // Only refresh metadata; never reset status/clock of a tracked entry.
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
    title: info.title || undefined,
  });
  return true;
}

const plugin: TuiPluginModule = {
  id: "opencode-agent-pulse:tui",
  tui: async (api, options, _meta) => {
    // Notification toggles from plugin options (registered via the tuple form:
    // ["opencode-agent-pulse", { "notifications": { ... } }]).
    const notifCfg = (options as { notifications?: { subagents?: boolean; mainSession?: boolean; interview?: boolean } } | undefined)
      ?.notifications;
    const notifySubagents = notifCfg?.subagents ?? true;
    const notifyMainSession = notifCfg?.mainSession ?? true;
    const notifyInterview = notifCfg?.interview ?? true;
    // Source of truth for lookups (sessionID -> info). Rendered via `runningEntries`
    // signal below so solid reactivity re-renders the slot on every change.
    const running = new Map<string, SubagentInfo>();
    const [runningEntries, setRunningEntries] = createSignal<RunningEntry[]>([]);
    // Collapse state, matches MCP/TODO section interaction (built-in uses createSignal too).
    const [collapsed, setCollapsed] = createSignal(false);

    // --- Notification state ---
    // "All subagents done" detection: track every task tool part's lifecycle so we can
    // notify once when a whole delegation round drains to zero active parts.
    const taskParts = new Map<string, string>(); // callID -> current status
    let activeTaskCount = 0; // # task parts currently "pending" or "running"
    let roundNotified = false; // dedup: has the current batch already been announced?
    // "Turn done" detection: main (non-sub) sessions only. We notify on the busy->idle
    // transition of a main session, which fires once per round. Armed set keyed by
    // sessionID so multiple top-level sessions don't interfere; mirrors the built-in
    // notifications plugin behavior.
    const mainArmed = new Set<string>(); // sessionIDs armed on busy/retry, fired on idle
    // "Interview blocked" detection: when the main session is suspended waiting for user
    // input (`question` tool or permission approval), notify once per pending request.
    // question.asked / permission.asked are the authoritative signals — the agent is
    // parked on a Deferred, so no session.status change is emitted. Dedup by request id
    // and clear on replied/rejected (mirrors the built-in notifications plugin).
    const pendingQuestions = new Set<string>(); // question request ids awaiting an answer
    // Permission requests awaiting a reply. Values hold the deferred-notification timer
    // so it can be cancelled when a reply arrives (see the permission.asked handler).
    const pendingPermissions = new Map<string, ReturnType<typeof setTimeout>>();

    const syncEntries = () => setRunningEntries([...running.entries()]);

    const unsubs: Array<() => void> = [];

    // Bootstrap: backfill sub-sessions that already exist (e.g. a resumed parent
    // session's children). Resumed sessions never emit session.created, so without
    // this the sidebar would be blind to them until a brand-new subagent starts.
    api.client.session
      .list()
      .then((result) => {
        const sessions = result.data ?? [];
        let changed = false;
        for (const session of sessions) {
          if (upsertSession(running, session)) changed = true;
        }
        if (changed) syncEntries();
      })
      .catch(() => {
        // Best-effort bootstrap; live events still drive the list afterwards.
      });

    // session.created: only sub-sessions carry a parentID.
    unsubs.push(
      api.event.on("session.created", (event) => {
        const parentID = event.properties?.info?.parentID;
        if (!parentID) return;
        running.set(event.properties.sessionID, {
          agent: event.properties.info.agent ?? "?",
          status: "idle",
          since: Date.now(),
          frozen: 0,
          title: event.properties.info.title || undefined,
        });
        syncEntries();
      }),
    );

    // session.updated: fired by Session.patch (e.g. session touch on message activity)
    // with the full Session. For resumed/existing sub-sessions this is the only event
    // that carries their identity, so use it to backfill missing entries and refresh
    // agent/title without disturbing status or the elapsed clock.
    unsubs.push(
      api.event.on("session.updated", (event) => {
        if (upsertSession(running, event.properties.info)) {
          syncEntries();
        }
      }),
    );

    // session.status: busy / idle / retry.
    unsubs.push(
      api.event.on("session.status", (event) => {
        const sessionID = event.properties.sessionID;
        const type = event.properties.status.type; // "busy" | "idle" | "retry"

        // --- "Turn done" notification for the main (non-sub) session ---
        // Mirrors the built-in notifications plugin: arm on busy/retry, fire once on the
        // following idle, then disarm. Only fires for sessions that are not tracked
        // subagents (top-level/main sessions).
        if (!running.has(sessionID)) {
          if (type === "busy" || type === "retry") {
            mainArmed.add(sessionID);
          } else if (type === "idle") {
            if (mainArmed.has(sessionID)) {
              mainArmed.delete(sessionID);
              if (notifyMainSession) {
                notifyTurnDone(api).catch(() => {});
              }
            }
          }
        }

        const info = running.get(sessionID);
        if (!info) return;
        if (type === "busy" || type === "retry") {
          // Start a new counting run on busy/retry; keep accumulated frozen time.
          if (info.status !== "busy" && info.status !== "retry") {
            info.since = Date.now();
          }
          info.status = type;
        } else if (type === "idle") {
          // Freeze the clock while idle; keep "done" as the terminal state.
          if (info.status === "busy" || info.status === "retry") {
            info.frozen += Date.now() - info.since;
          }
          if (info.status !== "done") {
            info.status = "idle";
          }
        }
        syncEntries();
      }),
    );

    // message.part.updated: task tool parts report the sub-session lifecycle. This is
    // the same source the built-in subagent panel uses; `session.idle` is deprecated.
    unsubs.push(
      api.event.on("message.part.updated", (event) => {
        const part = event.properties.part;
        if (part.type !== "tool" || part.tool !== "task") return;

        // --- "All subagents done" detection (batch-wide, independent of childID) ---
        // Track every task tool part's lifecycle keyed by callID so we can tell when a
        // whole delegation batch drains to zero active parts. Notify once per batch.
        const status = part.state.status;
        const prevStatus = taskParts.get(part.callID);
        taskParts.set(part.callID, status);

        const wasActive = prevStatus === "pending" || prevStatus === "running";
        const nowActive = status === "pending" || status === "running";
        if (wasActive && !nowActive) {
          // A previously-active task just reached a terminal state.
          activeTaskCount--;
          if (activeTaskCount === 0) {
            // Batch drained to zero -> all delegated subagents finished.
            if (!roundNotified) {
              roundNotified = true;
              if (notifySubagents) {
                notifySubagentsDone(api, taskParts.size).catch(() => {});
              }
            }
          }
        } else if (!wasActive && nowActive) {
          // A brand-new active task appears (start of a new delegation batch).
          if (activeTaskCount === 0) roundNotified = false;
          activeTaskCount++;
        }

        // Child session is identified by metadata sessionId/sessionID (state first).
        const childID =
          (typeof toolMetadata(part, "sessionId") === "string" ? toolMetadata(part, "sessionId") : undefined) ??
          (typeof toolMetadata(part, "sessionID") === "string" ? toolMetadata(part, "sessionID") : undefined);
        if (typeof childID !== "string") return;

        // Only update entries we already track; never create new ones from parts.
        const info = running.get(childID);
        if (!info) return;

        // Custom name: the description given when delegating (mirrors the built-in
        // subagent panel, which prefers input.description, then input.subagent_type).
        const input = part.state.input;
        if (typeof input.description === "string" && input.description.trim()) {
          info.title = input.description.trim();
        }
        if (typeof input.subagent_type === "string" && input.subagent_type.trim()) {
          info.agent = input.subagent_type.trim();
        }

        if (part.state.status === "running") {
          // A resumed subagent re-runs its task tool part; surface it as busy again.
          // (The part carries input, so this also refreshes the custom name above.)
          if (info.status !== "busy" && info.status !== "retry") {
            info.since = Date.now();
          }
          info.status = "busy";
        } else if (part.state.status === "completed" || part.state.status === "error") {
          // Freeze the clock at completion (no-op if already frozen while idle).
          if (info.status === "busy" || info.status === "retry") {
            info.frozen += Date.now() - info.since;
          }
          info.status = "done";
        }
        syncEntries();
      }),
    );

    // session.deleted: sub-session is gone.
    unsubs.push(
      api.event.on("session.deleted", (event) => {
        mainArmed.delete(event.properties.sessionID);
        if (running.delete(event.properties.sessionID)) {
          syncEntries();
        }
      }),
    );

    // session.error: mark done (kept visible until deleted) instead of dropping it.
    unsubs.push(
      api.event.on("session.error", (event) => {
        const sessionID = event.properties.sessionID;
        if (!sessionID) return;
        const info = running.get(sessionID);
        if (info) {
          if (info.status === "busy" || info.status === "retry") {
            info.frozen += Date.now() - info.since;
          }
          info.status = "done";
          syncEntries();
        }
      }),
    );

    // "Interview blocked" notifications: the main session is suspended waiting for user
    // input. `question.asked` fires when the agent asks the user something (plan
    // confirmation, choices, etc.); `permission.asked` fires when the agent needs an
    // approval (e.g. to write a file or run a command). No session.status change is
    // emitted during the wait (the agent is parked on a Deferred), so these events are
    // the only reliable signal. Main sessions only: subagent requests are filtered out
    // (a subagent's own interview belongs to its delegation flow, not the main turn).
    // Dedup by request id and clear on replied/rejected, mirroring the built-in
    // notifications plugin (notifications.ts).
    unsubs.push(
      api.event.on("question.asked", (event) => {
        const { id, sessionID, questions } = event.properties;
        if (!notifyInterview || running.has(sessionID) || pendingQuestions.has(id)) return;
        pendingQuestions.add(id);
        const first = questions?.[0];
        notifyInterviewInput(api, "question", first?.question || first?.header).catch(() => {});
      }),
    );
    unsubs.push(
      api.event.on("question.replied", (event) => {
        pendingQuestions.delete(event.properties.requestID);
      }),
    );
    unsubs.push(
      api.event.on("question.rejected", (event) => {
        pendingQuestions.delete(event.properties.requestID);
      }),
    );
    // Permission approval requests. Unlike `question`, permission approvals can be
    // auto-approved by the client: with auto-approval enabled (`--auto` / TUI
    // `permission.mode`), the server still emits `permission.asked` and the TUI replies
    // `"once"` within the same event loop (sync.tsx:190-200) — so a notification fired
    // immediately is spam even though the user never needs to act. Fix: defer the
    // notification by a short window and cancel it if a reply arrives in time. Manual
    // approvals take far longer than the window (the user must read and click), so they
    // are unaffected. This is the only reliable signal: `permission.asked` carries no
    // mode field and the auto mode is client-side UI state the plugin cannot read.
    const PERMISSION_NOTIFY_DELAY_MS = 500;
    unsubs.push(
      api.event.on("permission.asked", (event) => {
        const { id, sessionID, permission } = event.properties;
        if (!notifyInterview || running.has(sessionID) || pendingPermissions.has(id)) return;
        const timer = setTimeout(() => {
          // Still pending after the window -> the user has to approve it manually.
          if (pendingPermissions.delete(id)) {
            notifyInterviewInput(api, "permission", permission).catch(() => {});
          }
        }, PERMISSION_NOTIFY_DELAY_MS);
        pendingPermissions.set(id, timer);
      }),
    );
    unsubs.push(
      api.event.on("permission.replied", (event) => {
        // Fired for both manual and auto approval (reply "once" | "always" | "reject");
        // either way the user no longer needs to act, so cancel the deferred notification.
        const { requestID } = event.properties;
        const timer = pendingPermissions.get(requestID);
        if (timer) {
          clearTimeout(timer);
          pendingPermissions.delete(requestID);
        }
      }),
    );

    // Keep the elapsed-time column live only while some subagent's clock is running (busy/retry).
    const ticker = setInterval(() => {
      let active = false;
      for (const info of running.values()) {
        if (info.status === "busy" || info.status === "retry") {
          active = true;
          break;
        }
      }
      if (active) syncEntries();
    }, 1000);

    api.lifecycle.onDispose(() => {
      clearInterval(ticker);
      // Cancel any pending deferred permission notifications.
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
          // Reading signals inside the renderer makes solid re-render this slot
          // reactively on every state change (no requestRender needed).
          const isCollapsed = collapsed();
          const entries = runningEntries();
          const theme = api.theme.current;

          const header = box(
            {
              width: "100%",
              flexDirection: "row",
              // Mouse "click" on the header toggles collapse (host dispatches mouse
              // events to sidebar renderables; matches the built-in MCP block).
              onMouseDown: () => setCollapsed((value) => !value),
            },
            [
              text({ fg: theme.accent }, [`${isCollapsed ? "▸" : "▾"} Subagents`]),
              text({ fg: theme.textMuted }, entries.length > 0 ? [` (${entries.length})`] : []),
            ],
          );

          if (isCollapsed) {
            return box({ width: "100%", flexDirection: "column" }, [header]);
          }

          const rows = entries.map(([sessionID, info]) => {
            const isActive = info.status === "busy";
            const statusColor = isActive ? theme.success : info.status === "retry" ? theme.warning : theme.textMuted;
            return box(
              {
                width: "100%",
                flexDirection: "row",
                paddingLeft: 1,
                // Left-click a row to jump into that sub-session's context view
                // (host plugin API: api.route.navigate("session", { sessionID })).
                onMouseDown: (event: { button?: number }) => {
                  if (event.button !== undefined && event.button !== 0) return;
                  api.route.navigate("session", { sessionID });
                },
              },
              [
                text({ fg: statusColor }, [`●`]),
                text({ fg: theme.text }, [` ${info.agent}`]),
                text({ fg: statusColor }, [` ${info.status}`]),
                text({ fg: theme.textMuted }, [` ${formatDuration(entryElapsed(info))}`]),
              ],
            );
          });

          return box({ width: "100%", flexDirection: "column" }, [header, ...rows]);
        },
      },
    });
  },
};

export default plugin;
