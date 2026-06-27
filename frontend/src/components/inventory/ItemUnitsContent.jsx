import { memo } from "react";

import Alert from "../common/Alert";
import useInventoryFieldNavigation from "../../hooks/inventory/useInventoryFieldNavigation";
import ItemUnitsManagementSection from "./ItemUnitsManagementSection";
import ItemUnitsSettingsSection from "./ItemUnitsSettingsSection";

function ItemUnitsContent({
  availableUnits,
  clearFieldError,
  dismissMessage,
  errors,
  firstInputRef,
  handleAddUnit,
  handleDeleteUnit,
  message,
  saveSettings,
  saveSettingsButtonRef,
  saving,
  setSettings,
  setUnitForm,
  settings,
  unitForm,
  units,
}) {
  const {
    handleContainerKeyDown,
    handleFieldEnter,
    handleSelectKeyDown,
    registerField,
  } = useInventoryFieldNavigation(saveSettingsButtonRef, { enabled: true });

  const registerFirstField = (index) => (element) => {
    registerField(index)(element);
    if (index === 0 && firstInputRef) {
      firstInputRef.current = element;
    }
  };

  const registerSaveButton = (element) => {
    registerField(4)(element);
    if (saveSettingsButtonRef) {
      saveSettingsButtonRef.current = element;
    }
  };

  return (
    <>
      <Alert
        type={message.type}
        message={message.text}
        onClose={dismissMessage}
      />

      <div
        onKeyDown={handleContainerKeyDown}
        className="grid grid-cols-12 gap-4"
      >
        <div className="col-span-12 lg:col-span-7">
          <ItemUnitsManagementSection
            availableUnits={availableUnits}
            clearFieldError={clearFieldError}
            errors={errors}
            handleAddUnit={handleAddUnit}
            handleDeleteUnit={handleDeleteUnit}
            handleFieldEnter={handleFieldEnter}
            handleSelectKeyDown={handleSelectKeyDown}
            registerField={registerFirstField}
            saving={saving}
            setUnitForm={setUnitForm}
            unitForm={unitForm}
            units={units}
          />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ItemUnitsSettingsSection
            clearFieldError={clearFieldError}
            errors={errors}
            handleFieldEnter={handleFieldEnter}
            handleSaveSettings={saveSettings}
            handleSelectKeyDown={handleSelectKeyDown}
            registerField={registerField}
            registerSaveButton={registerSaveButton}
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

export default memo(ItemUnitsContent);
