# AI Guidance

The Guidance pane is the Claude-backed planning companion. It should help the user reason about tasks, break work down, and choose next actions without taking over the task ledger.

## Architecture

The browser calls the local API. The local API calls Claude.

```text
React UI
  -> /api/chat/stream
  -> Express backend
  -> Claude service
  -> Anthropic Messages API
```

The browser must not contain or use `ANTHROPIC_API_KEY`.

## Streaming

The frontend uses Server-Sent Events from `/api/chat/stream`.

Expected event types:

- `meta`: conversation metadata, including conversation id.
- `token`: streamed assistant text.
- `done`: stream completion.
- `error`: recoverable assistant/API error.

## Task Context

When enabled, open tasks are sent as context to Claude. The backend is responsible for shaping that context so Claude sees useful task state without exposing unnecessary implementation details.

## Language

The frontend sends the active language to the backend. The backend should select system prompt and task labels that match the active language.

## Relevant Files

- `apps/web/src/App.jsx`
- `apps/web/src/api/client.js`
- `apps/api/src/routes/chat.js`
- `apps/api/src/services/claudeService.js`
- `apps/api/src/services/conversationService.js`
- `apps/api/src/services/i18nService.js`
