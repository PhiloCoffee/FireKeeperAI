import express from "express";
import { buildTaskContext, streamClaudeResponse } from "../services/claudeService.js";
import { ensureConversation, getMessages, saveMessage } from "../services/conversationService.js";
import { listTasks } from "../services/taskService.js";

export const chatRouter = express.Router();

chatRouter.post("/stream", async (req, res) => {
  const userMessage = String(req.body?.message || "").trim();
  if (!userMessage) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  const conversation = ensureConversation(req.body.conversationId);
  saveMessage({ conversationId: conversation.id, role: "user", content: userMessage });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send("meta", { conversationId: conversation.id });

  try {
    const history = getMessages(conversation.id, 20).map((message) => ({
      role: message.role,
      content: message.content
    }));
    const taskContext = buildTaskContext(req.body?.context?.includeOpenTasks ? listTasks() : []);
    let usage = {};

    const assistantText = await streamClaudeResponse({
      messages: history,
      taskContext,
      onText: (text) => send("token", { text }),
      onUsage: (nextUsage) => {
        usage = nextUsage;
      }
    });

    saveMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: assistantText,
      inputTokens: usage.input_tokens || 0,
      outputTokens: usage.output_tokens || 0
    });

    send("done", { conversationId: conversation.id });
    res.end();
  } catch (error) {
    send("error", { error: error.message || "Claude request failed." });
    res.end();
  }
});
