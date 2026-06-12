export function ScreenCharts() {
  const bars = [12, 22, 18, 30, 26, 36, 28, 40]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#fff7ed"/>
      <line x1="10" y1="62" x2="138" y2="62" stroke="#e3d6c1" strokeWidth="1"/>
      {bars.map((h, i) => (
        <rect key={i} x={14 + i * 9} y={62 - h} width="6" height={h} rx="1" fill="#f97316"
          style={{ transformOrigin: `${14 + i * 9 + 3}px 62px`, animation: `chart-bar 1.6s ease-in-out ${i * 0.12}s infinite` }}/>
      ))}
      <polyline points="14,40 32,32 50,34 68,20 86,22 104,16 122,12"
        fill="none" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="122" cy="12" r="2.5" fill="#7c2d12"/>
      <rect x="6" y="6" width="44" height="3" rx="1" fill="#7c2d12" opacity="0.5"/>
    </>
  )
}
