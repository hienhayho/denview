'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  ListTodo,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', href: '/tasks', icon: ListTodo },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'API Keys', href: '/api-keys', icon: KeyRound },
]

// ── UserCard ──────────────────────────────────────────────────────────────────

function UserCard({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const initials = (user?.username ?? 'U').slice(0, 2).toUpperCase()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  async function handleLogout() {
    setOpen(false)
    await logout()
    router.replace('/login')
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center rounded-xl cursor-pointer transition-colors border-none"
        style={{
          background: '#f4f3ef',
          gap: collapsed ? 0 : 10,
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#ede9e1')}
        onMouseLeave={e => (e.currentTarget.style.background = '#f4f3ef')}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
          style={{ background: '#14110d' }}
        >
          {initials}
        </div>
        {!collapsed && (
          <>
            <div className="text-left min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold truncate" style={{ color: '#1a1815' }}>
                {user?.username}
              </div>
              <div className="text-[11.5px]" style={{ color: '#807a6f' }}>
                {user?.is_admin ? 'Admin' : 'Member'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: '#807a6f', flexShrink: 0 }} />
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border shadow-lg overflow-hidden"
          style={{ background: '#ffffff', borderColor: '#e8e6df', zIndex: 50 }}
        >
          <button
            className="w-full text-left px-4 py-2.5 text-[13px] font-medium border-none cursor-pointer transition-colors"
            style={{ background: 'transparent', color: '#1a1815', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f3ef')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col h-screen shrink-0 overflow-hidden border-r transition-[width] duration-200 ease-[cubic-bezier(.4,0,.2,1)]"
      style={{
        width: collapsed ? 60 : 240,
        background: '#ffffff',
        borderColor: '#e8e6df',
      }}
    >
      {/* Logo + collapse */}
      <div
        className="flex items-center px-3 py-3.5 shrink-0"
        style={{ justifyContent: collapsed ? 'center' : 'space-between' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 pl-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#14110d' }}
            >
              <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                <path d="M 4 -17 L 23 -30 L 16 -10 Z" fill="white" transform="translate(50,50)" opacity="0.9" />
                <path d="M -4 -17 L -23 -30 L -16 -10 Z" fill="white" transform="translate(50,50)" opacity="0.9" />
                <circle cx="50" cy="50" r="19" fill="white" opacity="0.9" />
                <circle cx="43" cy="47" r="3" fill="#14110d" />
                <circle cx="57" cy="47" r="3" fill="#14110d" />
                <ellipse cx="50" cy="53" rx="2.4" ry="2" fill="#14110d" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight" style={{ color: '#1a1815' }}>
              DenView
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors"
          style={{ color: '#807a6f', background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f4f3ef')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 min-h-0 flex flex-col gap-0.5">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg text-[13.5px] no-underline transition-colors',
                collapsed ? 'justify-center py-2.5 px-0' : 'px-3 py-2 gap-2.5',
              )}
              style={{
                background: active ? '#f4f3ef' : 'transparent',
                color: active ? '#1a1815' : '#807a6f',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f4f3ef' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <item.icon size={17} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="px-3 pb-4 shrink-0">
        <UserCard collapsed={collapsed} />
      </div>
    </aside>
  )
}
