<script setup lang="ts">
import { CircleQuestionMark } from '@lucide/vue'

definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: '問題回報 | Meta粉絲追蹤-網頁版',
  description: '使用上有問題?先看常見問題，找不到答案可以留言或填寫回報表單。',
})

// Google 表單網址(暫定):貼上表單的「傳送 > 嵌入 HTML」裡 iframe 的 src 即可顯示，
// 留空時會顯示「準備中」的說明
const googleFormUrl = 'https://forms.gle/Yg1yqhEDWYomrMoS7'
const issuesUrl = `https://github.com/${repo}/issues`
</script>

<template>
  <div class="mx-auto mt-4 max-w-[1200px]">
    <!-- 抬頭沿用首頁:上方一列放站名與導覽，下方是兩層標語(前半句小而淡，後半句大) -->
    <header class="px-1 pt-2 pb-10 md:pt-4 md:pb-12">
      <div class="flex items-center justify-between gap-3">
        <NuxtLink to="/" class="text-base-content min-w-0 truncate no-underline">
          Instagram-Follow-Back-Tracker
        </NuxtLink>
        <AppNav class="shrink-0" />
      </div>
      <div class="mt-4 grid items-center gap-8 md:mt-6 md:grid-cols-2 md:gap-12">
        <div class="min-w-0">
          <h1 class="font-medium">
            <span class="text-base-content/70 block text-xl leading-[1.5] md:text-2xl">
              需要幫忙嗎?
            </span>
            <span class="mt-3 block text-4xl leading-[1.2] text-balance md:mt-4 md:text-5xl">
              先看看這些常見問題
            </span>
          </h1>
          <p class="text-base-content/80 mt-7 max-w-[34rem] text-lg leading-[1.8em]">
            也可以在留言區討論，或填寫回報表單
          </p>
        </div>
      </div>
    </header>

    <BaseCard>
      <BaseSection title="常見問題">
        <UploadHelp />
      </BaseSection>
    </BaseCard>

    <BaseCard id="form">
      <BaseSection title="回報表單">
        <iframe
          v-if="googleFormUrl"
          :src="googleFormUrl"
          title="問題回報表單"
          class="border-base-300 h-[640px] w-full rounded-md border"
          loading="lazy">
          表單載入中…
        </iframe>
        <p v-else class="text-base-content/70">
          回報表單準備中，目前請先使用下方留言，或到
          <a :href="issuesUrl" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
          回報。
        </p>
      </BaseSection>
    </BaseCard>

    <!-- 留言區不包卡片與區塊標題，和 /instagram 頁一樣直接放 giscus -->
    <BaseGiscus />
  </div>
</template>
