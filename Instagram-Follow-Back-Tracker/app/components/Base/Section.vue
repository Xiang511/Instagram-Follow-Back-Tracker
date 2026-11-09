<script setup lang="ts">
// 區塊標題，下方帶底線;#actions 放在標題列右側(例如工具按鈕)
defineProps<{ title: string }>()
</script>

<template>
  <!-- 對應原本的 section + h2.underline，相鄰區塊自動留 1.5em 間距 -->
  <section class="[&:not(:first-child)]:mt-6">
    <div
      class="border-base-300 mt-[0.4em] mb-4 flex items-center justify-between gap-3 border-b pb-2.5">
      <!-- 窄螢幕字級縮小:長標題(例如 Instagram-Follow-Back-Tracker)旁邊還有工具按鈕，
           25.6px 會被擠成三行;sm(640px)以上才用原本的 1.6em -->
      <h2 class="min-w-0 text-[1.25em] font-medium break-words sm:text-[1.6em]">
        <slot name="title">{{ title }}</slot>
      </h2>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <!-- 內文 p 的行高，對應原本的 .usage p -->
    <div class="[&_p]:leading-[1.7em]">
      <slot />
    </div>
  </section>
</template>
