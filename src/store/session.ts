import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as sessionApi from '@/api/session'
import { useUserStore } from './user'
import { useMessageStore } from './message'
import type { HandlerType, SessionInfo, SessionStatus } from '@/types'

export const useSessionStore = defineStore('session', () => {
  const sessionInfo = ref<SessionInfo | null>(null)
  const loading = ref(false)

  async function start(channel = 'web') {
    loading.value = true
    try {
      const userStore = useUserStore()
      if (!userStore.token) {
        const guest = await sessionApi.guestToken({
          userId: userStore.userId || undefined,
          nickname: userStore.nickname,
          channel
        })
        if (guest.code !== 0) throw new Error(guest.msg)
        userStore.setUser({
          userId: guest.data.userId,
          token: guest.data.token,
          easemobToken: guest.data.easemobToken
        })
      }

      const res = await sessionApi.startSession({ userId: userStore.userId!, channel })
      if (res.code !== 0) throw new Error(res.msg)
      sessionInfo.value = {
        sessionId: res.data.sessionId,
        groupId: res.data.groupId,
        status: res.data.status,
        handlerType: res.data.handlerType,
        aiAccount: res.data.aiAccount || {
          id: res.data.aiAccountId || '',
          nickname: res.data.aiNickname || '智能客服'
        },
        welcome: res.data.welcome,
        queuePosition: 0
      }
      const msgStore = useMessageStore()
      if (res.data.welcome) {
        msgStore.appendSystem(res.data.welcome)
      }
      return res.data
    } finally {
      loading.value = false
    }
  }

  function applySystemEvent(e: { type: string; agent?: any; position?: number }) {
    if (!sessionInfo.value) return
    if (e.type === 'TRANSFERRED') {
      sessionInfo.value.handlerType = 'HUMAN'
      sessionInfo.value.agent = e.agent
      sessionInfo.value.queuePosition = 0
    } else if (e.type === 'QUEUE_UPDATE') {
      sessionInfo.value.queuePosition = e.position ?? 0
    } else if (e.type === 'CLOSED') {
      sessionInfo.value.status = 'CLOSED' as SessionStatus
    }
  }

  function setHandlerType(type: HandlerType) {
    if (sessionInfo.value) {
      sessionInfo.value.handlerType = type
    }
  }

  async function transferToHuman(reason = 'USER_TRANSFER') {
    const userStore = useUserStore()
    if (!sessionInfo.value || !userStore.userId) return
    const res = await sessionApi.transferSession({
      sessionId: sessionInfo.value.sessionId,
      userId: userStore.userId,
      reason
    })
    if (res.code !== 0) throw new Error(res.msg)
  }

  return { sessionInfo, loading, start, applySystemEvent, setHandlerType, transferToHuman }
})
