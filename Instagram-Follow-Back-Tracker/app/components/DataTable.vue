<script setup lang="ts">
const props = defineProps<{
  result: FollowUser[]
}>()

const {
  pageSizeOptions,
  keyword,
  pageSize,
  page,
  YMDCheck,
  filteredRows,
  totalPages,
  pagedRows,
  visiblePages,
  goTo,
} = useDataTable(toRef(props, 'result'))
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
            <th>instagramID</th>
            <th>追蹤時間</th>
            <!-- 預留給之後的功能(忽略、標籤等) -->
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pagedRows" :key="row.value">
            <td>
              <a :href="row.href" target="_blank" class="link link-primary">{{ row.value }}</a>
            </td>
            <td>{{ formatTime(row.timestamp, YMDCheck) }}</td>
            <td><slot name="action" :row="row"></slot></td>
          </tr>
          <tr v-if="pagedRows.length === 0">
            <td colspan="3" class="text-center opacity-60">沒有資料</td>
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
  </div>
</template>
