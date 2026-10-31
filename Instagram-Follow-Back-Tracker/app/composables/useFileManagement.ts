/**
 * 管理 followers / following 兩個檔案的資料與比對
 * 變數名稱沿用原本 main.js
 */
export function useFileManagement() {
  // null 代表尚未上傳
  const followersData = ref<unknown>(null)
  const followingData = ref<unknown>(null)

  const followerValues = ref<FollowUser[]>([])
  const followingValues = ref<FollowUser[]>([])

  // 最近一次比對的結果,供下載 JSON 使用
  const filteredFollowingValues = ref<FollowUser[]>([])

  const error = ref('')

  function setFollower(json: unknown) {
    try {
      followerValues.value = Follower(json)
      followersData.value = json
      error.value = ''
    } catch (e) {
      followersData.value = null
      followerValues.value = []
      error.value = e instanceof Error ? e.message : '檔案格式不正確'
    }
  }

  function setFollowing(json: unknown) {
    try {
      followingValues.value = Following(json)
      followingData.value = json
      error.value = ''
    } catch (e) {
      followingData.value = null
      followingValues.value = []
      error.value = e instanceof Error ? e.message : '檔案格式不正確'
    }
  }

  /** 開始搜尋:資料未到齊回傳 null,否則回傳比對結果 */
  function main(): SearchPayload | null {
    if (followersData.value === null || followingData.value === null) {
      error.value = '請先上傳您的檔案'
      return null
    }
    error.value = ''

    const filteredFollowingValues = getNotFollowingBack(followerValues.value, followingValues.value)

    return {
      result: filteredFollowingValues,
      followerValueslength: filteredFollowingValues.length,
      followingValueslength: followingValues.value.length,
    }
  }

  /** 下載最近一次的比對結果 */
  function exportJSON() {
    exportToJSON(filteredFollowingValues.value)
  }

  return {
    followersData,
    followingData,
    followerValues,
    followingValues,
    error,
    setFollower,
    setFollowing,
    main,
    exportJSON,
  }
}
