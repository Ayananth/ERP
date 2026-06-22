import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";


import {
  getItemPhoto,
  uploadItemPhoto,
  deleteItemPhoto,
} from "../../api/inventoryApi"
import Alert from "../../components/common/Alert";
import ConfirmModal from "../../components/common/ConfirmModal";
import ItemPageLayout from "../../components/layout/ItemPageLayout";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES =
  MAX_IMAGE_SIZE_MB * 1024 * 1024;

function ItemPhotoPage() {
    const { itemId } = useParams();
  const [imageUrl, setImageUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!itemId) return;

    loadPhoto();
  }, [itemId]);

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);



  const loadPhoto = async () => {
    try {
      setLoading(true);

      const data =
        await getItemPhoto(itemId);

      setImageUrl(data.image);
    } catch (err) {
      console.log(err);

      // image may not exist yet
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Only image files are allowed.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setMessage({
        type: "error",
        text: `Image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`,
      });
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);

      const data =
        await uploadItemPhoto(
          itemId,
          file
        );

      setImageUrl(data.image);
      setMessage({
        type: "success",
        text: "Image uploaded successfully.",
      });
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "Failed to upload image.",
      });
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

const handleDelete = async () => {
  try {
    setLoading(true);

    await deleteItemPhoto(itemId);

    setImageUrl(null);
    setMessage({
      type: "success",
      text: "Image deleted successfully.",
    });

    setShowDeleteModal(false);
  } catch (err) {
    console.error(err);

    setMessage({
      type: "error",
      text: "Failed to delete image.",
    });
  } finally {
    setLoading(false);
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
  onCancel={() => setShowDeleteModal(false)}
/>



        <ItemPageLayout
      title="Item File"
      description="Item Image"
    >
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
      {/* Header */}
      <div className="px-4 py-2 border-b bg-slate-50 font-medium text-sm">
        Item Image
      </div>

      {/* Image Area */}
      <div className="flex-1 flex items-center justify-center p-8 min-h-[500px]">
        {loading ? (
          <p>Loading...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Item"
            className="
              w-64
              h-64
              object-cover
              rounded
              border
              shadow-sm
            "
          />
        ) : (
          <div
            className="
              w-64
              h-64
              border-2
              border-dashed
              rounded
              flex
              items-center
              justify-center
              text-slate-400
            "
          >
            No Image
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-slate-100 p-3 flex justify-end gap-2">
        <button
          onClick={handleEditClick}
          disabled={!itemId || loading}
          className="
            px-6 py-2
            bg-emerald-500
            text-white
            rounded
            hover:bg-emerald-600
          "
        >
          Edit
        </button>

        <button
        onClick={() => setShowDeleteModal(true)}
        disabled={!imageUrl || loading}
        className="
            px-6 py-2
            bg-slate-500
            text-white
            rounded
            hover:bg-slate-600
        "
        >
        Clear
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>

        </ItemPageLayout>

        </>

  );
}

export default ItemPhotoPage;
