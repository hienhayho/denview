export function ActionMusic() {
  return (
    <g>
      {/* headphones on desk */}
      <path d="M 94 148 Q 94 138 108 138 Q 122 138 122 148" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="90" y="146" width="8" height="6" rx="3" fill="#374151"/>
      <rect x="118" y="146" width="8" height="6" rx="3" fill="#374151"/>
      {/* music notes floating */}
      {[0,1,2].map(i => (
        <text key={i} x={100 + i * 10} y={132 - i * 4} fontSize={8 + i} fill="#8b5cf6" fontWeight="700"
          style={{ animation: `zzz-float 2s ease-in ${i * 0.5}s infinite` }}>♪</text>
      ))}
    </g>
  )
}
