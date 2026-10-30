import { defineConfig } from 'vitest/config'

// 單元測試設定:純函式不需要 Nuxt 環境,用 happy-dom 模擬瀏覽器即可
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
