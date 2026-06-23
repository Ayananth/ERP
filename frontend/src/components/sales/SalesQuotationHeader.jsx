import { CalendarDays, ChevronDown, Search } from "lucide-react";

function FieldShell({
  label,
  value,
  placeholder,
  rightIcon,
  accent = false,
  helper,
}) {
  const baseClass = `w-full rounded-lg border px-3 pb-3 pt-5 text-sm outline-none transition ${
    accent
      ? "border-violet-200 bg-white text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.05)] focus:border-violet-400"
      : "border-slate-200 bg-slate-50 text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.04)] focus:border-slate-300"
  }`;

  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <input
          className={baseClass}
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
        />
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-slate-400">
          {rightIcon}
        </div>
      </div>
      {helper ? (
        <div className="text-right text-[11px] text-slate-400">{helper}</div>
      ) : null}
    </div>
  );
}

function SearchField({
  label,
  value,
  placeholder,
  helper,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <input
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pb-3 pt-5 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-300"
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly
        />
        <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
      </div>
      {helper ? (
        <div className="text-right text-[11px] text-slate-400">{helper}</div>
      ) : null}
    </div>
  );
}

function SalesQuotationHeader({ data }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-3 xl:grid-cols-6">
        <FieldShell
          label="Quotation No"
          value={data.quotation_no}
          placeholder=""
          accent
        />

        <FieldShell
          label="Sales Quotation Type"
          value={data.quotation_type}
          placeholder="Select quotation type"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Date"
          value={data.date}
          placeholder="18-06-2026"
          rightIcon={<CalendarDays size={16} />}
          accent
        />

        <SearchField
          label="Customer Search"
          value={data.customer}
          placeholder=""
        />

        <FieldShell
          label="CusRefNum"
          value={data.customer_ref_no}
          placeholder=""
          helper="0/50"
          accent
        />

        <FieldShell
          label="Sales Executive"
          value={data.sales_executive}
          placeholder="Select Sales Executive"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Attention"
          value={data.attention}
          placeholder=""
          helper="0/200"
        />

        <FieldShell
          label="Pay Terms"
          value={data.pay_terms}
          placeholder=""
          helper="0/100"
        />

        <FieldShell
          label="Delivery Place"
          value={data.delivery_place}
          placeholder=""
          helper="0/150"
        />

        <FieldShell
          label="Currency"
          value={data.currency}
          placeholder="1 - SAUDI RIYAL"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Ex Rate"
          value={data.exchange_rate}
          placeholder="1"
          accent
        />

        <FieldShell
          label="Notes"
          value={data.notes}
          placeholder=""
          helper="0/500"
        />
      </div>
    </section>
  );
}

export default SalesQuotationHeader;
