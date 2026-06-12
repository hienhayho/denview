'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { DenOffice } from '@/components/den-view/den-office'
import type { TaskState } from '@/components/den-view/types'

export default function ViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const taskId = params.task_id as string
  const token = searchParams.get('token') ?? ''

  const [state, setState] = useState<TaskState | null>(null)
  const [error, setError] = useState<string | null>(null)

  const poll = useCallback(async () => {
    const res = await fetch(`/api/tasks/${taskId}/state?token=${encodeURIComponent(token)}`)
    if (!res.ok) { setError('Invalid or expired token.'); return }
    setState(await res.json())
  }, [taskId, token])

  useEffect(() => {
    poll()
    const t = setInterval(poll, 3000)
    return () => clearInterval(t)
  }, [poll])

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#807a6f', fontSize: 14 }}>
      {error}
    </div>
  )
  if (!state) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#807a6f', fontSize: 14 }}>
      Loading…
    </div>
  )

  return <DenOffice state={state}/>
}
