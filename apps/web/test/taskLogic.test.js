import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  countTasks,
  filterTasks,
  nextKindleStatus,
  normalizeTaskDraft,
  removeTask,
  replaceTask
} from "../src/taskLogic.js";
import {
  getMediaById,
  getModeById,
  getNextModeId,
  getPersonaDefinitionById,
  INTERACTION_MODES,
  PERSONA_TEMPLATE_DEFINITIONS
} from "../src/personaTemplateData.js";

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

test("normalizeTaskDraft trims titles and derives boss priority", () => {
  assert.deepEqual(normalizeTaskDraft({ title: "  Link the fire  ", class: "boss" }), {
    title: "Link the fire",
    class: "boss",
    status: "active",
    priority: 1
  });

  assert.equal(normalizeTaskDraft({ title: "Do chores", class: "unknown" }).class, "regular");
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

test("persona templates expose bilingual role blocks", () => {
  assert.equal(PERSONA_TEMPLATE_DEFINITIONS.length >= 4, true);

  const solaire = getPersonaDefinitionById("solaire");
  assert.equal(solaire.nameZh, "阿斯特拉的索拉尔");
  assert.equal(solaire.ritual.length, 3);
  assert.equal(Boolean(solaire.intro.en && solaire.intro.zh), true);

  assert.equal(getPersonaDefinitionById("missing").id, "fire-keeper");
});

test("interaction modes cycle forward and backward for Ctrl+Tab", () => {
  assert.equal(INTERACTION_MODES[0].id, "ledger");
  assert.equal(getModeById("ritual").labelZh, "仪式");
  assert.equal(getModeById("missing").id, "ledger");
  assert.equal(getNextModeId("ledger"), "guidance");
  assert.equal(getNextModeId("ledger", -1), "archive");
});

test("official media references are available by template id", () => {
  const fireKeeper = getPersonaDefinitionById("fire-keeper");
  const media = getMediaById(fireKeeper.mediaId);

  assert.match(media.sourcePage, /^https:\/\/store\.steampowered\.com\//);
  assert.match(media.hls, /^https:\/\/video\.akamai\.steamstatic\.com\//);
  assert.equal(Boolean(media.localPosterKey), true);
  assert.equal(Boolean(media.localHlsKey), true);
});

test("official video manifest points to downloaded local assets", () => {
  const manifestPath = resolve("src/assets/manifests/steam-official-video-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  assert.equal(manifest.length >= 3, true);

  for (const item of manifest) {
    assert.match(item.sourcePage, /^https:\/\/store\.steampowered\.com\//);
    assert.equal(existsSync(resolve("../..", item.localPoster)), true);
    assert.equal(existsSync(resolve("../..", item.localHlsManifest)), true);
    assert.equal(item.localVariantManifests.length, 5);

    for (const variantPath of item.localVariantManifests) {
      assert.equal(existsSync(resolve("../..", variantPath)), true);
    }
  }
});
