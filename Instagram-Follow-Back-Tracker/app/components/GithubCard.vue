<script setup lang="ts">
import { Link } from '@lucide/vue'

// 連結預覽卡:整張卡就是連結,版型比照聊天軟體貼上網址後的預覽(預覽圖、標題、描述、網域)
// 預覽圖使用 GitHub 官方的 Open Graph 圖片,描述向公開 API 取得,失敗時只顯示網址
const { info, failed } = useGithubRepo(repo)

const url = computed(() => info.value?.html_url ?? `https://github.com/${repo}`)
const image = `https://opengraph.githubassets.com/1/${repo}`
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="border-base-300 bg-base-100 hover:bg-base-200 flex flex-col overflow-hidden rounded-md border font-normal no-underline transition-colors md:flex-row">
    <!-- GitHub 預覽圖固定 2:1,載入前先佔位避免版面跳動 -->
    <div class="bg-base-200 preview-image relative aspect-[2/1] shrink-0">
      <img :src="image" alt="" loading="lazy" class="absolute inset-0 size-full object-cover" />
    </div>

    <div
      class="border-base-300 flex min-w-0 flex-col justify-center gap-1 border-t p-4 md:border-t-0 md:border-l">
      <p class="text-base-content break-all">{{ repo }}</p>
      <p v-if="info?.description" class="text-base-content opacity-80">{{ info.description }}</p>
      <div v-else-if="!failed" class="skeleton h-5 w-2/3"></div>
      <p class="text-base-content flex items-center gap-1.5 opacity-60">
        <Link class="size-4 shrink-0" />
        github.com
      </p>
    </div>
  </a>
</template>

<style scoped>
/* 手機版預覽圖撐滿整列,md 以上固定寬度放在文字左側 */
.preview-image {
  width: 100%;
}
@media (min-width: 768px) {
  .preview-image {
    width: 18rem;
  }
}
</style>
