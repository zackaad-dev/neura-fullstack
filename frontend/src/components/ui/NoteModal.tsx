import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Icon } from '../icons/Icons'
import type { NoteResponse, UpdateNoteDto } from '../../api/notes'

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  /* eslint-disable-next-line no-unused-vars */
  onSubmit: (data: UpdateNoteDto) => void
  initialData: NoteResponse
  isLoading?: boolean
  error?: string | null
}

export function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  error,
}: NoteModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '')
      setContent(initialData?.content || '')
      setMode('edit')
      setValidationError(null)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!title.trim()) {
      setValidationError('Title is required')
      return
    }
    setValidationError(null)

    // We send only changed fields for update
    const payload: UpdateNoteDto = {}
    if (title !== initialData.title) payload.title = title
    if (content !== initialData.content) payload.content = content

    if (Object.keys(payload).length === 0) {
      onClose()
      return
    }

    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Edit Note</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {(validationError || error) && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {validationError || error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content (Markdown)
              </label>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-0.5 rounded-lg border border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    mode === 'edit'
                      ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    mode === 'preview'
                      ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {mode === 'edit' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note using Markdown..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            ) : (
              <div className="min-h-[150px] p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-950 text-sm text-black dark:text-white prose dark:prose-invert max-w-none">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic text-xs">Nothing to preview</p>
                )}
              </div>
            )}
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
            disabled={isLoading || !title.trim()}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
