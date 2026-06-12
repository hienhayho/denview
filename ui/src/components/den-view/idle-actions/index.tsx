import { ActionThinking } from './action-thinking'
import { ActionLaughing } from './action-laughing'
import { ActionSleep } from './action-sleep'
import { ActionPhone } from './action-phone'
import { ActionStretch } from './action-stretch'
import { ActionToy } from './action-toy'
import { ActionSnack } from './action-snack'
import { ActionDoodle } from './action-doodle'
import { ActionMusic } from './action-music'
import { ActionRead } from './action-read'

export {
  ActionThinking, ActionLaughing, ActionSleep, ActionPhone,
  ActionStretch, ActionToy, ActionSnack, ActionDoodle, ActionMusic, ActionRead,
}

export function IdleActionFor({ kind, color }: { kind: string; color: string }) {
  switch (kind) {
    case 'thinking': return <ActionThinking/>
    case 'laughing': return <ActionLaughing/>
    case 'sleep':    return <ActionSleep/>
    case 'phone':    return <ActionPhone color={color}/>
    case 'stretch':  return <ActionStretch/>
    case 'toy':      return <ActionToy color={color}/>
    case 'snack':    return <ActionSnack/>
    case 'doodle':   return <ActionDoodle/>
    case 'music':    return <ActionMusic/>
    case 'read':     return <ActionRead/>
    default:         return null
  }
}
