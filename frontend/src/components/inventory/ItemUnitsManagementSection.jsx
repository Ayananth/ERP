export default function ItemUnitsManagementSection({
  availableUnits,
  clearFieldError,
  errors,
  handleAddUnit,
  handleDeleteUnit,
  setUnitForm,
  unitForm,
  units,
}) {
  return (
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

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5">
            <label className="block text-sm mb-1">
              Unit
            </label>

            <select
              value={unitForm.unit}
              onChange={(e) => {
                setUnitForm((prev) => ({
                  ...prev,
                  unit: e.target.value,
                }));
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
              value={unitForm.conversion_factor}
              onChange={(e) => {
                setUnitForm((prev) => ({
                  ...prev,
                  conversion_factor: e.target.value,
                }));
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
                    x {unit.conversion_factor}
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
  );
}
