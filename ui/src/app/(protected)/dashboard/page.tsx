'use client'

import { useEffect, useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { CalendarIcon } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/contexts/auth-context'

interface DayStat { date: string; task_count: number; avg_agents: number }
interface UserDayStat extends DayStat { user_id: number; username: string }

const USER_COLORS = ['#d95f12', '#3b82f6', '#8b5cf6', '#14b8a6', '#facc15', '#ef4444', '#ec4899', '#22c55e']

function toISO(d: Date) { return format(d, 'yyyy-MM-dd') }

// ── Date range picker ─────────────────────────────────────────────────────────

function DateRangePicker({ range, onChange }: { range: DateRange; onChange: (r: DateRange) => void }) {
  const [open, setOpen] = useState(false)

  const label = range.from
    ? range.to && !isSameDay(range.from, range.to)
      ? `${format(range.from, 'MMM d')} – ${format(range.to, 'MMM d, yyyy')}`
      : format(range.from, 'MMM d, yyyy')
    : 'Pick date range'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium border cursor-pointer transition-colors"
        style={{ background: '#fff', borderColor: '#e8e6df', color: '#1a1815', fontFamily: 'inherit' }}
        render={
          <button
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f3ef')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          />
        }
      >
        <CalendarIcon size={14} style={{ color: '#807a6f' }} />
        {label}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="p-0 w-auto rounded-2xl border shadow-xl"
        style={{ borderColor: '#e8e6df', background: '#fff' }}
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={r => { if (r) { onChange(r); if (r.from && r.to) setOpen(false) } }}
          disabled={{ after: new Date() }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

// ── Chart card ────────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e8e6df', boxShadow: '0 2px 12px rgba(20,18,14,0.05)' }}>
      <h2 className="text-[14px] font-semibold mb-4" style={{ color: '#1a1815' }}>{title}</h2>
      {children}
    </div>
  )
}

const TOOLTIP_STYLE = { background: '#14110d', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }
const TOOLTIP_LABEL = { color: 'rgba(255,255,255,0.6)', marginBottom: 4 }

function EmptyChart({ loading }: { loading: boolean }) {
  return (
    <div className="h-52 flex items-center justify-center text-[13px]" style={{ color: '#807a6f' }}>
      {loading ? 'Loading…' : 'No data for this period.'}
    </div>
  )
}

// ── My charts ─────────────────────────────────────────────────────────────────

function MyCharts({ from, to }: { from: string; to: string }) {
  const [data, setData] = useState<DayStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stats/me?from=${from}&to=${to}`)
      .then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [from, to])

  if (loading || !data.length) return <><ChartCard title="Tasks per day"><EmptyChart loading={loading} /></ChartCard><ChartCard title="Avg agents per task by day"><EmptyChart loading={loading} /></ChartCard></>

  return (
    <>
      <ChartCard title="Tasks per day">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="g-tasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d95f12" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#d95f12" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} cursor={{ stroke: '#e8e6df' }} />
            <Area type="monotone" dataKey="task_count" name="Tasks" stroke="#d95f12" strokeWidth={2} fill="url(#g-tasks)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Avg agents per task by day">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="g-agents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} cursor={{ stroke: '#e8e6df' }} />
            <Area type="monotone" dataKey="avg_agents" name="Avg agents" stroke="#3b82f6" strokeWidth={2} fill="url(#g-agents)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ── All users charts ──────────────────────────────────────────────────────────

function AllUsersCharts({ from, to }: { from: string; to: string }) {
  const [raw, setRaw] = useState<UserDayStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stats/users?from=${from}&to=${to}`)
      .then(r => r.json()).then(setRaw).finally(() => setLoading(false))
  }, [from, to])

  if (loading || !raw.length) return <><ChartCard title="Tasks per day — all users"><EmptyChart loading={loading} /></ChartCard><ChartCard title="Avg agents — all users"><EmptyChart loading={loading} /></ChartCard></>

  const usernames = [...new Set(raw.map(r => r.username))]
  const byDate: Record<string, Record<string, unknown>> = {}
  for (const r of raw) {
    if (!byDate[r.date]) byDate[r.date] = { date: r.date }
    byDate[r.date][r.username] = r.task_count
    byDate[r.date][r.username + '_agents'] = r.avg_agents
  }
  const pivoted = Object.values(byDate).sort((a, b) => String(a.date) > String(b.date) ? 1 : -1)

  return (
    <>
      <ChartCard title="Tasks per day — all users">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={pivoted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} cursor={{ stroke: '#e8e6df' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#807a6f' }} />
            {usernames.map((u, i) => <Area key={u} type="monotone" dataKey={u} name={u} stroke={USER_COLORS[i % USER_COLORS.length]} strokeWidth={2} fill="none" dot={false} />)}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Avg agents per task — all users">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={pivoted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#807a6f' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} cursor={{ stroke: '#e8e6df' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#807a6f' }} />
            {usernames.map((u, i) => <Area key={u} type="monotone" dataKey={u + '_agents'} name={u} stroke={USER_COLORS[i % USER_COLORS.length]} strokeWidth={2} fill="none" dot={false} />)}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const today = new Date()
  const [range, setRange] = useState<DateRange>({ from: today, to: today })

  const from = toISO(range.from ?? today)
  const to = toISO(range.to ?? range.from ?? today)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a1815' }}>Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: '#807a6f' }}>Task and agent activity over time.</p>
        </div>
        <DateRangePicker range={range} onChange={setRange} />
      </div>

      {/* My stats */}
      <section className="mb-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#807a6f' }}>My activity</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <MyCharts from={from} to={to} />
        </div>
      </section>

      {/* Admin: all users */}
      {user?.is_admin && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#807a6f' }}>All users</h2>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <AllUsersCharts from={from} to={to} />
          </div>
        </section>
      )}
    </div>
  )
}
