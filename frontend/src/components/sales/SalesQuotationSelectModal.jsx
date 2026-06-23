import { ClipboardList, X } from "lucide-react";
import { useMemo, useState } from "react";

const columns = [
  { key: "quotation_no", label: "QUOTATION NO", placeholder: "Filter..." },
  { key: "delivery_place", label: "DELIVERY PLACE", placeholder: "Filter..." },
  { key: "quotation_date", label: "ISSUE DATE", placeholder: "dd-mm-yyyy" },
  { key: "customer_ref_no", label: "CUSTOMER REF NO", placeholder: "Filter..." },
  { key: "customer_code", label: "CUSTOMER CODE", placeholder: "Filter..." },
  { key: "customer_name", label: "CUSTOMER NAME", placeholder: "Filter..." },
  { key: "salesman_code", label: "SALESMAN CODE", placeholder: "Filter..." },
  { key: "net", label: "NET", placeholder: "" },
];

function formatAmount(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toFixed(2) : "0.00";
}

function SalesQuotationSelectModal({
  isOpen,
  loading,
  quotations = [],
  onClose,
  onSelect,
}) {
  const [filters, setFilters] = useState({});

  const filteredQuotations = useMemo(
    () =>
      quotations.filter((quotation) =>
        columns.every((column) => {
          const filterValue = filters[column.key]?.trim().toLowerCase();

          if (!filterValue) {
            return true;
          }

          return String(quotation[column.key] ?? "")
            .toLowerCase()
            .includes(filterValue);
        })
      ),
    [filters, quotations]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white">
              <ClipboardList size={17} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Sales Quotations
              </h2>
              <p className="text-xs text-slate-500">
                Select a quotation to load
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close quotation selector"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-[980px] w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="border-b border-slate-200 px-3 py-3 font-semibold"
                    >
                      <div>{column.label}</div>
                      {column.placeholder ? (
                        <input
                          type="text"
                          value={filters[column.key] ?? ""}
                          onChange={(event) =>
                            setFilters((prev) => ({
                              ...prev,
                              [column.key]: event.target.value,
                            }))
                          }
                          placeholder={column.placeholder}
                          className="mt-2 h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs font-normal text-slate-700 outline-none transition focus:border-blue-400"
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                      Loading quotations...
                    </td>
                  </tr>
                ) : null}

                {!loading && filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                      No quotations found.
                    </td>
                  </tr>
                ) : null}

                {!loading &&
                  filteredQuotations.map((quotation) => (
                    <tr
                      key={quotation.id}
                      onClick={() => onSelect(quotation)}
                      className="cursor-pointer transition hover:bg-blue-50"
                    >
                      <td className="px-3 py-3 text-slate-700">{quotation.quotation_no}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.delivery_place}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.quotation_date}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.customer_ref_no}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.customer_code}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.customer_name}</td>
                      <td className="px-3 py-3 text-slate-700">{quotation.salesman_code}</td>
                      <td className="px-3 py-3 text-right text-slate-700">
                        {formatAmount(quotation.net)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <button
                type="button"
                disabled
                className="rounded px-2 py-1 text-slate-300"
              >
                ‹
              </button>
              <span className="rounded bg-blue-500 px-3 py-1.5 font-medium text-white">
                1
              </span>
              <button
                type="button"
                disabled
                className="rounded px-2 py-1 text-slate-300"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesQuotationSelectModal;
