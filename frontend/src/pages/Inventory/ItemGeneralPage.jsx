import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemGeneralForm from "../../components/inventory/ItemGeneralForm";
import ItemSelectModal from "../../components/inventory/ItemSelectModal";
import useItemGeneralPage from "../../hooks/inventory/useItemGeneralPage";

export default function ItemGeneralPage() {
  const {
    dropdowns,
    errors,
    handleCloseItemList,
    handleList,
    handlePrimaryAction,
    handleSelectItem,
    firstInputRef,
    items,
    itemsLoading,
    isItemListOpen,
    formData,
    handleChange,
    handleClear,
    handleNew,
    handleSubmit,
    isEditing,
    viewState,
    message,
    setMessage,
  } = useItemGeneralPage();

  return (
    <ItemPageLayout
      title="Item File"
      description="Basic item information"
    >
      <ItemGeneralForm
        dropdowns={dropdowns}
        errors={errors}
        firstInputRef={firstInputRef}
        formData={formData}
        isEditing={isEditing}
        handleChange={handleChange}
        handleClear={handleClear}
        handleNew={handleNew}
        handleList={handleList}
        handlePrimaryAction={handlePrimaryAction}
        handleSubmit={handleSubmit}
        viewState={viewState}
        message={message}
        setMessage={setMessage}
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
