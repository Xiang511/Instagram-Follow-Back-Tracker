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
  clear,
} = useFileManagement()

// 兩個 FileUpload 實例,沿用原本 main.js 的 fileInput / fileInput2
const fileInput = ref<{ reset: () => void } | null>(null)
const fileInput2 = ref<{ reset: () => void } | null>(null)

// 檔案格式不正確時,清空對應的 file input
function onFollower(json: unknown) {
  if (!setFollower(json)) fileInput.value?.reset()
}

function onFollowing(json: unknown) {
  if (!setFollowing(json)) fileInput2.value?.reset()
}

function onSearch() {
  const payload = main()
  if (payload) emit('search', payload)
}

// 清空兩個 file input、資料與結果
function onClear() {
  fileInput.value?.reset()
  fileInput2.value?.reset()
  clear()
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <FileUpload ref="fileInput" label="Follower file" @upload="onFollower" />
    <FileUpload ref="fileInput2" label="Following file" @upload="onFollowing" />

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
      <button class="btn btn-outline font-normal btn-error" :disabled="!hasData" @click="onClear">
        全部清空
      </button>
    </div>
  </div>
</template>
