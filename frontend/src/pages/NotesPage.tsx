// ─── PAGE: NOTES ───────────────────────────────────────────────────────────────
function NotesPage() {
  const [activeNote, setActiveNote] = useState<typeof MOCK_NOTES[0] | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{MOCK_NOTES.length} notes across all projects</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setActiveNote(null); }}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition hover:opacity-90"
          style={{ backgroundColor: VIOLET }}
        >
          <Icon.Plus /> New Note
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Note list */}
        <div className="col-span-1 space-y-2">
          {showForm && (
            <button
              className="w-full text-left p-4 rounded-xl border-2 text-sm font-semibold bg-white dark:bg-gray-950"
              style={{ borderColor: VIOLET, color: VIOLET }}
            >
              + New note…
            </button>
          )}
          {MOCK_NOTES.map(n => (
            <button
              key={n.id}
              onClick={() => { setActiveNote(n); setShowForm(false); }}
              className={`w-full text-left p-4 rounded-xl border transition ${
                activeNote?.id === n.id
                  ? "border-2 bg-white dark:bg-gray-950"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              style={activeNote?.id === n.id ? { borderColor: VIOLET } : {}}
            >
              <div className="text-sm font-semibold text-black dark:text-white truncate">{n.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{n.projectName}</div>
              <div className="text-xs text-gray-400">{n.updatedAt}</div>
            </button>
          ))}
        </div>

        {/* Note detail / editor */}
        <div className="col-span-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 min-h-96">
          {showForm ? (
            <div className="h-full flex flex-col gap-4">
              <input
                type="text"
                placeholder="Note title"
                className="text-xl font-bold bg-transparent border-b border-gray-200 dark:border-gray-800 pb-3 text-black dark:text-white placeholder-gray-300 focus:outline-none"
              />
              <select className="self-start text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-gray-500 focus:outline-none">
                {MOCK_PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
              <textarea
                placeholder="Write your note…"
                className="flex-1 resize-none bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-300 focus:outline-none leading-relaxed"
              />
              <div className="flex gap-2">
                <button
                  className="text-sm font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ backgroundColor: VIOLET }}
                  onClick={() => setShowForm(false)}
                >
                  Save note
                </button>
                <button
                  className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : activeNote ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">{activeNote.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgb(98 78 173 / 0.1)", color: VIOLET }}
                    >
                      {activeNote.projectName}
                    </span>
                    <span className="text-xs text-gray-400">Updated {activeNote.updatedAt}</span>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{activeNote.content}</p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-700 text-sm">
              Select a note to read it, or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
