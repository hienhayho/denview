export function ScreenBrowser() {
  return (
    <>
      <rect x="3" y="3" width="138" height="68" fill="#f5f5f5"/>
      {/* toolbar */}
      <rect x="3" y="3" width="138" height="11" fill="#e8e8e8"/>
      {/* tabs */}
      <rect x="6" y="4" width="32" height="7" rx="2" fill="#fff" stroke="#d0d0d0" strokeWidth="0.5"/>
      <rect x="40" y="5" width="28" height="6" rx="2" fill="#d8d8d8"/>
      {/* address bar */}
      <rect x="22" y="15" width="96" height="5" rx="2.5" fill="#fff" stroke="#d0d0d0" strokeWidth="0.5"/>
      <rect x="25" y="16.5" width="50" height="2" rx="1" fill="#2563eb" opacity="0.5"/>
      <rect x="6" y="15" width="5" height="5" rx="1" fill="#d0d0d0"/>
      <rect x="13" y="15" width="5" height="5" rx="1" fill="#d0d0d0"/>
      {/* nav bar */}
      <rect x="3" y="22" width="138" height="8" fill="#1e293b"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={8 + i * 26} y="24.5" width={16 + (i % 2) * 4} height="3" rx="1.5" fill="#fff" opacity="0.25"/>
      ))}
      {/* hero */}
      <rect x="3" y="30" width="138" height="18" fill="#dbeafe"/>
      <rect x="20" y="34" width="50" height="4" rx="2" fill="#1e40af" opacity="0.7"/>
      <rect x="20" y="40" width="35" height="3" rx="1.5" fill="#3b82f6" opacity="0.5"/>
      {/* content blocks */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={8 + i * 45} y="52" width="38" height="14" rx="2" fill="#fff" stroke="#e2e8f0" strokeWidth="0.5"/>
          <rect x={12 + i * 45} y="55" width="20" height="3" rx="1" fill="#94a3b8" opacity="0.6"/>
          <rect x={12 + i * 45} y="60" width="28" height="2" rx="1" fill="#cbd5e1" opacity="0.5"/>
          <rect x={12 + i * 45} y="63" width="22" height="2" rx="1" fill="#cbd5e1" opacity="0.4"/>
        </g>
      ))}
    </>
  )
}
