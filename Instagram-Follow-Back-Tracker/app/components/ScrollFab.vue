<script setup lang="ts">
import { ArrowUpToLine, ChevronsUp, Table } from '@lucide/vue'

// DataTable 掛載後才有表格可以捲動
const dataTableVisible = useState('dataTableVisible', () => false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToDataTable() {
  if (!dataTableVisible.value) return
  const dataTable = document.getElementById('data-table')
  if (!dataTable) return
  dataTable.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <!-- 快速捲動:展開後可選擇回到頁面最上方,或表格最上方 -->
  <div class="fab">
    <div
      tabindex="0"
      role="button"
      class="btn btn-circle btn-primary lg:btn-xl"
      aria-label="快速捲動">
      <ChevronsUp />
    </div>
    <div>
      <!-- 表格最上方 -->
      <button
        class="btn btn-circle lg:btn-xl"
        aria-label="捲動到表格最上方"
        :disabled="!dataTableVisible"
        @click="scrollToDataTable">
        <Table />
      </button>
    </div>
    <div>
      <!-- 頁面最上方 -->
      <button class="btn btn-circle lg:btn-xl" aria-label="捲動到頁面最上方" @click="scrollToTop">
        <ArrowUpToLine />
      </button>
    </div>
  </div>
</template>
