export function ScreenLoading() {
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#0f172a"/>
      <g transform="translate(72 32)">
        <g style={{ animation: 'spinner 1.1s linear infinite' }}>
          <circle r="10" fill="none" stroke="#1e293b" strokeWidth="3"/>
          <path d="M 0 -10 A 10 10 0 0 1 10 0" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </g>
      <rect x="24" y="50" width="96" height="4" rx="2" fill="#1e293b"/>
      <rect x="24" y="50" width="58" height="4" rx="2" fill="#60a5fa"/>
      <text x="72" y="64" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="ui-monospace, monospace">building…</text>
    </>
  )
}
