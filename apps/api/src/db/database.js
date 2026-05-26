import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../..");
const dataDir = path.join(repoRoot, "data");
const exportsDir = path.join(dataDir, "exports");

fs.mkdirSync(exportsDir, { recursive: true });

export const dbPath = path.join(dataDir, "firekeeper.sqlite");
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    class TEXT NOT NULL DEFAULT 'regular',
    priority INTEGER NOT NULL DEFAULT 2,
    dueAt TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    completedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Conversation',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    inputTokens INTEGER NOT NULL DEFAULT 0,
    outputTokens INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (conversationId) REFERENCES conversations(id)
  );
`);

export function nowIso() {
  return new Date().toISOString();
}

export function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export { dataDir, exportsDir };
