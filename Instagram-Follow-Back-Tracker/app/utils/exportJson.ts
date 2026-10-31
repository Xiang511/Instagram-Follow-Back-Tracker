/**
 * 產生匯出的 JSON 文字,格式與原本 main.js 的 exportToJSON 一致:
 * 每筆為 { value, href, timestamp, tag },縮排 2 格
 * (標籤功能尚未搬移,tag 先固定為空字串)
 */
export function toExportJSON(data: FollowUser[]) {
  const enriched = data.map((d) => ({ ...d, tag: '' }))
  return JSON.stringify(enriched, null, 2)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** 下載比對結果,預設檔名沿用 filtered_following.json */
export function exportToJSON(data: FollowUser[], filename = 'filtered_following.json') {
  const blob = new Blob([toExportJSON(data)], { type: 'application/json' })
  downloadBlob(blob, filename)
}
