// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/hints', '@nuxt/test-utils/module', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
