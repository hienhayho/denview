export function ActionSnack() {
  return (
    <g>
      {/* bag of chips */}
      <path d="M 96 142 L 100 130 L 116 130 L 120 142 L 112 148 L 104 148 Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="0.8"/>
      <path d="M 100 130 L 108 135 L 116 130" fill="none" stroke="#f59e0b" strokeWidth="0.8"/>
      <rect x="103" y="136" width="10" height="6" rx="1" fill="#fbbf24" opacity="0.6"/>
      {/* crumb floats */}
      {[0,1,2].map(i => (
        <circle key={i} cx={106 + i * 4} cy={126 - i * 3} r="1.2" fill="#fbbf24"
          style={{ animation: `zzz-float 1.8s ease-in ${i * 0.4}s infinite` }}/>
      ))}
    </g>
  )
}
