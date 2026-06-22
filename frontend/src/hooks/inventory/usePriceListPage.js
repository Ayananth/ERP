import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getItemPrices,
  saveItemPrices,
} from "../../api/inventoryApi";

export default function usePriceListPage() {
  const { itemId } = useParams();

  const [prices, setPrices] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!itemId) return;

    loadPrices();
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

  const loadPrices = async () => {
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
  };

  const validatePrices = () => {
    const newErrors = {};

    prices.forEach((row) => {
      const rowErrors = {};

      if (
        row.sale_price === "" ||
        row.sale_price === null ||
        row.sale_price === undefined
      ) {
        rowErrors.sale_price =
          "Sale price is required";
      } else if (
        Number.isNaN(Number(row.sale_price)) ||
        Number(row.sale_price) < 0
      ) {
        rowErrors.sale_price =
          "Sale price must be a valid non-negative number";
      }

      if (
        row.minimum_price === "" ||
        row.minimum_price === null ||
        row.minimum_price === undefined
      ) {
        rowErrors.minimum_price =
          "Minimum price is required";
      } else if (
        Number.isNaN(Number(row.minimum_price)) ||
        Number(row.minimum_price) < 0
      ) {
        rowErrors.minimum_price =
          "Minimum price must be a valid non-negative number";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.unit_id] = rowErrors;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (
    unitId,
    field,
    value
  ) => {
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

      if (
        Object.keys(nextRowErrors).length === 0
      ) {
        delete nextErrors[unitId];
      }

      return nextErrors;
    });
  };

  const handleSave = async () => {
    try {
      if (!validatePrices()) {
        setMessage({
          type: "error",
          text: "Please correct the highlighted fields.",
        });

        return;
      }

      await saveItemPrices(
        itemId,
        prices.map((row) => ({
          unit_id: row.unit_id,
          sale_price: Number(row.sale_price),
          minimum_price: Number(
            row.minimum_price
          ),
        }))
      );

      await loadPrices();

      setEditing(false);
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
    }
  };

  const handleClear = async () => {
    await loadPrices();
    setEditing(false);
    setErrors({});
  };

  return {
    editing,
    errors,
    handleClear,
    handlePriceChange,
    handleSave,
    item,
    loading,
    message,
    prices,
    setEditing,
    setMessage,
  };
}
