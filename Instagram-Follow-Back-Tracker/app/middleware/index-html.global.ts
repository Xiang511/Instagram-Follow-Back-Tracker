// 舊網站的網址是 /index.html:把它轉到新的首頁 /
// 靜態託管(GitHub Pages)沒辦法設定伺服器端轉址,所以在路由層處理;
// 用 replace 取代歷史紀錄,按上一頁不會又回到 /index.html
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/index.html') {
    return navigateTo({ path: '/', query: to.query, hash: to.hash }, { replace: true })
  }
})
