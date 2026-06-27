import { memo } from "react";

function SalesQuotationLayout({
  children,
  title = "Sales Quotation",
}) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-center text-[26px] font-semibold tracking-tight text-slate-800">
            {title}
          </h1>
        </div>

        <div className="space-y-4 p-4 md:p-5 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(SalesQuotationLayout);
