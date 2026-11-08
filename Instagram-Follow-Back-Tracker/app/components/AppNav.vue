<script setup lang="ts">
import { Menu, Palette } from '@lucide/vue'

const repoUrl = 'https://github.com/Xiang511/Instagram-Follow-Back-Tracker'

// 假資料:有 children 的項目會變成可收合的子選單
// 有 to 的項目會連到站內頁面,其餘仍是假連結
type MenuLink = { label: string; to?: string }
const menuItems: (MenuLink & { children?: MenuLink[] })[] = [
  { label: '首頁', to: '/' },
  { label: '關於本站', to: '/about' },
  { label: '網站功能', children: [{ label: 'Instagram', to: '/instagram' }, { label: 'Threads' }] },
  { label: '更多', children: [{ label: '回報問題', to: '/report' }] },
  { label: '資料隱私政策' },
]

// 選單項目被按下或是目前頁面時,底色與文字改吃主題色(daisyUI 預設是 neutral,淺色主題會變黑)
const activeColor =
  '[--menu-active-bg:var(--color-primary)] [--menu-active-fg:var(--color-primary-content)]'
// 全域 a 的連結色會蓋掉選單文字,所以平常才套 base-content,按下或目前頁面時交還給 menu-active 的文字色
const linkClass = '[&:not(:active,.menu-active,[aria-current])]:text-base-content'

// 主題狀態與切換邏輯在 useTheme,Giscus 也共用同一份
const { currentTheme, setTheme } = useTheme()

function pickTheme(theme: string) {
  setTheme(theme)
  // 選完收起下拉(daisyUI 的 dropdown 靠 focus 開啟)
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}
</script>

<template>
  <!-- 右上角導覽:無底色無邊框的圖示按鈕,淡色文字,hover 才浮出底色,和頁面的細線風格融合 -->
  <nav class="flex items-center gap-1" aria-label="網站工具">
    <!-- 主題選單 -->
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-ghost btn-square text-base-content/70 hover:text-base-content font-normal"
        aria-label="切換主題"
        title="切換主題">
        <Palette />
      </div>
      <ul
        tabindex="0"
        class="menu dropdown-content rounded-box bg-base-100 border-base-300 z-10 mt-2 w-40 border shadow-sm"
        :class="activeColor">
        <li v-for="t in themes" :key="t.value">
          <button
            type="button"
            class="font-normal"
            :class="{ 'menu-active': currentTheme === t.value }"
            @click="pickTheme(t.value)">
            {{ t.label }}
          </button>
        </li>
      </ul>
    </div>
    <a
      :href="repoUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-ghost btn-square text-base-content/70 hover:text-base-content font-normal no-underline"
      aria-label="GitHub 專案原始碼"
      title="GitHub">
      <svg viewBox="0 0 24 24" class="size-6" fill="currentColor" aria-hidden="true">
        <path
          d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
      </svg>
    </a>

    <!-- 漢堡選單:daisyUI 的 collapsible with submenu,先放假資料 -->
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-ghost btn-square text-base-content/70 hover:text-base-content font-normal"
        aria-label="開啟選單"
        title="選單">
        <Menu />
      </div>
      <ul
        tabindex="0"
        class="menu dropdown-content rounded-box bg-base-100 border-base-300 z-10 mt-2 w-56 border shadow-sm"
        :class="activeColor">
        <li v-for="item in menuItems" :key="item.label">
          <details v-if="item.children" open>
            <summary class="font-normal">{{ item.label }}</summary>
            <ul>
              <li v-for="child in item.children" :key="child.label">
                <NuxtLink
                  v-if="child.to"
                  :to="child.to"
                  class="font-normal no-underline"
                  :class="linkClass">
                  {{ child.label }}
                </NuxtLink>
                <a v-else class="font-normal no-underline" :class="linkClass" href="#">
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </details>
          <NuxtLink
            v-else-if="item.to"
            :to="item.to"
            class="font-normal no-underline"
            :class="linkClass">
            {{ item.label }}
          </NuxtLink>
          <a v-else class="font-normal no-underline" :class="linkClass" href="#">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
