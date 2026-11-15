<script setup lang="ts">
// 編輯視窗的格式錯誤提示:列出哪裡有問題(最多顯示 5 項)，並附上問題回報頁的連結
// 連結開新分頁，使用者正在編輯的內容不會不見
const props = defineProps<{ errors: string[] }>()

const MAX_SHOWN = 5
const shown = computed(() => props.errors.slice(0, MAX_SHOWN))
const hiddenCount = computed(() => props.errors.length - shown.value.length)
</script>

<template>
  <div v-if="errors.length > 0" role="alert" class="alert alert-error alert-soft mt-2 block">
    <p>格式有誤，請修正後再儲存</p>
    <ul class="mt-1 list-disc pl-5">
      <li v-for="message in shown" :key="message" class="break-all">{{ message }}</li>
      <li v-if="hiddenCount > 0" class="list-none">還有 {{ hiddenCount }} 項…</li>
    </ul>
    <p class="mt-2">
      還是不確定怎麼改?
      <NuxtLink to="/report" target="_blank" rel="noopener noreferrer">回報問題或填寫問卷</NuxtLink>
    </p>
  </div>
</template>
