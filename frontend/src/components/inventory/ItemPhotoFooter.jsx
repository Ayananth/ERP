import { memo } from "react";

import { SALES_FOCUS_BUTTON } from "../sales/salesFocusStyles";

function ItemPhotoFooter({
  handleFieldEnter,
  hasImage,
  loading,
  onClear,
  onEdit,
  registerClearButton,
  registerEditButton,
}) {
  return (
    <div className="flex justify-end gap-2 border-t bg-slate-100 p-3">
      <button
        type="button"
        ref={registerEditButton}
        onClick={onEdit}
        disabled={loading}
        onKeyDown={(event) => handleFieldEnter(event, 0)}
        className={`rounded bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600 disabled:opacity-50 ${SALES_FOCUS_BUTTON}`}
      >
        Edit
      </button>

      <button
        type="button"
        ref={registerClearButton}
        onClick={onClear}
        disabled={!hasImage || loading}
        className={`rounded bg-slate-500 px-6 py-2 text-white hover:bg-slate-600 disabled:opacity-50 ${SALES_FOCUS_BUTTON}`}
      >
        Clear
      </button>
    </div>
  );
}

export default memo(ItemPhotoFooter);
