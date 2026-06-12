export function ScreenChat() {
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#eaf3ff"/>
      <rect x="3" y="3" width="28" height="68" fill="#dce8f8"/>
      <circle cx="17" cy="14" r="3.5" fill="#6b8fbc"/>
      <circle cx="17" cy="24" r="3.5" fill="#a4b8d4"/>
      <circle cx="17" cy="34" r="3.5" fill="#a4b8d4"/>
      <rect x="36" y="10" width="56" height="9" rx="4.5" fill="#fff" style={{ animation: 'chat-bounce 1.6s ease-in-out infinite' }}/>
      <rect x="68" y="24" width="68" height="9" rx="4.5" fill="#2563eb" style={{ animation: 'chat-bounce 1.6s ease-in-out 0.4s infinite' }}/>
      <rect x="36" y="38" width="48" height="9" rx="4.5" fill="#fff" style={{ animation: 'chat-bounce 1.6s ease-in-out 0.8s infinite' }}/>
      <g transform="translate(40 56)">
        <circle r="1.6" cx="0" fill="#94a3b8" style={{ animation: 'chat-bounce 0.9s ease-in-out infinite' }}/>
        <circle r="1.6" cx="5" fill="#94a3b8" style={{ animation: 'chat-bounce 0.9s ease-in-out 0.15s infinite' }}/>
        <circle r="1.6" cx="10" fill="#94a3b8" style={{ animation: 'chat-bounce 0.9s ease-in-out 0.3s infinite' }}/>
      </g>
    </>
  )
}
