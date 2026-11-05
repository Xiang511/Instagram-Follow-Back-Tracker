// 欄位:value、href、date、tag
// 與匯出 JSON 的差異:JSON 的 timestamp 是 Unix 秒數,CSV 改成 date(yyyy-MM-dd),Excel 會自動辨識成日期
const CSV_HEADER = ['value', 'href', 'date', 'tag']

// 這些開頭的字串在 Excel 會被當成公式執行(例如標籤填 =SUM(...)),前面補單引號避免
const FORMULA_PREFIX = /^[=+\-@\t\r]/

/** Unix 秒數轉成本地時區的 yyyy-MM-dd,例如 2023-11-15 */
export function formatYMD(timestamp: number) {
  const d = new Date(timestamp * 1000)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function escapeCell(value: string | number) {
  let text = String(value)
  if (FORMULA_PREFIX.test(text)) text = `'${text}`
  // 含逗號、雙引號或換行時要用雙引號包起來,內部的雙引號重複一次
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** 產生匯出的 CSV 文字,每筆為 value、href、date(yyyy-MM-dd)、tag;沒有標籤時 tag 為空字串 */
export function toExportCSV(data: FollowUser[], tagMap: Record<string, string> = {}) {
  const rows = data.map((d) => [d.value, d.href, formatYMD(d.timestamp), tagMap[d.value] || ''])
  return [CSV_HEADER, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')
}

/** 下載比對結果的 CSV;開頭加 BOM,Excel 才不會把中文標籤開成亂碼 */
export function exportToCSV(
  data: FollowUser[],
  tagMap: Record<string, string> = {},
  filename = 'filtered_following.csv',
) {
  const blob = new Blob(['﻿', toExportCSV(data, tagMap)], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, filename)
}
