import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableUnits,
  getItemUnits,
  addItemUnit,
  deleteItemUnit,
  saveItemUnitSettings,
} from "../../api/inventoryApi";

export const initialUnitForm = {
  unit: "",
  conversion_factor: 1,
};

export const initialUnitSettings = {
  sales_unit: "",
  stock_unit: "",
};

export default function useItemUnitsPage() {
  const { itemId } = useParams();

  const [availableUnits, setAvailableUnits] =
    useState([]);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState([]);
  const [settings, setSettings] = useState(
    initialUnitSettings
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [errors, setErrors] = useState({
    unit: "",
    conversion_factor: "",
    sales_unit: "",
    stock_unit: "",
  });
  const [unitForm, setUnitForm] = useState(
    initialUnitForm
  );

  useEffect(() => {
    if (!itemId) return;

    loadData();
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

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        unitsResponse,
        itemUnitsResponse,
      ] = await Promise.all([
        getAvailableUnits(),
        getItemUnits(itemId),
      ]);

      setAvailableUnits(unitsResponse.data);
      setUnits(itemUnitsResponse.data.units);
      setSettings({
        sales_unit:
          itemUnitsResponse.data.sales_unit ||
          "",
        stock_unit:
          itemUnitsResponse.data.stock_unit ||
          "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (name) => {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const getApiErrorMessage = (
    error,
    fallback
  ) => {
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

  const validateUnitForm = () => {
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
        "Factor must be greater than 0";
    }

    setErrors((prev) => ({
      ...prev,
      unit: newErrors.unit || "",
      conversion_factor:
        newErrors.conversion_factor || "",
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.sales_unit) {
      newErrors.sales_unit =
        "Sales unit is required";
    }

    if (!settings.stock_unit) {
      newErrors.stock_unit =
        "Stock unit is required";
    }

    setErrors((prev) => ({
      ...prev,
      sales_unit: newErrors.sales_unit || "",
      stock_unit: newErrors.stock_unit || "",
    }));

    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = async () => {
    try {
      if (!validateSettings()) {
        setMessage({
          type: "error",
          text: "Please correct the highlighted fields.",
        });

        return;
      }

      setSaving(true);

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
  };

  const handleAddUnit = async () => {
    try {
      if (!validateUnitForm()) {
        setMessage({
          type: "error",
          text: "Please correct the highlighted fields.",
        });

        return;
      }

      setSaving(true);

      const response = await addItemUnit(itemId, {
        unit: Number(unitForm.unit),
        conversion_factor: Number(
          unitForm.conversion_factor
        ),
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
  };

  const handleDeleteUnit = async (itemUnitId) => {
    const deletedUnit = units.find(
      (u) => u.id === itemUnitId
    );

    try {
      await deleteItemUnit(itemUnitId);

      setUnits((prev) =>
        prev.filter(
          (unit) => unit.id !== itemUnitId
        )
      );

      if (
        deletedUnit &&
        Number(settings.stock_unit) ===
          deletedUnit.unit
      ) {
        setSettings((prev) => ({
          ...prev,
          stock_unit: "",
        }));
      }

      if (
        deletedUnit &&
        Number(settings.sales_unit) ===
          deletedUnit.unit
      ) {
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
        text: getApiErrorMessage(
          error,
          "Failed to delete item unit."
        ),
      });
    }
  };

  return {
    availableUnits,
    clearFieldError,
    errors,
    handleAddUnit,
    handleDeleteUnit,
    loading,
    message,
    saving,
    saveSettings,
    setMessage,
    setSettings,
    setUnitForm,
    settings,
    unitForm,
    units,
  };
}
