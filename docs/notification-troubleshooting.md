# 通知功能排查记录

> 日期：2026-08-14
> 范围：opencode-agent-pulse 插件「对话完成 / 子 agent 完成通知」功能从无通知到修复的完整排查过程。

## 1. 背景

插件目标：侧栏显示子 agent 状态，并在以下时机弹出通知：
- 主会话完成一轮对话（`notifyTurnDone`）
- 一批子 agent 全部完成（`notifySubagentsDone`）

用户实测：侧栏状态正常（子 agent 显示 done），但 Windows 上始终**没有通知弹出**。

## 2. 排查结论（重点）

### 2.1 事件信号（SDK v2 结构）

- **一轮对话完成**：监听 `session.status`，`status.type === "idle"` 即回合结束。
  内置 CLI 在 `packages/opencode/src/cli/cmd/run.ts:788-794` 用 idle 作轮次循环 break 条件；
  `session.status` 由 `session/status.ts:39-48` 发布（置 idle 时同时发 `session.idle`）。
- **子 agent 完成**：监听 `message.part.updated`，过滤 `part.type === "tool" && part.tool === "task"`，
  看 `part.state.status`（`"completed" | "error" | "cancelled"` 为终态）。权威参考 `subagent-data.ts:295-309, 329-331`。
- **⚠️ SDK v2 事件结构**：payload 全部嵌套在 `properties` 下
  （`event.properties.sessionID` / `event.properties.status.type` / `event.properties.part.state.status`）。
  AGENTS.md 骨架里的 `event.sessionID` / `event.status.type` 是 v1 写法，直接使用会拿不到值。
- **不要用 `session.idle` 作为子 agent 完成信号**（deprecated，只代表子会话单轮空闲）。

### 2.2 根因一：bun build 对 `node:*` 内置模块的 polyfill 错误

**现象**：调试日志文件永远不生成。

**根因**：`bun build` 默认会把 `node:fs` / `node:os` 打包成错误的内置 polyfill：

```js
// 错误产物（dist/tui.js）
var { appendFileSync } = (() => ({}));       // appendFileSync 是 undefined
var tmpdir = function () { return "/tmp"; };  // 永远返回 /tmp（Windows 不存在）
```

任何使用 `node:fs` / `node:os` 的代码在运行时都会 throw 并被 best-effort catch 吞掉。

**修复**：build 脚本显式 external 掉 node 内置模块：

```json
"build": "bun build src/index.ts --outdir dist && bun build src/tui.ts --outfile dist/tui.js --external @opentui/core --external @opentui/solid --external solid-js --external node-notifier --external \"node:*\""
```

### 2.3 根因二：node-notifier 顶层静态 import 风险

**现象**：Windows 通知偶尔完全失效、无报错。

**根因**：`import notifier from "node-notifier"` 位于模块顶层。node-notifier 是运行时依赖，
若解析失败整个 TUI 插件模块加载失败（侧栏可能仍由旧构建渲染，造成"插件在跑但通知没有"的错觉）。

**修复**：改为动态加载，失败仅记录、不影响插件主体：

```ts
import("node-notifier")
  .then((mod) => { /* notifier.notify(...) */ })
  .catch(() => { /* best-effort */ });
```

### 2.4 根因三：主会话完成判定条件过于严格

**现象**：`notifyTurnDone` 不触发。

**根因**：原实现依赖 `session.status` 历史状态 Map 记录 `prev === "busy"` 才在 idle 时通知。
事件乱序或漏收 busy 事件时判定失败。

**修复**：改为与内置 `notifications.ts` 一致的 **armed-flag** 模式：

```ts
if (!running.has(sessionID)) {
  if (type === "busy" || type === "retry") mainArmed.add(sessionID);
  else if (type === "idle" && mainArmed.has(sessionID)) {
    mainArmed.delete(sessionID);
    notifyTurnDone(api).catch(() => {});
  }
}
```

### 2.5 排查方法论（对后续有用的经验）

1. **通知链路的所有 `.catch(() => {})` 都会吞错误**——必须加临时文件日志/console 日志才能观测。
2. **调试日志写入前必须 `mkdirSync(..., { recursive: true })`**，否则目标目录不存在时 appendFileSync 静默失败。
3. **TUI 插件 console.error 会被 opencode 服务器日志捕获**，可作第二观测通道。
4. 验证加载的是否为新构建：比对 `dist/tui.js` 的 LastWriteTime 与 opencode 进程 StartTime，
   以及 node_modules junction 指向。
5. 最终链路证据（修复后）：

```
busy → mainArmed.add → idle → armed=true → turn done fired
→ notifyTurnDone → dispatch → windowsNotify → node-notifier callback
```

## 3. 修复清单

| 文件 | 改动 |
|---|---|
| `package.json` | build 脚本加 `--external "node:*"`；dependencies 加 `node-notifier@^10.0.1`；devDependencies 加 `@types/node-notifier` |
| `src/notification.ts` | 新增：平台分支通知调度（Windows→node-notifier / 其他→`api.attention.notify`）；node-notifier 动态加载 |
| `src/tui.ts` | `session.status` 主会话 armed-flag 完成通知；`message.part.updated` task part 批量完成通知（callID 计数 + roundNotified 去重） |
| `dist/tui.js` | 重新构建产物 |

## 4. 遗留事项

- 改动尚未提交 git（本记录提交时一并提交）。
- 未做端到端自动化验证；Windows toast 需人工触发一次子 agent 委派确认。
