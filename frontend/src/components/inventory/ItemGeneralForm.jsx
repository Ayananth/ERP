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
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Create Inventory Item
            </h2>
          </div>

          <fieldset
            disabled={!isEditing}
            className="space-y-6 p-6"
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

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-[#f8fafc] p-4">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="min-w-[84px] rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
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
