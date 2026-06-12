export function ActionToy({ color }: { color: string }) {
  return (
    <g style={{ transformOrigin: '155px 150px', animation: 'ball-roll 2.4s ease-in-out infinite' }}>
      <circle cx="155" cy="150" r="5" fill={color}/>
      <circle cx="153" cy="148" r="1.5" fill="rgba(255,255,255,0.6)"/>
    </g>
  )
}
