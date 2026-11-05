<script setup lang="ts">
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

// 管理忽略名單:以逗號分隔的文字編輯,對應原本的 prompt
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

// 兩個 FileUpload 實例,沿用原本 main.js 的 fileInput / fileInput2
const fileInput = ref<{ reset: () => void } | null>(null)
const fileInput2 = ref<{ reset: () => void } | null>(null)
const zipInput = ref<{ reset: () => void } | null>(null)

// 上傳方式:分開上傳兩個 JSON,或直接上傳 Instagram 的 ZIP;help 為故障排除
const tab = ref<'json' | 'zip' | 'help'>('json')

// 檔案格式不正確時,清空對應的 file input
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
    <!-- 兩種上傳方式用 v-show 切換,切換時已選的檔案不會被清掉 -->
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
    </div>

    <div v-if="error" role="alert" class="alert alert-error alert-soft">
      <span>{{ error }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button class="btn btn-outline btn-primary font-normal" @click="onSearch">開始搜尋</button>
      <!-- 搜尋過才有結果可以下載 -->
      <button
        class="btn btn-outline font-normal"
        :disabled="filteredFollowingValues.length === 0"
        @click="exportJSON">
        下載 JSON
      </button>
      <button
        class="btn btn-outline font-normal"
        :disabled="filteredFollowingValues.length === 0"
        @click="exportCSV">
        下載 CSV
      </button>
      <button class="btn btn-outline font-normal" @click="exportIgnoreListJSON()">
        匯出忽略名單
      </button>
      <button class="btn btn-outline font-normal" @click="openManage">管理忽略名單</button>
      <button class="btn btn-outline btn-error font-normal" :disabled="!hasData" @click="onClear">
        全部清空
      </button>
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
