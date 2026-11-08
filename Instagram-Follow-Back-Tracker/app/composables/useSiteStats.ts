// 訪客統計:沿用原本的 SiteStates 腳本，首頁的「網站資訊」與頁尾共用同一份資料
// 腳本載入後會在 window 上留下 stTotalount(原站拼字如此)、stTodayCount、stOnlineCount 三個數字，
// 它原本用 document.write 輸出的內容在頁面載入後無效，所以直接讀這三個變數
const STATS_URL = 'https://SiteStates.com/show/js_text/b8cc25660e113e850df745866725c57d'

const toNumber = (value: unknown) => (typeof value === 'number' ? value : null)

export function useSiteStats() {
  // useState 讓多個元件共用同一份狀態，避免重複載入腳本
  const total = useState<number | null>('siteStats:total', () => null)
  const today = useState<number | null>('siteStats:today', () => null)
  const online = useState<number | null>('siteStats:online', () => null)
  const failed = useState('siteStats:failed', () => false)
  const started = useState('siteStats:started', () => false)

  // 只能在瀏覽器端呼叫(onMounted);重複呼叫只會載入一次
  function load() {
    if (started.value) return
    started.value = true

    const script = document.createElement('script')
    script.src = STATS_URL
    script.onload = () => {
      const stats = window as unknown as Record<string, unknown>
      total.value = toNumber(stats.stTotalount)
      today.value = toNumber(stats.stTodayCount)
      online.value = toNumber(stats.stOnlineCount)
      failed.value = total.value === null && today.value === null && online.value === null
    }
    script.onerror = () => {
      failed.value = true
    }
    document.body.appendChild(script)
  }

  return { total, today, online, failed, load }
}
