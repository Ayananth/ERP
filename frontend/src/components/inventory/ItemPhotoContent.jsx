import { memo } from "react";

import Alert from "../common/Alert";
import ConfirmModal from "../common/ConfirmModal";
import useInventoryFieldNavigation from "../../hooks/inventory/useInventoryFieldNavigation";
import ItemPhotoCard from "./ItemPhotoCard";
import ItemPhotoFooter from "./ItemPhotoFooter";

function ItemPhotoContent({
  clearButtonRef,
  closeDeleteModal,
  dismissMessage,
  editButtonRef,
  fileInputRef,
  handleDelete,
  handleEditClick,
  handleFileChange,
  hasImage,
  imageUrl,
  loading,
  message,
  openDeleteModal,
  showDeleteModal,
}) {
  const { handleContainerKeyDown, handleFieldEnter, registerField } =
    useInventoryFieldNavigation(editButtonRef, { enabled: true });

  const registerEditButton = (element) => {
    registerField(0)(element);
    if (editButtonRef) {
      editButtonRef.current = element;
    }
  };

  const registerClearButton = (element) => {
    registerField(1)(element);
    if (clearButtonRef) {
      clearButtonRef.current = element;
    }
  };

  return (
    <>
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <Alert
        type={message.type}
        message={message.text}
        onClose={dismissMessage}
      />

      <div
        onKeyDown={handleContainerKeyDown}
        className="flex h-full flex-col rounded border bg-white"
      >
        <div className="border-b bg-slate-50 px-4 py-2 text-sm font-medium">
          Item Image
        </div>

        <ItemPhotoCard imageUrl={imageUrl} loading={loading} />

        <ItemPhotoFooter
          handleFieldEnter={handleFieldEnter}
          hasImage={hasImage}
          loading={loading}
          onClear={openDeleteModal}
          onEdit={handleEditClick}
          registerClearButton={registerClearButton}
          registerEditButton={registerEditButton}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}

export default memo(ItemPhotoContent);
