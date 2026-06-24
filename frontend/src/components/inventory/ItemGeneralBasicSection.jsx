export default function ItemGeneralBasicSection({
  errors,
  firstInputRef,
  formData,
  onChange,
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        Basic Information
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Item Code
          </label>

          <input
            ref={firstInputRef}
            type="text"
            name="item_code"
            value={formData.item_code}
            onChange={onChange}
            placeholder="Enter item code"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name 1 *
          </label>

          <input
            type="text"
            name="name_1"
            value={formData.name_1}
            onChange={onChange}
            placeholder="Enter name 1"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
          />
          {errors.name_1 && (
            <p className="mt-1 text-xs text-red-600">
              {errors.name_1}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name 2
          </label>

          <input
            type="text"
            name="name_2"
            value={formData.name_2}
            onChange={onChange}
            placeholder="Enter name 2"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
          />
        </div>

        <div className="col-span-12 flex items-end md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" />
            Edit Name
          </label>
        </div>
      </div>
    </section>
  );
}
