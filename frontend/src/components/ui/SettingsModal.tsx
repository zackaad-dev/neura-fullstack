import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon } from '../icons/Icons'
import { getProjects, deleteProject, projectKeys, type Project } from '../../features/projects/api'
import { AddProjectModal } from './AddProjectModal'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { getEmail } from '../../lib/auth'

type SettingsPage =
  | 'profile'
  | 'password'
  | 'delete-account'
  | 'default-view'
  | 'sidebar'
  | 'manage-projects'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isDark: boolean
  onToggleDark: () => void
}

export function SettingsModal({ isOpen, onClose, isDark, onToggleDark }: SettingsModalProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('profile')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { data: user } = useCurrentUser()
  const fallbackEmail = getEmail()
  const displayLabel = user?.displayName ?? fallbackEmail ?? 'User'
  const emailLabel = user?.email ?? fallbackEmail ?? 'Unknown email'

  const queryClient = useQueryClient()

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
    enabled: isOpen && currentPage === 'manage-projects',
  })

  const { mutate: deleteProjectMutation } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  if (!isOpen) return null

  const menuItems = [
    {
      category: 'Account',
      items: [
        { id: 'profile' as const, label: 'Profile' },
        { id: 'password' as const, label: 'Change Password' },
        { id: 'delete-account' as const, label: 'Delete Account' },
      ],
    },
    {
      category: 'General',
      items: [
        { id: 'manage-projects' as const, label: 'Manage Projects' },
        { id: 'default-view' as const, label: 'Default View' },
        { id: 'sidebar' as const, label: 'Sidebar', disabled: true },
      ],
    },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Menu */}
          <div className="w-48 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
            {menuItems.map((section) => (
              <div key={section.category}>
                <div className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.category}
                </div>
                <div className="space-y-1 px-2 pb-4">
                  {section.items.map((item) => {
                    const isDisabled = item.disabled ?? false
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setCurrentPage(item.id)
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                          currentPage === item.id && !isDisabled
                            ? 'bg-white dark:bg-black text-black dark:text-white font-medium shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/50'
                        } ${
                          isDisabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>{item.label}</span>
                          {isDisabled && (
                            <span className="text-[11px] italic text-gray-500 dark:text-gray-400">
                              (Disabled)
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Settings Pages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentPage === 'profile' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Profile</h3>
                  <span className="text-xs italic text-gray-500 dark:text-gray-400">
                    Coming soon
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display name
                    </p>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {displayLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-black dark:text-white">{emailLabel}</p>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'password' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Change Password
                  </h3>
                  <span className="text-xs italic text-gray-500 dark:text-gray-400">
                    Coming soon
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Coming soon"
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Coming soon"
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Coming soon"
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-sm"
                    />
                  </div>
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium transition mt-2 opacity-70 cursor-not-allowed"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'delete-account' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Delete Account
                  </h3>
                  <span className="text-xs italic text-gray-500 dark:text-gray-400">
                    Coming soon
                  </span>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    This action is permanent and cannot be undone. All your data will be deleted
                    immediately.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type your email to confirm
                    </label>
                    <input
                      type="email"
                      value={emailLabel}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-sm"
                    />
                  </div>
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition opacity-70 cursor-not-allowed"
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'default-view' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Default View
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes per page
                    </p>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      10 per page (locked)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasks per page
                    </p>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      10 per page (locked)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'manage-projects' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Manage Projects
                </h3>
                {isLoadingProjects ? (
                  <div className="text-sm text-gray-500">Loading projects...</div>
                ) : (
                  <div className="space-y-3">
                    {projects?.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="text-sm font-medium text-black dark:text-white">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {project.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-violet-500 hover:text-violet-700 p-2"
                            title="Edit project"
                          >
                            <Icon.Edit />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this project?')) {
                                deleteProjectMutation(project.id)
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Delete project"
                          >
                            <Icon.Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!projects || projects.length === 0) && (
                      <div className="text-sm text-gray-500 italic">No projects found</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentPage === 'sidebar' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Sidebar</h3>
                  <span className="text-xs italic text-gray-500 dark:text-gray-400">Disabled</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Sidebar filters are temporarily disabled and will return in a future release.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isDark ? 'Light mode' : 'Dark mode'}
                    </span>
                    <button
                      onClick={onToggleDark}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDark ? 'bg-violet-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDark ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <AddProjectModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        project={editingProject}
      />
    </div>
  )
}
