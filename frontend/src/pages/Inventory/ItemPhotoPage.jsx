import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemPhotoContent from "../../components/inventory/ItemPhotoContent";
import useItemPhotoPage from "../../hooks/inventory/useItemPhotoPage";

function ItemPhotoPage() {
  const {
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
  } = useItemPhotoPage();

  return (
    <ItemPageLayout
      title="Item File"
      description="Item Image"
    >
      <ItemPhotoContent
        clearButtonRef={clearButtonRef}
        closeDeleteModal={closeDeleteModal}
        dismissMessage={dismissMessage}
        editButtonRef={editButtonRef}
        fileInputRef={fileInputRef}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
        handleFileChange={handleFileChange}
        hasImage={hasImage}
        imageUrl={imageUrl}
        loading={loading}
        message={message}
        openDeleteModal={openDeleteModal}
        showDeleteModal={showDeleteModal}
      />
    </ItemPageLayout>
  );
}

export default ItemPhotoPage;
