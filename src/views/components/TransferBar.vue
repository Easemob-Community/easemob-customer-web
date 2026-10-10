<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/store/session'

const sessionStore = useSessionStore()
const position = computed(() => sessionStore.sessionInfo?.queuePosition || 0)

const emit = defineEmits<{
  transfer: []
}>()
</script>

<template>
  <div class="transfer-bar">
    <div v-if="position > 0" class="queue-tip">
      正在为您排队，当前第 {{ position }} 位，请稍候～
    </div>
    <button v-else class="transfer-btn" @click="emit('transfer')">
      转人工客服
    </button>
  </div>
</template>

<style scoped>
.transfer-bar {
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  display: flex;
  justify-content: center;
}
.queue-tip {
  color: #ff9800;
  font-size: 14px;
}
.transfer-btn {
  padding: 6px 14px;
  border: 1px solid #3b6cff;
  color: #3b6cff;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>
