# Fire Keeper AI Project Overview

Fire Keeper AI is a local-first planning assistant with a Dark Souls inspired interface. The product is built around a practical two-pane workspace:

- The left pane is the Bonfire Ledger for task capture and task state.
- The right pane is the Guidance area for Claude-backed planning conversation.

The app should feel atmospheric, but it should behave like a usable daily tool. Theme must not hide task state, reduce contrast, or slow down common actions.

## Functional Areas

- [Task Ledger](task-ledger.md): task classes, statuses, filters, editing, and Souls-style derived counters.
- [AI Guidance](ai-guidance.md): Claude streaming chat and task context.
- [Localization](localization.md): English and Simplified Chinese UI behavior.
- [Theme And Assets](theme-and-assets.md): Dark Souls inspired visuals and asset organization.
- [Storage And Export](storage-and-export.md): SQLite persistence and Markdown export.
- [Testing And Quality](testing-and-quality.md): current checks and expected coverage.
- [Documentation Site](docs-site.md): static docs build, screenshot assets, and GitHub Pages deployment.
- [Dev Log And Changelog](dev-log.md): version timeline from `0.0.1` to `1.0.0`.

## Product Principles

- Local-first data: user task and conversation data stays under the local `data/` directory.
- Backend-owned AI access: browser code never calls Claude directly.
- Working UI over decorative UI: visual flavor supports task flow.
- Small, testable logic units: interaction rules live in pure modules where practical.
- Human-readable backup: Markdown export should be useful without running the app.

## Current Entry Points

- Frontend app shell: `apps/web/src/App.jsx`
- Frontend task rules: `apps/web/src/taskLogic.js`
- Frontend localization: `apps/web/src/i18n.js`
- Frontend API client: `apps/web/src/api/client.js`
- Backend server: `apps/api/src/server.js`
- Task service: `apps/api/src/services/taskService.js`
- Claude service: `apps/api/src/services/claudeService.js`
- Export service: `apps/api/src/services/exportService.js`

## Related Design Notes

- `docs/design/0202_AI_Web_GUI_Plan.md`
- `docs/design/0203_fire_keeper_interaction_design.md`
