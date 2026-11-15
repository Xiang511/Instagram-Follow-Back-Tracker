/** 表格的搜尋與分頁邏輯 */
export function useDataTable(rows: Ref<FollowUser[]>) {
  const { isIgnored } = useIgnore()

  const pageSizeOptions = [10, 20, 50, 100]

  const keyword = ref('')
  const pageSize = ref(pageSizeOptions[0]!)
  const page = ref(1)

  // 追蹤時間顯示詳細日期(YYYY/MM/DD)，否則顯示相對時間
  const YMDCheck = ref(false)
  // 隱藏忽略名單中的人
  const showIgnore = ref(false)

  // 先排除被忽略的人，再以 instagramID 搜尋(不分大小寫)
  const filteredRows = computed(() => {
    const visible = showIgnore.value
      ? rows.value.filter((row) => !isIgnored(row.value))
      : rows.value
    const text = keyword.value.trim().toLowerCase()
    return text ? visible.filter((row) => row.value.toLowerCase().includes(text)) : visible
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)),
  )

  const pagedRows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredRows.value.slice(start, start + pageSize.value)
  })

  // 頁碼按鈕:首頁、末頁與目前頁前後各一頁，其餘以 '...' 省略
  const visiblePages = computed(() => {
    const total = totalPages.value
    const pages = new Set([1, total, page.value - 1, page.value, page.value + 1])
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

    const result: (number | '...')[] = []
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1]! > 1) result.push('...')
      result.push(p)
    })
    return result
  })

  // 搜尋條件、每頁筆數或資料改變時回到第一頁
  watch([keyword, pageSize, rows, showIgnore], () => {
    page.value = 1
  })

  function goTo(target: number) {
    page.value = Math.min(Math.max(1, target), totalPages.value)
  }

  return {
    pageSizeOptions,
    keyword,
    pageSize,
    page,
    YMDCheck,
    showIgnore,
    filteredRows,
    totalPages,
    pagedRows,
    visiblePages,
    goTo,
  }
}
