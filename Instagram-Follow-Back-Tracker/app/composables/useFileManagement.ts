/**
 * 管理 followers / following 兩個檔案的資料與比對
 * 變數名稱沿用原本 main.js
 */
export function useFileManagement() {
  const { isIgnored, tagMap } = useIgnore()

  // null 代表尚未上傳
  const followersData = ref<unknown>(null)
  const followingData = ref<unknown>(null)

  const followerValues = ref<FollowUser[]>([])
  const followingValues = ref<FollowUser[]>([])

  // 最近一次比對的結果,供下載 JSON 使用
  const filteredFollowingValues = ref<FollowUser[]>([])

  const error = ref('')

  // 回傳 false 代表檔案格式不正確,呼叫端可據此清空 file input
  function setFollower(json: unknown) {
    try {
      followerValues.value = Follower(json)
      followersData.value = json
      error.value = ''
      return true
    } catch (e) {
      followersData.value = null
      followerValues.value = []
      error.value = e instanceof Error ? e.message : '檔案格式不正確'
      return false
    }
  }

  function setFollowing(json: unknown) {
    try {
      followingValues.value = Following(json)
      followingData.value = json
      error.value = ''
      return true
    } catch (e) {
      followingData.value = null
      followingValues.value = []
      error.value = e instanceof Error ? e.message : '檔案格式不正確'
      return false
    }
  }

  /** 開始搜尋:資料未到齊回傳 null,否則回傳比對結果 */
  function main(): SearchPayload | null {
    if (followersData.value === null || followingData.value === null) {
      error.value = '請先上傳您的檔案'
      return null
    }
    error.value = ''

    filteredFollowingValues.value = getNotFollowingBack(followerValues.value, followingValues.value)

    return {
      result: filteredFollowingValues.value,
      followerValueslength: filteredFollowingValues.value.length,
      followingValueslength: followingValues.value.length,
    }
  }

  /** 下載最近一次的比對結果(與原本一致,不含忽略名單中的人) */
  function exportJSON() {
    exportToJSON(
      filteredFollowingValues.value.filter((d) => !isIgnored(d.value)),
      tagMap.value,
    )
  }

  // 有上傳過任何檔案或有比對結果時,才需要清空
  const hasData = computed(
    () =>
      followersData.value !== null ||
      followingData.value !== null ||
      filteredFollowingValues.value.length > 0,
  )

  /** 清空所有已上傳的資料、比對結果與錯誤訊息 */
  function clear() {
    followersData.value = null
    followingData.value = null
    followerValues.value = []
    followingValues.value = []
    filteredFollowingValues.value = []
    error.value = ''
  }

  return {
    followersData,
    followingData,
    followerValues,
    followingValues,
    filteredFollowingValues,
    error,
    hasData,
    setFollower,
    setFollowing,
    main,
    exportJSON,
    clear,
  }
}
