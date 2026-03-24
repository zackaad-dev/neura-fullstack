import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { endpoints } from '../api/endpoints'
import { Loader2 } from 'lucide-react'

// Simple email regex for client-side validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function LoginPage() {
  const VIOLET = 'rgb(98, 78, 173)'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validations
    if (!email) {
      setError('Email is required')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!password) {
      setError('Password is required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
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
      if (data.email) {
        localStorage.setItem('user_email', data.email)
      }

      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    // Hardcoded demo credentials for quick access
    const demoEmail = 'demo@neura.dev'
    const demoPassword = 'DemoPassword123'

    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    setIsLoading(true)

    try {
      const data = await api.post<
        { token: string; email: string },
        { email: string; password: string }
      >(endpoints.auth.login, {
        email: demoEmail,
        password: demoPassword,
      })

      localStorage.setItem('token', data.token)
      if (data.email) {
        localStorage.setItem('user_email', data.email)
      }
      navigate('/dashboard')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with demo account'
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
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                {error}
              </div>
            )}

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
                disabled={isLoading}
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
                style={{ '--tw-ring-color': VIOLET } as React.CSSProperties}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: VIOLET }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition text-sm disabled:opacity-50"
            >
              Try Demo Account
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="font-medium hover:underline" style={{ color: VIOLET }}>
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
