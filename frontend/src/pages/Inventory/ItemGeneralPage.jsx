import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemGeneralForm from "../../components/inventory/ItemGeneralForm";
import ItemSelectModal from "../../components/inventory/ItemSelectModal";
import useItemGeneralPage from "../../hooks/inventory/useItemGeneralPage";

export default function ItemGeneralPage() {
  const {
    dismissMessage,
    dropdowns,
    errors,
    firstInputRef,
    formData,
    handleChange,
    handleClear,
    handleCloseItemList,
    handleList,
    handlePrimaryAction,
    handleSelectItem,
    handleSubmit,
    isEditing,
    isItemListOpen,
    items,
    itemsLoading,
    message,
    primaryActionLabel,
    primaryButtonRef,
    saving,
    viewState,
  } = useItemGeneralPage();

  return (
    <ItemPageLayout
      title="Item File"
      description="Basic item information"
    >
      <ItemGeneralForm
        dismissMessage={dismissMessage}
        dropdowns={dropdowns}
        errors={errors}
        firstInputRef={firstInputRef}
        formData={formData}
        handleChange={handleChange}
        handleClear={handleClear}
        handleList={handleList}
        handlePrimaryAction={handlePrimaryAction}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        message={message}
        primaryActionLabel={primaryActionLabel}
        primaryButtonRef={primaryButtonRef}
        saving={saving}
        viewState={viewState}
      />

      <ItemSelectModal
        isOpen={isItemListOpen}
        loading={itemsLoading}
        items={items}
        onClose={handleCloseItemList}
        onSelect={handleSelectItem}
      />
    </ItemPageLayout>
  );
}
