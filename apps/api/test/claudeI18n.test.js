import assert from "node:assert/strict";
import test from "node:test";
import { buildTaskContext } from "../src/services/claudeService.js";

const tasks = [
  { title: "Prepare release", class: "boss", status: "active", priority: 1 },
  { title: "Archive notes", class: "regular", status: "kindled", priority: 2 }
];

test("buildTaskContext localizes English task metadata", () => {
  const context = buildTaskContext(tasks, "en");

  assert.match(context, /Current open tasks:/);
  assert.match(context, /Prepare release \[Boss, Active, priority 1\]/);
  assert.doesNotMatch(context, /Archive notes/);
});

test("buildTaskContext localizes Chinese task metadata", () => {
  const context = buildTaskContext(tasks, "zh");

  assert.match(context, /当前未燃尽的任务：/);
  assert.match(context, /Prepare release \[首领, 进行中, priority 1\]/);
  assert.doesNotMatch(context, /Archive notes/);
});

test("buildTaskContext falls back to English for unsupported language", () => {
  assert.equal(buildTaskContext([], "fr"), "Current open tasks: none.");
});
