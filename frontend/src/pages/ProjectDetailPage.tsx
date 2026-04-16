import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sidebar } from '../components/layout/Sidebar'
import { Icon } from '../components/icons/Icons'
import { Loader2 } from 'lucide-react'
import { getProject, projectKeys } from '../features/projects/api'
import { getTasks, createTask, updateTask, deleteTask, taskKeys } from '../api/tasks'
import type { TaskResponse, CreateTaskDto, UpdateTaskDto } from '../api/tasks'
import { getNotes, createNote, updateNote, deleteNote, noteKeys } from '../api/notes'
import type { NoteResponse, CreateNoteDto, UpdateNoteDto } from '../api/notes'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TaskModal } from '../components/ui/TaskModal'
import { NoteModal } from '../components/ui/NoteModal'
import { DeleteConfirmationModal } from '../components/ui/DeleteConfirmationModal'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [dark, setDark] = useState(true)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null)
  const [deletingTask, setDeletingTask] = useState<TaskResponse | null>(null)

  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [noteValidationError, setNoteValidationError] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)
  const [deletingNote, setDeletingNote] = useState<NoteResponse | null>(null)

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
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: projectKeys.detail(projectId || 0),
    queryFn: () => (projectId ? getProject(projectId) : Promise.reject('Invalid project ID')),
    enabled: !!projectId,
  })

  const {
    data: tasks,
    isLoading: isTasksLoading,
  } = useQuery({
    queryKey: projectId ? taskKeys.list(projectId) : [],
    queryFn: () => (projectId ? getTasks(projectId) : Promise.reject('Invalid project ID')),
    enabled: !!projectId,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskDto | UpdateTaskDto) => createTask(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId!) })
      setIsTaskModalOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: CreateTaskDto | UpdateTaskDto }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId!) })
      setEditingTask(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId!) })
      setDeletingTask(null)
    }
  })

  const {
    data: notes,
    isLoading: isNotesLoading,
  } = useQuery({
    queryKey: projectId ? noteKeys.list(projectId) : [],
    queryFn: () => (projectId ? getNotes(projectId) : Promise.reject('Invalid project ID')),
    enabled: !!projectId,
  })

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteDto) => createNote(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(projectId!) })
      setNewNoteTitle('')
      setNewNoteContent('')
      setNoteValidationError(null)
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateNoteDto }) => updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(projectId!) })
      setEditingNote(null)
    }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(projectId!) })
      setDeletingNote(null)
    }
  })

  const toggleDark = () => {
    setDark((d) => !d)
  }

  if (isProjectError || projectId === null) {
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

  if (isProjectLoading) {
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

  const handleCreateTask = (data: CreateTaskDto | UpdateTaskDto) => {
    createMutation.mutate(data)
  }

  const handleUpdateTask = (data: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data })
    }
  }

  const handleDeleteTask = () => {
    if (deletingTask) {
      deleteMutation.mutate(deletingTask.id)
    }
  }

  const handleCreateNote = () => {
    if (!newNoteTitle.trim()) {
      setNoteValidationError('Title is required')
      return
    }
    setNoteValidationError(null)
    createNoteMutation.mutate({
      title: newNoteTitle,
      content: newNoteContent.trim() || undefined,
    })
  }

  const handleUpdateNote = (data: UpdateNoteDto) => {
    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote.id, data })
    }
  }

  const handleDeleteNote = () => {
    if (deletingNote) {
      deleteNoteMutation.mutate(deletingNote.id)
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                  Tasks
                </h2>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-1 text-violet-600 hover:bg-violet-100 dark:text-violet-400 dark:hover:bg-violet-900/30 rounded transition"
                  title="Add Task"
                >
                  <Icon.Plus />
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {isTasksLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading tasks...
                  </div>
                ) : tasks && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-medium text-black dark:text-white">{task.title}</h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                            title="Edit"
                          >
                            <Icon.Edit />
                          </button>
                          <button
                            onClick={() => setDeletingTask(task)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Icon.Trash />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <StatusBadge status={task.status} />
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">No tasks yet</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                Notes
              </h2>

              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-xl mb-4">
                {(noteValidationError || createNoteMutation.error) && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs">
                    {noteValidationError || createNoteMutation.error?.message}
                  </div>
                )}
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full mb-2 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Note content (optional)"
                  rows={2}
                  className="w-full mb-3 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={handleCreateNote}
                  disabled={createNoteMutation.isPending || !newNoteTitle.trim()}
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                >
                  {createNoteMutation.isPending ? 'Saving...' : 'Add Note'}
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {isNotesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading notes...
                  </div>
                ) : notes && notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-black dark:text-white line-clamp-1">{note.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => setEditingNote(note)}
                            className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                            title="Edit"
                          >
                            <Icon.Edit />
                          </button>
                          <button
                            onClick={() => setDeletingNote(note)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Icon.Trash />
                          </button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-words">
                          {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                        </p>
                      )}
                      {note.createdAt && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Added {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">No notes yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createMutation.isPending}
        error={createMutation.error?.message}
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
        isLoading={updateMutation.isPending}
        error={updateMutation.error?.message}
      />

      {editingNote && (
        <NoteModal
          isOpen={true}
          onClose={() => setEditingNote(null)}
          onSubmit={handleUpdateNote}
          initialData={editingNote}
          isLoading={updateNoteMutation.isPending}
          error={updateNoteMutation.error?.message}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        isLoading={deleteMutation.isPending}
        title={deletingTask?.title || ''}
        itemType="task"
      />

      <DeleteConfirmationModal
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleDeleteNote}
        isLoading={deleteNoteMutation.isPending}
        title={deletingNote?.title || ''}
        itemType="note"
      />
    </div>
  )
}
