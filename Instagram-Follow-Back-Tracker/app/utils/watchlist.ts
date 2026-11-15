// 單元測試不經過 Nuxt 的自動匯入，所以明確 import
import { isValidUsername } from './ignore'

// 重點關注對象目前的回追狀態
export type WatchStatus = 'notFollowingBack' | 'followingBack' | 'notFollowing'

export interface WatchRow {
  value: string
  href: string
  // 不在你的追蹤名單時沒有追蹤時間
  timestamp: number | null
  status: WatchStatus
}

// 沒回追的排最前面，其次已回追，最後是你沒有追蹤的
const statusOrder: Record<WatchStatus, number> = {
  notFollowingBack: 0,
  followingBack: 1,
  notFollowing: 2,
}

/**
 * 依最近一次比對的結果，判斷關注名單中每個人有沒有回追
 * @param watchlist 重點關注的 username
 * @param result 比對結果:你追蹤、但對方沒追蹤你的人
 * @param following 你追蹤的所有人
 */
export function getWatchlistRows(
  watchlist: string[],
  result: FollowUser[],
  following: FollowUser[],
): WatchRow[] {
  const notBack = new Set(result.map((user) => user.value))
  const followingMap = new Map(following.map((user) => [user.value, user]))

  const rows = watchlist.map((value): WatchRow => {
    const user = followingMap.get(value)
    if (!user) {
      return {
        value,
        href: `https://www.instagram.com/_u/${value}`,
        timestamp: null,
        status: 'notFollowing',
      }
    }
    return {
      value,
      href: user.href,
      timestamp: user.timestamp,
      status: notBack.has(value) ? 'notFollowingBack' : 'followingBack',
    }
  })

  // Array.prototype.sort 是穩定排序，同狀態維持加入的先後順序
  return rows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}

// UTF-8 檔案開頭的 BOM(U+FEFF)，用編碼值比對
const BOM = 0xfeff

/** 匯出檔的內容:username 陣列，縮排 2 格的 JSON，與瀏覽器儲存的格式相同 */
export function toWatchlistJSON(watchlist: string[]) {
  return JSON.stringify(watchlist, null, 2)
}

/**
 * 解析匯入的重點關注檔案，格式無法辨識回傳 null
 * 支援 JSON 陣列 ["a","b"]、{ "watchlist": [...] }，以及逗號 / 換行分隔的文字
 * username 不合法的項目不收，數量放在 skipped
 */
export function parseWatchlistFile(text: string) {
  const content = (text.charCodeAt(0) === BOM ? text.slice(1) : text).trim()

  let names: string[]
  if (content.startsWith('[') || content.startsWith('{')) {
    let json: unknown
    try {
      json = JSON.parse(content)
    } catch {
      return null
    }
    const list = Array.isArray(json) ? json : (json as { watchlist?: unknown } | null)?.watchlist
    if (!Array.isArray(list) || !list.every((item) => typeof item === 'string')) return null
    names = list
  } else {
    names = content.split(/[,\r\n]+/)
  }

  const trimmed = [...new Set(names.map((name) => name.trim()).filter(Boolean))]
  const watchlist = trimmed.filter(isValidUsername)
  return { watchlist, skipped: trimmed.length - watchlist.length }
}

/** 併進現有名單:保留原順序，只加入尚未存在的人 */
export function mergeWatchlist(current: string[], incoming: string[]) {
  const existing = new Set(current)
  const added = incoming.filter((name) => !existing.has(name))
  return { watchlist: [...current, ...added], added: added.length }
}
