import type { AgentState, WorkSummary } from './types'

export interface TooltipData {
  agent: AgentState
  since: number
  x: number
  y: number
}

const WORK_STATUS_COLOR: Record<WorkSummary['status'], string> = {
  processing: '#facc15',
  completed:  '#22c55e',
  failed:     '#ef4444',
}

const WORK_STATUS_ICON: Record<WorkSummary['status'], string> = {
  processing: '⟳',
  completed:  '✓',
  failed:     '✕',
}

export function Tooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null
  const { agent, since, x, y } = data
  const ageSec = Math.max(1, Math.floor((Date.now() - since) / 1000))

  // current work first, then recent (deduplicated by id)
  const allWorks: WorkSummary[] = []
  if (agent.current_work) allWorks.push(agent.current_work)
  for (const w of agent.recent_works) {
    if (!allWorks.find(a => a.id === w.id)) allWorks.push(w)
  }

  return (
    <div style={{
      position: 'fixed', zIndex: 100, background: '#14110d', color: '#fff',
      padding: '10px 12px', borderRadius: 10, fontSize: 11, pointerEvents: 'none',
      boxShadow: '0 8px 22px rgba(0,0,0,0.28)',
      transform: 'translate(14px, 14px)', left: x, top: y,
      minWidth: 200, maxWidth: 280,
    }}>
      {/* Agent header */}
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: agent.color, flexShrink: 0 }}/>
        {agent.name}
        <span style={{ opacity: 0.45, fontWeight: 400, marginLeft: 2 }}>{agent.role}</span>
      </div>

      {/* Status row */}
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: '0.04em', marginBottom: allWorks.length ? 8 : 0 }}>
        <span style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          marginRight: 5, verticalAlign: 1,
          background: agent.status === 'working' ? '#22c55e' : '#f59e0b',
        }}/>
        {agent.status} · {ageSec}s
      </div>

      {/* Work list */}
      {allWorks.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.10)',
          paddingTop: 7,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {allWorks.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 0.5,
                color: WORK_STATUS_COLOR[w.status],
              }}>
                {WORK_STATUS_ICON[w.status]}
              </span>
              <span style={{
                fontSize: 11,
                color: w.status === 'processing'
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.50)',
                textDecoration: w.status === 'failed' ? 'line-through' : 'none',
                lineHeight: 1.4,
                wordBreak: 'break-word',
              }}>
                {w.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
