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

function SearchField({ label, value, placeholder }) {
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
        <Search
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
          size={16}
        />
      </div>
    </div>
  );
}

function SalesOrderHeader({ data }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-3 xl:grid-cols-6">
        <FieldShell label="SO No" value={data.order_no} placeholder="" accent />

        <FieldShell
          label="Sales Order Type"
          value={data.order_type}
          placeholder="Select sales order type"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Issue Date"
          value={data.issue_date}
          placeholder="18-06-2026"
          rightIcon={<CalendarDays size={16} />}
          accent
        />

        <FieldShell
          label="Valid Date"
          value={data.valid_date}
          placeholder="18-07-2026"
          rightIcon={<CalendarDays size={16} />}
          accent
        />

        <FieldShell
          label="No quotation linked"
          value={data.linked_quotation}
          placeholder=""
          accent
        />

        <FieldShell
          label="Customer PO"
          value={data.customer_po}
          placeholder=""
          accent
        />

        <SearchField
          label="Customer Search"
          value={data.customer}
          placeholder=""
        />

        <FieldShell
          label="Sales Executive"
          value={data.sales_executive}
          placeholder="Select sales executive"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Currency"
          value={data.currency}
          placeholder="1 - SAUDI RIYAL"
          rightIcon={<ChevronDown size={16} />}
          accent
        />

        <FieldShell
          label="Exchange Rate"
          value={data.exchange_rate}
          placeholder="1.00"
          accent
        />

        <FieldShell
          label="Delivery Place"
          value={data.delivery_place}
          placeholder=""
        />

        <FieldShell
          label="Notes"
          value={data.notes}
          placeholder=""
        />
      </div>
    </section>
  );
}

export default SalesOrderHeader;
