import { memo } from "react";

import { SALES_FOCUS_FIELD } from "../sales/salesFocusStyles";

const inputClassName = `w-32 rounded border px-3 py-2 text-right disabled:bg-slate-50 ${SALES_FOCUS_FIELD}`;

function PriceListTable({
  editing,
  errors,
  firstSalePriceRef,
  handleFieldEnter,
  handlePriceChange,
  prices,
  registerField,
}) {
  const registerPriceField = (index, isFirstSalePrice) => (element) => {
    registerField(index)(element);

    if (isFirstSalePrice && firstSalePriceRef) {
      firstSalePriceRef.current = element;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="overflow-hidden rounded-md border">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Price List Type
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium">Unit</th>

              <th className="px-4 py-3 text-left text-sm font-medium">
                Sale Price
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium">
                Minimum Selling Price
              </th>
            </tr>
          </thead>

          <tbody>
            {prices.map((row, index) => {
              const saleFieldIndex = index * 2;
              const minimumFieldIndex = index * 2 + 1;

              return (
                <tr key={row.unit_id} className="border-b last:border-0">
                  {index === 0 && (
                    <td
                      rowSpan={prices.length}
                      className="px-4 py-4 align-middle"
                    >
                      <span className="inline-block rounded bg-blue-600 px-2 py-1 text-xs text-white">
                        RETAIL
                      </span>
                    </td>
                  )}

                  <td className="px-4 py-4">
                    <span className="inline-block rounded border bg-slate-50 px-2 py-1 text-xs">
                      {row.unit_code}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <input
                      ref={registerPriceField(saleFieldIndex, index === 0)}
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
                      onKeyDown={(event) =>
                        handleFieldEnter(event, saleFieldIndex)
                      }
                      className={inputClassName}
                    />
                    {errors[row.unit_id]?.sale_price && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[row.unit_id].sale_price}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <input
                      ref={registerPriceField(minimumFieldIndex, false)}
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
                      onKeyDown={(event) =>
                        handleFieldEnter(event, minimumFieldIndex)
                      }
                      className={inputClassName}
                    />
                    {errors[row.unit_id]?.minimum_price && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[row.unit_id].minimum_price}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(PriceListTable);
