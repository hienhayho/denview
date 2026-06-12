export function ActionPhone({ color }: { color: string }) {
  return (
    <g>
      <rect x="98" y="148" width="24" height="14" rx="3" fill="#1C0800"/>
      <rect x="100" y="150" width="20" height="10" rx="1" fill={color}
        style={{ animation: 'phone-glow 1.4s ease-in-out infinite' }}/>
    </g>
  )
}
