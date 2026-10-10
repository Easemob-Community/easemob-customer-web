import SDK from 'easemob-websdk'
import { getConn } from './easemob'
import { useSessionStore } from '@/store/session'
import { useMessageStore } from '@/store/message'

export async function sendGroupText(text: string) {
  const sessionStore = useSessionStore()
  const msgStore = useMessageStore()
  const session = sessionStore.sessionInfo
  if (!session) throw new Error('会话未初始化')

  const conn = getConn()
  const id = conn.getUniqueId()
  const temp = {
    id,
    senderType: 'USER' as const,
    senderId: session.sessionId,
    msgType: 'TXT' as const,
    content: text,
    status: 'sending' as const,
    createTime: new Date().toISOString()
  }
  msgStore.markSending(id, temp)

  const msg = SDK.message.create({
    type: 'txt',
    to: session.groupId,
    chatType: 'groupChat',
    msg: text,
    ext: { sessionId: session.sessionId }
  })

  try {
    await conn.send(msg)
    msgStore.markSent(id)
  } catch (e) {
    msgStore.markFailed(id)
    throw e
  }
}
