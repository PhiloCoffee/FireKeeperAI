# Dev Log And Changelog

This log maps Fire Keeper AI's history from the existing git commits and keeps a sampled version path from `0.0.1` to `1.0.0`.

## How To Maintain This Log

Use this format when adding a new milestone:

```text
## x.y.z - YYYY-MM-DD - Milestone Name

- Source: commit hash, PR, or "working tree".
- Added:
- Changed:
- Fixed:
- Docs:
```

Rules:

- Use exact calendar dates from commits or release work.
- Keep commit hashes when a milestone maps to git history.
- Mark unreleased local work as `Working tree` until it is committed.
- Prefer practical user-facing changes over internal noise.
- Move planned items forward only when the implementation exists.

## Timeline

| Date | Version | Source | Milestone |
| --- | --- | --- | --- |
| 2025-02-01 | `0.0.1` | `43c9977` | Project concept, technical direction, and first Fire Keeper AI README seed. |
| 2025-02-01 | `0.0.2` | `5ba4c7b` | Repository foundation with `.gitignore` and MIT license. |
| 2025-02-01 | `0.0.3` | `7daaff6`, `c5355f5` | Main branch merge, Bonfire Lit proposal PDF, GPT screenshot, and README expansion. |
| 2026-05-26 | `0.1.0` | `d26896b` | First runnable app scaffold with React/Vite frontend, Express backend, SQLite storage, Claude streaming, tasks, export, and tests. |
| 2026-06-11 | `0.2.0` | `fa1755e` | Fire Keeper interaction pass with richer task logic, local assets, themed UI, and task logic tests. |
| 2026-06-11 | `0.3.0` | `dd261b2` | Bilingual English/Simplified Chinese UI, localized backend prompts/export text, and i18n tests. |
| 2026-06-15 | `0.4.0` | Working tree | Codebase hardening pass: task validation, SSE parsing, API error handling, docs cleanup, and broader tests. |
| 2026-06-15 | `0.5.0` | Working tree | Static documentation site, GitHub Pages workflow, local app screenshots, dependency audit cleanup, and Vite 8 upgrade. |
| Planned | `0.6.0` | Future | Task metadata polish: due dates, tags, richer filters, and edit UX. |
| Planned | `0.7.0` | Future | AI-assisted task capture and task suggestion flow from chat. |
| Planned | `0.8.0` | Future | Import/export maturity, backup restore, and conversation/task archive views. |
| Planned | `0.9.0` | Future | Release candidate: accessibility pass, responsive QA, asset licensing cleanup, and deployment rehearsal. |
| Planned | `1.0.0` | Future | Stable local-first release with documented install, verified workflows, and production-safe assets. |

## Changelog

## 0.5.0 - 2026-06-15 - Static Docs And Release Hygiene

- Source: Working tree.
- Added:
  - Static Markdown documentation build with `scripts/build-docs.mjs`.
  - Local docs preview server with `scripts/preview-docs.mjs`.
  - GitHub Pages deployment workflow under `.github/workflows/docs.yml`.
  - App screenshots captured from the local running UI under `docs/assets/screenshots/`.
  - Documentation Site page describing the docs stack and deployment path.
- Changed:
  - Frontend dev proxy can use `API_ORIGIN` to avoid local API port conflicts.
  - Upgraded Vite to `^8.0.16`.
  - Upgraded `concurrently` to `^10.0.3`.
- Fixed:
  - Cleared current npm audit findings after dependency upgrades.
- Docs:
  - Linked screenshots from the docs home, task ledger, localization, and theme docs.
  - Added docs build and preview commands to the project docs.

## 0.4.0 - 2026-06-15 - Hardening And Documentation Cleanup

- Source: Working tree.
- Added:
  - Pure task validation helpers and tests.
  - API client Server-Sent Event parser and tests.
  - Project documentation pages under `docs/project/`.
- Changed:
  - Task draft normalization now validates class and status values before UI use.
  - Task counters ignore unknown class/status buckets instead of creating accidental UI keys.
  - Task service normalizes titles, priorities, and tags before persistence.
  - App mutation handlers now show user-facing errors for add, kindle, delete, export, and chat failures.
- Fixed:
  - Blank task titles are rejected consistently by service and route code.
  - Invalid JSON request bodies return `400` instead of a generic server error.
  - Stale task marker in the oldest design note is now historical context.
- Docs:
  - README and project docs now match current task, export, testing, and asset behavior.

## 0.3.0 - 2026-06-11 - Bilingual Fire Keeper

- Source: `dd261b2`.
- Added:
  - English/Simplified Chinese frontend localization.
  - Backend language copy for Claude prompts, task context, and Markdown export.
  - i18n tests for frontend language behavior.
  - Claude task context localization tests.
- Changed:
  - Frontend sends active language to chat and export APIs.
  - README was expanded around language behavior and localized terminology.
- Docs:
  - Captured Chinese terminology conventions such as Fire Keeper, Bonfire, and Covenant.

## 0.2.0 - 2026-06-11 - Themed Interaction And Asset Pass

- Source: `fa1755e`.
- Added:
  - Dark Souls inspired local and sourced visual assets organized by role.
  - Asset manifests for Steam, local screenshots, and Fire Keeper references.
  - Fire Keeper interaction design note.
  - Pure task logic helpers and task logic tests.
- Changed:
  - Main app UI gained stronger Fire Keeper atmosphere, task filters, and themed interaction styling.
  - Task layout and CSS were expanded for a more polished two-pane app shell.
- Docs:
  - Added asset library README and interaction design documentation.

## 0.1.0 - 2026-05-26 - First Runnable App

- Source: `d26896b`.
- Added:
  - React/Vite frontend workspace.
  - Express backend workspace.
  - SQLite schema for tasks, conversations, and messages.
  - Task routes and service layer.
  - Claude streaming chat route and service layer.
  - Markdown export route and service layer.
  - Vite proxy setup and root workspace scripts.
  - GUI planning design note.
- Docs:
  - README updated with setup and project direction.

## 0.0.3 - 2025-02-01 - Proposal And README Expansion

- Source: `7daaff6`, `c5355f5`.
- Added:
  - Bonfire Lit proposal PDF under design docs.
  - GPT screenshot asset.
  - Expanded README content around the original project soul.
- Changed:
  - Merged initial branches into the main project line.

## 0.0.2 - 2025-02-01 - Repository Foundation

- Source: `5ba4c7b`.
- Added:
  - Initial `.gitignore`.
  - MIT license.

## 0.0.1 - 2025-02-01 - Concept Seed

- Source: `43c9977`.
- Added:
  - First Fire Keeper AI technical direction note.
  - Initial README.
  - Early decisions around local-first storage, GUI technology, LLM options, and Dark Souls inspired visual direction.

## Road To 1.0.0

The path below is intentionally sampled rather than exhaustive. It gives the project clear release-shaped checkpoints without forcing every small change into a version.

| Target | Theme | Exit Criteria |
| --- | --- | --- |
| `0.6.0` | Task Metadata | Due dates and tags are editable in the UI, covered by tests, and exported to Markdown. |
| `0.7.0` | AI Task Flow | Chat can propose structured tasks, the user can accept/edit them, and task context remains localized. |
| `0.8.0` | Data Portability | Markdown export is complemented by import/restore or archive flows for local-first durability. |
| `0.9.0` | Release Candidate | Accessibility, responsive layout, error states, setup docs, and asset licensing have been reviewed. |
| `1.0.0` | Stable Release | A fresh user can install, run, use, export, and understand the app from docs without developer help. |
