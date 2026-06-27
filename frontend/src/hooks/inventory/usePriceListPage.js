import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { getItemPrices, saveItemPrices } from "../../api/inventoryApi";
import useInventoryMessage from "./useInventoryMessage";
import useInventoryPriceEditingFocus from "./useInventoryPriceEditingFocus";
import usePrimaryActionFocus from "../usePrimaryActionFocus";

export default function usePriceListPage() {
  const { itemId } = useParams();

  const [prices, setPrices] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const editButtonRef = useRef(null);
  const saveButtonRef = useRef(null);
  const firstSalePriceRef = useRef(null);
  const scheduleEditButtonFocus = usePrimaryActionFocus(editButtonRef);

  const { dismissMessage, message, setMessage } = useInventoryMessage();

  useInventoryPriceEditingFocus(
    editing,
    loading,
    firstSalePriceRef,
    scheduleEditButtonFocus
  );

  const loadPrices = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getItemPrices(itemId);

      setItem({
        item_code: data.item_code,
        item_name: data.item_name,
      });

      setPrices(data.prices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;
    loadPrices();
  }, [itemId, loadPrices]);

  const handlePriceChange = useCallback((unitId, field, value) => {
    setPrices((prev) =>
      prev.map((row) =>
        row.unit_id === unitId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );

    setErrors((prev) => {
      const rowErrors = prev[unitId];

      if (!rowErrors) return prev;

      const nextRowErrors = {
        ...rowErrors,
      };

      delete nextRowErrors[field];

      const nextErrors = {
        ...prev,
        [unitId]: nextRowErrors,
      };

      if (Object.keys(nextRowErrors).length === 0) {
        delete nextErrors[unitId];
      }

      return nextErrors;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return;

    const newErrors = {};

    prices.forEach((row) => {
      const rowErrors = {};

      if (
        row.sale_price === "" ||
        row.sale_price === null ||
        row.sale_price === undefined
      ) {
        rowErrors.sale_price = "Sale price is required.";
      } else if (
        Number.isNaN(Number(row.sale_price)) ||
        Number(row.sale_price) < 0
      ) {
        rowErrors.sale_price = "Sale price cannot be negative.";
      }

      if (
        row.minimum_price === "" ||
        row.minimum_price === null ||
        row.minimum_price === undefined
      ) {
        rowErrors.minimum_price = "Minimum selling price is required.";
      } else if (
        Number.isNaN(Number(row.minimum_price)) ||
        Number(row.minimum_price) < 0
      ) {
        rowErrors.minimum_price = "Minimum selling price cannot be negative.";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.unit_id] = rowErrors;
      }
    });

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
      await saveItemPrices(
        itemId,
        prices.map((row) => ({
          unit_id: row.unit_id,
          sale_price: Number(row.sale_price),
          minimum_price: Number(row.minimum_price),
        }))
      );

      await loadPrices();

      setEditing(false);
      scheduleEditButtonFocus();
      setMessage({
        type: "success",
        text: "Prices saved successfully.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to save prices.",
      });
    } finally {
      setSaving(false);
    }
  }, [itemId, loadPrices, prices, saving, scheduleEditButtonFocus, setMessage]);

  const handleStartEditing = useCallback(() => {
    setEditing(true);
  }, []);

  return {
    dismissMessage,
    editButtonRef,
    editing,
    errors,
    firstSalePriceRef,
    handlePriceChange,
    handleSave,
    handleStartEditing,
    item,
    loading,
    message,
    prices,
    saveButtonRef,
    saving,
  };
}
