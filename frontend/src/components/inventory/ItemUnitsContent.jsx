import Alert from "../common/Alert";
import ItemUnitsManagementSection from "./ItemUnitsManagementSection";
import ItemUnitsSettingsSection from "./ItemUnitsSettingsSection";

export default function ItemUnitsContent({
  availableUnits,
  clearFieldError,
  errors,
  handleAddUnit,
  handleDeleteUnit,
  message,
  saving,
  setMessage,
  setSettings,
  setUnitForm,
  saveSettings,
  settings,
  unitForm,
  units,
}) {
  return (
    <>
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
        <div className="col-span-12 lg:col-span-7">
          <ItemUnitsManagementSection
            availableUnits={availableUnits}
            clearFieldError={clearFieldError}
            errors={errors}
            handleAddUnit={handleAddUnit}
            handleDeleteUnit={handleDeleteUnit}
            setUnitForm={setUnitForm}
            unitForm={unitForm}
            units={units}
          />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ItemUnitsSettingsSection
            clearFieldError={clearFieldError}
            errors={errors}
            handleSaveSettings={saveSettings}
            saving={saving}
            setSettings={setSettings}
            settings={settings}
            units={units}
          />
        </div>
      </div>
    </>
  );
}
