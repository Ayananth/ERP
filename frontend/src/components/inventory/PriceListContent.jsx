import Alert from "../common/Alert";
import PriceListHeader from "./PriceListHeader";
import PriceListTable from "./PriceListTable";
import PriceListFooter from "./PriceListFooter";

export default function PriceListContent({
  editButtonRef,
  editing,
  errors,
  firstSalePriceRef,
  handleClear,
  handlePriceChange,
  handleSave,
  handleStartEditing,
  item,
  message,
  prices,
  setMessage,
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

      <div className="flex flex-col h-full bg-white border rounded-lg">
        <PriceListHeader item={item} prices={prices} />
        <PriceListTable
          editing={editing}
          errors={errors}
          firstSalePriceRef={firstSalePriceRef}
          handlePriceChange={handlePriceChange}
          prices={prices}
        />
        <PriceListFooter
          editButtonRef={editButtonRef}
          editing={editing}
          handleClear={handleClear}
          handleSave={handleSave}
          handleStartEditing={handleStartEditing}
        />
      </div>
    </>
  );
}
