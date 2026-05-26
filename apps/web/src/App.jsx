import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Flame,
  Loader2,
  MessageSquareText,
  Plus,
  ScrollText,
  ShieldAlert,
  Swords,
  Trash2
} from "lucide-react";
import {
  createTask,
  deleteTask,
  exportMarkdown,
  getHealth,
  getTasks,
  streamChat,
  updateTask
} from "./api/client.js";

const CLASS_OPTIONS = [
  { value: "boss", label: "Boss", icon: "B", hint: "Major work" },
  { value: "elite", label: "Elite", icon: "E", hint: "Important" },
  { value: "regular", label: "Regular", icon: "R", hint: "Daily" },
  { value: "tedious", label: "Tedious", icon: "T", hint: "Necessary" }
];

const STATUS_LABELS = {
  new: "New",
  active: "Active",
  blocked: "Blocked",
  kindled: "Kindled"
};

export function App() {
  const [health, setHealth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [taskDraft, setTaskDraft] = useState({ title: "", class: "regular" });
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "The bonfire is lit. Tell me what weighs on your quest, or capture the next task."
    }
  ]);
  const [conversationId, setConversationId] = useState(null);
  const [chatDraft, setChatDraft] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [notice, setNotice] = useState("");

  async function refreshTasks() {
    const result = await getTasks();
    setTasks(result.tasks);
  }

  useEffect(() => {
    getHealth().then(setHealth).catch((error) => setNotice(error.message));
    refreshTasks().catch((error) => setNotice(error.message));
  }, []);

  const visibleTasks = useMemo(() => {
    if (selectedClass === "all") {
      return tasks;
    }
    return tasks.filter((task) => task.class === selectedClass);
  }, [selectedClass, tasks]);

  const counts = useMemo(() => {
    return tasks.reduce(
      (next, task) => {
        next.all += 1;
        next[task.class] += 1;
        if (task.status === "kindled") next.kindled += 1;
        return next;
      },
      { all: 0, boss: 0, elite: 0, regular: 0, tedious: 0, kindled: 0 }
    );
  }, [tasks]);

  async function handleAddTask(event) {
    event.preventDefault();
    if (!taskDraft.title.trim()) {
      return;
    }

    const result = await createTask({
      title: taskDraft.title,
      class: taskDraft.class,
      status: "active",
      priority: taskDraft.class === "boss" ? 1 : 2
    });
    setTasks((current) => [result.task, ...current]);
    setTaskDraft({ title: "", class: taskDraft.class });
  }

  async function handleKindle(task) {
    const result = await updateTask(task.id, {
      status: task.status === "kindled" ? "active" : "kindled"
    });
    setTasks((current) => current.map((item) => (item.id === task.id ? result.task : item)));
  }

  async function handleDelete(task) {
    await deleteTask(task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id));
  }

  async function handleExport() {
    const result = await exportMarkdown();
    setNotice(`Markdown export written: ${result.filePath}`);
  }

  async function handleChat(event) {
    event.preventDefault();
    const text = chatDraft.trim();
    if (!text || isChatting) {
      return;
    }

    setChatDraft("");
    setIsChatting(true);
    setNotice("");
    setMessages((current) => [...current, { role: "user", content: text }, { role: "assistant", content: "" }]);

    try {
      await streamChat({
        conversationId,
        message: text,
        includeOpenTasks: true,
        onMeta: (data) => setConversationId(data.conversationId),
        onToken: (token) => {
          setMessages((current) => {
            const next = [...current];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + token };
            return next;
          });
        },
        onError: (error) => {
          setNotice(error);
          setMessages((current) => {
            const next = [...current];
            const last = next[next.length - 1];
            next[next.length - 1] = {
              ...last,
              content: last.content || `Claude is unavailable: ${error}`
            };
            return next;
          });
        }
      });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsChatting(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="Fire Keeper navigation">
        <div className="brand-mark" title="Fire Keeper AI">
          <Flame size={26} />
        </div>
        <button className="rail-button active" title="Tasks">
          <Swords size={20} />
        </button>
        <button className="rail-button" title="Chat">
          <MessageSquareText size={20} />
        </button>
        <button className="rail-button" title="Export" onClick={handleExport}>
          <ScrollText size={20} />
        </button>
      </aside>

      <section className="task-pane">
        <header className="pane-header">
          <div>
            <p className="eyebrow">Fire Keeper AI</p>
            <h1>Bonfire Ledger</h1>
          </div>
          <div className="kindled-count">
            <Flame size={18} />
            <span>{counts.kindled}</span>
          </div>
        </header>

        <form className="quick-capture" onSubmit={handleAddTask}>
          <input
            value={taskDraft.title}
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Capture a task"
            aria-label="Task title"
          />
          <select
            value={taskDraft.class}
            onChange={(event) => setTaskDraft((current) => ({ ...current, class: event.target.value }))}
            aria-label="Task class"
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className="icon-command" title="Add task">
            <Plus size={18} />
          </button>
        </form>

        <nav className="class-filters" aria-label="Task filters">
          <button className={selectedClass === "all" ? "selected" : ""} onClick={() => setSelectedClass("all")}>
            All <span>{counts.all}</span>
          </button>
          {CLASS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={selectedClass === option.value ? "selected" : ""}
              onClick={() => setSelectedClass(option.value)}
              title={option.hint}
            >
              {option.label} <span>{counts[option.value]}</span>
            </button>
          ))}
        </nav>

        <div className="task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={22} />
              <span>No tasks in this covenant.</span>
            </div>
          ) : (
            visibleTasks.map((task) => <TaskRow key={task.id} task={task} onKindle={handleKindle} onDelete={handleDelete} />)
          )}
        </div>
      </section>

      <section className="chat-pane">
        <div className="ambient-flame" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <header className="pane-header chat-header">
          <div>
            <p className="eyebrow">Claude API</p>
            <h2>Guidance</h2>
          </div>
          <div className={health?.claudeConfigured ? "status-pill ready" : "status-pill"}>
            {health?.claudeConfigured ? "Claude ready" : "API key needed"}
          </div>
        </header>

        <div className="message-stack" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <span>{message.role === "assistant" ? "Fire Keeper" : "You"}</span>
              <p>{message.content || (isChatting ? "..." : "")}</p>
            </article>
          ))}
        </div>

        {notice ? <div className="notice">{notice}</div> : null}

        <form className="chat-form" onSubmit={handleChat}>
          <textarea
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder="Ask Claude to break down a task, choose priorities, or plan the next rest."
            aria-label="Chat message"
            rows={3}
          />
          <button type="submit" disabled={isChatting} title="Send message">
            {isChatting ? <Loader2 className="spin" size={18} /> : <MessageSquareText size={18} />}
            <span>Send</span>
          </button>
        </form>
      </section>
    </main>
  );
}

function TaskRow({ task, onKindle, onDelete }) {
  return (
    <article className={`task-row ${task.class} ${task.status === "kindled" ? "kindled" : ""}`}>
      <div className="task-class">{CLASS_OPTIONS.find((option) => option.value === task.class)?.icon}</div>
      <div className="task-body">
        <h3>{task.title}</h3>
        <p>
          {CLASS_OPTIONS.find((option) => option.value === task.class)?.label} · {STATUS_LABELS[task.status]}
        </p>
      </div>
      <button className="row-action" onClick={() => onKindle(task)} title="Toggle kindled">
        <Check size={17} />
      </button>
      <button className="row-action danger" onClick={() => onDelete(task)} title="Delete task">
        <Trash2 size={17} />
      </button>
    </article>
  );
}
