import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are Fire Keeper AI, a focused personal planning assistant.
Use a calm, atmospheric tone, but prioritize clarity and useful action.
Help the user capture tasks, break down large work, classify effort, and decide what to do next.
Do not over-roleplay. Keep responses concise unless the user asks for depth.
When you identify tasks, return structured task suggestions when possible.`;

export function createClaudeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

export function buildTaskContext(tasks) {
  if (!tasks.length) {
    return "Current open tasks: none.";
  }

  const lines = tasks
    .filter((task) => task.status !== "kindled")
    .slice(0, 25)
    .map((task) => `- ${task.title} [${task.class}, ${task.status}, priority ${task.priority}]`);

  return `Current open tasks:\n${lines.join("\n")}`;
}

export async function streamClaudeResponse({ messages, taskContext, onText, onUsage }) {
  const client = createClaudeClient();
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
  const system = `${SYSTEM_PROMPT}\n\n${taskContext}`;

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
