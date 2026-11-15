const STORAGE_KEY = 'ig_ignore_data'

/**
 * 忽略名單，沿用原本 main.js 的 ignoreList / isIgnored / toggleIgnore
 * 狀態以 useState 共用，DataTable 與 FileManagement 看到的是同一份
 * 儲存格式與原本相同:{ ignore: string[], tags: Record<string, string> }
 */
export function useIgnore() {
  const ignoreList = useState<string[]>('ignoreList', () => [])
  // 標籤:{ username: tag }
  const tagMap = useState<Record<string, string>>('tagMap', () => ({}))
  const loaded = useState('ignoreLoaded', () => false)

  // 只在瀏覽器端讀取一次
  function loadIgnoreData() {
    if (loaded.value) return
    loaded.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const obj = JSON.parse(raw)
        ignoreList.value = obj.ignore || []
        tagMap.value = obj.tags || {}
      }
    } catch (e) {
      console.error('loadIgnoreData error', e)
      ignoreList.value = []
      tagMap.value = {}
    }
  }

  function saveIgnoreData() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ignore: ignoreList.value, tags: tagMap.value }),
      )
    } catch (e) {
      console.error('saveIgnoreData error', e)
    }
  }

  onMounted(loadIgnoreData)

  const isIgnored = (username: string) => ignoreList.value.includes(username)

  /** 新增 / 移除忽略 */
  function toggleIgnore(username: string) {
    ignoreList.value = isIgnored(username)
      ? ignoreList.value.filter((u) => u !== username)
      : [...ignoreList.value, username]
    saveIgnoreData()
  }

  /** 直接取代整份忽略名單(管理忽略名單) */
  function setIgnoreList(list: string[]) {
    ignoreList.value = list
    saveIgnoreData()
  }

  /** 直接取代整份標籤(管理標籤) */
  function setTags(tags: Record<string, string>) {
    tagMap.value = tags
    saveIgnoreData()
  }

  const getTag = (username: string) => tagMap.value[username] ?? ''

  /** 新增 / 編輯標籤;留空代表移除(與原本 setTag 一致) */
  function setTag(username: string, tag: string) {
    const text = tag.trim()
    // 先排除該使用者，有內容再加回去，避免直接 delete 動態 key
    const rest = Object.fromEntries(
      Object.entries(tagMap.value).filter(([key]) => key !== username),
    )
    tagMap.value = text === '' ? rest : { ...rest, [username]: text }
    saveIgnoreData()
  }

  /** 刪除標籤 */
  function removeTag(username: string) {
    setTag(username, '')
  }

  /** 下載忽略名單與標籤(JSON，格式同瀏覽器儲存的資料)，檔名沿用 ignore_list.json */
  function exportIgnoreListJSON(filename = 'ignore_list.json') {
    const text = toIgnoreDataJSON({ ignore: ignoreList.value, tags: tagMap.value })
    downloadBlob(new Blob([text], { type: 'application/json' }), filename)
  }

  /** 把匯入的忽略名單與標籤併進現有資料(不覆蓋)，回傳新增的數量 */
  function importIgnoreData(incoming: IgnoreData) {
    const { data, addedIgnore, addedTags } = mergeIgnoreData(
      { ignore: ignoreList.value, tags: tagMap.value },
      incoming,
    )
    ignoreList.value = data.ignore
    tagMap.value = data.tags
    saveIgnoreData()
    return { addedIgnore, addedTags, total: data.ignore.length }
  }

  return {
    ignoreList,
    tagMap,
    isIgnored,
    toggleIgnore,
    setIgnoreList,
    setTags,
    getTag,
    setTag,
    removeTag,
    exportIgnoreListJSON,
    importIgnoreData,
  }
}
