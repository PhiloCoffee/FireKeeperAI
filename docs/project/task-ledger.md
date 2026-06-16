# 任务账册

任务账册是主要工作界面，用于快速规划、记录和推进任务。它应该保持紧凑、清晰、可快速扫描。

![Fire Keeper AI 桌面任务账册](../assets/screenshots/firekeeper-desktop-ledger.png)

## 任务类型

- `boss`：首领任务，代表大型、高专注度工作。
- `elite`：精英任务，代表重要的中等规模工作。
- `regular`：普通任务，代表日常工作。
- `tedious`：琐事任务，代表必要但消耗心力的小事。

任务类型的展示文案在 `apps/web/src/i18n.js` 中本地化；存储和 API 使用的 canonical value 仍保持英文标识，避免数据层混乱。

## 任务状态

- `new`：新建。
- `active`：进行中。
- `blocked`：受阻。
- `kindled`：已燃火，表示完成。

`kindled` 是完成状态。界面把“燃火”作为可逆操作：

- 非 `kindled` 任务会变为 `kindled`。
- `kindled` 任务再次点击后回到 `active`。

## 核心交互

- 快速记录会创建一个 `active` 任务。
- 行内编辑支持标题、类型和状态。
- 类型筛选与状态筛选使用 AND 逻辑组合。
- 状态筛选包含全部持久化状态：`new`、`active`、`blocked`、`kindled`。
- 删除操作会在 API 确认成功后从本地列表移除任务。
- 待处理任务操作会禁用行按钮，避免重复 mutation。
- API 会拒绝空标题，并在持久化前规范化优先级和标签。

## 魂系派生计数

`apps/web/src/taskLogic.js` 会从任务状态派生一层轻量的魂系风格状态：

- 已取回灵魂：来自已完成任务的奖励值。
- 风险中的灵魂：来自未完成任务的奖励值。
- 人性：已燃火任务数量。
- 原素瓶：由进行中任务带来的行动压力。
- 篝火低语：根据当前任务状态选择的一句短提示。

这些计数只是界面氛围层，不是持久化字段。它们必须保持确定性，并由测试覆盖。

## 相关文件

- `apps/web/src/App.jsx`
- `apps/web/src/taskLogic.js`
- `apps/web/test/taskLogic.test.js`
- `apps/api/src/routes/tasks.js`
- `apps/api/src/services/taskService.js`
