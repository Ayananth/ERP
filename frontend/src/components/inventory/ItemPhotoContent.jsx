import { memo } from "react";

import Alert from "../common/Alert";
import ConfirmModal from "../common/ConfirmModal";
import ItemPhotoCard from "./ItemPhotoCard";
import ItemPhotoFooter from "./ItemPhotoFooter";

function ItemPhotoContent({
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

      <div className="flex h-full flex-col rounded border bg-white">
        <div className="border-b bg-slate-50 px-4 py-2 text-sm font-medium">
          Item Image
        </div>

        <ItemPhotoCard imageUrl={imageUrl} loading={loading} />

        <ItemPhotoFooter
          editButtonRef={editButtonRef}
          hasImage={hasImage}
          loading={loading}
          onClear={openDeleteModal}
          onEdit={handleEditClick}
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
