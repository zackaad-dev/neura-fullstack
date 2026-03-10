// ─── PAGE: TASKS ───────────────────────────────────────────────────────────────
function TasksPage() {
  const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);

  const filtered = filter === "ALL" ? MOCK_TASKS : MOCK_TASKS.filter(t => t.status === filter);
  const filters: Array<{ value: TaskStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "All" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{MOCK_TASKS.length} tasks across all projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition hover:opacity-90"
          style={{ backgroundColor: VIOLET }}
        >
          <Icon.Plus /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
              filter === f.value
                ? "text-white"
                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
            style={filter === f.value ? { backgroundColor: VIOLET } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inline new task form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-950 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Task title"
              className="col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none"
            />
            <select className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none">
              {MOCK_PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg"
              style={{ backgroundColor: VIOLET }}
              onClick={() => setShowForm(false)}
            >
              Add task
            </button>
            <button
              className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map(t => (
          <div
            key={t.id}
            className="flex items-center justify-between bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 hover:border-gray-300 dark:hover:border-gray-600 transition group"
          >
            <div className="flex items-center gap-4">
              {/* Checkbox visual */}
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  t.status === "DONE" ? "border-transparent" : "border-gray-300 dark:border-gray-600"
                }`}
                style={t.status === "DONE" ? { backgroundColor: VIOLET } : {}}
              >
                {t.status === "DONE" && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div>
                <div className={`text-sm font-medium ${t.status === "DONE" ? "line-through text-gray-400" : "text-black dark:text-white"}`}>
                  {t.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{t.projectName} · Due {t.dueDate}</div>
              </div>
            </div>
            <StatusBadge status={t.status as TaskStatus} />
          </div>
        ))}
      </div>
    </div>
  );
}
