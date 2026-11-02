# opencode-agent-pulse

An OpenCode 2.x TUI plugin that live-displays **running subagents** (sub-agents/tasks) in the sidebar — name, owning agent, busy/idle status, and elapsed time. Coexists with [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) (OMO-Slim) without interfering.

## Features

- TUI only (OpenCode has no `webview`/`activityBar`; Web/desktop is unsupported).
- Data source: the host-projected V2 data layer — `context.data.session.list()` / `get()` / `status()` / `family()`. Sub-sessions are identified by `SessionInfo.parentID`; running/idle comes from `session.status` (fed by V2 `session.execution.*` events); elapsed time uses the session's own `time.busy` / `time.idle` timestamps.
- Collapsible sidebar section: a small `▸`/`▾` arrow in the header toggles it on click, matching the built-in MCP/TODO sections. The open/closed state is persisted with `context.storage.store("view", …)`, so it survives restarts and hot reloads.
- Click-through: click a row to jump into that sub-session (`context.ui.router.navigate({ type: "session", sessionID })`).
- Notifications (see below): subagent-batch completion, main-session turn completion, and interview waits (form / permission), each independently toggleable, with an optional "only when unfocused" gate and Windows Action Center toast support.
- Internationalization: notification messages and the section title are localized — English (`en`, default) and Simplified Chinese (`zh`).
- Multi-plugin stacking: claims `sidebar.content` with `prepend`, so it stays visible above the built-in Context/MCP/Todo blocks and never touches the single-winner `sidebar.*` areas.

## Installation

```bash
bun install
bun run build   # produces dist/index.js and dist/tui.js
```

## Registering with OpenCode 2.x (user config directory `~/.config/opencode`)

1. Add the dependency in `~/.config/opencode/package.json` (or install from npm):

   ```jsonc
   "opencode-agent-pulse": "file:<absolute path to this project>"
   ```

   Then run `bun install` (or use `bun link`).

2. Add the package to the V2 `plugins` array in `opencode.json`:

   ```jsonc
   "plugins": [
     { "package": "opencode-agent-pulse", "options": { "notifications": { "onlyWhenUnfocused": true } } }
   ]
   ```

   A plain string enables the plugin without options:

   ```jsonc
   "plugins": ["opencode-agent-pulse"]
   ```

3. Restart `opencode`.

OpenCode 2.x reads `plugins` from `opencode.json`; the V1 `tui.json` is not used. If your config still has a V1 `"plugin"` array, OpenCode migrates it, but new configs should use `plugins`.

### Package exports

| Export | Module | Purpose |
|---|---|---|
| `.` | `dist/index.js` | No-op V2 server plugin (keeps the package valid in the server plugin registry) |
| `./tui` | `dist/tui.js` | V2 TUI plugin: `Plugin.define({ id, setup })` |

## Notifications

OpenCode 2.x already ships a built-in notifications plugin (`opencode.notifications`) that covers session/subagent completion and permission/form waits. The pulse notification channels therefore default to **off**; enable only the ones you want, and disable the built-in plugin if you prefer the pulse versions. To disable the built-in one:

```jsonc
"plugins": ["-opencode.notifications", "opencode-agent-pulse"]
```

On Windows the built-in attention path cannot show a system notification (Windows Terminal does not implement OSC 99 + DEC 1004 — issue #35055), so this plugin posts a real Action Center toast via `node-notifier` (bundled SnoreToast.exe). On other platforms it uses `context.attention.notify()`.

Options (object form in the `plugins` array):

```jsonc
"plugins": [
  {
    "package": "opencode-agent-pulse",
    "options": {
      "locale": "zh",
      "notifications": {
        "subagents": true,
        "mainSession": false,
        "interview": true,
        "onlyWhenUnfocused": true
      },
      "sidebar": { "showFocus": false }
    }
  }
]
```

| Option | Default | Effect |
|---|---|---|
| `notifications.subagents` | `false` | Notify when all delegated subagents of a batch have finished |
| `notifications.mainSession` | `false` | Notify when the main (top-level) session finishes a conversation turn |
| `notifications.interview` | `false` | Notify when the main session is blocked waiting for user input (form / permission approval) |
| `notifications.onlyWhenUnfocused` | `false` | Only send notifications while the terminal window is unfocused. On non-Windows terminals it uses DEC 1004 focus reporting via the renderer. On Windows it checks the Win32 foreground window (`GetForegroundWindow`) against the plugin's process ancestry. When focus cannot be determined, notifications are sent as usual |
| `locale` | `"en"` | Language for user-facing strings (notification messages + sidebar section title). Supported: `"en"`, `"zh"` |
| `sidebar.showFocus` | `false` | Show a small diagnostic line with the current focus state (`focus[backend] ●focused / ○blurred fg=<pid>`) |

## Usage

After starting OpenCode, trigger a subagent delegation (Task tool or an agent command) and the "Subagents" section appears at the top of the sidebar, showing each subagent's name, owning agent, status (`busy` / `retry` / `idle` / `done` / `error` / `stopped`), and elapsed time in real time. Click the header to collapse/expand it.

## Project structure

```
├── package.json      # exports: "." -> server plugin, "./tui" -> TUI plugin
├── tsconfig.json     # strict + @opentui/solid JSX config
├── src/
│   ├── index.ts      # no-op V2 server plugin (Plugin.define)
│   ├── tui.tsx       # V2 TUI plugin: sidebar.content slot + V2 event subscriptions
│   ├── notification.ts  # notification dispatch (non-Windows attention vs Windows node-notifier toast)
│   ├── i18n.ts       # locale strings ("en" / "zh")
│   └── windows-focus.ts  # Windows-only foreground-window focus detection (bun:ffi + PowerShell fallback)
├── scripts/
│   ├── build.ts         # Bun.build + @opentui/solid plugin (Solid JSX transform)
│   ├── smoke-2.0.ts     # module shape + setup smoke test
│   └── render-smoke.ts  # renders the sidebar twice and asserts reactive updates
└── dist/             # bun build output
```

## Notes

- The TUI module is a V2 definition: `export default Plugin.define({ id, setup })`. `setup(context)` registers the slot and event subscriptions; its returned cleanup removes them.
- The TUI entry must not export `server`. OpenCode resolves the server and TUI entries from separate exports (`.` and `./tui`).
- `scripts/build.ts` compiles `src/tui.tsx` with `@opentui/solid`'s Bun plugin. This is required: a plain `bun build` emits eager JSX props, which freezes the sidebar after the first frame. `@opencode/plugin`, `@opentui/*`, `solid-js`, and `node-notifier` stay external so the plugin shares the host's runtime instances.
- Subagents left over from a resumed old session are not shown until they run again; currently running subagents are picked up on mount.
- `bun run typecheck && bun run build && bun run smoke` is the local verification gate. The smoke test checks the V2 module/setup contract and then renders the sidebar twice with a mutating mock store, asserting that the frame changes (a regression guard for the Solid transform).
