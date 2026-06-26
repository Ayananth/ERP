import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  List,
  PencilLine,
  Printer,
  Save,
  X,
} from "lucide-react";

import {
  SALES_FOCUS_BUTTON,
  SALES_FOCUS_BUTTON_ICON,
} from "./salesFocusStyles";

function SummaryField({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 text-base font-medium text-slate-700">{value ?? "0.00"}</div>
    </div>
  );
}

function IconAction({
  children,
  label,
  disabled = false,
  className = "",
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${
        disabled
          ? "cursor-not-allowed bg-slate-200 text-slate-400"
          : `${className} ${SALES_FOCUS_BUTTON}`
      }`}
    >
      {children ?? label}
    </button>
  );
}

function SalesQuotationFooter({
  isEditing,
  onAction,
  onCancel,
  newEditButtonRef,
  onList,
  onPreview,
  previewDisabled = false,
  onSave,
  primaryActionLabel,
  totals = {},
}) {
  const actionLabel = primaryActionLabel ?? (isEditing ? "Save" : "New");

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-4 xl:grid-cols-5">
        <SummaryField label="Gross" value={totals.gross} />
        <SummaryField label="Disc" value={totals.discount} />
        <SummaryField label="Net Total" value={totals.net} />
        <SummaryField label="VAT" value={totals.vat} />
        <SummaryField label="Net After VAT" value={totals.netAfterVat} />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">


        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <button
            type="button"
            ref={newEditButtonRef}
            onClick={isEditing ? onSave : onAction}
            className={`inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 ${SALES_FOCUS_BUTTON}`}
          >
            {actionLabel === "Save" || actionLabel === "Update" ? (
              <Save size={16} />
            ) : (
              <PencilLine size={16} />
            )}
            {actionLabel}
          </button>

          <IconAction
            disabled
            className="bg-slate-200 text-slate-400"
            label="Print"
          >
            <span className="inline-flex items-center gap-2">
              <Printer size={16} />
              Print
            </span>
          </IconAction>

          <IconAction
            disabled={previewDisabled}
            onClick={onPreview}
            className="bg-slate-600 text-white hover:bg-slate-700"
            label="Preview"
          >
            <span className="inline-flex items-center gap-2">
              <Eye size={16} />
              Preview
            </span>
          </IconAction>

          <button
            type="button"
            onClick={onList}
            className={`inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 ${SALES_FOCUS_BUTTON}`}
          >
            <List size={16} />
            List
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex items-center gap-2 rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 ${SALES_FOCUS_BUTTON}`}
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default SalesQuotationFooter;
