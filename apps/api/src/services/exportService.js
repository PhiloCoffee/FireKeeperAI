import fs from "node:fs";
import path from "node:path";
import { exportsDir } from "../db/database.js";
import { getLanguageCopy } from "./i18nService.js";
import { listTasks } from "./taskService.js";

export function buildMarkdownExport(language = "en") {
  const copy = getLanguageCopy(language);
  const tasks = listTasks();
  const generatedAt = new Date().toISOString();
  const lines = [`# ${copy.markdown.title}`, "", `${copy.markdown.generated}: ${generatedAt}`, ""];

  for (const status of ["new", "active", "blocked", "kindled"]) {
    const group = tasks.filter((task) => task.status === status);
    lines.push(`## ${copy.markdown.statusHeadings[status]}`, "");

    if (!group.length) {
      lines.push(copy.markdown.noTasks, "");
      continue;
    }

    for (const task of group) {
      const checked = task.status === "kindled" ? "x" : " ";
      const tags = task.tags.length ? ` #${task.tags.join(" #")}` : "";
      const due = task.dueAt ? ` ${copy.markdown.due} ${task.dueAt}` : "";
      const taskClass = copy.classLabels[task.class] || task.class;
      lines.push(`- [${checked}] **${task.title}** (${taskClass})${due}${tags}`);
      if (task.description) {
        lines.push(`  - ${task.description}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

export function writeMarkdownExport(language = "en") {
  const markdown = buildMarkdownExport(language);
  const safeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(exportsDir, `firekeeper-export-${safeStamp}.md`);
  fs.writeFileSync(filePath, markdown, "utf8");
  return { filePath, markdown };
}
