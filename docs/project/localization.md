# Localization

Fire Keeper AI supports English and Simplified Chinese in the UI.

![Fire Keeper AI Chinese interface](../assets/screenshots/firekeeper-chinese-ui.png)

## Current Behavior

- The side rail language control toggles language.
- Language choice is persisted in `localStorage`.
- `document.documentElement.lang` is updated.
- `document.title` is localized.
- Task classes, statuses, filters, tooltips, placeholders, and notices are localized.
- Claude requests include the active language.
- Markdown export uses active language labels where supported by the backend.

## Terminology

Chinese copy should prefer Dark Souls style terms where practical:

- Fire Keeper: 防火女
- Bonfire: 篝火
- Covenant: 誓约

Keep canonical data values in English. Localize only presentation labels and AI/export text.

## Relevant Files

- `apps/web/src/i18n.js`
- `apps/web/test/i18n.test.js`
- `apps/api/src/services/i18nService.js`
- `apps/api/src/services/claudeService.js`
- `apps/api/src/services/exportService.js`
