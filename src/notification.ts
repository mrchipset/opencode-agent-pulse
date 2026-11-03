import type { AttentionSound, Context } from "@opencode/plugin/tui/context";
import type { Locale } from "./i18n";
import { t } from "./i18n";
import { diag } from "./diag";

/**
 * Notification dispatch for opencode-agent-pulse.
 *
 * One host channel plus a Windows fallback:
 *
 *   - Every platform calls `context.attention.notify()` first, so the host's attention
 *     enable/disable policy and sound configuration apply. macOS iTerm2/Ghostty and
 *     Linux kitty/foot implement the OSC 9/99 protocol used for system notifications.
 *   - Windows Terminal does NOT implement OSC 99 + DEC 1004 (known issue #35055), so the
 *     host reports `notification: false` while still playing the sound. In that case we
 *     post a real Action Center toast through `node-notifier` (bundled SnoreToast.exe).
 *     If attention is globally disabled we skip the fallback too.
 *
 * All functions are best-effort: failures are swallowed so a notification problem never
 * breaks the plugin.
 */

type Api = Pick<Context, "attention" | "ui">;

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
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAFACAYAAABTKqIKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKZ0lE" +
  "QVR4nO3dMW4kQQxD0TlJAbz/Eey7yZFjO5MAPgHKF23yb091ifrkvdGeAQ28ymfw2f4HaM+ABh4AEAEQ" +
  "0MDzBkAEQEADz08AIgACGnjOAIgACGjgOQQkAiCggecrABEAAQ08nwGJAAho4LkHQARAQAPPRSAiAAIa" +
  "eG4CEgEQ0MBzFZgIgIAGnlkAIgACGniGgYgACGjgmQYkAiCggWccmAiAIJ6BPAAiAIIUPwOBIAf+CNoz" +
  "CAAQARDQQLwBEAEQ0ED8BCACIKCBOAMgAiCggTgEJAIgoIH4CkAEQEAD8RmQCICABuIeABEAAQ3ERSAi" +
  "AAIaiJuARAAENBBXgYkACGggZgGIAAhoIIaBiAAIaCCmAYkACGggxoGJAAhe/TOQB0AE9SZIsQYA4MAf" +
  "QXsGAQAiAAIaiDcAIgACGoifAEQABDQQZwBEAAQ0EIeARAAENBBfAYgACGggPgMSARDQQNwDIAIgoIG4" +
  "CEQEQEADcROQCICABuIqMBEAAQ3ELAARAAENxDAQEQABDcQ0IBEAAQ3EODARAMGrfwbyAIig3gQp1gAA" +
  "HPgjaM8gAEAEQEAD8QZABEBAA/ETgAiAgAbiDIAIgIAG4hCQCICABuIrABEAAQ3EZ0AiAAIaiHsARAAE" +
  "NBAXgYgACGggbgISARDQQFwFJgIgoIGYBfhjGEJVV8oh4QGo6soBEwLAJgFVdeWACQEAABQAzMp/gNsE" +
  "2m7O664c0KA3AABQADDeALwBKG8A4yeAnwDKT4BxBuAMQDkDGIeADgGVQ8DxFcBXAOUrwPgM6DOg8hlw" +
  "3ANwD0C5BzAuArkIpFwEGjcB3QRUbgKOq8CuAitXgccsgFkAZRZgDAMZBlKGgcY0oGlAZRpwjAMbB1bG" +
  "gUcegDyA+sqBmXx5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIA" +
  "lDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIAlDyAkQcgD0DJAxh5APIA" +
  "lDyAkQcgD6C+cmAmXx6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6A" +
  "PAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6APAAlD2DkAcgDUPIARh6A" +
  "PAAlD2DkAcgDqK8cmMmXByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICR" +
  "ByAPQMkDGHkA8gCUPICRByAPQMkDGHkA8gCUPICRByAPQMkDGHkA/wDB99eXLn4GOXAf3yzA4kPYFqAG" +
  "gGzOwmwTaLsZsBtCOaBBAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0" +
  "dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3Qmvn" +
  "gAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6Y" +
  "EAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkB" +
  "AADWjdDaOWBCAACAdSO0dg6YEAAAYN0IrZ0DJgQAAFg3QmvngAkBAADWjdDaOWBCAACAdSO09rYBt9t2" +
  "4AMi1AAQANghIPN1AygH/hf2BuAnwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAA" +
  "wLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACs" +
  "G6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoR" +
  "WjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1" +
  "c8CEAAAA60Zo7RwwIQAAwLoRWjsHTAgAALBuhNbOARMCAACsG6G1c8CEAAAA60Zo7RwwIQAAwLoRWjsH" +
  "TAgAALBuhNbeNuB2f7b/Adu9LUANAAEAAAACbwDxBuANAAj8BIifAH4CAIEzgDgDcAYABA4B4xDQISAQ" +
  "+AoQXwF8BQACnwHjM6DPgEDgHkDcA3APAAhcBIqLQC4CAYGbgHET0E1AIHAVOK4CuwoMBGYBYhbALAAQ" +
  "GAaKYSDDQEBgGjCmAU0DAoFx4BgHNg4MBPIA5AHIA6gHQQ5kUsgDkAdQb0SJQE8egEQgIBAJ9uQBiAQD" +
  "ApmATx6ATEAgEAr65AEIBQUCqcBPHoBUYCAQC/7kAYgFBwJ7AZ48AHsBgMBikCcPwGIQILAZ6MkDsBkI" +
  "CKwGe/IArAYDArsBnzwAuwGBwHLQJw/AclAgsB34yQOwHRgIrAd/8gCsBweCXxDkwEiucWDjwMaBrQcf" +
  "68GtBwcC68HHenDrwYHAevCxHtx6cCCwHnysB7ceHAisBx/rwa0HBwLrwcd6cOvBgcB68LEe3HpwILAe" +
  "fKwHtx4cCKwHH+vBrQcHAuvBx3pw68GBwHrwsR7cenAgsB58rAe3HhwIrAcf68GtBwcC68HHenDrwYHA" +
  "OPBYD249eD0IcmAmXx6APIB6I8oDePIA5AEAgTyAJw9AHgAQyAN48gDkAQCBPIAnD0AeABDIA3jyAOQB" +
  "AIE8gCcPQB4AEMgDePIA5AEAgTyAJw9AHgAQyAN48gDkAQCBPIAnD0AeABDIA3jyAOQBAIE8gCcPQB4A" +
  "EMgDePIA5AEAgTyAJw9AHgAQyAN48gDkAQBBDszkywM48CC0Z5DCZ/DZ/gdoz4AGHgAQARDQwPMGQARA" +
  "QAPPTwAiAAIaeM4AiAAIaOA5BCQCIKCB5ysAEQABDTyfAYkACGjguQdABEBAA89FICIAAhp4bgISARDQ" +
  "wHMVmAiAgAaeWQAiAAIaeIaBiAAIaOCZBiQCIKCBZxyYCIAgnoE8ACIAghQ/A4EgB/4I2jMIABABENBA" +
  "vAEQARDQQPwEIAIgoIE4AyACIKCBOAQkAiCggfgKQARAQAPxGZAIgIAG4h4AEQABDcRFICIAAhqIm4BE" +
  "AAQ0EFeBiQAIaCBmAYgACGgghoGIAAhoIKYBiQAIaCDGgYkACF79M5AHQAT1JkixBgDgwB9BewYBACIA" +
  "AhqINwAiAAIaiJ8ARAAENBBnAEQABDQQh4BEAAQ0EF8BiAAIaCA+AxIBENBA3AMgAiCggbgIRARAQANx" +
  "E5AIgIAG4iowEQABDcQsABEAAQ3EMBARAAENxDQgEQABDcQ4MBEAwat/BvIAiKDeBCnWAAAc+CNozyAA" +
  "QARAQAPxBkAEQEAD8ROACICABuIMgAiAgAbiEJAIgIAG4isAEQABDcRnQCIAAhqIewBEAAQ0EBeBiAAI" +
  "aCBuAhIBENBAXAUmAiCggfzxDH4A1tndxbLywd0AAAAASUVORK5CYII=";

interface NotifyPayload {
  title: string;
  message: string;
  /** Sound used on the non-Windows path (`api.attention.notify`). */
  sound: AttentionSound;
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

// Decode the embedded OpenCode PNG once per process and reuse it for every toast.
// A stable path also avoids leaking one temp file per notification if the
// node-notifier callback never fires.
let windowsIcon: Promise<string | undefined> | undefined;
function ensureWindowsIcon(): Promise<string | undefined> {
  windowsIcon ??= (async () => {
    try {
      const { writeFile } = await import("node:fs/promises");
      const os = await import("node:os");
      const path = await import("node:path");
      const iconPath = path.join(os.tmpdir(), `opencode-pulse-${process.pid}.png`);
      await writeFile(iconPath, Buffer.from(OPENCODE_ICON_PNG_B64, "base64"));
      return iconPath;
    } catch {
      // best-effort; fall back to no icon if the temp file could not be written
      return undefined;
    }
  })();
  return windowsIcon;
}

async function windowsNotify(payload: NotifyPayload): Promise<void> {
  // node-notifier is marked external in the build so it resolves from
  // node_modules at runtime rather than being bundled. On Windows it posts a real
  // Action Center toast via the bundled SnoreToast.exe. Dynamic import keeps the
  // module load from failing the whole plugin if node-notifier is unavailable.
  try {
    const mod = await import("node-notifier");
    const iconPath = await ensureWindowsIcon();
    const notifier = (mod as { default?: unknown }).default ?? mod;
    (notifier as { notify: (opts: unknown, cb: (err: Error | null, response: string) => void) => void }).notify(
      {
        title: payload.title,
        message: payload.message,
        appID: WINDOWS_APP_ID,
        ...(iconPath ? { icon: iconPath } : {}),
        // The host attention channel already plays the configured sound; the
        // Windows fallback only needs to supply the missing system toast.
        sound: false,
      },
      (error, response) => diag("windowsNotify:callback", { error: error ? String(error) : null, response }),
    );
  } catch (error) {
    // best-effort; a failed toast must never break the plugin
    diag("windowsNotify:error", { error: String(error) });
  }
}

async function builtinNotify(api: Api, payload: NotifyPayload) {
  try {
    return await api.attention.notify({
      title: payload.title,
      message: payload.message,
      notification: { when: "always" },
      sound: payload.sound,
    });
  } catch (error) {
    // best-effort; a failed notification must never break the plugin
    diag("builtinNotify:error", { error: String(error) });
    return undefined;
  }
}

async function dispatch(api: Api, payload: NotifyPayload, gate?: NotifyGate): Promise<void> {
  const focused = gate?.onlyWhenUnfocused ? await gate.focused() : undefined;
  diag("dispatch", {
    title: payload.title,
    message: payload.message,
    onlyWhenUnfocused: gate?.onlyWhenUnfocused,
    focused,
  });
  if (gate?.onlyWhenUnfocused && focused === true) {
    // Terminal is focused -> the user is watching, suppress the notification.
    // Unknown focus (no focus events, e.g. Windows Terminal) still dispatches.
    diag("dispatch:suppressed-focused");
    return;
  }
  // Let the host apply its attention policy (enabled/disabled, sound, focus)
  // everywhere, including Windows. On Windows the notification channel is
  // silently dropped by unsupported terminals, so fall back to a real toast.
  const result = await builtinNotify(api, payload);
  diag(
    "dispatch:builtin-result",
    result
      ? { ok: result.ok, notification: result.notification, sound: result.sound, skipped: result.skipped }
      : { result: "undefined" },
  );
  // On Windows the host channel only queues an OSC sequence: `triggerNotification`
  // reports success as soon as the bytes are written, even in Windows Terminal,
  // which cannot display OSC 9/99. Never trust `result.notification` there —
  // unless attention is globally disabled, always post a real Action Center toast.
  if (IS_WINDOWS && result?.skipped !== "attention_disabled") {
    diag("dispatch:windows-fallback", {
      hostNotification: result?.notification ?? null,
      hostSkipped: result?.skipped ?? null,
    });
    await windowsNotify(payload);
  }
}

/** Notify that a batch of subagents finished. */
export async function notifySubagentsDone(
  api: Api,
  count: number,
  gate?: NotifyGate,
  locale: Locale = "en",
): Promise<void> {
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message: t(locale).subagentsDone(count),
      sound: { name: "subagent_done" },
    },
    gate,
  );
}

/** Notify that the current turn (main-agent round) has finished. */
export async function notifyTurnDone(api: Api, gate?: NotifyGate, locale: Locale = "en"): Promise<void> {
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message: t(locale).turnDone,
      sound: { name: "done" },
    },
    gate,
  );
}

/**
 * Notify that a session run ended in failure.
 *
 * Unlike the "done" notifications this is not an opt-in duplicate of the host's
 * built-in notifier: OpenCode 2.x's `opencode.notifications` plugin is typically
 * disabled so this plugin owns the whole notification surface, and it has to
 * cover errors itself. Subagent failures are surfaced separately because the
 * parent turn may still finish successfully afterwards.
 */
export async function notifySessionError(
  api: Api,
  kind: "session" | "subagent",
  detail?: string,
  gate?: NotifyGate,
  locale: Locale = "en",
): Promise<void> {
  const messages = t(locale);
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message: kind === "subagent" ? messages.subagentError(detail) : messages.sessionError(detail),
      sound: { name: "error" },
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
export async function notifyInterviewInput(
  api: Api,
  kind: InterviewKind,
  detail?: string,
  gate?: NotifyGate,
  locale: Locale = "en",
): Promise<void> {
  const messages = t(locale);
  await dispatch(
    api,
    {
      title: "opencode-agent-pulse",
      message:
        kind === "permission"
          ? messages.permissionRequired(detail)
          : messages.questionRequired(detail),
      sound: kind === "permission" ? { name: "permission" } : { name: "question" },
    },
    gate,
  );
}

/** In-app toast fallback (works on every platform). */
export function toast(api: Api, message: string): void {
  try {
    api.ui.toast.show({ variant: "info", title: "opencode-agent-pulse", message });
  } catch {
    // best-effort
  }
}

/** True when running on Windows (used to decide the delivery path). */
export function isWindows(): boolean {
  return IS_WINDOWS;
}
