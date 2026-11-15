import { strFromU8, unzipSync } from 'fflate'

const FOLLOWERS_FILE = /^followers(?:_(\d+))?\.json$/
const FOLLOWING_FILE = /^following\.json$/

// Windows 內建壓縮做出來的 ZIP 路徑用反斜線(default\followers_1.json)，所以兩種分隔符號都要切
const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path

// macOS 壓縮時附帶的 __MACOSX 資料夾只有資源檔(._followers_1.json)，不是真正的內容，直接略過
const isMacResource = (path: string) => path.split(/[\\/]/).includes('__MACOSX')

const isTarget = (path: string) => {
  if (isMacResource(path)) return false
  const name = baseName(path)
  return FOLLOWERS_FILE.test(name) || FOLLOWING_FILE.test(name)
}

/**
 * 從 Instagram 匯出的 ZIP 取出 followers 與 following 的 JSON
 * - 只解壓這兩類檔案(不管放在哪個資料夾，也不管路徑用 / 或 \)，其餘如圖片、影片完全不讀
 * - 粉絲太多時 Instagram 會拆成 followers_1.json、followers_2.json…，這裡依序合併成一份陣列，
 *   之後才拿合併後的完整粉絲名單去和 following 比對
 */
export function extractFollowData(zip: Uint8Array) {
  let files: Record<string, Uint8Array>
  try {
    files = unzipSync(zip, { filter: (file) => isTarget(file.name) })
  } catch {
    throw new Error('這不是有效的 ZIP 檔案，請選擇 Instagram 下載的壓縮檔')
  }

  const followerFiles = Object.entries(files)
    .filter(([path]) => FOLLOWERS_FILE.test(baseName(path)))
    .sort(([a], [b]) => fileIndex(a) - fileIndex(b))
  const followingFile = Object.entries(files).find(([path]) => FOLLOWING_FILE.test(baseName(path)))

  if (followerFiles.length === 0 || !followingFile) {
    throw new Error('壓縮檔內找不到 followers_1.json 或 following.json，請確認下載格式為 JSON')
  }

  const followers = followerFiles.flatMap(([path, data]) => {
    const json = JSON.parse(strFromU8(data))
    if (!Array.isArray(json)) throw new Error(`${baseName(path)} 的內容格式不正確`)
    return json
  })
  const following = JSON.parse(strFromU8(followingFile[1]))

  return { followers, following, followerFileCount: followerFiles.length }
}

// followers.json 視為 0，followers_N.json 依 N 排序
function fileIndex(path: string) {
  return Number(FOLLOWERS_FILE.exec(baseName(path))?.[1] ?? 0)
}
