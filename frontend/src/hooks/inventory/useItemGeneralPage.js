import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getItemDropdowns,
  createItem,
  getItem,
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

      setFormData(item);
      setIsEditing(false);
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
    setFormData(initialItemGeneralForm);
    setIsEditing(true);
  };

  const handleClear = () => {
    setFormData(initialItemGeneralForm);
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
      const createdItem = await createItem(formData);

      navigate(`/inventory/items/${createdItem.id}/general`);

      setMessage({
        type: "success",
        text: "Item created successfully.",
      });

      setErrors({});
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to create item.",
      });

      console.error(error);
    }
  };

  return {
    errors,
    firstInputRef,
    formData,
    dropdowns,
    handleChange,
    handleClear,
    handleNew,
    handleSubmit,
    isEditing,
    message,
    setMessage,
  };
}
