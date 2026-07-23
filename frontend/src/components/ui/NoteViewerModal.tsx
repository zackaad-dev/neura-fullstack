import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Icon } from '../icons/Icons'
import type { NoteResponse } from '../../api/notes'

interface NoteViewerModalProps {
  isOpen: boolean
  onClose: () => void
  note: NoteResponse | null
}

export function NoteViewerModal({ isOpen, onClose, note }: NoteViewerModalProps) {
  if (!isOpen || !note) return null

  const lastEditedDate = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : null
  const lastEditedTime = note.updatedAt ? new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white flex-1">{note.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition ml-4"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {note.content ? (
            <div className="text-sm text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm italic text-gray-500 dark:text-gray-400">No content</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {lastEditedDate && (
                <span>
                  Last edited on {lastEditedDate}
                  {lastEditedTime && <span> at {lastEditedTime}</span>}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
