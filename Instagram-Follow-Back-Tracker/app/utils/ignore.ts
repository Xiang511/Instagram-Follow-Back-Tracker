/** 匯出忽略名單的文字內容，沿用原本格式:以逗號分隔，沒有資料時輸出固定文字 */
export function toIgnoreListText(ignoreList: string[]) {
  return ignoreList.length ? ignoreList.join(',') : 'No ignored users.'
}

const EMPTY_TEXT = 'No ignored users.'
// UTF-8 檔案開頭的 BOM(U+FEFF)，用編碼值比對，避免在原始碼放不可見字元
const BOM = 0xfeff

// Instagram 帳號只允許英數字、底線與句點，最長 30 字
const USERNAME_PATTERN = /^[A-Za-z0-9._]{1,30}$/

/** 是不是合法的 Instagram username(編輯忽略名單與標籤時用來擋掉打錯的內容) */
export const isValidUsername = (name: string) => USERNAME_PATTERN.test(name)

/** 忽略名單與標籤:瀏覽器 localStorage(ig_ignore_data)與匯出檔共用的格式 */
export interface IgnoreData {
  ignore: string[]
  tags: Record<string, string>
}

/**
 * 匯出檔的內容:{ ignore, tags } 縮排 2 格的 JSON
 * 與瀏覽器儲存的格式相同，所以匯出檔也等於一份完整備份
 */
export function toIgnoreDataJSON(data: IgnoreData) {
  return JSON.stringify({ ignore: data.ignore, tags: data.tags }, null, 2)
}

// 標籤只收「username -> 非空字串」，其他項目忽略
function cleanTags(source: unknown): Record<string, string> {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {}
  const entries = Object.entries(source as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([name, tag]): [string, string] => [name.trim(), tag.trim()])
    .filter(([name, tag]) => name !== '' && tag !== '')
  return Object.fromEntries(entries)
}

const cleanNames = (list: string[]) => [...new Set(list.map((name) => name.trim()).filter(Boolean))]

/**
 * 解析匯入的忽略名單檔案，格式無法辨識回傳 null
 * 支援:
 * - 目前的匯出格式 { "ignore": [...], "tags": { "username": "標籤" } }(tags 可省略)
 * - 舊版匯出的逗號分隔文字(也容許換行分隔)，沒有標籤
 * - JSON 陣列 ["a", "b"]
 * 舊版在沒有資料時匯出的固定文字 "No ignored users." 視為空名單
 */
export function parseIgnoreFile(text: string): IgnoreData | null {
  // 去掉 BOM 與前後空白
  const content = (text.charCodeAt(0) === BOM ? text.slice(1) : text).trim()
  if (content === '' || content === EMPTY_TEXT) return { ignore: [], tags: {} }

  if (!content.startsWith('[') && !content.startsWith('{')) {
    return { ignore: cleanNames(content.split(/[,\r\n]+/)), tags: {} }
  }

  let json: unknown
  try {
    json = JSON.parse(content)
  } catch {
    return null
  }

  if (Array.isArray(json)) {
    return json.every((item) => typeof item === 'string')
      ? { ignore: cleanNames(json), tags: {} }
      : null
  }

  const obj = json as { ignore?: unknown; tags?: unknown } | null
  // ignore 與 tags 至少要有一個，否則不是我們的格式
  if (!obj || (obj.ignore === undefined && obj.tags === undefined)) return null
  const ignore = obj.ignore ?? []
  if (!Array.isArray(ignore) || !ignore.every((item) => typeof item === 'string')) return null
  return { ignore: cleanNames(ignore), tags: cleanTags(obj.tags) }
}

/**
 * 把匯入的資料併進現有資料，不會覆蓋或刪除任何現有內容:
 * - 忽略名單:保留原有順序，只加入尚未存在的人
 * - 標籤:已經有標籤的人維持原標籤，只補上還沒有標籤的人
 */
export function mergeIgnoreData(current: IgnoreData, incoming: IgnoreData) {
  const existing = new Set(current.ignore)
  const newNames = incoming.ignore.filter((name) => !existing.has(name))

  const newTags = Object.entries(incoming.tags).filter(([name]) => !(name in current.tags))

  return {
    data: {
      ignore: [...current.ignore, ...newNames],
      tags: { ...Object.fromEntries(newTags), ...current.tags },
    } satisfies IgnoreData,
    addedIgnore: newNames.length,
    addedTags: newTags.length,
  }
}

/** 把逗號分隔的文字轉成忽略名單(去除空白與空項目) */
export function parseIgnoreList(text: string) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 檢查編輯中的忽略名單文字，回傳每個不合法項目的說明(沒有問題時是空陣列) */
export function ignoreTextErrors(text: string) {
  return parseIgnoreList(text)
    .filter((name) => !isValidUsername(name))
    .map((name) => `「${name}」不是有效的 username(只能用英數字、底線與句點)`)
}
