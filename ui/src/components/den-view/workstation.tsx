import { Fox } from './fox'
import { Monitor, ScreenFor } from './monitor'
import { IdleActionFor } from './idle-actions'
import type { AgentState, Activity } from './types'

function Chair() {
  return (
    <g>
      <g stroke="#cdc8bd" strokeWidth="1.3" fill="none">
        <line x1="62" y1="72" x2="48" y2="84"/>
        <line x1="62" y1="72" x2="76" y2="84"/>
        <line x1="62" y1="72" x2="44" y2="76"/>
        <line x1="62" y1="72" x2="80" y2="76"/>
        <line x1="62" y1="72" x2="62" y2="88"/>
      </g>
      <rect x="34" y="42" width="56" height="44" rx="10" fill="#fff" stroke="#e3dfd4" strokeWidth="1.2"/>
      <rect x="30" y="56" width="6" height="18" rx="3" fill="#fff" stroke="#e3dfd4" strokeWidth="1"/>
      <rect x="88" y="56" width="6" height="18" rx="3" fill="#fff" stroke="#e3dfd4" strokeWidth="1"/>
    </g>
  )
}

function Drawer() {
  return (
    <g>
      <rect x="0" y="0" width="46" height="56" rx="4" fill="#fff" stroke="#e3dfd4" strokeWidth="1.2"/>
      <line x1="16" y1="14" x2="30" y2="14" stroke="#d7d2c6" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="28" x2="30" y2="28" stroke="#d7d2c6" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="42" x2="30" y2="42" stroke="#d7d2c6" strokeWidth="1.2" strokeLinecap="round"/>
    </g>
  )
}

function Keyboard({ agentId }: { agentId: number }) {
  const s = (agentId % 9) + 1
  const kd = Array.from({ length: 20 }, (_, i) => ({
    dur:   0.5 + ((s * (i + 1) * 17) % 22) / 10,
    delay: ((s * (i + 3) * 31) % 32) / 10,
  }))
  const rows = [
    { y: 103, count: 10, xStart: 79, keyW: 4.5, keyH: 3, gap: 1.5 },
    { y: 107.5, count: 9, xStart: 80.3, keyW: 5, keyH: 3, gap: 1.5 },
  ]
  let ki = 0
  return (
    <g>
      <rect x="78" y="101" width="64" height="12" rx="2" fill="#252220" stroke="#1a1816" strokeWidth="0.7"/>
      {rows.map((row, ri) =>
        Array.from({ length: row.count }, (_, i) => {
          const { dur, delay } = kd[ki++ % kd.length]
          const x = row.xStart + i * (row.keyW + row.gap)
          return (
            <rect key={`k${ri}-${i}`} x={x} y={row.y} width={row.keyW} height={row.keyH} rx="0.7"
              fill="#fff" style={{ opacity: 0.38, animation: `key-blink ${dur}s ease-in-out ${delay}s infinite` }}/>
          )
        })
      )}
    </g>
  )
}

function WorkstationOverlay({ agent, activity }: { agent: AgentState; activity: Activity }) {
  if (agent.status === 'working') return <Keyboard agentId={agent.id}/>
  return <IdleActionFor kind={activity} color={agent.color}/>
}

export function Workstation({
  agent,
  activity,
  away,
  onHover,
  onLeave,
}: {
  agent: AgentState
  activity: Activity
  away: boolean
  onHover: (agent: AgentState, e: React.MouseEvent) => void
  onLeave: () => void
}) {
  const working = agent.status === 'working'
  const screenKind = working ? activity : null
  const seed = agent.id % 32
  const pose = working ? 'sit'
    : activity === 'sleep'    ? 'sleep'
    : activity === 'stretch'  ? 'stretch'
    : activity === 'laughing' ? 'laughing'
    : 'sit'

  return (
    <svg viewBox="0 0 220 250" className="workstation" preserveAspectRatio="xMidYMid meet"
      onMouseMove={(e) => onHover(agent, e)} onMouseLeave={onLeave}>
      <ellipse cx="110" cy="232" rx="96" ry="12" fill="rgba(20,18,14,0.05)"/>
      <g transform="translate(160 158)"><Drawer/></g>
      <g>
        <rect x="14" y="36" width="192" height="112" rx="10" fill="rgba(20,18,14,0.08)"/>
        <rect x="12" y="30" width="192" height="110" rx="10"
          fill={working ? '#fff' : '#f0ede5'}
          stroke={working ? '#e3dfd4' : '#d8d3c8'}
          strokeWidth="1.2"/>
        {!working && <rect x="12" y="30" width="192" height="110" rx="10" fill="rgba(20,18,14,0.04)"/>}
        <circle cx="20" cy="36" r="2" fill="#e3dfd4"/><circle cx="196" cy="36" r="2" fill="#e3dfd4"/>
        <circle cx="20" cy="134" r="2" fill="#e3dfd4"/><circle cx="196" cy="134" r="2" fill="#e3dfd4"/>
      </g>
      <g transform="translate(38 12)">
        <Monitor on={working}>
          {working && screenKind && <ScreenFor kind={screenKind} seed={seed}/>}
        </Monitor>
      </g>
      <g>
        <rect x="172" y="98" width="22" height="16" rx="2" fill="#f1ede3" stroke="#e3dfd4" strokeWidth="0.8"/>
        <ellipse cx="183" cy="106" rx="5" ry="3.5" fill="#fff" stroke="#cdc8bd" strokeWidth="0.8"/>
        <line x1="183" y1="103" x2="183" y2="106" stroke="#cdc8bd" strokeWidth="0.6"/>
        <rect x="20" y="90" width="22" height="28" rx="1.5" fill="#fff" stroke="#e3dfd4" strokeWidth="0.8"/>
        <line x1="22" y1="98" x2="38" y2="98" stroke="#e3dfd4" strokeWidth="0.6"/>
        <line x1="22" y1="104" x2="36" y2="104" stroke="#e3dfd4" strokeWidth="0.6"/>
        <line x1="22" y1="110" x2="38" y2="110" stroke="#e3dfd4" strokeWidth="0.6"/>
        <circle cx="56" cy="100" r="5" fill="#fff" stroke="#cdc8bd" strokeWidth="0.8"/>
        <circle cx="56" cy="100" r="2.6" fill={working ? '#6b4f2a' : '#3a2a18'}/>
      </g>
      <g transform="translate(46 124)"><Chair/></g>

      <g transform={`translate(60 ${working ? 116 : 108})`}
        style={{ opacity: away ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <g style={{ animation: working ? 'head-bob 2.6s ease-in-out infinite' : 'none' }}>
          <Fox color={agent.color} pose={pose} back={working}/>
        </g>
      </g>

      {!away && <WorkstationOverlay agent={agent} activity={activity}/>}

      {away && (
        <g transform="translate(110 180)">
          <rect x="-32" y="-9" width="64" height="18" rx="9" fill="#fff" stroke="#e3dfd4" strokeWidth="1"/>
          <circle cx="-22" cy="0" r="2.6" fill={agent.color}/>
          <text x="-15" y="3" fontSize="9" fill="#807a6f" fontFamily="ui-sans-serif, system-ui" fontWeight="500">
            vắng · {activity}
          </text>
        </g>
      )}
    </svg>
  )
}
