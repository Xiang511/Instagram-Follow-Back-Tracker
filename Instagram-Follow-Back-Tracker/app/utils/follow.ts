// followers.json / following.json 內單筆資料的格式
interface StringListData {
  href?: string
  value?: string
  timestamp: number
}

interface FollowEntry {
  title?: string
  string_list_data: StringListData[]
}

// followers.json 為陣列;following.json 的資料在 relationships_following
export type FollowersData = FollowEntry[]
export interface FollowingData {
  relationships_following: FollowEntry[]
}

// 攤平後的使用者資料
export interface FollowUser {
  value: string
  href: string
  timestamp: number
}

// 按下「開始搜尋」後 emit 出去的資料
export interface SearchPayload {
  result: FollowUser[]
  followerValueslength: number
  followingValueslength: number
}

const isEntryList = (list: unknown): list is FollowEntry[] =>
  Array.isArray(list) && list.every((item) => item && Array.isArray(item.string_list_data))

// 缺少 href 時以 username 補上個人頁連結
const profileHref = (username: string) => `https://www.instagram.com/_u/${username}`

/** 解析 followers.json,回傳攤平後的 followerValues */
export function Follower(followersData: unknown): FollowUser[] {
  if (!isEntryList(followersData)) {
    throw new Error('followers 檔案格式不正確')
  }

  return followersData.flatMap((follower) =>
    follower.string_list_data.map((data) => ({
      value: data.value ?? '',
      href: data.href || profileHref(data.value ?? ''),
      timestamp: data.timestamp,
    })),
  )
}

/** 解析 following.json,回傳攤平後的 followingValues */
export function Following(arg: unknown): FollowUser[] {
  const followingData = (arg as FollowingData | null)?.relationships_following
  if (!isEntryList(followingData)) {
    throw new Error('following 檔案格式不正確')
  }

  return followingData.flatMap((follower) =>
    follower.string_list_data.map((data) => {
      // 新版匯出的 username 在 value(title 是空字串),舊版在 title(value 是空的)
      const username = data.value || follower.title || ''
      return {
        value: username,
        href: data.href || profileHref(username),
        timestamp: data.timestamp,
      }
    }),
  )
}

/** 找出 following 中沒有出現在 followers 的人(沒有回追你的人) */
export function getNotFollowingBack(followerValues: FollowUser[], followingValues: FollowUser[]) {
  const followers = new Set(followerValues.map((follower) => follower.value))
  return followingValues.filter((following) => !followers.has(following.value))
}
