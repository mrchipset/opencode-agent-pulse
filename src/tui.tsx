import { Plugin } from "@opencode/plugin/tui";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import type { NotifyGate } from "./notification";
import { notifyInterviewInput, notifySessionError, notifySubagentsDone, notifyTurnDone } from "./notification";
import { resolveLocale, t } from "./i18n";
import { diag, initDiag } from "./diag";
import { ensureWindowsFocusInit, getFocusStatus, isTerminalFocused } from "./windows-focus";

/**
 * Sidebar widget that live-tracks running subagents (sub-sessions).
 *
 * OpenCode 2.x data source (`Plugin.Context.data`):
 *   - `data.session.list()`          -> every session the TUI has loaded. Sub-sessions
 *                                      carry `parentID`; `data.session.root()` groups a
 *                                      session with its whole subagent family.
 *   - `data.session.status(id)`      -> "running" | "idle" (derived from execution events)
 *   - `data.session.get(id)`         -> full `SessionInfo` (agent, title, outcome, times)
 *
 * The host already projects live events into this reactive store, so the plugin no
 * longer maintains its own event-driven map (the V1 `session.created` / `session.status`
 * / `message.part.updated` plumbing is gone). `session.subagent.*` activity is folded into
 * `execution.started` / `execution.succeeded|failed|interrupted`, which the host data
 * layer turns into the running/idle status we read here.
 *
 * Elapsed time uses the session's own timestamps:
 *   - `time.busy`  start of the most recent execution
 *   - `time.idle`  end of the most recent completed execution
 *
 * Notifications keep the V1 option surface (`notifications.subagents`,
 * `notifications.mainSession`, `notifications.interview`, `notifications.onlyWhenUnfocused`)
 * but subscribe to V2 events: `session.execution.*`, `form.*`, `permission.*`.
 */

type Status = "busy" | "retry" | "idle" | "done" | "error" | "stopped";

type SubagentEntry = {
  id: string;
  agent: string;
  title?: string;
  status: Status;
  elapsed: number;
  created: number;
};

type Session = NonNullable<ReturnType<Plugin.Context["data"]["session"]["get"]>>;

type Options = {
  locale?: unknown;
  debug?: boolean;
  notifications?: {
    subagents?: boolean;
    mainSession?: boolean;
    interview?: boolean;
    errors?: boolean;
    onlyWhenUnfocused?: boolean;
  };
  sidebar?: {
    show?: boolean;
    showFocus?: boolean;
  };
};

function formatDuration(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds.toString().padStart(2, "0")}s` : `${seconds}s`;
}

function statusOf(session: Session, running: boolean, retrying: boolean): Status {
  if (running) return retrying ? "retry" : "busy";
  if (session.outcome === "failed") return "error";
  if (session.outcome === "interrupted") return "stopped";
  if (session.outcome === "succeeded") return "done";
  return "idle";
}

function elapsedOf(session: Session, status: Status, now: number): number {
  const start = session.time.busy ?? session.time.created;
  const end =
    status === "busy" || status === "retry"
      ? now
      : (session.time.idle ?? session.time.updated ?? now);
  return Math.max(0, end - start);
}

function Sidebar(props: {
  context: Plugin.Context;
  sessionID: string;
  retrying: () => ReadonlySet<string>;
  seen: () => ReadonlySet<string>;
  markSeen: (sessionID: string) => void;
  focusDiag: () => ReturnType<typeof getFocusStatus>;
  showFocus: boolean;
  locale: ReturnType<typeof resolveLocale>;
}) {
  const data = props.context.data;
  const theme = props.context.theme;
  const labels = t(props.locale);
  // Persisted like the built-in MCP/TODO sections: the arrow toggles the section and
  // the choice survives TUI restarts and plugin hot reloads.
  const [view, updateView] = props.context.storage.store("view", {
    initial: { open: true },
  });
  // Re-render once a second so elapsed times tick while an execution is running.
  const [now, setNow] = createSignal(Date.now());

  // `Plugin.Context["data"].session` exposes `status()` but not the solid store's
  // `active()` helper, so derive the running set from the public surface.
  const runningIDs = () =>
    new Set(
      data.session
        .list()
        .filter((session) => data.session.status(session.id) === "running")
        .map((session) => session.id),
    );

  // Seed the visible set for subagents that were already running when the plugin
  // activated (hot reload / TUI resume). Live starts are recorded by the setup
  // event handler, so a fast start/finish cannot fall through this bootstrap.
  createEffect(() => {
    const root = data.session.root(props.sessionID);
    for (const id of runningIDs()) {
      const session = data.session.get(id);
      if (session?.parentID !== undefined && data.session.root(id) === root) {
        props.markSeen(id);
      }
    }
  });

  const entries = createMemo<SubagentEntry[]>(() => {
    const root = data.session.root(props.sessionID);
    const active = runningIDs();
    const retrying = props.retrying();
    const seenIDs = props.seen();
    const clock = now();
    return data.session
      .list()
      .filter((session) => {
        if (session.parentID === undefined) return false;
        if (data.session.root(session.id) !== root) return false;
        return active.has(session.id) || seenIDs.has(session.id);
      })
      .map((session) => {
        const running = active.has(session.id);
        const status = statusOf(session, running, retrying.has(session.id));
        return {
          id: session.id,
          agent: session.agent ?? "?",
          title: session.title || undefined,
          status,
          elapsed: elapsedOf(session, status, clock),
          created: session.time.created,
        };
      })
      .sort(
        (a, b) =>
          Number(b.status === "busy" || b.status === "retry") -
            Number(a.status === "busy" || a.status === "retry") ||
          a.created - b.created,
      );
  });

  // Tick only while the section is open and something has a live clock.
  const timer = setInterval(() => {
    if (!view.open) return;
    if (entries().some((entry) => entry.status === "busy" || entry.status === "retry")) {
      setNow(Date.now());
    }
  }, 1000);
  onCleanup(() => clearInterval(timer));

  const tone = (status: Status) => {
    if (status === "busy") return theme.text.feedback.success.base;
    if (status === "retry") return theme.text.feedback.warning.base;
    if (status === "error") return theme.text.feedback.error.base;
    return theme.text.muted;
  };

  const statusLabel = (status: Status) => {
    if (status === "busy") return "busy";
    if (status === "retry") return "retry";
    if (status === "done") return "done";
    if (status === "error") return "error";
    if (status === "stopped") return "stopped";
    return "idle";
  };

  return (
    <box width="100%" flexDirection="column">
      <box
        width="100%"
        flexDirection="row"
        gap={1}
        onMouseDown={() => {
          void updateView((draft) => {
            draft.open = !draft.open;
          }).catch((error) => console.error("Failed to persist subagent sidebar state", error));
        }}
      >
        <text fg={theme.text.base}>{view.open ? "▼" : "▶"}</text>
        <text fg={theme.text.base}>
          <b>{labels.subagents}</b>
          <Show when={entries().length > 0}>
            <span style={{ fg: theme.text.muted }}> ({entries().length})</span>
          </Show>
        </text>
      </box>

      <Show when={view.open} fallback={<box height={0} />}>
        <Show when={props.showFocus} fallback={<box height={0} />}>
          <text fg={theme.text.muted}>
            {(() => {
              const diag = props.focusDiag();
              const flag =
                diag.lastResult === true
                  ? "●focused"
                  : diag.lastResult === false
                    ? "○blurred"
                    : "?unknown";
              const src = diag.lastForegroundPid !== undefined ? ` fg=${diag.lastForegroundPid}` : "";
              const err = diag.lastError ? ` err=${diag.lastError}` : "";
              return `  focus[${diag.backend}${diag.ancestorCount ? `:${diag.ancestorCount}` : ""}] ${flag}${src}${err}`;
            })()}
          </text>
        </Show>

        <For each={entries()}>
          {(entry) => (
            <box
              width="100%"
              flexDirection="row"
              gap={1}
              paddingLeft={1}
              onMouseDown={() => {
                props.context.ui.router.navigate({ type: "session", sessionID: entry.id });
              }}
            >
              <text fg={tone(entry.status)} flexShrink={0}>
                ●
              </text>
              <text
                fg={theme.text.base}
                wrapMode="none"
                truncate
                flexGrow={1}
                flexShrink={1}
                minWidth={0}
              >
                {entry.title ?? entry.agent}
                <Show when={entry.title}>
                  <span style={{ fg: theme.text.muted }}> {entry.agent}</span>
                </Show>
              </text>
              <text fg={tone(entry.status)} wrapMode="none" flexShrink={0}>
                {statusLabel(entry.status)}
              </text>
              <text fg={theme.text.muted} wrapMode="none" flexShrink={0}>
                {formatDuration(entry.elapsed)}
              </text>
            </box>
          )}
        </For>
      </Show>
    </box>
  );
}

const plugin = Plugin.define({
  id: "opencode-agent-pulse",
  setup(context) {
    const options = (context.options ?? {}) as Options;
    initDiag(options.debug === true);
    diag("setup", {
      cwd: process.cwd(),
      location: context.location?.directory,
      options,
    });
    const notifCfg = options.notifications;
    // Opt-in: OpenCode 2.x ships `opencode.notifications`, which covers the same
    // events. Defaulting to off avoids duplicate sounds/toasts.
    const notifySubagents = notifCfg?.subagents ?? false;
    const notifyMainSession = notifCfg?.mainSession ?? false;
    const notifyInterview = notifCfg?.interview ?? false;
    const notifyErrors = notifCfg?.errors ?? false;
    // Default to "don't disturb while the user is watching", matching the host's
    // built-in notifications plugin (`notification.when: "blurred"`). The Windows
    // fallback checks the foreground window because Windows Terminal reports no
    // focus events at all.
    const notifyOnlyWhenUnfocused = notifCfg?.onlyWhenUnfocused ?? true;
    const locale = resolveLocale(options.locale);
    // `sidebar.show: false` keeps the notification half alive while claiming no
    // `sidebar.content` slot at all — no component tree, no 1s ticker.
    const showSidebar = options.sidebar?.show ?? true;
    const showFocus = options.sidebar?.showFocus ?? false;

    // Subagents observed running during this activation. Recorded from the live
    // execution event (not by polling) so a fast start/finish still gets a row.
    const [seen, setSeen] = createSignal<ReadonlySet<string>>(new Set());
    const markSeen = (sessionID: string) => {
      setSeen((previous) => {
        if (previous.has(sessionID)) return previous;
        const next = new Set(previous);
        next.add(sessionID);
        return next;
      });
    };

    // --- Terminal focus tracking (Windows fallback) ---
    if (notifyOnlyWhenUnfocused) ensureWindowsFocusInit();
    let focused: boolean | undefined;
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
    const notifyGate: NotifyGate = {
      onlyWhenUnfocused: notifyOnlyWhenUnfocused,
      focused: async () => {
        const win = await isTerminalFocused();
        refreshFocusDiag();
        diag("focus-check", { win: win ?? null, renderer: focused ?? null, ...getFocusStatus() });
        return win ?? focused;
      },
    };

    // Session IDs currently in a retry backoff. V2 exposes only running/idle in
    // `data.session.status()`, so this is the only way to keep the V1 "retry" state.
    const [retrying, setRetrying] = createSignal<ReadonlySet<string>>(new Set());
    const markRetrying = (sessionID: string, value: boolean) => {
      setRetrying((previous) => {
        if (previous.has(sessionID) === value) return previous;
        const next = new Set(previous);
        if (value) next.add(sessionID);
        else next.delete(sessionID);
        return next;
      });
    };

    const isSubagent = (sessionID: string) =>
      context.data.session.get(sessionID)?.parentID !== undefined;

    // Windows paths reach us as either `C:\a\b` (TUI cwd) or `C:/a/b` (session
    // records), so compare slash style and, on Windows, case-insensitively.
    const normalizePath = (value: string) => {
      const slashed = value.replace(/\\/g, "/").replace(/\/+$/, "");
      return process.platform === "win32" ? slashed.toLowerCase() : slashed;
    };
    const sameLocation = (a?: string, b?: string) => !a || !b || normalizePath(a) === normalizePath(b);

    // A TUI can be attached to one location; ignore events for other worktrees.
    // Execution events carry no `location`, so fall back to the session record.
    const atThisLocation = (
      event: { type?: string; location?: { directory?: string } },
      sessionID?: string,
    ) => {
      const here = context.location?.directory;
      const there =
        event.location?.directory ??
        (sessionID ? context.data.session.get(sessionID)?.location?.directory : undefined);
      const ok = sameLocation(here, there);
      if (!ok) diag("location-mismatch", { event: event.type, here, there });
      return ok;
    };

    // Only direct children count: a grandchild reports to its own parent, and running
    // shells are a different concern. Mirrors the built-in notifications plugin.
    const hasRunningChild = (sessionID: string) =>
      context.data.session
        .family(sessionID)
        .some(
          (child) =>
            child !== sessionID &&
            context.data.session.get(child)?.parentID === sessionID &&
            context.data.session.status(child) === "running",
        );

    // --- Notification state ---
    const activeSubagents = new Set<string>();
    let roundCount = 0;
    let roundNotified = false;
    const terminal = new Set<string>(); // sessionIDs whose current run was announced
    const errored = new Set<string>();
    const pendingForms = new Set<string>();
    const pendingPermissions = new Map<string, ReturnType<typeof setTimeout>>();
    const PERMISSION_NOTIFY_DELAY_MS = 500;

    const started = (sessionID: string) => {
      terminal.delete(sessionID);
      errored.delete(sessionID);
      markRetrying(sessionID, false);
    };

    const ended = (sessionID: string) => {
      diag("ended:enter", {
        sessionID,
        terminal: terminal.has(sessionID),
        errored: errored.has(sessionID),
        subagent: isSubagent(sessionID),
        notifyMainSession,
      });
      if (terminal.has(sessionID)) return;
      terminal.add(sessionID);
      if (errored.has(sessionID)) {
        errored.delete(sessionID);
        return;
      }
      if (isSubagent(sessionID)) return; // covered by the batch notification below
      if (notifyMainSession) {
        notifyTurnDone(context, notifyGate, locale).catch(() => {});
      }
    };

    const unsubs: Array<() => void> = [];

    const endedSubagent = (sessionID: string) => {
      const tracked = activeSubagents.delete(sessionID);
      diag("endedSubagent", {
        sessionID,
        tracked,
        remaining: activeSubagents.size,
        roundNotified,
        notifySubagents,
        roundCount,
      });
      if (!tracked || activeSubagents.size > 0 || roundNotified) return;
      roundNotified = true;
      if (notifySubagents) {
        notifySubagentsDone(context, roundCount, notifyGate, locale).catch(() => {});
      }
    };

    // Retry state: the host only projects running/idle, so track the transient backoff.
    // Only the sidebar renders it, so skip the subscription when the section is hidden.
    if (showSidebar) {
      unsubs.push(
        context.data.on("session.retry.scheduled", (event) => {
          if (!atThisLocation(event)) return;
          markRetrying(event.data.sessionID, true);
        }),
      );
    }

    // Execution lifecycle. This is the V2 replacement for the V1
    // session.status / message.part.updated completion signals.
    unsubs.push(
      context.data.on("session.execution.started", (event) => {
        const here = atThisLocation(event, event.data.sessionID);
        diag("event:execution.started", {
          sessionID: event.data.sessionID,
          location: event.location?.directory,
          atLocation: here,
        });
        if (!here) return;
        const sessionID = event.data.sessionID;
        started(sessionID);
        // Record every start; the renderer only keeps entries with a parentID.
        // This still catches a subagent whose session info has not landed yet.
        if (showSidebar) markSeen(sessionID);
        if (!isSubagent(sessionID)) return;
        if (activeSubagents.size === 0) {
          roundCount = 0;
          roundNotified = false;
        }
        activeSubagents.add(sessionID);
        roundCount++;
      }),
    );

    unsubs.push(
      context.data.on("session.execution.succeeded", (event) => {
        if (!atThisLocation(event, event.data.sessionID)) return;
        const sessionID = event.data.sessionID;
        const subagent = isSubagent(sessionID);
        diag("event:execution.succeeded", {
          sessionID,
          subagent,
          runningChild: subagent ? undefined : hasRunningChild(sessionID),
          notifyMainSession,
        });
        markRetrying(sessionID, false);
        if (isSubagent(sessionID)) {
          endedSubagent(sessionID);
          return;
        }
        // A running subagent's report wakes the parent session again; wait for it.
        if (hasRunningChild(sessionID)) return;
        ended(sessionID);
      }),
    );

    unsubs.push(
      context.data.on("session.execution.failed", (event) => {
        if (!atThisLocation(event, event.data.sessionID)) return;
        const sessionID = event.data.sessionID;
        diag("event:execution.failed", {
          sessionID,
          subagent: isSubagent(sessionID),
          notifyErrors,
        });
        markRetrying(sessionID, false);
        errored.add(sessionID);
        if (isSubagent(sessionID)) {
          endedSubagent(sessionID);
        } else {
          ended(sessionID);
        }
        if (!notifyErrors) return;
        // A failed run never reaches the "done" notification: `ended` bails out on
        // `errored`, so this is the only signal the user gets for a broken turn.
        const info = context.data.session.get(sessionID);
        const detail = info?.title || info?.agent || undefined;
        notifySessionError(
          context,
          isSubagent(sessionID) ? "subagent" : "session",
          detail,
          notifyGate,
          locale,
        ).catch(() => {});
      }),
    );

    unsubs.push(
      context.data.on("session.execution.interrupted", (event) => {
        if (!atThisLocation(event, event.data.sessionID)) return;
        const sessionID = event.data.sessionID;
        diag("event:execution.interrupted", { sessionID, subagent: isSubagent(sessionID) });
        markRetrying(sessionID, false);
        if (isSubagent(sessionID)) {
          endedSubagent(sessionID);
          return;
        }
        ended(sessionID);
      }),
    );

    unsubs.push(
      context.data.on("session.deleted", (event) => {
        if (!atThisLocation(event, event.data.sessionID)) return;
        const sessionID = event.data.sessionID;
        terminal.delete(sessionID);
        errored.delete(sessionID);
        activeSubagents.delete(sessionID);
        markRetrying(sessionID, false);
        setSeen((previous) => {
          if (!previous.has(sessionID)) return previous;
          const next = new Set(previous);
          next.delete(sessionID);
          return next;
        });
      }),
    );

    // Interview blocked: V2 forms replace the V1 `question` tool events, and
    // permissions still arrive as their own request/response pair.
    unsubs.push(
      context.data.on("form.created", (event) => {
        if (!atThisLocation(event, event.data.form.sessionID)) return;
        const form = event.data.form;
        if (!notifyInterview || isSubagent(form.sessionID) || pendingForms.has(form.id)) return;
        pendingForms.add(form.id);
        notifyInterviewInput(context, "question", form.title, notifyGate, locale).catch(() => {});
      }),
    );
    unsubs.push(
      context.data.on("form.replied", (event) => {
        pendingForms.delete(event.data.id);
      }),
    );
    unsubs.push(
      context.data.on("form.cancelled", (event) => {
        pendingForms.delete(event.data.id);
      }),
    );

    unsubs.push(
      context.data.on("permission.asked", (event) => {
        const { id, sessionID, action } = event.data;
        if (!atThisLocation(event, sessionID)) return;
        if (!notifyInterview || isSubagent(sessionID) || pendingPermissions.has(id)) return;
        const timer = setTimeout(() => {
          if (pendingPermissions.delete(id)) {
            notifyInterviewInput(context, "permission", action, notifyGate, locale).catch(() => {});
          }
        }, PERMISSION_NOTIFY_DELAY_MS);
        pendingPermissions.set(id, timer);
      }),
    );
    unsubs.push(
      context.data.on("permission.replied", (event) => {
        const timer = pendingPermissions.get(event.data.requestID);
        if (!timer) return;
        clearTimeout(timer);
        pendingPermissions.delete(event.data.requestID);
      }),
    );

    // `sidebar.show: false` still registers the event plumbing above (notifications keep
    // working) but contributes nothing to the sidebar. The option is read once at setup,
    // so this is a startup-level switch, not a runtime toggle.
    if (showSidebar) {
      context.ui.slot({
        // First in the sidebar: a live status section must stay visible when the
        // built-in Context/MCP/Todo blocks fill the column.
        prepend: "sidebar.content",
        render: (slot) => (
          <Sidebar
            context={context}
            sessionID={slot.sessionID}
            retrying={retrying}
            seen={seen}
            markSeen={markSeen}
            focusDiag={focusDiag}
            showFocus={showFocus}
            locale={locale}
          />
        ),
      });
    }

    return () => {
      context.renderer.off("focus", onFocus);
      context.renderer.off("blur", onBlur);
      for (const timer of pendingPermissions.values()) clearTimeout(timer);
      pendingPermissions.clear();
      unsubs.reverse().forEach((unsubscribe) => unsubscribe());
    };
  },
});

export default plugin;
