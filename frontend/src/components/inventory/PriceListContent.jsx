import { memo } from "react";

import Alert from "../common/Alert";
import useInventoryFieldNavigation from "../../hooks/inventory/useInventoryFieldNavigation";
import PriceListFooter from "./PriceListFooter";
import PriceListHeader from "./PriceListHeader";
import PriceListTable from "./PriceListTable";

function PriceListContent({
  dismissMessage,
  editButtonRef,
  editing,
  errors,
  firstSalePriceRef,
  handlePriceChange,
  handleSave,
  handleStartEditing,
  item,
  message,
  prices,
  saveButtonRef,
  saving,
}) {
  const primaryButtonRef = editing ? saveButtonRef : editButtonRef;

  const {
    handleContainerKeyDown,
    handleFieldEnter,
    registerField,
  } = useInventoryFieldNavigation(primaryButtonRef, { enabled: editing });

  return (
    <>
      <Alert
        type={message.type}
        message={message.text}
        onClose={dismissMessage}
      />

      <div
        onKeyDown={handleContainerKeyDown}
        className="flex h-full flex-col rounded-lg border bg-white"
      >
        <PriceListHeader item={item} prices={prices} />
        <PriceListTable
          editing={editing}
          errors={errors}
          firstSalePriceRef={firstSalePriceRef}
          handleFieldEnter={handleFieldEnter}
          handlePriceChange={handlePriceChange}
          prices={prices}
          registerField={registerField}
        />
        <PriceListFooter
          editButtonRef={editButtonRef}
          editing={editing}
          handleSave={handleSave}
          handleStartEditing={handleStartEditing}
          saveButtonRef={saveButtonRef}
          saving={saving}
        />
      </div>
    </>
  );
}

export default memo(PriceListContent);
