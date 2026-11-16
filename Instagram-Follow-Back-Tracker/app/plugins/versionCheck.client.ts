// 偵測網站是否有新版本部署，避免客戶端停留在舊版程式碼
// 只重新載入頁面，不會動 localStorage（主題、忽略清單、追蹤清單都會保留）
export default defineNuxtPlugin((nuxtApp) => {
  // 旗標交給 UpdateModal 顯示提示，由使用者決定何時更新
  const hasUpdate = useState('hasUpdate', () => false)

  // Nuxt 比對 /_nuxt/builds/latest.json 發現 build id 不同時觸發
  nuxtApp.hook('app:manifest:update', () => {
    hasUpdate.value = true
  })

  // 舊版 JS chunk 已被新部署刪除而載入失敗時，無法繼續操作，直接重新載入取得新版
  nuxtApp.hook('app:chunkError', () => {
    reloadNuxtApp({ persistState: true })
  })
})
