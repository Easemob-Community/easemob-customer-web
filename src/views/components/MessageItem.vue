<script setup lang="ts">
import type { ChatMessage } from '@/types'

defineProps<{
  msg: ChatMessage
}>()
</script>

<template>
  <div
    class="message-item"
    :class="{
      'msg-right': msg.senderType === 'USER',
      'msg-left': msg.senderType !== 'USER',
      'msg-system': msg.senderType === 'SYSTEM'
    }"
  >
    <div class="bubble">
      <div class="sender">{{ msg.senderName || msg.senderId }}</div>
      <div class="content">{{ msg.content }}</div>
      <div v-if="msg.status === 'sending'" class="status">发送中...</div>
      <div v-if="msg.status === 'failed'" class="status fail">发送失败</div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  margin: 8px 0;
}
.msg-right {
  justify-content: flex-end;
}
.msg-left {
  justify-content: flex-start;
}
.msg-system {
  justify-content: center;
}
.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f1f1f1;
  word-break: break-word;
}
.msg-right .bubble {
  background: #3b6cff;
  color: #fff;
}
.msg-system .bubble {
  background: #e8e8e8;
  color: #666;
  font-size: 12px;
}
.sender {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.status {
  font-size: 11px;
  margin-top: 4px;
  color: #999;
}
.fail {
  color: #ff4d4f;
}
</style>
