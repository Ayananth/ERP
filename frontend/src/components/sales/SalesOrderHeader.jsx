import { CalendarDays, ChevronDown, Search } from "lucide-react";

function FieldShell({
  label,
  value,
  placeholder,
  rightIcon,
  accent = false,
  helper,
  type = "text",
  readOnly = true,
  onChange,
  onClick,
  inputRef,
  onKeyDown,
}) {
  const baseClass = `w-full rounded-lg border px-3 pb-3 pt-5 text-sm outline-none transition ${
    accent
      ? "border-violet-200 bg-white text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.05)] focus:border-violet-400"
      : "border-slate-200 bg-slate-50 text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.04)] focus:border-slate-300"
  } ${onClick ? "cursor-pointer" : ""}`;

  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <input
          ref={inputRef}
          className={baseClass}
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
          onClick={onClick}
          onKeyDown={onKeyDown}
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

function SalesOrderHeader({
  data,
  isEditing,
  onChange,
  onQuotationClick,
  firstInputRef,
  customers = [],
}) {
  const handleCustomerKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      if (typeof event.currentTarget.showPicker === "function") {
        event.currentTarget.showPicker();
        return;
      }

      event.currentTarget.focus();
      event.currentTarget.click();
    }
  };

  const selectedCustomerName =
    customers.find((customer) => String(customer.id) === String(data.customer))
      ?.name ?? data.customer_display ?? "";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-3 xl:grid-cols-6">
        <FieldShell
          label="SO No"
          value={data.order_no}
          placeholder=""
          accent
          readOnly
        />

        <FieldShell
          label="Sales Order Type"
          value={data.order_type}
          placeholder="Select sales order type"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("order_type", event.target.value)}
        />

        <FieldShell
          label="Issue Date"
          value={data.issue_date}
          placeholder="18-06-2026"
          rightIcon={<CalendarDays size={16} />}
          accent
          type="date"
          readOnly={!isEditing}
          onChange={(event) => onChange("issue_date", event.target.value)}
          inputRef={firstInputRef}
        />

        <FieldShell
          label="Valid Date"
          value={data.valid_date}
          placeholder="18-07-2026"
          rightIcon={<CalendarDays size={16} />}
          accent
          type="date"
          readOnly={!isEditing}
          onChange={(event) => onChange("valid_date", event.target.value)}
        />

        <FieldShell
          label="Linked Quotation"
          value={data.linked_quotation}
          placeholder="No quotation linked"
          accent
          readOnly={!isEditing}
          onClick={isEditing ? onQuotationClick : undefined}
          onChange={(event) => onChange("linked_quotation", event.target.value)}
        />

        <FieldShell
          label="Customer PO"
          value={data.customer_po}
          placeholder=""
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("customer_po", event.target.value)}
        />

        <div className="space-y-1">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Customer Search
            </span>
            {isEditing ? (
              <select
                className="w-full appearance-none rounded-lg border border-violet-200 bg-white px-3 pb-3 pt-5 pr-10 text-sm text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.05)] outline-none transition focus:border-violet-400"
                value={data.customer}
                onChange={(event) => onChange("customer", event.target.value)}
                onKeyDown={handleCustomerKeyDown}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pb-3 pt-5 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-300"
                type="text"
                value={selectedCustomerName}
                placeholder=""
                readOnly
              />
            )}
            <Search
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              size={16}
            />
          </div>
        </div>

        <FieldShell
          label="Sales Executive"
          value={data.sales_executive}
          placeholder="Select sales executive"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("sales_executive", event.target.value)}
        />

        <FieldShell
          label="Currency"
          value={data.currency}
          placeholder="1 - SAUDI RIYAL"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("currency", event.target.value)}
        />

        <FieldShell
          label="Exchange Rate"
          value={data.exchange_rate}
          placeholder="1.00"
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("exchange_rate", event.target.value)}
        />

        <FieldShell
          label="Delivery Place"
          value={data.delivery_place}
          placeholder=""
          readOnly={!isEditing}
          onChange={(event) => onChange("delivery_place", event.target.value)}
        />

        <FieldShell
          label="Notes"
          value={data.notes}
          placeholder=""
          readOnly={!isEditing}
          onChange={(event) => onChange("notes", event.target.value)}
        />
      </div>
    </section>
  );
}

export default SalesOrderHeader;
