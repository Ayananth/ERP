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

function SummaryField({ label }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm">
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function IconAction({ children, label, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${
        disabled
          ? "cursor-not-allowed bg-slate-200 text-slate-400"
          : className
      }`}
    >
      {children ?? label}
    </button>
  );
}

function SalesQuotationFooter({ isEditing, onAction, onCancel, newEditButtonRef }) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-4 xl:grid-cols-5">
        <SummaryField label="Gross" />
        <SummaryField label="Disc" />
        <SummaryField label="Net Total" />
        <SummaryField label="VAT" />
        <SummaryField label="Net After VAT" />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <button
            type="button"
            ref={newEditButtonRef}
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            {isEditing ? <Save size={16} /> : <PencilLine size={16} />}
            {isEditing ? "Save" : "New/Edit"}
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
            disabled
            className="bg-slate-200 text-slate-400"
            label="Preview"
          >
            <span className="inline-flex items-center gap-2">
              <Eye size={16} />
              Preview
            </span>
          </IconAction>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            <List size={16} />
            List
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
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
