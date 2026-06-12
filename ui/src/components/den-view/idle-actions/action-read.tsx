export function ActionRead() {
  return (
    <g>
      {/* open book */}
      <path d="M 82 152 L 82 134 Q 108 130 108 134 L 108 152 Z" fill="#fff" stroke="#e3dfd4" strokeWidth="0.8"/>
      <path d="M 108 152 L 108 134 Q 134 130 134 134 L 134 152 Z" fill="#fefce8" stroke="#e3dfd4" strokeWidth="0.8"/>
      <line x1="108" y1="134" x2="108" y2="152" stroke="#d6d3c7" strokeWidth="0.6"/>
      {/* left page lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="86" y1={139 + i * 4} x2={100 - i * 2} y2={139 + i * 4}
          stroke="#d6d3c7" strokeWidth="0.8" strokeLinecap="round"/>
      ))}
      {/* right page lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="112" y1={139 + i * 4} x2={126 + i} y2={139 + i * 4}
          stroke="#d6d3c7" strokeWidth="0.8" strokeLinecap="round"/>
      ))}
      {/* page turn animation hint */}
      <path d="M 108 152 Q 120 148 128 152" fill="none" stroke="#e3dfd4" strokeWidth="0.6"
        style={{ animation: 'chat-bounce 3s ease-in-out infinite' }}/>
    </g>
  )
}
