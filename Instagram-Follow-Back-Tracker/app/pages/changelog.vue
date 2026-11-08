<script setup lang="ts">
definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: '版本紀錄 | Meta粉絲追蹤-網頁版',
  description: '這個網站的 Release 版本與主要更新。',
})

const releasesUrl = `https://github.com/${repo}/releases`

// 版本紀錄:只列 Release 版本，由新到舊
// v1.0.0 是實際的 git tag;v2.0.0 是目前這版(還沒建立 tag)，所以沒有日期，改標「目前版本」
type Entry = { version: string; label: string; title: string; items: string[]; current?: boolean }
const entries: Entry[] = [
  {
    version: 'v2.0.0',
    label: '目前版本',
    title: '以 Nuxt 4 重新打造',
    items: [
      '全新介面與首頁，支援多種主題',
      '直接上傳 ZIP，自動取出需要的檔案',
      '標籤、忽略名單、重點關注，以及匯出 CSV',
      '新增問題回報、資料隱私政策等頁面',
    ],
    current: true,
  },
  {
    version: 'v1.0.0',
    label: '2024-07-17',
    title: '第一版上線',
    items: ['上傳 Instagram 匯出的 JSON，找出沒有回追你的人'],
  },
]
</script>

<template>
  <div class="mx-auto mt-4 max-w-[1200px]">
    <!-- 抬頭沿用首頁、問題回報與 Threads 頁的樣式 -->
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
              版本紀錄
            </span>
            <span class="mt-3 block text-4xl leading-[1.2] text-balance md:mt-4 md:text-5xl">
              一路走來的每次更新
            </span>
          </h1>
          <p class="text-base-content/80 mt-7 max-w-[34rem] text-lg leading-[1.8em]">
            這裡列出網站的 Release 版本與主要更新。
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-3">
            <a
              :href="releasesUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-lg font-normal no-underline">
              在 GitHub 查看 Releases
            </a>
          </div>
        </div>
      </div>
    </header>

    <BaseCard>
      <BaseSection title="更新紀錄">
        <!-- daisyUI timeline:垂直、全部靠右(compact);線條用 base-300 細線，標題用一般文字色 -->
        <ul class="timeline timeline-vertical timeline-compact">
          <li v-for="(entry, index) in entries" :key="entry.version">
            <hr v-if="index > 0" class="bg-base-300" />
            <div class="timeline-middle">
              <span
                class="bg-base-100 block size-3 rounded-full border-2"
                :class="entry.current ? 'border-primary' : 'border-base-content/30'" />
            </div>
            <div class="timeline-end mb-8 w-full pl-2">
              <span class="text-base-content/60 text-sm">{{ entry.label }}</span>
              <h3 class="text-base-content mt-1 text-base font-medium">
                {{ entry.version }} {{ entry.title }}
              </h3>
              <ul class="text-base-content/80 mt-2 list-disc space-y-1 pl-5 text-sm">
                <li v-for="item in entry.items" :key="item">{{ item }}</li>
              </ul>
            </div>
            <hr v-if="index < entries.length - 1" class="bg-base-300" />
          </li>
        </ul>
      </BaseSection>
    </BaseCard>
  </div>
</template>
