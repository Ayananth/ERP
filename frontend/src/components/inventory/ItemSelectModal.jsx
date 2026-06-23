import { ClipboardList, X } from "lucide-react";
import { useMemo, useState } from "react";

const columns = [
  { key: "item_code", label: "ITEM CODE", placeholder: "Filter..." },
  { key: "name", label: "ITEM NAME", placeholder: "Filter..." },
];

function ItemSelectModal({
  isOpen,
  loading,
  items = [],
  onClose,
  onSelect,
}) {
  const [filters, setFilters] = useState({});

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        columns.every((column) => {
          const filterValue = filters[column.key]?.trim().toLowerCase();

          if (!filterValue) {
            return true;
          }

          return String(item[column.key] ?? "")
            .toLowerCase()
            .includes(filterValue);
        })
      ),
    [filters, items]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white">
              <ClipboardList size={17} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Items
              </h2>
              <p className="text-xs text-slate-500">
                Select an item to load its details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close item selector"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-[720px] w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="border-b border-slate-200 px-3 py-3 font-semibold"
                    >
                      <div>{column.label}</div>
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
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                      Loading items...
                    </td>
                  </tr>
                ) : null}

                {!loading && filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-500">
                      No items found.
                    </td>
                  </tr>
                ) : null}

                {!loading &&
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="cursor-pointer transition hover:bg-blue-50"
                    >
                      <td className="px-3 py-3 text-slate-700">{item.item_code}</td>
                      <td className="px-3 py-3 text-slate-700">{item.name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemSelectModal;
