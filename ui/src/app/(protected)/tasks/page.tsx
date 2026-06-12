'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Task {
  id: number
  name: string
  description: string | null
  status: 'running' | 'done' | 'failed'
  agent_count: number
  view_token: string
  created_at: string
  finished_at: string | null
}

const STATUS_COLOR: Record<Task['status'], string> = {
  running: '#22c55e',
  done:    '#807a6f',
  failed:  '#ef4444',
}

const STATUS_BG: Record<Task['status'], string> = {
  running: 'rgba(34,197,94,0.10)',
  done:    'rgba(128,122,111,0.10)',
  failed:  'rgba(239,68,68,0.10)',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Task | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/tasks/list')
        setTasks(await r.json())
      } finally {
        setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 5_000)
    return () => clearInterval(t)
  }, [])

  const embedUrl = selected
    ? `/view/${selected.id}?token=${encodeURIComponent(selected.view_token)}`
    : null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Task list panel */}
      <div style={{
        width: selected ? 360 : '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: selected ? '1px solid #e8e6df' : 'none',
        transition: 'width 240ms ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '32px 32px 20px', flexShrink: 0 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1815', letterSpacing: '-0.02em' }}>Tasks</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#807a6f' }}>
            {loading ? 'Loading…' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 32px 32px' }}>
          {loading ? (
            <div style={{ color: '#807a6f', fontSize: 13 }}>Loading…</div>
          ) : tasks.length === 0 ? (
            <div style={{ color: '#807a6f', fontSize: 13 }}>No tasks yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e6df' }}>
                  {['Name', 'Status', 'Agents', 'Created', 'Finished'].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px 10px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#807a6f',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const isSelected = selected?.id === task.id
                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelected(isSelected ? null : task)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0ede5',
                        background: isSelected ? '#f4f3ef' : 'transparent',
                        transition: 'background 120ms',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf9' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = isSelected ? '#f4f3ef' : 'transparent' }}
                    >
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#1a1815', marginBottom: 2 }}>{task.name}</div>
                        {task.description && (
                          <div style={{ color: '#807a6f', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 8px', borderRadius: 999,
                          fontSize: 11, fontWeight: 600,
                          color: STATUS_COLOR[task.status],
                          background: STATUS_BG[task.status],
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[task.status],
                            animation: task.status === 'running' ? 'pulse 1.5s ease-in-out infinite' : 'none' }}/>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px', color: '#807a6f', textAlign: 'center' }}>
                        {task.agent_count}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#807a6f', whiteSpace: 'nowrap' }}>
                        {format(new Date(task.created_at), 'MMM d, HH:mm')}
                      </td>
                      <td style={{ padding: '12px 12px', color: '#807a6f', whiteSpace: 'nowrap' }}>
                        {task.finished_at ? format(new Date(task.finished_at), 'MMM d, HH:mm') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Office iframe panel */}
      {selected && embedUrl && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafaf9' }}>
          {/* iframe header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', borderBottom: '1px solid #e8e6df',
            background: '#fff', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1815' }}>{selected.name}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 7px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status],
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[selected.status] }}/>
                {selected.status}
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: 'none', border: '1px solid #e8e6df', borderRadius: 8,
                padding: '4px 10px', fontSize: 12, color: '#807a6f', cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
          <iframe
            key={selected.id}
            src={embedUrl}
            style={{ flex: 1, border: 'none', width: '100%' }}
            title={`Task: ${selected.name}`}
          />
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
