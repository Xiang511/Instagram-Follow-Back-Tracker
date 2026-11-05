<script setup lang="ts">
import { Star, UserPen } from '@lucide/vue'

const props = defineProps<{
  result: FollowUser[]
  // 你追蹤的所有人,重點關注分頁用它判斷有沒有回追
  following: FollowUser[]
}>()

// 分頁:全部比對結果 / 重點關注名單
const tab = ref<'all' | 'watch'>('all')

const {
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
} = useDataTable(toRef(props, 'result'))

const { isIgnored, toggleIgnore, getTag, setTag, removeTag } = useIgnore()
const { watchlist, isWatched, addWatch, removeWatch } = useWatchlist()

// 通知 BaseLayout 的 FAB:表格存在時才提供「捲動到表格最上方」
const dataTableVisible = useState('dataTableVisible', () => false)
onMounted(() => {
  dataTableVisible.value = true
})
onUnmounted(() => {
  dataTableVisible.value = false
})

// 換頁後自動捲回表格最上方
function changePage(p: number) {
  goTo(p)
  document.getElementById('data-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Action Modal:點選某一列的「操作」後,顯示該使用者可執行的動作
const actionOpen = ref(false)
const actionRow = ref<FollowUser | null>(null)
const tagText = ref('')

// 目前這位使用者是否已有標籤(決定顯示「新增」或「更新」、能否刪除)
const hasTag = computed(() => !!actionRow.value && getTag(actionRow.value.value) !== '')

function openAction(row: FollowUser) {
  actionRow.value = row
  tagText.value = getTag(row.value)
  actionOpen.value = true
}

function onToggleIgnore() {
  if (actionRow.value) toggleIgnore(actionRow.value.value)
  actionOpen.value = false
}

// 加入或移除重點關注(重點關注分頁本身只提供移除)
function onToggleWatch() {
  if (!actionRow.value) return
  if (isWatched(actionRow.value.value)) removeWatch(actionRow.value.value)
  else addWatch(actionRow.value.value)
  actionOpen.value = false
}

function onSaveTag() {
  if (!actionRow.value || !tagText.value.trim()) return
  setTag(actionRow.value.value, tagText.value)
  actionOpen.value = false
}

function onRemoveTag() {
  if (actionRow.value) removeTag(actionRow.value.value)
  actionOpen.value = false
}
</script>

<template>
  <div id="data-table" class="flex scroll-mt-4 flex-col gap-3">
    <div role="tablist" class="tabs tabs-border flex-nowrap overflow-x-auto">
      <button
        type="button"
        role="tab"
        class="tab shrink-0 font-normal whitespace-nowrap"
        :class="{ 'tab-active': tab === 'all' }"
        :aria-selected="tab === 'all'"
        @click="tab = 'all'">
        全部
      </button>
      <button
        type="button"
        role="tab"
        class="tab shrink-0 font-normal whitespace-nowrap"
        :class="{ 'tab-active': tab === 'watch' }"
        :aria-selected="tab === 'watch'"
        @click="tab = 'watch'">
        重點關注({{ watchlist.length }})
      </button>
    </div>

    <WatchlistTable v-show="tab === 'watch'" :result="result" :following="following" />

    <!-- 用 v-show 切換,回到「全部」時搜尋條件與頁碼都還在 -->
    <div v-show="tab === 'all'" class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <label class="input w-full sm:w-auto">
          <input v-model="keyword" type="search" placeholder="搜尋 instagramID" />
        </label>
        <div class="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:w-auto">
          <label class="flex cursor-pointer items-center gap-2">
            <input v-model="YMDCheck" type="checkbox" class="checkbox" />
            顯示詳細日期
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input v-model="showIgnore" type="checkbox" class="toggle" />
            隱藏忽略名單
          </label>
          <label class="select w-auto">
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
              <td class="w-1/6">追蹤時間</td>
              <td class="w-1/6">管理</td>
              <td class="w-1/6">狀態</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.value">
              <!-- ID 與標籤合成同一格一起固定,手機上標籤顯示在 ID 下方 -->
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
                  <Star
                    v-if="isWatched(row.value)"
                    class="text-warning size-4 shrink-0 fill-current"
                    aria-label="重點關注" />
                </div>
              </th>
              <td>{{ formatTime(row.timestamp, YMDCheck) }}</td>
              <td>
                <!-- 之後的標籤等功能也放進 Action Modal -->
                <button class="btn btn-outline font-normal" @click="openAction(row)">
                  <UserPen />
                </button>
              </td>
              <!-- 忽略狀態 -->
              <td>
                <span
                  class="badge font-normal"
                  :class="isIgnored(row.value) ? 'badge-error' : 'badge-ghost'">
                  {{ isIgnored(row.value) ? '已忽略' : '正常' }}
                </span>
              </td>
            </tr>
            <tr v-if="pagedRows.length === 0">
              <td colspan="4" class="text-center opacity-60">沒有資料</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="opacity-70">共 {{ filteredRows.length }} 筆</span>
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
    </div>

    <BaseModal v-model="actionOpen" title="操作">
      <p v-if="actionRow" class="mb-2">
        <a :href="actionRow.href" target="_blank" class="link link-primary">
          {{ actionRow.value }}
        </a>
      </p>
      <!-- 標籤管理:新增 / 編輯 / 刪除 -->
      <fieldset v-if="actionRow" class="fieldset">
        <legend class="fieldset-legend text-sm font-normal">標籤</legend>
        <div class="join w-full">
          <input
            v-model="tagText"
            type="text"
            class="input join-item w-full"
            placeholder="輸入標籤"
            @keyup.enter="onSaveTag" />
          <button
            class="btn btn-primary join-item font-normal"
            :disabled="!tagText.trim()"
            @click="onSaveTag">
            {{ hasTag ? '更新' : '新增' }}
          </button>
          <button
            class="btn btn-outline btn-error join-item font-normal"
            :disabled="!hasTag"
            @click="onRemoveTag">
            刪除
          </button>
        </div>
      </fieldset>
      <template #actions>
        <button v-if="actionRow" class="btn btn-outline font-normal" @click="onToggleWatch">
          {{ isWatched(actionRow.value) ? '移除重點關注' : '加入重點關注' }}
        </button>
        <button
          v-if="actionRow"
          class="btn btn-outline btn-error font-normal"
          @click="onToggleIgnore">
          {{ isIgnored(actionRow.value) ? '取消忽略' : '忽略' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>
