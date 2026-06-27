import { memo } from "react";

function ItemPhotoFooter({
  editButtonRef,
  hasImage,
  loading,
  onEdit,
  onClear,
}) {
  return (
    <div className="flex justify-end gap-2 border-t bg-slate-100 p-3">
      <button
        type="button"
        ref={editButtonRef}
        onClick={onEdit}
        disabled={loading}
        className="rounded bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600 disabled:opacity-50"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasImage || loading}
        className="rounded bg-slate-500 px-6 py-2 text-white hover:bg-slate-600 disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  );
}

export default memo(ItemPhotoFooter);
