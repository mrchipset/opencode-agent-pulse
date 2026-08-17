/**
 * Internationalization (i18n) for opencode-agent-pulse.
 *
 * Supported locales: English ("en", default) and Simplified Chinese ("zh").
 * The locale is selected via the plugin `locale` option (tuple form):
 *
 *   ["opencode-agent-pulse", { "locale": "zh" }]
 *
 * Only user-facing strings (notification messages and the sidebar section title)
 * are localized; internal status labels ("busy"/"idle"/"retry"/"done") remain
 * English as stable identifiers.
 */

export type Locale = "en" | "zh";

export interface Messages {
  /** Sidebar section title. */
  subagents: string;
  /** Notification when a batch of subagents finishes. */
  subagentsDone: (count: number) => string;
  /** Notification when the main session finishes a turn. */
  turnDone: string;
  /** Notification when the main session needs a permission approval. */
  permissionRequired: (detail?: string) => string;
  /** Notification when the main session needs an answer to a question. */
  questionRequired: (detail?: string) => string;
}

const dictionaries: Record<Locale, Messages> = {
  en: {
    subagents: "Subagents",
    subagentsDone: (count) =>
      count > 1 ? `All ${count} subagents completed` : "Subagent completed",
    turnDone: "Turn completed",
    permissionRequired: (detail) =>
      detail ? `Permission required: ${detail}` : "Main session requires permission",
    questionRequired: (detail) =>
      detail ? `Answer required: ${detail}` : "Main session requires an answer",
  },
  zh: {
    subagents: "子 agent",
    subagentsDone: (count) =>
      count > 1 ? `全部 ${count} 个子 agent 已完成` : "子 agent 已完成",
    turnDone: "本轮对话已完成",
    permissionRequired: (detail) =>
      detail ? `需要权限确认: ${detail}` : "主会话需要权限确认",
    questionRequired: (detail) =>
      detail ? `需要回答: ${detail}` : "主会话需要回答询问",
  },
};

/** Normalize an arbitrary option value into a supported locale (defaults to "en"). */
export function resolveLocale(input: unknown): Locale {
  if (input === "zh" || input === "zh-CN" || input === "zh_CN" || input === "zh-Hans") {
    return "zh";
  }
  return "en";
}

/** Get the message dictionary for a locale (falls back to English). */
export function t(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}
