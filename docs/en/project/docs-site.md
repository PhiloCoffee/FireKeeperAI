# Documentation Site

The documentation site is built as static HTML so it can publish cleanly to GitHub Pages.

## Chosen Stack

The current stack is:

- `marked` for GitHub-flavored Markdown rendering.
- `scripts/build-docs.mjs` for static site generation.
- `scripts/preview-docs.mjs` for local preview.
- GitHub Actions Pages deployment from `docs-site/`.

This fits the project because the docs are already Markdown, the repo is already Node-based, and the output needs to be a simple static site rather than a full documentation application.

## Alternatives Considered

| Option | Fit | Tradeoff |
| --- | --- | --- |
| Custom `marked` generator | Best current fit | Small local script to maintain |
| VitePress | Good authoring experience | Adds another Vite/esbuild toolchain and audit surface |
| Docusaurus | Strong for large docs/versioning | Heavier than this project needs |
| MkDocs Material | Polished and mature | Adds a Python toolchain to a Node repo |

## Local Commands

```bash
npm run docs:build
npm run docs:preview
```

## GitHub Pages

`.github/workflows/docs.yml` builds the site with `npm run docs:build`, uploads `docs-site/`, and deploys it with GitHub Pages. In repository settings, Pages should use GitHub Actions as the source.

## Screenshot Assets

Screenshots used by the docs live under:

```text
docs/assets/screenshots/
```

The docs build copies that folder into the final static site, so Markdown can reference screenshots with paths such as:

```markdown
![Fire Keeper AI desktop task ledger](../assets/screenshots/firekeeper-desktop-ledger.png)
```
