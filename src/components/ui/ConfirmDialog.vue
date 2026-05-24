<script lang="ts" setup>
import { useConfirmDialog } from "../../composables/useConfirmDialog";
import BaseButton from "./BaseButton.vue";
import BaseDialog from "./BaseDialog.vue";

const { confirmDialogState: state } = useConfirmDialog();

const handleCancel = () => {
  state.open = false;
};

const handleConfirm = () => {
  state.open = false;
  state.onConfirm?.();
};
</script>
<template>
  <BaseDialog
    :title="state.title"
    :open="state.open"
    @openchange="state.open = $event"
  >
    <p class="text-sm text-slate-500">{{ state.message }}</p>
    <div class="mt-6 flex justify-end gap-4">
      <BaseButton variant="outline" @click="handleCancel()">
        {{ "Cancel" }}
      </BaseButton>
      <BaseButton @click="handleConfirm()">
        {{ "Confirm" }}
      </BaseButton>
    </div>
  </BaseDialog>
</template>
