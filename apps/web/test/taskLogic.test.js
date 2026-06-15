import assert from "node:assert/strict";
import test from "node:test";
import {
  STATUS_OPTIONS,
  calculateSoulLedger,
  countTasks,
  filterTasks,
  getBonfireWhisper,
  nextKindleStatus,
  normalizeTaskDraft,
  removeTask,
  replaceTask
} from "../src/taskLogic.js";

const tasks = [
  { id: "1", title: "Finish release", class: "boss", status: "active" },
  { id: "2", title: "Write notes", class: "regular", status: "blocked" },
  { id: "3", title: "Archive logs", class: "tedious", status: "kindled" },
  { id: "4", title: "Review PR", class: "elite", status: "active" }
];

test("filterTasks applies class and status filters together", () => {
  assert.deepEqual(filterTasks(tasks, { selectedClass: "boss", selectedStatus: "active" }), [tasks[0]]);
  assert.deepEqual(filterTasks(tasks, { selectedClass: "all", selectedStatus: "active" }), [tasks[0], tasks[3]]);
  assert.deepEqual(filterTasks(tasks, { selectedClass: "regular", selectedStatus: "active" }), []);
});

test("countTasks produces class and status counters", () => {
  assert.deepEqual(countTasks(tasks), {
    all: 4,
    boss: 1,
    elite: 1,
    regular: 1,
    tedious: 1,
    new: 0,
    active: 2,
    blocked: 1,
    kindled: 1
  });
});

test("status options expose every persisted task status", () => {
  assert.deepEqual(
    STATUS_OPTIONS.map((option) => option.value),
    ["all", "new", "active", "blocked", "kindled"]
  );
});

test("countTasks ignores unknown class and status buckets", () => {
  const counts = countTasks([{ id: "1", title: "Unknown", class: "stray", status: "lost" }]);

  assert.equal(counts.all, 1);
  assert.equal(counts.stray, undefined);
  assert.equal(counts.lost, undefined);
});

test("normalizeTaskDraft trims titles and derives boss priority", () => {
  assert.deepEqual(normalizeTaskDraft({ title: "  Link the fire  ", class: "boss" }), {
    title: "Link the fire",
    class: "boss",
    status: "active",
    priority: 1
  });

  assert.equal(normalizeTaskDraft({ title: "Do chores", class: "unknown" }).class, "regular");
  assert.equal(normalizeTaskDraft({ title: "Do chores", status: "lost" }).status, "active");
});

test("nextKindleStatus toggles between active and kindled", () => {
  assert.equal(nextKindleStatus({ status: "active" }), "kindled");
  assert.equal(nextKindleStatus({ status: "blocked" }), "kindled");
  assert.equal(nextKindleStatus({ status: "kindled" }), "active");
});

test("replaceTask and removeTask keep list updates scoped by id", () => {
  const replacement = { ...tasks[1], title: "Updated" };

  assert.deepEqual(replaceTask(tasks, replacement), [tasks[0], replacement, tasks[2], tasks[3]]);
  assert.deepEqual(removeTask(tasks, "2"), [tasks[0], tasks[2], tasks[3]]);
});

test("calculateSoulLedger converts task state into Dark Souls flavored counters", () => {
  assert.deepEqual(calculateSoulLedger(tasks), {
    soulsEarned: 200,
    soulsAtRisk: 6000,
    humanity: 1,
    hollowing: 1,
    estusCharges: 3
  });
});

test("getBonfireWhisper chooses the highest-priority atmospheric state", () => {
  assert.equal(getBonfireWhisper([]), "ash");
  assert.equal(getBonfireWhisper(tasks), "fogGate");
  assert.equal(getBonfireWhisper([{ id: "1", class: "boss", status: "active" }]), "lordSoul");
  assert.equal(getBonfireWhisper([{ id: "1", class: "regular", status: "kindled" }]), "flameLinked");
  assert.equal(getBonfireWhisper([{ id: "1", class: "regular", status: "active" }]), "ember");
});
