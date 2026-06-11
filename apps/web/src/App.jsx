import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Flame,
  Loader2,
  MessageSquareText,
  Plus,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Swords,
  Trash2,
  X
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
import {
  getMediaById,
  getModeById,
  getNextModeId,
  getPersonaById,
  INTERACTION_MODES,
  PERSONA_TEMPLATES
} from "./personaTemplates.js";
import {
  CLASS_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  countTasks,
  filterTasks,
  nextKindleStatus,
  normalizeTaskDraft,
  removeTask,
  replaceTask
} from "./taskLogic.js";

export function App() {
  const [health, setHealth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState("fire-keeper");
  const [selectedModeId, setSelectedModeId] = useState("ledger");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [taskDraft, setTaskDraft] = useState({ title: "", class: "regular" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", class: "regular", status: "active" });
  const [pendingTaskId, setPendingTaskId] = useState(null);
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

  const activePersona = useMemo(() => getPersonaById(selectedPersonaId), [selectedPersonaId]);
  const activeMode = useMemo(() => getModeById(selectedModeId), [selectedModeId]);
  const activeMedia = useMemo(() => getMediaById(activePersona.mediaId), [activePersona]);

  async function refreshTasks() {
    const result = await getTasks();
    setTasks(result.tasks);
  }

  useEffect(() => {
    getHealth().then(setHealth).catch((error) => setNotice(error.message));
    refreshTasks().catch((error) => setNotice(error.message));
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `${activePersona.intro.en}\n\n${activePersona.intro.zh}`
      }
    ]);
    setConversationId(null);
  }, [activePersona]);

  useEffect(() => {
    function handleShortcut(event) {
      if (event.key === "Tab" && event.ctrlKey) {
        event.preventDefault();
        setSelectedModeId((current) => getNextModeId(current, event.shiftKey ? -1 : 1));
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const visibleTasks = useMemo(() => {
    return filterTasks(tasks, { selectedClass, selectedStatus });
  }, [selectedClass, selectedStatus, tasks]);

  const counts = useMemo(() => {
    return countTasks(tasks);
  }, [tasks]);

  async function handleAddTask(event) {
    event.preventDefault();
    if (!taskDraft.title.trim()) {
      return;
    }

    const payload = normalizeTaskDraft(taskDraft);
    const result = await createTask(payload);
    setTasks((current) => [result.task, ...current]);
    setTaskDraft({ title: "", class: taskDraft.class });
  }

  async function handleKindle(task) {
    setPendingTaskId(task.id);
    try {
      const result = await updateTask(task.id, { status: nextKindleStatus(task) });
      setTasks((current) => replaceTask(current, result.task));
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleDelete(task) {
    setPendingTaskId(task.id);
    try {
      await deleteTask(task.id);
      setTasks((current) => removeTask(current, task.id));
      if (editingTaskId === task.id) {
        setEditingTaskId(null);
      }
    } finally {
      setPendingTaskId(null);
    }
  }

  function handleStartEdit(task) {
    setEditingTaskId(task.id);
    setEditDraft({
      title: task.title,
      class: task.class,
      status: task.status
    });
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setEditDraft({ title: "", class: "regular", status: "active" });
  }

  async function handleSaveEdit(task) {
    const title = editDraft.title.trim();
    if (!title) {
      setNotice("Task title is required.");
      return;
    }

    setPendingTaskId(task.id);
    try {
      const result = await updateTask(task.id, {
        title,
        class: editDraft.class,
        status: editDraft.status
      });
      setTasks((current) => replaceTask(current, result.task));
      handleCancelEdit();
      setNotice("");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setPendingTaskId(null);
    }
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
    <main
      className={`app-shell persona-${activePersona.id} mode-${activeMode.id}`}
      style={{
        "--persona-scene": `url(${activePersona.scene})`,
        "--persona-accent": activePersona.accent
      }}
    >
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
            <p className="eyebrow">Fire Keeper AI / 模板化角色</p>
            <h1>{activePersona.nameZh}</h1>
            <p className="persona-subtitle">{activePersona.name} · {activeMode.labelZh}</p>
          </div>
          <div className="kindled-count">
            <Flame size={18} />
            <span>{counts.kindled}</span>
          </div>
        </header>

        <section className="persona-switcher" aria-label="Character templates">
          {PERSONA_TEMPLATES.map((persona) => (
            <button
              key={persona.id}
              className={persona.id === activePersona.id ? "selected" : ""}
              onClick={() => setSelectedPersonaId(persona.id)}
              style={{ "--swatch": persona.accent }}
              title={`${persona.name} / ${persona.nameZh}`}
            >
              <span>{persona.mark}</span>
              <strong>{persona.nameZh}</strong>
              <small>{persona.name}</small>
            </button>
          ))}
        </section>

        <section className="mode-tabs" aria-label="Interaction modes">
          {INTERACTION_MODES.map((mode) => (
            <button
              key={mode.id}
              className={mode.id === activeMode.id ? "selected" : ""}
              onClick={() => setSelectedModeId(mode.id)}
              title={`${mode.hint} / ${mode.hintZh}`}
            >
              <span>{mode.labelZh}</span>
              <small>{mode.label}</small>
            </button>
          ))}
        </section>

        <figure className="bonfire-banner" aria-label="Bonfire rest point">
          <img src={activePersona.banner} alt="" />
        </figure>

        <form className="quick-capture" onSubmit={handleAddTask}>
          <input
            value={taskDraft.title}
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder={`${activePersona.capturePlaceholder} / ${activePersona.capturePlaceholderZh}`}
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

        <nav className="status-filters" aria-label="Status filters">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={selectedStatus === option.value ? "selected" : ""}
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label} <span>{counts[option.value]}</span>
            </button>
          ))}
        </nav>

        {activeMode.id === "ritual" ? (
          <section className="ritual-panel" aria-label="Role working template">
            <div>
              <p className="eyebrow">Interactive Template / 交互模板</p>
              <h2>{activePersona.nameZh}的三步仪式</h2>
            </div>
            <ol>
              {activePersona.ritual.map(([en, zh]) => (
                <li key={en}>
                  <span>{zh}</span>
                  <small>{en}</small>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={22} />
              <span>No tasks in this covenant.</span>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                editDraft={editDraft}
                isEditing={editingTaskId === task.id}
                isPending={pendingTaskId === task.id}
                onCancelEdit={handleCancelEdit}
                onChangeEditDraft={setEditDraft}
                onDelete={handleDelete}
                onKindle={handleKindle}
                onSaveEdit={handleSaveEdit}
                onStartEdit={handleStartEdit}
              />
            ))
          )}
        </div>
      </section>

      <section className="chat-pane">
        <div className="ambient-flame" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {activePersona.portrait ? (
          <div className="fire-keeper-portrait" aria-hidden="true">
            <img src={activePersona.portrait} alt="" />
          </div>
        ) : (
          <div className="persona-sigil" aria-hidden="true">
            {activePersona.mark}
          </div>
        )}

        <header className="pane-header chat-header">
          <div>
            <p className="eyebrow">Claude API · {activeMode.label} / {activeMode.labelZh}</p>
            <h2>{activePersona.name}</h2>
            <p className="persona-copy">{activePersona.intro.zh}</p>
          </div>
          <div className={health?.claudeConfigured ? "status-pill ready" : "status-pill"}>
            {health?.claudeConfigured ? "Claude ready" : "API key needed"}
          </div>
        </header>

        {activeMode.id === "archive" ? (
          <section className="media-panel" aria-label="Official media references">
            <div>
              <p className="eyebrow">Official Reference / 官方参考</p>
              <h2>{activeMedia.titleZh}</h2>
              <p>{activePersona.officialReferenceZh}</p>
            </div>
            <div className="media-card">
              <img src={activeMedia.localPoster || activeMedia.thumbnail} alt="" />
              <a href={activeMedia.sourcePage} target="_blank" rel="noreferrer">
                <Sparkles size={16} />
                Steam source
              </a>
              <a href={activeMedia.localHls || activeMedia.hls} target="_blank" rel="noreferrer">
                <ScrollText size={16} />
                HLS manifest
              </a>
            </div>
          </section>
        ) : null}

        <div className="message-stack" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <span>{message.role === "assistant" ? activePersona.nameZh : "You"}</span>
              <p>{message.content || (isChatting ? "..." : "")}</p>
            </article>
          ))}
        </div>

        {notice ? <div className="notice">{notice}</div> : null}

        <form className="chat-form" onSubmit={handleChat}>
          <textarea
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder={`${activePersona.chatPlaceholder} / ${activePersona.chatPlaceholderZh}`}
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

function TaskRow({
  task,
  editDraft,
  isEditing,
  isPending,
  onCancelEdit,
  onChangeEditDraft,
  onDelete,
  onKindle,
  onSaveEdit,
  onStartEdit
}) {
  if (isEditing) {
    return (
      <article className={`task-row editing ${task.class}`}>
        <div className="task-class">{CLASS_OPTIONS.find((option) => option.value === editDraft.class)?.icon}</div>
        <div className="task-edit-grid">
          <input
            value={editDraft.title}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, title: event.target.value }))}
            aria-label="Edit task title"
          />
          <select
            value={editDraft.class}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, class: event.target.value }))}
            aria-label="Edit task class"
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={editDraft.status}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, status: event.target.value }))}
            aria-label="Edit task status"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button className="row-action" onClick={() => onSaveEdit(task)} disabled={isPending} title="Save task">
          <Check size={17} />
        </button>
        <button className="row-action" onClick={onCancelEdit} disabled={isPending} title="Cancel edit">
          <X size={17} />
        </button>
      </article>
    );
  }

  return (
    <article className={`task-row ${task.class} ${task.status === "kindled" ? "kindled" : ""}`}>
      <div className="task-class">{CLASS_OPTIONS.find((option) => option.value === task.class)?.icon}</div>
      <div className="task-body">
        <h3>{task.title}</h3>
        <p>
          {CLASS_OPTIONS.find((option) => option.value === task.class)?.label} · {STATUS_LABELS[task.status]}
        </p>
      </div>
      <button className="row-action" onClick={() => onStartEdit(task)} disabled={isPending} title="Edit task">
        <Edit3 size={16} />
      </button>
      <button className="row-action" onClick={() => onKindle(task)} disabled={isPending} title="Toggle kindled">
        <Check size={17} />
      </button>
      <button className="row-action danger" onClick={() => onDelete(task)} disabled={isPending} title="Delete task">
        <Trash2 size={17} />
      </button>
    </article>
  );
}
