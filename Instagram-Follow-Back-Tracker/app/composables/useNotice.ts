export type NoticeType = 'success' | 'error' | 'warning'
export type ShowNotice = (type: NoticeType, text: string) => void

/** 頁面頂端的結果提示，3 秒後自動消失 */
export function useNotice() {
  const notice = ref<{ type: NoticeType; text: string } | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  const showNotice: ShowNotice = (type, text) => {
    notice.value = { type, text }
    clearTimeout(timer)
    timer = setTimeout(() => (notice.value = null), 3000)
  }
  onBeforeUnmount(() => clearTimeout(timer))

  return { notice, showNotice }
}
