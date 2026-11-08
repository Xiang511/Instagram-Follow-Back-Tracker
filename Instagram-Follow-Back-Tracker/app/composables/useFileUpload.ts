/**
 * 單一 JSON 檔案上傳:讀取檔案文字、解析 JSON，成功後呼叫 onLoad
 * 回傳的 fileInput 要綁在 <input type="file" ref="fileInput">
 */
export function useFileUpload(onLoad: (json: unknown) => void) {
  const fileInput = ref<HTMLInputElement | null>(null)
  const fileName = ref('')
  const error = ref('')

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

    try {
      const json = JSON.parse(await file.text())
      fileName.value = file.name
      onLoad(json)
    } catch (e) {
      console.error('解析 JSON 失敗:', e)
      reset()
      error.value = '請選擇正確的檔案，該檔案內容不是有效的 JSON 格式'
    }
  }

  return { fileInput, fileName, error, reset, onChange }
}
