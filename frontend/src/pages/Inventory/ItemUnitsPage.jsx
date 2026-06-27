import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemUnitsContent from "../../components/inventory/ItemUnitsContent";
import useItemUnitsPage from "../../hooks/inventory/useItemUnitsPage";

export default function ItemUnitsPage() {
  const {
    availableUnits,
    clearFieldError,
    dismissMessage,
    errors,
    handleAddUnit,
    handleDeleteUnit,
    loading,
    message,
    saveSettings,
    saving,
    setSettings,
    setUnitForm,
    settings,
    unitForm,
    units,
  } = useItemUnitsPage();

  if (loading) {
    return (
      <ItemPageLayout
        title="Item File"
        description="Units and barcode management"
      >
        <div className="p-6">Loading...</div>
      </ItemPageLayout>
    );
  }

  return (
    <ItemPageLayout
      title="Item File"
      description="Units and barcode management"
    >
      <ItemUnitsContent
        availableUnits={availableUnits}
        clearFieldError={clearFieldError}
        dismissMessage={dismissMessage}
        errors={errors}
        handleAddUnit={handleAddUnit}
        handleDeleteUnit={handleDeleteUnit}
        message={message}
        saveSettings={saveSettings}
        saving={saving}
        setSettings={setSettings}
        setUnitForm={setUnitForm}
        settings={settings}
        unitForm={unitForm}
        units={units}
      />
    </ItemPageLayout>
  );
}
