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

const { isIgnored, toggleIgnore } = useIgnore()

// Action Modal:點選某一列的「操作」後,顯示該使用者可執行的動作
const actionOpen = ref(false)
const actionRow = ref<FollowUser | null>(null)

function openAction(row: FollowUser) {
  actionRow.value = row
  actionOpen.value = true
}

function onToggleIgnore() {
  if (actionRow.value) toggleIgnore(actionRow.value.value)
  actionOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-3">
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
