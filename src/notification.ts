import type { TuiAttentionSound, TuiPluginApi } from "@opencode-ai/plugin/tui";

/**
 * Notification dispatch for opencode-agent-pulse.
 *
 * Two delivery channels, selected by platform:
 *
 *   - Non-Windows: use the built-in `api.attention.notify()` (macOS iTerm2/Ghostty and
 *     Linux kitty/foot implement the OSC 9/99 protocol this relies on). Supports both
 *     a system notification and a sound.
 *   - Windows: Windows Terminal does NOT implement the OSC 99 protocol + DEC 1004 focus
 *     tracking that `api.attention.notify`'s notification path depends on (known issue
 *     #35055), so the system notification is silently dropped. As a workaround we route
 *     through `node-notifier`, which on Windows shells out to the bundled SnoreToast.exe
 *     to post a real Action Center toast. (The built-in sound is unaffected, but on
 *     Windows the TUI sound and the toast are delivered independently.)
 *
 * All functions are best-effort: failures are swallowed so a notification problem never
 * breaks the plugin.
 */

type Api = Pick<TuiPluginApi, "attention" | "ui">;

const IS_WINDOWS = process.platform === "win32";

// AppUserModelID used for the Windows toast. node-notifier requires an AUMID for
// Action Center toasts to group properly and show a friendly app name.
const WINDOWS_APP_ID = "opencode-agent-pulse";

// OpenCode logo as a PNG (pre-rendered from the SVG in scripts/gen-icon.ts at 256x320),
// encoded as base64. Passed to node-notifier's `icon` field so the Windows Action Center
// toast shows the OpenCode logo instead of the default icon. Because node-notifier's
// Windows branch expects a file path (not a data URL), we decode this to a temp file at
// dispatch time (see windowsNotify).
const OPENCODE_ICON_PNG_B64 =
  "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";

interface NotifyPayload {
  title: string;
  message: string;
  /** Sound used on the non-Windows path (`api.attention.notify`). */
  sound: TuiAttentionSound;
}

/**
 * Optional focus gate applied before dispatching a notification. Lets the user opt into
 * "notify only when the terminal window is unfocused" so notifications don't fire while
 * they are actively watching the TUI.
 *
 * The gate is evaluated on every dispatch (not once at setup) because the deferred
 * permission notification is sent from a timer and the current focus state must be read
 * at that moment.
 */
export type NotifyGate = {
  /** When true, suppress the notification while the terminal is focused. */
  onlyWhenUnfocused: boolean;
  /** Current terminal focus state; `undefined` when unknown (e.g. the terminal does not
   *  report focus events — Windows Terminal is a known case). Unknown focus degrades to
   *  dispatching so an opted-in notification is never silently lost. Read lazily on each
   *  dispatch because the deferred permission notification fires from a timer. May be
   *  async (the Windows fallback queries the foreground window via PowerShell). */
  focused: () => boolean | undefined | Promise<boolean | undefined>;
};

async function windowsNotify(payload: NotifyPayload): Promise<void> {
  // node-notifier is marked external in the build (package.json) so it resolves from
  // node_modules at runtime rather than being bundled. On Windows it posts a real
  // Action Center toast via the bundled SnoreToast.exe. Dynamic import keeps the
  // module load from failing the whole plugin if node-notifier is unavailable.
  import("node-notifier")
    .then(async (mod) => {
      // node-notifier's Windows branch expects a file path (not a data URL) for `icon`,
      // so decode the embedded PNG to a temp file first.
      let iconPath: string | undefined;
      try {
        const { writeFile } = await import("node:fs/promises");
        const os = await import("node:os");
        const path = await import("node:path");
        iconPath = path.join(os.tmpdir(), `opencode-pulse-${process.pid}-${Date.now()}.png`);
        await writeFile(iconPath, Buffer.from(OPENCODE_ICON_PNG_B64, "base64"));
      } catch {
        // best-effort; fall back to no icon if the temp file could not be written
        iconPath = undefined;
      }

      const notifier = (mod as { default?: unknown }).default ?? mod;
      (notifier as { notify: (opts: unknown, cb: (err: Error | null, response: string) => void) => void }).notify(
        {
          title: payload.title,
          message: payload.message,
          appID: WINDOWS_APP_ID,
          ...(iconPath ? { icon: iconPath } : {}),
          sound: true,
        },
        () => {
          // best-effort; remove the temp icon file once the toast is dispatched
          if (iconPath) {
            void import("node:fs/promises")
              .then(({ unlink }) => unlink(iconPath))
              .catch(() => {});
          }
        },
      );
    })
    .catch(() => {
      // best-effort
    });
}

async function builtinNotify(api: Api, payload: NotifyPayload): Promise<void> {
  try {
    await api.attention.notify({
      title: payload.title,
      message: payload.message,
      notification: { when: "always" },
      sound: payload.sound,
    });
  } catch {
    // best-effort; a failed notification must never break the plugin
  }
}

async function dispatch(api: Api, payload: NotifyPayload, gate?: NotifyGate): Promise<void> {
  if (gate?.onlyWhenUnfocused && (await gate.focused()) === true) {
    // Terminal is focused -> the user is watching, suppress the notification.
    // Unknown focus (no focus events, e.g. Windows Terminal) still dispatches.
    return;
  }
  if (IS_WINDOWS) {
    await windowsNotify(payload);
  } else {
    await builtinNotify(api, payload);
  }
}

/** Notify that a batch of subagents finished. */
export async function notifySubagentsDone(api: Api, count: number, gate?: NotifyGate): Promise<void> {
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message: count > 1 ? `全部 ${count} 个子 agent 已完成` : "子 agent 已完成",
      sound: { name: "subagent_done" },
    },
    gate,
  );
}

/** Notify that the current turn (main-agent round) has finished. */
export async function notifyTurnDone(api: Api, gate?: NotifyGate): Promise<void> {
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message: "本轮对话已完成",
      sound: { name: "done" },
    },
    gate,
  );
}

/** What kind of user interaction is blocking the main session. */
export type InterviewKind = "question" | "permission";

/**
 * Notify that the main session is blocked waiting for user input (an interview:
 * the `question` tool asking the user something, or a permission/approval prompt).
 * These are the two ways an agent turn is suspended mid-run on user interaction.
 */
export async function notifyInterviewInput(api: Api, kind: InterviewKind, detail?: string, gate?: NotifyGate): Promise<void> {
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message:
        kind === "permission"
          ? detail
            ? `需要权限确认: ${detail}`
            : "主会话需要权限确认"
          : detail
            ? `需要回答: ${detail}`
            : "主会话需要回答询问",
      sound: kind === "permission" ? { name: "permission" } : { name: "question" },
    },
    gate,
  );
}

/** In-app toast fallback (works on every platform). */
export function toast(api: Api, message: string): void {
  try {
    api.ui.toast({ variant: "info", title: "opencode-agent-pulse", message });
  } catch {
    // best-effort
  }
}

/** True when running on Windows (used to decide the delivery path). */
export function isWindows(): boolean {
  return IS_WINDOWS;
}
