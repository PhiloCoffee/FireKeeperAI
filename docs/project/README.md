# Fire Keeper AI 项目概览

Fire Keeper AI 是一个本地优先的规划助手，采用《黑暗之魂》风格界面。产品围绕一个实用的双栏工作区展开：

- 左侧是篝火账册，用于记录任务和查看任务状态。
- 右侧是指引区域，用于与 Claude 支持的规划助手对话。

应用可以有氛围感，但必须先像日常工具一样好用。主题不应遮挡任务状态、降低对比度，或拖慢常用操作。

## 功能区域

- [任务账册](task-ledger.md)：任务类型、状态、筛选、编辑，以及魂系风格的派生计数。
- [AI 指引](ai-guidance.md)：Claude 流式对话与任务上下文。
- [本地化](localization.md)：英文与简体中文界面行为。
- [主题与资产](theme-and-assets.md)：黑魂风格视觉与资产组织。
- [存储与导出](storage-and-export.md)：SQLite 持久化与 Markdown 导出。
- [测试与质量](testing-and-quality.md)：当前检查与测试覆盖预期。
- [文档站点](docs-site.md)：静态文档构建、截图资产与 GitHub Pages 部署。
- [开发日志与更新记录](dev-log.md)：从 `0.0.1` 到 `1.0.0` 的版本时间线。

## 产品原则

- 本地优先数据：用户任务和对话数据保存在本地 `data/` 目录。
- 后端管理 AI 访问：浏览器端永远不直接调用 Claude。
- 工作流优先于装饰：视觉风格服务于任务流。
- 小而可测的逻辑单元：交互规则尽量放在纯函数模块。
- 人类可读备份：Markdown 导出在不运行应用时也应该有用。

## 当前入口文件

- 前端应用壳：`apps/web/src/App.jsx`
- 前端任务规则：`apps/web/src/taskLogic.js`
- 前端本地化：`apps/web/src/i18n.js`
- 前端 API 客户端：`apps/web/src/api/client.js`
- 后端服务器：`apps/api/src/server.js`
- 任务服务：`apps/api/src/services/taskService.js`
- Claude 服务：`apps/api/src/services/claudeService.js`
- 导出服务：`apps/api/src/services/exportService.js`

## 相关设计记录

- `docs/design/0202_AI_Web_GUI_Plan.md`
- `docs/design/0203_fire_keeper_interaction_design.md`
