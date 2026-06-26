import { ClipboardList, X } from "lucide-react";
import { useMemo, useState } from "react";

import useSelectModalKeyboard from "../../hooks/useSelectModalKeyboard";
import {
  SALES_FOCUS_BUTTON_ICON,
  SALES_FOCUS_FIELD,
  SALES_FOCUS_SELECTABLE_ROW,
} from "./salesFocusStyles";

const columns = [
  { key: "order_no", label: "ORDER NO", placeholder: "Filter..." },
  { key: "customer_name", label: "CUSTOMER", placeholder: "Filter..." },
  { key: "order_date", label: "DATE", placeholder: "dd-mm-yyyy" },
  { key: "total_net_amount", label: "NET", placeholder: "" },
];

function formatAmount(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toFixed(2) : "0.00";
}

function SalesOrderSelectModal({
  isOpen,
  loading,
  orders = [],
  onClose,
  onSelect,
}) {
  const [filters, setFilters] = useState({});

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        columns.every((column) => {
          const filterValue = filters[column.key]?.trim().toLowerCase();

          if (!filterValue) {
            return true;
          }

          return String(order[column.key] ?? "")
            .toLowerCase()
            .includes(filterValue);
        })
      ),
    [filters, orders]
  );

  const { panelRef, getRowProps, isRowHighlighted } = useSelectModalKeyboard({
    isOpen,
    items: filteredOrders,
    loading,
    onSelect,
    onClose,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-4 backdrop-blur-[2px]">
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl outline-none"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white">
              <ClipboardList size={17} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Sales Orders
              </h2>
              <p className="text-xs text-slate-500">
                Select an order to load
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${SALES_FOCUS_BUTTON_ICON}`}
            aria-label="Close order selector"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <div className="min-h-0 flex-1 overflow-auto rounded-md border border-slate-200">
            <table className="min-w-[900px] w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
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
                          className={`mt-2 h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs font-normal text-slate-700 transition ${SALES_FOCUS_FIELD}`}
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      Loading sales orders...
                    </td>
                  </tr>
                ) : null}

                {!loading && filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      No sales orders found.
                    </td>
                  </tr>
                ) : null}

                {!loading &&
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      {...getRowProps(index, order)}
                      className={`${SALES_FOCUS_SELECTABLE_ROW} ${
                        isRowHighlighted(index) ? "bg-blue-100" : ""
                      }`}
                    >
                      <td className="px-3 py-3 text-slate-700">{order.order_no}</td>
                      <td className="px-3 py-3 text-slate-700">{order.customer_name}</td>
                      <td className="px-3 py-3 text-slate-700">{order.order_date}</td>
                      <td className="px-3 py-3 text-right text-slate-700">
                        {formatAmount(order.total_net_amount)}
                      </td>
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

export default SalesOrderSelectModal;
