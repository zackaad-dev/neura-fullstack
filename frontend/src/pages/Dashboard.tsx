import { Badge } from "../components/ui/badge";
import { MOCK_PROJECTS, MOCK_NOTES, MOCK_TASKS } from "../lib/constants";

function Dashboard() {

  const recentTasks = MOCK_TASKS.filter(t => t.status !== "DONE").slice(0, 4);
  const recentNotes = MOCK_NOTES.slice(0, 3);



  return (
     <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's going on.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Projects", value: MOCK_PROJECTS.length },
          { label: "Open Tasks", value: MOCK_TASKS.filter(t => t.status !== "DONE").length },
          { label: "Notes", value: MOCK_NOTES.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="text-3xl font-bold text-black dark:text-white">{value}</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">Projects</h2>
          <div className="space-y-3">
            {MOCK_PROJECTS.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-black dark:text-white">{p.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.description}</div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>{p.taskCount} tasks</div>
                  <div>{p.noteCount} notes</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {recentTasks.map(t => (
              <div key={t.id} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-black dark:text-white">{t.title}</div>
                  <Badge>{t.status}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-400">{t.projectName}</span>
                  <span className="text-xs text-gray-400">· Due {t.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent notes */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">Recent Notes</h2>
        <div className="grid grid-cols-3 gap-3">
          {recentNotes.map(n => (
            <div key={n.id} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition">
              <div className="text-sm font-semibold text-black dark:text-white mb-1">{n.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{n.content}</div>
              <div className="text-xs text-gray-400 mt-3">{n.projectName} · {n.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;