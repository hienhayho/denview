'use client'

import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { AgentState } from './types'

export function AgentNoteModal({ agent, onClose }: { agent: AgentState; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(20,18,14,0.45)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '48px 24px 24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(20,18,14,0.18)',
          width: '100%',
          maxWidth: 1100,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 20px',
          borderBottom: '1px solid #e8e6df',
          flexShrink: 0,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: agent.color, flexShrink: 0,
          }}/>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1815', flex: 1 }}>
            {agent.name}
            <span style={{ fontWeight: 400, color: '#807a6f', marginLeft: 6 }}>{agent.role}</span>
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#807a6f', fontSize: 18, lineHeight: 1, padding: '0 4px',
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {agent.note ? (
            <div className="agent-note-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{agent.note}</ReactMarkdown>
            </div>
          ) : (
            <p style={{ color: '#807a6f', fontSize: 13, margin: 0 }}>No notes yet.</p>
          )}
        </div>
      </div>

      <style>{`
        .agent-note-md { font-size: 13px; line-height: 1.7; color: #1a1815; }
        .agent-note-md h1,.agent-note-md h2,.agent-note-md h3 { font-weight: 700; margin: 1em 0 0.4em; color: #1a1815; }
        .agent-note-md h1 { font-size: 17px; }
        .agent-note-md h2 { font-size: 15px; }
        .agent-note-md h3 { font-size: 13px; }
        .agent-note-md p  { margin: 0 0 0.75em; }
        .agent-note-md ul,.agent-note-md ol { margin: 0 0 0.75em 1.2em; }
        .agent-note-md li { margin-bottom: 0.2em; }
        .agent-note-md code { background: #f4f3ef; border-radius: 4px; padding: 1px 5px; font-size: 12px; font-family: ui-monospace,monospace; }
        .agent-note-md pre { background: #1a1815; border-radius: 8px; padding: 12px 14px; overflow-x: auto; margin: 0 0 0.75em; }
        .agent-note-md pre code { background: none; padding: 0; color: #d4d0c8; }
        .agent-note-md blockquote { border-left: 3px solid #e8e6df; margin: 0 0 0.75em; padding: 0 0 0 12px; color: #807a6f; }
        .agent-note-md table { border-collapse: collapse; width: 100%; margin-bottom: 0.75em; }
        .agent-note-md th,.agent-note-md td { border: 1px solid #e8e6df; padding: 6px 10px; font-size: 12px; }
        .agent-note-md th { background: #f8f6f0; font-weight: 600; }
        .agent-note-md strong { font-weight: 700; }
        .agent-note-md a { color: #d95f12; text-decoration: none; }
        .agent-note-md a:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
