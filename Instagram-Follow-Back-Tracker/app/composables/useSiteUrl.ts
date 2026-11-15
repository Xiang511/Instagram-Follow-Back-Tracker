// 把 public/ 底下的檔案路徑(例如 img/banner.png)轉成完整網址
// 會依建置時的 NUXT_APP_BASE_URL 補上子路徑，og:image 這類社群分享用的標籤一定要完整網址
export function useSiteUrl() {
  const config = useRuntimeConfig()
  const origin = config.public.siteUrl.replace(/\/$/, '')
  const base = config.app.baseURL

  return {
    // 站內資源路徑(含子路徑，不含網域)，給 href / src 用
    asset: (path: string) => `${base}${path.replace(/^\//, '')}`,
    // 完整網址，給 og:image 用
    absolute: (path: string) => `${origin}${base}${path.replace(/^\//, '')}`,
  }
}
