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
        <span class="opacity-70">
          共 {{ watchlist.length }} 人，其中 {{ notBackCount }} 人沒有回追
        </span>
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
            <tr v-for="row in rows" :key="row.value">
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
    </template>
  </div>
</template>
