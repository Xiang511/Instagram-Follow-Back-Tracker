<script setup lang="ts">
// 重點關注:列出名單中的人，以及最近一次比對下他們有沒有回追;此分頁只能移除，不提供管理
const props = defineProps<{
  result: FollowUser[]
  following: FollowUser[]
}>()

const { watchlist, removeWatch } = useWatchlist()
const { getTag } = useIgnore()

const keyword = ref('')

const allRows = computed(() => getWatchlistRows(watchlist.value, props.result, props.following))

const rows = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return allRows.value.filter((row) => row.value.toLowerCase().includes(text))
})

// 分頁:選項與「全部」分頁一致，頁碼按鈕的呈現方式也相同
const pageSizeOptions = [10, 20, 50, 100]
const pageSize = ref(pageSizeOptions[0]!)
const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize.value)))

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return rows.value.slice(start, start + pageSize.value)
})

// 首頁、末頁與目前頁前後各一頁，其餘以 '...' 省略
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

// 搜尋條件或每頁筆數改變時回到第一頁
watch([keyword, pageSize], () => {
  page.value = 1
})

// 移除最後一頁的最後一人等情況讓總頁數變少時，頁碼不能停在不存在的頁
watch(totalPages, (total) => {
  if (page.value > total) page.value = total
})

// 換頁後自動捲回表格最上方(表格容器 id 與「全部」分頁共用)
function changePage(target: number) {
  page.value = Math.min(Math.max(1, target), totalPages.value)
  document.getElementById('data-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const notBackCount = computed(
  () => allRows.value.filter((row) => row.status === 'notFollowingBack').length,
)

const statusText: Record<WatchStatus, string> = {
  notFollowingBack: '沒有回追',
  followingBack: '已回追',
  notFollowing: '你沒有追蹤',
}

const statusClass: Record<WatchStatus, string> = {
  notFollowingBack: 'badge-error',
  followingBack: 'badge-success',
  notFollowing: 'badge-ghost',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p v-if="watchlist.length === 0" class="opacity-60">
      還沒有重點關注的人。在「全部」分頁點選某人的管理按鈕，就能加入這裡。
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <label class="input w-full sm:w-auto">
          <input v-model="keyword" type="search" placeholder="搜尋 instagramID" />
        </label>
        <div class="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:w-auto">
          <span class="opacity-70">
            共 {{ watchlist.length }} 人，其中 {{ notBackCount }} 人沒有回追
          </span>
          <label v-if="watchlist.length > pageSizeOptions[0]!" class="select w-auto">
            <span class="label">每頁</span>
            <select v-model.number="pageSize">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
          </label>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table-zebra table-pin-cols table whitespace-nowrap">
          <thead>
            <tr>
              <th class="font-normal">InstagramID / 標籤</th>
              <td>追蹤時間</td>
              <td>回追狀態</td>
              <td>移除清單</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.value">
              <th class="font-normal">
                <div
                  class="flex max-w-36 flex-col items-start gap-1 md:max-w-none md:flex-row md:items-center md:gap-2">
                  <a :href="row.href" target="_blank" class="link link-primary max-w-full truncate">
                    {{ row.value }}
                  </a>
                  <span
                    v-if="getTag(row.value)"
                    class="badge badge-primary badge-outline max-w-full font-normal">
                    <span class="truncate">{{ getTag(row.value) }}</span>
                  </span>
                </div>
              </th>
              <td>{{ row.timestamp === null ? '-' : formatTime(row.timestamp, true) }}</td>
              <td>
                <span class="badge font-normal" :class="statusClass[row.status]">
                  {{ statusText[row.status] }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-outline btn-error font-normal"
                  @click="removeWatch(row.value)">
                  移除
                </button>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="4" class="text-center opacity-60">沒有符合的資料</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 只有超過一頁才需要頁碼 -->
      <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-between gap-2">
        <span class="opacity-70">共 {{ rows.length }} 筆</span>
        <div class="join">
          <button
            class="btn join-item font-normal"
            :disabled="page === 1"
            @click="changePage(page - 1)">
            «
          </button>
          <template v-for="(p, index) in visiblePages" :key="`${p}-${index}`">
            <button v-if="p === '...'" class="btn join-item btn-disabled font-normal">...</button>
            <button
              v-else
              class="btn join-item font-normal"
              :class="{ 'btn-active btn-primary': p === page }"
              @click="changePage(p)">
              {{ p }}
            </button>
          </template>
          <button
            class="btn join-item font-normal"
            :disabled="page === totalPages"
            @click="changePage(page + 1)">
            »
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
