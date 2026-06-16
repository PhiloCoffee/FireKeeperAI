# Storage And Export

Fire Keeper AI stores runtime data locally and exports human-readable Markdown.

## Local Storage

SQLite data lives under:

```text
data/firekeeper.sqlite
```

Generated exports live under:

```text
data/exports/
```

The database schema is initialized in `apps/api/src/db/database.js`.

## Task Persistence

Tasks are stored with:

- id
- title
- description
- status
- class
- priority
- dueAt
- tags
- createdAt
- updatedAt
- completedAt

## Conversation Persistence

Conversation and message tables support stored chat history. The frontend currently starts with a local greeting and uses conversation id metadata after chat begins.

## Markdown Export

Markdown export should remain readable outside the app. It should include useful task state and localized headings/labels where the active language is provided.

## Relevant Files

- `apps/api/src/db/database.js`
- `apps/api/src/services/taskService.js`
- `apps/api/src/services/conversationService.js`
- `apps/api/src/services/exportService.js`
- `apps/api/src/routes/export.js`
