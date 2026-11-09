<script setup lang="ts">
import { SearchX, TriangleAlert } from '@lucide/vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const siteUrl = useSiteUrl()

// 404 顯示專用文字，其他錯誤顯示通用文字
const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () =>
    is404.value ? '找不到頁面 | Meta粉絲追蹤-網頁版' : '發生錯誤 | Meta粉絲追蹤-網頁版',
  robots: 'noindex',
})

// 清除錯誤並導向指定頁面(error.vue 在路由之外，所以不能直接用 NuxtLink 離開錯誤狀態)
const go = (path: string) => clearError({ redirect: path })
</script>

<template>
  <NuxtLayout name="base-layout">
    <div class="mx-auto mt-4 max-w-[1200px]">
      <!-- 抬頭沿用首頁、問題回報與 Threads 頁的樣式 -->
      <header class="px-1 pt-2 pb-10 md:pt-4 md:pb-12">
        <div class="flex items-center justify-between gap-3">
          <a
            :href="siteUrl.asset('')"
            class="text-base-content min-w-0 truncate no-underline"
            @click.prevent="go('/')">
            Instagram-Follow-Back-Tracker
          </a>
          <AppNav class="shrink-0" />
        </div>
        <div class="mt-4 grid items-center gap-8 md:mt-6 md:grid-cols-2 md:gap-12">
          <div class="min-w-0">
            <h1 class="font-medium">
              <span class="text-base-content/70 block text-xl leading-[1.5] md:text-2xl">
                {{ is404 ? '404 找不到頁面' : '發生錯誤' }}
              </span>
              <span class="mt-3 block text-4xl leading-[1.2] text-balance md:mt-4 md:text-5xl">
                {{ is404 ? '這個網址沒有內容' : '頁面暫時無法顯示' }}
              </span>
            </h1>
            <p class="text-base-content/80 mt-7 max-w-[34rem] text-lg leading-[1.8em]">
              {{
                is404
                  ? '網址可能打錯了，或這個頁面已經移走。回到首頁重新開始吧。'
                  : '回到首頁再試一次。問題持續發生的話，歡迎到頁尾的問題回報告訴我們。'
              }}
            </p>
            <div class="mt-10 flex flex-wrap items-center gap-3">
              <button type="button" class="btn btn-primary btn-lg font-normal" @click="go('/')">
                回到首頁
              </button>
            </div>
          </div>

          <!-- 圖示(lucide)，只在桌面寬度顯示 -->
          <div class="text-primary/60 hidden justify-center md:flex" aria-hidden="true">
            <SearchX v-if="is404" class="size-44" :stroke-width="0.75" />
            <TriangleAlert v-else class="size-44" :stroke-width="0.75" />
          </div>
        </div>
      </header>
    </div>
  </NuxtLayout>
</template>
