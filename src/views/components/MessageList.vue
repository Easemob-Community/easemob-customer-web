<script setup lang="ts">
import { computed } from 'vue'
import { useMessageStore } from '@/store/message'
import MessageItem from './MessageItem.vue'

const msgStore = useMessageStore()
const list = computed(() => msgStore.messages)
</script>

<template>
  <div class="message-list">
    <MessageItem v-for="msg in list" :key="msg.id" :msg="msg" />
  </div>
</template>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f7f8fa;
}
</style>
