import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/hints', '@nuxt/test-utils/module', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    // 註冊 Tailwind 的 Vite 外掛
    plugins: [tailwindcss()],
  },
})
