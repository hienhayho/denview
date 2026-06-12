export function ScreenFiles() {
  const colors = ['#fcd34d', '#fbbf24', '#fde68a', '#fcd34d', '#f59e0b', '#fde68a']
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#f5f5f0"/>
      <rect x="3" y="3" width="138" height="10" fill="#e7e5dd"/>
      <circle cx="9" cy="8" r="1.6" fill="#cbc8be"/>
      <circle cx="14" cy="8" r="1.6" fill="#cbc8be"/>
      <rect x="3" y="13" width="32" height="58" fill="#ecebe3"/>
      <rect x="8" y="20" width="20" height="3" rx="1" fill="#bcb9ac"/>
      <rect x="8" y="28" width="20" height="3" rx="1" fill="#cdc8bd"/>
      <rect x="8" y="36" width="16" height="3" rx="1" fill="#cdc8bd"/>
      {colors.map((c, i) => {
        const col = i % 3, row = Math.floor(i / 3)
        return (
          <g key={i} transform={`translate(${42 + col * 32} ${18 + row * 24})`}>
            <path d="M 0 4 L 8 4 L 10 0 L 22 0 L 22 16 L 0 16 Z" fill={c}/>
            <rect x="2" y="18" width="18" height="2" rx="1" fill="#a3998a"/>
          </g>
        )
      })}
    </>
  )
}
