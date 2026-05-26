import { randomUUID } from "node:crypto";
import { db, nowIso } from "../db/database.js";

export function ensureConversation(id, title = "Conversation") {
  if (id) {
    const existing = db.prepare("SELECT * FROM conversations WHERE id = $id").get({ $id: id });
    if (existing) {
      return existing;
    }
  }

  const conversationId = id || randomUUID();
  const timestamp = nowIso();
  db.prepare(`
    INSERT INTO conversations (id, title, createdAt, updatedAt)
    VALUES ($id, $title, $createdAt, $updatedAt)
  `).run({
    $id: conversationId,
    $title: title,
    $createdAt: timestamp,
    $updatedAt: timestamp
  });

  return db.prepare("SELECT * FROM conversations WHERE id = $id").get({ $id: conversationId });
}

export function saveMessage({ conversationId, role, content, inputTokens = 0, outputTokens = 0 }) {
  const id = randomUUID();
  const timestamp = nowIso();

  db.prepare(`
    INSERT INTO messages (id, conversationId, role, content, inputTokens, outputTokens, createdAt)
    VALUES ($id, $conversationId, $role, $content, $inputTokens, $outputTokens, $createdAt)
  `).run({
    $id: id,
    $conversationId: conversationId,
    $role: role,
    $content: content,
    $inputTokens: inputTokens,
    $outputTokens: outputTokens,
    $createdAt: timestamp
  });

  db.prepare("UPDATE conversations SET updatedAt = $updatedAt WHERE id = $id").run({
    $id: conversationId,
    $updatedAt: timestamp
  });

  return { id, conversationId, role, content, createdAt: timestamp };
}

export function getMessages(conversationId, limit = 20) {
  return db
    .prepare(`
      SELECT role, content
      FROM messages
      WHERE conversationId = $conversationId
      ORDER BY createdAt DESC
      LIMIT $limit
    `)
    .all({ $conversationId: conversationId, $limit: limit })
    .reverse();
}
