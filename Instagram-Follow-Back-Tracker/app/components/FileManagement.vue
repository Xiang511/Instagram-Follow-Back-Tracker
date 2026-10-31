<script setup lang="ts">
// 搜尋成功後把比對結果交給 view
const emit = defineEmits<{ search: [payload: SearchPayload] }>()

const { error, setFollower, setFollowing, main } = useFileManagement()

function onSearch() {
  const payload = main()
  if (payload) emit('search', payload)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <FileUpload label="Follower file" @upload="setFollower" />
    <FileUpload label="Following file" @upload="setFollowing" />

    <div v-if="error" role="alert" class="alert alert-error alert-soft">
      <span>{{ error }}</span>
    </div>

    <div>
      <button class="btn btn-outline btn-primary font-normal" @click="onSearch">開始搜尋</button>
      <!-- 搜尋過才有結果可以下載 -->
      <button
        class="btn btn-outline font-normal"
        :disabled="filteredFollowingValues.length === 0"
        @click="exportJSON">
        下載 JSON
      </button>
    </div>
  </div>
</template>
