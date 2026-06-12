export function ActionDoodle() {
  return (
    <g>
      {/* notepad */}
      <rect x="78" y="100" width="36" height="28" rx="2" fill="#fff" stroke="#e3dfd4" strokeWidth="0.8"/>
      <rect x="78" y="100" width="36" height="5" rx="2" fill="#fde68a" opacity="0.7"/>
      {/* doodle lines */}
      <path d="M 83 112 Q 88 108 93 113 Q 98 118 103 112" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="86" cy="120" r="2.5" fill="none" stroke="#f9a8d4" strokeWidth="1"/>
      <line x1="91" y1="118" x2="108" y2="118" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round"/>
      <line x1="91" y1="122" x2="104" y2="122" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round"/>
      {/* pen */}
      <rect x="116" y="106" width="3" height="16" rx="1.5" fill="#374151"
        style={{ transformOrigin: '117px 122px', animation: 'stretch-up 2s ease-in-out infinite' }}/>
      <path d="M 115 122 L 119 122 L 117 126 Z" fill="#1a1815"/>
    </g>
  )
}
