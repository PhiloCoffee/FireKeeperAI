import assert from "node:assert/strict";
import test from "node:test";
import {
  TaskValidationError,
  defaultPriorityForClass,
  normalizePriority,
  normalizeTags,
  normalizeTitle
} from "../src/services/taskValidation.js";

test("normalizeTitle trims titles and rejects blank input", () => {
  assert.equal(normalizeTitle("  Light the bonfire  "), "Light the bonfire");
  assert.throws(() => normalizeTitle("   "), TaskValidationError);
});

test("normalizePriority keeps positive integers and falls back otherwise", () => {
  assert.equal(normalizePriority("3", 2), 3);
  assert.equal(normalizePriority("3.8", 2), 3);
  assert.equal(normalizePriority("not-a-number", 2), 2);
  assert.equal(normalizePriority(0, 2), 2);
});

test("normalizeTags returns trimmed non-empty tag arrays", () => {
  assert.deepEqual(normalizeTags([" boss ", "", "urgent"]), ["boss", "urgent"]);
  assert.deepEqual(normalizeTags("boss"), []);
});

test("defaultPriorityForClass makes boss tasks highest priority", () => {
  assert.equal(defaultPriorityForClass("boss"), 1);
  assert.equal(defaultPriorityForClass("regular"), 2);
});
