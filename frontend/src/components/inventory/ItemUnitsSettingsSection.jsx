import { memo } from "react";
function ItemUnitsSettingsSection({
  errors,
  handleSaveSettings,
  saving,
  setSettings,
  settings,
  units,
  clearFieldError,
}) {
  return (
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

        <div>
          <label className="block text-sm mb-1">
            Sales Unit
          </label>

          <select
            value={settings.sales_unit}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                sales_unit: e.target.value
                  ? Number(e.target.value)
                  : "",
              }));
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

        <div>
          <label className="block text-sm mb-1">
            Stock Unit
          </label>

          <select
            value={settings.stock_unit}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                stock_unit: e.target.value
                  ? Number(e.target.value)
                  : "",
              }));
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
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ItemUnitsSettingsSection);
