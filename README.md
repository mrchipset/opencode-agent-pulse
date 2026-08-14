# opencode-agent-pulse

An OpenCode TUI plugin that live-displays **running subagents** (sub-agents/tasks) in the sidebar — name, owning agent, busy/idle status, and elapsed time. Coexists with [oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) (OMO-Slim) without interfering.

## Features

- TUI only (OpenCode has no `webview`/`activityBar`; Web/desktop is unsupported).
- Data sources: `session.created` (identify sub-sessions via `properties.info.parentID`) + `session.status` (busy/idle/retry) + `message.part.updated` (task tool part determines completion) + `session.deleted` / `session.error`.
- Collapsible sidebar section: a small `▸`/`▾` arrow in the header toggles it on click, matching the built-in MCP/TODO sections (collapse state is driven by a solid signal for reactive re-rendering, same as the built-in sections).
- Multi-plugin stacking: only uses the `sidebar_content` slot (`order: 950`, after OMO-Slim's 900) and never touches the single-winner slots `sidebar_title` / `sidebar_footer`.

## Installation

```bash
bun install
bun run build   # produces dist/index.js and dist/tui.js
```

## Registering with OpenCode (user config directory `~/.config/opencode`)

1. Add the dependency in `~/.config/opencode/package.json` (choose one):

   ```jsonc
   "opencode-agent-pulse": "file:<absolute path to this project>"
   ```

   Then run `bun install` (or use `bun link`).

2. Add the package name to the `"plugin": [...]` array in `opencode.json`:

   ```jsonc
   "plugin": ["opencode-agent-pulse"]
   ```

3. Also add it to the `"plugin": [...]` array in `tui.json` (matches OMO-Slim's dual registration; if `exports["./tui"]` already takes effect, the entry in tui.json can be removed).

4. Restart `opencode`.

## Notifications

The plugin can notify when a whole batch of subagents finishes and/or when the main session completes a turn. On Windows it posts a real Action Center toast via `node-notifier` (Windows Terminal cannot show `api.attention.notify` notifications — OSC 99/DEC 1004 unsupported, issue #35055); on other platforms it uses the built-in `api.attention.notify` with the `done`/`subagent_done` sounds.

Both notifications are enabled by default and can be toggled via plugin options (tuple form in the `plugin` array):

```jsonc
// opencode.json and/or tui.json
"plugin": [
  "oh-my-opencode-slim",
  ["opencode-agent-pulse", { "notifications": { "subagents": true, "mainSession": false } }]
]
```

| Option | Default | Effect |
|---|---|---|
| `notifications.subagents` | `true` | Notify when all delegated subagents of a batch have finished |
| `notifications.mainSession` | `true` | Notify when the main (top-level) session finishes a conversation turn |

## Usage

After starting opencode, trigger a subagent delegation (`/agent` or the Task tool) and the "Subagents" section appears in the sidebar, showing each subagent's agent, status (busy/idle/retry/done), and elapsed time in real time. Click the section header to collapse/expand it.

## Project structure

```
├── package.json      # exports: "." -> server plugin, "./tui" -> TUI plugin
├── tsconfig.json     # strict + @opentui/solid JSX config
├── src/
│   ├── index.ts      # server plugin (placeholder; TUI side already subscribes, no duplicate state)
│   └── tui.ts        # TUI plugin: sidebar_content slot + session event subscriptions
└── dist/             # bun build output
```

## Notes

- The TUI plugin module only does `default export { id, tui }`; it does **not** export `server` from the same module (the loader rejects it).
- Rendering follows the same approach as OMO-Slim: local `box`/`text` helper functions (wrapping `@opentui/solid`'s `createElement`/`insert`/`setProp`), so no JSX/babel plugin is needed; the build uses `--external @opentui/core --external @opentui/solid --external solid-js` to reuse the instances provided by the host runtime (`solid-js` provides `createSignal`, ensuring the same reactive runtime is shared with the host's `@opentui/solid`).
- Windows notification limitation: `api.attention.notify` on Windows Terminal by default only plays a sound without showing a system notification (OSC 99/DEC 1004 unsupported, issue #35055); this plugin stays minimal and does not implement notifications.
