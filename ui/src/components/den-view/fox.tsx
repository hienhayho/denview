import { FOX_OG, FOX_DK, FOX_CRM, FOX_NOIR } from './constants'

function FoxBack({ color, mirror = false }: { color: string; mirror?: boolean }) {
  return (
    <g transform={mirror ? 'scale(-1,1) translate(-100,0)' : ''}>
      <ellipse cx="50" cy="92" rx="24" ry="5" fill="rgba(20,10,0,0.10)"/>
      <path d="M 34 56 Q 8 44 10 68 Q 12 84 26 78 Q 34 70 34 56 Z" fill={FOX_OG}/>
      <ellipse cx="12" cy="65" rx="6" ry="5" fill={FOX_CRM}/>
      <ellipse cx="50" cy="67" rx="20" ry="21" fill={FOX_OG}/>
      <ellipse cx="50" cy="62" rx="5" ry="13" fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="37" cy="80" rx="8" ry="4.5" fill={FOX_OG}/>
      <ellipse cx="63" cy="80" rx="8" ry="4.5" fill={FOX_OG}/>
      <rect x="31" y="47" width="38" height="11" rx="3.5" fill={color}/>
      <rect x="31" y="55" width="38" height="3" rx="1.5" fill="rgba(0,0,0,0.09)"/>
      <rect x="31" y="55" width="6" height="13" rx="2.5" fill={color}/>
      <rect x="63" y="55" width="6" height="13" rx="2.5" fill={color}/>
      <g transform="translate(50, 30)">
        <path d="M -4 -17 L -23 -30 L -16 -10 Z" fill={FOX_OG}/>
        <path d="M  4 -17 L  23 -30 L  16 -10 Z" fill={FOX_OG}/>
        <circle cx="0" cy="0" r="19" fill={FOX_OG}/>
        <ellipse cx="0" cy="2" rx="6" ry="11" fill="rgba(0,0,0,0.05)"/>
      </g>
    </g>
  )
}

export function Fox({
  color,
  pose = 'sit',
  mirror = false,
  back = false,
}: {
  color: string
  pose?: string
  mirror?: boolean
  back?: boolean
}) {
  if (back) return <FoxBack color={color} mirror={mirror}/>

  const isSleep   = pose === 'sleep'
  const isLaugh   = pose === 'laughing'
  const isStretch = pose === 'stretch'
  const isPhone   = pose === 'phone'

  const headTiltDeg = isSleep ? 22 : isStretch ? -7 : isLaugh ? -5 : 0
  const bodyShiftY  = isStretch ? -4 : isSleep ? 3 : 0

  return (
    <g transform={mirror ? 'scale(-1,1) translate(-100,0)' : ''}>
      <ellipse cx="50" cy="92" rx="24" ry="5" fill="rgba(20,10,0,0.10)"/>
      <path d="M 65 58 Q 94 42 91 68 Q 88 84 74 78 Q 66 71 65 58 Z" fill={FOX_OG}/>
      <ellipse cx="88" cy="65" rx="6.5" ry="5.5" fill={FOX_CRM}/>
      <g transform={`translate(0, ${bodyShiftY})`}>
        <ellipse cx="50" cy="67" rx="20" ry="21" fill={FOX_OG}/>
        <ellipse cx="50" cy="70" rx="11.5" ry="15" fill={FOX_CRM}/>
        <ellipse cx="37" cy="83" rx="8" ry="4.5" fill={FOX_OG}/>
        <ellipse cx="63" cy="83" rx="8" ry="4.5" fill={FOX_OG}/>
      </g>
      <rect x="31" y="47" width="38" height="11" rx="3.5" fill={color}/>
      <rect x="31" y="47" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.24)"/>
      <rect x="44" y="55" width="7" height="13" rx="2.5" fill={color}/>
      <rect x="45" y="55" width="5" height="3" rx="1" fill="rgba(255,255,255,0.22)"/>
      <g transform={`translate(50, 30) rotate(${headTiltDeg})`}>
        <path d="M -4 -17 L -23 -30 L -16 -10 Z" fill={FOX_OG}/>
        <path d="M -5 -17 L -19 -26 L -14 -12 Z" fill={FOX_DK}/>
        <path d="M 4 -17 L 23 -30 L 16 -10 Z" fill={FOX_OG}/>
        <path d="M 5 -17 L 19 -26 L 14 -12 Z" fill={FOX_DK}/>
        <circle cx="0" cy="0" r="19" fill={FOX_OG}/>
        <ellipse cx="0" cy="7" rx="11.5" ry="9" fill={FOX_CRM}/>
        {isSleep ? (
          <>
            <path d="M -9 -2 Q -6 -7 -3 -2" stroke={FOX_NOIR} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M  3 -2 Q  6 -7  9 -2" stroke={FOX_NOIR} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <circle cx="-7" cy="-3" r="3.5" fill={FOX_NOIR}/>
            <circle cx=" 7" cy="-3" r="3.5" fill={FOX_NOIR}/>
            <circle cx="-5.5" cy="-4.5" r="1.2" fill="white"/>
            <circle cx=" 8.5" cy="-4.5" r="1.2" fill="white"/>
          </>
        )}
        <ellipse cx="0" cy="3" rx="2.6" ry="2.1" fill={FOX_NOIR}/>
        {isLaugh
          ? <path d="M -5 8 Q 0 14 5 8" stroke={FOX_NOIR} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          : <path d="M -3 8 Q 0 10.5 3 8" stroke={FOX_NOIR} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        }
      </g>
      {isPhone && (
        <g transform="translate(36, 44)">
          <rect x="0" y="0" width="12" height="19" rx="2" fill={FOX_NOIR} opacity="0.90"/>
          <rect x="2" y="2" width="8" height="13" rx="1" fill="#4ea7ff" opacity="0.92"/>
          <rect x="4" y="1" width="4" height="1.2" rx="0.6" fill="#444"/>
        </g>
      )}
    </g>
  )
}
