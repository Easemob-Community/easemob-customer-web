<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
  transfer: []
}>()

const text = ref('')
const sending = ref(false)

async function submit() {
  const t = text.value.trim()
  if (!t || sending.value) return
  sending.value = true
  try {
    await emit('send', t)
    text.value = ''
  } finally {
    sending.value = false
  }
}

function onTransfer() {
  emit('transfer')
}
</script>

<template>
  <div class="chat-input">
    <button class="transfer-btn" :disabled="disabled" @click="onTransfer">转人工</button>
    <input
      v-model="text"
      type="text"
      :placeholder="disabled ? '会话已结束' : '请输入您的问题...'"
      :disabled="disabled"
      @keydown.enter="submit"
    />
    <button class="send-btn" :disabled="disabled || sending || !text.trim()" @click="submit">
      {{ sending ? '发送中' : '发送' }}
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e5e5e5;
  background: #fff;
}
.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}
.chat-input input:disabled {
  background: #f5f5f5;
  color: #999;
}
.transfer-btn {
  padding: 0 12px;
  border: 1px solid #3b6cff;
  color: #3b6cff;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.transfer-btn:disabled {
  border-color: #dcdcdc;
  color: #999;
  cursor: not-allowed;
}
.send-btn {
  padding: 0 16px;
  background: #3b6cff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
