import { useNavigate } from 'react-router-dom'
import { VIOLET } from '../lib/constants'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold mb-4" style={{ color: VIOLET }}>
            404
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full text-sm font-semibold text-white py-3 rounded-xl transition hover:opacity-90"
              style={{ backgroundColor: VIOLET }}
            >
              Go to home
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-sm font-medium py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              Go to dashboard
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
