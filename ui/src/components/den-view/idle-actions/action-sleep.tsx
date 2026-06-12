export function ActionSleep() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <text key={i} x={155} y={132} fontSize={11 + i * 2} fontWeight="700" fill="#807a6f"
          fontFamily="ui-sans-serif, system-ui"
          style={{ animation: `zzz-float 2.4s ease-in ${i * 0.6}s infinite` }}>z</text>
      ))}
    </g>
  )
}
