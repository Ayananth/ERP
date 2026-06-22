import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvailableUnits, getItemUnits } from "../../api/inventoryApi";
import ItemPageLayout from "../../components/layout/ItemPageLayout";




function ItemUnitsPage() {


  const [availableUnits, setAvailableUnits] =
    useState([]);

  const [units, setUnits] = useState([]);

  const [settings, setSettings] = useState({
    sales_unit: "",
    stock_unit: "",
  });

  const [loading, setLoading] =
    useState(true);

    const { itemId } = useParams();


    const [unitForm, setUnitForm] = useState({
      unit: "",
      conversion_factor: 1,
    });


useEffect(() => {
  if (!itemId) return;

  loadData();
}, [itemId]);

const loadData = async () => {
  try {
    setLoading(true);

    const [
      unitsResponse,
      itemUnitsResponse,
    ] = await Promise.all([
      getAvailableUnits(),
      getItemUnits(itemId),
    ]);

    // Available units dropdown

    setAvailableUnits(
      unitsResponse.data
    );

    // Existing item units

    setUnits(
      itemUnitsResponse.data.units
    );

    // Unit settings

    setSettings({
      sales_unit:
        itemUnitsResponse.data
          .sales_unit || "",

      stock_unit:
        itemUnitsResponse.data
          .stock_unit || "",
    });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const handleAddUnit = () => {
    if (!unitForm.unit) return;

    const selectedUnit = availableUnits.find(
      (u) => String(u.id) === unitForm.unit
    );

    const exists = units.some(
      (u) => u.id === selectedUnit.id
    );

    if (exists) {
      return;
    }

    setUnits([
      ...units,
      {
        id: selectedUnit.id,
        unit_name: selectedUnit.name,
        conversion_factor:
          unitForm.conversion_factor,
      },
    ]);

    setUnitForm({
      unit: "",
      conversion_factor: 1,
    });
  };

  const removeUnit = (id) => {
    setUnits(
      units.filter((unit) => unit.id !== id)
    );
  };

  const saveSettings = () => {
    console.log(settings);

    /*
    PUT
    /api/inventory/items/{id}/unit-settings/
    */
  };


  if (loading) {
  return (
    <ItemPageLayout
      title="Item File"
      description="Units and barcode management"
    >
      <div className="p-6">
        Loading...
      </div>
    </ItemPageLayout>
  );
}


  return (
    <ItemPageLayout
      title="Item File"
      description="Units and barcode management"
    >
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white border rounded-lg">
            <div className="px-4 py-3 border-b font-medium">
              Unit Management
            </div>

            <div className="p-4">
              {/* Add Unit Row */}

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <label className="block text-sm mb-1">
                    Unit
                  </label>

                  <select
                    value={unitForm.unit}
                    onChange={(e) =>
                      setUnitForm({
                        ...unitForm,
                        unit: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                      Select Unit
                    </option>

                    {availableUnits.map(
                      (unit) => (
                        <option
                          key={unit.id}
                          value={unit.id}
                        >
                          {unit.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="col-span-4">
                  <label className="block text-sm mb-1">
                    Factor
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      unitForm.conversion_factor
                    }
                    onChange={(e) =>
                      setUnitForm({
                        ...unitForm,
                        conversion_factor:
                          e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-3 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddUnit}
                    className="w-full rounded bg-slate-200 hover:bg-slate-300 px-4 py-2"
                  >
                    + Add Unit
                  </button>
                </div>
              </div>

              {/* Existing Units */}

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">
                    Existing Units
                  </h3>

                  <span className="text-xs bg-slate-100 rounded-full px-2 py-1">
                    {units.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="border rounded px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {unit.unit_name}
                        </p>

                        <p className="text-xs text-slate-500">
                          x{" "}
                          {
                            unit.conversion_factor
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeUnit(unit.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white border rounded-lg">
            <div className="px-4 py-3 border-b font-medium">
              Unit Settings
            </div>

            <div className="p-4 space-y-6">
              {/* Sales Unit */}

              <div>
                <label className="block text-sm mb-1">
                  Sales Unit
                </label>

                <select
                  value={settings.sales_unit}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sales_unit:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    Select Sales Unit
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Unit */}

              <div>
                <label className="block text-sm mb-1">
                  Stock Unit
                </label>

                <select
                  value={settings.stock_unit}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stock_unit:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    Select Stock Unit
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={saveSettings}
                  className="bg-blue-600 text-white rounded px-4 py-2"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ItemPageLayout>
  );
}

export default ItemUnitsPage;