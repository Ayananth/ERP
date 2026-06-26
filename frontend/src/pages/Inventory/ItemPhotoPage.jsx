import ItemPageLayout from "../../components/layout/ItemPageLayout";
import ItemPhotoContent from "../../components/inventory/ItemPhotoContent";
import useItemPhotoPage from "../../hooks/inventory/useItemPhotoPage";

function ItemPhotoPage() {
  const {
    editButtonRef,
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
  } = useItemPhotoPage();

  return (
    <ItemPageLayout
      title="Item File"
      description="Item Image"
    >
      <ItemPhotoContent
        editButtonRef={editButtonRef}
        fileInputRef={fileInputRef}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
        handleFileChange={handleFileChange}
        imageUrl={imageUrl}
        loading={loading}
        message={message}
        setMessage={setMessage}
        setShowDeleteModal={setShowDeleteModal}
        showDeleteModal={showDeleteModal}
      />
    </ItemPageLayout>
  );
}

export default ItemPhotoPage;
