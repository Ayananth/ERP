import { useRef } from "react";
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
  onKeyDown,
  inputRef,
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
          ref={inputRef}
          className={baseClass}
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
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

function SearchField({
  label,
  value,
  placeholder,
  helper,
  readOnly = true,
  onChange,
  onKeyDown,
  inputRef,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <input
          ref={inputRef}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pb-3 pt-5 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-300"
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
      </div>
      {helper ? (
        <div className="text-right text-[11px] text-slate-400">{helper}</div>
      ) : null}
    </div>
  );
}

function SalesQuotationHeader({
  data,
  isEditing,
  onChange,
  firstInputRef,
  customers = [],
}) {
  const formRefs = useRef([]);

  const registerField = (index) => (element) => {
    formRefs.current[index] = element;
    if (index === 0 && firstInputRef) {
      firstInputRef.current = element;
    }
  };

  const handleHeaderEnter = (event, index) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    formRefs.current[index + 1]?.focus();
  };

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
      ?.name ?? "";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-3 xl:grid-cols-6">
        <FieldShell
          label="Quotation No"
          value={data.quotation_no}
          placeholder=""
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("quotation_no", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 0)}
          inputRef={registerField(0)}
        />

        <FieldShell
          label="Sales Quotation Type"
          value={data.quotation_type}
          placeholder="Select quotation type"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("quotation_type", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 1)}
          inputRef={registerField(1)}
        />

        <FieldShell
          label="Date"
          value={data.date}
          rightIcon={<CalendarDays size={16} />}
          accent
          type="date"
          placeholder=""
          readOnly={!isEditing}
          onChange={(event) => onChange("date", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 2)}
          inputRef={registerField(2)}
        />

        <div className="space-y-1">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Customer Search
            </span>
            {isEditing ? (
              <select
                ref={registerField(3)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pb-3 pt-5 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-300"
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
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          </div>
        </div>

        <FieldShell
          label="CusRefNum"
          value={data.customer_ref_no}
          placeholder=""
          helper="0/50"
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("customer_ref_no", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 4)}
          inputRef={registerField(4)}
        />

        <FieldShell
          label="Sales Executive"
          value={data.sales_executive}
          placeholder="Select Sales Executive"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("sales_executive", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 5)}
          inputRef={registerField(5)}
        />

        <FieldShell
          label="Attention"
          value={data.attention}
          placeholder=""
          helper="0/200"
          readOnly={!isEditing}
          onChange={(event) => onChange("attention", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 6)}
          inputRef={registerField(6)}
        />

        <FieldShell
          label="Pay Terms"
          value={data.pay_terms}
          placeholder=""
          helper="0/100"
          readOnly={!isEditing}
          onChange={(event) => onChange("pay_terms", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 7)}
          inputRef={registerField(7)}
        />

        <FieldShell
          label="Delivery Place"
          value={data.delivery_place}
          placeholder=""
          helper="0/150"
          readOnly={!isEditing}
          onChange={(event) => onChange("delivery_place", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 8)}
          inputRef={registerField(8)}
        />

        <FieldShell
          label="Currency"
          value={data.currency}
          placeholder="1 - SAUDI RIYAL"
          rightIcon={<ChevronDown size={16} />}
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("currency", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 9)}
          inputRef={registerField(9)}
        />

        <FieldShell
          label="Ex Rate"
          value={data.exchange_rate}
          placeholder="1"
          accent
          readOnly={!isEditing}
          onChange={(event) => onChange("exchange_rate", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 10)}
          inputRef={registerField(10)}
        />

        <FieldShell
          label="Notes"
          value={data.notes}
          placeholder=""
          helper="0/500"
          readOnly={!isEditing}
          onChange={(event) => onChange("notes", event.target.value)}
          onKeyDown={(event) => handleHeaderEnter(event, 11)}
          inputRef={registerField(11)}
        />
      </div>
    </section>
  );
}

export default SalesQuotationHeader;
