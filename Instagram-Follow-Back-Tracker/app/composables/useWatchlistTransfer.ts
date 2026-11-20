import type { ShowNotice } from './useNotice'

/** 重點關注名單的匯入:選擇本站匯出的 watchlist.json(也接受逗號 / 換行分隔的文字)，併入現有名單 */
export function useWatchlistTransfer(showNotice: ShowNotice) {
  const { exportWatchlistJSON, importWatchlist } = useWatchlist()

  const watchInput = ref<HTMLInputElement | null>(null)

  async function onImportWatchlist() {
    const input = watchInput.value
    const file = input?.files?.[0]
    if (!input || !file) return

    try {
      const parsed = parseWatchlistFile(await file.text())
      if (parsed === null) {
        showNotice('error', '無法讀取這個檔案，請選擇本站匯出的重點關注名單')
      } else if (parsed.watchlist.length === 0) {
        showNotice(
          'error',
          parsed.skipped > 0
            ? `檔案裡的 ${parsed.skipped} 個項目都不是有效的 username`
            : '這個檔案裡沒有重點關注名單',
        )
      } else {
        const { added, total } = importWatchlist(parsed.watchlist)
        const skipped = parsed.skipped > 0 ? `，略過 ${parsed.skipped} 個無效的 username` : ''
        showNotice(
          'success',
          added === 0
            ? `檔案裡的人都已經在重點關注名單裡，沒有新增${skipped}`
            : `已匯入 ${added} 位，目前重點關注共 ${total} 位${skipped}`,
        )
      }
    } catch (e) {
      console.error('匯入重點關注失敗:', e)
      showNotice('error', '讀取檔案失敗，請重新嘗試')
    } finally {
      input.value = ''
    }
  }

  return { watchInput, onImportWatchlist, exportWatchlistJSON }
}
