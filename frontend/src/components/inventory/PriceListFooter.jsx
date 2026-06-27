import { memo } from "react";

function PriceListFooter({
  editButtonRef,
  editing,
  handleClear,
  handleSave,
  handleStartEditing,
  saving = false,
}) {
  return (
    <div className="flex justify-end gap-3 border-t bg-slate-50 px-4 py-3">
      {!editing ? (
        <button
          type="button"
          ref={editButtonRef}
          onClick={handleStartEditing}
          className="rounded bg-emerald-500 px-6 py-2 text-white"
        >
          Edit
        </button>
      ) : (
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className={`rounded px-6 py-2 text-white ${
            saving
              ? "cursor-not-allowed bg-emerald-400"
              : "bg-emerald-500"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}

      <button
        type="button"
        className="rounded bg-violet-500 px-6 py-2 text-white"
      >
        List
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="rounded bg-slate-600 px-6 py-2 text-white"
      >
        Clear
      </button>
    </div>
  );
}

export default memo(PriceListFooter);
