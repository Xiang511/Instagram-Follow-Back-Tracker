// GitHub API 回傳中,畫面會用到的欄位
interface GithubRepoResponse {
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  license: { spdx_id: string } | null
  pushed_at: string
  topics: string[]
  owner: { avatar_url: string }
}

/**
 * 載入倉庫資訊:只在瀏覽器端向 GitHub 公開 API 取得一次
 * 未登入的呼叫每小時有次數限制,失敗時 failed 為 true,畫面改顯示連結即可
 */
export function useGithubRepo(fullName: string) {
  const info = ref<GithubRepoResponse | null>(null)
  const failed = ref(false)

  onMounted(async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${fullName}`)
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      info.value = await res.json()
    } catch (e) {
      console.error('載入 GitHub 倉庫資訊失敗', e)
      failed.value = true
    }
  })

  return { info, failed }
}
