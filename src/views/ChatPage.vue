<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSessionStore } from '@/store/session'
import { useMessageStore } from '@/store/message'
import { useUserStore } from '@/store/user'
import { sendGroupText } from '@/sdk/message'
import { loginEasemob, bindMessageListener } from '@/sdk/easemob'
import { recordMessage } from '@/api/session'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'
import TransferBar from './components/TransferBar.vue'
import WelcomeCard from './components/WelcomeCard.vue'
import EvaluateDialog from './components/EvaluateDialog.vue'

const sessionStore = useSessionStore()
const msgStore = useMessageStore()
const userStore = useUserStore()

const started = ref(false)
const showEvaluate = ref(false)

const isClosed = computed(() =>
  ['CLOSED', 'EVALUATED'].includes(sessionStore.sessionInfo?.status ?? '')
)

async function start() {
  await sessionStore.start('web')
  started.value = true
  bindMessageListener()
  await loginEasemob(userStore.userId, userStore.easemobToken)
}

async function onStartWithQuestion(q: string) {
  await start()
  onSend(q)
}

async function restart() {
  showEvaluate.value = false
  msgStore.clear()
  await start()
}

async function onSend(text: string) {
  if (!sessionStore.sessionInfo || isClosed.value) return
  const sessionId = sessionStore.sessionInfo.sessionId
  const localId = 'local-' + Date.now()
  msgStore.append({
    id: localId,
    senderType: 'USER',
    senderId: userStore.userId,
    msgType: 'TXT',
    content: text,
    status: 'sending',
    createTime: new Date().toISOString()
  } as any)
  try {
    await sendGroupText(text)
    await recordMessage({ sessionId, content: text, type: 'TXT' })
    msgStore.markSent(localId)
  } catch (e) {
    console.error('send failed', e)
    msgStore.markFailed(localId)
  }
}

async function onTransfer() {
  if (isClosed.value) return
  try {
    await sessionStore.transferToHuman('USER_TRANSFER')
    await onSend('转人工')
  } catch (e) {
    console.error('transfer failed', e)
  }
}

watch(
  () => sessionStore.sessionInfo?.status,
  (status) => {
    if (status === 'CLOSED') {
      showEvaluate.value = true
    }
  }
)
</script>

<template>
  <div class="chat-page">
    <div class="chat-header">
      <span class="title">在线客服</span>
      <span v-if="sessionStore.sessionInfo" class="status">
        <template v-if="isClosed">已结束</template>
        <template v-else>
          {{ sessionStore.sessionInfo.handlerType === 'HUMAN' ? '人工服务中' : '智能客服' }}
        </template>
      </span>
    </div>

    <div v-if="!started" class="start-panel">
      <WelcomeCard welcome="" @clickQuestion="onStartWithQuestion" />
      <button class="start-btn" :disabled="sessionStore.loading" @click="start">
        {{ sessionStore.loading ? '接入中...' : '开始咨询' }}
      </button>
    </div>

    <template v-else>
      <WelcomeCard
        v-if="!isClosed"
        :welcome="sessionStore.sessionInfo?.welcome"
        @clickQuestion="onSend"
      />
      <MessageList />
      <div v-if="isClosed" class="closed-bar">
        <span class="closed-text">会话已结束</span>
        <button class="restart-btn" :disabled="sessionStore.loading" @click="restart">
          {{ sessionStore.loading ? '接入中...' : '重新咨询' }}
        </button>
      </div>
      <template v-else>
        <TransferBar v-if="sessionStore.sessionInfo?.handlerType === 'AI'" @transfer="onTransfer" />
        <ChatInput :disabled="isClosed" @send="onSend" @transfer="onTransfer" />
      </template>
      <EvaluateDialog
        v-if="showEvaluate && sessionStore.sessionInfo"
        :session-id="sessionStore.sessionInfo.sessionId"
        @close="showEvaluate = false"
      />
    </template>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #3b6cff;
  color: #fff;
}
.title {
  font-weight: 600;
}
.status {
  font-size: 13px;
}
.start-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
}
.start-btn {
  padding: 12px 40px;
  background: #3b6cff;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
}
.start-btn:disabled {
  opacity: 0.7;
}
.closed-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 12px;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
}
.closed-text {
  color: #999;
  font-size: 13px;
}
.restart-btn {
  padding: 8px 32px;
  background: #3b6cff;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
.restart-btn:disabled {
  opacity: 0.7;
}
</style>
