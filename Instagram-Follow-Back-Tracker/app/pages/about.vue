<script setup lang="ts">
definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: '關於本站 | Meta粉絲追蹤-網頁版',
  description: '了解這個網站的用途、專案資訊與網站統計。',
})
</script>

<template>
  <div>
    <BaseCard>
      <BaseSection title="關於本站">
        <template #actions>
          <AppNav />
        </template>
        <div class="mb-4 flex flex-wrap gap-1">
          <img v-for="src in badges" :key="src" :src="src" alt="badge" />
        </div>
        <p class="mb-4">
          這是一個協助你找出「誰沒有回追你」的 Instagram 工具。利用 Instagram
          的「下載您的資料」功能取得追蹤者及追蹤者清單檔案,透過比較兩個檔案,就能發現那些沒有回追你的人。
        </p>
        <p>
          只需要
          <code>JSON</code>
          文件,不需要任何授權或認證,也不會保留任何使用者相關資訊。
          <NuxtLink to="/instagram">前往使用</NuxtLink>
        </p>
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <BaseSection title="專案資訊">
        <GithubCard />
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <SiteInfo />
    </BaseCard>
  </div>
</template>
