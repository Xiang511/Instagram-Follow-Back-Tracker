<script setup lang="ts">
// 對應原本 router 的 /instagram 路由，layout 名稱為檔名 BaseLayout 的 kebab-case
definePageMeta({ layout: 'base-layout' })

// 取代原本 route meta 的 title，並設定頁面 SEO 與社群分享(Open Graph)資訊
const description =
  '此方法利用 Instagram 的「下載您的資料」功能來取得 你的粉絲 和 你追蹤的人 的檔案。透過比較兩個檔案，您可以發現那些沒有回追你的人。'

useSeoMeta({
  title: 'Instagram | Meta粉絲追蹤-網頁版',
  description,
  ogTitle: 'IG粉絲追蹤-網頁版',
  ogDescription: "Find who's not following you back on Instagram",
  ogImage: '/img/banner.png',
})

// 比對結果，沿用原本 main.js 的變數名稱
const result = ref<FollowUser[]>([])
const followingValues = ref<FollowUser[]>([])
const followerValueslength = ref(0)
const followingValueslength = ref(0)
const searched = ref(false)

// FileManagement 比對完成後 emit 過來，再透過 prop 傳給 DataTable
function onSearch(payload: SearchPayload) {
  result.value = payload.result
  followingValues.value = payload.followingValues
  followerValueslength.value = payload.followerValueslength
  followingValueslength.value = payload.followingValueslength
  searched.value = true
}

// 清空後隱藏結果表格
function onClear() {
  result.value = []
  followingValues.value = []
  followerValueslength.value = 0
  followingValueslength.value = 0
  searched.value = false
}
</script>

<template>
  <div>
    <BaseCard>
      <BaseSection title="Instagram-Follow-Back-Tracker">
        <!-- 標題列右側放主題切換與 GitHub 連結 -->
        <template #actions>
          <AppNav />
        </template>
        <div class="mb-4 flex flex-wrap gap-1">
          <img v-for="src in badges" :key="src" :src="src" alt="badge" />
        </div>
      </BaseSection>

      <BaseSection title="如何使用">
        <div class="flex flex-col gap-3">
          <p>
            1. 前往帳戶管理中心並找到
            <a target="_blank" href="https://accountscenter.instagram.com/info_and_permissions/">
              您的資訊和隱私
            </a>
            頁面
          </p>
          <p>
            2. 點選「下載資訊」> 選擇部分資訊 > "只"選取
            <code>追蹤者及追蹤者清單</code>
            > 選擇資料範圍:
            <code>所有時間</code>
            > 選擇格式:
            <code>JSON</code>
          </p>
          <p>3. 收到下載完成電子郵件後，按一下連結下載 ZIP 檔案</p>
          <p>
            4. 解壓縮檔案並找到
            <code>followers.json</code>
            和
            <code>following.json</code>
            兩個檔案，並且上傳至網站
          </p>
        </div>
      </BaseSection>
    </BaseCard>

    <BaseCard id="mainform">
      <BaseSection title="上傳你的檔案">
        <FileManagement @search="onSearch" @clear="onClear" />
      </BaseSection>
    </BaseCard>

    <BaseCard>
      <BaseSection title="結果">
        <template v-if="searched">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p>
              共 {{ followerValueslength }} 位沒有回追你( 你追蹤了 {{ followingValueslength }} 人 )
            </p>
          </div>
          <DataTable :result="result" :following="followingValues" />
        </template>
        <p v-else class="opacity-60">上傳兩個檔案並按下「開始搜尋」後顯示結果</p>
      </BaseSection>
    </BaseCard>
  </div>
</template>
