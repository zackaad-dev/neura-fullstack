import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

function RegisterPage() {
  const VIOLET = 'rgb(98, 78, 173)'
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const handleSubmit = async () => {
    setError('')

    // Check that passwords match (backend handles email & password validation)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const data = await api.post<{ token: string; email: string }>('/auth/register', {
        email,
        password,
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold" style={{ color: VIOLET }}>
            Neura
          </span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your workspace</p>
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
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                className={inputClass}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full text-sm font-semibold text-white py-3 rounded-xl mt-2 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: VIOLET }}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold hover:underline"
            style={{ color: VIOLET }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
