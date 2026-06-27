import { memo } from "react";

import { SALES_FOCUS_FIELD } from "../sales/salesFocusStyles";

const fieldClassName = `w-full rounded border px-3 py-2 ${SALES_FOCUS_FIELD}`;

function ItemUnitsManagementSection({
  availableUnits,
  clearFieldError,
  errors,
  handleAddUnit,
  handleDeleteUnit,
  handleFieldEnter,
  handleSelectKeyDown,
  registerField,
  saving = false,
  setUnitForm,
  unitForm,
  units,
}) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-4 py-3 font-medium">Unit Management</div>

      <div className="p-4">
        {(errors.unit || errors.conversion_factor) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Please correct the highlighted unit fields.
          </div>
        )}

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5">
            <label className="mb-1 block text-sm">Unit</label>

            <select
              ref={registerField(0)}
              value={unitForm.unit}
              onChange={(e) => {
                setUnitForm((prev) => ({
                  ...prev,
                  unit: e.target.value,
                }));
                clearFieldError("unit");
              }}
              onKeyDown={(event) => handleSelectKeyDown(event, 0)}
              className={fieldClassName}
            >
              <option value="">Select Unit</option>

              {availableUnits
                .filter(
                  (availableUnit) =>
                    !units.some(
                      (itemUnit) => itemUnit.unit === availableUnit.id
                    )
                )
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
            )}
          </div>

          <div className="col-span-4">
            <label className="mb-1 block text-sm">Factor</label>

            <input
              ref={registerField(1)}
              type="number"
              min="0"
              step="1"
              value={unitForm.conversion_factor}
              onChange={(e) => {
                setUnitForm((prev) => ({
                  ...prev,
                  conversion_factor: e.target.value,
                }));
                clearFieldError("conversion_factor");
              }}
              onKeyDown={(event) => handleFieldEnter(event, 1)}
              className={fieldClassName}
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
              disabled={saving}
              onClick={handleAddUnit}
              className="w-full rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "+ Add Unit"}
            </button>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="mb-3 flex justify-between">
            <h3 className="font-medium">Existing Units</h3>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
              {units.length}
            </span>
          </div>

          <div className="space-y-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between rounded border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{unit.unit_name}</p>

                  <p className="text-xs text-slate-500">
                    x {unit.conversion_factor}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleDeleteUnit(unit.id)}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
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

export default memo(ItemUnitsManagementSection);
