# Plan: OpenCode sidebar plugin that live-displays running subagents

> Created: 2026-08-09
> Status: feasibility confirmed, pending implementation

## 1. Background and goals

While using OpenCode + OMO-Slim (oh-my-opencode-slim), the user wants to see, in the **sidebar** of the OpenCode UI, the status of **running subagents** (sub-agents/tasks) in real time: who is running, whether they are busy/idle, which session they belong to, etc.

This plan completed two rounds of research on 2026-08-09 (official docs/source + local inspection) confirming technical feasibility; the implementation blueprint follows.

## 2. Feasibility conclusion (confirmed by research)

| Interface | Conclusion | Basis |
|---|---|---|
| **TUI terminal edition** | ✅ Feasible, official first-class capability | `sidebar_content` slot from `@opencode-ai/plugin/tui` + `api.event.on` event subscriptions + `api.renderer.requestRender` refresh; OMO-Slim already uses this chain in production |
| **Web / desktop edition** | ❌ Not supported yet | No `api.webview`, no `activityBar` field; sidebar panel API PRs (#16804/#27444/#27461) were all closed without merging, issue #5971 is still open |

**This plan targets the TUI terminal edition only.**

### Key facts (from research)

- TUI plugin module shape: `default export { id?, tui }`; **exporting `server` at the same time is forbidden** (the loader only reads the default export).
- `TuiPlugin = (api: TuiPluginApi, options, meta) => Promise<void>`.
- Slot registration: `api.slots.register({ order, slots })`, 12 slots total:
  `app | app_bottom | home_logo | home_prompt | home_prompt_right | session_prompt | session_prompt_right | home_bottom | home_footer | sidebar_title | sidebar_content | sidebar_footer`.
  - `sidebar_content: { session_id }` — **sidebar content area, the core slot**; "slot library default mode", multiple plugins can stack (coexists with OMO-Slim without conflict).
  - `sidebar_title` / `sidebar_footer` are `single_winner` mode.
  - **There is no `status_bar` slot.**
- Event subscription: `api.event.on(type, handler)` → returns an unsubscribe function.
- Render refresh: `api.renderer.requestRender()`.
- Other APIs: `api.theme.current`, `api.client` (full SDK), `api.kv`, `api.state`, `api.lifecycle.signal/onDispose`.
- Rendering primitives: `@opentui/solid` (JSX: `box`/`text` etc.), with `@opentui/core` underneath.
- Version constraint: `"engines": { "opencode": "^1.0.0" }` in `package.json`.

### Correct data source for live subagent status

**There are no `event.task.*` lifecycle events.** Two mechanisms actually work:

1. **Session events (recommended; OMO-Slim Companion's source of truth)**
   - `session.created`: identify subagent sessions via `properties.info.parentID`
   - `session.status`: determine whether it is running via `status.type` (`busy`/`idle`/`retry`)
   - Auxiliary: `session.idle`, `session.error`, `session.deleted`, `server.instance.disposed`
   - Reason: each subagent (foreground or background Task) runs in an independent sub-session that reports busy/idle on its own; the tool-call lifecycle is unreliable (a background Task returns immediately while the sub-session is still running).

2. **task tool part status (the built-in OpenCode subagent panel's approach)**
   - Read `state.status` of the `task` tool's ToolPart (`running`/`completed`/`error`/`pending`)
   - Metadata keys: `sessionId`/`sessionID`, `background`, `toolcalls`/`toolCalls`/`calls`, `interrupted`
   - Reference: `packages/opencode/src/cli/cmd/run/subagent-data.ts`

### Existing references

- **OMO-Slim `src/tui.ts`**: `sidebar_content` slot + 1s polling + `requestRender` + `onDispose` cleanup — same chain as the goal, but it displays a static agent→model mapping, not live running status.
- **OMO-Slim Companion `src/companion/manager.ts`**: already implements "live display of running agents" (based on `session.status`, busy/idle), rendered in a separate floating window rather than the sidebar — **directly portable to the sidebar**.
- **OMO-Slim data pipeline pattern**: the server-side event handler writes state to a disk snapshot (`tui-state.json`), and the TUI side polls it every 1s; alternatively, the TUI can subscribe to `api.event` directly.

## 3. Approach selection

**A standalone OpenCode TUI plugin (npm package) that coexists with OMO-Slim, rather than modifying OMO-Slim.**

Rationale:
- OMO-Slim has no external plugin API; modifying it would require a fork and taking on upgrade/maintenance costs.
- The sidebar content slot supports multiple stacked plugins, so a standalone plugin is zero-intrusion.
- A standalone package can be published/reused and matches the user's intent to "create a separate new bun project".

Architecture:
- **Server side** (optional): subscribe to `session.*` events, maintain running-subagent state (in-memory Map or a disk snapshot), and feed the UI.
- **TUI side**: register the `sidebar_content` slot to render the status list, and call `api.renderer.requestRender()` to trigger refreshes.
- Both sides can live in one package (a single npm package exporting both the server entry and the `./tui` subpath), or the TUI side alone can subscribe to `api.event` directly.

## 4. Project structure

```
opencode-agent-pulse/                    # bun project
├── package.json                     # name / main: dist/index.js
│                                    # exports["./tui"]: dist/tui.js
│                                    # engines: { opencode: "^1.0.0" }
├── tsconfig.json
├── src/
│   ├── index.ts                     # server plugin (optional): session events → state maintenance
│   └── tui.ts                       # default export { id, tui }
│                                    #   api.slots.register sidebar_content
│                                    #   api.event.on("session.created"/"session.status")
│                                    #   api.renderer.requestRender()
│                                    #   api.lifecycle.onDispose()
├── dist/                            # bun build output
└── README.md
```

## 5. Implementation steps

1. **Initialize the project**: `bun init`, install dependencies `@opencode-ai/plugin`, `@opentui/core`, `@opentui/solid`, `typescript`.
2. **Configure package.json**: `main: dist/index.js`, `exports["./tui"]`, `engines.opencode`.
3. **Implement the state data layer**: subscribe to `session.created` / `session.status` / `session.deleted`, filter subagent sessions via `parentID`, maintain a `Map<sessionId, { agent, status, createdAt }>`.
4. **Implement TUI rendering**: `api.slots.register({ order: ~950, slots: { sidebar_content() {...} } })`, render the list with `@opentui/solid` (name, agent, busy/idle, elapsed); call `api.renderer.requestRender()` on state changes. **Section is collapsible**: a small arrow (▸/▾) in the header expands/collapses it on click, matching the built-in MCP/TODO section interaction; collapse state is stored locally, with `requestRender()` on toggle (check `@opentui` for a collapse component first).
5. **Cleanup**: `api.lifecycle.onDispose(() => unsubscribe/clear timers)`.
6. **Build**: `bun build src/tui.ts --outdir dist --target ...` (following opencode plugin bundling conventions).
7. **Local registration** (see next section).
8. **Manual verification** (see verification checklist).
9. **(Optional) Notification enhancement**: notify on subagent completion/error — use `node-notifier` (SnoreToast) to post Windows toasts on `win32`, and `api.attention.notify({ sound: { name: "subagent_done" } })` on other platforms. **Note**: Windows Terminal does not support OSC 99 / DEC 1004, so `api.attention.notify` on Windows by default only plays a sound without showing a notification (issue #35055); native toasts require the plugin to bundle a node-notifier/PowerShell solution.

## 6. Registering with local OpenCode (`C:\Users\Zouyu\.config\opencode`)

1. Dependency install: add the dependency (`file:<project path>` or `bun link`) to `~/.config/opencode/package.json`.
2. Add the package name to the `"plugin": [...]` array in `opencode.json` (currently already contains `oh-my-opencode-slim`).
3. Also add it to the `"plugin": [...]` array in `tui.json` (OMO-Slim is listed in both; the npm package should load automatically via `exports["./tui"]` in theory, dual registration is belt-and-suspenders — confirm by testing).
4. Restart opencode for the change to take effect.

## 7. Verification checklist

- [ ] After `opencode` starts, a custom section appears in the sidebar (coexisting with the OMO-Slim sidebar).
- [ ] Launch a subagent delegation (e.g., /agent, Task tool) and the subagent immediately appears in the sidebar (busy).
- [ ] After the subagent completes, the status changes to idle/completed and is correctly removed/archived.
- [ ] With multiple parallel subagents, the list is correct with no overlap (order takes effect).
- [ ] The section header has a small arrow and can be collapsed/expanded (interaction aligned with the built-in MCP/TODO sections).
- [ ] When opening/switching sessions, `sidebar_content`'s `props.session_id` behaves as expected.
- [ ] No lingering processes/timers on exit (onDispose takes effect).
- [ ] No type errors in the console, no accidental `server` export warnings.

## 8. Known limitations and risks

- **TUI only**; Web/desktop depends on upstream issue #5971 landing. Architecturally, this plugin reserves an event layer that can be reused.
- `sidebar_title`/`sidebar_footer` are single-winner mode; multiple plugins registering them would conflict; this plan only uses `sidebar_content`.
- If events are maintained on the server side and the TUI polls a snapshot (the OMO-Slim pattern), there is up to ≤1s latency; subscribing directly inside the TUI is real-time but state must be rebuilt on UI remounts.
- The TUI npm plugin loading path (`exports["./tui"]` vs `tui.json`) needs to be confirmed by initial manual testing.
- OpenCode version upgrades may change the TUI plugin API (current baseline 1.18.9, `engines` constrained to `^1.0.0`).
- **Windows native notifications are unavailable by default**: notifications depend on the terminal implementing OSC 99 + DEC 1004 focus tracking; Windows Terminal supports neither → `api.attention.notify`'s notification is silently skipped (sound still works); posting Windows toasts requires the plugin to bundle node-notifier/PowerShell (issue #35055).

## 9. Reference documentation

- Official plugin docs (server hooks only): https://opencode.ai/docs/plugins/
- TUI plugin official spec: https://github.com/anomalyco/opencode/blob/master/packages/opencode/specs/tui-plugins.md
- TUI plugin type definitions: https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/tui.ts
- server plugin types (event hook): https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts
- Built-in subagent status derivation: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/cmd/run/subagent-data.ts
- OMO-Slim repository: https://github.com/alvinunreal/oh-my-opencode-slim (`src/tui.ts`, `src/companion/manager.ts`, `docs/companion.md`)
- Reference plugin: https://github.com/prevalentWare/opencode-goal-plugin
- Web sidebar proposal (unmerged): https://github.com/sst/opencode/issues/5971
- Windows notification unavailable issue (OSC 99/DEC 1004): https://github.com/anomalyco/opencode/issues/35055

## 10. Local environment baseline (inspection notes)

- OpenCode: 1.18.9 (`@opencode-ai/cli@1.18.9`, global npm)
- Plugin SDK: `@opencode-ai/plugin@1.18.9`
- OMO-Slim: `oh-my-opencode-slim@2.2.8` (npm package, installed under `~/.config/opencode`, dual-registered in `opencode.json` + `tui.json`)
- TUI rendering dependencies: `@opentui/core`, `@opentui/solid` already present in `~/.config/opencode/node_modules`
