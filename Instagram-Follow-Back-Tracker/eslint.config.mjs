// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier'

import withNuxt from './.nuxt/eslint.config.mjs'

// withNuxt 已內建 Vue 與 TypeScript 的解析器及基礎規則,不需要再展開 pluginVue.configs
export default withNuxt(
  // 自定義調整
  {
    files: ['*.vue', '**/*.vue', '*.js', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'vue/no-static-inline-styles': [
        'error',
        {
          allowBinding: false, // 是否允許 :style="{ color: 'red' }" 這種動態綁定
        },
      ],
      'vue/multi-word-component-names': 'off', // 允許 Home.vue
      'no-unused-vars': 'off', // 隱藏未使用變數的警告
      'vue/no-v-html': 'warn', // v-html 可能導致 XSS,顯示警告
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
    },
  },

  // 禁用與 Prettier 衝突的規則,必須放最後
  eslintConfigPrettier,
)
