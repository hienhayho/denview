import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/lib/api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  const { task_id } = await params
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const res = await backendFetch(`/tasks/${task_id}/state?token=${encodeURIComponent(token)}`)
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: res.status })
  return NextResponse.json(await res.json())
}
