<script setup lang="ts">
// 對應原本 router 的 /instagram 路由,layout 名稱為檔名 BaseLayout 的 kebab-case
definePageMeta({ layout: 'base-layout' })

// 取代原本 route meta 的 title,並設定頁面 SEO 與社群分享(Open Graph)資訊
const description =
  '此方法利用 Instagram 的「下載您的資料」功能來取得 你的粉絲 和 你追蹤的人 的檔案。透過比較兩個檔案，您可以發現那些沒有回追你的人。'

useSeoMeta({
  title: 'Instagram | Meta粉絲追蹤-網頁版',
  description,
  ogTitle: 'IG粉絲追蹤-網頁版',
  ogDescription: "Find who's not following you back on Instagram",
  ogImage: '/img/banner.png',
})

const repo = 'Xiang511/Instagram-Follow-Back-Tracker'
const badges = [
  `https://img.shields.io/github/last-commit/${repo}?display_timestamp=committer&style=flat-square`,
  `https://img.shields.io/github/created-at/${repo}?style=flat-square`,
  `https://img.shields.io/github/license/${repo}?style=flat-square`,
  'https://img.shields.io/badge/build-Github--Page-green?style=flat-square&logo=Github%20Page&color=%23FE7D37',
  `https://img.shields.io/github/stars/${repo}?style=flat-square`,
]

// 常見問題,每一組為 title + detail
const faqs = [
  {
    title: '請問我被追蹤人數太多，生成兩個檔案，該怎麼比對呢',
    detail: '請先前往這裡合併你的檔案之後再上傳即可',
  },
  {
    title: '請問點完日期跟格式 建立檔案過一小時都沒下載好沒收到mail是正常的嗎？',
    detail: '正常，有時候meta處理得比較慢',
  },
  {
    title: '執行後的結果有錯',
    detail:
      '請使用最新的檔案，交叉使用舊檔案會導致結果出錯\n資料範圍請選擇所有時間，選擇其他時間會導致錯誤',
  },
  {
    title: '已刪除帳號會出現在列表中',
    detail: '這部分可以使用 忽略名單功能 解決',
  },
]

// 比對結果,沿用原本 main.js 的變數名稱
const result = ref<FollowUser[]>([])
const followerValueslength = ref(0)
const followingValueslength = ref(0)
const searched = ref(false)

// FileManagement 比對完成後 emit 過來,再透過 prop 傳給 DataTable
function onSearch(payload: SearchPayload) {
  result.value = payload.result
  followerValueslength.value = payload.followerValueslength
  followingValueslength.value = payload.followingValueslength
  searched.value = true
}

// 清空後隱藏結果表格
function onClear() {
  result.value = []
  followerValueslength.value = 0
  followingValueslength.value = 0
  searched.value = false
}
</script>

<template>
  <div>
    <BaseCard>
      <BaseSection title="Instagram-Follow-Back-Tracker">
        <div class="mb-4 flex flex-wrap gap-1">
          <img v-for="src in badges" :key="src" :src="src" alt="badge" />
        </div>
        <p class="mb-4">
          此方法利用 Instagram
          的「下載您的資料」功能來取得追蹤者及追蹤者清單檔案。透過比較兩個檔案，您可以發現那些沒有回追你的人
        </p>
        <p>
          只需要
          <code>JSON</code>
          文件，不需要任何授權或認證
          <a target="_blank" href="https://youtu.be/0XyRyZL3BO4?si=CVc7xN1tdGbtrgeK">觀看示範</a>
        </p>
      </BaseSection>

      <BaseSection title="功能">
        <ul class="ml-4 leading-[1.8em]">
          <li>
            <input type="checkbox" checked disabled />
            查看在 Instagram 上誰沒有回追你
          </li>
          <li>
            <input type="checkbox" checked disabled />
            自訂義
            <code>標籤</code>
            以便於管理追蹤者
          </li>
          <li>
            <input type="checkbox" checked disabled />
            自訂義
            <code>忽略名單</code>
            以便於管理追蹤者
          </li>
        </ul>
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

      <BaseSection title="資料隱私政策">
        <p>我們不會保留任何使用者相關資訊，僅提供搜尋功能</p>
      </BaseSection>

      <BaseSection title="錯誤回報 & 使用回饋">
        <p>
          歡迎前往 GitHub 提交
          <a target="_blank" :href="`https://github.com/${repo}/issues`">Issues</a>
        </p>
      </BaseSection>

      <BaseSection title="GitHub">
        <p>
          歡迎前往
          <a target="_blank" href="https://github.com/Xiang511">GitHub</a>
          查看我其他專案
        </p>
      </BaseSection>

      <BaseSection title="FAQ">
        <BaseAccordion :items="faqs" />
      </BaseSection>
    </BaseCard>

    <BaseCard id="mainform">
      <BaseSection title="上傳你的 JSON 檔案">
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
          <DataTable :result="result" />
        </template>
        <p v-else class="opacity-60">上傳兩個檔案並按下「開始搜尋」後顯示結果</p>
      </BaseSection>
    </BaseCard>

    <BaseGiscus />
  </div>
</template>
