# Fire Keeper AI 文档

Fire Keeper AI 是一个本地优先的规划助手，使用《黑暗之魂》风格界面，包含任务账册、Claude 指引、本地 SQLite 存储、中英双语界面与 Markdown 导出。

## 程序截图

这些截图来自本地运行中的真实程序，并作为仓库内的文档资产保存。

![Fire Keeper AI 桌面任务账册](assets/screenshots/firekeeper-desktop-ledger.png)

![Fire Keeper AI 中文界面](assets/screenshots/firekeeper-chinese-ui.png)

## 从这里开始

- [项目概览](project/README.md)
- [任务账册](project/task-ledger.md)
- [AI 指引](project/ai-guidance.md)
- [本地化](project/localization.md)
- [主题与资产](project/theme-and-assets.md)
- [存储与导出](project/storage-and-export.md)
- [测试与质量](project/testing-and-quality.md)
- [文档站点](project/docs-site.md)
- [开发日志与更新记录](project/dev-log.md)

## 构建文档

```bash
npm run docs:build
npm run docs:preview
```

静态输出会生成到 `docs-site/`，并可通过仓库里的 GitHub Pages workflow 发布。

## English

The English documentation is available at [English Docs](en/index.md).
