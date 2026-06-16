import Anthropic from "@anthropic-ai/sdk";
import { getLanguageCopy } from "./i18nService.js";

export function createClaudeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

export function buildTaskContext(tasks, language = "en") {
  const copy = getLanguageCopy(language);

  if (!tasks.length) {
    return copy.taskContextEmpty;
  }

  const lines = tasks
    .filter((task) => task.status !== "kindled")
    .slice(0, 25)
    .map((task) => {
      const taskClass = copy.classLabels[task.class] || task.class;
      const status = copy.statusLabels[task.status] || task.status;
      return `- ${task.title} [${taskClass}, ${status}, ${copy.priorityLabel} ${task.priority}]`;
    });

  if (!lines.length) {
    return copy.taskContextEmpty;
  }

  return `${copy.taskContextTitle}\n${lines.join("\n")}`;
}

export async function streamClaudeResponse({ language = "en", messages, taskContext, onText, onUsage }) {
  const client = createClaudeClient();
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
  const copy = getLanguageCopy(language);
  const system = `${copy.systemPrompt}\n\n${taskContext}`;

  const stream = client.messages.stream({
    model,
    max_tokens: 1400,
    system,
    messages
  });

  let finalMessage = null;

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
      onText(event.delta.text);
    }
  }

  finalMessage = await stream.finalMessage();
  onUsage?.(finalMessage.usage || {});

  const text = (finalMessage.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return text;
}
