<script setup lang="ts">
defineProps<{
  welcome?: string
}>()

const questions = ['怎么退款？', '物流多久到？', '如何联系人工？']
const emit = defineEmits<{
  clickQuestion: [q: string]
}>()
</script>

<template>
  <div class="welcome-card">
    <div class="welcome-text">{{ welcome || '您好，有什么可以帮您？' }}</div>
    <div class="questions">
      <span
        v-for="q in questions"
        :key="q"
        class="question-chip"
        @click="emit('clickQuestion', q)"
      >
        {{ q }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.welcome-card {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}
.welcome-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}
.questions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.question-chip {
  padding: 4px 10px;
  background: #eef2ff;
  color: #3b6cff;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
}
</style>
