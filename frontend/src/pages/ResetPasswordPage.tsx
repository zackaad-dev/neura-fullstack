import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { resetPassword } from '../api/auth'
import { VIOLET } from '../lib/constants'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const {
    mutate,
    isPending,
    error: apiError,
    isSuccess,
  } = useMutation<{ message: string }, Error, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  })

  const displayError = validationError || (apiError instanceof Error ? apiError.message : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!token) {
      setValidationError('Reset token is required')
      return
    }
    if (!newPassword) {
      setValidationError('New password is required')
      return
    }
    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    mutate({ token, newPassword })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold inline-block" style={{ color: VIOLET }}>
            Neura
          </Link>
          <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please enter your new security credentials
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Password Reset Complete!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-4 py-3 px-4 rounded-xl text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ backgroundColor: VIOLET }}
              >
                Sign In Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {displayError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                  {displayError}
                </div>
              )}

              {!tokenFromUrl && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Enter reset token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{ '--tw-ring-color': VIOLET } as React.CSSProperties}
                    disabled={isPending}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ '--tw-ring-color': VIOLET } as React.CSSProperties}
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isPending ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
