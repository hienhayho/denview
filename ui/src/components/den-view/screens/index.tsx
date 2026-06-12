import { ScreenCode } from './screen-code'
import { ScreenChat } from './screen-chat'
import { ScreenCharts } from './screen-charts'
import { ScreenFiles } from './screen-files'
import { ScreenTyping } from './screen-typing'
import { ScreenLoading } from './screen-loading'
import { ScreenTerminal } from './screen-terminal'
import { ScreenEmail } from './screen-email'
import { ScreenBrowser } from './screen-browser'
import { ScreenSpreadsheet } from './screen-spreadsheet'
import { ScreenVideoCall } from './screen-videocall'
import { ScreenKanban } from './screen-kanban'

export {
  ScreenCode, ScreenChat, ScreenCharts, ScreenFiles, ScreenTyping, ScreenLoading,
  ScreenTerminal, ScreenEmail, ScreenBrowser, ScreenSpreadsheet, ScreenVideoCall, ScreenKanban,
}

export function ScreenFor({ kind, seed }: { kind: string; seed: number }) {
  switch (kind) {
    case 'code':        return <ScreenCode seed={seed}/>
    case 'chat':        return <ScreenChat/>
    case 'charts':      return <ScreenCharts/>
    case 'files':       return <ScreenFiles/>
    case 'typing':      return <ScreenTyping/>
    case 'loading':     return <ScreenLoading/>
    case 'terminal':    return <ScreenTerminal/>
    case 'email':       return <ScreenEmail/>
    case 'browser':     return <ScreenBrowser/>
    case 'spreadsheet': return <ScreenSpreadsheet/>
    case 'videocall':   return <ScreenVideoCall/>
    case 'kanban':      return <ScreenKanban/>
    default:            return <rect x="3" y="3" width="138" height="68" fill="#14110d"/>
  }
}
