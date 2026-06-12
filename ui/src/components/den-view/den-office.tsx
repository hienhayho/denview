'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Workstation } from './workstation'
import { CoffeeArea, SofaArea, WindowArea } from './shared-areas'
import { Tooltip, type TooltipData } from './tooltip'
import { DEN_CSS } from './den-styles'
import { AWAY_KINDS, WORKING_KINDS, IDLE_KINDS, type Activity, type AgentState, type TaskState } from './types'
import { pick } from './constants'

const ALL_IDLE = [...IDLE_KINDS, ...AWAY_KINDS] as Activity[]

// idle actions last ≤2s, working screens last ≥3s (pick 3–6s)
function nextDuration(status: AgentState['status']): number {
  if (status === 'working') return (3 + Math.random() * 3) * 1000
  return (1 + Math.random() * 1) * 1000
}

function getActivity(agent: AgentState): Activity {
  if (agent.status === 'working') return pick(WORKING_KINDS)
  return pick(ALL_IDLE)
}

export function DenOffice({ state }: { state: TaskState }) {
  const [, forceUpdate] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const activityMapRef = useRef<Map<number, { activity: Activity; since: number; nextFlipAt: number }>>(new Map())

  const syncActivities = useCallback(() => {
    const now = Date.now()
    state.agents.forEach(agent => {
      const prev = activityMapRef.current.get(agent.id)
      const prevStatus = prev
        ? (WORKING_KINDS.includes(prev.activity as typeof WORKING_KINDS[number]) ? 'working' : 'idle')
        : null
      const expired = prev ? now >= prev.nextFlipAt : false
      if (!prev || prevStatus !== agent.status || expired) {
        activityMapRef.current.set(agent.id, {
          activity: getActivity(agent),
          since: now,
          nextFlipAt: now + nextDuration(agent.status),
        })
      }
    })
  }, [state])

  useEffect(() => { syncActivities() }, [syncActivities])

  // Timer — check every 500ms, re-render if any activity expired
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      const anyExpired = [...activityMapRef.current.values()].some(e => now >= e.nextFlipAt)
      if (anyExpired) forceUpdate(n => n + 1)
    }, 500)
    return () => clearInterval(t)
  }, [])

  const handleHover = useCallback((agent: AgentState, e: React.MouseEvent) => {
    const entry = activityMapRef.current.get(agent.id)
    setTooltip({ agent, since: entry?.since ?? Date.now(), x: e.clientX, y: e.clientY })
  }, [])
  const handleLeave = useCallback(() => setTooltip(null), [])

  useEffect(() => {
    if (!tooltip) return
    const onMove = (e: MouseEvent) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [!!tooltip])

  const agents = state.agents
  const coffeeVisitors = agents.filter(a => activityMapRef.current.get(a.id)?.activity === 'coffee')
  const sofaVisitors   = agents.filter(a => activityMapRef.current.get(a.id)?.activity === 'sofa')
  const windowVisitors = agents.filter(a => activityMapRef.current.get(a.id)?.activity === 'window')

  return (
    <>
      <style>{DEN_CSS}</style>
      <div className="den-app">
        <main className="stage">
          <div className="task-badge">
            <span className={`task-badge-dot${state.task_status !== 'running' ? ' ' + state.task_status : ''}`}/>
            {state.task_name}
            <span style={{ opacity: 0.5 }}>{agents.length} agent{agents.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="office-layout">
            <div className="shared">
              <CoffeeArea visitors={coffeeVisitors} onHover={handleHover} onLeave={handleLeave}/>
              <SofaArea   visitors={sofaVisitors}   onHover={handleHover} onLeave={handleLeave}/>
              <WindowArea visitors={windowVisitors} onHover={handleHover} onLeave={handleLeave}/>
            </div>
            <div className="floor">
              <div className="desk-grid">
                {agents.map(agent => {
                  const entry = activityMapRef.current.get(agent.id)
                  const activity = (entry?.activity ?? 'code') as Activity
                  const away = AWAY_KINDS.includes(activity as typeof AWAY_KINDS[number])
                  return (
                    <div key={agent.id} className="cell" style={{
                      borderRadius: 8,
                      background: agent.status === 'working' ? 'transparent' : 'rgba(20,18,14,0.03)',
                    }}>
                      <Workstation agent={agent} activity={activity} away={away} onHover={handleHover} onLeave={handleLeave}/>
                      <div className="cell-name">{agent.name}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="legend">
            <span><span className="legend-dot" style={{ background: '#22c55e' }}/>working</span>
            <span><span className="legend-dot" style={{ background: '#f59e0b' }}/>idle at desk</span>
            <span><span className="legend-dot" style={{ background: '#3b82f6' }}/>away</span>
          </div>
        </main>
      </div>
      <Tooltip data={tooltip}/>
    </>
  )
}
