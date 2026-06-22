import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getItemPhoto,
  uploadItemPhoto,
  deleteItemPhoto,
} from "../../api/inventoryApi"

import ItemPageLayout from "../../components/layout/ItemPageLayout";

function ItemPhotoPage({ itemId }) {
  const [imageUrl, setImageUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!itemId) return;

    loadPhoto();
  }, [itemId]);

  const loadPhoto = async () => {
    try {
      setLoading(true);
      setError("");

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

    try {
      setLoading(true);
      setError("");

      const data =
        await uploadItemPhoto(
          itemId,
          file
        );

      setImageUrl(data.image);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to upload image"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteItemPhoto(itemId);

      setImageUrl(null);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete image"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

        <ItemPageLayout
      title="Item File"
      description="Item Image"
    >






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

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <div className="text-red-600 text-sm">
            {error}
          </div>
        </div>
      )}

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
          onClick={handleDelete}
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

  );
}

export default ItemPhotoPage;