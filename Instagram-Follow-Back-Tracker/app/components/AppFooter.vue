<script setup lang="ts">
import { MessageCircleWarning, Star } from '@lucide/vue'

// 頁尾:沿用 README 式的細線風格,不做卡片也不加底色,只用一條細線和頁面內容分開
// 內容全部是目前實際存在的頁面與連結;版權列寫 Xiang511 與 GPL-3.0
const repoUrl = `https://github.com/${repo}`

type FooterLink = { label: string; to?: string; href?: string }
const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: '網站',
    links: [
      { label: '首頁', to: '/' },
      { label: '關於本站', to: '/about' },
      { label: 'Instagram 比對', to: '/instagram' },
    ],
  },
  {
    title: '專案',
    links: [
      { label: 'GitHub 原始碼', href: repoUrl },
      { label: '回報問題', href: `${repoUrl}/issues` },
      { label: '資料隱私政策', to: '/#privacy' },
    ],
  },
]

// 圓形圖示按鈕:細線外框,hover 才浮出淡底色與較深的圖示
const iconClass =
  'border-base-300 text-base-content/70 hover:text-base-content hover:bg-base-200 flex size-10 items-center justify-center rounded-full border no-underline transition-colors'

const linkClass =
  'text-base-content/70 hover:text-base-content text-sm no-underline hover:underline'
</script>

<template>
  <footer class="border-base-300 mx-auto mt-10 max-w-[1200px] border-t px-1 pt-8 pb-6">
    <div class="grid gap-8 md:grid-cols-[1fr_auto] md:gap-16">
      <div class="max-w-[28rem]">
        <NuxtLink to="/" class="text-base-content text-base no-underline">
          Instagram-Follow-Back-Tracker
        </NuxtLink>
        <p class="text-base-content/70 mt-2 text-sm leading-[1.7em]">
          找出 Instagram 上誰沒有回追你。檔案只在你的瀏覽器內處理,不上傳、不用登入。
        </p>
        <!-- 圓形外框的圖示連結:只放實際存在的專案連結(GitHub、回報問題、Star);
             其他社群帳號等有了再加 -->
        <ul class="mt-4 flex items-center gap-3">
          <li>
            <a
              :href="repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              :class="iconClass"
              aria-label="GitHub 原始碼"
              title="GitHub">
              <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              :href="`${repoUrl}/issues`"
              target="_blank"
              rel="noopener noreferrer"
              :class="iconClass"
              aria-label="回報問題"
              title="回報問題">
              <MessageCircleWarning class="size-5" />
            </a>
          </li>
          <li>
            <a
              :href="repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              :class="iconClass"
              aria-label="在 GitHub 給這個專案星星"
              title="給個 Star">
              <Star class="size-5" />
            </a>
          </li>
        </ul>
      </div>

      <nav class="grid grid-cols-2 gap-x-12 gap-y-6 md:gap-x-16" aria-label="頁尾連結">
        <div v-for="group in groups" :key="group.title">
          <h2 class="text-base-content/60 text-sm font-normal">{{ group.title }}</h2>
          <ul class="mt-2 space-y-1.5">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink v-if="link.to" :to="link.to" :class="linkClass">{{ link.label }}</NuxtLink>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="linkClass">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div
      class="border-base-300 text-base-content/60 mt-8 space-y-1 border-t pt-4 text-sm leading-[1.7em]">
      <!-- 授權是 GPL-3.0,所以不寫 All rights reserved(與 GPL 授予使用者的權利相衝突) -->
      <p>© 2024-{{ new Date().getFullYear() }} Xiang511。原始碼以 GPL-3.0 授權。</p>
      <p>本站是獨立的第三方工具,與 Instagram、Meta 沒有關聯</p>
    </div>
  </footer>
</template>
