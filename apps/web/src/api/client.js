const JSON_HEADERS = {
  "Content-Type": "application/json"
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getHealth() {
  return request("/api/health");
}

export function getTasks() {
  return request("/api/tasks");
}

export function createTask(task) {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });
}

export function updateTask(id, patch) {
  return request(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, {
    method: "DELETE"
  });
}

export function exportMarkdown(language = "en") {
  const params = new URLSearchParams({ language });
  return request(`/api/export/markdown?${params.toString()}`);
}

export async function streamChat({ conversationId, language = "en", message, includeOpenTasks, onMeta, onToken, onDone, onError }) {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      conversationId,
      message,
      context: {
        language,
        includeOpenTasks
      }
    })
  });

  if (!response.ok || !response.body) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Chat request failed.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      const lines = rawEvent.split("\n");
      const eventLine = lines.find((line) => line.startsWith("event:"));
      const dataLine = lines.find((line) => line.startsWith("data:"));

      if (!eventLine || !dataLine) {
        continue;
      }

      const event = eventLine.replace("event:", "").trim();
      const data = JSON.parse(dataLine.replace("data:", "").trim());

      if (event === "meta") onMeta?.(data);
      if (event === "token") onToken?.(data.text || "");
      if (event === "done") onDone?.(data);
      if (event === "error") onError?.(data.error || "Claude request failed.");
    }
  }
}
