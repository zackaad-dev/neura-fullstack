import { useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Icon } from '../components/icons/Icons'
import { AddNoteModal } from '../components/ui/AddNoteModal'
import { MOCK_NOTES } from '../lib/constants'

const ITEMS_PER_PAGE = 10

interface NoteModalProps {
  note: (typeof MOCK_NOTES)[0] | null
  onClose: () => void
}

function NoteModal({ note, onClose }: NoteModalProps) {
  if (!note) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">{note.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <span>{note.projectName}</span>
            <span>·</span>
            <span>Updated {note.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotesContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNote, setSelectedNote] = useState<(typeof MOCK_NOTES)[0] | null>(null)
  const [addNoteOpen, setAddNoteOpen] = useState(false)

  const totalPages = Math.ceil(MOCK_NOTES.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNotes = MOCK_NOTES.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage all your notes.
          </p>
        </div>
        <button
          onClick={() => setAddNoteOpen(true)}
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2.5 transition"
        >
          <Icon.Plus />
        </button>
      </div>

      {/* Notes Card */}
      <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="space-y-3">
          {paginatedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl px-5 py-4 hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-black dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-500 transition">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {note.projectName}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {note.updatedAt}
                    </span>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Icon.ChevronLeft />
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
            <Icon.ChevronRight />
          </button>
        </div>
      </div>

      {/* Modal */}
      <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      <AddNoteModal isOpen={addNoteOpen} onClose={() => setAddNoteOpen(false)} />
    </div>
  )
}

function NotesPage() {
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
      <Sidebar activePage="notes" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <NotesContent />
        </div>
      </main>
    </div>
  )
}

export default NotesPage
