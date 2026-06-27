import { memo } from "react";

import { SALES_FOCUS_BUTTON } from "../sales/salesFocusStyles";

function PriceListFooter({
  editButtonRef,
  editing,
  handleSave,
  handleStartEditing,
  saveButtonRef,
  saving = false,
}) {
  return (
    <div className="flex justify-end gap-3 border-t bg-slate-50 px-4 py-3">
      {!editing ? (
        <button
          type="button"
          ref={editButtonRef}
          onClick={handleStartEditing}
          className={`rounded bg-emerald-500 px-6 py-2 text-white ${SALES_FOCUS_BUTTON}`}
        >
          Edit
        </button>
      ) : (
        <button
          type="button"
          ref={saveButtonRef}
          disabled={saving}
          onClick={handleSave}
          className={`rounded px-6 py-2 text-white ${
            saving
              ? "cursor-not-allowed bg-emerald-400"
              : `bg-emerald-500 ${SALES_FOCUS_BUTTON}`
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}

export default memo(PriceListFooter);
