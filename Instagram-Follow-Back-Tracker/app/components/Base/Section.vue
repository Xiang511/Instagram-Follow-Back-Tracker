<script setup lang="ts">
// 區塊標題,下方帶底線
defineProps<{ title: string }>()
</script>

<template>
  <!-- 對應原本的 section + h2.underline,相鄰區塊自動留 1.5em 間距 -->
  <section class="[&:not(:first-child)]:mt-6">
    <h2 class="mt-[0.4em] mb-4 border-b border-[#e5e7eb] pb-2.5 text-[1.6em] font-medium">
      <slot name="title">{{ title }}</slot>
    </h2>
    <!-- 內文 p 的行高,對應原本的 .usage p -->
    <div class="[&_p]:leading-[1.7em]">
      <slot />
    </div>
  </section>
</template>
