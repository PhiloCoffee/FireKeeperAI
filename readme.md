# Fire Keeper AI

Fire Keeper AI is a Dark Souls inspired local-first assistant for task planning, AI guidance, and Markdown export. It combines a themed React workspace, local SQLite persistence, Claude streaming chat, bilingual UI, and a small layer of bonfire-flavored task state.

> May the flames guide thee.

## What It Does

- Capture, edit, filter, delete, and kindle tasks.
- Classify tasks as Boss, Elite, Regular, or Tedious.
- Track task status as New, Active, Blocked, or Kindled.
- Show Dark Souls inspired task counters such as Souls, Humanity, Estus, and bonfire whispers.
- Chat with Claude through a backend proxy that can include current open tasks as context.
- Export task summaries to Markdown under `data/exports`.
- Switch the UI between English and Simplified Chinese.
- Use local Dark Souls inspired assets for a private fan prototype interface.

## Documentation

Project documentation is split by function under [docs/project](docs/project/README.md):

- [Project Overview](docs/project/README.md)
- [Task Ledger](docs/project/task-ledger.md)
- [AI Guidance](docs/project/ai-guidance.md)
- [Localization](docs/project/localization.md)
- [Theme And Assets](docs/project/theme-and-assets.md)
- [Storage And Export](docs/project/storage-and-export.md)
- [Testing And Quality](docs/project/testing-and-quality.md)
- [Documentation Site](docs/project/docs-site.md)
- [Dev Log And Changelog](docs/project/dev-log.md)

Design history and planning notes live under [docs/design](docs/design).

## Tech Stack

- Frontend: React 19, Vite, CSS, lucide-react
- Backend: Express 5, Claude API via `@anthropic-ai/sdk`
- Storage: Node SQLite through `node:sqlite`
- Runtime data: local `data/` directory
- Tests: Node built-in `node:test`

## Project Structure

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
    design/
    project/
  package.json
```

## Setup

```bash
npm install
```

Create a local `.env` file from `.env.example`:

```bash
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-6
PORT=8787
WEB_ORIGIN=http://localhost:5173
```

## Development

```bash
npm run dev
```

Default URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:8787`

On Windows PowerShell, if execution policy blocks `npm`, use `npm.cmd`:

```bash
npm.cmd run dev
```

## Verification

```bash
npm.cmd test
npm.cmd run build
```

Current test coverage includes task filtering/counting logic, Dark Souls flavored task counters, API client event parsing, task input validation, language fallback/formatting, and localized Claude task context.

## Asset Notice

Some current Dark Souls and Fire Keeper visual assets are copyrighted game or fan content. They are intended for local/private fan prototyping only. Replace them with original or properly licensed art before public release.

## Original Soul

**Bonfire Lit** by Holly Du  
https://chatgpt.com/g/g-6788056bb1b48191aa120623ed0232f3-bonfire-lit

![GPTs](docs/asset/GPTs.png)
