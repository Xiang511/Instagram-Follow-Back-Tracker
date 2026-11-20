<script setup lang="ts">
import {
  CircleAlert,
  CircleCheck,
  Ellipsis,
  FileDown,
  FileJson,
  FileSpreadsheet,
  FileUp,
  Tags,
  Trash2,
  TriangleAlert,
  UserRoundX,
} from '@lucide/vue'

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

// 通知與下載防重複
const { notice, showNotice } = useNotice()
const { download } = useDownloadGuard(showNotice)

// 忽略名單、標籤與重點關注的操作(資料本身由 useIgnore / useWatchlist 管)
const {
  manageOpen,
  ignoreText,
  ignoreErrors,
  openManage,
  saveManage,
  tagsOpen,
  tagsText,
  parsedTags,
  openTags,
  saveTags,
  importInput,
  onImportIgnore,
  exportIgnoreListJSON,
} = useIgnoreManager(showNotice)
const { watchInput, onImportWatchlist, exportWatchlistJSON } = useWatchlistTransfer(showNotice)

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

    <!-- 故障排除只是說明頁，不需要操作按鈕 -->
    <div v-show="tab !== 'help'" class="flex flex-wrap items-center gap-2">
      <button class="btn btn-outline btn-primary font-normal" @click="onSearch">開始搜尋</button>
      <!-- 清空會刪掉已載入的資料與結果，是破壞性操作，所以留在選單外面，名稱與紅色一眼可見 -->
      <button class="btn btn-outline btn-error font-normal" :disabled="!hasData" @click="onClear">
        <Trash2 class="size-4" />
        全部清空
      </button>

      <!-- 其餘操作收進「更多」選單:下載、忽略名單、清空;daisyUI dropdown 靠 focus 開啟 -->
      <div class="dropdown group">
        <div
          tabindex="0"
          role="button"
          class="btn btn-outline btn-square font-normal"
          aria-label="更多操作"
          title="更多操作">
          <Ellipsis />
        </div>
        <!-- 手機:選單開啟時蓋住畫面，點空白處（焦點離開）即關閉 -->
        <div
          class="fixed inset-0 z-20 hidden bg-black/40 group-focus-within:max-sm:block"
          aria-hidden="true"></div>
        <ul
          tabindex="0"
          class="menu dropdown-content rounded-box bg-base-100 border-base-300 z-30 mt-2 w-56 border shadow-sm max-sm:fixed! max-sm:top-1/2! max-sm:left-1/2! max-sm:mt-0 max-sm:w-72 max-sm:max-w-[calc(100vw-2rem)] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2">
          <!-- 搜尋過才有結果可以下載 -->
          <li :class="{ 'menu-disabled': noResult }">
            <button
              type="button"
              class="font-normal"
              :disabled="noResult"
              @click="download('json', 'JSON 檔案', exportJSON)">
              <FileJson class="size-4" />
              下載 JSON
            </button>
          </li>
          <li :class="{ 'menu-disabled': noResult }">
            <button
              type="button"
              class="font-normal"
              :disabled="noResult"
              @click="download('csv', 'CSV 檔案', exportCSV)">
              <FileSpreadsheet class="size-4" />
              下載 CSV
            </button>
          </li>
          <li role="separator" class="border-base-300 my-1 border-t"></li>
          <li>
            <button
              type="button"
              class="font-normal"
              @click="download('ignore', '忽略名單與標籤', exportIgnoreListJSON)">
              <FileDown class="size-4" />
              匯出忽略名單與標籤
            </button>
          </li>
          <li>
            <button type="button" class="font-normal" @click="run(() => importInput?.click())">
              <FileUp class="size-4" />
              匯入忽略名單與標籤
            </button>
          </li>
          <li role="separator" class="border-base-300 my-1 border-t"></li>
          <li>
            <button
              type="button"
              class="font-normal"
              @click="download('watchlist', '重點關注名單', exportWatchlistJSON)">
              <FileDown class="size-4" />
              匯出重點關注
            </button>
          </li>
          <li>
            <button type="button" class="font-normal" @click="run(() => watchInput?.click())">
              <FileUp class="size-4" />
              匯入重點關注
            </button>
          </li>
          <li role="separator" class="border-base-300 my-1 border-t"></li>
          <li>
            <button type="button" class="font-normal" @click="run(openManage)">
              <UserRoundX class="size-4" />
              管理忽略名單
            </button>
          </li>
          <li>
            <button type="button" class="font-normal" @click="run(openTags)">
              <Tags class="size-4" />
              管理標籤
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- 匯入忽略名單用的隱藏檔案欄位，由選單項目觸發 -->
    <input
      ref="importInput"
      type="file"
      accept=".json,.txt,application/json,text/plain"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onImportIgnore" />
    <!-- 匯入重點關注用的隱藏檔案欄位 -->
    <input
      ref="watchInput"
      type="file"
      accept=".json,.txt,application/json,text/plain"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onImportWatchlist" />

    <!-- 匯入結果提示(daisyUI toast):底色文字吃 base，成功 / 失敗只用框線與圖示的主題色區分 -->
    <Teleport to="body">
      <div v-if="notice" class="toast toast-top toast-center z-50">
        <div
          role="status"
          class="alert bg-base-100 text-base-content border shadow-md"
          :class="{
            'border-success': notice.type === 'success',
            'border-error': notice.type === 'error',
            'border-warning': notice.type === 'warning',
          }">
          <CircleCheck v-if="notice.type === 'success'" class="text-success size-5" />
          <TriangleAlert v-else-if="notice.type === 'warning'" class="text-warning size-5" />
          <CircleAlert v-else class="text-error size-5" />
          <span>{{ notice.text }}</span>
        </div>
      </div>
    </Teleport>

    <BaseModal v-model="manageOpen" title="管理忽略名單">
      <IrreversibleWarning />
      <p class="mb-2 opacity-70">請以逗號分隔編輯忽略名單(username1,username2)</p>
      <textarea
        v-model="ignoreText"
        class="textarea w-full"
        :class="{ 'textarea-error': ignoreErrors.length > 0 }"
        :aria-invalid="ignoreErrors.length > 0"
        rows="5"></textarea>
      <FormatError :errors="ignoreErrors" />
      <template #actions>
        <button
          class="btn btn-primary font-normal"
          :disabled="ignoreErrors.length > 0"
          @click="saveManage">
          儲存
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="tagsOpen" title="管理標籤">
      <IrreversibleWarning />
      <p class="mb-2 opacity-70">每行一筆，格式為 username,標籤。刪掉某一行就會移除那個人的標籤</p>
      <textarea
        v-model="tagsText"
        class="textarea w-full"
        :class="{ 'textarea-error': parsedTags.errors.length > 0 }"
        :aria-invalid="parsedTags.errors.length > 0"
        rows="8"
        placeholder="username,標籤"
        spellcheck="false"></textarea>
      <FormatError :errors="parsedTags.errors" />
      <template #actions>
        <button
          class="btn btn-primary font-normal"
          :disabled="parsedTags.errors.length > 0"
          @click="saveTags">
          儲存
        </button>
      </template>
    </BaseModal>
  </div>
</template>
