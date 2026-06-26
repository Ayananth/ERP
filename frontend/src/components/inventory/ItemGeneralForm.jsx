import { useRef } from "react";

import Alert from "../common/Alert";
import { SALES_FOCUS_BUTTON } from "../sales/salesFocusStyles";
import ItemGeneralBasicSection from "./ItemGeneralBasicSection";
import ItemGeneralAdditionalSection from "./ItemGeneralAdditionalSection";
import ItemGeneralConfigurationSection from "./ItemGeneralConfigurationSection";

export default function ItemGeneralForm({
  dropdowns,
  errors,
  firstInputRef,
  primaryButtonRef,
  formData,
  isEditing,
  handleChange,
  handleClear,
  handleNew,
  handleList,
  handlePrimaryAction,
  handleSubmit,
  viewState,
  message,
  setMessage,
}) {
  const formRefs = useRef([]);

  const primaryLabel = isEditing
    ? viewState === "viewExisting"
      ? "Update"
      : "Save"
    : viewState === "viewExisting"
    ? "Edit"
    : "New";

  const registerField = (index) => (element) => {
    formRefs.current[index] = element;
    if (index === 0 && firstInputRef) {
      firstInputRef.current = element;
    }
  };

  const handleFieldEnter = (event, index) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const nextField = formRefs.current[index + 1];
    if (nextField) {
      nextField.focus();
    }
  };

  const openSelectPicker = (selectElement) => {
    if (typeof selectElement?.showPicker === "function") {
      selectElement.showPicker();
      return;
    }

    selectElement?.focus();
    selectElement?.click();
  };

  const handleSelectKeyDown = (event, index) => {
    if (event.ctrlKey && event.key === "Enter") {
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      return;
    }

    if (
      event.key === " " ||
      event.key === "F4" ||
      (event.key === "ArrowDown" && event.altKey)
    ) {
      event.preventDefault();
      openSelectPicker(event.currentTarget);
      return;
    }

    handleFieldEnter(event, index);
  };

  const handleFormKeyDown = (event) => {
    if (!isEditing || !event.ctrlKey || event.key !== "Enter") return;

    event.preventDefault();
    event.stopPropagation();
    primaryButtonRef?.current?.focus();
  };

  return (
    <>
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

      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Create Inventory Item
            </h2>
          </div>

          <fieldset
            disabled={!isEditing}
            onKeyDown={handleFormKeyDown}
            className="space-y-6 p-6"
          >
            <ItemGeneralBasicSection
              errors={errors}
              formData={formData}
              handleFieldEnter={handleFieldEnter}
              onChange={handleChange}
              registerField={registerField}
            />

            <ItemGeneralAdditionalSection
              formData={formData}
              handleFieldEnter={handleFieldEnter}
              onChange={handleChange}
              registerField={registerField}
            />

            <ItemGeneralConfigurationSection
              dropdowns={dropdowns}
              errors={errors}
              formData={formData}
              handleSelectKeyDown={handleSelectKeyDown}
              onChange={handleChange}
              registerField={registerField}
            />
          </fieldset>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-[#f8fafc] p-4">
            <button
              type="button"
              ref={primaryButtonRef}
              onClick={isEditing ? () => handleSubmit() : handlePrimaryAction}
              className={`min-w-[84px] rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 ${SALES_FOCUS_BUTTON}`}
            >
              {primaryLabel}
            </button>

            <button
              type="button"
              onClick={handleList}
              className="min-w-[84px] rounded-md bg-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-600"
            >
              List
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="min-w-[84px] rounded-md bg-slate-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600"
            >
              Clear
            </button>

          </div>
        </div>
      </form>
    </>
  );
}
