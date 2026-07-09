import { Fox } from './fox'
import { Plant } from './plant'
import type { AgentState } from './types'

type HoverProps = {
  onHover: (agent: AgentState, e: React.MouseEvent) => void
  onLeave: () => void
}

export function CoffeeArea({ visitors, onHover, onLeave }: { visitors: AgentState[] } & HoverProps) {
  const slots = [{ x: 130, y: 130 }, { x: 230, y: 130 }]
  return (
    <div className="area" style={{ position: 'relative' }}>
      <div className="area-label">Căng-tin</div>
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect x="20" y="10" width="320" height="60" rx="6" fill="#fff" stroke="#e3dfd4" strokeWidth="1.2"/>
        <rect x="20" y="68" width="320" height="5" rx="2" fill="rgba(20,18,14,0.06)"/>
        <line x1="20" y1="40" x2="340" y2="40" stroke="#f0ede5" strokeWidth="1"/>
        <g transform="translate(150 14)">
          <rect x="0" y="0" width="60" height="50" rx="4" fill="#1f1f1f"/>
          <rect x="4" y="5" width="52" height="14" rx="2" fill="#2e2e2e"/>
          <rect x="8" y="8" width="20" height="8" rx="1" fill="#22c55e" opacity="0.85"/>
          <rect x="18" y="22" width="24" height="10" rx="1.5" fill="#444"/>
          <rect x="24" y="32" width="12" height="10" fill="#1f1f1f"/>
          <rect x="22" y="42" width="16" height="6" rx="1" fill="#fff" stroke="#cdc8bd" strokeWidth="0.6"/>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={28 + (i - 1) * 6} cy={-6} rx="4" ry="2.5" fill="#cfd8e3"
              style={{ animation: `steam 2.2s ease-out ${i * 0.5}s infinite` }}/>
          ))}
        </g>
        <circle cx="55" cy="48" r="7" fill="#fff" stroke="#cdc8bd" strokeWidth="1"/>
        <circle cx="55" cy="48" r="3.4" fill="#6b4f2a"/>
        <circle cx="80" cy="50" r="6" fill="#fff" stroke="#cdc8bd" strokeWidth="1"/>
        <circle cx="80" cy="50" r="2.8" fill="#6b4f2a"/>
        <Plant x={42} y={140} size={1.0} kind="palm"/>
        <Plant x={320} y={150} size={0.9} kind="leafy"/>
        <rect x="80" y="98" width="200" height="38" rx="6" fill="#f3eee2"/>
        {visitors.slice(0, 2).map((agent, i) => {
          const p = slots[i]
          return (
            <g key={agent.id} transform={`translate(${p.x - 36} ${p.y - 36}) scale(0.72)`}
              onMouseEnter={(e) => onHover(agent, e)} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
              <Fox color={agent.color} pose="sit"/>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function SofaArea({ visitors, onHover, onLeave }: { visitors: AgentState[] } & HoverProps) {
  const slots = [{ x: 110, y: 95 }, { x: 180, y: 95 }, { x: 250, y: 95 }]
  return (
    <div className="area" style={{ position: 'relative' }}>
      <div className="area-label">Phòng nghỉ</div>
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect x="40" y="40" width="280" height="140" rx="14" fill="#f3eee2"/>
        <rect x="48" y="48" width="264" height="124" rx="10" fill="none" stroke="#e0d8c4" strokeWidth="1.5" strokeDasharray="3 4"/>
        <rect x="60" y="78" width="240" height="58" rx="14" fill="rgba(20,18,14,0.10)"/>
        <rect x="58" y="72" width="240" height="56" rx="14" fill="#fff" stroke="#e3dfd4" strokeWidth="1.2"/>
        <rect x="66" y="76" width="72" height="20" rx="6" fill="#f7f4ea"/>
        <rect x="144" y="76" width="72" height="20" rx="6" fill="#f7f4ea"/>
        <rect x="222" y="76" width="68" height="20" rx="6" fill="#f7f4ea"/>
        <rect x="58" y="100" width="8" height="28" rx="3" fill="#f7f4ea"/>
        <rect x="290" y="100" width="8" height="28" rx="3" fill="#f7f4ea"/>
        <Plant x={28} y={155} size={1.1} kind="leafy"/>
        <Plant x={332} y={158} size={0.9} kind="palm"/>
        {visitors.slice(0, 3).map((agent, i) => {
          const p = slots[i]
          return (
            <g key={agent.id} transform={`translate(${p.x - 28} ${p.y - 28}) scale(0.56)`}
              onMouseEnter={(e) => onHover(agent, e)} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
              <Fox color={agent.color} pose="laughing"/>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function WindowArea({ visitors, onHover, onLeave }: { visitors: AgentState[] } & HoverProps) {
  const slots = [{ x: 130, y: 110 }, { x: 230, y: 110 }]
  return (
    <div className="area" style={{ position: 'relative' }}>
      <div className="area-label">Cửa sổ</div>
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="sunlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#fff3d6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M 40 18 L 320 18 L 340 200 L 20 200 Z" fill="url(#sunlight)"/>
        <rect x="40" y="10" width="280" height="22" rx="3" fill="#fff" stroke="#d7d2c6" strokeWidth="1"/>
        <line x1="180" y1="10" x2="180" y2="32" stroke="#d7d2c6" strokeWidth="1"/>
        <rect x="44" y="14" width="132" height="14" fill="#cfe6ff" opacity="0.85"/>
        <rect x="184" y="14" width="132" height="14" fill="#cfe6ff" opacity="0.85"/>
        <rect x="40" y="34" width="280" height="6" fill="#e3dfd4"/>
        <Plant x={70} y={50} size={0.85} kind="leafy"/>
        <Plant x={120} y={50} size={0.7} kind="palm"/>
        <Plant x={300} y={50} size={0.9} kind="leafy"/>
        <Plant x={48} y={170} size={1.0} kind="palm"/>
        <Plant x={316} y={172} size={1.0} kind="leafy"/>
        {visitors.slice(0, 2).map((agent, i) => {
          const p = slots[i]
          return (
            <g key={agent.id} transform={`translate(${p.x - 36} ${p.y - 36}) scale(0.72)`}
              onMouseEnter={(e) => onHover(agent, e)} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
              <Fox color={agent.color} pose="sit"/>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
