import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemPrices, saveItemPrices } from "../../api/inventoryApi";
import { DollarSign, Settings } from "lucide-react";
import Alert from "../../components/common/Alert";
import ItemPageLayout from "../../components/layout/ItemPageLayout";

export default function PriceListPage() {
const { itemId } = useParams();

const [prices, setPrices] = useState([]);
const [item, setItem] = useState(null);
const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [errors, setErrors] = useState({});


useEffect(() => {
  loadPrices();
}, [itemId]);

useEffect(() => {
  if (!message.text) return;

  const timer = setTimeout(() => {
    setMessage({
      type: "",
      text: "",
    });
  }, 5000);

  return () => clearTimeout(timer);
}, [message]);

const loadPrices = async () => {
  try {
    setLoading(true);

    const data = await getItemPrices(itemId);


    setItem({
      item_code: data.item_code,
      item_name: data.item_name,
    });

    setPrices(data.prices);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const validatePrices = () => {
  const newErrors = {};

  prices.forEach((row) => {
    const rowErrors = {};

    if (
      row.sale_price === "" ||
      row.sale_price === null ||
      row.sale_price === undefined
    ) {
      rowErrors.sale_price = "Sale price is required";
    } else if (
      Number.isNaN(Number(row.sale_price)) ||
      Number(row.sale_price) < 0
    ) {
      rowErrors.sale_price =
        "Sale price must be a valid non-negative number";
    }

    if (
      row.minimum_price === "" ||
      row.minimum_price === null ||
      row.minimum_price === undefined
    ) {
      rowErrors.minimum_price = "Minimum price is required";
    } else if (
      Number.isNaN(Number(row.minimum_price)) ||
      Number(row.minimum_price) < 0
    ) {
      rowErrors.minimum_price =
        "Minimum price must be a valid non-negative number";
    }

    if (Object.keys(rowErrors).length > 0) {
      newErrors[row.unit_id] = rowErrors;
    }
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handlePriceChange = (
  unitId,
  field,
  value
) => {
  setPrices((prev) =>
    prev.map((row) =>
      row.unit_id === unitId
        ? {
            ...row,
            [field]: value,
          }
        : row
    )
  );

  setErrors((prev) => {
    const rowErrors = prev[unitId];

    if (!rowErrors) return prev;

    const nextRowErrors = {
      ...rowErrors,
    };

    delete nextRowErrors[field];

    const nextErrors = {
      ...prev,
      [unitId]: nextRowErrors,
    };

    if (Object.keys(nextRowErrors).length === 0) {
      delete nextErrors[unitId];
    }

    return nextErrors;
  });
};

const handleSave = async () => {
  try {
    if (!validatePrices()) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });

      return;
    }

    await saveItemPrices(
    itemId,
    prices.map((row) => ({
        unit_id: row.unit_id,
        sale_price: Number(row.sale_price),
        minimum_price: Number(row.minimum_price),
    }))
    );


    await loadPrices();

    setEditing(false);
    setMessage({
      type: "success",
      text: "Prices saved successfully.",
    });

  } catch (error) {
    console.error(error);
    setMessage({
      type: "error",
      text: "Failed to save prices.",
    });
  }
};

if (loading) {
  return (
    <div className="p-4">
      Loading...
    </div>
  );
}

  return (
        <ItemPageLayout
      title="Item File"
      description="Pricing information"
    >
      <Alert
        type={message.type}
        message={message.text}
        onClose={() =>
          setMessage({
            type: "",
            text: "",
          })
        }
      />

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
                    {item && (
                    <>
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white">
                        {item.item_code}
                        </span>

                        <span className="text-sm text-slate-500">
                        {item.item_name}
                        </span>
                    </>
                    )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="border rounded px-3 py-1 text-xs flex items-center gap-1">
              <Settings size={12} />
              {prices.length} Units
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
                      type="number"
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
    </ItemPageLayout>

  );
}
