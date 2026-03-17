import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { endpoints } from '../api/endpoints'

function LoginPage() {
  const VIOLET = 'rgb(98, 78, 173)'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const data = await api.post<
        { token: string; email: string },
        { email: string; password: string }
      >(endpoints.auth.login, {
        email,
        password,
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@neura.dev')
    setPassword('DemoPassword123')
    setError('')
    setIsLoading(true)

    try {
      const data = await api.post<
        { token: string; email: string },
        { email: string; password: string }
      >(endpoints.auth.login, {
        email: 'demo@neura.dev',
        password: 'DemoPassword123',
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold" style={{ color: VIOLET }}>
            Neura
          </span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your workspace</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ '--tw-ring-color': VIOLET } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full text-sm font-semibold text-white py-3 rounded-xl mt-2 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: VIOLET }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Demo shortcut */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full text-xs font-medium py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use demo account → demo@neura.dev / DemoPassword123
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          No account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold hover:underline"
            style={{ color: VIOLET }}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
