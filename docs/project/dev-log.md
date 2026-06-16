# 开发日志与更新记录

这份日志根据现有 git 提交整理 Fire Keeper AI 的真实历史，并保留一条从 `0.0.1` 到 `1.0.0` 的样例版本路线。

## 如何维护

新增里程碑时使用以下格式：

```text
## x.y.z - YYYY-MM-DD - 里程碑名称

- 来源：commit hash、PR，或 "working tree"。
- Added:
- Changed:
- Fixed:
- Docs:
```

规则：

- 使用提交或发布工作的准确日期。
- 能映射到 git 历史时保留 commit hash。
- 尚未提交的本地工作标记为 `Working tree`。
- 优先记录用户可感知的变化，而不是内部噪音。
- 只有实现已经存在时，才把计划项推进为版本项。

## 时间线

| 日期 | 版本 | 来源 | 里程碑 |
| --- | --- | --- | --- |
| 2025-02-01 | `0.0.1` | `43c9977` | 项目概念、技术方向和第一版 Fire Keeper AI README。 |
| 2025-02-01 | `0.0.2` | `5ba4c7b` | 仓库基础，包含 `.gitignore` 与 MIT license。 |
| 2025-02-01 | `0.0.3` | `7daaff6`, `c5355f5` | 主分支合并、Bonfire Lit proposal PDF、GPT 截图与 README 扩展。 |
| 2026-05-26 | `0.1.0` | `d26896b` | 第一版可运行应用：React/Vite 前端、Express 后端、SQLite、Claude 流式对话、任务、导出和测试。 |
| 2026-06-11 | `0.2.0` | `fa1755e` | 防火女交互与资产：更丰富的任务逻辑、本地资产、主题 UI 和任务逻辑测试。 |
| 2026-06-11 | `0.3.0` | `dd261b2` | 中英双语界面、本地化后端 prompt/导出文本和 i18n 测试。 |
| 2026-06-15 | `0.4.0` | Working tree | 代码库硬化：任务验证、SSE 解析、API 错误处理、文档清理和更完整的测试。 |
| 2026-06-15 | `0.5.0` | Working tree | 静态文档站点、GitHub Pages workflow、本地程序截图、依赖 audit 清理和 Vite 8 升级。 |
| 计划 | `0.6.0` | Future | 任务元数据完善：截止时间、标签、更丰富筛选和编辑体验。 |
| 计划 | `0.7.0` | Future | AI 辅助任务捕获，以及从聊天中接受/编辑任务建议的流程。 |
| 计划 | `0.8.0` | Future | 导入/导出成熟度、本地备份恢复、对话/任务归档视图。 |
| 计划 | `0.9.0` | Future | Release candidate：无障碍、响应式 QA、资产授权清理和部署演练。 |
| 计划 | `1.0.0` | Future | 稳定本地优先版本：新用户可根据文档安装、运行、使用、导出并理解应用。 |

## 更新记录

## 0.5.0 - 2026-06-15 - 静态文档与发布卫生

- 来源：Working tree。
- Added:
  - 使用 `scripts/build-docs.mjs` 构建静态 Markdown 文档站。
  - 使用 `scripts/preview-docs.mjs` 本地预览文档。
  - 在 `.github/workflows/docs.yml` 中加入 GitHub Pages 部署 workflow。
  - 从本地运行中的 UI 截图，并保存到 `docs/assets/screenshots/`。
  - 新增文档站点说明页，记录 docs 技术栈与部署路径。
- Changed:
  - 前端 dev proxy 支持 `API_ORIGIN`，用于避开本地 API 端口冲突。
  - Vite 升级到 `^8.0.16`。
  - `concurrently` 升级到 `^10.0.3`。
- Fixed:
  - 依赖升级后清空当前 npm audit findings。
- Docs:
  - 在文档首页、任务账册、本地化和主题文档中引用程序截图。
  - 加入 docs build 和 preview 命令。

## 0.4.0 - 2026-06-15 - 代码硬化与文档清理

- 来源：Working tree。
- Added:
  - 纯任务验证 helper 与测试。
  - API client Server-Sent Event parser 与测试。
  - `docs/project/` 下的项目文档。
- Changed:
  - 任务草稿规范化会在进入 UI 前验证 class 和 status。
  - 任务计数会忽略未知 class/status bucket，避免意外 UI key。
  - 任务服务会在持久化前规范化标题、优先级和标签。
  - 新增任务、燃火、删除、导出和聊天失败时，界面会给用户明确错误提示。
- Fixed:
  - 空任务标题会在 service 和 route 层一致拒绝。
  - 无效 JSON 请求体返回 `400`，不再是通用 server error。
  - 最早设计记录里的过时任务标记已改成历史上下文。
- Docs:
  - README 和项目文档与当前任务、导出、测试和资产行为对齐。

## 0.3.0 - 2026-06-11 - 双语防火女

- 来源：`dd261b2`。
- Added:
  - 英文/简体中文前端本地化。
  - 后端 Claude prompt、任务上下文和 Markdown 导出的语言文案。
  - 前端语言行为测试。
  - Claude 任务上下文本地化测试。
- Changed:
  - 前端会把当前语言发送给聊天和导出 API。
  - README 扩展了语言行为与术语说明。
- Docs:
  - 记录“防火女”“篝火”“誓约”等中文术语约定。

## 0.2.0 - 2026-06-11 - 主题交互与资产

- 来源：`fa1755e`。
- Added:
  - 按用途组织的黑魂风格本地/来源视觉资产。
  - Steam、本地截图和防火女参考图 asset manifest。
  - 防火女交互设计记录。
  - 纯任务逻辑 helper 和任务逻辑测试。
- Changed:
  - 主应用获得更强的防火女氛围、任务筛选和主题化交互样式。
  - 任务布局和 CSS 扩展为更完整的双栏应用外壳。
- Docs:
  - 新增资产库 README 与交互设计文档。

## 0.1.0 - 2026-05-26 - 第一版可运行应用

- 来源：`d26896b`。
- Added:
  - React/Vite 前端 workspace。
  - Express 后端 workspace。
  - tasks、conversations 和 messages 的 SQLite schema。
  - 任务 routes 与 service layer。
  - Claude 流式聊天 route 与 service layer。
  - Markdown 导出 route 与 service layer。
  - Vite proxy 和根 workspace scripts。
  - GUI planning 设计记录。
- Docs:
  - README 更新了 setup 和项目方向。

## 0.0.3 - 2025-02-01 - Proposal 与 README 扩展

- 来源：`7daaff6`, `c5355f5`。
- Added:
  - Bonfire Lit proposal PDF。
  - GPT 截图资产。
  - README 扩展了项目原始灵魂说明。
- Changed:
  - 初始分支合并进主项目线。

## 0.0.2 - 2025-02-01 - 仓库基础

- 来源：`5ba4c7b`。
- Added:
  - 初始 `.gitignore`。
  - MIT license。

## 0.0.1 - 2025-02-01 - 概念种子

- 来源：`43c9977`。
- Added:
  - 第一版 Fire Keeper AI 技术方向记录。
  - 初始 README。
  - 围绕本地优先存储、GUI 技术、LLM 选择和黑魂风格视觉方向的早期决策。

## 通往 1.0.0

下面的路线是抽样式路线图，不追求穷尽。它用于给项目提供明确的 release checkpoint，而不是把每个小改动都塞进版本号。

| 目标 | 主题 | 完成标准 |
| --- | --- | --- |
| `0.6.0` | 任务元数据 | 截止时间和标签可在 UI 中编辑，有测试覆盖，并能导出到 Markdown。 |
| `0.7.0` | AI 任务流 | 聊天可以提出结构化任务，用户可以接受/编辑，任务上下文保持本地化。 |
| `0.8.0` | 数据可携带性 | Markdown 导出补充导入/恢复或归档流程，强化本地优先耐久性。 |
| `0.9.0` | 发布候选 | 无障碍、响应式布局、错误状态、setup 文档和资产授权完成审阅。 |
| `1.0.0` | 稳定发布 | 新用户无需开发者帮助，就能按文档安装、运行、使用、导出并理解应用。 |
