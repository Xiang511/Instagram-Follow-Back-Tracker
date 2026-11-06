<script setup lang="ts">
import { Activity, Footprints, NotepadText } from '@lucide/vue'

// 訪客統計:沿用原本的 SiteStates 腳本
// 腳本載入後會在 window 上留下 stTotalount(原站拼字如此)、stTodayCount、stOnlineCount 三個數字,
// 它原本用 document.write 輸出的內容在頁面載入後無效,所以直接讀這三個變數
const STATS_URL = 'https://SiteStates.com/show/js_text/b8cc25660e113e850df745866725c57d'
// 原本放在頁面最上方、隱藏的計數圖片,載入它才會把這次造訪算進統計
const COUNTER_IMG = 'https://SiteStates.com/show/image/33614.jpg'

const total = ref<number | null>(null)
const today = ref<number | null>(null)
const online = ref<number | null>(null)
const failed = ref(false)

const toNumber = (value: unknown) => (typeof value === 'number' ? value : null)

onMounted(() => {
  const script = document.createElement('script')
  script.src = STATS_URL
  script.onload = () => {
    const stats = window as unknown as Record<string, unknown>
    total.value = toNumber(stats.stTotalount)
    today.value = toNumber(stats.stTodayCount)
    online.value = toNumber(stats.stOnlineCount)
    failed.value = total.value === null && today.value === null && online.value === null
  }
  script.onerror = () => {
    failed.value = true
  }
  document.body.appendChild(script)
})

const items = computed(() => [
  { icon: NotepadText, label: '累計訪客', value: total.value },
  { icon: Footprints, label: '今日訪客', value: today.value },
  { icon: Activity, label: '線上人數', value: online.value },
])
</script>

<template>
  <BaseSection title="網站資訊">
    <ul class="flex flex-col gap-x-6 gap-y-2">
      <li v-for="item in items" :key="item.label" class="flex items-center gap-2">
        <component :is="item.icon" class="size-5 shrink-0 opacity-60" />
        <span>{{ item.label }}:</span>
        <span>
          {{
            item.value === null ? (failed ? '無法取得' : '載入中…') : item.value.toLocaleString()
          }}
        </span>
      </li>
    </ul>
    <!-- 隱藏的計數圖片,不佔版面 -->
    <img :src="COUNTER_IMG" alt="" width="1" height="1" class="hidden" />
  </BaseSection>
</template>
