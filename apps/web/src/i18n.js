export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_OPTIONS = {
  en: {
    code: "en",
    htmlLang: "en",
    label: "English",
    switchLabel: "EN"
  },
  zh: {
    code: "zh",
    htmlLang: "zh-CN",
    label: "中文",
    switchLabel: "中"
  }
};

export const TRANSLATIONS = {
  en: {
    appTitle: "Fire Keeper AI",
    navLabel: "Fire Keeper navigation",
    nav: {
      tasks: "Tasks",
      chat: "Chat",
      export: "Export"
    },
    language: {
      toggleTitle: "Switch to Chinese",
      ariaLabel: "Switch language"
    },
    taskPane: {
      eyebrow: "Fire Keeper AI",
      title: "Bonfire Ledger",
      bannerLabel: "Bonfire rest point",
      capturePlaceholder: "Capture a task",
      taskTitleLabel: "Task title",
      taskClassLabel: "Task class",
      addTaskTitle: "Add task",
      classFiltersLabel: "Task filters",
      statusFiltersLabel: "Status filters",
      empty: "No tasks in this covenant.",
      titleRequired: "Task title is required.",
      exportDone: "Markdown export written: {filePath}",
      metaSeparator: " - "
    },
    chatPane: {
      eyebrow: "Claude API",
      title: "Guidance",
      ready: "Claude ready",
      apiKeyNeeded: "API key needed",
      assistantName: "Fire Keeper",
      userName: "You",
      placeholder: "Ask Claude to break down a task, choose priorities, or plan the next rest.",
      sendTitle: "Send message",
      send: "Send",
      loading: "...",
      claudeUnavailable: "Claude is unavailable: {error}",
      requestFailed: "Claude request failed."
    },
    initialAssistantMessage: "The bonfire is lit. Tell me what weighs on your quest, or capture the next task.",
    classLabels: {
      boss: "Boss",
      elite: "Elite",
      regular: "Regular",
      tedious: "Tedious"
    },
    classHints: {
      boss: "Major work",
      elite: "Important",
      regular: "Daily",
      tedious: "Necessary"
    },
    statusLabels: {
      new: "New",
      active: "Active",
      blocked: "Blocked",
      kindled: "Kindled"
    },
    statusFilterLabels: {
      all: "All",
      active: "Active",
      blocked: "Blocked",
      kindled: "Kindled"
    },
    edit: {
      titleLabel: "Edit task title",
      classLabel: "Edit task class",
      statusLabel: "Edit task status",
      saveTitle: "Save task",
      cancelTitle: "Cancel edit",
      editTitle: "Edit task",
      kindleTitle: "Toggle kindled",
      deleteTitle: "Delete task"
    }
  },
  zh: {
    appTitle: "防火女 AI",
    navLabel: "防火女 AI 导航",
    nav: {
      tasks: "任务",
      chat: "对话",
      export: "导出"
    },
    language: {
      toggleTitle: "切换到英文",
      ariaLabel: "切换语言"
    },
    taskPane: {
      eyebrow: "防火女 AI",
      title: "篝火账册",
      bannerLabel: "篝火休息点",
      capturePlaceholder: "记录一个任务",
      taskTitleLabel: "任务标题",
      taskClassLabel: "任务类型",
      addTaskTitle: "添加任务",
      classFiltersLabel: "任务筛选",
      statusFiltersLabel: "状态筛选",
      empty: "此誓约下没有任务。",
      titleRequired: "任务标题不能为空。",
      exportDone: "Markdown 已导出：{filePath}",
      metaSeparator: " - "
    },
    chatPane: {
      eyebrow: "Claude API",
      title: "指引",
      ready: "Claude 已就绪",
      apiKeyNeeded: "需要 API Key",
      assistantName: "防火女",
      userName: "你",
      placeholder: "让 Claude 拆解任务、判断优先级，或规划下一次篝火休整。",
      sendTitle: "发送消息",
      send: "发送",
      loading: "...",
      claudeUnavailable: "Claude 暂不可用：{error}",
      requestFailed: "Claude 请求失败。"
    },
    initialAssistantMessage: "篝火已经燃起。告诉我这趟旅程的重负，或先记录下一个任务。",
    classLabels: {
      boss: "首领",
      elite: "精英",
      regular: "普通",
      tedious: "琐事"
    },
    classHints: {
      boss: "大型工作",
      elite: "重要事项",
      regular: "日常任务",
      tedious: "必要杂务"
    },
    statusLabels: {
      new: "新建",
      active: "进行中",
      blocked: "受阻",
      kindled: "已燃火"
    },
    statusFilterLabels: {
      all: "全部",
      active: "进行中",
      blocked: "受阻",
      kindled: "已燃火"
    },
    edit: {
      titleLabel: "编辑任务标题",
      classLabel: "编辑任务类型",
      statusLabel: "编辑任务状态",
      saveTitle: "保存任务",
      cancelTitle: "取消编辑",
      editTitle: "编辑任务",
      kindleTitle: "切换燃火状态",
      deleteTitle: "删除任务"
    }
  }
};

export function normalizeLanguage(language) {
  return Object.prototype.hasOwnProperty.call(TRANSLATIONS, language) ? language : DEFAULT_LANGUAGE;
}

export function getStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem("firekeeper-language"));
}

export function formatMessage(message, values = {}) {
  return Object.entries(values).reduce((next, [key, value]) => {
    return next.replaceAll(`{${key}}`, String(value));
  }, message);
}
