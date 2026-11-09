<script setup lang="ts">
definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: '資料隱私政策 | Meta粉絲追蹤-網頁版',
  description: '說明本站如何處理你的檔案、儲存在瀏覽器的資料，以及用到的第三方服務。',
})

const updatedAt = '2026-11-09'

// 摘要:與首頁「資料隱私政策」的三項承諾一致
const summary = [
  '你上傳的檔案只在瀏覽器內處理，不會上傳到任何伺服器。',
  '不用登入，也不索取 Instagram 帳號、密碼或任何權限。',
  '本站沒有帳號系統與資料庫，不保存你的個人資料。',
]

// 存在瀏覽器 localStorage 的資料:只在你自己的裝置上
const stored = [
  { name: '標籤與忽略名單', detail: '你加入的標籤與忽略的帳號(username)。' },
  { name: '重點關注', detail: '你指定重點關注的帳號(username)。' },
  { name: '主題', detail: '你選的外觀主題(淺色、Winter、Lofi、night)。' },
]

// 本站用到的外部服務:各自會收到瀏覽器載入資源時的一般連線資訊(例如 IP 位址、瀏覽器類型),
// 實際處理方式以各服務自己的政策為準
const services = [
  { name: 'GitHub Pages', detail: '本站的網頁託管。' },
  {
    name: 'SiteStates',
    detail: '訪客統計。用來顯示累計、今日與線上人數。',
  },
  {
    name: 'GitHub 與 shields.io',
    detail: '「關於本站」頁的專案資訊卡、預覽圖與徽章。',
  },
  {
    name: 'giscus(GitHub Discussions)',
    detail: '留言區。要登入 GitHub 才能留言，留言內容公開顯示在專案的 GitHub Discussions。',
  },
  {
    name: 'Google 表單',
    detail:
      '問題回報表單。',
  },
]
</script>

<template>
  <div class="mx-auto mt-4 max-w-[1200px]">
    <header class="px-1 pt-2 pb-8 md:pt-4 md:pb-10">
      <div class="flex items-center justify-between gap-3">
        <NuxtLink to="/" class="text-base-content min-w-0 truncate no-underline">
          Instagram-Follow-Back-Tracker
        </NuxtLink>
        <AppNav class="shrink-0" />
      </div>
      <div class="mt-4 md:mt-6">
        <h1 class="text-4xl leading-[1.2] font-medium text-balance md:text-5xl">資料隱私政策</h1>
        <p class="text-base-content/70 mt-4">最後更新:{{ updatedAt }}</p>
      </div>
    </header>

    <BaseCard>
      <BaseSection title="重點摘要">
        <ul class="list-disc space-y-1 pl-5">
          <li v-for="item in summary" :key="item">{{ item }}</li>
        </ul>
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <BaseSection title="你的檔案">
        <p>
          你從 Instagram 下載的 followers、following 檔案(JSON 或 ZIP)，從選擇檔案到比對、解壓縮、
          匯出 CSV，全部在你的瀏覽器內完成。
        </p>
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <BaseSection title="存在你瀏覽器的資料">
        <p class="mb-2">
          下列資料只存在你自己的瀏覽器(localStorage)，本站的伺服器收不到，換瀏覽器或裝置不會跟著走:
        </p>
        <ul class="list">
          <li v-for="item in stored" :key="item.name" class="list-row px-0 py-3">
            <div>
              <p class="text-base-content text-lg">{{ item.name }}</p>
              <p class="text-base-content/70 mt-1">{{ item.detail }}</p>
            </div>
          </li>
        </ul>
        <p class="mt-2">要刪除這些資料，清除瀏覽器對本站的網站資料即可。</p>
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <BaseSection title="用到的外部服務">
        <ul class="list">
          <li v-for="item in services" :key="item.name" class="list-row px-0 py-3">
            <div>
              <p class="text-base-content text-lg">{{ item.name }}</p>
              <p class="text-base-content/70 mt-1">{{ item.detail }}</p>
            </div>
          </li>
        </ul>
      </BaseSection>
    </BaseCard>

    
  </div>
</template>
