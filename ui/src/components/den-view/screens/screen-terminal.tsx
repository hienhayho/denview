export function ScreenTerminal() {
  const lines = [
    { w: 90, color: '#22c55e' },
    { w: 60, color: '#94a3b8' },
    { w: 110, color: '#22c55e' },
    { w: 75, color: '#94a3b8' },
    { w: 50, color: '#ef4444' },
    { w: 95, color: '#22c55e' },
    { w: 40, color: '#94a3b8' },
  ]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#0a0f0a"/>
      <rect x="3" y="3" width="138" height="8" fill="#111a11"/>
      <circle cx="10" cy="7" r="1.8" fill="#ef4444" opacity="0.8"/>
      <circle cx="16" cy="7" r="1.8" fill="#facc15" opacity="0.8"/>
      <circle cx="22" cy="7" r="1.8" fill="#22c55e" opacity="0.8"/>
      {lines.map((l, i) => (
        <rect key={i} x="8" y={16 + i * 8} width={l.w} height="2.5" rx="1" fill={l.color} opacity={0.85}
          style={{ transformOrigin: 'left', animation: `line-grow 1.4s ${i * 0.18}s ease both` }}/>
      ))}
      <rect x="8" y={16 + lines.length * 8} width="5" height="5" fill="#22c55e"
        style={{ animation: 'blink-caret 0.8s steps(1) infinite' }}/>
    </>
  )
}
