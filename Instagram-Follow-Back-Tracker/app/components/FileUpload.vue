<script setup lang="ts">
defineProps<{ label: string }>()

// 解析成功後把 JSON 交給父層處理
const emit = defineEmits<{ upload: [json: unknown] }>()

const { fileInput, error, onChange, reset } = useFileUpload((json) => emit('upload', json))

// 讓父層在檔案格式不正確時清空 file input
defineExpose({ reset })
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend text-lg font-normal">{{ label }}</legend>
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="file-input w-full"
      @change="onChange" />
    <div v-if="error" role="alert" class="alert alert-error alert-soft mt-2">
      <span>{{ error }}</span>
    </div>
  </fieldset>
</template>
