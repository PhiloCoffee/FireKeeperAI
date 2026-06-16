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
  LANGUAGE_OPTIONS,
  TRANSLATIONS,
  formatMessage,
  getStoredLanguage
} from "./i18n.js";
import {
  CLASS_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  calculateSoulLedger,
  countTasks,
  filterTasks,
  getBonfireWhisper,
  nextKindleStatus,
  normalizeTaskDraft,
  removeTask,
  replaceTask
} from "./taskLogic.js";

export function App() {
  const [language, setLanguage] = useState(getStoredLanguage);
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

  const activePersona = useMemo(() => getPersonaById(selectedPersonaId), [selectedPersonaId]);
  const activeMode = useMemo(() => getModeById(selectedModeId), [selectedModeId]);
  const activeMedia = useMemo(() => getMediaById(activePersona.mediaId), [activePersona]);
  const isChinese = language === "zh";
  const personaName = isChinese ? activePersona.nameZh : activePersona.name;
  const personaAltName = isChinese ? activePersona.name : activePersona.nameZh;
  const activeModeLabel = isChinese ? activeMode.labelZh : activeMode.label;
  const personaIntro = activePersona.intro[language] || activePersona.intro.en;
  const capturePlaceholder = isChinese ? activePersona.capturePlaceholderZh : activePersona.capturePlaceholder;
  const chatPlaceholder = isChinese ? activePersona.chatPlaceholderZh : activePersona.chatPlaceholder;
  const officialReference = isChinese ? activePersona.officialReferenceZh : activePersona.officialReference;

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
        return [{ ...current[0], content: personaIntro }];
      }
      return current;
    });
  }, [copy.appTitle, currentLanguage.htmlLang, language, personaIntro]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: personaIntro,
        isSystemGreeting: true
      }
    ]);
    setConversationId(null);
  }, [selectedPersonaId]);

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

  const soulLedger = useMemo(() => {
    return calculateSoulLedger(tasks);
  }, [tasks]);

  const bonfireWhisper = copy.bonfireWhispers[getBonfireWhisper(tasks)];

  async function handleAddTask(event) {
    event.preventDefault();
    if (!taskDraft.title.trim()) {
      setNotice(copy.taskPane.titleRequired);
      return;
    }

    try {
      const payload = normalizeTaskDraft(taskDraft);
      const result = await createTask(payload);
      setTasks((current) => [result.task, ...current]);
      setTaskDraft({ title: "", class: taskDraft.class });
      setNotice("");
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function handleKindle(task) {
    setPendingTaskId(task.id);
    try {
      const result = await updateTask(task.id, { status: nextKindleStatus(task) });
      setTasks((current) => replaceTask(current, result.task));
      setNotice("");
    } catch (error) {
      setNotice(error.message);
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
      setNotice("");
    } catch (error) {
      setNotice(error.message);
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
    try {
      const result = await exportMarkdown(language);
      setNotice(formatMessage(copy.taskPane.exportDone, { filePath: result.filePath }));
    } catch (error) {
      setNotice(error.message);
    }
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
      const message = error.message || copy.chatPane.requestFailed;
      setNotice(message);
      setMessages((current) => {
        const next = [...current];
        const last = next[next.length - 1];

        if (last?.role === "assistant" && !last.content) {
          next[next.length - 1] = {
            ...last,
            content: formatMessage(copy.chatPane.claudeUnavailable, { error: message })
          };
        }

        return next;
      });
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
            <h1>{personaName}</h1>
            <p className="persona-subtitle">
              {personaAltName} · {activeModeLabel}
            </p>
          </div>
          <div className="kindled-count">
            <Flame size={18} />
            <span>{counts.kindled}</span>
          </div>
        </header>

        <section className="persona-switcher" aria-label={isChinese ? "角色模板" : "Character templates"}>
          {PERSONA_TEMPLATES.map((persona) => {
            const displayName = isChinese ? persona.nameZh : persona.name;
            const secondaryName = isChinese ? persona.name : persona.nameZh;

            return (
              <button
                key={persona.id}
                className={persona.id === activePersona.id ? "selected" : ""}
                onClick={() => setSelectedPersonaId(persona.id)}
                style={{ "--swatch": persona.accent }}
                title={`${persona.name} / ${persona.nameZh}`}
              >
                <span>{persona.mark}</span>
                <strong>{displayName}</strong>
                <small>{secondaryName}</small>
              </button>
            );
          })}
        </section>

        <section className="mode-tabs" aria-label={isChinese ? "交互模式" : "Interaction modes"}>
          {INTERACTION_MODES.map((mode) => {
            const displayLabel = isChinese ? mode.labelZh : mode.label;
            const secondaryLabel = isChinese ? mode.label : mode.labelZh;

            return (
              <button
                key={mode.id}
                className={mode.id === activeMode.id ? "selected" : ""}
                onClick={() => setSelectedModeId(mode.id)}
                title={`${mode.hint} / ${mode.hintZh}`}
              >
                <span>{displayLabel}</span>
                <small>{secondaryLabel}</small>
              </button>
            );
          })}
        </section>

        <figure className="bonfire-banner" aria-label={copy.taskPane.bannerLabel}>
          <img src={activePersona.banner} alt="" />
        </figure>

        <section className="lore-ledger" aria-label={copy.lore.ledgerLabel}>
          <div className="lore-stat">
            <span>{copy.lore.soulsEarned}</span>
            <strong>{soulLedger.soulsEarned.toLocaleString()}</strong>
          </div>
          <div className="lore-stat">
            <span>{copy.lore.soulsAtRisk}</span>
            <strong>{soulLedger.soulsAtRisk.toLocaleString()}</strong>
          </div>
          <div className="lore-stat">
            <span>{copy.lore.humanity}</span>
            <strong>{soulLedger.humanity}</strong>
          </div>
          <div className="lore-stat">
            <span>{copy.lore.estus}</span>
            <strong>{soulLedger.estusCharges}</strong>
          </div>
          <p>{bonfireWhisper}</p>
        </section>

        <form className="quick-capture" onSubmit={handleAddTask}>
          <input
            value={taskDraft.title}
            onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder={capturePlaceholder || copy.taskPane.capturePlaceholder}
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

        {activeMode.id === "ritual" ? (
          <section className="ritual-panel" aria-label={isChinese ? "角色工作模板" : "Role working template"}>
            <div>
              <p className="eyebrow">{isChinese ? "交互模板" : "Interactive Template"}</p>
              <h2>{isChinese ? `${personaName}的三步仪式` : `${personaName}'s three-step ritual`}</h2>
            </div>
            <ol>
              {activePersona.ritual.map(([en, zh]) => (
                <li key={en}>
                  <span>{isChinese ? zh : en}</span>
                  <small>{isChinese ? en : zh}</small>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

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
            <p className="eyebrow">
              {copy.chatPane.eyebrow} · {activeModeLabel}
            </p>
            <h2>{personaAltName}</h2>
            <p className="persona-copy">{personaIntro}</p>
          </div>
          <div className={health?.claudeConfigured ? "status-pill ready" : "status-pill"}>
            {health?.claudeConfigured ? copy.chatPane.ready : copy.chatPane.apiKeyNeeded}
          </div>
        </header>

        {activeMode.id === "archive" ? (
          <section className="media-panel" aria-label={isChinese ? "官方媒体参考" : "Official media references"}>
            <div>
              <p className="eyebrow">{isChinese ? "官方参考" : "Official Reference"}</p>
              <h2>{isChinese ? activeMedia.titleZh : activeMedia.title}</h2>
              <p>{officialReference}</p>
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
              <span>{message.role === "assistant" ? personaName : copy.chatPane.userName}</span>
              <p>{message.content || (isChatting ? copy.chatPane.loading : "")}</p>
            </article>
          ))}
        </div>

        {notice ? <div className="notice">{notice}</div> : null}

        <form className="chat-form" onSubmit={handleChat}>
          <textarea
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder={chatPlaceholder || copy.chatPane.placeholder}
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
