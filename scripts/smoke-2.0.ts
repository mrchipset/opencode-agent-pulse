/**
 * Local smoke test for the V2 TUI module shape and setup path.
 *
 * OpenCode imports the published/bundled `dist/tui.js` and calls the default
 * definition's `setup(context)`. Rendering needs the host's OpenTUI renderer, so
 * this harness only verifies the definition shape and that setup registers its
 * slot and event listeners without touching host internals.
 */
import plugin from "../dist/tui.js";

const handlers = new Map<string, (event: unknown) => void>();
let slot: { prepend?: string; render: (input: { sessionID: string }) => unknown } | undefined;

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

const context = {
  options: {},
  renderer: {
    on() {},
    off() {},
  },
  data: {
    on(type: string, handler: (event: unknown) => void) {
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
    slot(claim: typeof slot) {
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
    async notify() {
      return { ok: true, notification: false, sound: false };
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

if (!plugin || typeof plugin !== "object" || typeof plugin.setup !== "function") {
  throw new Error("default export is not a V2 TUI plugin definition");
}
if (plugin.id !== "opencode-agent-pulse") {
  throw new Error(`unexpected plugin id: ${String(plugin.id)}`);
}

const cleanup = await plugin.setup(context as never);
if (!slot || slot.prepend !== "sidebar.content") {
  throw new Error("setup did not prepend to sidebar.content");
}
for (const event of [
  "session.retry.scheduled",
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
]) {
  if (!handlers.has(event)) throw new Error(`setup did not subscribe to ${event}`);
}
if (typeof cleanup === "function") await cleanup();
console.log("V2 TUI plugin smoke test passed");
process.exit(0);
