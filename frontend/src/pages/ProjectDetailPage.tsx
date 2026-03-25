import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Sidebar } from '../components/layout/Sidebar'
import { Icon } from '../components/icons/Icons'
import { getProject, projectKeys } from '../features/projects/api'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const projectId = id ? parseInt(id, 10) : null

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: projectKeys.detail(projectId || 0),
    queryFn: () => (projectId ? getProject(projectId) : Promise.reject('Invalid project ID')),
    enabled: !!projectId,
  })

  const toggleDark = () => {
    setDark((d) => !d)
  }

  if (isError || projectId === null) {
    return (
      <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
        <Sidebar activePage="dashboard" dark={dark} onToggleDark={toggleDark} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 lg:p-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">Project not found</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
        <Sidebar activePage="dashboard" dark={dark} onToggleDark={toggleDark} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 lg:p-10">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar activePage="dashboard" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 mb-6 transition"
          >
            <Icon.ArrowLeft />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
            )}
            {project?.createdAt && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Tasks and Notes Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                Tasks
              </h2>
              <div className="space-y-3">
                <p className="text-sm italic text-gray-500 dark:text-gray-400">No tasks yet</p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                Notes
              </h2>
              <div className="space-y-3">
                <p className="text-sm italic text-gray-500 dark:text-gray-400">No notes yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
