import ItemPageLayout from "../../components/layout/ItemPageLayout";
import PriceListContent from "../../components/inventory/PriceListContent";
import usePriceListPage from "../../hooks/inventory/usePriceListPage";

export default function PriceListPage() {
  const {
    editing,
    errors,
    handleClear,
    handlePriceChange,
    handleSave,
    item,
    loading,
    message,
    prices,
    setEditing,
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
        editing={editing}
        errors={errors}
        handleClear={handleClear}
        handlePriceChange={handlePriceChange}
        handleSave={handleSave}
        item={item}
        message={message}
        prices={prices}
        setEditing={setEditing}
        setMessage={setMessage}
      />
    </ItemPageLayout>
  );
}
