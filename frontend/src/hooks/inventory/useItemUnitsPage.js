import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  addItemUnit,
  deleteItemUnit,
  getAvailableUnits,
  getItemUnits,
  saveItemUnitSettings,
} from "../../api/inventoryApi";
import useInventoryMessage from "./useInventoryMessage";

export const initialUnitForm = {
  unit: "",
  conversion_factor: 1,
};

export const initialUnitSettings = {
  sales_unit: "",
  stock_unit: "",
};

const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  return fallback;
};

export default function useItemUnitsPage() {
  const { itemId } = useParams();

  const [availableUnits, setAvailableUnits] = useState([]);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState([]);
  const [settings, setSettings] = useState(initialUnitSettings);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    unit: "",
    conversion_factor: "",
    sales_unit: "",
    stock_unit: "",
  });
  const [unitForm, setUnitForm] = useState(initialUnitForm);

  const { dismissMessage, message, setMessage } = useInventoryMessage();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [unitsResponse, itemUnitsResponse] = await Promise.all([
        getAvailableUnits(),
        getItemUnits(itemId),
      ]);

      setAvailableUnits(unitsResponse.data);
      setUnits(itemUnitsResponse.data.units);
      setSettings({
        sales_unit: itemUnitsResponse.data.sales_unit || "",
        stock_unit: itemUnitsResponse.data.stock_unit || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;
    loadData();
  }, [itemId, loadData]);

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const saveSettings = useCallback(async () => {
    if (saving) return;

    const newErrors = {};

    if (!settings.sales_unit) {
      newErrors.sales_unit = "Sales unit is required";
    }

    if (!settings.stock_unit) {
      newErrors.stock_unit = "Stock unit is required";
    }

    setErrors((prev) => ({
      ...prev,
      sales_unit: newErrors.sales_unit || "",
      stock_unit: newErrors.stock_unit || "",
    }));

    if (Object.keys(newErrors).length > 0) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });
      return;
    }

    setSaving(true);

    try {
      await saveItemUnitSettings(itemId, {
        stock_unit: Number(settings.stock_unit),
        sales_unit: Number(settings.sales_unit),
      });

      setMessage({
        type: "success",
        text: "Settings saved successfully.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to save settings.",
      });
    } finally {
      setSaving(false);
    }
  }, [itemId, saving, setMessage, settings]);

  const handleAddUnit = useCallback(async () => {
    if (saving) return;

    const newErrors = {};

    if (!unitForm.unit) {
      newErrors.unit = "Unit is required";
    }

    if (
      unitForm.conversion_factor === "" ||
      unitForm.conversion_factor === null ||
      Number(unitForm.conversion_factor) <= 0
    ) {
      newErrors.conversion_factor =
        "Conversion factor must be greater than zero.";
    }

    setErrors((prev) => ({
      ...prev,
      unit: newErrors.unit || "",
      conversion_factor: newErrors.conversion_factor || "",
    }));

    if (Object.keys(newErrors).length > 0) {
      setMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await addItemUnit(itemId, {
        unit: Number(unitForm.unit),
        conversion_factor: Number(unitForm.conversion_factor),
      });

      setUnits((prev) => [...prev, response.data]);
      setUnitForm(initialUnitForm);
      setErrors((prev) => ({
        ...prev,
        unit: "",
        conversion_factor: "",
      }));

      setMessage({
        type: "success",
        text: "Unit added successfully.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to add unit.",
      });
    } finally {
      setSaving(false);
    }
  }, [itemId, saving, setMessage, unitForm]);

  const handleDeleteUnit = useCallback(
    async (itemUnitId) => {
      const deletedUnit = units.find((unit) => unit.id === itemUnitId);

      try {
        await deleteItemUnit(itemUnitId);

        setUnits((prev) => prev.filter((unit) => unit.id !== itemUnitId));

        if (deletedUnit && Number(settings.stock_unit) === deletedUnit.unit) {
          setSettings((prev) => ({
            ...prev,
            stock_unit: "",
          }));
        }

        if (deletedUnit && Number(settings.sales_unit) === deletedUnit.unit) {
          setSettings((prev) => ({
            ...prev,
            sales_unit: "",
          }));
        }

        setMessage({
          type: "success",
          text: "Item unit deleted successfully.",
        });
      } catch (error) {
        console.error(error);
        setMessage({
          type: "error",
          text: getApiErrorMessage(error, "Failed to delete item unit."),
        });
      }
    },
    [setMessage, settings.sales_unit, settings.stock_unit, units]
  );

  return {
    availableUnits,
    clearFieldError,
    dismissMessage,
    errors,
    handleAddUnit,
    handleDeleteUnit,
    loading,
    message,
    saveSettings,
    saving,
    setSettings,
    setUnitForm,
    settings,
    unitForm,
    units,
  };
}
