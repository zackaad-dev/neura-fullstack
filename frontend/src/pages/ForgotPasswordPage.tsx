import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Loader2, ArrowLeft, CheckCircle2, Copy, KeyRound } from 'lucide-react'
import { forgotPassword, type ForgotPasswordResponse } from '../api/auth'
import { VIOLET } from '../lib/constants'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  const [copied, setCopied] = useState(false)

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition'

  const {
    mutate,
    isPending,
    error: apiError,
    data: successData,
  } = useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: (emailToReset) => forgotPassword(emailToReset),
  })

  const displayError = validationError || (apiError instanceof Error ? apiError.message : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    if (!email) {
      setValidationError('Email address is required')
      return
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address')
      return
    }
    mutate(email)
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold inline-block" style={{ color: VIOLET }}>
            Neura
          </Link>
          <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          {successData ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {successData.message}
              </p>

              {successData.token && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl text-left space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Reset Token (Dev Mode)</span>
                    <button
                      onClick={() => copyToken(successData.token!)}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">
                    {successData.token}
                  </div>
                  <button
                    onClick={() => navigate(`/reset-password?token=${encodeURIComponent(successData.token!)}`)}
                    className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 transition"
                    style={{ backgroundColor: VIOLET }}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Proceed to Reset Password
                  </button>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  style={{ color: VIOLET }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {displayError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                  {displayError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isPending ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
