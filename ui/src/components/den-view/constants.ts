import type { Activity } from './types'

export const FOX_OG   = '#D95F12'
export const FOX_DK   = '#B84010'
export const FOX_CRM  = '#FFF0D0'
export const FOX_NOIR = '#1C0800'

export const TASK_LABELS: Record<string, string[]> = {
  code:     ['refactoring auth module', 'patching merge conflict', 'writing migration', 'unit tests', 'reading stack trace'],
  chat:     ['drafting reply to PM', 'reviewing thread', 'pinging reviewer', 'syncing with @ops'],
  charts:   ['plotting cohort retention', 'inspecting funnel', 'tuning forecast', 'reviewing KPIs'],
  files:    ['organizing artifacts', 'tagging assets', 'scanning archive', 'compressing logs'],
  typing:   ['composing brief', 'transcribing notes', 'finishing memo'],
  loading:  ['running build', 'training small model', 'awaiting CI', 'fetching deps'],
  thinking: ['considering options', 'reading carefully', 'planning approach'],
  laughing: ['enjoying a meme', 'reading bug ticket'],
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function labelToActivity(label: string): Activity {
  const l = label.toLowerCase()
  if (l.includes('refactor') || l.includes('patch') || l.includes('migrat') || l.includes('test') || l.includes('stack')) return 'code'
  if (l.includes('draft') || l.includes('review') || l.includes('ping') || l.includes('sync')) return 'chat'
  if (l.includes('plot') || l.includes('inspect') || l.includes('forecast') || l.includes('kpi')) return 'charts'
  if (l.includes('organiz') || l.includes('tag') || l.includes('scan') || l.includes('compress')) return 'files'
  if (l.includes('compos') || l.includes('transcrib') || l.includes('memo')) return 'typing'
  if (l.includes('build') || l.includes('train') || l.includes('await') || l.includes('fetch')) return 'loading'
  return 'code'
}
