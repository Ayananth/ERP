import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getItemDropdowns,
  createItem,
  getItem,
  getItemList,
  updateItem,
} from "../../api/inventoryApi";

export const initialItemGeneralForm = {
  item_code: "",
  name_1: "",
  name_2: "",
  generic_name: "",
  description: "",
  behaviour: "",
  group: "",
  status: "active",
  taxable_status: "",
  shelf: "",
  manufacturer: "",
};

const initialDropdowns = {
  behaviours: [],
  statuses: [],
  taxable_statuses: [],
  groups: [],
  shelves: [],
  manufacturers: [],
};

const normalizeItemForm = (item = {}) => ({
  ...initialItemGeneralForm,
  ...item,
  item_code: item.item_code ?? "",
  name_1: item.name_1 ?? "",
  name_2: item.name_2 ?? "",
  generic_name: item.generic_name ?? "",
  description: item.description ?? "",
  behaviour: item.behaviour ?? "",
  group: item.group ?? item.group_id ?? "",
  status: item.status ?? "active",
  taxable_status: item.taxable_status ?? "",
  shelf: item.shelf ?? item.shelf_id ?? "",
  manufacturer: item.manufacturer ?? item.manufacturer_id ?? "",
});

export default function useItemGeneralPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialItemGeneralForm);
  const [dropdowns, setDropdowns] =
    useState(initialDropdowns);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isItemListOpen, setIsItemListOpen] = useState(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!itemId) return;

    loadItem();
  }, [itemId]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    loadItems();
  }, []);

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

  const loadItem = async () => {
    try {
      const item = await getItem(itemId);

      setFormData(normalizeItemForm(item));
      setIsEditing(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDropdowns = async () => {
    try {
      const data = await getItemDropdowns();

      setDropdowns(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const data = await getItemList();
      setItems(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setItemsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_1?.trim()) {
      newErrors.name_1 = "Name 1 is required";
    } else if (formData.name_1.trim().length < 2) {
      newErrors.name_1 =
        "Name 1 must contain at least 2 characters";
    }

    if (!formData.behaviour) {
      newErrors.behaviour = "Behaviour is required";
    }

    if (!formData.group) {
      newErrors.group = "Group Code is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.taxable_status) {
      newErrors.taxable_status =
        "Taxable Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNew = () => {
    setFormData(normalizeItemForm());
    setIsEditing(true);
  };

  const handleClear = () => {
    setFormData(normalizeItemForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });

      return;
    }

    try {
      const isExistingItem = Boolean(itemId);
      const savedItem = isExistingItem
        ? await updateItem(itemId, formData)
        : await createItem(formData);

      const savedItemId = savedItem?.id ?? itemId;

      if (!isExistingItem && savedItemId) {
        navigate(`/inventory/items/${savedItemId}/general`, {
          replace: true,
          state: {
            focusTab: "units",
          },
        });
      }

      setMessage({
        type: "success",
        text: isExistingItem
          ? "Item updated successfully."
          : "Item created successfully.",
      });

      setErrors({});

      if (savedItemId) {
        const refreshedItem = await getItem(savedItemId);
        setFormData(normalizeItemForm(refreshedItem));
      }

      setIsEditing(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: itemId
          ? "Failed to update item."
          : "Failed to create item.",
      });

      console.error(error);
    }
  };

  const handleList = () => {
    setIsItemListOpen(true);
  };

  const handleCloseItemList = () => {
    setIsItemListOpen(false);
  };

  const handleSelectItem = async (item) => {
    setIsItemListOpen(false);
    if (!item?.id) return;

    navigate(`/inventory/items/${item.id}/general`);
  };

  return {
    errors,
    firstInputRef,
    formData,
    dropdowns,
    items,
    itemsLoading,
    isItemListOpen,
    handleChange,
    handleClear,
    handleNew,
    handleList,
    handleCloseItemList,
    handleSelectItem,
    handleSubmit,
    isEditing,
    message,
    setMessage,
  };
}
