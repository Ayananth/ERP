import { memo } from "react";
function PriceListTable({
  editing,
  errors,
  firstSalePriceRef,
  handlePriceChange,
  prices,
}) {
  return (
    <div className="p-4 flex-1 overflow-auto">
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">
                Price List Type
              </th>

              <th className="text-left px-4 py-3 text-sm font-medium">
                Unit
              </th>

              <th className="text-left px-4 py-3 text-sm font-medium">
                Sale Price
              </th>

              <th className="text-left px-4 py-3 text-sm font-medium">
                Minimum Selling Price
              </th>
            </tr>
          </thead>

          <tbody>
            {prices.map((row, index) => (
              <tr
                key={row.unit_id}
                className="border-b last:border-0"
              >
                {index === 0 && (
                  <td
                    rowSpan={prices.length}
                    className="px-4 py-4 align-middle"
                  >
                    <span className="inline-block px-2 py-1 text-xs rounded bg-blue-600 text-white">
                      RETAIL
                    </span>
                  </td>
                )}

                <td className="px-4 py-4">
                  <span className="inline-block px-2 py-1 text-xs border rounded bg-slate-50">
                    {row.unit_code}
                  </span>
                </td>

                <td className="px-4 py-4">
                    <input
                      ref={index === 0 ? firstSalePriceRef : undefined}
                      type="number"
                      min="0"
                      step="1"
                      disabled={!editing}
                      value={row.sale_price ?? ""}
                    onChange={(e) =>
                      handlePriceChange(
                        row.unit_id,
                        "sale_price",
                        e.target.value
                      )
                    }
                    className="w-32 border rounded px-3 py-2 text-right disabled:bg-slate-50"
                  />
                  {errors[row.unit_id]?.sale_price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[row.unit_id].sale_price}
                    </p>
                  )}
                </td>

                <td className="px-4 py-4">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      disabled={!editing}
                      value={row.minimum_price ?? ""}
                    onChange={(e) =>
                      handlePriceChange(
                        row.unit_id,
                        "minimum_price",
                        e.target.value
                      )
                    }
                    className="w-32 border rounded px-3 py-2 text-right disabled:bg-slate-50"
                  />
                  {errors[row.unit_id]?.minimum_price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[row.unit_id].minimum_price}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(PriceListTable);
