import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createItem,
  getItem,
  getItemDropdowns,
  getItemList,
  updateItem,
} from "../../api/inventoryApi";
import useInventoryEditingFocus from "./useInventoryEditingFocus";
import useInventoryMessage from "./useInventoryMessage";
import usePrimaryActionFocus from "../usePrimaryActionFocus";
import { getPrimaryActionLabel } from "../../utils/sales/salesViewLabels";

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
  const [viewState, setViewState] = useState(
    itemId ? "viewExisting" : "viewBlank"
  );
  const [formData, setFormData] = useState(initialItemGeneralForm);
  const [dropdowns, setDropdowns] = useState(initialDropdowns);
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isItemListOpen, setIsItemListOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const firstInputRef = useRef(null);
  const primaryButtonRef = useRef(null);
  const schedulePrimaryActionFocus = usePrimaryActionFocus(primaryButtonRef);

  const { clearMessage, dismissMessage, message, setMessage } =
    useInventoryMessage();

  useInventoryEditingFocus(
    isEditing,
    firstInputRef,
    schedulePrimaryActionFocus
  );

  const loadDropdowns = useCallback(async () => {
    try {
      const data = await getItemDropdowns();
      setDropdowns(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadItems = useCallback(async () => {
    try {
      setItemsLoading(true);
      const data = await getItemList();
      setItems(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  const loadItem = useCallback(async () => {
    try {
      const item = await getItem(itemId);
      setFormData(normalizeItemForm(item));
      setViewState("viewExisting");
      setIsEditing(false);
      schedulePrimaryActionFocus();
    } catch (error) {
      console.error(error);
    }
  }, [itemId, schedulePrimaryActionFocus]);

  useEffect(() => {
    if (!itemId) return;
    loadItem();
  }, [itemId, loadItem]);

  useEffect(() => {
    loadDropdowns();
  }, [loadDropdowns]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) =>
      prev[name]
        ? {
            ...prev,
            [name]: "",
          }
        : prev
    );
  }, []);

  const handleNew = useCallback(() => {
    setFormData(normalizeItemForm());
    setErrors({});
    clearMessage();
    setViewState("viewBlank");
    setIsEditing(true);

    if (itemId) {
      navigate("/inventory/items/general", {
        replace: true,
      });
    }
  }, [clearMessage, itemId, navigate]);

  const handleClear = useCallback(() => {
    setFormData(normalizeItemForm());
    setErrors({});
    clearMessage();

    if (itemId) {
      navigate("/inventory/items/general", {
        replace: true,
      });
    }

    setViewState("viewBlank");
    setIsEditing(false);
    schedulePrimaryActionFocus();
  }, [clearMessage, itemId, navigate, schedulePrimaryActionFocus]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();

      if (saving) return;

      clearMessage();

      const newErrors = {};

      if (!formData.name_1?.trim()) {
        newErrors.name_1 = "Name 1 is required";
      } else if (formData.name_1.trim().length < 2) {
        newErrors.name_1 = "Name 1 must contain at least 2 characters";
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
        newErrors.taxable_status = "Taxable Status is required";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setMessage({
          type: "error",
          text: "Please correct the highlighted fields.",
        });
        return;
      }

      setSaving(true);

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

        setIsEditing(false);
        setViewState("viewExisting");
        schedulePrimaryActionFocus();
      } catch (error) {
        setMessage({
          type: "error",
          text: itemId ? "Failed to update item." : "Failed to create item.",
        });
        console.error(error);
      } finally {
        setSaving(false);
      }
    },
    [
      clearMessage,
      formData,
      itemId,
      navigate,
      saving,
      schedulePrimaryActionFocus,
      setMessage,
    ]
  );

  const handlePrimaryAction = useCallback(() => {
    if (viewState === "viewExisting") {
      setIsEditing(true);
      return;
    }

    handleNew();
  }, [handleNew, viewState]);

  const handleList = useCallback(() => {
    setIsItemListOpen(true);
  }, []);

  const handleCloseItemList = useCallback(() => {
    setIsItemListOpen(false);
  }, []);

  const handleSelectItem = useCallback(
    async (item) => {
      setIsItemListOpen(false);
      if (!item?.id) return;

      navigate(`/inventory/items/${item.id}/general`);
    },
    [navigate]
  );

  const primaryActionLabel = useMemo(
    () => getPrimaryActionLabel(isEditing, viewState),
    [isEditing, viewState]
  );

  return {
    dismissMessage,
    dropdowns,
    errors,
    firstInputRef,
    formData,
    handleChange,
    handleClear,
    handleCloseItemList,
    handleList,
    handleNew,
    handlePrimaryAction,
    handleSelectItem,
    handleSubmit,
    isEditing,
    isItemListOpen,
    items,
    itemsLoading,
    message,
    primaryActionLabel,
    primaryButtonRef,
    saving,
    viewState,
  };
}
