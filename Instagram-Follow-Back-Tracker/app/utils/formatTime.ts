const rtf = new Intl.RelativeTimeFormat('zh-TW', { numeric: 'always' })
const dtf = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// 由大到小,秒數門檻對應 Intl 的單位
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/**
 * 格式化追蹤時間
 * @param timestamp Unix 秒數
 * @param YMDCheck true 顯示 YYYY/MM/DD,false 顯示相對時間(例:3 個月前)
 * @param now 現在的 Unix 秒數,測試時可注入
 */
export function formatTime(
  timestamp: number,
  YMDCheck: boolean,
  now = Math.floor(Date.now() / 1000),
) {
  if (YMDCheck) {
    return dtf.format(timestamp * 1000)
  }

  const diff = timestamp - now
  const [unit, seconds] = units.find(([, s]) => Math.abs(diff) >= s) ?? ['second', 1]
  return rtf.format(Math.trunc(diff / seconds), unit)
}
