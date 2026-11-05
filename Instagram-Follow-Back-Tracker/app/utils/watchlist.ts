// 重點關注對象目前的回追狀態
export type WatchStatus = 'notFollowingBack' | 'followingBack' | 'notFollowing'

export interface WatchRow {
  value: string
  href: string
  // 不在你的追蹤名單時沒有追蹤時間
  timestamp: number | null
  status: WatchStatus
}

// 沒回追的排最前面,其次已回追,最後是你沒有追蹤的
const statusOrder: Record<WatchStatus, number> = {
  notFollowingBack: 0,
  followingBack: 1,
  notFollowing: 2,
}

/**
 * 依最近一次比對的結果,判斷關注名單中每個人有沒有回追
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

  // Array.prototype.sort 是穩定排序,同狀態維持加入的先後順序
  return rows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}
