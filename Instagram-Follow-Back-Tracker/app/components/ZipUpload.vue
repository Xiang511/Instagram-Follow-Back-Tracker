<script setup lang="ts">
defineProps<{ label: string }>()

// 解壓縮成功後把 followers / following 的 JSON 交給父層處理
const emit = defineEmits<{ upload: [data: { followers: unknown; following: unknown }] }>()

const { fileInput, error, loading, onChange, reset } = useZipUpload((data) => emit('upload', data))

// 讓父層在資料格式不正確或清空時重設 file input
defineExpose({ reset })
</script>

<template>
  <fieldset class="fieldset min-w-0">
    <legend class="fieldset-legend text-lg font-normal">{{ label }}</legend>
    <input
      ref="fileInput"
      type="file"
      accept=".zip,application/zip"
      class="file-input w-full"
      :disabled="loading"
      @change="onChange" />
    <p class="label whitespace-normal">
      直接選擇 Instagram 下載的 ZIP，會自動解壓縮，不需要先解壓縮。檔案只會在你的瀏覽器內處理
    </p>
    <div v-if="loading" class="flex items-center gap-2 opacity-70">
      <span class="loading loading-spinner"></span>
      解壓縮中…
    </div>
    <div v-if="error" role="alert" class="alert alert-error alert-soft mt-2">
      <span>{{ error }}</span>
    </div>
  </fieldset>
</template>
