/** 匯出忽略名單的文字內容，沿用原本格式:以逗號分隔，沒有資料時輸出固定文字 */
export function toIgnoreListText(ignoreList: string[]) {
  return ignoreList.length ? ignoreList.join(',') : 'No ignored users.'
}

/** 把逗號分隔的文字轉成忽略名單(去除空白與空項目) */
export function parseIgnoreList(text: string) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
