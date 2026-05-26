# Fire Keeper AI Web GUI Implementation Plan

## Source Context

Read:

- `docs/design/0201_Bonfire-Lit-Proposal.pdf`
- `readme.md`
- Supporting context from `docs/design/0201_GUI_init.md`

Project intent: build a Dark Souls-inspired personal assistant combining task management, calendar-oriented planning, and AI conversation. The first product should be a browser-based GUI, not a desktop wrapper. The AI runtime should use the Claude API.

## Product Goal

Build a local-first web app named Fire Keeper AI with:

- A two-panel workspace: task board on the left, Claude-powered conversation on the right.
- Dark atmospheric styling inspired by bonfires, parchment, gothic frames, and restrained fantasy UI.
- Local task storage with exportable Markdown history.
- Claude API integration through a backend proxy, never directly from browser code.
- A clean path to future calendar views, encrypted storage, and additional LLM backends.

## Recommended Stack

### Frontend

- Vite + React + JavaScript
- CSS Modules or plain CSS first; add Tailwind/shadcn only if component velocity becomes more important than custom theme control.
- Framer Motion only for focused UI transitions.
- Canvas or CSS animation for bonfire/flame effects in the first version.
- FullCalendar later for calendar view.

### Backend

- Node.js + Express
- Anthropic official TypeScript/JavaScript SDK
- Server-sent events for streamed Claude responses
- SQLite for structured local storage
- Markdown export for readable backups

### Runtime

- Browser opens the React app.
- React calls local backend endpoints.
- Backend owns `ANTHROPIC_API_KEY`.
- Backend calls Claude Messages API.

Current Anthropic docs, checked May 26, 2026:

- Claude API overview: `https://docs.anthropic.com/en/api/overview`
- Messages API: `https://docs.anthropic.com/en/api/messages`
- Streaming: `https://platform.claude.com/docs/en/api/messages-streaming`
- Models overview: `https://platform.claude.com/docs/en/docs/about-claude/models/overview`

Recommended starting model:

- `claude-sonnet-4-6` for the main assistant because it balances speed, intelligence, and cost.
- `claude-opus-4-7` as an optional high-power mode for complex planning, refactoring, and long reasoning.
- `claude-haiku-4-5` as a later low-cost classifier for task tagging.

## Architecture

```text
Browser
  React GUI
    - Task panel
    - Chat panel
    - Calendar placeholder
    - Settings
      |
      | HTTP + SSE
      v
Local Node/Express API
  /api/chat/stream
  /api/tasks
  /api/tasks/:id
  /api/export/markdown
  /api/settings
      |
      v
Services
  ClaudeService
  TaskService
  ExportService
  StorageService
      |
      v
SQLite + Markdown export files
```

## Data Model

### Task

```js
{
  id: "uuid",
  title: "string",
  description: "string",
  status: "new | active | blocked | kindled",
  class: "boss | elite | regular | tedious",
  priority: 1,
  dueAt: "ISO datetime or null",
  tags: ["string"],
  createdAt: "ISO datetime",
  updatedAt: "ISO datetime",
  completedAt: "ISO datetime or null"
}
```

### Chat Message

```js
{
  id: "uuid",
  conversationId: "uuid",
  role: "user | assistant | system",
  content: "string",
  createdAt: "ISO datetime",
  tokenUsage: {
    input: 0,
    output: 0
  }
}
```

## AI Behavior

The assistant should behave like a practical planning companion with light Fire Keeper flavor, not heavy roleplay that interferes with usability.

Core AI jobs:

- Chat with the user about plans, tasks, and priorities.
- Convert natural language into tasks.
- Classify tasks into:
  - `boss`: major, high-effort work
  - `elite`: important medium-sized work
  - `regular`: normal daily work
  - `tedious`: necessary chores
  - `kindled`: completed tasks
- Suggest next actions based on task state and due dates.
- Summarize current workload.
- Export useful daily or weekly summaries.

Initial system prompt direction:

```text
You are Fire Keeper AI, a focused personal planning assistant.
Use a calm, atmospheric tone, but prioritize clarity and useful action.
Help the user capture tasks, break down large work, classify effort, and decide what to do next.
Do not over-roleplay. Keep responses concise unless the user asks for depth.
When you identify tasks, return structured task suggestions when possible.
```

## API Plan

### `POST /api/chat/stream`

Input:

```js
{
  conversationId: "uuid optional",
  message: "string",
  context: {
    includeOpenTasks: true
  }
}
```

Behavior:

- Load relevant open tasks if requested.
- Send messages to Claude.
- Stream assistant text back to browser through SSE.
- Save user and assistant messages.

### `POST /api/tasks`

Create a task manually or from AI-suggested structured output.

### `PATCH /api/tasks/:id`

Update status, class, priority, due date, title, or description.

### `GET /api/tasks`

Return active tasks, with filters for class/status/date.

### `POST /api/tasks/classify`

Use Claude to classify one or more tasks. Keep this separate from chat so classification can later use a cheaper model.

### `GET /api/export/markdown`

Generate a Markdown snapshot of tasks and chat summaries.

## GUI Plan

### First Screen

Full browser app shell, no marketing landing page.

Layout:

- Left sidebar: bonfire nav, filters, task classes.
- Main left panel: task list grouped by class/status.
- Main right panel: Claude conversation.
- Bottom/right utility area: quick task capture, model indicator, export button.

Visual direction:

- Dark charcoal background with warm ember accents.
- Parchment-like task surfaces, but keep contrast readable.
- Compact, practical controls.
- Bonfire animation should be subtle and must not obscure text.
- Use icon buttons for actions like complete, edit, delete, export, settings.

### MVP Interactions

- Add task.
- Edit task.
- Mark task as Kindled.
- Ask Claude for task breakdown.
- Accept AI-suggested tasks into the task list.
- Stream Claude responses.
- Export tasks to Markdown.

## Implementation Phases

### Phase 1: Project Scaffold

Deliverables:

- `package.json` workspace scripts.
- `apps/web` Vite React app.
- `apps/api` Express backend.
- `.env.example` with `ANTHROPIC_API_KEY=`.
- Basic dev command that runs both frontend and backend.

Acceptance:

- Browser GUI loads locally.
- Backend health endpoint works.
- No API key appears in frontend bundle.

### Phase 2: Local Task System

Deliverables:

- SQLite schema and migration/init script.
- Task CRUD API.
- React task panel.
- Task class filters.

Acceptance:

- Tasks persist after restart.
- User can create, edit, complete, and delete tasks.

### Phase 3: Claude Chat

Deliverables:

- Claude service using Anthropic SDK.
- Streaming chat endpoint.
- React chat panel with streamed response rendering.
- Conversation persistence.

Acceptance:

- User can send a message and receive streamed Claude output.
- Refreshing the page preserves previous conversation history.

### Phase 4: AI Task Capture

Deliverables:

- Prompt for extracting task suggestions from chat.
- UI affordance to accept/reject suggested tasks.
- Classification endpoint.

Acceptance:

- User can ask for planning help and turn AI suggestions into real tasks.
- Task classes match the project taxonomy.

### Phase 5: Theme and Atmosphere

Deliverables:

- Fire Keeper visual theme.
- Bonfire ambient animation.
- Task completion animation.
- Accessible contrast pass.

Acceptance:

- UI feels thematic but remains readable and efficient.
- Animations are performant and optional/reduced-motion aware.

### Phase 6: Export and Backup

Deliverables:

- Markdown export endpoint.
- Export button in GUI.
- Daily summary format.

Acceptance:

- User can export tasks and summaries as Markdown.

### Phase 7: Calendar View

Deliverables:

- Calendar page or tab.
- Tasks with due dates shown on calendar.
- Optional future Google Calendar integration.

Acceptance:

- Due tasks appear in a calendar layout.
- Calendar does not block the main task/chat workflow.

## Suggested Repo Structure

```text
FireKeeperAI/
  apps/
    web/
      src/
        components/
        pages/
        styles/
        api/
    api/
      src/
        routes/
        services/
        db/
        prompts/
  data/
    firekeeper.sqlite
    exports/
  docs/
    design/
  package.json
  .env.example
```

## Build Order for a Coding AI

1. Scaffold Vite React app and Express API.
2. Add shared npm scripts for local development.
3. Add backend health route and frontend API client.
4. Add SQLite setup and task CRUD.
5. Build task panel UI.
6. Add Claude service with server-side API key.
7. Add streaming chat endpoint and chat UI.
8. Add AI task extraction/classification.
9. Add Markdown export.
10. Polish theme and animations.
11. Add tests for task service, Claude service wrapper, and API routes.

## Non-Negotiables

- Do not call Claude API directly from browser code.
- Keep the first version local-first.
- Do not overbuild multi-provider LLM support before Claude works well.
- Keep theme secondary to usability.
- Store user data in a predictable local `data/` directory.
- Make Markdown export human-readable without requiring the app.

## Open Decisions

- JavaScript only vs TypeScript. User asked for React/JavaScript, so start with JavaScript unless stronger type safety becomes necessary.
- SQLite library: `better-sqlite3` is simple and good for local apps; use another library only if async DB access becomes important.
- Whether to use Tailwind/shadcn. Start with CSS unless the UI grows quickly.
- Whether to wrap in Tauri later. Keep browser-based first; Tauri can be added after the web app is stable.
