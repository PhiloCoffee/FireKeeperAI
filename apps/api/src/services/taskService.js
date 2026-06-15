import { randomUUID } from "node:crypto";
import { db, nowIso, parseJson } from "../db/database.js";
import {
  TASK_CLASSES,
  TASK_STATUSES,
  defaultPriorityForClass,
  normalizePriority,
  normalizeTags,
  normalizeTitle
} from "./taskValidation.js";

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    class: row.class,
    priority: row.priority,
    dueAt: row.dueAt,
    tags: normalizeTags(parseJson(row.tags, [])),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    completedAt: row.completedAt
  };
}

export function listTasks(filters = {}) {
  const clauses = [];
  const params = {};

  if (filters.status) {
    clauses.push("status = $status");
    params.$status = filters.status;
  }

  if (filters.class) {
    clauses.push("class = $class");
    params.$class = filters.class;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM tasks ${where} ORDER BY status = 'kindled', priority ASC, updatedAt DESC`)
    .all(params);

  return rows.map(rowToTask);
}

export function createTask(input = {}) {
  const timestamp = nowIso();
  const id = randomUUID();
  const taskClass = TASK_CLASSES.has(input.class) ? input.class : "regular";
  const status = TASK_STATUSES.has(input.status) ? input.status : "new";
  const tags = normalizeTags(input.tags);
  const title = normalizeTitle(input.title);
  const priority = normalizePriority(input.priority, defaultPriorityForClass(taskClass));

  db.prepare(`
    INSERT INTO tasks (id, title, description, status, class, priority, dueAt, tags, createdAt, updatedAt, completedAt)
    VALUES ($id, $title, $description, $status, $class, $priority, $dueAt, $tags, $createdAt, $updatedAt, $completedAt)
  `).run({
    $id: id,
    $title: title,
    $description: String(input.description || "").trim(),
    $status: status,
    $class: taskClass,
    $priority: priority,
    $dueAt: input.dueAt || null,
    $tags: JSON.stringify(tags),
    $createdAt: timestamp,
    $updatedAt: timestamp,
    $completedAt: status === "kindled" ? timestamp : null
  });

  return getTask(id);
}

export function getTask(id) {
  const row = db.prepare("SELECT * FROM tasks WHERE id = $id").get({ $id: id });
  return row ? rowToTask(row) : null;
}

export function updateTask(id, input = {}) {
  const existing = getTask(id);
  if (!existing) {
    return null;
  }

  const nextStatus = input.status && TASK_STATUSES.has(input.status) ? input.status : existing.status;
  const nextClass = input.class && TASK_CLASSES.has(input.class) ? input.class : existing.class;
  const completedAt = nextStatus === "kindled" ? existing.completedAt || nowIso() : null;
  const updatedAt = nowIso();
  const title = input.title === undefined ? existing.title : normalizeTitle(input.title);
  const tags = input.tags === undefined ? existing.tags : normalizeTags(input.tags);
  const priority = input.priority === undefined ? existing.priority : normalizePriority(input.priority, existing.priority);

  db.prepare(`
    UPDATE tasks
    SET title = $title,
        description = $description,
        status = $status,
        class = $class,
        priority = $priority,
        dueAt = $dueAt,
        tags = $tags,
        updatedAt = $updatedAt,
        completedAt = $completedAt
    WHERE id = $id
  `).run({
    $id: id,
    $title: title,
    $description: input.description === undefined ? existing.description : String(input.description).trim(),
    $status: nextStatus,
    $class: nextClass,
    $priority: priority,
    $dueAt: input.dueAt === undefined ? existing.dueAt : input.dueAt || null,
    $tags: JSON.stringify(tags),
    $updatedAt: updatedAt,
    $completedAt: completedAt
  });

  return getTask(id);
}

export function deleteTask(id) {
  const result = db.prepare("DELETE FROM tasks WHERE id = $id").run({ $id: id });
  return result.changes > 0;
}
