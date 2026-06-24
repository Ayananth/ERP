import Alert from "../common/Alert";
import ItemGeneralBasicSection from "./ItemGeneralBasicSection";
import ItemGeneralAdditionalSection from "./ItemGeneralAdditionalSection";
import ItemGeneralConfigurationSection from "./ItemGeneralConfigurationSection";

export default function ItemGeneralForm({
  dropdowns,
  errors,
  firstInputRef,
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
  const primaryLabel = isEditing
    ? viewState === "viewExisting"
      ? "Update"
      : "Save"
    : viewState === "viewExisting"
    ? "Edit"
    : "New";

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
            <ItemGeneralBasicSection
              errors={errors}
              firstInputRef={firstInputRef}
              formData={formData}
              onChange={handleChange}
            />

            <ItemGeneralAdditionalSection
              formData={formData}
              onChange={handleChange}
            />

            <ItemGeneralConfigurationSection
              dropdowns={dropdowns}
              errors={errors}
              formData={formData}
              onChange={handleChange}
            />
          </fieldset>

          <div className="flex justify-end gap-3 border-t bg-slate-50 p-4">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="px-6 py-2 rounded bg-emerald-500 text-white"
            >
              {primaryLabel}
            </button>

            <button
              type="button"
              onClick={handleList}
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

          </div>
        </div>
      </form>
    </>
  );
}
