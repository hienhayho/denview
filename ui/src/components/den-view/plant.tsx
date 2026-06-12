export function Plant({
  x, y, size = 1, kind = 'leafy',
}: {
  x: number
  y: number
  size?: number
  kind?: 'leafy' | 'palm'
}) {
  const r = 14 * size
  if (kind === 'palm') return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy={r + 2} rx={r * 0.9} ry={r * 0.3} fill="rgba(20,18,14,0.08)"/>
      <circle cx="0" cy="0" r={r} fill="#c2a37a"/>
      <circle cx="0" cy="0" r={r - 3} fill="#8b6b46"/>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <g key={i} transform={`rotate(${deg})`}>
          <ellipse cx="0" cy="0" rx={r * 1.6} ry={r * 0.42} fill="#2f7a4d" opacity={0.85}
            style={{ transformOrigin: '0 0', animation: `sway 4s ease-in-out ${i * 0.2}s infinite` }}/>
        </g>
      ))}
      <circle cx="0" cy="0" r={r * 0.35} fill="#3f9963"/>
    </g>
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy={r + 2} rx={r * 0.9} ry={r * 0.3} fill="rgba(20,18,14,0.08)"/>
      <circle cx="0" cy="0" r={r} fill="#d6c3a3"/>
      <circle cx="0" cy="0" r={r - 3} fill="#a07b50"/>
      <g style={{ transformOrigin: '0 0', animation: `sway 5s ease-in-out infinite` }}>
        <circle cx="-7" cy="-2" r={r * 0.7} fill="#2f7a4d"/>
        <circle cx="7" cy="-3" r={r * 0.65} fill="#3f9963"/>
        <circle cx="0" cy="-7" r={r * 0.6} fill="#4ab16f"/>
        <circle cx="2" cy="2" r={r * 0.45} fill="#2f7a4d"/>
      </g>
    </g>
  )
}
