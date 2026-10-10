<script setup lang="ts">
import { ref } from 'vue'
import { evaluate } from '@/api/session'

const props = defineProps<{
  sessionId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const score = ref(5)
const comment = ref('')
const submitting = ref(false)

const tags = ['解决问题', '响应快', '态度好', '未解决', '回复慢']
const selectedTags = ref<string[]>([])

function toggleTag(t: string) {
  if (selectedTags.value.includes(t)) {
    selectedTags.value = selectedTags.value.filter((x) => x !== t)
  } else {
    selectedTags.value.push(t)
  }
}

async function submit() {
  submitting.value = true
  try {
    await evaluate({
      sessionId: props.sessionId,
      score: score.value,
      tags: selectedTags.value,
      comment: comment.value
    })
    emit('close')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="evaluate-dialog" @click.self="emit('close')">
    <div class="dialog-body">
      <h3>服务评价</h3>
      <div class="stars">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ active: n <= score }"
          @click="score = n"
        >
          ★
        </span>
      </div>
      <div class="tags">
        <span
          v-for="t in tags"
          :key="t"
          class="tag"
          :class="{ active: selectedTags.includes(t) }"
          @click="toggleTag(t)"
        >
          {{ t }}
        </span>
      </div>
      <textarea v-model="comment" placeholder="请输入您的建议..." rows="3" />
      <button :disabled="submitting" @click="submit">提交评价</button>
    </div>
  </div>
</template>

<style scoped>
.evaluate-dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog-body {
  width: 360px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
.stars {
  margin: 12px 0;
  font-size: 28px;
}
.star {
  cursor: pointer;
  color: #ddd;
}
.star.active {
  color: #ff9800;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 12px 0;
}
.tag {
  padding: 4px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
}
.tag.active {
  border-color: #3b6cff;
  color: #3b6cff;
  background: #eef2ff;
}
textarea {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  resize: none;
}
button {
  width: 100%;
  padding: 10px;
  background: #3b6cff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.7;
}
</style>
