# Task Ledger

The Task Ledger is the primary working surface for planning. It should stay fast, compact, and readable.

![Fire Keeper AI desktop task ledger](../assets/screenshots/firekeeper-desktop-ledger.png)

## Task Classes

- `boss`: major, high-focus work.
- `elite`: important medium work.
- `regular`: normal daily work.
- `tedious`: necessary chores.

Class labels are localized in `apps/web/src/i18n.js`, while canonical class values remain English identifiers for storage and API consistency.

## Task Statuses

- `new`
- `active`
- `blocked`
- `kindled`

`kindled` is the completion state. The UI treats kindling as a reversible action:

- Non-`kindled` tasks become `kindled`.
- `kindled` tasks return to `active`.

## Core Interactions

- Quick capture creates an `active` task.
- Inline edit supports title, class, and status.
- Class filters and status filters compose with AND logic.
- Status filters include all persisted statuses: `new`, `active`, `blocked`, and `kindled`.
- Delete removes the task locally after the API confirms success.
- Pending task operations disable row actions to prevent duplicate mutation.
- The API rejects blank task titles and normalizes priority and tags before persistence.

## Dark Souls Derived Counters

`apps/web/src/taskLogic.js` derives a small lore layer from task state:

- Souls claimed: reward value from `kindled` tasks.
- Souls at risk: reward value from unfinished tasks.
- Humanity: count of `kindled` tasks.
- Estus: lightweight activity pressure from active tasks.
- Bonfire whisper: short state message selected from current task conditions.

These counters are flavor, not storage fields. They should remain deterministic and covered by tests.

## Relevant Files

- `apps/web/src/App.jsx`
- `apps/web/src/taskLogic.js`
- `apps/web/test/taskLogic.test.js`
- `apps/api/src/routes/tasks.js`
- `apps/api/src/services/taskService.js`
