import tailwindcss from '@tailwindcss/vite'

// 部署在 GitHub Pages 子路徑時，建置要帶環境變數 NUXT_APP_BASE_URL=/Instagram-Follow-Back-Tracker/
// (Nuxt 會自動處理 JS、CSS 與站內連結，但 app.head 裡手寫的路徑不會，所以這裡自己補上前綴)
const rawBase = process.env.NUXT_APP_BASE_URL || '/'
const baseURL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineNuxtConfig({
  modules: ['@nuxt/hints', '@nuxt/test-utils/module', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      // 網站網域(不含子路徑);社群分享圖需要完整網址。可用 NUXT_PUBLIC_SITE_URL 覆寫
      siteUrl: 'https://xiang511.com',
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    // 全站共用的 head 設定(charset 與 viewport 由 Nuxt 預設提供)
    head: {
      htmlAttrs: { lang: 'zh-TW' },
      titleTemplate: '%s',
      meta: [
        { name: 'author', content: 'Xiang' },
        {
          name: 'keywords',
          content: 'instagram,instagram-follower,ig粉絲追蹤,ig誰退追我,ig退追蹤網頁版',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}img/grid-svgrepo-com.svg` }],
      script: [
        {
          // 繪製前先套用主題(記住的選擇,否則跟隨系統),避免深色模式閃一下白畫面
          innerHTML:
            "try{var t=localStorage.getItem('theme');if(t==='dark')t='night';t=t||(matchMedia('(prefers-color-scheme: dark)').matches?'night':'light');document.documentElement.dataset.theme=t}catch(e){}",
          tagPosition: 'head',
        },
      ],
    },
  },
  vite: {
    // 註冊 Tailwind 的 Vite 外掛
    plugins: [tailwindcss()],
  },
})
