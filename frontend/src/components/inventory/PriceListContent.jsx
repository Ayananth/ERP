import Alert from "../common/Alert";
import PriceListHeader from "./PriceListHeader";
import PriceListTable from "./PriceListTable";
import PriceListFooter from "./PriceListFooter";

export default function PriceListContent({
  editing,
  errors,
  handleClear,
  handlePriceChange,
  handleSave,
  item,
  message,
  prices,
  setEditing,
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
          handlePriceChange={handlePriceChange}
          prices={prices}
        />
        <PriceListFooter
          editing={editing}
          handleClear={handleClear}
          handleSave={handleSave}
          setEditing={setEditing}
        />
      </div>
    </>
  );
}
