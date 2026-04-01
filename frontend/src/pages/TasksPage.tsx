import { useEffect, useState, useMemo } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { useQuery, useQueries } from '@tanstack/react-query'
import { getProjects, projectKeys } from '../features/projects/api'
import { getTasks, taskKeys } from '../api/tasks'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function TasksPage() {
  const [dark, setDark] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const toggleDark = () => {
    setDark((prev) => !prev)
  }

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
  })

  // Fetch tasks for all projects
  const taskQueries = useQueries({
    queries: (projects || []).map((project) => ({
      queryKey: taskKeys.list(project.id),
      queryFn: () => getTasks(project.id),
      enabled: !!projects,
    })),
  })

  const isTasksLoading = taskQueries.some((q) => q.isLoading)

  const allTasks = useMemo(() => {
    return taskQueries
      .map((q, index) => {
        const projectTasks = q.data || []
        const project = projects?.[index]
        return projectTasks.map((t) => ({ ...t, projectName: project?.name }))
      })
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [taskQueries, projects])

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      <Sidebar activePage="tasks" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">All Tasks</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              A global view of tasks across all your projects.
            </p>
          </div>

          {(isProjectsLoading || isTasksLoading) ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading tasks...
            </div>
          ) : allTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col gap-3 cursor-pointer hover:border-violet-500 dark:hover:border-violet-500 transition shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-black dark:text-white">{task.title}</h3>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-1">
                        {task.projectName}
                      </p>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-2">
                    <StatusBadge status={task.status} />
                    {task.dueDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No tasks found. Create one inside a project.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TasksPage
