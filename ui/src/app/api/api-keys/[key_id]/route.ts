import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/lib/api'

// DELETE /api/api-keys/[key_id] — revoke key
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key_id: string }> }
) {
  const { key_id } = await params
  const cookie = req.headers.get('cookie') ?? ''

  const meRes = await backendFetch('/auth/me', {}, cookie)
  if (!meRes.ok) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
  const me = await meRes.json()

  const res = await backendFetch(`/users/${me.id}/api-keys/${key_id}`, {
    method: 'DELETE',
  }, cookie)

  if (!res.ok) return NextResponse.json(await res.json(), { status: res.status })
  return NextResponse.json(await res.json())
}
