'use client'

import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'

interface APIKey {
  id: number
  user_id: number
  name: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

interface NewKey extends APIKey {
  key: string  // only present on creation response
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<NewKey | null>(null)
  const [revoking, setRevoking] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    fetch('/api/api-keys')
      .then(r => r.json())
      .then(setKeys)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newKeyName.trim()
    if (!name) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) { setError('Failed to create key.'); return }
      const created: NewKey = await res.json()
      setNewKey(created)
      setNewKeyName('')
      setKeys(prev => [created, ...prev])
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: number) {
    setRevoking(id)
    try {
      await fetch(`/api/api-keys/${id}`, { method: 'DELETE' })
      setKeys(prev => prev.map(k => k.id === id ? { ...k, is_active: false } : k))
      if (newKey?.id === id) setNewKey(null)
    } finally {
      setRevoking(null)
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1815', letterSpacing: '-0.02em' }}>API Keys</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#807a6f' }}>
          Use these keys to authenticate SDK requests via <code style={{ fontSize: 12, background: '#f4f3ef', padding: '1px 5px', borderRadius: 4 }}>X-API-Key</code> header.
        </p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} style={{
        display: 'flex', gap: 8, marginBottom: 24,
        padding: '16px', background: '#fff',
        border: '1px solid #e8e6df', borderRadius: 12,
      }}>
        <input
          ref={nameInputRef}
          value={newKeyName}
          onChange={e => setNewKeyName(e.target.value)}
          placeholder="Key name, e.g. my-agent-script"
          disabled={creating}
          style={{
            flex: 1, padding: '9px 12px', fontSize: 13,
            border: '1px solid #e8e6df', borderRadius: 8,
            outline: 'none', color: '#1a1815', background: '#fafaf9',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={creating || !newKeyName.trim()}
          style={{
            padding: '9px 16px', fontSize: 13, fontWeight: 600,
            background: '#14110d', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            opacity: (creating || !newKeyName.trim()) ? 0.5 : 1,
            fontFamily: 'inherit',
          }}
        >
          {creating ? 'Creating…' : 'Create key'}
        </button>
      </form>
      {error && <div style={{ marginBottom: 16, fontSize: 13, color: '#b45309' }}>{error}</div>}

      {/* Newly created key — show once */}
      {newKey && newKey.is_active && (
        <div style={{
          marginBottom: 20, padding: '14px 16px',
          background: '#f0fdf4', border: '1px solid #86efac',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#15803d', marginBottom: 6 }}>
            Key created — copy it now, it won't be shown again.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <code style={{
              flex: 1, fontSize: 12, padding: '8px 10px',
              background: '#fff', border: '1px solid #bbf7d0',
              borderRadius: 6, color: '#14110d',
              wordBreak: 'break-all', fontFamily: 'ui-monospace, monospace',
            }}>
              {newKey.key}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKey.key)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              style={{
                padding: '7px 12px', fontSize: 12, fontWeight: 500,
                background: copied ? '#f0fdf4' : '#fff',
                border: `1px solid ${copied ? '#22c55e' : '#86efac'}`,
                borderRadius: 6, cursor: 'pointer',
                color: copied ? '#15803d' : '#15803d',
                fontFamily: 'inherit', flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Keys table */}
      {loading ? (
        <div style={{ color: '#807a6f', fontSize: 13 }}>Loading…</div>
      ) : keys.length === 0 ? (
        <div style={{ color: '#807a6f', fontSize: 13 }}>No API keys yet.</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e8e6df', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e6df' }}>
                {['Name', 'Status', 'Created', 'Last used', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 16px',
                    textAlign: i === 4 ? 'right' : 'left',
                    fontWeight: 600, fontSize: 11,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: '#807a6f',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={k.id} style={{
                  borderBottom: i < keys.length - 1 ? '1px solid #f0ede5' : 'none',
                  background: !k.is_active ? 'rgba(0,0,0,0.015)' : 'transparent',
                }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: k.is_active ? '#1a1815' : '#807a6f' }}>
                    {k.name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      color: k.is_active ? '#15803d' : '#807a6f',
                      background: k.is_active ? 'rgba(34,197,94,0.10)' : 'rgba(128,122,111,0.10)',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%',
                        background: k.is_active ? '#22c55e' : '#807a6f' }}/>
                      {k.is_active ? 'active' : 'revoked'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#807a6f', whiteSpace: 'nowrap' }}>
                    {format(new Date(k.created_at), 'MMM d, yyyy')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#807a6f', whiteSpace: 'nowrap' }}>
                    {k.last_used_at ? format(new Date(k.last_used_at), 'MMM d, HH:mm') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {k.is_active && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        disabled={revoking === k.id}
                        style={{
                          padding: '5px 10px', fontSize: 11, fontWeight: 500,
                          background: 'none', border: '1px solid #e8e6df',
                          borderRadius: 6, cursor: 'pointer', color: '#807a6f',
                          fontFamily: 'inherit',
                          opacity: revoking === k.id ? 0.5 : 1,
                        }}
                        onMouseEnter={e => {
                          const b = e.currentTarget
                          b.style.borderColor = '#ef4444'
                          b.style.color = '#ef4444'
                        }}
                        onMouseLeave={e => {
                          const b = e.currentTarget
                          b.style.borderColor = '#e8e6df'
                          b.style.color = '#807a6f'
                        }}
                      >
                        {revoking === k.id ? 'Revoking…' : 'Revoke'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
