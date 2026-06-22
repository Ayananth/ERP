import { useEffect, useRef, useState } from "react";
import { getItemDropdowns, createItem } from "../../api/inventoryApi";
import Alert from "../../components/common/Alert";


const initialForm = {
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


export default function ItemGeneralPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [dropdowns, setDropdowns] = useState({
      behaviours: [],
      statuses: [],
      taxable_statuses: [],
      groups: [],
      shelves: [],
      manufacturers: [],
    });
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
    loadDropdowns();
    }, []);

    const loadDropdowns = async () => {
    try {
        const data = await getItemDropdowns();

        setDropdowns(data);
    } catch (error) {
        console.error(error);
    }
    };

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
    setFormData(initialForm);
    setIsEditing(true);
  };

  const handleClear = () => {
    setFormData(initialForm);
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
    const response = await createItem(formData);

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

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h1 className="text-xl font-semibold">
          Item File
        </h1>

        <p className="text-sm text-slate-500">
          Basic Item Information
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border p-2 mb-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-50 border text-blue-600 font-medium">
            General
          </button>

          <button className="px-4 py-2 text-slate-500">
            Unit & Barcode
          </button>

          <button className="px-4 py-2 text-slate-500">
            Price List
          </button>

          <button className="px-4 py-2 text-slate-500">
            Photo
          </button>
        </div>
      </div>

        <Alert
        type={message.type}
        message={message.text}
        onClose={() =>
            setMessage({
            type: "",
            text: "",
            })
        }
        />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">
              Create Inventory Item
            </h2>
          </div>

          <fieldset
            disabled={!isEditing}
            className="p-6 space-y-6"
          >
            {/* Basic Information */}
            <section className="border rounded-lg">
              <div className="border-b bg-slate-50 px-4 py-3 font-medium">
                Basic Information
              </div>

              <div className="p-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm mb-1">
                    Item Code
                  </label>

                  <input
                    ref={firstInputRef}
                    type="text"
                    name="item_code"
                    value={formData.item_code}
                    onChange={handleChange}
                    placeholder="Enter item code"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Name 1 *
                  </label>

                  <input
                    type="text"
                    name="name_1"
                    value={formData.name_1}
                    onChange={handleChange}
                    placeholder="Enter name 1"
                    className="w-full border rounded px-3 py-2"
                  />
                {errors.name_1 && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.name_1}
                </p>
                )}
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Name 2
                  </label>

                  <input
                    type="text"
                    name="name_2"
                    value={formData.name_2}
                    onChange={handleChange}
                    placeholder="Enter name 2"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-12 md:col-span-2 flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Edit Name
                  </label>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="border rounded-lg">
              <div className="border-b bg-slate-50 px-4 py-3 font-medium">
                Additional Information
              </div>

              <div className="p-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm mb-1">
                    Generic Name
                  </label>

                  <input
                    type="text"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleChange}
                    placeholder="Enter generic name"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section className="border rounded-lg">
              <div className="border-b bg-slate-50 px-4 py-3 font-medium">
                Configuration
              </div>

              <div className="p-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm mb-1">
                    Behaviour *
                  </label>

                  <select
                    name="behaviour"
                    value={formData.behaviour}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                        Select behaviour
                    </option>
                    {dropdowns.behaviours.map((option) => (
                        <option
                        key={option.value}
                        value={option.value}
                        >
                        {option.label}
                        </option>
                    ))}
                  </select>
                    {errors.behaviour && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.behaviour}
                    </p>
                    )}
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Group Code *
                  </label>

                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                      Select Group
                    </option>
                    {dropdowns.groups.map((group) => (
                        <option
                        key={group.id}
                        value={group.id}
                        >
                        {group.name}
                        </option>
                    ))}
                  </select>
                    {errors.behaviour && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.behaviour}
                    </p>
                    )}
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Status *
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    {dropdowns.statuses.map((status) => (
                        <option
                        key={status.value}
                        value={status.value}
                        >
                        {status.label}
                        </option>
                    ))}
                  </select>
                    {errors.status && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.status}
                    </p>
                    )}
                </div>

                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm mb-1">
                    Taxable Status *
                  </label>

                  <select
                    name="taxable_status"
                    value={formData.taxable_status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                        Select Taxable Status
                    </option>
                    {dropdowns.taxable_statuses.map((status) => (
                        <option
                        key={status.value}
                        value={status.value}
                        >
                        {status.label}
                        </option>
                    ))}
                  </select>
                    {errors.taxable_status && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.taxable_status}
                    </p>
                    )}
                </div>

                <div className="col-span-12 md:col-span-2">
                  <label className="block text-sm mb-1">
                    Shelf Code
                  </label>

                  <select
                    name="shelf"
                    value={formData.shelf}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >

                    <option value="">
                        Select Shelf
                    </option>
                    {dropdowns.shelves.map((shelf) => (
                        <option
                        key={shelf.id}
                        value={shelf.id}
                        >
                        {shelf.name}
                        </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm mb-1">
                    Manufacturer
                  </label>

                  <select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">
                      Select Manufacturer
                    </option>
                        {dropdowns.manufacturers.map(
                            (manufacturer) => (
                            <option
                                key={manufacturer.id}
                                value={manufacturer.id}
                            >
                                {manufacturer.name}
                            </option>
                            )
                        )}
                  </select>
                </div>
              </div>
            </section>
          </fieldset>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 border-t bg-slate-50 p-4">
            <button
              type="button"
              onClick={handleNew}
              className="px-6 py-2 rounded bg-emerald-500 text-white"
            >
              New
            </button>

            <button
              type="button"
              className="px-6 py-2 rounded bg-violet-500 text-white"
            >
              List
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 rounded bg-slate-500 text-white"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={!isEditing}
              className="px-6 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}