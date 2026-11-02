/**
 * Renders the V2 sidebar slot into OpenTUI's test renderer twice: first with a
 * running subagent, then after mutating the mock store. The frame must change,
 * which catches a bundle that lost Solid reactivity during the build.
 */
import { RGBA } from "@opentui/core";
import { testRender } from "@opentui/solid";
import { createSignal } from "solid-js";
import plugin from "../dist/tui.js";

const color = (r: number, g: number, b: number) => RGBA.fromInts(r, g, b, 255);
const now = Date.now();

const [state, setState] = createSignal({
  sessions: [
    {
      id: "ses_root",
      projectID: "prj",
      cost: 0,
      tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
      time: { created: now - 5000, updated: now, busy: now - 4000 },
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
      time: { created: now - 3000, updated: now, busy: now - 2000 },
      agent: "explorer",
      title: "Child task",
      location: { directory: process.cwd() },
    },
  ],
  active: new Set(["ses_child"]),
});

let slot: { prepend?: string; render: (input: { sessionID: string }) => unknown } | undefined;
const context = {
  options: {},
  location: { directory: process.cwd() },
  renderer: { on() {}, off() {} },
  data: {
    on() {
      return () => {};
    },
    session: {
      list: () => state().sessions,
      get: (id: string) => state().sessions.find((session) => session.id === id),
      root: (id: string) => (id === "ses_child" ? "ses_root" : id),
      family: (id: string) => (id === "ses_root" ? ["ses_root", "ses_child"] : [id]),
      status: (id: string) => (state().active.has(id) ? "running" : "idle"),
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
      base: color(255, 255, 255),
      muted: color(136, 136, 136),
      feedback: {
        success: { base: color(0, 255, 0) },
        warning: { base: color(255, 255, 0) },
        error: { base: color(255, 0, 0) },
      },
    },
  },
  client: {},
};

await plugin.setup(context as never);
if (!slot) throw new Error("slot not registered");

const setup = await testRender(() => slot!.render({ sessionID: "ses_root" }) as never, {
  width: 60,
  height: 20,
});
await setup.renderOnce();
const runningFrame = setup.captureCharFrame();
console.log("--- running ---");
console.log(runningFrame);

const sessions = state().sessions.map((session) =>
  session.id === "ses_child"
    ? {
        ...session,
        title: "Finished task",
        outcome: "succeeded" as const,
        time: { ...session.time, busy: now - 2000, idle: now - 500 },
      }
    : session,
);
setState({ sessions, active: new Set(["ses_root"]) });
const finishedFrame = await setup.waitForFrame((frame) => frame.includes("Finished task"));
await setup.renderOnce();
console.log("--- finished ---");
console.log(finishedFrame);

if (runningFrame === finishedFrame) {
  throw new Error("sidebar did not react to a store change (Solid transform missing?)");
}
if (!finishedFrame.includes("Finished task") || !finishedFrame.includes("done")) {
  throw new Error("sidebar did not render the updated title/status");
}
await setup.dispose();
console.log("V2 sidebar reactivity test passed");
