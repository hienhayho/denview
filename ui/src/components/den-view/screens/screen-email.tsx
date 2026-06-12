export function ScreenEmail() {
  const emails = [
    { unread: true,  subjectW: 70, previewW: 90 },
    { unread: true,  subjectW: 55, previewW: 80 },
    { unread: false, subjectW: 80, previewW: 95 },
    { unread: false, subjectW: 60, previewW: 70 },
    { unread: false, subjectW: 75, previewW: 85 },
  ]
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#f8f7f4"/>
      <rect x="3" y="3" width="138" height="10" fill="#fff" stroke="#e8e6df" strokeWidth="0.5"/>
      <rect x="8" y="5.5" width="28" height="5" rx="2.5" fill="#2563eb"/>
      <rect x="40" y="6" width="40" height="4" rx="1" fill="#e2e0da"/>
      <rect x="120" y="5.5" width="14" height="5" rx="1" fill="#e2e0da"/>
      {emails.map((e, i) => (
        <g key={i}>
          <rect x="3" y={14 + i * 11} width="138" height="10.5"
            fill={e.unread ? '#fff' : 'transparent'}
            stroke="#ede9e1" strokeWidth="0.4"/>
          {e.unread && <circle cx="9" cy={19.5 + i * 11} r="2" fill="#2563eb"/>}
          <rect x="14" y={16 + i * 11} width={e.subjectW * 0.6} height="2.5" rx="1"
            fill={e.unread ? '#1a1815' : '#9c9890'} opacity={e.unread ? 0.9 : 0.6}/>
          <rect x="14" y={20 + i * 11} width={e.previewW * 0.6} height="2" rx="1" fill="#c5c0b5" opacity="0.7"/>
        </g>
      ))}
    </>
  )
}
