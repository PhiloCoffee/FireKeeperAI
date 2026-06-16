const JSON_HEADERS = {
  "Content-Type": "application/json"
};

async function getErrorMessage(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await response.json().catch(() => ({}));
    return body.error || `Request failed: ${response.status}`;
  }

  const text = await response.text().catch(() => "");
  return text || `Request failed: ${response.status}`;
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
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

export function parseServerSentEvent(rawEvent) {
  let event = "message";
  const dataLines = [];

  for (const line of rawEvent.split(/\r?\n/)) {
    if (!line || line.startsWith(":")) {
      continue;
    }

    const separator = line.indexOf(":");
    const field = separator === -1 ? line : line.slice(0, separator);
    const value = separator === -1 ? "" : line.slice(separator + 1).replace(/^ /, "");

    if (field === "event") {
      event = value;
    }

    if (field === "data") {
      dataLines.push(value);
    }
  }

  if (!dataLines.length) {
    return null;
  }

  return {
    event,
    data: JSON.parse(dataLines.join("\n"))
  };
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
    throw new Error(response.ok ? "Chat response stream is unavailable." : await getErrorMessage(response));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const dispatchEvent = (rawEvent) => {
    const parsed = parseServerSentEvent(rawEvent);
    if (!parsed) {
      return;
    }

    const { event, data } = parsed;

    if (event === "meta") onMeta?.(data);
    if (event === "token") onToken?.(data.text || "");
    if (event === "done") onDone?.(data);
    if (event === "error") onError?.(data.error || "Claude request failed.");
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      dispatchEvent(rawEvent);
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    dispatchEvent(buffer);
  }
}
