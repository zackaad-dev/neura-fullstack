import { useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Icon } from '../components/icons/Icons'
import { AddTaskModal } from '../components/ui/AddTaskModal'
import { MOCK_TASKS } from '../lib/constants'

const ITEMS_PER_PAGE = 10

function TasksContent() {
  const [currentPageOpen, setCurrentPageOpen] = useState(1)
  const [currentPageCompleted, setCurrentPageCompleted] = useState(1)
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(
    new Set(MOCK_TASKS.filter((t) => t.status === 'DONE').map((t) => t.id))
  )
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  // Separate tasks into open and completed
  const allTasks = MOCK_TASKS.map((task) => ({
    ...task,
    isCompleted: completedTasks.has(task.id),
  }))

  const openTasks = allTasks.filter((t) => !t.isCompleted)
  const completedTasksArray = allTasks.filter((t) => t.isCompleted)

  // Pagination for open tasks
  const totalPagesOpen = Math.ceil(openTasks.length / ITEMS_PER_PAGE)
  const startIndexOpen = (currentPageOpen - 1) * ITEMS_PER_PAGE
  const paginatedOpenTasks = openTasks.slice(startIndexOpen, startIndexOpen + ITEMS_PER_PAGE)

  // Pagination for completed tasks
  const totalPagesCompleted = Math.ceil(completedTasksArray.length / ITEMS_PER_PAGE)
  const startIndexCompleted = (currentPageCompleted - 1) * ITEMS_PER_PAGE
  const paginatedCompletedTasks = completedTasksArray.slice(
    startIndexCompleted,
    startIndexCompleted + ITEMS_PER_PAGE
  )

  const handleToggleTask = (taskId: number) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const handleNextPageOpen = () => {
    if (currentPageOpen < totalPagesOpen) {
      setCurrentPageOpen(currentPageOpen + 1)
    }
  }

  const handlePrevPageOpen = () => {
    if (currentPageOpen > 1) {
      setCurrentPageOpen(currentPageOpen - 1)
    }
  }

  const handleNextPageCompleted = () => {
    if (currentPageCompleted < totalPagesCompleted) {
      setCurrentPageCompleted(currentPageCompleted + 1)
    }
  }

  const handlePrevPageCompleted = () => {
    if (currentPageCompleted > 1) {
      setCurrentPageCompleted(currentPageCompleted - 1)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all your tasks.
          </p>
        </div>
        <button
          onClick={() => setAddTaskOpen(true)}
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2.5 transition"
        >
          <Icon.Plus />
        </button>
      </div>

      {/* Open Tasks Card */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
          Open Tasks
        </h2>
        <div className="space-y-3">
          {paginatedOpenTasks.length > 0 ? (
            paginatedOpenTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition shrink-0"
                    >
                      <Icon.Square />
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black dark:text-white">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.projectName}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={task.status as 'TODO' | 'IN_PROGRESS' | 'DONE'} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No open tasks</p>
            </div>
          )}
        </div>

        {/* Pagination for Open Tasks */}
        {paginatedOpenTasks.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handlePrevPageOpen}
              disabled={currentPageOpen === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Icon.ChevronLeft />
              Previous
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPageOpen} of {totalPagesOpen}
            </div>

            <button
              onClick={handleNextPageOpen}
              disabled={currentPageOpen === totalPagesOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <Icon.ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Completed Tasks Card */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
          Completed Tasks
        </h2>
        <div className="space-y-3">
          {paginatedCompletedTasks.length > 0 ? (
            paginatedCompletedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 hover:border-gray-300 dark:hover:border-gray-600 transition opacity-75"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-green-500 hover:text-green-600 transition shrink-0"
                    >
                      <Icon.Check />
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.projectName}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={task.status as 'TODO' | 'IN_PROGRESS' | 'DONE'} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No completed tasks yet</p>
            </div>
          )}
        </div>

        {/* Pagination for Completed Tasks */}
        {paginatedCompletedTasks.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handlePrevPageCompleted}
              disabled={currentPageCompleted === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Icon.ChevronLeft />
              Previous
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPageCompleted} of {totalPagesCompleted}
            </div>

            <button
              onClick={handleNextPageCompleted}
              disabled={currentPageCompleted === totalPagesCompleted}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <Icon.ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal isOpen={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </div>
  )
}

function TasksPage() {
  const [dark, setDark] = useState(false)

  const toggleDark = () => {
    setDark((d) => {
      if (!d) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return !d
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar activePage="tasks" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <TasksContent />
        </div>
      </main>
    </div>
  )
}

export default TasksPage
