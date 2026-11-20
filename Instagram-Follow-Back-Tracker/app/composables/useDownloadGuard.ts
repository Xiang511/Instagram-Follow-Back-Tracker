import type { ShowNotice } from './useNotice'

const DOWNLOAD_LOCK_MS = 3000

/** 防重複下載:同一個檔案下載後鎖定一小段時間，期間再點會被擋下並提醒 */
export function useDownloadGuard(showNotice: ShowNotice) {
  const locks = new Set<string>()

  function download(key: string, label: string, action: () => void) {
    // 把焦點移走，daisyUI 的 dropdown 就會收起
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (locks.has(key)) {
      showNotice('warning', `${label}下載中..，請稍候幾秒再試`)
      return
    }
    locks.add(key)
    setTimeout(() => locks.delete(key), DOWNLOAD_LOCK_MS)
    action()
  }

  return { download }
}
