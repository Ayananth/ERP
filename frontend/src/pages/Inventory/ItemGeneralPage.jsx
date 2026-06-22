import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemGeneralForm from "../../components/inventory/ItemGeneralForm";
import useItemGeneralPage from "../../hooks/inventory/useItemGeneralPage";

export default function ItemGeneralPage() {
  const {
    dropdowns,
    errors,
    firstInputRef,
    formData,
    handleChange,
    handleClear,
    handleNew,
    handleSubmit,
    isEditing,
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
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
      />
    </ItemPageLayout>
  );
}
