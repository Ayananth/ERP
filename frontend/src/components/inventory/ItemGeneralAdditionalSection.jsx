export default function ItemGeneralAdditionalSection({
  formData,
  onChange,
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        Additional Information
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Generic Name
          </label>

          <input
            type="text"
            name="generic_name"
            value={formData.generic_name}
            onChange={onChange}
            placeholder="Enter generic name"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Enter description"
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
          />
        </div>
      </div>
    </section>
  );
}
