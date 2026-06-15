export const TASK_CLASSES = new Set(["boss", "elite", "regular", "tedious"]);
export const TASK_STATUSES = new Set(["new", "active", "blocked", "kindled"]);

export class TaskValidationError extends Error {}

export function defaultPriorityForClass(taskClass) {
  return taskClass === "boss" ? 1 : 2;
}

export function normalizePriority(value, fallback) {
  const priority = Number(value);
  return Number.isFinite(priority) && priority > 0 ? Math.trunc(priority) : fallback;
}

export function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.map((tag) => String(tag).trim()).filter(Boolean);
}

export function normalizeTitle(title) {
  const nextTitle = String(title || "").trim();
  if (!nextTitle) {
    throw new TaskValidationError("Task title is required.");
  }

  return nextTitle;
}
