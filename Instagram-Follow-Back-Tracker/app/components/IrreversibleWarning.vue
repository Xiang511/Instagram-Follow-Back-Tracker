<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'

// 管理忽略名單 / 管理標籤共用的警語:儲存會整份取代，而且沒有復原功能
// 文字用一般文字色(警告色在淺色主題是亮黃，字會看不清楚)，警示感由邊框、淡底色與圖示表達;
// 圖示的黃色混入文字色加深，各主題都看得清楚
</script>

<template>
  <div
    role="note"
    class="alert border-warning bg-warning/10 text-base-content mb-3 items-start border">
    <TriangleAlert
      class="mt-0.5 size-5 shrink-0 text-[color-mix(in_oklab,var(--color-warning),var(--color-base-content)_55%)]"
      aria-hidden="true" />
    <span>這項操作儲存後將無法復原，操作前請先匯出你的檔案以防止資料遺失</span>
  </div>
</template>
