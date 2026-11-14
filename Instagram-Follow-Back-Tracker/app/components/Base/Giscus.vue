<script setup lang="ts">
import Giscus from '@giscus/vue'

const { giscusTheme } = useTheme()
</script>

<template>
  <!-- id 放在 ClientOnly 外層，頁面載入時錨點一定存在，/report#comments 才能正確捲動 -->
  <div id="comments" class="scroll-mt-20">
    <!-- giscus 依賴瀏覽器 DOM，只在 client 端渲染 -->
    <ClientOnly>
      <div class="mx-auto mt-4 max-w-[1200px]">
        <Giscus
          repo="Xiang511/Instagram-Follow-Back-Tracker"
          repo-id="R_kgDOMXluYA"
          category="Announcements"
          category-id="DIC_kwDOMXluYM4Cg5y9"
          mapping="number"
          term="2"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          :theme="giscusTheme"
          lang="zh-TW"
          loading="lazy" />
      </div>
    </ClientOnly>
  </div>
</template>
