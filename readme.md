# Fire Keeper AI

Fire Keeper AI 是一个《黑暗之魂》风格、本地优先的任务规划与 AI 指引助手。它包含 React 工作台、本地 SQLite 持久化、Claude 流式对话、中英双语界面、Markdown 导出，以及一层篝火风格的任务状态。

> May the flames guide thee.

## 功能

- 记录、编辑、筛选、删除和燃火任务。
- 将任务分类为首领、精英、普通或琐事。
- 跟踪任务状态：新建、进行中、受阻、已燃火。
- 展示灵魂、人性、原素瓶和篝火低语等魂系风格计数。
- 通过后端代理与 Claude 对话，并可把当前未完成任务作为上下文。
- 将任务摘要导出为 Markdown 到 `data/exports`。
- 在英文与简体中文之间切换。
- 使用本地黑魂风格资产作为私人 fan prototype 界面。

## 文档

项目文档位于 [docs](docs/index.md)，默认语言为中文，英文版本位于 [docs/en](docs/en/index.md)。

- [项目概览](docs/project/README.md)
- [任务账册](docs/project/task-ledger.md)
- [AI 指引](docs/project/ai-guidance.md)
- [本地化](docs/project/localization.md)
- [主题与资产](docs/project/theme-and-assets.md)
- [存储与导出](docs/project/storage-and-export.md)
- [测试与质量](docs/project/testing-and-quality.md)
- [文档站点](docs/project/docs-site.md)
- [开发日志与更新记录](docs/project/dev-log.md)

设计历史和规划记录位于 [docs/design](docs/design)。

## 技术栈

- 前端：React 19, Vite, CSS, lucide-react
- 后端：Express 5, Claude API via `@anthropic-ai/sdk`
- 存储：Node SQLite through `node:sqlite`
- 运行时数据：本地 `data/` 目录
- 测试：Node built-in `node:test`
- 文档：`marked` + 本地静态构建脚本

## 项目结构

```text
FireKeeperAI/
  apps/
    api/
      src/
        db/
        routes/
        services/
      test/
    web/
      src/
        api/
        assets/
        App.jsx
        i18n.js
        taskLogic.js
      test/
  data/
    exports/
    firekeeper.sqlite
  docs/
    en/
    project/
    assets/
  scripts/
  package.json
```

## 安装

```bash
npm install
```

从 `.env.example` 创建本地 `.env`：

```bash
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-6
PORT=8787
WEB_ORIGIN=http://localhost:5173
```

## 开发

```bash
npm run dev
```

默认地址：

- Web: `http://localhost:5173`
- API: `http://localhost:8787`

如果 PowerShell 执行策略阻止 `npm`，使用 `npm.cmd`：

```bash
npm.cmd run dev
```

如果 API 端口被占用，可给前端 dev server 设置 `API_ORIGIN`：

```bash
$env:API_ORIGIN="http://127.0.0.1:8799"
npm.cmd run dev:web
```

## 验证

```bash
npm.cmd test
npm.cmd run build
npm.cmd run docs:build
```

当前测试覆盖任务筛选/计数、魂系风格任务计数、API client 事件解析、任务输入验证、语言 fallback/格式化，以及 Claude 任务上下文本地化。

## 资产说明

当前《黑暗之魂》和防火女视觉资产包含游戏或粉丝内容，仅适合本地/私人 fan prototype。公开发布前应替换为原创或拥有合适授权的美术资产。

## Original Soul

**Bonfire Lit** by Holly Du  
https://chatgpt.com/g/g-6788056bb1b48191aa120623ed0232f3-bonfire-lit

![GPTs](docs/asset/GPTs.png)
