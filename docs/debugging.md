# opencode-agent-pulse 插件调试指南

本文档记录如何在 VS Code 中用断点调试本插件（TUI 部分为主），包含完整的环境准备、操作步骤、原理说明与排查记录。

> 适用环境：Windows + VS Code + Bun。opencode 源码版与安装版均为 **1.18.x** 系列。

---

## 1. 背景：为什么调试 opencode 插件不简单

本插件（`opencode-agent-pulse`）不是独立可执行程序，它运行在 **opencode 宿主进程内**：

```
┌─────────────────────────────────────────────────────────┐
│ opencode TUI 主进程 (bun)                                 │
│   ├─ TUI 渲染器 (@opentui/core + opentui.dll 原生核心)    │
│   ├─ TUI 插件宿主 ──加载本插件的 src/tui.ts────> 调试目标   │
│   └─ Worker 线程 ──opencode server（server 插件运行处）    │
└─────────────────────────────────────────────────────────┘
```

三个关键事实决定了调试方式：

1. **安装版 `opencode.exe` 不支持 `--inspect`**。它是 bun 编译的独立二进制，实测传入 `--inspect=ws://localhost:6499/` 后没有任何 inspector 端口监听，无法附加调试器。
2. **唯一可行的调试方式**：用 bun 直接从 opencode **源码仓库**启动（`bun run --inspect=... src/index.ts`），再把 VS Code 的 Bun 调试器 attach 到该进程。opencode 官方 CONTRIBUTING 也是这么建议的。
3. **TUI 插件代码运行在 TUI 主进程**，所以断点能命中；**server 插件代码运行在 Worker 线程**，在 `bun run` 模式下官方文档说明断点可能不生效（有专门的 serve 模式解决，见 §6）。

---

## 2. 一次性环境准备

### 2.1 安装 VS Code Bun 扩展

本项目 `.vscode/extensions.json` 已声明推荐 `oven.bun-vscode`。打开插件项目时右下角会提示安装；没有提示就手动安装。

### 2.2 准备 opencode 源码仓库

调试需要 opencode 源码在本地可运行：

```powershell
cd C:\Users\Zouyu\CodeReviews\opencode
bun install        # 约 4~5 分钟，Windows 下无原生编译
```

> 版本提示：源码仓库当前在 `dev` 分支（1.18.3），比安装版（1.18.9）旧。插件 API 兼容，可正常调试；若需版本完全一致，请先把源码仓库切换到对应 tag。

### 2.3 修复 opencode 原生核心缺失（关键！）

**现象**：`bun run` 从源码启动 opencode 时，TUI 渲染器 `createCliRenderer()` 卡死，只有 inspector 横幅，界面永远出不来。

**根因**：TUI 渲染器依赖原生库 `@opentui/core-win32-x64`（内含 `opentui.dll`，Zig 编写的 FFI 核心）。`bun install` 把它装进了 bun 的 store（`node_modules/.bun/...`），却**没有链接到 opencode 工作区**的 `node_modules`，导致源码运行时 `import("@opentui/core-win32-x64")` 失败、渲染器初始化挂起。安装版 exe 不受影响是因为原生库被直接打进了二进制。

**修复**：手动创建 junction 把 store 里的原生包链接进工作区：

```powershell
New-Item -ItemType Junction -Path "C:\Users\Zouyu\CodeReviews\opencode\packages\opencode\node_modules\@opentui\core-win32-x64" `
  -Target "C:\Users\Zouyu\CodeReviews\opencode\node_modules\.bun\node_modules\@opentui\core-win32-x64"
```

验证（应在 `packages/opencode` 目录下成功打印 DLL 路径）：

```powershell
bun -e "import('@opentui/core-win32-x64').then(m => console.log(m.default))"
```

> ⚠️ 若以后在源码仓库重新执行 `bun install`，junction 可能被重建而丢失，需要重新执行上述命令。

### 2.4 让插件直接加载 TS 源码（核心！）

**为什么不用打包产物 + sourcemap**：插件构建时 bun 生成的 sourcemap `sources` 是相对路径 + Windows 反斜杠（`src\tui.ts`），且打包文件带内联 sourcemap 时 bun 调试器的断点映射不可靠——实测断点只能打在 `dist/tui.js` 上，无法映射回 `src/*.ts`。

**方案**：让 opencode 直接加载 `src/tui.ts` 源码。bun 原生转译 TS，调试器直接映射 TS 源码，断点天然可用，且不再需要构建步骤。

修改全局 TUI 配置（`C:\Users\Zouyu\.config\opencode\tui.json`）：

```jsonc
{
  "plugin": [
    "oh-my-opencode-slim",
    [
      "file:///C:/Users/Zouyu/repos/opencode-agent-pulse/src/tui.ts",  // 原来是 dist/tui.js
      { "notifications": { "onlyWhenUnfocused": true } }
    ]
  ]
}
```

两个已验证的事实使这个改法安全：

- `src/tui.ts` 可从任意目录、任意 cwd 通过 `file:///` URL 独立加载（内部 import `@opentui/solid`、`solid-js`、`./notification` 等均从插件项目的 node_modules 正常解析）。
- bun 编译出的独立二进制（与 `opencode.exe` 同类）也能在运行时加载外部 `.ts` 文件，所以**日常使用安装版 opencode.exe 同样生效**。

> 附带收益：插件此后直接跑源码，改完代码只需重启 opencode，**无需 `bun run build`**。

---

## 3. VS Code 调试配置

### 3.1 `.vscode/launch.json`（附加配置）

```jsonc
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "bun",
      "request": "attach",
      "name": "Attach to opencode (ws://localhost:6499)",
      "url": "ws://localhost:6499/",
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

### 3.2 `.vscode/tasks.json`（启动 opencode 源码版）

| 任务 | 作用 |
| --- | --- |
| `Debug: build plugin (with sourcemaps)` | 构建插件 dist（发布场景用） |
| `Debug: start opencode from source (inspector on :6499)` | 从源码启动 TUI，标准调试入口 |
| `Debug: start opencode from source (inspect-wait...)` | 同上，但等待调试器 attach 后才开始执行（适合调试启动早期代码） |
| `Debug: start opencode server only (serve :4096...)` | 只启动 server（调试 server 插件用） |

任务内已配置 `"cwd": "C:/Users/Zouyu/CodeReviews/opencode"`，**在插件项目里直接运行任务即可，无需手动切目录**。

---

## 4. 标准调试流程（TUI 插件，日常主用）

**第 1 步 — 启动 opencode（源码版）**

VS Code 菜单：**终端 → 运行任务...** → 选 **`Debug: start opencode from source (inspector on :6499)`**

内部执行的等价命令：

```powershell
cd C:\Users\Zouyu\CodeReviews\opencode
bun run --inspect=ws://localhost:6499/ --cwd packages/opencode --conditions=browser ./src/index.ts
```

参数说明：
- `--inspect=ws://localhost:6499/`：开启 Bun inspector（F5 attach 的目标）
- `--cwd packages/opencode`：切到 opencode 包目录，保证模块解析正确
- `--conditions=browser`：browser 导入条件（TUI 运行必需）
- `./src/index.ts`：opencode CLI 源码入口

启动后等待 TUI 界面出现。

**第 2 步 — attach**

按 **F5**（选择 `Attach to opencode (ws://localhost:6499)`），DEBUG CONSOLE 出现 `Connected` 即成功。

**第 3 步 — 设断点、触发**

在 `src/tui.ts` 中设断点，推荐位置：
- `session.status` 事件处理（约 264 行）— 子 agent 状态变化
- `message.part.updated` 处理（约 309 行）— 子 agent 完成检测
- `sidebar_content` 渲染函数（约 495 行）— 界面渲染

回到 opencode TUI，委派一个子 agent（`/agent` 或 Task 工具），断点命中，即可单步/查看变量。

**第 4 步 — 结束**

在运行 opencode 的终端按 `Ctrl+C` 退出；VS Code 按 `Shift+F5` 断开。

---

## 5. 调试启动早期代码（inspect-wait）

如果要在插件注册（`tui()` 函数体）或首次渲染前停在断点：

1. 运行任务 **`Debug: start opencode from source (inspect-wait, attach before code runs)`**，终端显示等待调试器。
2. 按 F5 attach，代码随后从入口开始执行并停在断点。

---

## 6. 调试 server 插件（`src/index.ts`）

TUI 模式下 server 运行在 Worker 线程，断点通常不生效（bun 源码运行已知限制）。改用 serve 模式让 server 跑在主进程：

**终端 1**：运行任务 **`Debug: start opencode server only (serve :4096, inspector on :6499)`**

等价命令：

```powershell
cd C:\Users\Zouyu\CodeReviews\opencode
bun run --inspect=ws://localhost:6499/ --cwd packages/opencode ./src/index.ts serve --port 4096
```

**终端 2**：连接 TUI 界面：

```powershell
opencode attach http://localhost:4096
```

F5 attach 到 6499 后，`src/index.ts`（通过 `dist/index.js` 加载）的断点可命中。

> 注意：本插件 server 部分当前是空实现，实际调试重点在 TUI 部分（§4）。

---

## 7. 常见问题排查

### 7.1 端口被占用 / attach 连不上

inspector 固定用 6499，同一时间只能运行一个调试实例。确认没有残留进程：

```powershell
netstat -ano | findstr 6499   # 找到 PID 后 Stop-Process -Id <PID> -Force
```

### 7.2 TUI 界面出不来，只有 inspector 横幅

- 检查 §2.3 的 junction 是否还在（`Test-Path "...\node_modules\@opentui\core-win32-x64"`）。
- 若重新 `bun install` 过，重新执行 junction 命令。

### 7.3 断点只能打在 dist/tui.js，打不进 src/tui.ts

- 确认全局 `tui.json` 指向的是 `src/tui.ts`（§2.4），而不是 `dist/tui.js`。
- 确认 opencode 已完全重启（插件模块在启动时加载）。
- 先 attach 成功、TUI 界面出现后再设置断点。

### 7.4 想回到「打包产物」模式

把 `~/.config/opencode/tui.json` 的插件路径改回 `file:///C:/Users/Zouyu/repos/opencode-agent-pulse/dist/tui.js`，然后 `bun run build`。构建已内置 sourcemap 修复脚本（见 §8），发布版依然带可用 sourcemap。

### 7.5 运行任务时提示找不到 bun / 命令失败

任务基于 PowerShell 运行。若 `bun` 在 PATH 中不可用（如 fnm 环境），在 VS Code 终端里先手动执行 `bun --version` 确认，或改用 §4 的等价命令手动启动。

---

## 8. 附：插件构建与 sourcemap 修复脚本

`package.json` 的 build 脚本（当前状态）：

```jsonc
"build": "bun build src/index.ts --outdir dist --sourcemap=inline && bun build src/tui.ts --outfile dist/tui.js --external @opentui/core --external @opentui/solid --external solid-js --external node-notifier --external \"node:*\" --sourcemap=inline && bun run scripts/fix-sourcemaps.ts"
```

`scripts/fix-sourcemaps.ts` 的作用：bun 生成的 sourcemap `sources` 是相对 cwd 的路径（Windows 反斜杠），调试器按脚本所在目录解析会找不到文件。脚本把 `sources` 改写为绝对 `file:///` 路径，保证即使使用 dist 产物也能映射回 `src/*.ts`。

> 实际调试并不依赖它（§2.4 已直接加载 TS 源码），保留它仅为发布版质量与将来回退 dist 模式时可用。

---

## 9. 相关文件清单

| 路径 | 说明 |
| --- | --- |
| `.vscode/launch.json` | Bun attach 配置（ws://localhost:6499） |
| `.vscode/tasks.json` | 启动 opencode 源码版 / serve / 构建 的任务 |
| `.vscode/extensions.json` | 推荐安装 `oven.bun-vscode` |
| `scripts/fix-sourcemaps.ts` | 构建后 sourcemap 路径修复 |
| `src/tui.ts` | 插件 TUI 源码（调试主目标） |
| `C:\Users\Zouyu\.config\opencode\tui.json` | 全局 TUI 配置（插件已指向 src/tui.ts） |

---

## 10. 排查过程速记（为什么是这些步骤）

1. `opencode.exe --inspect` 实测无效 → 放弃附加二进制，转向源码运行。
2. 源码运行 TUI 卡在 `createCliRenderer()` → 用临时日志定位 → 发现 `@opentui/core-win32-x64` 未链接 → junction 修复。
3. attach 成功但断点只能落在 `dist/tui.js` → 检查 sourcemap：`sources` 路径错误 + bun 内联 sourcemap 映射不可靠 → 改为直接加载 `src/tui.ts`（验证了 TS 可独立加载、编译二进制可加载外部 TS）。
