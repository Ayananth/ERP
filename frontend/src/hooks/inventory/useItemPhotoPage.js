import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
  deleteItemPhoto,
  getItemPhoto,
  uploadItemPhoto,
} from "../../api/inventoryApi";
import useInventoryMessage from "./useInventoryMessage";
import usePrimaryActionFocus from "../usePrimaryActionFocus";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function useItemPhotoPage() {
  const { itemId } = useParams();
  const fileInputRef = useRef(null);
  const editButtonRef = useRef(null);
  const scheduleEditButtonFocus = usePrimaryActionFocus(editButtonRef);

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { dismissMessage, message, setMessage } = useInventoryMessage();

  const loadPhoto = useCallback(async () => {
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
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;
    loadPhoto();
  }, [itemId, loadPhoto]);

  useEffect(() => {
    if (loading) return undefined;

    const timer = setTimeout(() => {
      scheduleEditButtonFocus();
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, scheduleEditButtonFocus]);

  const handleEditClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
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

        const data = await uploadItemPhoto(itemId, file);

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
    },
    [itemId, setMessage]
  );

  const handleDelete = useCallback(async () => {
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
  }, [itemId, setMessage]);

  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const hasImage = Boolean(imageUrl);

  return {
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
  };
}
