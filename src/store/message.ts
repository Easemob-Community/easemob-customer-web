import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage, MsgSenderType, MsgType } from '@/types'

export const useMessageStore = defineStore('message', () => {
  const messages = ref<ChatMessage[]>([])
  const unread = ref(0)

  function append(m: ChatMessage) {
    if (m.msgId) {
      const existing = messages.value.find(x => x.msgId === m.msgId || x.id === m.msgId)
      if (existing) {
        Object.assign(existing, m)
        return
      }
    }
    const pending = messages.value.find(
      x => x.status === 'sending' && x.senderType === m.senderType && x.content === m.content
    )
    if (pending) {
      Object.assign(pending, m)
      return
    }
    messages.value.push(m)
    unread.value++
  }

  function prepend(list: ChatMessage[]) {
    messages.value.unshift(...list)
  }

  function appendText(senderType: MsgSenderType, senderId: string, content: string, opts?: Partial<ChatMessage>) {
    append({
      id: 'local-' + Date.now(),
      senderType,
      senderId,
      msgType: 'TXT',
      content,
      status: 'sent',
      createTime: new Date().toISOString(),
      ...opts
    } as ChatMessage)
  }

  function appendSystem(content: string) {
    append({
      id: 'sys-' + Date.now(),
      senderType: 'SYSTEM',
      senderId: 'system',
      msgType: 'TXT',
      content,
      status: 'sent',
      createTime: new Date().toISOString(),
      bizType: 'SYSTEM'
    } as ChatMessage)
  }

  function markSending(id: string, temp: ChatMessage) {
    append({ ...temp, id, status: 'sending' })
  }

  function markSent(id: string) {
    const m = messages.value.find((x) => x.id === id || x.msgId === id)
    if (m) m.status = 'sent'
  }

  function markFailed(id: string) {
    const m = messages.value.find((x) => x.id === id || x.msgId === id)
    if (m) m.status = 'failed'
  }

  function resetUnread() {
    unread.value = 0
  }

  function clear() {
    messages.value = []
    unread.value = 0
  }

  return {
    messages,
    unread,
    append,
    prepend,
    appendText,
    appendSystem,
    markSending,
    markSent,
    markFailed,
    resetUnread,
    clear
  }
})
