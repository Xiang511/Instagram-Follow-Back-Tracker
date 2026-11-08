<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// 404 顯示專用文字，其他錯誤顯示通用文字
const is404 = props.error.statusCode === 404

// 清除錯誤並回到首頁
const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900">
    <h1 class="text-6xl font-bold text-sky-400">{{ error.statusCode }}</h1>
    <p class="text-slate-300">{{ is404 ? '找不到此頁面' : '發生錯誤，請稍後再試' }}</p>
    <button class="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-400" @click="goHome">
      回到首頁
    </button>
  </div>
</template>
