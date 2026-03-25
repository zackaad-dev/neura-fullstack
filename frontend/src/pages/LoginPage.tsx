import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { login } from '../api/auth'
import { setToken, setEmail } from '../lib/auth'
import { VIOLET } from '../lib/constants'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmailField] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const {
    mutate,
    isPending,
    error: apiError,
  } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setToken(data.token)
      setEmail(data.email)
      navigate('/dashboard')
    },
  })

  const displayError = validationError || (apiError instanceof Error ? apiError.message : '')

  const validate = (): boolean => {
    if (!email) {
      setValidationError('Email is required')
      return false
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address')
      return false
    }
    if (!password) {
      setValidationError('Password is required')
      return false
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    if (!validate()) return
    mutate({ email, password })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold" style={{ color: VIOLET }}>
            Neura
          </span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your workspace</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {displayError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                {displayError}
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
                onChange={(e) => setEmailField(e.target.value)}
                style={{ '--tw-ring-color': VIOLET } as React.CSSProperties}
                disabled={isPending}
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
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: VIOLET }}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

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
