# AI 指引

指引面板是由 Claude 支持的规划助手。它应帮助用户拆解任务、判断优先级并选择下一步行动，而不是替代任务账册本身。

## 架构

浏览器调用本地 API，本地 API 再调用 Claude。

```text
React UI
  -> /api/chat/stream
  -> Express backend
  -> Claude service
  -> Anthropic Messages API
```

浏览器端不得包含或直接使用 `ANTHROPIC_API_KEY`。

## 流式响应

前端通过 `/api/chat/stream` 接收 Server-Sent Events。

预期事件类型：

- `meta`：对话元数据，包括 conversation id。
- `token`：流式 assistant 文本。
- `done`：流结束。
- `error`：可恢复的 assistant/API 错误。

## 任务上下文

启用后，未完成任务会作为上下文发送给 Claude。后端负责整理这些上下文，让 Claude 看到有用的任务状态，同时不暴露多余实现细节。

## 语言

前端会把当前语言发送给后端。后端应选择对应语言的 system prompt 和任务标签。中文上下文应使用术语表中的译名，例如“防火女”“篝火”“誓约”“灵魂”“人性”“原素瓶”。

## 相关文件

- `apps/web/src/App.jsx`
- `apps/web/src/api/client.js`
- `apps/api/src/routes/chat.js`
- `apps/api/src/services/claudeService.js`
- `apps/api/src/services/conversationService.js`
- `apps/api/src/services/i18nService.js`
