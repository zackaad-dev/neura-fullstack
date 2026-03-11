import { useState } from "react";
import * as Icon from "lucide-react";
import { Badge } from "../components/ui/badge";



type Page = "landing" | "login" | "register" | "dashboard" | "tasks" | "notes";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const VIOLET = "rgb(98, 78, 173)";


  const MOCK_PROJECTS = [
  { id: 1, name: "API Redesign", description: "RESTful overhaul", taskCount: 8, noteCount: 3 },
  { id: 2, name: "Mobile App", description: "React Native prototype", taskCount: 5, noteCount: 7 },
  { id: 3, name: "DB Migration", description: "Postgres → v15", taskCount: 3, noteCount: 1 },
];

const MOCK_TASKS = [
  { id: 1, title: "Set up Testcontainers", status: "DONE", dueDate: "2026-03-08", projectName: "API Redesign" },
  { id: 2, title: "Write auth integration tests", status: "IN_PROGRESS", dueDate: "2026-03-12", projectName: "API Redesign" },
  { id: 3, title: "Global exception handler", status: "TODO", dueDate: "2026-03-15", projectName: "API Redesign" },
  { id: 4, title: "Prototype navigation flow", status: "IN_PROGRESS", dueDate: "2026-03-11", projectName: "Mobile App" },
  { id: 5, title: "Review migration scripts", status: "TODO", dueDate: "2026-03-20", projectName: "DB Migration" },
  { id: 6, title: "Flyway V4 notes migration", status: "DONE", dueDate: "2026-03-05", projectName: "DB Migration" },
];

const MOCK_NOTES = [
  { id: 1, title: "Auth Architecture Decision", content: "Chose JWT over sessions for stateless scaling. No refresh tokens for MVP — 24hr expiry acceptable. Revisit post-launch.", projectName: "API Redesign", updatedAt: "2026-03-09" },
  { id: 2, title: "DTO Mapping Strategy", content: "Manual mapping chosen over MapStruct to keep dependencies minimal and mapping logic explicit and testable.", projectName: "API Redesign", updatedAt: "2026-03-07" },
  { id: 3, title: "UI Font Decision", content: "Outfit (300/400/600 weights) — clean, modern, readable at small sizes. Pairs well with the violet brand color.", projectName: "Mobile App", updatedAt: "2026-03-10" },
  { id: 4, title: "Schema Review Notes", content: "All foreign keys have ON DELETE CASCADE. Consider adding indexes on user_id for projects and project_id for tasks/notes.", projectName: "DB Migration", updatedAt: "2026-03-06" },
];

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