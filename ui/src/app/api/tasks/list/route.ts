import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/lib/api'

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? ''
  const res = await backendFetch('/tasks', {}, cookie)
  if (!res.ok) return NextResponse.json([], { status: res.status })
  return NextResponse.json(await res.json())
}
