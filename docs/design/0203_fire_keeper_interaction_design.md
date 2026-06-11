# Fire Keeper AI Interaction Design

Date: 2026-06-11

## Scope

This document describes the current interaction model for the Fire Keeper AI web UI after introducing Dark Souls themed assets, task filtering, and inline task editing.

The product remains a local-first task and chat workspace:

- Left side: task capture, filtering, editing, and task lifecycle controls.
- Right side: Claude conversation with Fire Keeper visual atmosphere.
- Background assets: used as low-contrast environmental layers, never as primary controls.

## Visual Asset Rules

The app uses copyrighted Dark Souls / Fire Keeper material only for a local fan prototype.

Current asset roles:

- `scene/local-screenshots/bg-anor-londo-skyline.jpg`: global page background.
- `object/bonfire/bg-bonfire-ruins-cropped-banner.jpg`: task pane atmosphere banner.
- `char/fire-keeper/fire-keeper-art-rashed-alakroka.jpg`: low-opacity chat pane character layer.

Implementation constraints:

- All visual assets must sit behind the working UI.
- Text contrast takes priority over recognizability of the art.
- Character art is hidden on small mobile viewports to avoid crowding the chat flow.
- Source and usage notes live under `apps/web/src/assets/manifests/`.

## Task Interaction Model

### Capture

The quick capture form accepts a title and class.

Rules:

- Empty titles are ignored.
- Titles are trimmed before submission.
- New captured tasks use `active` status.
- `boss` tasks receive priority `1`; other classes receive priority `2`.

### Filtering

Task visibility is controlled by two independent filters:

- Class: `all`, `boss`, `elite`, `regular`, `tedious`.
- Status: `all`, `active`, `blocked`, `kindled`.

Filters compose with AND logic. Example: class `boss` plus status `active` shows only active boss tasks.

Counters are global, not scoped to the current filter. This keeps the filter controls useful as navigation landmarks.

### Editing

Each task row supports inline editing.

Editable fields:

- Title
- Class
- Status

Rules:

- Saving an empty title is blocked on the client and displays a notice.
- Save, cancel, kindle, and delete controls are disabled while a task operation is pending.
- Deleting a task exits edit mode if that task was being edited.

### Kindling

Kindling toggles lifecycle state:

- Any non-`kindled` status becomes `kindled`.
- A `kindled` task returns to `active`.

This keeps the action simple and fast while preserving a way to undo accidental completion.

## Test Strategy

The front-end interaction rules are extracted into `apps/web/src/taskLogic.js`.

Tests use Node's built-in `node:test` runner:

- `filterTasks` verifies combined class/status filtering.
- `countTasks` verifies global class and status counters.
- `normalizeTaskDraft` verifies trim/default/priority behavior.
- `nextKindleStatus` verifies completion toggle rules.
- `replaceTask` and `removeTask` verify scoped list updates.

This test layer intentionally avoids DOM testing for now. The current risk is in task state behavior, and pure functions give stable coverage without adding React test dependencies.

## Next Interaction Candidates

- Add task description and due date editing.
- Add keyboard shortcuts for capture, save, cancel, and focus chat.
- Add optimistic update rollback messages for failed task mutations.
- Convert AI task suggestions into accept/reject cards.
- Add reduced-motion toggle in settings.
