import { memo } from "react";

import { SALES_FOCUS_BUTTON, SALES_FOCUS_FIELD } from "../sales/salesFocusStyles";

const fieldClassName = `w-full rounded border px-3 py-2 ${SALES_FOCUS_FIELD}`;

function ItemUnitsSettingsSection({
  clearFieldError,
  errors,
  handleFieldEnter,
  handleSaveSettings,
  handleSelectKeyDown,
  registerField,
  registerSaveButton,
  saving,
  setSettings,
  settings,
  units,
}) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-4 py-3 font-medium">Unit Settings</div>

      <div className="space-y-6 p-4">
        {(errors.sales_unit || errors.stock_unit) && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Please correct the highlighted settings.
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm">Sales Unit</label>

          <select
            ref={registerField(2)}
            value={settings.sales_unit}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                sales_unit: e.target.value ? Number(e.target.value) : "",
              }));
              clearFieldError("sales_unit");
            }}
            onKeyDown={(event) => handleSelectKeyDown(event, 2)}
            className={fieldClassName}
          >
            <option value="">Select Sales Unit</option>

            {units.map((unit) => (
              <option key={unit.id} value={unit.unit}>
                {unit.unit_name}
              </option>
            ))}
          </select>
          {errors.sales_unit && (
            <p className="mt-1 text-sm text-red-600">{errors.sales_unit}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Stock Unit</label>

          <select
            ref={registerField(3)}
            value={settings.stock_unit}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                stock_unit: e.target.value ? Number(e.target.value) : "",
              }));
              clearFieldError("stock_unit");
            }}
            onKeyDown={(event) => handleSelectKeyDown(event, 3)}
            className={fieldClassName}
          >
            <option value="">Select Stock Unit</option>

            {units.map((unit) => (
              <option key={unit.id} value={unit.unit}>
                {unit.unit_name}
              </option>
            ))}
          </select>
          {errors.stock_unit && (
            <p className="mt-1 text-sm text-red-600">{errors.stock_unit}</p>
          )}
        </div>

        <div className="flex justify-end border-t pt-4">
          <button
            type="button"
            ref={registerSaveButton}
            onClick={handleSaveSettings}
            disabled={saving}
            className={`rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 ${SALES_FOCUS_BUTTON}`}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ItemUnitsSettingsSection);
