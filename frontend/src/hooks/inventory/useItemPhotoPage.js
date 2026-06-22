import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getItemPhoto,
  uploadItemPhoto,
  deleteItemPhoto,
} from "../../api/inventoryApi";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES =
  MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function useItemPhotoPage() {
  const { itemId } = useParams();
  const fileInputRef = useRef(null);

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

      const data = await getItemPhoto(itemId);
      setImageUrl(data.image);
    } catch (err) {
      console.log(err);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

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

      const data = await uploadItemPhoto(
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

  return {
    fileInputRef,
    handleDelete,
    handleEditClick,
    handleFileChange,
    imageUrl,
    itemId,
    loading,
    message,
    setMessage,
    setShowDeleteModal,
    showDeleteModal,
  };
}
