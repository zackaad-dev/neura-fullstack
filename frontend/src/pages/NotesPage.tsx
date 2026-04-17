import { useEffect, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, projectKeys } from '../features/projects/api'
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes'
import type { NoteResponse, CreateNoteRequest, UpdateNoteRequest } from '../api/notes'
import { Loader2 } from 'lucide-react'
import { Icon } from '../components/icons/Icons'
import { NoteModal } from '../components/ui/NoteModal'
import { NoteViewerModal } from '../components/ui/NoteViewerModal'
import { DeleteConfirmationModal } from '../components/ui/DeleteConfirmationModal'

function NotesPage() {
  const [dark, setDark] = useState(true)
  const queryClient = useQueryClient()

  // Selection state
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  // Note form state
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [noteValidationError, setNoteValidationError] = useState<string | null>(null)

  // Edit / Delete / View state
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)
  const [deletingNote, setDeletingNote] = useState<NoteResponse | null>(null)
  const [viewingNote, setViewingNote] = useState<NoteResponse | null>(null)

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

  // Fetch projects
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
  })

  // Auto-select first project when projects load
  useEffect(() => {
    if (projects && projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  // Fetch notes for selected project
  const { data: notes, isLoading: isNotesLoading } = useQuery({
    queryKey: selectedProjectId ? ['notes', selectedProjectId] : [],
    queryFn: () => (selectedProjectId ? getNotes(selectedProjectId) : Promise.reject('No project selected')),
    enabled: !!selectedProjectId,
  })

  // Create mutation
  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(selectedProjectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', selectedProjectId!] })
      setNewNoteTitle('')
      setNewNoteContent('')
      setNoteValidationError(null)
    },
  })

  // Update mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteRequest }) => updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', selectedProjectId!] })
      setEditingNote(null)
    },
  })

  // Delete mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', selectedProjectId!] })
      setDeletingNote(null)
    },
  })

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

  const handleUpdateNote = (data: UpdateNoteRequest) => {
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
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      <Sidebar activePage="notes" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">Notes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Browse and manage your project notes and thoughts.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Project
            </label>
            {isProjectsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading projects...
              </div>
            ) : projects && projects.length > 0 ? (
              <select
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                className="w-full md:w-1/2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No projects found. Create one first.
              </p>
            )}
          </div>

          {selectedProjectId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
              {/* Left Panel - Create Form */}
              <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col h-fit lg:sticky lg:top-0">
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                  Add Note
                </h2>

                {/* Create Form */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-xl space-y-3">
                  {(noteValidationError || createNoteMutation.isError) && (
                    <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs">
                      {noteValidationError || createNoteMutation.error?.message}
                    </div>
                  )}
                  <div>
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note title"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Note content (optional)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateNote}
                    disabled={createNoteMutation.isPending || !newNoteTitle.trim()}
                    className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                  >
                    {createNoteMutation.isPending ? 'Saving...' : 'Add Note'}
                  </button>
                </div>
              </div>

              {/* Right Panel - Notes List */}
              <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col">
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                  Project Notes
                </h2>

                {/* Notes List */}
                <div className="space-y-3 flex-1">
                  {isNotesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading notes...
                    </div>
                  ) : notes && notes.length > 0 ? (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex flex-col gap-2 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-black dark:text-white">
                              {note.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setViewingNote(note)
                              }}
                              className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                              title="View"
                            >
                              <Icon.Eye />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingNote(note)
                              }}
                              className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                              title="Edit"
                            >
                              <Icon.Edit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingNote(note)
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                              title="Delete"
                            >
                              <Icon.Trash />
                            </button>
                          </div>
                        </div>
                        {note.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                            {note.content}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">No notes yet. Add one on the left.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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

      <NoteViewerModal
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        note={viewingNote}
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

export default NotesPage
