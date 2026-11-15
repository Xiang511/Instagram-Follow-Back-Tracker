<script setup lang="ts">
defineProps<{ title?: string }>()

// v-model 控制開關，點背景、按 Esc 或關閉按鈕都會同步回 false
const open = defineModel<boolean>({ default: false })

const dialog = ref<HTMLDialogElement | null>(null)

watch(open, (value) => {
  if (value && !dialog.value?.open) dialog.value?.showModal()
  if (!value && dialog.value?.open) dialog.value.close()
})
</script>

<template>
  <dialog ref="dialog" class="modal" @close="open = false">
    <div class="modal-box">
      <h3 v-if="title" class="mb-4 text-lg font-normal">{{ title }}</h3>
      <slot />
      <div class="modal-action">
        <!-- 額外的操作按鈕 -->
        <slot name="actions" />
        <form method="dialog">
          <button class="btn font-normal">關閉</button>
        </form>
      </div>
    </div>
    <!-- 點背景關閉 -->
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
