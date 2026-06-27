import { memo } from "react";

import Alert from "../common/Alert";
import PriceListFooter from "./PriceListFooter";
import PriceListHeader from "./PriceListHeader";
import PriceListTable from "./PriceListTable";

function PriceListContent({
  dismissMessage,
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
  saving,
}) {
  return (
    <>
      <Alert
        type={message.type}
        message={message.text}
        onClose={dismissMessage}
      />

      <div className="flex h-full flex-col rounded-lg border bg-white">
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
          saving={saving}
        />
      </div>
    </>
  );
}

export default memo(PriceListContent);
