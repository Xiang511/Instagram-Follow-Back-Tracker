<script setup lang="ts">
import { Activity, Footprints, NotepadText } from '@lucide/vue'

// 訪客統計的載入與資料在 useSiteStats,頁尾也共用同一份;計數圖片放在頁尾,每頁只載入一次
const { total, today, online, failed, load } = useSiteStats()
onMounted(load)

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
  </BaseSection>
</template>
