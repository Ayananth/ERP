import { useEffect, useRef, useState } from "react";

import { Plus, Search } from "lucide-react";

function CellInput({
  value,
  placeholder,
  align = "left",
  icon,
  readOnly = true,
  onChange,
  type = "text",
  ...inputProps
}) {
  return (
    <div className="relative">
        <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
        {...inputProps}
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

function ReadOnlyCell({ value, align = "right" }) {
  return (
    <input
      value={value}
      readOnly
      disabled
      className={`h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    />
  );
}

function SalesOrderLines({
  lines,
  isEditing,
  onChange,
  onItemSearch,
  onItemSelect,
  onAddLine,
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
      <div className="flex items-center justify-between bg-amber-100 px-4 py-3 text-sm font-medium text-amber-950">
        <span>Click the primary button to enable the form</span>
        {isEditing ? (
          <button
            type="button"
            onClick={onAddLine}
            className="inline-flex items-center gap-1 rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-950"
          >
            <Plus size={14} />
            Add Row
          </button>
        ) : null}
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
                <tr key={line.id} className="border-b border-slate-100">
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
                    <CellInput value={line.description} placeholder="" readOnly />
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
                      <ReadOnlyCell value={line.unit_name || line.unit} align="left" />
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      type="number"
                      value={line.qty}
                      placeholder=""
                      align="right"
                      min="0"
                      step="1"
                      readOnly={!isEditing}
                      onChange={(event) =>
                        onChange(line.id, "qty", event.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      type="number"
                      value={line.rate}
                      placeholder=""
                      align="right"
                      min="0"
                      step="1"
                      readOnly
                    />
                  </td>
                  <td className="px-2 py-2">
                    <CellInput
                      type="number"
                      value={line.discount_percent}
                      placeholder=""
                      align="right"
                      min="0"
                      max="100"
                      step="1"
                      readOnly={!isEditing}
                      onChange={(event) =>
                        onChange(line.id, "discount_percent", event.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <ReadOnlyCell value={line.discount_amount} />
                  </td>
                  <td className="px-2 py-2">
                    <ReadOnlyCell value={line.net} />
                  </td>
                  <td className="px-2 py-2">
                    <ReadOnlyCell value={line.vat} />
                  </td>
                  <td className="px-2 py-2">
                    <ReadOnlyCell value={line.net_after_vat} />
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

export default SalesOrderLines;
