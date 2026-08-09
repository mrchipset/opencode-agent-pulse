# AGENTS.md — opencode-agent-pulse plugin project

This file is used to build this plugin from scratch in a **standalone working directory**. The directory you receive is an empty/new bun project directory; implement it fully per this file.

## Project overview

An **OpenCode TUI plugin** (standalone npm package) that live-displays **running subagents** (sub-agents/tasks) in the **sidebar** of the OpenCode terminal edition (TUI): name, owning agent, busy/idle status, and elapsed time. It **coexists** with OMO-Slim (oh-my-opencode-slim) and does not modify OMO-Slim.

Key design decisions (do not deviate):
- **TUI only**. OpenCode has no `api.webview`, no `activityBar`; Web/desktop is not possible, do not attempt it.
- Standalone package + `sidebar_content` slot (slot library default mode; multiple plugins can stack).
- subagent status data source uses **session events** (`session.created`'s `parentID` identifies sub-sessions + `session.status`'s busy/idle); **do not rely on `task.*` events** (they do not exist).
- Sidebar section is **collapsible**: a small arrow expands/collapses it, matching the interaction of the built-in MCP/TODO sections. Implementation: local expanded state + click toggles + `api.renderer.requestRender()`; first check whether `@opentui` provides a ready-made collapse/tree component; if not, use an arrow symbol + conditional rendering.

## Tech stack and version baseline

- Bun (build and dependency management; the plugin itself ultimately runs in the opencode runtime)
- TypeScript
- `@opencode-ai/plugin@^1.18.9` (official plugin SDK, includes `@opencode-ai/plugin/tui` types)
- `@opentui/core`, `@opentui/solid` (TUI rendering primitives, JSX: `box`/`text` etc.)
- OpenCode baseline version 1.18.9; `"engines": { "opencode": "^1.0.0" }` in `package.json`

## Required directory structure

```
.
├── package.json          # see field requirements in the next section
├── tsconfig.json         # JSX config (@opentui/solid uses solid-style JSX), strict
├── src/
│   ├── index.ts          # server plugin entry (optional but recommended)
│   └── tui.ts            # TUI plugin entry (required)
├── dist/                 # bun build output (commit the build or deliver post-build)
└── README.md             # brief purpose, installation, registration
```

## package.json requirements

```jsonc
{
  "name": "opencode-agent-pulse",            // changeable to your package name
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./tui": "./dist/tui.js"             // TUI subpath; opencode uses it to discover the TUI plugin
  },
  "engines": { "opencode": "^1.0.0" },
  "scripts": {
    "build": "bun build src/index.ts --outdir dist && bun build src/tui.ts --outfile dist/tui.js"
  },
  "devDependencies": {
    "@opencode-ai/plugin": "^1.18.9",
    "@opentui/core": "latest",
    "@opentui/solid": "latest",
    "typescript": "^5"
  }
}
```

## TUI plugin API quick reference (`@opencode-ai/plugin/tui`)

- Module shape: **`default export { id?, tui }`**. **It is forbidden to export `server` from the same module** (the loader rejects it).
- Signature: `tui: (api: TuiPluginApi, options, meta) => Promise<void>`.
- Slots: `api.slots.register({ order: number, slots: {...} })` returns the slot id assigned by the host.
  - Key slot: `sidebar_content(ctx, props: { session_id })` — the sidebar content area; multiple plugins can stack. This plugin uses it.
  - Related slots: `sidebar_title({ session_id, title, share_url? })`, `sidebar_footer({ session_id })` — **single_winner mode; do not compete with OMO-Slim for these; do not use them**.
  - There is no `status_bar` slot.
  - `order` is recommended as 950 (OMO-Slim uses 900; this plugin comes after it).
- Events: `api.event.on(type: string, handler) => unsubscribe`. Available types (string literals):
  `session.created`, `session.status`, `session.idle`, `session.error`, `session.deleted`, `server.instance.disposed`, `message.updated`, etc.
- Refresh: `api.renderer.requestRender()`.
- Other available APIs: `api.theme.current`, `api.client` (full SDK; `session.list()` can be polled as a fallback), `api.kv`, `api.state`, `api.lifecycle.signal/onDispose`.
- Rendering: `@opentui/solid` exports JSX components such as `box`, `text`; take colors from the theme via `api.theme.current`.

## subagent status determination logic (copy as-is)

```ts
// session.created: subagent sessions carry a parentID
if (event.type === "session.created") {
  const parentID = event.properties?.info?.parentID;
  if (parentID) running.set(event.sessionID, { agent: "?", status: "idle" });
}

// session.status: status.type is "busy" | "idle" | "retry"
if (event.type === "session.status") {
  // event.sessionID + event.status.type
}

// session.deleted / session.error: remove or mark as finished
```

Event field names follow the `@opencode-ai/sdk` types (you can `import type { Event } from "@opencode-ai/sdk"` to type-check the fields); if the field positions do not match, the compiler error will tell you to fix them.

## tui.ts skeleton (implement per this; extensions allowed)

```tsx
import type { TuiPluginModule } from "@opencode-ai/plugin/tui";
import { box, text } from "@opentui/solid";

type SubagentInfo = { agent: string; status: "busy" | "idle" | "retry" | "done"; since: number };

const plugin: TuiPluginModule = {
  id: "opencode-agent-pulse:tui",
  tui: async (api, _options, _meta) => {
    const running = new Map<string, SubagentInfo>();
    let collapsed = false; // section collapse state (matches the expand/collapse interaction of the MCP/TODO sections)

    const unsubs: Array<() => void> = [];
    const on = (type: string, handler: (e: any) => void) => {
      unsubs.push(api.event.on(type, handler));
    };

    on("session.created", (e) => { /* identify via parentID, add to running */ });
    on("session.status", (e) => { /* update status */ api.renderer.requestRender(); });
    on("session.deleted", (e) => { /* remove */ api.renderer.requestRender(); });

    api.slots.register({
      order: 950,
      slots: {
        sidebar_content(_ctx, _props) {
          // Section header: small arrow (▸/▾) + title, click to collapse/expand, matching the built-in MCP/TODO section interaction.
          // collapsed is local state; on click, flip it and call api.renderer.requestRender().
          // First check whether @opentui provides a ready-made collapse component; otherwise render the arrow with text + conditionally render the list.
          return box({ flexDirection: "column" }, [
            text({ color: api.theme.current.accent }, `${collapsed ? "▸" : "▾"} Subagents`),
            ...(collapsed
              ? []
              : runningEntries.map(([id, info]) => box({}, [
                  text({}, info.agent),
                  text({ color: info.status === "busy" ? "green" : "gray" }, info.status),
                ]))),
          ]);
        },
      },
    });

    api.lifecycle.onDispose(() => { unsubs.forEach((u) => u()); });
  },
};

export default plugin;
```

index.ts (server plugin) skeleton:

```ts
import type { Plugin } from "@opencode-ai/plugin";

const plugin: Plugin = async () => {
  return {
    name: "opencode-agent-pulse",
    event: async ({ event }) => {
      // Optional: the server side subscribes to session.* to maintain shared state / write a disk snapshot
      // If the TUI side already subscribes directly, the server side can skip this (pick one data source on either side; do not duplicate)
    },
  };
};

export default plugin;
```

## Notification capability (optional enhancement; note Windows limitations)

Optionally notify the user when a subagent completes or errors. The API exists, but **Windows has gotchas**:

- Inside the TUI: `api.attention.notify({ title?, message, notification?, sound? })` (system notification + sound), `api.ui.toast({ variant, message, duration? })` (in-app toast bar).
- Built-in sounds include `"subagent_done"` (officially reserved for the subagent completion scenario).
- ⚠️ **Windows cannot send native notifications by default**: opencode notifications depend on the terminal implementing the OSC 99 protocol + DEC 1004 focus tracking; Windows Terminal supports neither → `notification` is silently skipped (known issue #35055), but the **sound is unaffected and still plays**.
- **Platform branching strategy**: when `process.platform === "win32"`, use `node-notifier` (on Windows it uses the bundled SnoreToast.exe to post Action Center toasts; requires `npm i node-notifier` and adding it as a dependency), or a PowerShell WinRT toast; on other platforms use `api.attention.notify()` (macOS iTerm2/Ghostty and Linux kitty/foot all support OSC 9/99).
- If notifications are not implemented, the hint can be rendered into the `sidebar_content` list itself (e.g., a completion marker), keeping the implementation minimal.

## Build

```bash
bun install
bun run build
# check that dist/index.js and dist/tui.js were generated
```

## Registering on the user machine (`C:\Users\Zouyu\.config\opencode`)

1. Add the dependency `"opencode-agent-pulse": "file:<path to this project>"` to `package.json` (in that directory), then `bun install` (or use `bun link`).
2. Edit `opencode.json`: add `"opencode-agent-pulse"` to the `"plugin": [..., ...]` array.
3. Edit `tui.json`: also add it to the `"plugin": [..., ...]` array (OMO-Slim is also dual-registered; if the npm package's `exports["./tui"]` already takes effect, tui.json is a belt-and-suspenders entry and can be removed after testing if unnecessary).
4. Restart `opencode`.

## Verification checklist

- [ ] `opencode` starts and the "Subagents" section appears in the sidebar, coexisting with the OMO-Slim sidebar.
- [ ] Trigger a subagent delegation (/agent or Task) and the section immediately shows a busy entry.
- [ ] When the subagent finishes, the status transitions to idle/removed.
- [ ] Multiple parallel subagents all display correctly with no overlap.
- [ ] The section header has a small arrow; clicking collapses/expands it (interaction aligned with the MCP/TODO sections), and the list is no longer rendered when collapsed.
- [ ] Exiting opencode leaves no lingering timers/subscription errors.
- [ ] `tsc --noEmit` has no type errors (or `bun build` reports no errors).
- [ ] (Optional) Notifications: on Windows a system toast appears (node-notifier/PowerShell); on non-Windows `api.attention.notify` prompts/sounds take effect.

## Pitfall checklist (must follow)

1. **Do not export `server` from the same module as `tui`**; the TUI module may only `default export { id?, tui }`.
2. **Do not look for `api.webview` / `activityBar` / `event.task.*`** — they do not exist; do not waste time.
3. `sidebar_title`/`sidebar_footer` are single-winner and conflict with OMO-Slim; **only use `sidebar_content`**.
4. In-memory state on the TUI side is lost when the UI remounts: if needed, let the server side maintain it + use `api.client.session.list()` as a fallback to rebuild.
5. Event type fields (`sessionID`, `status.type`, `properties.info.parentID`) follow the `Event` type from `@opencode-ai/sdk`; validate at compile time.
6. This plugin only reads data and does not hook or modify any requests/responses; keep side effects minimal.

## Local source first (important workflow requirement)

When opencode / OMO-Slim **internal implementation details** are involved (TUI event mechanism, slot interaction, collapse interaction, subagent completion determination, @opentui rendering behavior, etc.), **prefer checking the local source code; do not do arbitrary web searches**:

- OpenCode source: `C:\Users\Zouyu\CodeReviews\opencode`
- OMO-Slim source: `C:\Users\Zouyu\CodeReviews\oh-my-opencode-slim`

If the local machine lacks the corresponding source/files, or versions do not match (local opencode 1.18.9; the local repo may be on another branch), **first ask the user whether they can provide the source or information**, continue only after confirmation, and do not search the web recklessly to find implementation details.

Key built-in implementation references (local paths):
- Sidebar collapse interaction: `packages/tui/src/feature-plugins/sidebar/mcp.tsx` (solid component tree + `createSignal` + `onMouseDown`)
- subagent completion determination: `packages/opencode/src/cli/cmd/run/subagent-data.ts` (`message.part.updated` + the task tool part's `state.status`; `session.idle` is deprecated and is not a completion signal)

## Reference links

- TUI plugin spec: https://github.com/anomalyco/opencode/blob/master/packages/opencode/specs/tui-plugins.md
- TUI type definitions: https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/tui.ts
- Plugin SDK types: https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts
- Built-in subagent status derivation reference: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/run/subagent-data.ts
- OMO-Slim TUI plugin reference: https://github.com/alvinunreal/oh-my-opencode-slim/blob/master/src/tui.ts
- Sidebar per-session rendering reference: https://github.com/prevalentWare/opencode-goal-plugin/blob/main/src/tui.ts
