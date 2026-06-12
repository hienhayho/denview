export function ScreenSpreadsheet() {
  const cols = 5
  const rows = 6
  const highlighted = [[1,2],[1,3],[2,2],[2,3],[3,2]]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#fff"/>
      {/* formula bar */}
      <rect x="3" y="3" width="138" height="7" fill="#f1f3f4"/>
      <rect x="22" y="4.5" width="80" height="4" rx="1" fill="#fff" stroke="#dadce0" strokeWidth="0.5"/>
      <rect x="4" y="4.5" width="14" height="4" rx="1" fill="#fff" stroke="#dadce0" strokeWidth="0.5"/>
      {/* col headers */}
      {Array.from({ length: cols }, (_, c) => (
        <rect key={c} x={18 + c * 24} y="11" width="24" height="5" rx="0"
          fill="#f8f9fa" stroke="#e2e8f0" strokeWidth="0.4"/>
      ))}
      {/* row headers + cells */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols + 1 }, (_, c) => {
          const isHeader = c === 0
          const isHL = !isHeader && highlighted.some(([hr, hc]) => hr === r && hc === c)
          return (
            <rect key={`${r}-${c}`}
              x={isHeader ? 3 : 18 + (c - 1) * 24} y={16 + r * 9}
              width={isHeader ? 15 : 24} height="9"
              fill={isHL ? '#e8f0fe' : isHeader ? '#f8f9fa' : '#fff'}
              stroke="#e2e8f0" strokeWidth="0.4"/>
          )
        })
      )}
      {/* cell content lines */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const isHL = highlighted.some(([hr, hc]) => hr === r && hc === c)
          const w = 8 + ((r * 7 + c * 13) % 10)
          return (
            <rect key={`v${r}-${c}`} x={22 + c * 24} y={19.5 + r * 9} width={w} height="2" rx="0.5"
              fill={isHL ? '#1a73e8' : '#94a3b8'} opacity={isHL ? 0.8 : 0.5}/>
          )
        })
      )}
    </>
  )
}
