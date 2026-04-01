import { useEffect, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'

function NotesPage() {
  const [dark, setDark] = useState(true)

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

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar activePage="notes" dark={dark} onToggleDark={toggleDark} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 flex items-center justify-center">
          <div className="max-w-2xl text-center space-y-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Notes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Notes are coming soon. For now, capture thoughts and decisions inside each project.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This space will synthesize your project conversations shortly.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotesPage
