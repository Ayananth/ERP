export default function ItemGeneralBasicSection({
  errors,
  firstInputRef,
  formData,
  onChange,
}) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
  );
}
