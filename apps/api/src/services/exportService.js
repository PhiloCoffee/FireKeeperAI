import fs from "node:fs";
import path from "node:path";
import { exportsDir } from "../db/database.js";
import { listTasks } from "./taskService.js";

const CLASS_LABELS = {
  boss: "Boss",
  elite: "Elite",
  regular: "Regular",
  tedious: "Tedious"
};

export function buildMarkdownExport() {
  const tasks = listTasks();
  const generatedAt = new Date().toISOString();
  const lines = [`# Fire Keeper AI Export`, "", `Generated: ${generatedAt}`, ""];

  for (const status of ["new", "active", "blocked", "kindled"]) {
    const group = tasks.filter((task) => task.status === status);
    lines.push(`## ${status[0].toUpperCase()}${status.slice(1)}`, "");

    if (!group.length) {
      lines.push("_No tasks._", "");
      continue;
    }

    for (const task of group) {
      const checked = task.status === "kindled" ? "x" : " ";
      const tags = task.tags.length ? ` #${task.tags.join(" #")}` : "";
      const due = task.dueAt ? ` due ${task.dueAt}` : "";
      lines.push(`- [${checked}] **${task.title}** (${CLASS_LABELS[task.class]})${due}${tags}`);
      if (task.description) {
        lines.push(`  - ${task.description}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

export function writeMarkdownExport() {
  const markdown = buildMarkdownExport();
  const safeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(exportsDir, `firekeeper-export-${safeStamp}.md`);
  fs.writeFileSync(filePath, markdown, "utf8");
  return { filePath, markdown };
}
