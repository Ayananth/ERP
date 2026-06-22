export default function ItemGeneralAdditionalSection({
  formData,
  onChange,
}) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Enter description"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </section>
  );
}
