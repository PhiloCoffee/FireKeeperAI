import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Flame,
  Languages,
  Loader2,
  MessageSquareText,
  Plus,
  ScrollText,
  ShieldAlert,
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
import fireKeeperArt from "./assets/char/fire-keeper/fire-keeper-art-rashed-alakroka.jpg";
import bonfireBanner from "./assets/object/bonfire/bg-bonfire-ruins-cropped-banner.jpg";
import {
  LANGUAGE_OPTIONS,
  TRANSLATIONS,
  formatMessage,
  getStoredLanguage
} from "./i18n.js";
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
  const [language, setLanguage] = useState(getStoredLanguage);
  const [health, setHealth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [taskDraft, setTaskDraft] = useState({ title: "", class: "regular" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", class: "regular", status: "active" });
  const [pendingTaskId, setPendingTaskId] = useState(null);
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content: TRANSLATIONS[getStoredLanguage()].initialAssistantMessage,
      isSystemGreeting: true
    }
  ]);
  const [conversationId, setConversationId] = useState(null);
  const [chatDraft, setChatDraft] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [notice, setNotice] = useState("");
  const copy = TRANSLATIONS[language];
  const nextLanguage = language === "en" ? "zh" : "en";
  const currentLanguage = LANGUAGE_OPTIONS[language];
  const nextLanguageOption = LANGUAGE_OPTIONS[nextLanguage];

  const classOptions = useMemo(() => {
    return CLASS_OPTIONS.map((option) => ({
      ...option,
      label: copy.classLabels[option.value],
      hint: copy.classHints[option.value]
    }));
  }, [copy]);

  const statusOptions = useMemo(() => {
    return STATUS_OPTIONS.map((option) => ({
      ...option,
      label: copy.statusFilterLabels[option.value]
    }));
  }, [copy]);

  async function refreshTasks() {
    const result = await getTasks();
    setTasks(result.tasks);
  }

  useEffect(() => {
    getHealth().then(setHealth).catch((error) => setNotice(error.message));
    refreshTasks().catch((error) => setNotice(error.message));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("firekeeper-language", language);
    document.documentElement.lang = currentLanguage.htmlLang;
    document.title = copy.appTitle;
    setMessages((current) => {
      if (current.length === 1 && current[0].isSystemGreeting) {
        return [{ ...current[0], content: copy.initialAssistantMessage }];
      }
      return current;
    });
  }, [copy, currentLanguage.htmlLang, language]);

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
      setNotice(copy.taskPane.titleRequired);
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
    const result = await exportMarkdown(language);
    setNotice(formatMessage(copy.taskPane.exportDone, { filePath: result.filePath }));
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
        language,
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
              content: last.content || formatMessage(copy.chatPane.claudeUnavailable, { error })
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
      <aside className="side-rail" aria-label={copy.navLabel}>
        <div className="brand-mark" title={copy.appTitle}>
          <Flame size={26} />
        </div>
        <button
          className="rail-button language-toggle"
          title={copy.language.toggleTitle}
          aria-label={copy.language.ariaLabel}
          onClick={() => setLanguage(nextLanguage)}
        >
          <Languages size={17} />
          <span>{nextLanguageOption.switchLabel}</span>
        </button>
        <button className="rail-button active" title={copy.nav.tasks}>
          <Swords size={20} />
        </button>
        <button className="rail-button" title={copy.nav.chat}>
          <MessageSquareText size={20} />
        </button>
        <button className="rail-button" title={copy.nav.export} onClick={handleExport}>
          <ScrollText size={20} />
        </button>
      </aside>

      <section className="task-pane">
        <header className="pane-header">
          <div>
            <p className="eyebrow">{copy.taskPane.eyebrow}</p>
            <h1>{copy.taskPane.title}</h1>
          </div>
          <div className="kindled-count">
            <Flame size={18} />
            <span>{counts.kindled}</span>
          </div>
        </header>

        <figure className="bonfire-banner" aria-label={copy.taskPane.bannerLabel}>
          <img src={bonfireBanner} alt="" />
        </figure>

        <form className="quick-capture" onSubmit={handleAddTask}>
          <input
            value={taskDraft.title}
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder={copy.taskPane.capturePlaceholder}
            aria-label={copy.taskPane.taskTitleLabel}
          />
          <select
            value={taskDraft.class}
            onChange={(event) => setTaskDraft((current) => ({ ...current, class: event.target.value }))}
            aria-label={copy.taskPane.taskClassLabel}
          >
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className="icon-command" title={copy.taskPane.addTaskTitle}>
            <Plus size={18} />
          </button>
        </form>

        <nav className="class-filters" aria-label={copy.taskPane.classFiltersLabel}>
          <button className={selectedClass === "all" ? "selected" : ""} onClick={() => setSelectedClass("all")}>
            {copy.statusFilterLabels.all} <span>{counts.all}</span>
          </button>
          {classOptions.map((option) => (
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

        <nav className="status-filters" aria-label={copy.taskPane.statusFiltersLabel}>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={selectedStatus === option.value ? "selected" : ""}
              onClick={() => setSelectedStatus(option.value)}
            >
              {option.label} <span>{counts[option.value]}</span>
            </button>
          ))}
        </nav>

        <div className="task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={22} />
              <span>{copy.taskPane.empty}</span>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                editDraft={editDraft}
                isEditing={editingTaskId === task.id}
                isPending={pendingTaskId === task.id}
                classOptions={classOptions}
                copy={copy}
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
        <div className="fire-keeper-portrait" aria-hidden="true">
          <img src={fireKeeperArt} alt="" />
        </div>

        <header className="pane-header chat-header">
          <div>
            <p className="eyebrow">{copy.chatPane.eyebrow}</p>
            <h2>{copy.chatPane.title}</h2>
          </div>
          <div className={health?.claudeConfigured ? "status-pill ready" : "status-pill"}>
            {health?.claudeConfigured ? copy.chatPane.ready : copy.chatPane.apiKeyNeeded}
          </div>
        </header>

        <div className="message-stack" aria-live="polite">
          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <span>{message.role === "assistant" ? copy.chatPane.assistantName : copy.chatPane.userName}</span>
              <p>{message.content || (isChatting ? copy.chatPane.loading : "")}</p>
            </article>
          ))}
        </div>

        {notice ? <div className="notice">{notice}</div> : null}

        <form className="chat-form" onSubmit={handleChat}>
          <textarea
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder={copy.chatPane.placeholder}
            aria-label={copy.nav.chat}
            rows={3}
          />
          <button type="submit" disabled={isChatting} title={copy.chatPane.sendTitle}>
            {isChatting ? <Loader2 className="spin" size={18} /> : <MessageSquareText size={18} />}
            <span>{copy.chatPane.send}</span>
          </button>
        </form>
      </section>
    </main>
  );
}

function TaskRow({
  task,
  classOptions,
  copy,
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
  const classOption = classOptions.find((option) => option.value === task.class);
  const editClassOption = classOptions.find((option) => option.value === editDraft.class);

  if (isEditing) {
    return (
      <article className={`task-row editing ${task.class}`}>
        <div className="task-class">{editClassOption?.icon}</div>
        <div className="task-edit-grid">
          <input
            value={editDraft.title}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, title: event.target.value }))}
            aria-label={copy.edit.titleLabel}
          />
          <select
            value={editDraft.class}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, class: event.target.value }))}
            aria-label={copy.edit.classLabel}
          >
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={editDraft.status}
            onChange={(event) => onChangeEditDraft((current) => ({ ...current, status: event.target.value }))}
            aria-label={copy.edit.statusLabel}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {copy.statusLabels[value] || label}
              </option>
            ))}
          </select>
        </div>
        <button className="row-action" onClick={() => onSaveEdit(task)} disabled={isPending} title={copy.edit.saveTitle}>
          <Check size={17} />
        </button>
        <button className="row-action" onClick={onCancelEdit} disabled={isPending} title={copy.edit.cancelTitle}>
          <X size={17} />
        </button>
      </article>
    );
  }

  return (
    <article className={`task-row ${task.class} ${task.status === "kindled" ? "kindled" : ""}`}>
      <div className="task-class">{classOption?.icon}</div>
      <div className="task-body">
        <h3>{task.title}</h3>
        <p>
          {classOption?.label}
          {copy.taskPane.metaSeparator}
          {copy.statusLabels[task.status] || STATUS_LABELS[task.status]}
        </p>
      </div>
      <button className="row-action" onClick={() => onStartEdit(task)} disabled={isPending} title={copy.edit.editTitle}>
        <Edit3 size={16} />
      </button>
      <button className="row-action" onClick={() => onKindle(task)} disabled={isPending} title={copy.edit.kindleTitle}>
        <Check size={17} />
      </button>
      <button className="row-action danger" onClick={() => onDelete(task)} disabled={isPending} title={copy.edit.deleteTitle}>
        <Trash2 size={17} />
      </button>
    </article>
  );
}
