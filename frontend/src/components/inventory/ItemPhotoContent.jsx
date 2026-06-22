import Alert from "../common/Alert";
import ConfirmModal from "../common/ConfirmModal";
import ItemPhotoCard from "./ItemPhotoCard";
import ItemPhotoFooter from "./ItemPhotoFooter";

export default function ItemPhotoContent({
  fileInputRef,
  handleDelete,
  handleEditClick,
  handleFileChange,
  imageUrl,
  loading,
  message,
  setMessage,
  setShowDeleteModal,
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
        onCancel={() => setShowDeleteModal(false)}
      />

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

      <div className="flex flex-col h-full bg-white border rounded">
        <div className="px-4 py-2 border-b bg-slate-50 font-medium text-sm">
          Item Image
        </div>

        <ItemPhotoCard
          imageUrl={imageUrl}
          loading={loading}
        />

        <ItemPhotoFooter
          imageUrl={imageUrl}
          loading={loading}
          onEdit={handleEditClick}
          onClear={() => setShowDeleteModal(true)}
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
