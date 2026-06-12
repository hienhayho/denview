export { ScreenFor, ScreenCode, ScreenChat, ScreenCharts, ScreenFiles, ScreenTyping, ScreenLoading, ScreenTerminal, ScreenEmail, ScreenBrowser, ScreenSpreadsheet, ScreenVideoCall, ScreenKanban } from './screens'

export function Monitor({ children, on = true }: { children?: React.ReactNode; on?: boolean }) {
  return (
    <g>
      <rect x="6" y="64" width="132" height="6" rx="3" fill="rgba(20,18,14,0.08)"/>
      <rect x="0" y="0" width="144" height="74" rx="4" fill="#f1ede3" stroke="#d7d2c6" strokeWidth="1"/>
      <rect x="3" y="3" width="138" height="68" rx="2" fill={on ? '#4ea7ff' : '#14110d'}/>
      {on && (
        <g clipPath="url(#screen-clip)">
          {children}
        </g>
      )}
      <defs>
        <clipPath id="screen-clip">
          <rect x="3" y="3" width="138" height="68" rx="2"/>
        </clipPath>
      </defs>
      <rect x="68" y="71" width="8" height="3" fill="#e3dfd4"/>
    </g>
  )
}
