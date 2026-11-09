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
    <!-- 解壓縮期間的讀取提示(daisyUI toast + alert):固定在畫面上方中間，不推擠版面;
         放到 body 避免被上層容器裁切。底色與文字吃 base-100 / base-content(各主題對比都夠)，
         框線與轉圈圈吃 primary，切換主題時整個提示會自動跟著變 -->
    <Teleport to="body">
      <div v-if="loading" class="toast toast-top toast-center z-50">
        <div
          role="status"
          class="alert bg-base-100 text-base-content border-primary border shadow-md">
          <span class="loading loading-spinner loading-sm text-primary"></span>
          <span>解壓縮中，請稍候…</span>
        </div>
      </div>
    </Teleport>
    <div v-if="error" role="alert" class="alert alert-error alert-soft mt-2">
      <span>{{ error }}</span>
    </div>
  </fieldset>
</template>
