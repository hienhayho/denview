export function ScreenTyping() {
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#fefce8"/>
      <rect x="14" y="6" width="116" height="62" rx="2" fill="#fff" stroke="#fde68a" strokeWidth="1"/>
      <rect x="20" y="12" width="40" height="3" rx="1" fill="#92400e"/>
      {[20, 26, 32, 38, 44, 50, 56].map((y, i) => (
        <rect key={y} x="20" y={y} width={Math.max(20, 100 - i * 8)} height="2" rx="1" fill="#d6d3d1"
          style={{ transformOrigin: 'left', animation: `line-grow 2s ${i * 0.18}s ease both` }}/>
      ))}
      <rect x="40" y="56" width="1.5" height="4" fill="#92400e"
        style={{ animation: 'blink-caret 0.8s steps(1) infinite' }}/>
    </>
  )
}
