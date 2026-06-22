import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAvailableUnits, getItemUnits, addItemUnit, deleteItemUnit, saveItemUnitSettings } from "../../api/inventoryApi";
import Alert from "../../components/common/Alert";
import ItemPageLayout from "../../components/layout/ItemPageLayout";




function ItemUnitsPage() {


  const [availableUnits, setAvailableUnits] =
    useState([]);

    const [saving, setSaving] = useState(false);

  const [units, setUnits] = useState([]);

  const [settings, setSettings] = useState({
    sales_unit: "",
    stock_unit: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [errors, setErrors] = useState({
    unit: "",
    conversion_factor: "",
    sales_unit: "",
    stock_unit: "",
  });

    const { itemId } = useParams();


    const [unitForm, setUnitForm] = useState({
      unit: "",
      conversion_factor: 1,
    });


useEffect(() => {
  if (!itemId) return;

  loadData();
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

const clearFieldError = (name) => {
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  return fallback;
};

const validateUnitForm = () => {
  const newErrors = {};

  if (!unitForm.unit) {
    newErrors.unit = "Unit is required";
  }

  if (
    unitForm.conversion_factor === "" ||
    unitForm.conversion_factor === null ||
    Number(unitForm.conversion_factor) <= 0
  ) {
    newErrors.conversion_factor =
      "Factor must be greater than 0";
  }

  setErrors((prev) => ({
    ...prev,
    unit: newErrors.unit || "",
    conversion_factor: newErrors.conversion_factor || "",
  }));

  return Object.keys(newErrors).length === 0;
};

const validateSettings = () => {
  const newErrors = {};

  if (!settings.sales_unit) {
    newErrors.sales_unit = "Sales unit is required";
  }

  if (!settings.stock_unit) {
    newErrors.stock_unit = "Stock unit is required";
  }

  setErrors((prev) => ({
    ...prev,
    sales_unit: newErrors.sales_unit || "",
    stock_unit: newErrors.stock_unit || "",
  }));

  return Object.keys(newErrors).length === 0;
};


const saveSettings = async () => {


  try {
    if (!validateSettings()) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });

      return;
    }

    setSaving(true);

    await saveItemUnitSettings(
      itemId,
      {
        stock_unit: Number(
          settings.stock_unit
        ),
        sales_unit: Number(
          settings.sales_unit
        ),
      }
    );

    setMessage({
      type: "success",
      text: "Settings saved successfully.",
    });
  } catch (error) {
    console.error(error);

    setMessage({
      type: "error",
      text: "Failed to save settings.",
    });
  } finally {
    setSaving(false);
  }
};


const handleAddUnit = async () => {
  try {
    if (!validateUnitForm()) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });

      return;
    }

    setSaving(true);

    const response =
      await addItemUnit(itemId, {
        unit: Number(unitForm.unit),
        conversion_factor:
          Number(
            unitForm.conversion_factor
          ),
      });

    setUnits((prev) => [
      ...prev,
      response.data,
    ]);

    setUnitForm({
      unit: "",
      conversion_factor: 1,
    });

    setErrors((prev) => ({
      ...prev,
      unit: "",
      conversion_factor: "",
    }));

    setMessage({
      type: "success",
      text: "Unit added successfully.",
    });
  } catch (error) {
            console.error(error);

    setMessage({
      type: "error",
      text: "Failed to add unit.",
    });
  }finally {
    setSaving(false);
  }
};

const handleDeleteUnit = async (
  itemUnitId
) => {
  const deletedUnit =
    units.find(
      (u) =>
        u.id === itemUnitId
    );

  try {
    await deleteItemUnit(
      itemUnitId
    );

    setUnits((prev) =>
      prev.filter(
        (unit) =>
          unit.id !== itemUnitId
      )
    );

    if (
      Number(
        settings.stock_unit
      ) === deletedUnit.unit
    ) {
      setSettings((prev) => ({
        ...prev,
        stock_unit: "",
      }));
    }

    if (
      Number(
        settings.sales_unit
      ) === deletedUnit.unit
    ) {
      setSettings((prev) => ({
        ...prev,
        sales_unit: "",
      }));
    }

    setMessage({
      type: "success",
      text: "Item unit deleted successfully.",
    });
  } catch (error) {

    console.error(error);

    setMessage({
      type: "error",
      text: getApiErrorMessage(
        error,
        "Failed to delete item unit."
      ),
    });
  }
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
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white border rounded-lg">
            <div className="px-4 py-3 border-b font-medium">
              Unit Management
            </div>

            <div className="p-4">
              {(errors.unit || errors.conversion_factor) && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Please correct the highlighted unit fields.
                </div>
              )}

              {/* Add Unit Row */}

              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <label className="block text-sm mb-1">
                    Unit
                  </label>

                  <select
                    value={unitForm.unit}
                    onChange={(e) => {
                      setUnitForm({
                        ...unitForm,
                        unit: e.target.value,
                      });
                      clearFieldError("unit");
                    }}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                      Select Unit
                    </option>

                  {availableUnits
                    .filter(
                      (availableUnit) =>
                        !units.some(
                          (itemUnit) =>
                            itemUnit.unit ===
                            availableUnit.id
                        )
                    )
                    .map((unit) => (
                      <option
                        key={unit.id}
                        value={unit.id}
                      >
                        {unit.name}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.unit}
                    </p>
                  )}
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
                    onChange={(e) => {
                      setUnitForm({
                        ...unitForm,
                        conversion_factor:
                          e.target.value,
                      });
                      clearFieldError("conversion_factor");
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.conversion_factor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.conversion_factor}
                    </p>
                  )}
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
                          handleDeleteUnit(unit.id)
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
              {(errors.sales_unit || errors.stock_unit) && (
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Please correct the highlighted settings.
                </div>
              )}

              {/* Sales Unit */}

              <div>
                <label className="block text-sm mb-1">
                  Sales Unit
                </label>

                  <select
                    value={settings.sales_unit}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        sales_unit: e.target.value
                          ? Number(e.target.value)
                          : "",
                      });
                      clearFieldError("sales_unit");
                    }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    Select Sales Unit
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.unit}
                    >
                      {unit.unit_name}
                    </option>
                    ))}
                </select>
                {errors.sales_unit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sales_unit}
                  </p>
                )}
              </div>

              {/* Stock Unit */}

              <div>
                <label className="block text-sm mb-1">
                  Stock Unit
                </label>

                <select
                  value={settings.stock_unit}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        stock_unit: e.target.value
                          ? Number(e.target.value)
                          : "",
                      });
                      clearFieldError("stock_unit");
                    }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">
                    Select Stock Unit
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.unit}
                    >
                      {unit.unit_name}
                    </option>
                    ))}
                </select>
                {errors.stock_unit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stock_unit}
                  </p>
                )}
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={saving}
                  className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Settings"}
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
