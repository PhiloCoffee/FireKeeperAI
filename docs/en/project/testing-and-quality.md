# Testing And Quality

The project uses lightweight tests first. Add heavier tooling only when it protects meaningful behavior.

## Current Commands

```bash
npm.cmd test
npm.cmd run build --workspace apps/web
```

Use `npm.cmd` on Windows PowerShell if script execution policy blocks `npm`.

## Current Coverage

Frontend tests cover:

- API client Server-Sent Event parsing
- task filtering
- task counters
- task draft normalization
- kindle status toggling
- list replacement/removal helpers
- Souls/Humanity/Estus derived counters
- bonfire whisper selection
- language fallback and formatting

Backend tests, where present, should cover:

- localized Claude context formatting
- task input validation
- export output behavior
- task service behavior

## Quality Expectations

- Run tests before committing.
- Run the web build before opening a PR.
- Keep task rules in pure functions when possible.
- Add tests when task state, localization, export, or Claude context behavior changes.
- Do not commit generated `dist` output unless explicitly requested.

## Relevant Files

- `apps/web/test/`
- `apps/api/test/`
- `apps/web/src/taskLogic.js`
- `apps/web/src/i18n.js`
