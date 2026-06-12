'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail ?? 'Registration failed')
      router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  const inputStyle: React.CSSProperties = {
    background: '#fafaf9',
    border: '1px solid #e8e6df',
    color: '#1a1815',
    fontSize: 16,
    padding: '14px 16px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: 12,
    width: '100%',
    outline: 'none',
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#fafaf9' }}>
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <div className="flex items-center justify-center rounded-2xl" style={{
          width: 52, height: 52, background: '#14110d',
          boxShadow: '0 4px 16px rgba(20,17,13,0.18)',
        }}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <path d="M 4 -17 L 23 -30 L 16 -10 Z" fill="white" transform="translate(50,50)" opacity="0.9"/>
            <path d="M -4 -17 L -23 -30 L -16 -10 Z" fill="white" transform="translate(50,50)" opacity="0.9"/>
            <circle cx="50" cy="50" r="19" fill="white" opacity="0.9"/>
            <ellipse cx="50" cy="57" rx="11" ry="9" fill="#14110d" opacity="0.15"/>
            <circle cx="43" cy="47" r="3" fill="#14110d"/>
            <circle cx="57" cy="47" r="3" fill="#14110d"/>
            <ellipse cx="50" cy="53" rx="2.4" ry="2" fill="#14110d"/>
          </svg>
        </div>
        <div className="text-center">
          <h1 className="font-bold tracking-tight" style={{ color: '#1a1815', fontSize: 30 }}>Create account</h1>
          <p className="mt-1" style={{ color: '#807a6f', fontSize: 16 }}>Join DenView to get started</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl p-8" style={{
        background: '#ffffff', border: '1px solid #e8e6df',
        boxShadow: '0 8px 32px rgba(20,18,14,0.07)',
      }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-semibold" style={{ color: '#1a1815', fontSize: 15 }}>
              Username
            </label>
            <input
              id="username" type="text" autoComplete="username" autoFocus
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="yourname" required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#a09890')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e8e6df')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold" style={{ color: '#1a1815', fontSize: 15 }}>
              Password
            </label>
            <input
              id="password" type="password" autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#a09890')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e8e6df')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm" className="font-semibold" style={{ color: '#1a1815', fontSize: 15 }}>
              Confirm password
            </label>
            <input
              id="confirm" type="password" autoComplete="new-password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#a09890')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e8e6df')}
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#b45309' }}>{error}</p>
          )}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-xl font-semibold transition-opacity"
            style={{
              background: '#14110d', color: '#fafaf9', fontSize: 16,
              padding: '15px 16px', opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '0.01em', marginTop: 4,
            }}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm" style={{ color: '#807a6f' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1a1815', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <p className="mt-6 text-xs" style={{ color: '#b8b2a8' }}>DenView · multi-agent office</p>
    </div>
  )
}
