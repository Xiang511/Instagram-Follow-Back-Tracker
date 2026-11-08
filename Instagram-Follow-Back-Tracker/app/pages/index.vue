<script setup lang="ts">
import { ChevronRight, Sparkles } from '@lucide/vue'

definePageMeta({ layout: 'base-layout' })

useSeoMeta({
  title: 'Meta粉絲追蹤-網頁版',
  description: '找出 Instagram 上誰沒有回追你。檔案只在瀏覽器內處理,不用登入、不用授權。',
  ogTitle: 'IG粉絲追蹤-網頁版',
  ogDescription: "Find who's not following you back on Instagram",
  ogImage: '/img/banner.png',
})

// 隱私承諾:每一項都是目前程式實際的行為
const promises = [
  {
    title: '檔案不離開你的瀏覽器',
    detail: '比對、解壓縮與匯出全在你的裝置上完成,沒有任何檔案會上傳到伺服器。',
  },
  {
    title: '不用登入、不用授權',
    detail: '不索取 Instagram 帳號、密碼或任何權限,只需要你從 Instagram 下載的資料。',
  },
  {
    title: '不保留你的資訊',
    detail: '標籤、忽略名單與重點關注只存在你自己的瀏覽器裡,清除瀏覽器資料就會消失。',
  },
]

// 功能介紹:名稱 + 一句說明;isNew 為 true 的項目會顯示「新功能」標籤,新功能上線一陣子後把它拿掉
const features: { name: string; detail: string; isNew?: boolean }[] = [
  { name: '找出沒回追你的人', detail: '上傳追蹤者與追蹤中名單,立刻看到誰沒有回追。' },
  {
    name: '支援 JSON 與 ZIP',
    detail: '直接丟整份 ZIP 也可以,網站會自動解壓縮。',
    isNew: true,
  },
  { name: '標籤', detail: '替追蹤者加上標籤,方便分類與管理。' },
  { name: '忽略名單', detail: '已刪除或不想看到的帳號,加入忽略就不會再出現。' },
  { name: '重點關注', detail: '指定幾個人,每次搜尋都優先確認他們有沒有回追。', isNew: true },
  { name: '匯出 CSV', detail: '把比對結果下載成檔案,拿去整理或保存。', isNew: true },
]

// 虛擬碼的語法上色:顏色用 daisyUI 的狀態色,在淺色、Winter、Lofi、night 的深色底上都看得清楚
// 註解用 neutral-content 淡化(底色是 neutral,不能用 base-content)
const tokenClass: Record<TokenType, string> = {
  plain: '',
  comment: 'text-neutral-content/60',
  keyword: 'text-warning',
  func: 'text-info',
  string: 'text-success',
  // 變數:VS Code Dark+ 的變數淺藍(#9CDCFE);程式碼區塊永遠是深色底,所以固定色碼
  variable: 'text-[#9cdcfe]',
}

// 比對過程的虛擬碼,對應 utils/follow.ts 的 getNotFollowingBack
const pseudocode = [
  '# 比對過程(都在你的瀏覽器裡執行)',
  'followers = 讀取(followers.json)',
  'following = 讀取(following.json)',
  '',
  '名單 = 集合(followers 的帳號)',
  '結果 = []',
  '',
  'FOR EACH 人 IN following:',
  '    IF 人.帳號 不在 名單:',
  '        結果.加入(人)',
]
</script>

<template>
  <div class="mx-auto mt-4 max-w-[1200px]">
    <!-- 首頁抬頭:上方一列放導覽,下方兩欄,左邊標題與按鈕,右邊是比對過程的虛擬碼 -->
    <header class="px-1 pt-2 pb-10 md:pt-4 md:pb-12">
      <!-- 頂列:左邊是網站名稱,右邊是導覽,像 GitHub 倉庫頁的頂端 -->
      <div class="relative flex items-center justify-between gap-3">
        <NuxtLink to="/" class="text-base-content min-w-0 truncate no-underline">
          Instagram-Follow-Back-Tracker
        </NuxtLink>
        <AppNav class="shrink-0" />
      </div>
      <div class="relative mt-4 grid items-center gap-8 md:mt-6 md:grid-cols-2 md:gap-12">
        <div class="min-w-0">
          <!-- 標語分兩層:前半句是條件(小、淡),後半句是結果(大、主色文字),靠大小與明暗拉出層次 -->
          <h1 class="font-medium">
            <span class="text-base-content/70 block text-xl leading-[1.5] md:text-2xl">
              不用登入
            </span>
            <span
              class="mt-3 block text-4xl leading-[1.2] text-balance md:mt-4 md:text-4xl xl:text-5xl">
              也能知道誰沒回追你
            </span>
          </h1>
          <p class="text-base-content/80 mt-7 max-w-[34rem] text-lg leading-[1.8em]">
            上傳你從 Instagram 下載的追蹤者資料，比對全在瀏覽器裡完成
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-3">
            <NuxtLink to="/instagram" class="btn btn-primary btn-lg font-normal no-underline">
              開始使用
            </NuxtLink>
            <a href="#privacy" class="btn btn-ghost btn-lg font-normal no-underline">
              資料隱私政策
            </a>
          </div>
        </div>

        <!-- 比對過程:daisyUI 的 mockup-code;全域 code 樣式會加底色與內距,這裡清掉 -->
        <div
          class="mockup-code min-w-0 text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit"
          role="img"
          aria-label="比對過程的虛擬碼">
          <pre
            v-for="(line, i) in pseudocode"
            :key="i"
            :data-prefix="
              i + 1
            "><code><span v-for="(token, j) in tokenize(line)" :key="j" :class="tokenClass[token.type]">{{ token.text }}</span></code></pre>
        </div>
      </div>
    </header>

    <BaseCard>
      <BaseSection title="功能介紹">
        <!-- 標題列右邊的「更多內容」連到功能詳細頁;頁面還沒做,先是假連結(不跳轉),做好後把 href 換成 to -->
        <template #actions>
          <a
            href="#"
            class="text-base-content/70 hover:text-base-content inline-flex items-center gap-0.5 text-base no-underline"
            title="詳細資料頁面尚未完成"
            @click.prevent>
            更多內容
            <ChevronRight class="size-4" />
          </a>
        </template>
        <dl class="grid gap-x-10 md:grid-cols-2">
          <div v-for="item in features" :key="item.name" class="border-base-300 border-b py-3">
            <dt class="text-base-content flex items-center gap-2 text-lg">
              {{ item.name }}
              <!-- 綠色字直接用 success 在白底上對比太低,混入 40% 的內文色加深;外框維持原本的綠色 -->
              <span
                v-if="item.isNew"
                class="badge badge-success badge-outline border-success badge-sm font-normal text-[color-mix(in_oklab,var(--color-success),var(--color-base-content)_40%)]">
                <Sparkles class="size-3" />
                最近更新
              </span>
            </dt>
            <dd class="text-base-content/70 mt-1">{{ item.detail }}</dd>
          </div>
        </dl>
      </BaseSection>
    </BaseCard>

    <BaseCard id="privacy" class="scroll-mt-4">
      <BaseSection title="資料隱私政策">
        <template #actions>
          <NuxtLink
            to="/privacy"
            class="text-base-content/70 hover:text-base-content inline-flex items-center gap-0.5 text-base no-underline">
            完整政策
            <ChevronRight class="size-4" />
          </NuxtLink>
        </template>
        <ul class="list">
          <li v-for="item in promises" :key="item.title" class="list-row px-0 py-3">
            <div>
              <p class="text-base-content text-lg">{{ item.title }}</p>
              <p class="text-base-content/70 mt-1">{{ item.detail }}</p>
            </div>
          </li>
        </ul>
      </BaseSection>
    </BaseCard>
    <BaseCard>
      <SiteInfo />
    </BaseCard>
  </div>
</template>
