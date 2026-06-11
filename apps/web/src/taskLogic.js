export const CLASS_OPTIONS = [
  { value: "boss", label: "Boss", icon: "B", hint: "Major work" },
  { value: "elite", label: "Elite", icon: "E", hint: "Important" },
  { value: "regular", label: "Regular", icon: "R", hint: "Daily" },
  { value: "tedious", label: "Tedious", icon: "T", hint: "Necessary" }
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
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

export function normalizeTaskDraft(draft) {
  return {
    title: String(draft.title || "").trim(),
    class: CLASS_OPTIONS.some((option) => option.value === draft.class) ? draft.class : "regular",
    status: draft.status || "active",
    priority: draft.class === "boss" ? 1 : 2
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
      next[task.class] = (next[task.class] || 0) + 1;
      next[task.status] = (next[task.status] || 0) + 1;
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
