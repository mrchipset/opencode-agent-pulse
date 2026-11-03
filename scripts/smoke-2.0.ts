/**
 * Local smoke test for the V2 TUI module shape and setup path.
 *
 * OpenCode imports the published/bundled `dist/tui.js` and calls the default
 * definition's `setup(context)`. Rendering needs the host's OpenTUI renderer, so
 * this harness only verifies the definition shape, that setup registers its slot
 * and event listeners, and the option switches (`sidebar.show`,
 * `notifications.errors`) behave without touching host internals.
 */
import plugin from "../dist/tui.js";

type Handler = (event: unknown) => void;
type NotifyInput = { message?: string; sound?: { name?: string } | false | true };

const sessions = [
  {
    id: "ses_root",
    projectID: "prj",
    cost: 0,
    tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
    time: { created: Date.now() - 5000, updated: Date.now(), busy: Date.now() - 4000 },
    agent: "build",
    title: "Root",
    location: { directory: process.cwd() },
  },
  {
    id: "ses_child",
    parentID: "ses_root",
    projectID: "prj",
    cost: 0,
    tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
    time: { created: Date.now() - 3000, updated: Date.now(), busy: Date.now() - 2000 },
    agent: "explorer",
    title: "Child task",
    location: { directory: process.cwd() },
  },
];

type Slot = { prepend?: string; render: (input: { sessionID: string }) => unknown };

/** Build a fresh mock host so each scenario gets isolated state. */
function makeContext(options: Record<string, unknown>) {
  const handlers = new Map<string, Handler>();
  const notifications: NotifyInput[] = [];
  let slot: Slot | undefined;

  const context = {
    options,
    location: { directory: process.cwd() },
    renderer: { on() {}, off() {} },
    data: {
      on(type: string, handler: Handler) {
        handlers.set(type, handler);
        return () => handlers.delete(type);
      },
      session: {
        list: () => sessions,
        get: (id: string) => sessions.find((session) => session.id === id),
        root: (id: string) => (id === "ses_child" ? "ses_root" : id),
        family: (id: string) => (id === "ses_root" ? ["ses_root", "ses_child"] : [id]),
        status: (id: string) => (id === "ses_child" ? "running" : "idle"),
        cost: () => 0,
      },
    },
    ui: {
      slot(claim: Slot) {
        slot = claim;
        return () => {};
      },
      toast: { show() {} },
      router: { navigate() {} },
    },
    storage: {
      store(_key: string, options: { initial: unknown }) {
        return [options.initial, async () => {}];
      },
      memory(_key: string, options: { initial: unknown }) {
        return [options.initial, () => {}];
      },
    },
    attention: {
      async notify(input: NotifyInput) {
        notifications.push(input);
        // `notification: true` keeps the Windows node-notifier fallback out of the test.
        return { ok: true, notification: true, sound: true };
      },
    },
    theme: {
      text: {
        base: "#ffffff",
        muted: "#888888",
        feedback: {
          success: { base: "#00ff00" },
          warning: { base: "#ffff00" },
          error: { base: "#ff0000" },
        },
      },
    },
    client: {},
  };

  return { context, handlers, notifications, slot: () => slot };
}

const REQUIRED_EVENTS = [
  "session.execution.started",
  "session.execution.succeeded",
  "session.execution.failed",
  "session.execution.interrupted",
  "session.deleted",
  "form.created",
  "form.replied",
  "form.cancelled",
  "permission.asked",
  "permission.replied",
];

const atHere = { location: { directory: process.cwd() } };

if (!plugin || typeof plugin !== "object" || typeof plugin.setup !== "function") {
  throw new Error("default export is not a V2 TUI plugin definition");
}
if (plugin.id !== "opencode-agent-pulse") {
  throw new Error(`unexpected plugin id: ${String(plugin.id)}`);
}

// --- 1. Default options: slot claimed, every notification event subscribed ---
{
  const host = makeContext({});
  const cleanup = await plugin.setup(host.context as never);
  const slot = host.slot();
  if (!slot || slot.prepend !== "sidebar.content") {
    throw new Error("setup did not prepend to sidebar.content");
  }
  for (const event of [...REQUIRED_EVENTS, "session.retry.scheduled"]) {
    if (!host.handlers.has(event)) throw new Error(`setup did not subscribe to ${event}`);
  }
  if (typeof cleanup === "function") await cleanup();
}

// --- 2. sidebar.show=false: no slot, notification plumbing intact ---
{
  const host = makeContext({ sidebar: { show: false } });
  const cleanup = await plugin.setup(host.context as never);
  if (host.slot()) throw new Error("sidebar.show=false still claimed sidebar.content");
  for (const event of REQUIRED_EVENTS) {
    if (!host.handlers.has(event)) throw new Error(`sidebar.show=false dropped ${event}`);
  }
  if (typeof cleanup === "function") await cleanup();
}

// --- 3. notifications.errors=true: failures notify (main + subagent wording) ---
{
  const host = makeContext({ notifications: { errors: true } });
  const cleanup = await plugin.setup(host.context as never);
  host.handlers.get("session.execution.failed")?.({ data: { sessionID: "ses_root" }, ...atHere });
  host.handlers.get("session.execution.failed")?.({ data: { sessionID: "ses_child" }, ...atHere });
  await new Promise((resolve) => setTimeout(resolve, 50));
  const errors = host.notifications.filter((input) => input.sound && input.sound !== true && input.sound.name === "error");
  if (errors.length !== 2) {
    throw new Error(`notifications.errors dispatched ${errors.length} notifications, expected 2`);
  }
  if (!errors.some((input) => input.message?.startsWith("Session failed"))) {
    throw new Error("missing main-session error notification");
  }
  if (!errors.some((input) => input.message?.startsWith("Subagent failed"))) {
    throw new Error("missing subagent error notification");
  }
  if (typeof cleanup === "function") await cleanup();
}

// --- 4. Errors stay silent by default ---
{
  const host = makeContext({});
  const cleanup = await plugin.setup(host.context as never);
  host.handlers.get("session.execution.failed")?.({ data: { sessionID: "ses_root" }, ...atHere });
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (host.notifications.length !== 0) {
    throw new Error("failure notified without notifications.errors enabled");
  }
  if (typeof cleanup === "function") await cleanup();
}

console.log("V2 TUI plugin smoke test passed");
process.exit(0);
