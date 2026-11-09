<script setup lang="ts">
import { Ellipsis, FileDown, FileJson, FileSpreadsheet, Trash2, UserRoundX } from '@lucide/vue'

// 搜尋成功後把比對結果交給 view;清空時通知 view 一併清掉結果
const emit = defineEmits<{ search: [payload: SearchPayload]; clear: [] }>()

const {
  filteredFollowingValues,
  error,
  hasData,
  setFollower,
  setFollowing,
  main,
  exportJSON,
  exportCSV,
  clear,
} = useFileManagement()

const { ignoreList, setIgnoreList, exportIgnoreListJSON } = useIgnore()

// 管理忽略名單:以逗號分隔的文字編輯，對應原本的 prompt
const manageOpen = ref(false)
const ignoreText = ref('')

function openManage() {
  ignoreText.value = ignoreList.value.join(',')
  manageOpen.value = true
}

function saveManage() {
  setIgnoreList(parseIgnoreList(ignoreText.value))
  manageOpen.value = false
}

// 兩個 FileUpload 實例，沿用原本 main.js 的 fileInput / fileInput2
const fileInput = ref<{ reset: () => void } | null>(null)
const fileInput2 = ref<{ reset: () => void } | null>(null)
const zipInput = ref<{ reset: () => void } | null>(null)

// 上傳方式:分開上傳兩個 JSON，或直接上傳 Instagram 的 ZIP;help 為故障排除
const tab = ref<'json' | 'zip' | 'help'>('json')

// 檔案格式不正確時，清空對應的 file input
function onFollower(json: unknown) {
  if (!setFollower(json)) fileInput.value?.reset()
}

function onFollowing(json: unknown) {
  if (!setFollowing(json)) fileInput2.value?.reset()
}

// ZIP 解壓縮後一次取得兩份資料;任一份格式不正確就清空 ZIP 欄位
function onZip(data: { followers: unknown; following: unknown }) {
  const followerOk = setFollower(data.followers)
  const followingOk = setFollowing(data.following)
  if (!followerOk || !followingOk) zipInput.value?.reset()
}

function onSearch() {
  const payload = main()
  if (payload) emit('search', payload)
}

// 還沒有比對結果時，下載選項不能用
const noResult = computed(() => filteredFollowingValues.value.length === 0)

// 執行選單項目後收起下拉(dropdown 靠 focus 開啟，把焦點移走就會關閉)
function run(action: () => void) {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  action()
}

// 清空兩個 file input、資料與結果
function onClear() {
  fileInput.value?.reset()
  fileInput2.value?.reset()
  zipInput.value?.reset()
  clear()
  emit('clear')
}
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2">
    <!-- 兩種上傳方式用 v-show 切換，切換時已選的檔案不會被清掉 -->
    <div role="tablist" class="tabs tabs-border flex-nowrap overflow-x-auto">
      <button
        type="button"
        role="tab"
        class="tab shrink-0 font-normal whitespace-nowrap"
        :class="{ 'tab-active': tab === 'json' }"
        :aria-selected="tab === 'json'"
        @click="tab = 'json'">
        上傳 JSON
      </button>
      <button
        type="button"
        role="tab"
        class="tab shrink-0 font-normal whitespace-nowrap"
        :class="{ 'tab-active': tab === 'zip' }"
        :aria-selected="tab === 'zip'"
        @click="tab = 'zip'">
        上傳 ZIP
      </button>
      <button
        type="button"
        role="tab"
        class="tab shrink-0 font-normal whitespace-nowrap"
        :class="{ 'tab-active': tab === 'help' }"
        :aria-selected="tab === 'help'"
        @click="tab = 'help'">
        故障排除
      </button>
    </div>

    <div v-show="tab === 'json'" class="flex flex-col gap-2">
      <FileUpload ref="fileInput" label="Follower file" @upload="onFollower" />
      <FileUpload ref="fileInput2" label="Following file" @upload="onFollowing" />
    </div>
    <div v-show="tab === 'zip'">
      <ZipUpload ref="zipInput" label="Instagram ZIP" @upload="onZip" />
    </div>

    <div v-show="tab === 'help'">
      <UploadHelp />
      <!-- 沒解決的人直接去問題回報頁(/report) -->
      <p class="text-base-content/70">
        問題還是沒有解決?
        <NuxtLink to="/report">填寫表單</NuxtLink>
      </p>
    </div>

    <div v-if="error" role="alert" class="alert alert-error alert-soft">
      <span>{{ error }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button class="btn btn-outline btn-primary font-normal" @click="onSearch">開始搜尋</button>
      <!-- 清空會刪掉已載入的資料與結果，是破壞性操作，所以留在選單外面，名稱與紅色一眼可見 -->
      <button class="btn btn-outline btn-error font-normal" :disabled="!hasData" @click="onClear">
        <Trash2 class="size-4" />
        全部清空
      </button>

      <!-- 其餘操作收進「更多」選單:下載、忽略名單、清空;daisyUI dropdown 靠 focus 開啟 -->
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-outline btn-square font-normal"
          aria-label="更多操作"
          title="更多操作">
          <Ellipsis />
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content rounded-box bg-base-100 border-base-300 z-10 mt-2 w-56 border shadow-sm">
          <!-- 搜尋過才有結果可以下載 -->
          <li :class="{ 'menu-disabled': noResult }">
            <button type="button" class="font-normal" :disabled="noResult" @click="run(exportJSON)">
              <FileJson class="size-4" />
              下載 JSON
            </button>
          </li>
          <li :class="{ 'menu-disabled': noResult }">
            <button type="button" class="font-normal" :disabled="noResult" @click="run(exportCSV)">
              <FileSpreadsheet class="size-4" />
              下載 CSV
            </button>
          </li>
          <li role="separator" class="border-base-300 my-1 border-t"></li>
          <li>
            <button type="button" class="font-normal" @click="run(exportIgnoreListJSON)">
              <FileDown class="size-4" />
              匯出忽略名單
            </button>
          </li>
          <li>
            <button type="button" class="font-normal" @click="run(openManage)">
              <UserRoundX class="size-4" />
              管理忽略名單
            </button>
          </li>
        </ul>
      </div>
    </div>

    <BaseModal v-model="manageOpen" title="管理忽略名單">
      <p class="mb-2 opacity-70">請以逗號分隔編輯忽略名單(username1,username2)</p>
      <textarea v-model="ignoreText" class="textarea w-full" rows="5"></textarea>
      <template #actions>
        <button class="btn btn-primary font-normal" @click="saveManage">儲存</button>
      </template>
    </BaseModal>
  </div>
</template>
