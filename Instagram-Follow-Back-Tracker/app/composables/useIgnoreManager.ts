import type { ShowNotice } from './useNotice'

/** 忽略名單與標籤的操作:管理視窗、匯入;資料本身仍由 useIgnore 管 */
export function useIgnoreManager(showNotice: ShowNotice) {
  const { ignoreList, tagMap, setIgnoreList, setTags, exportIgnoreListJSON, importIgnoreData } =
    useIgnore()

  // 管理忽略名單:以逗號分隔的文字編輯，有格式錯誤時不能儲存
  const manageOpen = ref(false)
  const ignoreText = ref('')
  const ignoreErrors = computed(() => ignoreTextErrors(ignoreText.value))

  function openManage() {
    ignoreText.value = ignoreList.value.join(',')
    manageOpen.value = true
  }

  function saveManage() {
    if (ignoreErrors.value.length > 0) return
    setIgnoreList(parseIgnoreList(ignoreText.value))
    manageOpen.value = false
  }

  // 管理標籤:每行「username,標籤」，刪掉某一行就是移除那個人的標籤
  const tagsOpen = ref(false)
  const tagsText = ref('')
  const parsedTags = computed(() => parseTagsText(tagsText.value))

  function openTags() {
    tagsText.value = tagsToText(tagMap.value)
    tagsOpen.value = true
  }

  function saveTags() {
    if (parsedTags.value.errors.length > 0) return
    setTags(parsedTags.value.tags)
    tagsOpen.value = false
  }

  // 匯入忽略名單與標籤:選擇本站匯出的 ignore_list.json(舊版匯出的逗號分隔文字也可以)，
  // 併入現有資料(不會覆蓋，要整份取代忽略名單請用「管理忽略名單」)
  const importInput = ref<HTMLInputElement | null>(null)

  async function onImportIgnore() {
    const input = importInput.value
    const file = input?.files?.[0]
    if (!input || !file) return

    try {
      const incoming = parseIgnoreFile(await file.text())
      if (incoming === null) {
        showNotice('error', '無法讀取這個檔案，請選擇本站匯出的忽略名單')
      } else if (incoming.ignore.length === 0 && Object.keys(incoming.tags).length === 0) {
        showNotice('error', '這個檔案裡沒有忽略名單或標籤')
      } else {
        const { addedIgnore, addedTags, total } = importIgnoreData(incoming)
        const parts = [
          addedIgnore > 0 && `${addedIgnore} 位忽略`,
          addedTags > 0 && `${addedTags} 個標籤`,
        ].filter(Boolean)
        showNotice(
          'success',
          parts.length === 0
            ? '檔案裡的內容都已經存在，沒有新增'
            : `已匯入 ${parts.join('、')}，目前忽略名單共 ${total} 位`,
        )
      }
    } catch (e) {
      console.error('匯入忽略名單失敗:', e)
      showNotice('error', '讀取檔案失敗，請重新嘗試')
    } finally {
      // 清空欄位，之後才能再選同一個檔案
      input.value = ''
    }
  }

  return {
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
  }
}
