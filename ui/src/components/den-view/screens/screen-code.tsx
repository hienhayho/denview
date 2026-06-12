export function ScreenCode({ seed = 0 }: { seed?: number }) {
  const rows = [
    { x: 6, w: 60 }, { x: 6, w: 40 }, { x: 16, w: 70 }, { x: 16, w: 50 },
    { x: 6, w: 80 }, { x: 6, w: 30 }, { x: 16, w: 64 },
  ]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#0e1a2b"/>
      {rows.map((r, i) => (
        <rect key={i} x={r.x} y={8 + i * 8} width={r.w} height={3} rx="1"
          fill={i === 0 ? '#7dd3fc' : (i % 2 ? '#94a3b8' : '#e2e8f0')} opacity={0.75}
          style={{ transformOrigin: 'left', animation: `line-grow 1.2s ${(i + seed) * 0.25}s ease both, screen-flicker 5s infinite` }}/>
      ))}
      <rect x="6" y={8 + rows.length * 8} width="2.5" height="4" fill="#7dd3fc"
        style={{ animation: 'blink-caret 0.9s steps(1) infinite' }}/>
    </>
  )
}
