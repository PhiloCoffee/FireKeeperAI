# 测试与质量

项目优先使用轻量测试。只有当更重的工具能保护重要行为时，才引入额外测试栈。

## 当前命令

```bash
npm.cmd test
npm.cmd run build
npm.cmd run docs:build
```

在 Windows PowerShell 中，如果执行策略阻止 `npm`，使用 `npm.cmd`。

## 当前覆盖

前端测试覆盖：

- API 客户端 Server-Sent Event 解析。
- 任务筛选。
- 任务计数。
- 任务草稿规范化。
- 燃火状态切换。
- 列表替换/移除 helper。
- 灵魂/人性/原素瓶派生计数。
- 篝火低语选择。
- 语言 fallback 与格式化。

后端测试覆盖或应覆盖：

- Claude 任务上下文本地化格式。
- 任务输入验证。
- 导出输出行为。
- 任务服务行为。

文档检查覆盖：

- `npm.cmd run docs:build` 能生成静态站点。
- 截图资产位于 `docs/assets/screenshots/` 并被复制到 `docs-site/`。
- GitHub Pages workflow 发布 `docs-site/`。

## 质量预期

- 提交前运行测试。
- 提交前运行前端 build。
- 文档变更后运行 docs build。
- 尽量把任务规则保留在纯函数中。
- 修改任务状态、本地化、导出或 Claude 上下文时补测试。
- 不要提交生成的 `dist` 或 `docs-site`，除非明确要求。

## 相关文件

- `apps/web/test/`
- `apps/api/test/`
- `apps/web/src/taskLogic.js`
- `apps/web/src/i18n.js`
- `scripts/build-docs.mjs`
