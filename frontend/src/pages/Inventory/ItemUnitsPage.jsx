import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemUnitsContent from "../../components/inventory/ItemUnitsContent";
import useItemUnitsPage from "../../hooks/inventory/useItemUnitsPage";

export default function ItemUnitsPage() {
  const {
    availableUnits,
    clearFieldError,
    errors,
    handleAddUnit,
    handleDeleteUnit,
    loading,
    message,
    saving,
    saveSettings,
    setMessage,
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
      <ItemUnitsContent
        availableUnits={availableUnits}
        clearFieldError={clearFieldError}
        errors={errors}
        handleAddUnit={handleAddUnit}
        handleDeleteUnit={handleDeleteUnit}
        message={message}
        saving={saving}
        saveSettings={saveSettings}
        setMessage={setMessage}
        setSettings={setSettings}
        setUnitForm={setUnitForm}
        settings={settings}
        unitForm={unitForm}
        units={units}
      />
    </ItemPageLayout>
  );
}
