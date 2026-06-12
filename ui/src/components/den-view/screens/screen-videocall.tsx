const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b']

export function ScreenVideoCall() {
  const tiles = [
    { x: 4,  y: 4,  color: AVATAR_COLORS[0], speaking: true  },
    { x: 74, y: 4,  color: AVATAR_COLORS[1], speaking: false },
    { x: 4,  y: 38, color: AVATAR_COLORS[2], speaking: false },
    { x: 74, y: 38, color: AVATAR_COLORS[3], speaking: false },
  ]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#1a1a2e"/>
      {tiles.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={t.y} width="66" height="31" rx="3"
            fill="#16213e" stroke={t.speaking ? '#22c55e' : '#2a2a4a'} strokeWidth={t.speaking ? 1.5 : 0.5}/>
          {t.speaking && (
            <rect x={t.x} y={t.y} width="66" height="31" rx="3"
              fill="none" stroke="#22c55e" strokeWidth="1"
              style={{ animation: 'phone-glow 1s ease-in-out infinite' }}/>
          )}
          <circle cx={t.x + 33} cy={t.y + 13} r="7" fill={t.color} opacity="0.85"/>
          <circle cx={t.x + 33} cy={t.y + 9} r="3.5" fill="rgba(255,255,255,0.3)"/>
          <rect x={t.x + 4} y={t.y + 24} width={30 + (i % 2) * 10} height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
      {/* toolbar */}
      <rect x="3" y="69" width="138" height="2" fill="#0f0f1a"/>
      <circle cx="62" cy="71" r="3" fill="#ef4444" opacity="0.9"/>
      <circle cx="72" cy="71" r="3" fill="#374151" opacity="0.9"/>
      <circle cx="82" cy="71" r="3" fill="#374151" opacity="0.9"/>
    </>
  )
}
