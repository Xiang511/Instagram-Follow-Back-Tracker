/**
 * Instagram 匯出的 ZIP 上傳:讀取檔案、自動解壓縮並取出 followers / following，成功後呼叫 onLoad
 * 回傳的 fileInput 要綁在 <input type="file" ref="fileInput">
 */
export function useZipUpload(onLoad: (data: ReturnType<typeof extractFollowData>) => void) {
  const fileInput = ref<HTMLInputElement | null>(null)
  const fileName = ref('')
  const error = ref('')
  // 解壓縮與解析期間顯示讀取中
  const loading = ref(false)

  // 清空檔案輸入欄位
  function reset() {
    if (fileInput.value) fileInput.value.value = ''
    fileName.value = ''
  }

  async function onChange() {
    const file = fileInput.value?.files?.[0]
    error.value = ''

    if (!file) {
      reset()
      error.value = '看來你在選擇檔案過程中出現問題，請重新嘗試'
      return
    }

    loading.value = true
    try {
      const data = extractFollowData(new Uint8Array(await file.arrayBuffer()))
      fileName.value = file.name
      onLoad(data)
    } catch (e) {
      console.error('解壓縮失敗:', e)
      reset()
      error.value = e instanceof Error ? e.message : '無法讀取這個壓縮檔'
    } finally {
      loading.value = false
    }
  }

  return { fileInput, fileName, error, loading, reset, onChange }
}
