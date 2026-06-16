export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_COPY = {
  en: {
    systemPrompt: `You are Fire Keeper AI, a focused personal planning assistant.
Use a calm, atmospheric tone, but prioritize clarity and useful action.
Respond in English unless the user clearly asks for another language.
Help the user capture tasks, break down large work, classify effort, and decide what to do next.
Do not over-roleplay. Keep responses concise unless the user asks for depth.
When you identify tasks, return structured task suggestions when possible.`,
    taskContextEmpty: "Current open tasks: none.",
    taskContextTitle: "Current open tasks:",
    priorityLabel: "priority",
    classLabels: {
      boss: "Boss",
      elite: "Elite",
      regular: "Regular",
      tedious: "Tedious"
    },
    statusLabels: {
      new: "New",
      active: "Active",
      blocked: "Blocked",
      kindled: "Kindled"
    },
    markdown: {
      title: "Fire Keeper AI Export",
      generated: "Generated",
      noTasks: "_No tasks._",
      due: "due",
      statusHeadings: {
        new: "New",
        active: "Active",
        blocked: "Blocked",
        kindled: "Kindled"
      }
    }
  },
  zh: {
    systemPrompt: `你是防火女 AI，一位专注的个人规划助手。
使用简体中文回复，除非用户明确要求其他语言。
语气可以安静、有篝火旁的氛围感，但优先保证清晰、可执行。
黑暗之魂相关术语使用官方风格译名：Fire Keeper 译为“防火女”，Bonfire 译为“篝火”，Covenant 译为“誓约”。
帮助用户记录任务、拆解大型工作、判断投入等级，并决定下一步行动。
不要过度角色扮演。除非用户要求深入，否则保持简洁。
识别出任务时，尽量给出结构化的任务建议。`,
    taskContextEmpty: "当前未燃尽的任务：无。",
    taskContextTitle: "当前未燃尽的任务：",
    priorityLabel: "优先级",
    classLabels: {
      boss: "首领",
      elite: "精英",
      regular: "普通",
      tedious: "琐事"
    },
    statusLabels: {
      new: "新建",
      active: "进行中",
      blocked: "受阻",
      kindled: "已燃火"
    },
    markdown: {
      title: "防火女 AI 导出",
      generated: "生成时间",
      noTasks: "_没有任务。_",
      due: "截止",
      statusHeadings: {
        new: "新建",
        active: "进行中",
        blocked: "受阻",
        kindled: "已燃火"
      }
    }
  }
};

export function normalizeLanguage(language) {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_COPY, language) ? language : DEFAULT_LANGUAGE;
}

export function getLanguageCopy(language) {
  return LANGUAGE_COPY[normalizeLanguage(language)];
}
