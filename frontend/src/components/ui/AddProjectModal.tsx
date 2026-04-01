import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon } from '../icons/Icons'
import {
  createProject,
  updateProject,
  projectKeys,
  type Project,
} from '../../features/projects/api'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project?: Project | null
}

export function AddProjectModal({ isOpen, onClose, project }: AddProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()
  const isEditing = !!project

  useEffect(() => {
    if (isEditing && project) {
      setName(project.name)
      setDescription(project.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [isOpen, isEditing, project])

  const { mutate: createProjectMutation, isPending: createPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      setName('')
      setDescription('')
      onClose()
    },
  })

  const { mutate: updateProjectMutation, isPending: updatePending } = useMutation({
    mutationFn: ([id, data]: [number, Parameters<typeof updateProject>[1]]) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      setName('')
      setDescription('')
      onClose()
    },
  })

  if (!isOpen) return null

  const existingName = project?.name ?? ''
  const existingDescription = project?.description ?? ''
  const trimmedName = name.trim()
  const hasChanges =
    !isEditing || trimmedName !== existingName || description !== existingDescription
  const canSubmit = Boolean(trimmedName) && hasChanges
  const isPending = createPending || updatePending
  const errorMessage = isEditing
    ? updateProjectMutation.error?.message
    : createProjectMutation.error?.message

  const handleSubmit = () => {
    if (!canSubmit) return
    if (isEditing && project) {
      updateProjectMutation([project.id, { name, description }])
    } else {
      createProjectMutation({ name, description })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isEditing ? 'Edit Project' : 'Add Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Study Plan 📒"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
          >
            {isPending
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update Project'
                : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
