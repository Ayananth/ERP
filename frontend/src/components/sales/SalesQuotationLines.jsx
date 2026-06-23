import { Search } from "lucide-react";

function CellInput({ value, placeholder, align = "left", icon }) {
  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        readOnly
        className={`h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 ${
          align === "right" ? "text-right" : "text-left"
        } ${icon ? "pr-10" : ""}`}
      />
      {icon ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </span>
      ) : null}
    </div>
  );
}

function SalesQuotationLines({ lines }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-amber-100 px-4 py-3 text-sm font-medium text-amber-950">
        Click 'New/Edit' to enable the form
      </div>

      <div className="overflow-x-auto">
        <div className="min-h-[420px] min-w-[1280px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#111827] text-white">
                <th className="w-14 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    # Row
                  </div>
                </th>
                <th className="w-40 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Code</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">TEXT</div>
                </th>
                <th className="w-[320px] border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Description</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">TEXT</div>
                </th>
                <th className="w-40 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Unit</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">DROPDOWN</div>
                </th>
                <th className="w-24 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Qty</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-28 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Rate</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-28 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Disc %</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-28 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Disc Amt</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-32 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">NET</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-28 border-r border-white/10 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">VAT</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
                <th className="w-36 px-3 py-3 text-left">
                  <div className="text-sm font-semibold">Net After VAT</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">NUMBER</div>
                </th>
              </tr>
            </thead>

            <tbody>
              {lines.map((line, index) => (
                <tr
                  key={line.id}
                  className="border-b border-slate-100"
                >
                  <td className="px-3 py-3 align-top">
                    <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 text-sm text-slate-600">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.item_code}
                      placeholder=""
                      icon={<Search size={14} />}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.description}
                      placeholder=""
                      icon={<Search size={14} />}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.unit}
                      placeholder=""
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.qty}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.rate}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.discount_percent}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.discount_amount}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.net}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.vat}
                      placeholder=""
                      align="right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.net_after_vat}
                      placeholder=""
                      align="right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SalesQuotationLines;
