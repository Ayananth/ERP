import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";

function CellInput({
  value,
  placeholder,
  align = "left",
  icon,
  readOnly = true,
  onChange,
}) {
  return (
    <div className="relative">
      <input
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
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

function SalesQuotationLines({
  lines,
  isEditing,
  onChange,
  onItemSearch,
  onItemSelect,
}) {
  const [searchResults, setSearchResults] = useState({});
  const searchTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(searchTimeoutRef.current), []);

  const handleSearchChange = (lineId, value) => {
    onChange(lineId, "item_code", value);

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await onItemSearch(value);
      setSearchResults((prev) => ({
        ...prev,
        [lineId]: results,
      }));
    }, 250);
  };

  const handleItemPick = (lineId, item) => {
    setSearchResults((prev) => ({
      ...prev,
      [lineId]: [],
    }));
    onItemSelect(lineId, item);
  };

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
                    <div className="relative">
                      <CellInput
                        value={line.item_code}
                        placeholder=""
                        icon={<Search size={14} />}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          handleSearchChange(line.id, event.target.value)
                        }
                      />
                      {isEditing && searchResults[line.id]?.length ? (
                        <div className="absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
                          {searchResults[line.id].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50"
                            onClick={() => handleItemPick(line.id, item)}
                          >
                              <div className="font-medium text-slate-700">
                                {item.item_code}
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.description}
                      placeholder=""
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "description", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    {isEditing ? (
                      <select
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
                        value={line.unit}
                        onChange={(event) =>
                          onChange(line.id, "unit", event.target.value)
                        }
                      >
                        <option value="">Select unit</option>
                        {(line.unit_options ?? []).map((unit) => (
                          <option key={unit.unit_id} value={unit.unit_id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <CellInput
                        value={line.unit_name || line.unit}
                        placeholder=""
                        readOnly
                      />
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.qty}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "qty", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.rate}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "rate", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.discount_percent}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "discount_percent", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.discount_amount}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "discount_amount", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.net}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "net", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.vat}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "vat", event.target.value)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      value={line.net_after_vat}
                      placeholder=""
                      align="right"
                      readOnly={!isEditing}
                      onChange={(event) => onChange(line.id, "net_after_vat", event.target.value)}
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
