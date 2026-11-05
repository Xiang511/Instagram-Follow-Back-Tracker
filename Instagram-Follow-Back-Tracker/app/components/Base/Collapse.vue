<script setup lang="ts">
import { ChevronsDown } from '@lucide/vue'

// 預設收合;點中間帶箭頭的分隔線就能展開 / 收合內容
withDefaults(defineProps<{ label?: string }>(), { label: '更多資訊' })
</script>

<template>
  <div class="group collapse mt-5 rounded-none">
    <!-- daisyUI 的 collapse 以隱形的 checkbox 蓋在標題上,點標題就會切換 -->
    <input type="checkbox" :aria-label="label" />
    <div class="collapse-title p-0 font-normal">
      <div class="divider text-base-content/60 my-0 gap-2">
        <span class="inline-flex items-center gap-1.5">
          <!-- 收合時跳動 3 次提示可展開,展開後翻轉向上 -->
          <ChevronsDown
            class="hint size-5 shrink-0 transition-transform duration-300 group-has-[>input:checked]:rotate-180" />
          {{ label }}
        </span>
      </div>
    </div>
    <div class="collapse-content p-0">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.hint {
  animation: hint-bounce 1s ease-in-out 3;
}

/* 展開後不再跳動(scoped 樣式不在 layer 內,優先權高於 utility,所以在這裡處理) */
.group:has(> input:checked) .hint {
  animation: none;
}

@keyframes hint-bounce {
  0%,
  100% {
    transform: translateY(-20%);
  }
  50% {
    transform: translateY(15%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hint {
    animation: none;
  }
}
</style>
