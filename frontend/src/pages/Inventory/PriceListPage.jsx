import ItemPageLayout from "../../components/layout/ItemPageLayout";
import PriceListContent from "../../components/inventory/PriceListContent";
import usePriceListPage from "../../hooks/inventory/usePriceListPage";

export default function PriceListPage() {
  const {
    editButtonRef,
    editing,
    errors,
    firstSalePriceRef,
    handleClear,
    handlePriceChange,
    handleSave,
    handleStartEditing,
    item,
    loading,
    message,
    prices,
    setMessage,
  } = usePriceListPage();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <ItemPageLayout
      title="Item File"
      description="Pricing information"
    >
      <PriceListContent
        editButtonRef={editButtonRef}
        editing={editing}
        errors={errors}
        firstSalePriceRef={firstSalePriceRef}
        handleClear={handleClear}
        handlePriceChange={handlePriceChange}
        handleSave={handleSave}
        handleStartEditing={handleStartEditing}
        item={item}
        message={message}
        prices={prices}
        setMessage={setMessage}
      />
    </ItemPageLayout>
  );
}
