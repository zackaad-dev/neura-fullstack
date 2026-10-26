import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon } from '../icons/Icons'
import { getProjects, deleteProject, projectKeys, type Project } from '../../features/projects/api'
import { AddProjectModal } from './AddProjectModal'
import { useCurrentUser, userKeys } from '../../hooks/useCurrentUser'
import { useLogout } from '../../hooks/useLogout'
import { usersApi } from '../../api/users'
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
  const emailLabel = user?.email ?? fallbackEmail ?? 'Unknown email'

  // Profile State
  const [displayNameInput, setDisplayNameInput] = useState('')
  const [profileMessage, setProfileMessage] = useState<{ text: string; error: boolean } | null>(null)

  // Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; error: boolean } | null>(null)

  // Delete Account State
  const [typedEmail, setTypedEmail] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const logout = useLogout()
  const queryClient = useQueryClient()

  // Seed the form once /users/me resolves, and re-seed after a successful save
  useEffect(() => {
    setDisplayNameInput(user?.displayName ?? '')
  }, [user?.displayName])

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

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => {
      setProfileMessage({ text: 'Profile updated successfully!', error: false })
      // Sidebar and header read the same query, so they pick the new name up
      queryClient.invalidateQueries({ queryKey: userKeys.current })
    },
    onError: (err: Error) => {
      setProfileMessage({ text: err.message || 'Failed to update profile', error: true })
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: usersApi.updatePassword,
    onSuccess: () => {
      setPasswordMessage({ text: 'Password updated successfully!', error: false })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: (err: Error) => {
      setPasswordMessage({ text: err.message || 'Failed to update password', error: true })
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: () => {
      onClose()
      logout()
    },
    onError: (err: Error) => {
      setDeleteError(err.message || 'Failed to delete account')
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

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = displayNameInput.trim()
    if (!trimmed) {
      setProfileMessage({ text: 'Display name is required', error: true })
      return
    }
    if (trimmed.length > 100) {
      setProfileMessage({ text: 'Display name must not exceed 100 characters', error: true })
      return
    }
    if (trimmed === (user?.displayName ?? '')) {
      setProfileMessage({ text: 'No changes to save', error: false })
      return
    }
    setProfileMessage(null)
    updateProfileMutation.mutate({ displayName: trimmed })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      setPasswordMessage({ text: 'Current password is required', error: true })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'New password must be at least 6 characters', error: true })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', error: true })
      return
    }
    setPasswordMessage(null)
    updatePasswordMutation.mutate({ currentPassword, newPassword })
  }

  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typedEmail.trim().toLowerCase() !== emailLabel.trim().toLowerCase()) {
      setDeleteError('Typed email does not match account email')
      return
    }
    setDeleteError(null)
    deleteAccountMutation.mutate()
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Profile Details</h3>
                  {user?.demo ? (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Demo Account (Read-Only)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Standard Account
                    </span>
                  )}
                </div>
                {user?.demo && (
                  <div className="p-3 mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 rounded-lg text-xs">
                    Profile editing is disabled for demo accounts.
                  </div>
                )}

                {profileMessage && (
                  <div
                    className={`p-3 mb-4 rounded-lg text-xs font-medium ${
                      profileMessage.error
                        ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {profileMessage.text}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      placeholder="Your display name"
                      maxLength={100}
                      disabled={user?.demo}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailLabel}
                      readOnly
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950 text-black dark:text-white text-sm opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      Email address cannot be changed.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending || user?.demo}
                    className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition mt-2"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {currentPage === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Change Password
                  </h3>
                </div>

                {user?.demo && (
                  <div className="p-3 mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 rounded-lg text-xs">
                    Password change is disabled for demo accounts.
                  </div>
                )}

                {passwordMessage && (
                  <div
                    className={`p-3 mb-4 rounded-lg text-xs font-medium ${
                      passwordMessage.error
                        ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      disabled={user?.demo}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      disabled={user?.demo}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      disabled={user?.demo}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatePasswordMutation.isPending || user?.demo}
                    className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition mt-2"
                  >
                    {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {currentPage === 'delete-account' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Delete Account
                  </h3>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-400 font-medium">
                    This action is permanent and cannot be undone. All your projects, tasks, and notes will be deleted immediately.
                  </p>
                </div>

                {user?.demo && (
                  <div className="p-3 mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 rounded-lg text-xs">
                    Account deletion is disabled for demo accounts.
                  </div>
                )}

                {deleteError && (
                  <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium">
                    {deleteError}
                  </div>
                )}

                <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type your email (<span className="font-semibold text-black dark:text-white">{emailLabel}</span>) to confirm
                    </label>
                    <input
                      type="email"
                      value={typedEmail}
                      onChange={(e) => setTypedEmail(e.target.value)}
                      placeholder={emailLabel}
                      disabled={user?.demo}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      deleteAccountMutation.isPending ||
                      typedEmail.trim().toLowerCase() !== emailLabel.trim().toLowerCase() ||
                      user?.demo
                    }
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                  >
                    {deleteAccountMutation.isPending ? 'Deleting Account...' : 'Permanently Delete Account'}
                  </button>
                </form>
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
