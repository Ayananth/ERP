export default function ItemGeneralConfigurationSection({
  dropdowns,
  errors,
  formData,
  onChange,
}) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
          {errors.group && (
            <p className="mt-1 text-sm text-red-600">
              {errors.group}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">
              Select Manufacturer
            </option>
            {dropdowns.manufacturers.map((manufacturer) => (
              <option
                key={manufacturer.id}
                value={manufacturer.id}
              >
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
