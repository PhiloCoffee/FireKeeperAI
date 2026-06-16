# FireKeeperAI Agent Guide

## Project Goal

FireKeeperAI is a local-first, Dark Souls inspired personal assistant. It combines:

- A task board for planning and tracking work.
- A Claude-backed conversation pane.
- Markdown export for readable local records.
- Atmospheric Fire Keeper / bonfire visuals that support the workflow without reducing usability.

Keep the interface practical first. Theme is important, but text readability and task flow take priority.

## Repository Structure

- `apps/web`: Vite + React frontend.
- `apps/api`: Express backend and local services.
- `data`: local SQLite database and generated exports.
- `docs/design`: product and interaction design notes.
- `apps/web/src/assets`: visual assets grouped by role.

## Common Commands

Use `npm.cmd` on Windows PowerShell if `npm` is blocked by execution policy.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run dev:web
npm.cmd run dev:api
npm.cmd test
npm.cmd run build --workspace apps/web
```

Before opening a PR, run:

```powershell
npm.cmd test
npm.cmd run build --workspace apps/web
```

## Frontend Rules

- Preserve the two-pane app shell: task workflow on the left, guidance/chat on the right.
- Do not turn the app into a marketing landing page.
- Use existing React + plain CSS patterns unless there is a clear reason to add a dependency.
- Keep controls compact and usable. This is a working tool, not only a themed showcase.
- Use lucide icons where appropriate.
- Keep visual assets behind the UI with dark overlays.
- Hide or reduce decorative character art on small screens if it competes with content.

Important frontend files:

- `apps/web/src/App.jsx`: current app shell and interaction wiring.
- `apps/web/src/taskLogic.js`: pure task interaction rules.
- `apps/web/src/styles.css`: theme, layout, and responsive styles.
- `apps/web/src/api/client.js`: browser API client and SSE chat streaming.

## Task Logic Rules

Task classes:

- `boss`: major/high-focus work.
- `elite`: important medium work.
- `regular`: normal daily work.
- `tedious`: necessary chores.

Task statuses:

- `new`
- `active`
- `blocked`
- `kindled`

Current UI behavior:

- Quick-captured tasks become `active`.
- Boss tasks default to priority `1`; other classes default to priority `2`.
- Class and status filters compose with AND logic.
- Kindling toggles non-`kindled` tasks to `kindled`; clicking again returns them to `active`.
- Inline edit supports title, class, and status.

When changing task behavior, update `apps/web/src/taskLogic.js` and its tests.

## Backend Rules

- The browser must never call Claude directly.
- Claude API access belongs in `apps/api`.
- Keep user data local under `data/`.
- Markdown export should remain readable without the app.

Important backend files:

- `apps/api/src/server.js`: Express app entry.
- `apps/api/src/routes`: HTTP routes.
- `apps/api/src/services`: task, conversation, Claude, export services.
- `apps/api/src/db/database.js`: SQLite initialization.

## Tests

The frontend currently uses Node's built-in test runner.

- Put pure interaction logic tests under `apps/web/test`.
- Prefer testing pure task/chat parsing rules before adding DOM test dependencies.
- If backend behavior changes, add API/service tests under `apps/api/test`.

Existing useful test target:

```powershell
npm.cmd run test --workspace apps/web
```

## Assets

Asset folders:

- `scene`: environment/background images.
- `char`: character-forward images.
- `object`: props and bonfire imagery.
- `brand`: store/header/capsule art.
- `reference`: contact sheets and review-only selection aids.
- `manifests`: source, credit, and usage notes.

Copyright note:

Dark Souls and Fire Keeper assets in this repo are copyrighted game/fan content intended for local/private fan prototyping. Do not present them as production-safe assets. For public release, replace with original or properly licensed art.

## Design Documentation

Before making substantial UX changes, read:

- `docs/design/0202_AI_Web_GUI_Plan.md`
- `docs/design/0203_fire_keeper_interaction_design.md`

When changing major interaction behavior, update or add a design note under `docs/design`.

## Git Hygiene

- Do not revert unrelated user changes.
- Check `git status --short` before editing and before committing.
- Keep commits scoped.
- Use branch prefix `codex/` for agent-created branches unless instructed otherwise.
- Do not commit generated `dist` output unless explicitly requested.

## PR Checklist

- Task/chat interaction still works conceptually.
- `npm.cmd test` passes.
- `npm.cmd run build --workspace apps/web` passes.
- New assets have source/usage notes.
- Design docs are updated for user-visible workflow changes.
