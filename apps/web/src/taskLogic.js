export const CLASS_OPTIONS = [
  { value: "boss", label: "Boss", icon: "B", hint: "Major work" },
  { value: "elite", label: "Elite", icon: "E", hint: "Important" },
  { value: "regular", label: "Regular", icon: "R", hint: "Daily" },
  { value: "tedious", label: "Tedious", icon: "T", hint: "Necessary" }
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "kindled", label: "Kindled" }
];

export const STATUS_LABELS = {
  new: "New",
  active: "Active",
  blocked: "Blocked",
  kindled: "Kindled"
};

export const SOUL_REWARDS = {
  boss: 4000,
  elite: 1500,
  regular: 500,
  tedious: 200
};

const TASK_CLASS_VALUES = new Set(CLASS_OPTIONS.map((option) => option.value));
const TASK_STATUS_VALUES = new Set(Object.keys(STATUS_LABELS));

export function normalizeTaskDraft(draft = {}) {
  const taskClass = TASK_CLASS_VALUES.has(draft.class) ? draft.class : "regular";
  const status = TASK_STATUS_VALUES.has(draft.status) ? draft.status : "active";

  return {
    title: String(draft.title || "").trim(),
    class: taskClass,
    status,
    priority: taskClass === "boss" ? 1 : 2
  };
}

export function filterTasks(tasks, { selectedClass = "all", selectedStatus = "all" } = {}) {
  return tasks.filter((task) => {
    const classMatches = selectedClass === "all" || task.class === selectedClass;
    const statusMatches = selectedStatus === "all" || task.status === selectedStatus;
    return classMatches && statusMatches;
  });
}

export function countTasks(tasks) {
  return tasks.reduce(
    (next, task) => {
      next.all += 1;

      if (Object.prototype.hasOwnProperty.call(next, task.class)) {
        next[task.class] += 1;
      }

      if (Object.prototype.hasOwnProperty.call(next, task.status)) {
        next[task.status] += 1;
      }

      return next;
    },
    { all: 0, boss: 0, elite: 0, regular: 0, tedious: 0, new: 0, active: 0, blocked: 0, kindled: 0 }
  );
}

export function nextKindleStatus(task) {
  return task.status === "kindled" ? "active" : "kindled";
}

export function replaceTask(tasks, replacement) {
  return tasks.map((task) => (task.id === replacement.id ? replacement : task));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function calculateSoulLedger(tasks) {
  return tasks.reduce(
    (ledger, task) => {
      const reward = SOUL_REWARDS[task.class] || SOUL_REWARDS.regular;

      if (task.status === "kindled") {
        ledger.soulsEarned += reward;
        ledger.humanity += 1;
      } else {
        ledger.soulsAtRisk += reward;
      }

      if (task.status === "active") {
        ledger.estusCharges += task.class === "boss" ? 2 : 1;
      }

      if (task.status === "blocked") {
        ledger.hollowing += 1;
      }

      return ledger;
    },
    { soulsEarned: 0, soulsAtRisk: 0, humanity: 0, hollowing: 0, estusCharges: 0 }
  );
}

export function getBonfireWhisper(tasks) {
  const counts = countTasks(tasks);

  if (counts.all === 0) {
    return "ash";
  }

  if (counts.blocked > 0) {
    return "fogGate";
  }

  if (tasks.some((task) => task.class === "boss" && task.status !== "kindled")) {
    return "lordSoul";
  }

  if (counts.kindled === counts.all) {
    return "flameLinked";
  }

  return "ember";
}
