import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from '../components/layout/Sidebar'
import { AddProjectModal } from '../components/ui/AddProjectModal'
import { Icon } from '../components/icons/Icons'
import { getProjects, projectKeys } from '../features/projects/api'
import type { Project } from '../features/projects/types'
import { getTasks, taskKeys, createTask } from '../api/tasks'
import type { CreateTaskDto } from '../api/tasks'
import { getNotes } from '../api/notes'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TaskModal } from '../components/ui/TaskModal'

interface DashboardContentProps {
  projects?: Project[]
  onAddProject: () => void
  onAddTask: () => void
  selectedProjectForTask: number | null
  // eslint-disable-next-line no-unused-vars -- retain descriptive callback signature for consumers
  onProjectSelected: (projectId: number) => void
  isTaskCreationOpen: boolean
}

function DashboardContent({ projects, onAddProject, onAddTask, selectedProjectForTask, onProjectSelected, isTaskCreationOpen }: DashboardContentProps) {
  const navigate = useNavigate()

  const taskQueries = useQueries({
    queries: (projects || []).map((project) => ({
      queryKey: taskKeys.list(project.id),
      queryFn: () => getTasks(project.id),
      enabled: !!projects,
    })),
  })

  const noteQueries = useQueries({
    queries: (projects || []).map((project) => ({
      queryKey: ['notes', project.id],
      queryFn: () => getNotes(project.id),
      enabled: !!projects,
    })),
  })

  const allTasks = useMemo(() => {
    return taskQueries
      .map((q, index) => {
        const projectTasks = q.data || []
        const project = projects?.[index]
        return projectTasks.map((t) => ({ ...t, projectName: project?.name }))
      })
      .flat()
      .filter((t) => t.status !== 'DONE')
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        if (a.dueDate) return -1
        if (b.dueDate) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [taskQueries, projects])

  const allNotes = useMemo(() => {
    return noteQueries
      .map((q) => q.data || [])
      .flat()
  }, [noteQueries])

  const stats = [
    { label: 'Projects', value: projects?.length ?? 0 },
    { label: 'Tasks', value: allTasks.length },
    { label: 'Notes', value: allNotes.length },
  ]

  const firstProject = projects && projects.length > 0 ? projects[0].name : null

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Welcome back.
        </p>
        <h1 className="text-4xl font-bold text-black dark:text-white">
          {firstProject ? firstProject : 'Dashboard'}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
          >
            <div className="text-3xl font-bold text-black dark:text-white">
              {typeof value === 'number' ? value : value}
            </div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
              Projects
            </h2>
            <button
              onClick={onAddProject}
              className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-1.5 transition"
            >
              <Icon.Plus />
            </button>
          </div>
          <div className="space-y-3">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="w-full text-left flex flex-col gap-1 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 hover:border-gray-300 dark:hover:border-gray-600 transition"
                >
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {project.name}
                  </span>
                  {project.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {project.description}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">No projects yet</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
              Upcoming Tasks
            </h2>
            <button
              onClick={onAddTask}
              className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-1.5 transition"
              title="Add Task"
            >
              <Icon.Plus />
            </button>
          </div>
          {isTaskCreationOpen && selectedProjectForTask === null && projects && projects.length > 0 && (
            <div className="mb-4 p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a project
              </label>
              <select
                onChange={(e) => onProjectSelected(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Choose a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-3">
            {allTasks && allTasks.length > 0 ? (
              allTasks.slice(0, 5).map((task) => (
                <button
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  className="w-full text-left flex flex-col gap-1 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 hover:border-gray-300 dark:hover:border-gray-600 transition"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {task.title}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center justify-between w-full mt-1">
                     <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                        {task.projectName}
                      </span>
                     {task.dueDate && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface NoProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
}

function NoProjectsModal({ isOpen, onClose, onCreate }: NoProjectsModalProps) {
  if (!isOpen) return null

  const handleCreate = () => {
    onClose()
    onCreate()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-black dark:text-white">
          You don't have any projects yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Neura keeps everything organized once you add a project. Let’s create your first one.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
          >
            Create project
          </button>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [dark, setDark] = useState(true)
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [showEmptyProjectsModal, setShowEmptyProjectsModal] = useState(false)
  const [hasDismissedEmptyModal, setHasDismissedEmptyModal] = useState(false)
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false)
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<number | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: projects } = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => createTask(selectedProjectForTask!, data),
    onSuccess: () => {
      if (selectedProjectForTask) {
        queryClient.invalidateQueries({ queryKey: taskKeys.list(selectedProjectForTask) })
      }
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      setIsTaskModalOpen(false)
      setIsTaskCreationOpen(false)
      setSelectedProjectForTask(null)
    }
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  useEffect(() => {
    if (!projects) return
    if (projects.length === 0 && !hasDismissedEmptyModal) {
      setShowEmptyProjectsModal(true)
    } else {
      setShowEmptyProjectsModal(false)
    }
  }, [projects, hasDismissedEmptyModal])

  const toggleDark = () => {
    setDark((prev) => !prev)
  }

  const handleCloseEmptyProjectsModal = () => {
    setShowEmptyProjectsModal(false)
    setHasDismissedEmptyModal(true)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar activePage="dashboard" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <DashboardContent
            projects={projects}
            onAddProject={() => setAddProjectOpen(true)}
            onAddTask={() => setIsTaskCreationOpen(true)}
            selectedProjectForTask={selectedProjectForTask}
            onProjectSelected={(projectId) => {
              setSelectedProjectForTask(projectId)
              setIsTaskModalOpen(true)
            }}
            isTaskCreationOpen={isTaskCreationOpen}
          />
        </div>
      </main>

      <AddProjectModal isOpen={addProjectOpen} onClose={() => setAddProjectOpen(false)} />
      <NoProjectsModal
        isOpen={showEmptyProjectsModal}
        onClose={handleCloseEmptyProjectsModal}
        onCreate={() => setAddProjectOpen(true)}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setIsTaskCreationOpen(false)
          setSelectedProjectForTask(null)
        }}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isLoading={createTaskMutation.isPending}
        error={createTaskMutation.error?.message}
      />
    </div>
  )
}

export default Dashboard
