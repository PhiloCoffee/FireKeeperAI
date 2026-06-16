# 存储与导出

Fire Keeper AI 把运行时数据保存在本地，并提供人类可读的 Markdown 导出。

## 本地存储

SQLite 数据位于：

```text
data/firekeeper.sqlite
```

生成的导出文件位于：

```text
data/exports/
```

数据库 schema 在 `apps/api/src/db/database.js` 中初始化。

## 任务持久化

任务字段包括：

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

## 对话持久化

conversations 和 messages 表用于保存对话历史。前端当前会先展示本地欢迎语，并在聊天开始后使用后端返回的 conversation id。

## Markdown 导出

Markdown 导出应该在不运行应用时仍然可读。导出内容应包含有用的任务状态，并在提供当前语言时使用本地化标题和标签。

中文导出应使用术语表中的译名，例如“灵魂”“人性”“原素瓶”，避免在中文导出中混用不必要的英文术语。

## 相关文件

- `apps/api/src/db/database.js`
- `apps/api/src/services/taskService.js`
- `apps/api/src/services/conversationService.js`
- `apps/api/src/services/exportService.js`
- `apps/api/src/routes/export.js`
