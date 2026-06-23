function SalesQuotationLayout({ children }) {
  const tabs = [
    { label: "Sales Quotation", active: true },
    { label: "Item File" },
    { label: "Sales Order" },
    { label: "Purchase Requisition" },
    { label: "Purchase Order" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#111827] px-4 py-2 text-slate-200 shadow-sm">
        <div className="flex max-w-full gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.label}
              className={`relative whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ${
                tab.active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.active && (
                <span className="absolute inset-x-3 -bottom-2 h-1 rounded-full bg-violet-500" />
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 text-xs text-slate-300 lg:flex">
          <span className="rounded-full border border-white/10 px-3 py-1">
            Sales
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Quotation
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-center text-[26px] font-semibold tracking-tight text-slate-800">
            Sales Quotation
          </h1>
        </div>

        <div className="space-y-4 p-4 md:p-5 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SalesQuotationLayout;
