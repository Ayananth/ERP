import { useEffect, useState } from "react";
import { DollarSign, Settings } from "lucide-react";

export default function PriceListPage() {
  const [prices, setPrices] = useState([
    {
      id: 1,
      unit: "Pcs",
      sale_price: 100,
      minimum_price: 90,
    },
    {
      id: 2,
      unit: "Nos",
      sale_price: 150,
      minimum_price: 140,
    },
  ]);

  const [editing, setEditing] = useState(false);

  const handlePriceChange = (id, field, value) => {
    setPrices((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const handleSave = async () => {
    try {
      // API CALL HERE

      /*
      await axios.put(
        `/api/inventory/items/${itemId}/prices/`,
        {
          prices
        }
      );
      */

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <DollarSign
              size={18}
              className="mt-1 text-slate-700"
            />

            <div>
              <h2 className="font-semibold text-slate-800">
                Price List Management
              </h2>

              <div className="flex gap-2 mt-1">
                {/* <span className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white">
                  10000594
                </span>

                <span className="text-sm text-slate-500">
                  Bus
                </span> */}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="border rounded px-3 py-1 text-xs flex items-center gap-1">
              <Settings size={12} />
              2 Units
            </button>

            <button className="border rounded px-3 py-1 text-xs flex items-center gap-1">
              <Settings size={12} />
              1 Price Type
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
                  key={row.id}
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
                      {row.unit}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      disabled={!editing}
                      value={row.sale_price}
                      onChange={(e) =>
                        handlePriceChange(
                          row.id,
                          "sale_price",
                          e.target.value
                        )
                      }
                      className="w-32 border rounded px-3 py-2 text-right disabled:bg-slate-50"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      disabled={!editing}
                      value={row.minimum_price}
                      onChange={(e) =>
                        handlePriceChange(
                          row.id,
                          "minimum_price",
                          e.target.value
                        )
                      }
                      className="w-32 border rounded px-3 py-2 text-right disabled:bg-slate-50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="border-t bg-slate-50 px-4 py-3 flex justify-end gap-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2 rounded bg-emerald-500 text-white"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded bg-emerald-500 text-white"
          >
            Save
          </button>
        )}

        <button className="px-6 py-2 rounded bg-violet-500 text-white">
          List
        </button>

        <button className="px-6 py-2 rounded bg-slate-600 text-white">
          Clear
        </button>
      </div>
    </div>
  );
}