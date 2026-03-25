import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/icons/Icons'
import { VIOLET } from '../lib/constants'

function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon.X className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">403 Forbidden</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Sorry, you don't have permission to access this page. Please log in or return to the home page.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 px-4 rounded-xl text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
          style={{ backgroundColor: VIOLET }}
        >
          <Icon.ArrowLeft className="w-4 h-4" />
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default ForbiddenPage
