import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/lib/api'

// GET /api/api-keys — list keys for current user
export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? ''

  // resolve current user id
  const meRes = await backendFetch('/auth/me', {}, cookie)
  if (!meRes.ok) return NextResponse.json([], { status: meRes.status })
  const me = await meRes.json()

  const res = await backendFetch(`/users/${me.id}/api-keys`, {}, cookie)
  if (!res.ok) return NextResponse.json([], { status: res.status })
  return NextResponse.json(await res.json())
}

// POST /api/api-keys — create key for current user
export async function POST(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? ''
  const body = await req.json()

  const meRes = await backendFetch('/auth/me', {}, cookie)
  if (!meRes.ok) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
  const me = await meRes.json()

  const res = await backendFetch(`/users/${me.id}/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, cookie)

  if (!res.ok) return NextResponse.json(await res.json(), { status: res.status })
  return NextResponse.json(await res.json())
}
