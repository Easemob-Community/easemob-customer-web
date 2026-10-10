import SDK from 'easemob-websdk'
import { useSessionStore } from '@/store/session'
import { useUserStore } from '@/store/user'
import { useMessageStore } from '@/store/message'
import type { ChatMessage, MsgSenderType, MsgType } from '@/types'

const conn = new SDK.connection({
  appKey: import.meta.env.VITE_EASEMOB_APP_KEY
})

let inited = false

function normalize(m: any): ChatMessage {
  const session = useSessionStore().sessionInfo
  const userId = useUserStore().userId
  let senderType: MsgSenderType = 'AI'
  if (m.from === userId) {
    senderType = 'USER'
  } else if (m.from === session?.agent?.id) {
    senderType = 'AGENT'
  } else if (m.from === session?.aiAccount?.id) {
    senderType = 'AI'
  }
  return {
    id: m.id || m.msgId,
    msgId: m.id || m.msgId,
    senderType,
    senderId: m.from,
    msgType: (m.type?.toUpperCase() || 'TXT') as MsgType,
    content: m.msg || m.data || '',
    status: 'sent',
    createTime: new Date().toISOString(),
    ext: m.ext || {}
  }
}

export async function loginEasemob(userId: string, token: string) {
  if (inited) return
  await conn.open({ user: userId, accessToken: token })
  inited = true
}

export function bindMessageListener() {
  const msgStore = useMessageStore()
  const sessionStore = useSessionStore()

  conn.addEventHandler('cs-web', {
    onTextMessage: (m: any) => {
      const ext = m.ext || {}
      if (ext.bizType === 'TRANSFERRED') {
        sessionStore.applySystemEvent({ type: 'TRANSFERRED', agent: ext.agent })
      } else if (ext.bizType === 'QUEUE_UPDATE') {
        sessionStore.applySystemEvent({ type: 'QUEUE_UPDATE', position: ext.position })
      } else if (ext.bizType === 'CLOSED') {
        sessionStore.applySystemEvent({ type: 'CLOSED' })
      }
      msgStore.append(normalize(m))
    },
    onImageMessage: (m: any) => {
      msgStore.append(normalize(m))
    },
    onDisconnected: () => {
      console.warn('Easemob disconnected')
    }
  })
}

export function getConn() {
  return conn
}
