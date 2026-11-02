import { Plugin } from "@opencode/plugin";

/**
 * Server-side plugin entry.
 *
 * The TUI entry (`./tui`) reads OpenCode 2.x's already-projected session data
 * (`context.data`), so this package deliberately keeps no duplicate server-side
 * state. This no-op definition exists so the package still has a valid `main` /
 * `.` export in the V2 plugin registry; TUI discovery uses the separate
 * `./tui` export.
 */
const plugin = Plugin.define({
  id: "opencode-agent-pulse",
  setup() {
    // Read-only TUI plugin: nothing to hook on the server.
  },
});

export default plugin;
