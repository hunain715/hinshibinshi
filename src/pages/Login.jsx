import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [busy,     setBusy]     = useState(false)
  const [error,    setError]    = useState('')

  const nav      = useNavigate()
  const location = useLocation()
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/admin'

  const submit = async e => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await base44.auth.login(email.trim(), password)
      if (user.role === 'admin') {
        nav(returnTo, { replace: true })
      } else {
        setError('You do not have admin access.')
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="https://i.ibb.co/tTcb55FY/logo-png.png"
              alt="Hinshi Binshi"
              className="h-20 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-card p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-brand/10 flex items-center justify-center">
              <ShieldCheck size={22} className="text-brand" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-black text-dark">Admin Login</h1>
              <p className="text-muted text-sm">Hinshi Binshi — Restricted Access</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="binshihinshi@gmail.com"
                className="input-white w-full text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono-body text-[11px] uppercase tracking-wider text-dark-3 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••••"
                  className="input-white w-full text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold text-sm transition-colors shadow-brand-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {busy
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : 'Sign In to Dashboard'
              }
            </button>
          </form>

          {/* Back to store */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/"
              className="text-sm text-muted hover:text-brand transition-colors font-medium"
            >
              ← Back to Store
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          © {new Date().getFullYear()} Hinshi Binshi. All rights reserved.
        </p>
      </div>
    </div>
  )
}
