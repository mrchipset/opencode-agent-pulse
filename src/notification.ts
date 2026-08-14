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

interface NotifyPayload {
  title: string;
  message: string;
  /** Sound used on the non-Windows path (`api.attention.notify`). */
  sound: TuiAttentionSound;
}

function windowsNotify(payload: NotifyPayload): void {
  // node-notifier is marked external in the build (package.json) so it resolves from
  // node_modules at runtime rather than being bundled. On Windows it posts a real
  // Action Center toast via the bundled SnoreToast.exe. Dynamic import keeps the
  // module load from failing the whole plugin if node-notifier is unavailable.
  import("node-notifier")
    .then((mod) => {
      const notifier = (mod as { default?: unknown }).default ?? mod;
      (notifier as { notify: (opts: unknown, cb: (err: Error | null, response: string) => void) => void }).notify(
        {
          title: payload.title,
          message: payload.message,
          appID: WINDOWS_APP_ID,
          sound: true,
        },
        (err, response) => {
          // best-effort; ignore errors
          void err;
          void response;
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

async function dispatch(api: Api, payload: NotifyPayload): Promise<void> {
  if (IS_WINDOWS) {
    windowsNotify(payload);
  } else {
    await builtinNotify(api, payload);
  }
}

/** Notify that a batch of subagents finished. */
export async function notifySubagentsDone(api: Api, count: number): Promise<void> {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: count > 1 ? `全部 ${count} 个子 agent 已完成` : "子 agent 已完成",
    sound: { name: "subagent_done" },
  });
}

/** Notify that the current turn (main-agent round) has finished. */
export async function notifyTurnDone(api: Api): Promise<void> {
  await dispatch(api, {
    title: "opencode-agent-pulse",
    message: "本轮对话已完成",
    sound: { name: "done" },
  });
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
