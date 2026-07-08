export interface WorkSummary {
  id: number
  label: string
  status: 'processing' | 'completed' | 'failed'
  started_at: string
  ended_at: string | null
}

export interface AgentState {
  id: number
  name: string
  role: string
  color: string
  status: 'working' | 'idle'
  note: string | null
  current_work: WorkSummary | null
  recent_works: WorkSummary[]
}

export interface TaskState {
  task_id: number
  task_name: string
  task_status: 'running' | 'done' | 'failed'
  agents: AgentState[]
}

export const AWAY_KINDS = ['coffee', 'sofa', 'window'] as const
export const WORKING_KINDS = ['code', 'chat', 'charts', 'files', 'typing', 'loading', 'terminal', 'email', 'browser', 'spreadsheet', 'videocall', 'kanban'] as const
export const IDLE_KINDS = ['thinking', 'laughing', 'sleep', 'stretch', 'toy', 'doodle'] as const

export type Activity = typeof AWAY_KINDS[number] | typeof WORKING_KINDS[number] | typeof IDLE_KINDS[number]
