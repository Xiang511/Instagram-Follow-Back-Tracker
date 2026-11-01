<script setup lang="ts">
import { UserPen } from '@lucide/vue'

const props = defineProps<{
  result: FollowUser[]
}>()

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

// 通知 BaseLayout 的 FAB:表格存在時才提供「捲動到表格最上方」
const dataTableVisible = useState('dataTableVisible', () => false)
onMounted(() => {
  dataTableVisible.value = true
})
onUnmounted(() => {
  dataTableVisible.value = false
})

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
    <div class="flex flex-wrap items-center justify-between gap-2">
      <label class="input">
        <input v-model="keyword" type="search" placeholder="搜尋 instagramID" />
      </label>
      <div class="flex flex-wrap items-center gap-4">
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
      <table class="table-zebra table">
        <thead class="[&_th]:font-normal">
          <tr>
            <th>InstagramID</th>
            <th>標籤</th>
            <th>追蹤時間</th>
            <th>管理</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pagedRows" :key="row.value">
            <td>
              <a :href="row.href" target="_blank" class="link link-primary">{{ row.value }}</a>
            </td>
            <td>
              <span v-if="getTag(row.value)" class="badge badge-primary badge-outline font-normal">
                {{ getTag(row.value) }}
              </span>
            </td>
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
            <td colspan="5" class="text-center opacity-60">沒有資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="opacity-70">共 {{ filteredRows.length }} 筆</span>
      <div class="join">
        <button class="btn join-item font-normal" :disabled="page === 1" @click="goTo(page - 1)">
          «
        </button>
        <template v-for="(p, index) in visiblePages" :key="`${p}-${index}`">
          <button v-if="p === '...'" class="btn join-item btn-disabled font-normal">...</button>
          <button
            v-else
            class="btn join-item font-normal"
            :class="{ 'btn-active btn-primary': p === page }"
            @click="goTo(p)">
            {{ p }}
          </button>
        </template>
        <button
          class="btn join-item font-normal"
          :disabled="page === totalPages"
          @click="goTo(page + 1)">
          »
        </button>
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
