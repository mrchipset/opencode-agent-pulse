import type { Plugin, Hooks } from "@opencode-ai/plugin";

/**
 * Server-side plugin entry.
 *
 * The TUI entry (`./tui`) already subscribes to `session.*` events directly,
 * so the server side deliberately does NOT duplicate state maintenance (see
 * AGENTS.md: "pick one data source on either side; do not duplicate"). This entry exists to give the
 * package a valid `main`/`.` export and a future place to persist a snapshot
 * if cross-restart state recovery is ever needed.
 */
const plugin: Plugin = async () => {
  return {
    name: "opencode-agent-pulse",
    event: async ({ event }) => {
      // The TUI side already subscribes to session.* events directly; no duplicate maintenance here.
      // Reserved: if cross-session/remount state recovery is needed, subscribe to session.* here and write a disk snapshot.
      void event;
    },
  } satisfies Hooks & { name: string };
};

export default plugin;
