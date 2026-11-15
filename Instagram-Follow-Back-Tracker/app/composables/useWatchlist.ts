const STORAGE_KEY = 'ig_watchlist'

/**
 * 重點關注名單:只記 username，存在 localStorage，下次開啟時自動帶回
 * 狀態以 useState 共用，DataTable 與 WatchlistTable 看到的是同一份
 */
export function useWatchlist() {
  const watchlist = useState<string[]>('watchlist', () => [])
  const loaded = useState('watchlistLoaded', () => false)

  // 只在瀏覽器端讀取一次
  function loadWatchlist() {
    if (loaded.value) return
    loaded.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list = raw ? JSON.parse(raw) : []
      watchlist.value = Array.isArray(list) ? list.filter((u) => typeof u === 'string') : []
    } catch (e) {
      console.error('loadWatchlist error', e)
      watchlist.value = []
    }
  }

  function saveWatchlist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist.value))
    } catch (e) {
      console.error('saveWatchlist error', e)
    }
  }

  onMounted(loadWatchlist)

  const isWatched = (username: string) => watchlist.value.includes(username)

  function addWatch(username: string) {
    if (isWatched(username)) return
    watchlist.value = [...watchlist.value, username]
    saveWatchlist()
  }

  function removeWatch(username: string) {
    watchlist.value = watchlist.value.filter((u) => u !== username)
    saveWatchlist()
  }

  /** 下載重點關注名單(JSON 陣列，格式同瀏覽器儲存的資料) */
  function exportWatchlistJSON(filename = 'watchlist.json') {
    downloadBlob(
      new Blob([toWatchlistJSON(watchlist.value)], { type: 'application/json' }),
      filename,
    )
  }

  /** 把匯入的名單併進現有名單(不覆蓋)，回傳新增的數量與目前總數 */
  function importWatchlist(incoming: string[]) {
    const { watchlist: merged, added } = mergeWatchlist(watchlist.value, incoming)
    watchlist.value = merged
    saveWatchlist()
    return { added, total: merged.length }
  }

  return { watchlist, isWatched, addWatch, removeWatch, exportWatchlistJSON, importWatchlist }
}
