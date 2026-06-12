const CARD_COLORS = ['#fde68a', '#bfdbfe', '#bbf7d0', '#fecaca', '#e9d5ff', '#fed7aa']

export function ScreenKanban() {
  const columns = [
    { label: 'Todo',  cards: [0, 1, 3], color: '#94a3b8' },
    { label: 'Doing', cards: [2, 4],    color: '#3b82f6' },
    { label: 'Done',  cards: [5],       color: '#22c55e' },
  ]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#f1f5f9"/>
      {columns.map((col, ci) => {
        const x = 5 + ci * 46
        return (
          <g key={ci}>
            {/* column header */}
            <rect x={x} y="5" width="42" height="7" rx="2" fill="#e2e8f0"/>
            <rect x={x + 2} y="7" width="6" height="3" rx="1.5" fill={col.color}/>
            <rect x={x + 10} y="7.5" width="20" height="2" rx="1" fill="#94a3b8" opacity="0.7"/>
            {/* cards */}
            {col.cards.map((cardIdx, ri) => (
              <g key={ri}>
                <rect x={x} y={15 + ri * 17} width="42" height="13" rx="2"
                  fill={CARD_COLORS[cardIdx]} opacity="0.9"/>
                <rect x={x + 3} y={18 + ri * 17} width={18 + (cardIdx % 3) * 4} height="2" rx="1" fill="rgba(0,0,0,0.2)"/>
                <rect x={x + 3} y={22 + ri * 17} width={12 + (cardIdx % 2) * 6} height="1.5" rx="0.75" fill="rgba(0,0,0,0.12)"/>
                <rect x={x + 30} y={22 + ri * 17} width="8" height="4" rx="2"
                  fill={col.color} opacity="0.4"/>
              </g>
            ))}
          </g>
        )
      })}
    </>
  )
}
