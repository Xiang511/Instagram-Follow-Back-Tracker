<script setup lang="ts">
// 每一組 accordion 由 title 與 detail 組成
interface AccordionItem {
  title: string
  detail: string
}

defineProps<{ items: AccordionItem[] }>()

// radio 的 name 相同才會互斥(一次只展開一個),用 useId 避免多個 accordion 互相影響
const name = useId()
</script>

<template>
  <!-- join 讓項目連在一起,join-vertical 為垂直排列 -->
  <div class="join join-vertical bg-base-100 w-full">
    <div
      v-for="item in items"
      :key="item.title"
      class="collapse-arrow join-item border-base-300 collapse border">
      <input type="radio" :name="name" />
      <div class="collapse-title">{{ item.title }}</div>
      <!-- whitespace-pre-line 讓 detail 內的 \n 可以換行 -->
      <div class="collapse-content leading-[2em] whitespace-pre-line">
        {{ item.detail }}
      </div>
    </div>
  </div>
</template>
