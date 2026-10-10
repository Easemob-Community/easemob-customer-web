import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userId = ref<string>('')
  const nickname = ref<string>('访客')
  const token = ref<string>('')
  const easemobToken = ref<string>('')

  function setUser(data: { userId: string; nickname?: string; token?: string; easemobToken?: string }) {
    userId.value = data.userId
    if (data.nickname) nickname.value = data.nickname
    if (data.token) {
      token.value = data.token
      localStorage.setItem('cs_guest_token', data.token)
    }
    if (data.easemobToken) {
      easemobToken.value = data.easemobToken
    }
  }

  return { userId, nickname, token, easemobToken, setUser }
})
