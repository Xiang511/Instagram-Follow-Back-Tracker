<script setup lang="ts">
import { Construction } from '@lucide/vue'

// 對應原本 router 的 /threads 路由;功能還沒做，先明確標示開發中
definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: 'Threads(開發中) | Meta粉絲追蹤-網頁版',
  description: 'Threads 功能開發中，敬請期待。目前可以先使用 Instagram 比對。',
})

const repoUrl = `https://github.com/${repo}`
</script>

<template>
  <div class="mx-auto mt-4 max-w-[1200px]">
    <!-- 抬頭沿用首頁與問題回報頁的樣式 -->
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
              Threads
            </span>
            <span class="mt-3 block text-4xl leading-[1.2] text-balance md:mt-4 md:text-5xl">
              開發中，敬請期待
            </span>
          </h1>
          <p class="text-base-content/80 mt-7 max-w-[34rem] text-lg leading-[1.8em]">
            這個功能還在開發中，目前還不能使用。
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-3">
            <NuxtLink to="/instagram" class="btn btn-primary btn-lg font-normal no-underline">
              前往 Instagram 比對
            </NuxtLink>
            <a
              :href="repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-lg font-normal no-underline">
              在 GitHub 追蹤進度
            </a>
          </div>
        </div>

        <!-- 施工路障圖示(lucide 的 Construction)，只在桌面寬度顯示 -->
        <div class="text-primary/60 hidden justify-center md:flex" aria-hidden="true">
          <Construction class="size-44" :stroke-width="0.75" />
        </div>
      </div>
    </header>
  </div>
</template>
