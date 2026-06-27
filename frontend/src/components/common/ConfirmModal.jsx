import { memo } from "react";

function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <div className="px-6 py-4">
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded border px-4 py-2 hover:bg-slate-100"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ConfirmModal);
