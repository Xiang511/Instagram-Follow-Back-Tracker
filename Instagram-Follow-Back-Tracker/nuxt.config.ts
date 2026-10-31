import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/hints', '@nuxt/test-utils/module', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
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
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/img/grid-svgrepo-com.svg' }],
    },
  },
  vite: {
    // 註冊 Tailwind 的 Vite 外掛
    plugins: [tailwindcss()],
  },
})
