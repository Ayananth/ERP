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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-slate-600">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              px-4 py-2
              border
              rounded
              hover:bg-slate-100
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              px-4 py-2
              bg-red-600
              text-white
              rounded
              hover:bg-red-700
            "
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;