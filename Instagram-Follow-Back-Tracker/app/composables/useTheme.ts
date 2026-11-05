// 可選主題:淺色系 light / winter / lofi,深色系使用 night
export const themes = [
  { value: 'light', label: '淺色' },
  { value: 'winter', label: 'Winter' },
  { value: 'lofi', label: 'Lofi' },
  { value: 'night', label: '深色' },
]

// 各主題對應的 giscus 主題;night 用透明底,才會和頁面的深藍底融合
const giscusThemes: Record<string, string> = {
  light: 'light',
  winter: 'light',
  lofi: 'light',
  night: 'transparent_dark',
}

/**
 * 目前的網站主題,AppNav 與 Giscus 共用同一份
 * 初始值由 nuxt.config 的 head script 在畫面繪製前寫入 <html data-theme>,
 * 這裡掛載後讀回來,並負責切換與記住選擇
 */
export function useTheme() {
  const currentTheme = useState('theme', () => '')

  onMounted(() => {
    if (!currentTheme.value) currentTheme.value = document.documentElement.dataset.theme ?? ''
  })

  function setTheme(theme: string) {
    document.documentElement.dataset.theme = theme
    currentTheme.value = theme
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      console.error('save theme error', e)
    }
  }

  const giscusTheme = computed(() => giscusThemes[currentTheme.value] ?? 'light')

  return { currentTheme, giscusTheme, setTheme }
}
