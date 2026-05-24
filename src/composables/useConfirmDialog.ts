import { reactive } from "vue";

const confirmDialogState = reactive({
  open: false,
  title: "",
  message: "",
  onConfirm: null as (() => void) | null,
});

export function useConfirmDialog() {
  function openConfirmDialog(
    title: string,
    message: string,
    onConfirm: () => void,
  ) {
    confirmDialogState.title = title;
    confirmDialogState.message = message;
    confirmDialogState.onConfirm = onConfirm;
    confirmDialogState.open = true;
  }

  function closeConfirmDialog() {
    confirmDialogState.open = false;
    confirmDialogState.onConfirm = null;
  }

  return {
    confirmDialogState,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
