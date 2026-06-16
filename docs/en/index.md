# Fire Keeper AI Docs

Fire Keeper AI is a local-first planning assistant with a Dark Souls inspired interface, a task ledger, Claude-backed guidance, local SQLite storage, bilingual UI, and Markdown export.

## App Screenshots

These screenshots are captured from the local running app and stored as repository-local documentation assets.

![Fire Keeper AI desktop task ledger](assets/screenshots/firekeeper-desktop-ledger.png)

![Fire Keeper AI Chinese interface](assets/screenshots/firekeeper-chinese-ui.png)

## Start Here

- [Project Overview](project/README.md)
- [Task Ledger](project/task-ledger.md)
- [AI Guidance](project/ai-guidance.md)
- [Localization](project/localization.md)
- [Theme And Assets](project/theme-and-assets.md)
- [Storage And Export](project/storage-and-export.md)
- [Testing And Quality](project/testing-and-quality.md)
- [Documentation Site](project/docs-site.md)
- [Dev Log And Changelog](project/dev-log.md)

## Build The Docs

```bash
npm run docs:build
npm run docs:preview
```

The static output is generated into `docs-site/` and can be deployed to GitHub Pages by the included workflow.
